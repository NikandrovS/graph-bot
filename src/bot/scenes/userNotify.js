import coinSceneKeyboard from "../keyboards/coinSceneEnter.js";
import text from "../handlers/translatedText.js";
import { knex } from "../../models/index.js";
import { Scenes } from "telegraf";

const notifyForBalanceChange = new Scenes.BaseScene("notifyForBalanceChange");

notifyForBalanceChange.enter(async (ctx) => {
  const countOfSubscriptions = knex({ l: "listeners" })
    .count("*")
    .where({ user_id: ctx.update.message.from.id, listener: "user-balance-change" });

  const user = await knex("users")
    .select("*", knex.raw(`(${countOfSubscriptions}) as count`))
    .leftJoin("listeners as l", function () {
      this.on("l.user_id", "=", "users.id").andOn(`l.listener`, "=", knex.raw("?", "user-balance-change"));
    })
    .where({ id: ctx.update.message.from.id })
    .first();

  if (!user) return ctx.reply("Use /start");

  const { message_id } = await ctx.reply(
    text(ctx, "yourNotifications", { count: user.count }),
    coinSceneKeyboard(text(ctx, "newNotification"), text(ctx, "editList"), text(ctx, "keyboardCancel"), user.count)
  );

  ctx.scene.state.welcomeMessage = message_id;
});

notifyForBalanceChange.action("addSubscription", async (ctx) => ctx.scene.enter("checkForSubscriptionUserScene"));
notifyForBalanceChange.action("viewSubscriptions", async (ctx) => ctx.scene.enter("editUserBalanceNotify"));

notifyForBalanceChange.action("cancel", (ctx) => ctx.scene.leave());
notifyForBalanceChange.leave((ctx) => ctx.deleteMessage(ctx.scene.state.welcomeMessage).catch((e) => console.log(e.message)));

export default notifyForBalanceChange;
