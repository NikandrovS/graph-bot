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
      headers: { "X-API-Key": config.moralisToken },
      url: `https://deep-index.moralis.io/api/v2/erc20/${config.token.address}/price?chain=${config.token.chain}`,
    });

    await knex("token_price").insert({ usd_price: data.usdPrice, time });

    if (data.usdPrice !== lastRecord.usd_price) {
      const previousPrice = lastRecord.usd_price * config.token.multiplier;
      const newPrice = data.usdPrice * config.token.multiplier;

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
