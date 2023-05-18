import { knex } from "../src/models/index.js";
import config from "../src/config/index.js";
import axios from "axios";

export default async (id) => {
  if (!id) return;

  try {
    const dexGuruResponse = await axios({
      method: "get",
      headers: { "api-key": config.dexGuruToken },
      url: `https://api.dev.dex.guru/v1/chain/56/tokens/${config.token.address}/market`,
    });

    if (dexGuruResponse && dexGuruResponse.data) {
      await knex("token_price").where({ id }).update({
        volume_24h: dexGuruResponse.data.volume_24h_usd,
        liquidity: dexGuruResponse.data.liquidity_usd,
      });
    }
  } catch (error) {
    console.error("📛 ~ error with fetchDexGuruApi.js", error.message || error);
  }
};
