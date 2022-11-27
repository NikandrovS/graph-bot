import text from "../handlers/translatedText.js";
import { knex } from "../../models/index.js";
import config from "../../config/index.js";
import { Scenes } from "telegraf";

const checkForSubscriptionUserScene = new Scenes.BaseScene("checkForSubscriptionUserScene");

checkForSubscriptionUserScene.enter(async (ctx) => {
  const countOfSubscriptions = knex({ l: "listeners" })
    .count("*")
    .where({ user_id: ctx.callbackQuery.from.id, listener: "user-balance-change" });

  const user = await knex("users")
    .select("*", knex.raw(`(${countOfSubscriptions}) as count`))
    .leftJoin("listeners as l", function () {
      this.on("l.user_id", "=", "users.id").andOn(`l.listener`, "=", knex.raw("?", "user-balance-change"));
    })
    .where({ id: ctx.callbackQuery.from.id })
    .first();

  if (!user) return ctx.reply("Use /start");

  if (user.count >= config.freeBalanceNotifications && new Date() > user.subscription_period) {
    await ctx.reply(text(ctx, "expiredTrialBalance", { count: config.freeBalanceNotifications }));
    return ctx.scene.leave();
  }

  ctx.scene.enter("newUserBalanceNotify");
});

export default checkForSubscriptionUserScene;
