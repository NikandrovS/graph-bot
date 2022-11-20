import text from "../handlers/translatedText.js";
import cmcKeyboard from "../keyboards/cmc.js";
import { knex } from "../../models/index.js";
import { Scenes } from "telegraf";

const currentTokenPrice = new Scenes.BaseScene("currentTokenPrice");

currentTokenPrice.enter(async (ctx) => {
  const lastRecord = await knex("token_price").orderBy("id", "desc").first();
  const multiplier = 1000;

  const currentPrice = (lastRecord.usd_price * multiplier).toFixed(2);

  await ctx.reply(text(ctx, "currentTokenPrice", { currentPrice, multiplier }), cmcKeyboard(text(ctx, "openCmcChart")));

  return ctx.scene.leave();
});

export default currentTokenPrice;
