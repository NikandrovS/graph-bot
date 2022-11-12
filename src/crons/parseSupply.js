import { knex } from "../models/index.js";
import { CronJob } from "cron";
import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

export default () => {
  const job = new CronJob(
    process.env.DEV_CRON_TIME || "0 */10 * * * *",
    async function () {
      try {
        const time = new Date().toISOString().slice(0, 19).replace("T", " ");

        const boards = await knex("boards");

        (function myLoop(arr) {
          setTimeout(async function () {
            if (!arr.length) return;

            const { id, address } = arr.shift();

            try {
              const { data } = await axios.get("https://api.bscscan.com/api", {
                params: {
                  module: "stats",
                  action: "tokenSupply",
                  contractaddress: address,
                  apikey: process.env.BSC_API_KEY,
                },
              });

              await knex("supply").insert({ supply: data.result, board_id: id, time });
            } catch (error) {
              console.log("⚠️ ~ error", error);
            }

            myLoop(arr);
          }, 260);
        })(boards);
      } catch (error) {
        console.error(error);
      }
    },
    null,
    true,
    "Europe/Moscow"
  );
};
