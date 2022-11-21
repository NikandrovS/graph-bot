import text from "../handlers/translatedText.js";
import { knex } from "../../models/index.js";
import config from "../../config/index.js";
import { Scenes } from "telegraf";

const checkForSubscriptionTokenScene = new Scenes.BaseScene("checkForSubscriptionTokenScene");

checkForSubscriptionTokenScene.enter(async (ctx) => {
  const countOfSubscriptions = knex({ l: "listeners" })
    .count("*")
    .where({ user_id: ctx.callbackQuery.from.id, listener: "token-price-change" });

  const user = await knex("users")
    .select("*", knex.raw(`(${countOfSubscriptions}) as count`))
    .leftJoin("listeners as l", function () {
      this.on("l.user_id", "=", "users.id").andOn(`l.listener`, "=", knex.raw("?", "token-price-change"));
    })
    .where({ id: ctx.callbackQuery.from.id })
    .first();

  if (!user) return ctx.reply("Use /start");

  if (user.count >= config.freeTokenNotifications && new Date() > user.subscription_period) {
    await ctx.reply(text(ctx, "expiredTrialToken", { count: config.freeTokenNotifications }));
    return ctx.scene.leave();
  }

  ctx.scene.enter("newTokenNotify");
});

export default checkForSubscriptionTokenScene;
