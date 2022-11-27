import sendRangeNotifications from "../bot/handlers/sendRangeNotifications.js";
import sendNotifications from "../bot/handlers/sendNotifications.js";
import config from "../config/index.js";
import amqp from "amqplib";

const JSONparse = (string) => {
  try {
    return JSON.parse(string);
  } catch (error) {
    return {};
  }
};

export default (async () => {
  const client = await amqp.connect(config.rabbit.host);
  const ch = await client.createChannel();

  ch.assertQueue(config.rabbit.messageQueue, { durable: true });

  ch.consume(config.rabbit.messageQueue, async (msg) => {
    const message = msg.content.toString();

    const { text, listener, boardId, range, value } = JSONparse(message);

    if (range) {
      await sendRangeNotifications(text, listener, boardId, range);
    } else {
      await sendNotifications(text, listener, boardId, value);
    }

    ch.ack(msg);
  });
})();
