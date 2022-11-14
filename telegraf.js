import { Telegraf, session, Scenes } from "telegraf";
import start from "./src/bot/handlers/start.js";
import config from "./src/config/index.js";

import checkForSubscription from "./src/bot/scenes/checkForSubscription.js";
import notifyForCoinsChange from "./src/bot/scenes/notifyForCoinsChange.js";
import subscriptionScene from "./src/bot/scenes/subscriptionScene.js";
import notifyForNewBoard from "./src/bot/scenes/notifyForNewBoard.js";
import editCoinsNotifies from "./src/bot/scenes/coinsNotifyList.js";
import newCoinNotify from "./src/bot/scenes/addNewCoinNotify.js";
import getPeriodScene from "./src/bot/scenes/getPeriod.js";
import chartScene from "./src/bot/scenes/getChart.js";

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
