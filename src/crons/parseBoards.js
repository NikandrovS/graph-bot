import generateNewBoardMessage from "../bot/handlers/generateNewBoardMessage.js";
import { knex } from "../models/index.js";
import { CronJob } from "cron";
import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

export default () => {
  const job = new CronJob(process.env.DEV_CRON_TIME || "0 */10 * * * *", fetchBoards, null, true, "Europe/Moscow");
};

export const fetchBoards = async () => {
  try {
    const { data } = await axios.get("https://app.main.community/boards", {
      params: {
        limit: 1000,
      },
    });

    if (!data) return;

    const resCount = data.metadata.count;

    const existedCount = await knex("boards")
      .count("* as count")
      .first()
      .then((r) => r.count);

    const missingCount = resCount - existedCount;

    if (!missingCount || missingCount < 0) return;

    const boardsToInsert = data.items.slice(-missingCount).map(({ title, url, coin }) => ({
      address: coin.contractAddress,
      title,
      url,
    }));

    await knex("boards").insert(boardsToInsert);

    if (missingCount < 100) await generateNewBoardMessage(data.items.slice(-missingCount));
  } catch (error) {
    console.log("⚠️ ~ error", error);
  }
};
