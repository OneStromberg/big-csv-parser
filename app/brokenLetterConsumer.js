const amqp = require('amqplib');
const { BAD_LETTER_QUEUE } = require('./constants');
const { getDAUCollection } = require('./DUO');

async function main() {
  const connection = await amqp.connect('amqp://localhost');

  const channel = await connection.createChannel();
  const collection = await getDAUCollection(BAD_LETTER_QUEUE);
  const q = await channel.assertQueue(BAD_LETTER_QUEUE, {
    durable: true,
  });
  channel.consume(q.queue, (msg) => {
    const payload = msg.content.toString();
    const [reason, line, queue, ...message] = payload.split(',');
    collection.insertOne({
      reason,
      line,
      queue,
      message: message.join(','),
    });
    channel.ack(msg);
  });
}

(async () => {
  try {
    await main();
  } catch (e) {
    // Deal with the fact the chain failed
  }
})();
