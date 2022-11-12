import cancelKeyboard from "../keyboards/cancel.js";
import translations from "../translations.js";
import { knex } from "../../models/index.js";
import { Scenes } from "telegraf";

const chartScene = new Scenes.BaseScene("chartScene");

chartScene.enter(async (ctx) => {
  const lang = ctx.update.message.from.language_code;
  ctx.scene.state.lang = translations[lang] ? lang : translations.defaultLang;

  try {
    const { message_id } = await ctx.reply(
      translations[ctx.scene.state.lang].boardInput,
      cancelKeyboard(translations[ctx.scene.state.lang].keyboardCancel)
    );

    ctx.scene.state.welcomeMessage = message_id;
  } catch (error) {
    console.log(error);
  }
});

chartScene.on("text", async (ctx) => {
  const searchParam = /^0x[a-fA-F0-9]{40}$/.test(ctx.message.text) ? { address: ctx.message.text } : { url: ctx.message.text };

  const board = await knex("boards").where(searchParam).first();

  if (!board) return ctx.reply(translations[ctx.scene.state.lang].boardNotFound);

  return ctx.scene.enter("getPeriod", board);
});

chartScene.action("cancel", (ctx) => ctx.scene.leave());
chartScene.leave((ctx) => ctx.deleteMessage(ctx.scene.state.welcomeMessage).catch((e) => console.log(e.message)));

export default chartScene;
