import periodKeyboard from "../keyboards/period.js";
import translations from "../translations.js";
import vegaGenerator from "../../../vega.js";
import { knex } from "../../models/index.js";
import { Scenes } from "telegraf";

const getPeriodScene = new Scenes.BaseScene("getPeriod");

getPeriodScene.enter(async (ctx) => {
  const lang = ctx.update.message.from.language_code;
  ctx.scene.state.lang = translations[lang] ? lang : translations.defaultLang;

  ctx.scene.state.user = ctx.update.message.from.id;

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
    week: 3,
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

  vegaGenerator(data, ctx, values[values.length - 1].supply);

  await knex.raw("UPDATE users SET attempts = attempts + 1 WHERE id = ?", [ctx.scene.state.user]);

  ctx.scene.leave();
});

getPeriodScene.action("cancel", (ctx) => ctx.scene.leave());
getPeriodScene.leave((ctx) => ctx.deleteMessage(ctx.scene.state.welcomeMessage).catch((e) => console.log(e.message)));

export default getPeriodScene;
