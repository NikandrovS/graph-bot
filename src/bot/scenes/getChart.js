import previousRequests from "../keyboards/previousRequests.js";
import text from "../handlers/translatedText.js";
import translations from "../translations.js";
import { knex } from "../../models/index.js";
import { Scenes } from "telegraf";

const chartScene = new Scenes.BaseScene("chartScene");

chartScene.enter(async (ctx) => {
  const lang = ctx.update.message.from.language_code;
  ctx.scene.state.lang = translations[lang] ? lang : translations.defaultLang;

  try {
    const requestHistory = await knex("board_requests")
      .select("board_id", "url")
      .where({ user_id: ctx.update.message.from.id })
      .groupBy("board_id", "url")
      .orderByRaw("max(id) desc")
      .limit(4);

    const { message_id } = await ctx.reply(
      translations[ctx.scene.state.lang].boardInput,
      previousRequests(requestHistory, translations[ctx.scene.state.lang].keyboardCancel)
    );

    ctx.scene.state.welcomeMessage = message_id;
  } catch (error) {
    console.log(error);
  }
});

chartScene.action(/^boardId:.*/, async (ctx) => {
  const id = ctx.callbackQuery.data.split(":")[1];

  const board = await knex("boards").where({ id }).first();

  return ctx.scene.enter("getPeriod", board);
});

chartScene.on("text", async (ctx) => {
  const query = ctx.message.text.toLowerCase().split("b/");

  const searchParam = /^0x[a-fA-F0-9]{40}$/.test(ctx.message.text) ? { address: ctx.message.text } : { url: query[1] || query[0] };

  const board = await knex("boards").where(searchParam).first();

  if (!board) {
    if (!ctx.scene.state.tries) ctx.scene.state.tries = 0;
    if (ctx.scene.state.tries >= 2) {
      ctx.reply(text(ctx, "tryLater"));
      return ctx.scene.leave();
    }

    ctx.scene.state.tries += 1;

    return ctx.reply(translations[ctx.scene.state.lang].boardNotFound);
  }

  return ctx.scene.enter("getPeriod", board);
});

chartScene.action("cancel", (ctx) => ctx.scene.leave());
chartScene.leave((ctx) => ctx.deleteMessage(ctx.scene.state.welcomeMessage).catch((e) => console.log(e.message)));

export default chartScene;
