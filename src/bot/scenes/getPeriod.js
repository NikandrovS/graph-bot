import rabbitService from "../../../supply-parser/RabbitService.js";
import handleChartRequest from "../vega/handleChartRequest.js";
import chartTypeKeyboard from "../keyboards/chartType.js";
import periodKeyboard from "../keyboards/period.js";
import text from "../handlers/translatedText.js";
import translations from "../translations.js";
import { knex } from "../../models/index.js";
import vegaGenerator from "../vega/vega.js";
import config from "../../config/index.js";
import { Scenes } from "telegraf";

const getPeriodScene = new Scenes.BaseScene("getPeriod");

getPeriodScene.enter(async (ctx) => {
  const dataObject = ctx.update.message ? "message" : "callback_query";
  const { id, language_code } = ctx.update[dataObject].from;

  ctx.scene.state.lang = translations[language_code] ? language_code : translations.defaultLang;
  ctx.scene.state.user = id;
  ctx.scene.state.types = {
    main: {
      title: "💛 MAIN",
      action: "main",
    },
    usdt: {
      title: "💚 USDT",
      action: "usdt",
    },
    mainHolders: {
      title: "💛 MAIN + Holders 💙",
      action: "mainHolders",
    },
    usdtHolders: {
      title: "💚 USDT + Holders 💙",
      action: "usdtHolders",
    },
  };

  try {
    const { message_id } = await ctx.reply(
      text(ctx, "pickChartType"),
      chartTypeKeyboard(ctx.scene.state.types, text(ctx, "keyboardCancel"))
    );

    ctx.scene.state.welcomeMessage = message_id;
  } catch (error) {
    console.log(error);
  }
});

getPeriodScene.action("back", async (ctx) => {
  try {
    await ctx.editMessageText(text(ctx, "pickChartType"), chartTypeKeyboard(ctx.scene.state.types, text(ctx, "keyboardCancel")));
  } catch (error) {
    console.log("📛" + ctx.session.__scenes.current + "_scene_ERROR:" + (error.message || error));
    await ctx.scene.leave();
  }
});

getPeriodScene.action(/^type:.*/, async (ctx) => {
  const type = ctx.callbackQuery.data.split(":")[1];

  ctx.scene.state.selectedType = type;

  try {
    await ctx.editMessageText(
      translations[ctx.scene.state.lang].chartPeriod.replace("<%= boardName %>", ctx.scene.state.title),
      periodKeyboard(translations[ctx.scene.state.lang].keyboardPeriod, ctx.scene.state.restrictions)
    );
  } catch (error) {
    console.log("📛" + ctx.session.__scenes.current + "_scene_ERROR:" + (error.message || error));
    ctx.scene.leave();
  }
});

getPeriodScene.action(/^daterange:.*/, async (ctx) => {
  const time = ctx.callbackQuery.data.split(":")[1];

  if (time === "locked") return ctx.reply(text(ctx, "lockedPeriod"));

  handleChartRequest({ ...ctx }, time, ctx.scene.state);

  try {
    await knex.raw("UPDATE users SET attempts = attempts + 1 WHERE id = ?", [ctx.scene.state.user]);

    await knex("board_requests").insert({ user_id: ctx.scene.state.user, url: ctx.scene.state.url, board_id: ctx.scene.state.id });
  } catch (error) {
    console.error("📛" + ctx.session.__scenes.current + "_scene_ERROR:" + (error.message || error));
  }

  ctx.scene.leave();
});

getPeriodScene.action("cancel", (ctx) => ctx.scene.leave());
getPeriodScene.leave((ctx) => ctx.deleteMessage(ctx.scene.state.welcomeMessage).catch((e) => console.log(e.message)));

export default getPeriodScene;
