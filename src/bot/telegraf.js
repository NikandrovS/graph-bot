import { Telegraf, session, Scenes } from "telegraf";
import start from "./handlers/start.js";
import config from "../config/index.js";

import checkForSubscriptionTokenScene from "./scenes/tokenNotifySubscription.js";
import checkForSubscription from "./scenes/checkForSubscription.js";
import notifyForCoinsChange from "./scenes/notifyForCoinsChange.js";
import subscriptionScene from "./scenes/subscriptionScene.js";
import notifyForNewBoard from "./scenes/notifyForNewBoard.js";
import editCoinsNotifies from "./scenes/coinsNotifyList.js";
import tokenNotifyEdit from "./scenes/tokenNotifyEdit.js";
import newCoinNotify from "./scenes/addNewCoinNotify.js";
import newTokenNotify from "./scenes/tokenNotifyNew.js";
import getPeriodScene from "./scenes/getPeriod.js";
import tokenNotify from "./scenes/tokenNotify.js";
import tokenPrice from "./scenes/tokenPrice.js";
import chartScene from "./scenes/getChart.js";

const stage = new Scenes.Stage([
  checkForSubscriptionTokenScene,
  checkForSubscription,
  notifyForCoinsChange,
  subscriptionScene,
  notifyForNewBoard,
  editCoinsNotifies,
  tokenNotifyEdit,
  getPeriodScene,
  newTokenNotify,
  newCoinNotify,
  tokenNotify,
  tokenPrice,
  chartScene,
]);

const bot = new Telegraf(config.botToken);
bot.use(session(), stage.middleware());

bot.command("/start", start);
bot.command("/chart", (ctx) => ctx.scene.enter("checkForSubscription"));
bot.command("/subscription", (ctx) => ctx.scene.enter("subscriptionScene"));
bot.command("/board_notify", (ctx) => ctx.scene.enter("notifyForNewBoard"));
bot.command("/coin_notify", (ctx) => ctx.scene.enter("notifyForCoinsChange"));
bot.command("/token_price", (ctx) => ctx.scene.enter("currentTokenPrice"));
bot.command("/token_notify", (ctx) => ctx.scene.enter("notifyForTokensChange"));

export default bot.launch();
