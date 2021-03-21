const amqp = require('amqplib');
const path = require('path');

const { AMPQ_HOST, BAD_LETTER_QUEUE } = require('./constants');
const { csvReadStream } = require('./csv');
const { getArgv } = require('./utils');

async function main() {
  const argv = getArgv();
  const startLine = argv.start || 0;
  const endLine = argv.end || 0;
  const queue = argv.queue || 'data_transfer_queue_2';
  const fileName = argv.fileName || 'hospital_1_Patient';

  const fullFileName = path.join(`${fileName}.csv`);

  const connection = await amqp.connect(AMPQ_HOST);
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, {
    durable: true,
  });
  await channel.assertQueue(BAD_LETTER_QUEUE, {
    durable: true,
  });

  function onReadData(row) {
    const message = Buffer.from(row.join(','));
    channel.sendToQueue(queue, message, {
      persistent: true,
    });
  }

  function onReadEnd() {
    channel.checkQueue(queue).then(() => {
      connection.close();
      process.exit(0);
    });
  }

  function onError(error) {
    const message = ['ParseError', error.index, queue, error.code];
    channel.sendToQueue(BAD_LETTER_QUEUE, Buffer.from(message.join(',')), {
      persistent: true,
    });
    channel.checkQueue(BAD_LETTER_QUEUE).then(() => {
      connection.close();
      process.exit(0);
    });
  }

  csvReadStream(fullFileName, startLine, endLine, onReadData, onReadEnd, onError);
}

(async () => {
  try {
    await main();
  } catch (e) {
    // Deal with the fact the chain failed
  }
})();
