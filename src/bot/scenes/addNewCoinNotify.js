import previousRequests from "../keyboards/previousRequests.js";
import text from "../handlers/translatedText.js";
import { knex } from "../../models/index.js";
import { Scenes } from "telegraf";

const newCoinNotify = new Scenes.BaseScene("newCoinNotify");

newCoinNotify.enter(async (ctx) => {
  ctx.scene.state.userId = ctx.update.callback_query.from.id;

  const requestHistory = await knex("board_requests")
    .select("board_id", "url")
    .where({ user_id: ctx.scene.state.userId })
    .groupBy("board_id", "url")
    .orderByRaw("max(id) desc")
    .limit(4);

  const { message_id } = await ctx.reply(text(ctx, "boardTitleInput"), previousRequests(requestHistory, text(ctx, "keyboardCancel")));

  ctx.scene.state.welcomeMessage = message_id;
});

newCoinNotify.action(/^boardId:.*/, async (ctx) => {
  const id = ctx.callbackQuery.data.split(":")[1];

  const board = await knex("boards").where({ id }).first();

  const isExists = await knex("listeners")
    .where({ user_id: ctx.scene.state.userId, listener: "coin-price-change", board_id: board.id })
    .first();

  if (!isExists) await knex("listeners").insert({ user_id: ctx.scene.state.userId, listener: "coin-price-change", board_id: board.id });

  await ctx.reply(text(ctx, "coinNotificationWasAdded", { boardName: board.url }));

  return ctx.scene.leave();
});

newCoinNotify.on("text", async (ctx) => {
  try {
    const query = ctx.message.text.split("b/");
    const boardName = query[1] || query[0];

    const board = await knex("boards").where({ url: boardName.toLowerCase() }).first();

    if (!board) return await ctx.reply(text(ctx, "boardNotFound"));

    const isExists = await knex("listeners")
      .where({ user_id: ctx.message.from.id, listener: "coin-price-change", board_id: board.id })
      .first();

    if (!isExists) await knex("listeners").insert({ user_id: ctx.message.from.id, listener: "coin-price-change", board_id: board.id });

    await ctx.reply(text(ctx, "coinNotificationWasAdded", { boardName: board.url }));

    return ctx.scene.leave();
  } catch (error) {
    console.log(ctx.session.__scenes.current + "_scene_ERROR:" + (error.message || error));
  }
});

newCoinNotify.action("cancel", (ctx) => ctx.scene.leave());
newCoinNotify.leave((ctx) => ctx.deleteMessage(ctx.scene.state.welcomeMessage).catch((e) => console.log(e.message)));

export default newCoinNotify;
