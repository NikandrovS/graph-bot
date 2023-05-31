import { knex } from "../models/index.js";
import config from "../config/index.js";
import { CronJob } from "cron";
import axios from "axios";

export default () => {
  new CronJob("0 */5 * * * *", fetchDexGuru, null, true, "Europe/Moscow");
};

export const fetchDexGuru = async () => {
  try {
    const dexGuruResponse = await axios({
      method: "get",
      headers: { "api-key": config.dexGuruToken },
      url: `https://api.dev.dex.guru/v1/chain/56/tokens/${config.token.address}/market`,
    });

    if (dexGuruResponse && dexGuruResponse.data) {
      const lastRecord = await knex("token_price").orderBy("id", "desc").first();

      if (!lastRecord) return;

      await knex("token_price").where({ id: lastRecord.id }).update({
        volume_24h: dexGuruResponse.data.volume_24h_usd,
        liquidity: dexGuruResponse.data.liquidity_usd,
      });
    }
  } catch (error) {
    console.error("📛 ~ error with fetchDexGuruApi.js", error.message || error);
  }
};
