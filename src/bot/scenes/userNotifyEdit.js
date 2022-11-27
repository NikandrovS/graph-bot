import editUsersNotifies from "../keyboards/editUsersNotifies.js";
import text from "../handlers/translatedText.js";
import { knex } from "../../models/index.js";
import { Scenes } from "telegraf";

const editUserBalanceNotify = new Scenes.BaseScene("editUserBalanceNotify");

editUserBalanceNotify.enter(async (ctx) => {
  ctx.scene.state.notifications = await knex("listeners")
    .where({ listener: "user-balance-change", user_id: ctx.update.callback_query.from.id })
    .leftJoin("users_wallets", "users_wallets.id", "listeners.value");

  const { message_id } = await ctx.reply(
    text(ctx, "activeNotifiactions"),
    editUsersNotifies(ctx.scene.state.notifications, text(ctx, "keyboardCancel"))
  );

  ctx.scene.state.welcomeMessage = message_id;
});

editUserBalanceNotify.action(/^removeValue:.*/, async (ctx) => {
  const value = ctx.callbackQuery.data.split(":")[1];

  await knex("listeners").where({ user_id: ctx.callbackQuery.from.id, listener: "user-balance-change", value }).del();

  ctx.scene.state.notifications = ctx.scene.state.notifications.filter((n) => n.value !== value);

  if (!ctx.scene.state.notifications.length) return ctx.scene.leave();

  ctx.editMessageText(text(ctx, "activeNotifiactions"), editUsersNotifies(ctx.scene.state.notifications, text(ctx, "keyboardCancel")));
});

editUserBalanceNotify.action("cancel", (ctx) => ctx.scene.leave());
editUserBalanceNotify.leave((ctx) => ctx.deleteMessage(ctx.scene.state.welcomeMessage).catch((e) => console.log(e.message)));

export default editUserBalanceNotify;
