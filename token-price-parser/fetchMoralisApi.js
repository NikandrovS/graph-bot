import { knex } from "../src/models/index.js";
import config from "../src/config/index.js";
import axios from "axios";

export default async () => {
  try {
    const time = new Date().toISOString().slice(0, 19).replace("T", " ");

    const { data } = await axios({
      method: "get",
      headers: { "X-API-Key": config.moralisToken },
      url: `https://deep-index.moralis.io/api/v2/erc20/${config.token.address}/price?chain=${config.token.chain}`,
    });

    await knex("token_price").insert({ usd_price: data.usdPrice, time });
  } catch (error) {
    console.error("📛 ~ error", error.message || error);
  }
};
