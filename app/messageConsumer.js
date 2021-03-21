#!/usr/bin/env node

const amqp = require('amqplib');
const { BAD_LETTER_QUEUE } = require('./constants');
const { getDAUCollection } = require('./DUO');

function buildInitialMessage(validateList, valuesList) {
  const valueMap = [];
  for (let i = 0; i < validateList.length; i++) {
    const key = validateList[i][0];
    valueMap.push([key, valuesList[i]]);
  }
  return valueMap;
}

function validateMessage(validateList, valueList) {
  const filterResult = [];
  valueList.forEach(([key, value], index) => {
    const validator = validateList[index][1];
    filterResult.push([key, validator(value)]);
  });
  return filterResult;
}

function getInvalidKeys(validationList) {
  return validationList.reduce((result, [key, value]) => {
    if (!value) {
      result.push(key);
    }
    return result;
  }, []);
}

function validateFields(fileFields, fields) {
  const result = [];
  for (let i = 0; i < fileFields.length; i++) {
    const isValid = fields[i] === fileFields[i][0];
    if (!isValid) {
      result.push(fields[i]);
    }
  }
  return result;
}

async function sendDeadLetterToQueue(channel, incomeData) {
  const message = Buffer.from(incomeData.join(','));
  return channel.sendToQueue(BAD_LETTER_QUEUE, message, {
    persistent: true,
  });
}

async function runConsumer(queue, validateList, mapInitialMessageToDataObject, indexes) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const collection = await getDAUCollection(queue, indexes);

  await channel.assertQueue(BAD_LETTER_QUEUE, {
    durable: true,
  });
  await channel.assertQueue(queue, {
    durable: true,
  });
  channel.consume(queue, async (msg) => {
    const payload = msg.content.toString();
    const [lineNumber, ...payloadList] = payload.split(',');
    if (parseInt(lineNumber, 10) === 0) {
      const invalidKeys = validateFields(validateList, payloadList);
      if (invalidKeys.length) {
        invalidKeys.unshift(['Wrong fields name', lineNumber, queue]);
        await sendDeadLetterToQueue(channel, invalidKeys);
      }
    } else {
      const initialMessage = buildInitialMessage(validateList, payloadList);
      const validList = validateMessage(validateList, initialMessage);
      const invalidKeys = getInvalidKeys(validList);

      if (invalidKeys.length === 0) {
        const mappedObject = mapInitialMessageToDataObject(Object.fromEntries(initialMessage));
        try {
          await collection.insertOne(mappedObject);
        } catch (error) {
          if (error.code === 11000) {
            await sendDeadLetterToQueue(channel, ['Duplicated Line', lineNumber, queue, error.message]);
          } else {
            await sendDeadLetterToQueue(channel, ['Unknown Error', lineNumber, queue, error.code]);
          }
        }
      } else {
        await sendDeadLetterToQueue(channel, ['Wrong fields validation', lineNumber, queue]);
      }
    }
    channel.ack(msg);
  });
}

module.exports = {
  runConsumer,
};
