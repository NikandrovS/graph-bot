import sendNotifications from "../bot/handlers/sendNotifications.js";
import config from "../config/index.js";
import amqp from "amqplib";

const JSONparse = (string) => {
  try {
    return JSON.parse(string);
  } catch (error) {
    return null;
  }
};

export default (async () => {
  const client = await amqp.connect(config.rabbit.host);
  const ch = await client.createChannel();

  ch.assertQueue(config.rabbit.messageQueue, { durable: true });

  ch.consume(config.rabbit.messageQueue, (msg) => {
    const message = msg.content.toString();

    const { text, listener, value } = JSONparse(message);

    sendNotifications(text, listener, value);

    ch.ack(msg);
  });
})();
