import periodKeyboard from "../keyboards/period.js";
import translations from "../translations.js";
import vegaGenerator from "../vega/vega.js";
import { knex } from "../../models/index.js";
import { Scenes } from "telegraf";

const getPeriodScene = new Scenes.BaseScene("getPeriod");

getPeriodScene.enter(async (ctx) => {
  const dataObject = ctx.update.message ? "message" : "callback_query";
  const { id, language_code } = ctx.update[dataObject].from;

  ctx.scene.state.lang = translations[language_code] ? language_code : translations.defaultLang;
  ctx.scene.state.user = id;

  try {
    const { message_id } = await ctx.reply(
      translations[ctx.scene.state.lang].chartPeriod.replace("<%= boardName %>", ctx.scene.state.title),
      periodKeyboard(translations[ctx.scene.state.lang].keyboardPeriod)
    );

    ctx.scene.state.welcomeMessage = message_id;
  } catch (error) {
    console.log(error);
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
    .select(knex.raw("supply / 100000000000000000 as supply, UNIX_TIMESTAMP( time ) * 1000 as time"))
    .where({ board_id: ctx.scene.state.id })
    .modify((qb) => {
      if (periods[time]) {
        qb.where("time", ">=", dateFrom);
        qb.where("time", "<=", dateTo);
      }
    });

  const data = [
    {
      name: "table",
      values,
    },
    {
      name: "dots",
      values: values.reduce((acc, rec, i) => {
        if (!values[i - 1] || !values[i + 1]) return [...acc, rec];
        if (rec.supply !== values[i + 1].supply) return [...acc, rec];
        if (rec.supply !== values[i - 1].supply) return [...acc, rec];
        return acc;
      }, []),
    },
  ];

  vegaGenerator(data, ctx, values.length ? values[values.length - 1].supply : 0);

  await knex.raw("UPDATE users SET attempts = attempts + 1 WHERE id = ?", [ctx.scene.state.user]);

  await knex("board_requests").insert({ user_id: ctx.scene.state.user, url: ctx.scene.state.url, board_id: ctx.scene.state.id });

  ctx.scene.leave();
});

getPeriodScene.action("cancel", (ctx) => ctx.scene.leave());
getPeriodScene.leave((ctx) => ctx.deleteMessage(ctx.scene.state.welcomeMessage).catch((e) => console.log(e.message)));

export default getPeriodScene;
