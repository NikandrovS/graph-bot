import dotenv from "dotenv";
dotenv.config();

const app = {
  mainDB: process.env.MYSQL_DATABASE || "main_chart_bot",
  dexGuruToken: process.env.DEX_GURU_API_KEY,
  moralisToken: process.env.MORALIS_API_KEY,
  cmcToken: process.env.CMC_API_KEY,
  botToken: process.env.BOT_TOKEN,
  freeBalanceNotifications: 1,
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
  usdtAddress: "0x55d398326f99059fF775485246999027B3197955",
  address: "0xa5f249f401ba8931899a364d8e2699b5fa1d87a9",
  cmcMainId: "19764",
  multiplier: 1000,
  chain: "bsc",
};

const periods = {
  day: 1,
  week: 7,
  month: 30,
  quarter: 90,
};

export default {
  ...app,
  periods,
  rabbit,
  token,
  mysql,
};
