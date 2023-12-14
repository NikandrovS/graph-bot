import { knex } from "../models/index.js";
import config from "../config/index.js";
import { CronJob } from "cron";
import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

export default () => {
  new CronJob("0 0 */8 * * *", fetchDappRadar, null, true, "Europe/Moscow");
};

export const fetchDappRadar = async () => {
  try {
    const time = new Date().toISOString().slice(0, 19).replace("T", " ");

    const { data } = await axios.get("https://api.dappradar.com/4tsxo4vuhotaojtl/dapps/7793?chain=bnb-chain", {
      headers: {
        "X-BLOBR-KEY": config.dappRadarToken,
      },
    });

    if (!data.success) return;

    await knex("chain_stats").insert({ uaw: data.results.metrics.uaw, transactions: data.results.metrics.transactions, time });
  } catch (error) {
    console.log("⚠️ ~ error", error);
  }
};
