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
      url: `https://coins.llama.fi/prices/current/bsc:0xA5F249F401bA8931899a364d8E2699b5FA1D87a9?searchWidth=1h`,
      method: "get",
    });

    if (!data) throw new Error("No data received from Defi Llama");

    const apiNewPrice = (data.coins["bsc:0xA5F249F401bA8931899a364d8E2699b5FA1D87a9"].price).toFixed(18)

    await knex("token_price").insert({
      bnb_price: 0,
      usd_price: apiNewPrice,
      time,
    });

    if (apiNewPrice !== lastRecord.usd_price) {
      const previousPrice = lastRecord.usd_price * config.token.multiplier;
      const newPrice = apiNewPrice * config.token.multiplier;

      const result = await knex("listeners")
        .select("user_id")
        .where({ listener: "token-price-change" })
        .whereBetween("value", [previousPrice, newPrice].sort())
        .first();

      if (result) {
        const msg = generateTokenPriceMessage(previousPrice, newPrice);

        rabbitService.send(msg);
      }
    }
  } catch (error) {
    console.error("📛 ~ error with llama api", error.message || error);
  }
};
