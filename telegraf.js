import start from "./src/bot/handlers/start.js";

import { Telegraf, session, Scenes } from "telegraf";

import dotenv from "dotenv";
dotenv.config();

import chartScene from "./src/bot/scenes/getChart.js";
import getPeriodScene from "./src/bot/scenes/getPeriod.js";
import checkForSubscription from "./src/bot/scenes/checkForSubscription.js";
import subscriptionScene from "./src/bot/scenes/subscriptionScene.js";
import notifyForNewBoard from "./src/bot/scenes/notifyForNewBoard.js";

const stage = new Scenes.Stage([chartScene, getPeriodScene, checkForSubscription, subscriptionScene, notifyForNewBoard]);

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session(), stage.middleware());

bot.command("/start", start);
bot.command("/chart", (ctx) => ctx.scene.enter("checkForSubscription"));
bot.command("/subscription", (ctx) => ctx.scene.enter("subscriptionScene"));
bot.command("/notify_board", (ctx) => ctx.scene.enter("notifyForNewBoard"));

export default bot.launch();
