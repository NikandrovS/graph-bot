import dotenv from "dotenv";
dotenv.config();

const app = {
  mainDB: process.env.MYSQL_DATABASE || "main_chart_bot",
  botToken: process.env.BOT_TOKEN,
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
  messageQueue: 'messages'
};

export default {
  ...app,
  rabbit,
  mysql,
};
