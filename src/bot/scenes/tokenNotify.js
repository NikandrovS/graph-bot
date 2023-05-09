import coinSceneKeyboard from "../keyboards/coinSceneEnter.js";
import text from "../handlers/translatedText.js";
import { knex } from "../../models/index.js";
import { Scenes } from "telegraf";

const notifyForTokensChange = new Scenes.BaseScene("notifyForTokensChange");

notifyForTokensChange.enter(async (ctx) => {
  const userId = ctx.update.message ? ctx.update.message.from.id : ctx.update.callback_query.from.id;

  const countOfSubscriptions = knex({ l: "listeners" }).count("*").where({
    user_id: userId,
    listener: "token-price-change",
  });

  const user = await knex("users")
    .select("*", knex.raw(`(${countOfSubscriptions}) as count`))
    .leftJoin("listeners as l", function () {
      this.on("l.user_id", "=", "users.id").andOn(`l.listener`, "=", knex.raw("?", "token-price-change"));
    })
    .where({ id: userId })
    .first();

  if (!user) return ctx.reply("Use /start");

  const { message_id } = await ctx.reply(
    text(ctx, "yourNotifications", { count: user.count }),
    coinSceneKeyboard(text(ctx, "newNotification"), text(ctx, "editList"), text(ctx, "keyboardCancel"), user.count)
  );

  ctx.scene.state.welcomeMessage = message_id;
});

notifyForTokensChange.action("addSubscription", async (ctx) => ctx.scene.enter("checkForSubscriptionTokenScene"));
notifyForTokensChange.action("viewSubscriptions", async (ctx) => ctx.scene.enter("editTokenNotifiers"));

notifyForTokensChange.action("cancel", (ctx) => ctx.scene.leave());
notifyForTokensChange.leave((ctx) => ctx.deleteMessage(ctx.scene.state.welcomeMessage).catch((e) => console.log(e.message)));

export default notifyForTokensChange;
