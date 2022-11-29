import chartTypeKeyboard from "../keyboards/chartType.js";
import periodKeyboard from "../keyboards/period.js";
import text from "../handlers/translatedText.js";
import translations from "../translations.js";
import { knex } from "../../models/index.js";
import vegaGenerator from "../vega/vega.js";
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
      periodKeyboard(translations[ctx.scene.state.lang].keyboardPeriod)
    );
  } catch (error) {
    console.log("📛" + ctx.session.__scenes.current + "_scene_ERROR:" + (error.message || error));
    ctx.scene.leave();
  }
});

getPeriodScene.action(/^daterange:.*/, async (ctx) => {
  const time = ctx.callbackQuery.data.split(":")[1];

  const periods = {
    day: 1,
    week: 7,
    month: 30,
  };

  const dateTo = new Date();
  const dateFrom = new Date();
  if (periods[time]) dateFrom.setDate(dateFrom.getDate() - periods[time]);

  const values = await knex("supply")
    .select(knex.raw("supply / 100000000000000000 as supply, UNIX_TIMESTAMP( time ) * 1000 as time, holders, price_usd"))
    .where({ board_id: ctx.scene.state.id })
    .modify((qb) => {
      if (periods[time]) {
        qb.where("time", ">=", dateFrom);
        qb.where("time", "<=", dateTo);
      }
    });

  const priceUsdt = values.length ? values[values.length - 1].price_usd : 0;
  const priceMain = values.length ? values[values.length - 1].supply : 0;
  const holders = values.length ? values[values.length - 1].holders : 0;

  const titles = {
    main: text(ctx, "chartTitleBoard", { board: ctx.scene.state.title }) + text(ctx, "chartTitlePrice", { price: priceMain }, "\n"),
    usdt: text(ctx, "chartTitleBoard", { board: ctx.scene.state.title }) + text(ctx, "chartTitlePrice", { price: priceUsdt }, "\n"),
    mainHolders:
      text(ctx, "chartTitleBoard", { board: ctx.scene.state.title }) +
      text(ctx, "chartTitlePrice", { price: priceMain }, "\n") +
      text(ctx, "chartTitleHolders", { holders: holders || "-" }, "\n"),
    usdtHolders:
      text(ctx, "chartTitleBoard", { board: ctx.scene.state.title }) +
      text(ctx, "chartTitlePrice", { price: priceUsdt }, "\n") +
      text(ctx, "chartTitleHolders", { holders: holders || "-" }, "\n"),
  };

  const data = [
    {
      name: "table",
      // тут потом убрать map, когда у всех бордов будут holders. оставить просто values
      values: values.map((r) => {
        if (r.holders) return r;
        const firstCountOfHolders = values.reduce((acc, i) => (acc ? acc : i.holders > 0 ? i.holders : 0), 0);

        r.holders = firstCountOfHolders;

        return r;
      }),
    },
    {
      name: "dots",
      values: [],
      // values: values.reduce((acc, rec, i) => {
      //   if (!values[i - 1] || !values[i + 1]) return [...acc, rec];
      //   if (rec.supply !== values[i + 1].supply) return [...acc, rec];
      //   if (rec.supply !== values[i - 1].supply) return [...acc, rec];
      //   return acc;
      // }, []),
    },
    {
      name: "usdtDots",
      values: [],
      //   values: values.reduce((acc, rec, i) => {
      //     if (!values[i - 1] || !values[i + 1]) return [...acc, rec];
      //     if (rec.price_usd !== values[i + 1].price_usd) return [...acc, rec];
      //     if (rec.price_usd !== values[i - 1].price_usd) return [...acc, rec];
      //     return acc;
      //   }, []),
    },
    {
      name: "holderDots",
      values: [],
      // values: ["mainHolders", "usdtHolders"].includes(ctx.scene.state.selectedType)
      //   ? values.reduce((acc, rec, i) => {
      //       if (!values[i - 1] || !values[i + 1]) return [...acc, rec];
      //       if (rec.holders !== values[i + 1].holders) return [...acc, rec];
      //       if (rec.holders !== values[i - 1].holders) return [...acc, rec];
      //       return acc;
      //     }, [])
      //   : [],
    },
  ];

  vegaGenerator(ctx.scene.state.selectedType, data, ctx, titles[ctx.scene.state.selectedType]);

  await knex.raw("UPDATE users SET attempts = attempts + 1 WHERE id = ?", [ctx.scene.state.user]);

  await knex("board_requests").insert({ user_id: ctx.scene.state.user, url: ctx.scene.state.url, board_id: ctx.scene.state.id });

  ctx.scene.leave();
});

getPeriodScene.action("cancel", (ctx) => ctx.scene.leave());
getPeriodScene.leave((ctx) => ctx.deleteMessage(ctx.scene.state.welcomeMessage).catch((e) => console.log(e.message)));

export default getPeriodScene;
