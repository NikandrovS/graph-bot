import cancelKeyboard from "../keyboards/cancel.js";
import text from "../handlers/translatedText.js";
import { knex } from "../../models/index.js";
import { Scenes } from "telegraf";

const newCoinNotify = new Scenes.BaseScene("newCoinNotify");

newCoinNotify.enter(async (ctx) => {
  const { message_id } = await ctx.reply(text(ctx, "boardTitleInput"), cancelKeyboard(text(ctx, "keyboardCancel")));

  ctx.scene.state.welcomeMessage = message_id;
});

newCoinNotify.on("text", async (ctx) => {
  try {
    const query = ctx.message.text.split("/b/");
    const boardName = query[1] || query[0];

    const board = await knex("boards").where({ url: boardName.toLowerCase() }).first();

    if (!board) return await ctx.reply(text(ctx, "boardNotFound"));

    const isExists = await knex("listeners")
      .where({ user_id: ctx.message.from.id, listener: "coin-price-change", value: board.id })
      .first();

    if (!isExists) await knex("listeners").insert({ user_id: ctx.message.from.id, listener: "coin-price-change", value: board.id });

    await ctx.reply(text(ctx, "coinNotificationWasAdded", { boardName: board.url }));

    return ctx.scene.leave();
  } catch (error) {
    console.log(ctx.session.__scenes.current + "_scene_ERROR:" + (error.message || error));
  }
});

newCoinNotify.action("cancel", (ctx) => ctx.scene.leave());
newCoinNotify.leave((ctx) => ctx.deleteMessage(ctx.scene.state.welcomeMessage).catch((e) => console.log(e.message)));

export default newCoinNotify;
