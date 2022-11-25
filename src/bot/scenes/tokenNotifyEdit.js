import editTokensNotifies from "../keyboards/editTokensNotifies.js";
import text from "../handlers/translatedText.js";
import { knex } from "../../models/index.js";
import { Scenes } from "telegraf";

const editTokenNotifiers = new Scenes.BaseScene("editTokenNotifiers");

editTokenNotifiers.enter(async (ctx) => {
  ctx.scene.state.notifications = await knex("listeners")
    .where({ listener: "token-price-change", user_id: ctx.update.callback_query.from.id })
    .leftJoin("boards", "boards.id", "listeners.board_id");

  const { message_id } = await ctx.reply(
    text(ctx, "activeNotifiactions"),
    editTokensNotifies(ctx.scene.state.notifications, text(ctx, "keyboardCancel"))
  );

  ctx.scene.state.welcomeMessage = message_id;
});

editTokenNotifiers.action(/^removeValue:.*/, async (ctx) => {
  const value = ctx.callbackQuery.data.split(":")[1];

  await knex("listeners").where({ user_id: ctx.callbackQuery.from.id, listener: "token-price-change", value }).del();

  ctx.scene.state.notifications = ctx.scene.state.notifications.filter((n) => n.value !== value);

  ctx.editMessageText(text(ctx, "activeNotifiactions"), editTokensNotifies(ctx.scene.state.notifications, text(ctx, "keyboardCancel")));
});

editTokenNotifiers.action("cancel", (ctx) => ctx.scene.leave());
editTokenNotifiers.leave((ctx) => ctx.deleteMessage(ctx.scene.state.welcomeMessage).catch((e) => console.log(e.message)));

export default editTokenNotifiers;
