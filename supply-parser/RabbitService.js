import config from "../src/config/index.js";
import amqp from "amqplib";

export class RabbitMQ {
  constructor() {
    this.client = null;
    this.channel = null;
  }

  async init() {
    this.client = await amqp.connect(config.rabbit.host);
    this.channel = await this.client.createChannel();

    this.channel.assertQueue("messages", { durable: true });

    return this.channel;
  }

  async send(payload) {
    try {
      if (!this.channel) await this.init();
      this.channel.sendToQueue("messages", Buffer.from(JSON.stringify(payload)));
    } catch (error) {
      console.log("send error", error);
    }
  }
}

export default new RabbitMQ();
