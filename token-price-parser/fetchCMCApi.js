import generateTokenPriceMessage from "./generateTokenPriceMessage.js";
import rabbitService from "../supply-parser/RabbitService.js";
import { knex } from "../src/models/index.js";
import config from "../src/config/index.js";
import axios from "axios";

export default async () => {
  try {
    const time = new Date().toISOString().slice(0, 19).replace("T", " ");

    const lastRecord = await knex("token_price").orderBy("id", "desc").first();

    const { data } = await axios({
      method: "get",
      headers: { "X-CMC_PRO_API_KEY": config.cmcToken },
      url: `https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&id=${config.token.cmcMainId}`,
    });

    if (!data) throw new Error('No data received from Coin Market Cap')

    await knex("token_price").insert({ bnb_price: 0, usd_price: data.quote.USD.price, time });

    if (data.quote.USD.price !== lastRecord.usd_price) {
      const previousPrice = lastRecord.usd_price * config.token.multiplier;
      const newPrice = data.quote.USD.price * config.token.multiplier;

      const result = await knex("listeners")
        .select("user_id")
        .where({ listener: "token-price-change" })
        .whereBetween("value", [previousPrice, newPrice].sort())
        .first();

      if (!result) return;

      const msg = generateTokenPriceMessage(previousPrice, newPrice);

      rabbitService.send(msg);
    }
  } catch (error) {
    console.error("📛 ~ error", error.message || error);
  }
};
