import { Telegraf, session, Scenes } from "telegraf";
import start from "./handlers/start.js";
import config from "../config/index.js";

import checkForSubscription from "./scenes/checkForSubscription.js";
import notifyForCoinsChange from "./scenes/notifyForCoinsChange.js";
import subscriptionScene from "./scenes/subscriptionScene.js";
import notifyForNewBoard from "./scenes/notifyForNewBoard.js";
import editCoinsNotifies from "./scenes/coinsNotifyList.js";
import newCoinNotify from "./scenes/addNewCoinNotify.js";
import getPeriodScene from "./scenes/getPeriod.js";
import chartScene from "./scenes/getChart.js";

const stage = new Scenes.Stage([
  checkForSubscription,
  notifyForCoinsChange,
  subscriptionScene,
  notifyForNewBoard,
  editCoinsNotifies,
  getPeriodScene,
  newCoinNotify,
  chartScene,
]);

const bot = new Telegraf(config.botToken);
bot.use(session(), stage.middleware());

bot.command("/start", start);
bot.command("/chart", (ctx) => ctx.scene.enter("checkForSubscription"));
bot.command("/subscription", (ctx) => ctx.scene.enter("subscriptionScene"));
bot.command("/board_notify", (ctx) => ctx.scene.enter("notifyForNewBoard"));
bot.command("/coin_notify", (ctx) => ctx.scene.enter("notifyForCoinsChange"));

export default bot.launch();
