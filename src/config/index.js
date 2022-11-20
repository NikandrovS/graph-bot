import dotenv from "dotenv";
dotenv.config();

const app = {
  mainDB: process.env.MYSQL_DATABASE || "main_chart_bot",
  moralisToken: process.env.MORALIS_API_KEY,
  botToken: process.env.BOT_TOKEN,
  freeTokenNotifications: 3,
  freeAttempts: 10,
};

const mysql = {
  host: process.env.MYSQL_HOST || "localhost",
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.NODE_ENV === "test" ? "root" : process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "my-password",
  multipleStatements: process.env.MYSQL_MULTIPLE_STATEMENTS === "true",
};

const rabbit = {
  host: process.env.RABBIT_HOST || "amqp://guest:guest@localhost",
  messageQueue: "messages",
};

const token = {
  address: "0xa5f249f401ba8931899a364d8e2699b5fa1d87a9",
  multiplier: 1000,
  chain: "bsc",
};

export default {
  ...app,
  rabbit,
  token,
  mysql,
};
