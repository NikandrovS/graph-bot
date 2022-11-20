import coinSceneKeyboard from "../keyboards/coinSceneEnter.js";
import text from "../handlers/translatedText.js";
import { knex } from "../../models/index.js";
import { Scenes } from "telegraf";

const notifyForCoinsChange = new Scenes.BaseScene("notifyForCoinsChange");

notifyForCoinsChange.enter(async (ctx) => {
  const countOfSubscriptions = knex({ l: "listeners" })
    .count("*")
    .where({ user_id: ctx.update.message.from.id, listener: "coin-price-change" });

  const [user] = await knex("users")
    .select("*", knex.raw(`(${countOfSubscriptions}) as count`))
    .leftJoin("listeners as l", function () {
      this.on("l.user_id", "=", "users.id").andOn(`l.listener`, "=", knex.raw("?", "coin-price-change"));
    })
    .where({ id: ctx.update.message.from.id });

  if (!user) return ctx.reply("Use /start");

  const { message_id } = await ctx.reply(
    text(ctx, "activeNotifiactionsCount", { count: user.count }),
    coinSceneKeyboard(text(ctx, "newNotification"), text(ctx, "editList"), text(ctx, "keyboardCancel"), user.count)
  );

  ctx.scene.state.welcomeMessage = message_id;
});

notifyForCoinsChange.action("addSubscription", async (ctx) => ctx.scene.enter("newCoinNotify"));
notifyForCoinsChange.action("viewSubscriptions", async (ctx) => ctx.scene.enter("editCoinNotifiers"));

notifyForCoinsChange.action("cancel", (ctx) => ctx.scene.leave());
notifyForCoinsChange.leave((ctx) => ctx.deleteMessage(ctx.scene.state.welcomeMessage).catch((e) => console.log(e.message)));

export default notifyForCoinsChange;
