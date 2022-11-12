import text from "../handlers/translatedText.js";
import { knex } from "../../models/index.js";
import config from "../../config/index.js";
import { Scenes } from "telegraf";

const checkForSubscription = new Scenes.BaseScene("checkForSubscription");

checkForSubscription.enter(async (ctx) => {
  const user = await knex("users").where({ id: ctx.update.message.from.id }).first();

  if (!user) return ctx.reply('Use /start')

  if (user.attempts >= config.freeAttempts && new Date() > user.subscription_period) {
    await ctx.reply(text(ctx, "expiredTrial"));
    return ctx.scene.leave();
  }

  ctx.scene.enter("chartScene");
});

export default checkForSubscription;
