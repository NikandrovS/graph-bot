import generateNewBoardMessage from "../bot/handlers/generateNewBoardMessage.js";
import { knex } from "../models/index.js";
import { CronJob } from "cron";
import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

export default () => {
  const job = new CronJob(process.env.DEV_CRON_TIME || "45 * * * * *", fetchBoards, null, true, "Europe/Moscow");
};

export const fetchBoards = async () => {
  try {
    const { data } = await axios.get("https://app.main.community/boards", {
      params: {
        limit: 1000,
      },
    });

    if (!data) return;

    const boardList = data.items.filter((item) => item.coin);

    const existedCount = await knex("boards")
      .count("* as count")
      .first()
      .then((r) => r.count);

    const missingCount = boardList.length - existedCount;

    if (!missingCount || missingCount < 0) return;

    const boardsToInsert = boardList.slice(-missingCount).map(({ title, url, coin }) => ({
      address: coin.contractAddress,
      title,
      url,
    }));

    await knex("boards").insert(boardsToInsert);

    if (missingCount > 100) return;

    const newBoards = boardList.slice(-missingCount);

    for (const [i, board] of newBoards.entries()) {
      const { data } = await axios.get(`https://app.main.community/tags/${board.id}/moderators`);
      newBoards[i].owner = data.owners[0].name;
    }

    await generateNewBoardMessage(newBoards);
  } catch (error) {
    console.log("⚠️ ~ error", error);
  }
};
