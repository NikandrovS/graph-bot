import editCoinsNotifies from "../keyboards/editCoinsNotifies.js";
import text from "../handlers/translatedText.js";
import { knex } from "../../models/index.js";
import { Scenes } from "telegraf";

const editCoinNotifiers = new Scenes.BaseScene("editCoinNotifiers");

editCoinNotifiers.enter(async (ctx) => {
  const activeBoards = await knex("listeners")
    .where({ listener: "coin-price-change", user_id: ctx.update.callback_query.from.id })
    .leftJoin("boards", "boards.id", "listeners.board_id");

  const { message_id } = await ctx.reply(text(ctx, "activeNotifiactions"), editCoinsNotifies(activeBoards, text(ctx, "keyboardCancel")));

  ctx.scene.state.welcomeMessage = message_id;
});

editCoinNotifiers.action(/^removeId:.*/, async (ctx) => {
  const id = ctx.callbackQuery.data.split(":")[1];

  await knex("listeners").where({ user_id: ctx.callbackQuery.from.id, listener: "coin-price-change", board_id: id }).del();

  await ctx.reply(text(ctx, "settingsUpdate"));

  return ctx.scene.leave();
});

editCoinNotifiers.action("cancel", (ctx) => ctx.scene.leave());
editCoinNotifiers.leave((ctx) => ctx.deleteMessage(ctx.scene.state.welcomeMessage).catch((e) => console.log(e.message)));

export default editCoinNotifiers;
