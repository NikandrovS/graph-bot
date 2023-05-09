import text from "../handlers/translatedText.js";
import { knex } from "../../models/index.js";
import config from "../../config/index.js";
import vegaGenerator from "./vega.js";

export default async (ctx, time, { id, title, url, selectedType }) => {
  const receiver = ctx.update.callback_query.from.id;

  const dateTo = new Date();
  const dateFrom = new Date();
  if (config.periods[time]) dateFrom.setDate(dateFrom.getDate() - config.periods[time]);

  const values = await knex("supply")
    .select(knex.raw("supply / 100000000000000000 as supply, UNIX_TIMESTAMP( time ) * 1000 as time, holders, price_usd"))
    .where({ board_id: id })
    .modify((qb) => {
      if (config.periods[time]) {
        qb.where("time", ">=", dateFrom);
        qb.where("time", "<=", dateTo);
      }
    });

  const priceUsdt = values.length ? values[values.length - 1].price_usd : 0;
  const priceMain = values.length ? values[values.length - 1].supply : 0;
  const holders = values.length ? values[values.length - 1].holders : 0;

  const titles = {
    main: text(ctx, "chartTitleBoard", { board: title }) + text(ctx, "chartTitlePrice", { price: priceMain }, "\n"),
    usdt: text(ctx, "chartTitleBoard", { board: title }) + text(ctx, "chartTitlePrice", { price: priceUsdt }, "\n"),
    mainHolders:
      text(ctx, "chartTitleBoard", { board: title }) +
      text(ctx, "chartTitlePrice", { price: priceMain }, "\n") +
      text(ctx, "chartTitleHolders", { holders: holders || "-" }, "\n"),
    usdtHolders:
      text(ctx, "chartTitleBoard", { board: title }) +
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

  vegaGenerator(receiver, selectedType, data, url, titles[selectedType]);
};
