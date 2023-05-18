import tokenPriceChart from "../vega/vegaConfigTokenPrice24H.js";
import vega from "vega";
import vl from "vega-lite";

import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
const __dirname = path.dirname("./");

import text from "../handlers/translatedText.js";
import { knex } from "../../models/index.js";
import { Scenes } from "telegraf";

const currentTokenPriceChart = new Scenes.BaseScene("currentTokenPriceChart");

currentTokenPriceChart.enter(async (ctx) => {
  try {
    const multiplier = 1000;

    const dateTo = new Date();
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 1);

    const values = await knex("token_price")
      .select(knex.raw("usd_price * 1000 as price, 'main' as symbol, time as date"))
      .where("time", "<", dateTo)
      .where("time", ">=", dateFrom);

    const currentPrice = (+values[values.length - 1].price).toFixed(2);
    const todayRatio = +values[values.length - 1].price / +values[1].price;

    tokenPriceChart.title.subtitleColor = todayRatio >= 1 ? "#16c784" : "#ea3943";

    const percent = todayRatio >= 1 ? todayRatio * 100 - 100 : 100 - todayRatio * 100;

    tokenPriceChart.title.text = text(ctx, "priceChartTitle");
    tokenPriceChart.title.subtitle = `${todayRatio >= 1 ? "⇧" : "⇩"} ${percent.toFixed(2)}%`;

    const data = { values };

    tokenPriceChart.data = data;

    const vegaSpec = vl.compile(tokenPriceChart).spec; // convert Vega-Lite to Vega

    const view = new vega.View(vega.parse(vegaSpec), { renderer: "none" });

    view
      .toCanvas()
      .then(function (canvas) {
        const name = uuid();
        const out = fs.createWriteStream(__dirname + `/${name}.png`);
        const stream = canvas.createPNGStream();

        stream.pipe(out);

        out.on("finish", async () => {
          await ctx.sendPhoto(
            { source: `./${name}.png` },
            {
              caption: text(ctx, "currentTokenPrice", { currentPrice, multiplier }),
              reply_markup: {
                inline_keyboard: [[{ text: text(ctx, "openCmcChart"), url: "https://coinmarketcap.com/currencies/main-community/" }]],
              },
            }
          );
          fs.unlinkSync(__dirname + `/${name}.png`);
        });
      })
      .catch(function (err) {
        console.error(err);
      });
  } catch (error) {
    console.log("error with tokenPriceChart.js: ", error.message || error);
  }

  return ctx.scene.leave();
});

export default currentTokenPriceChart;