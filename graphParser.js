import rabbitService from "./supply-parser/RabbitService.js";
import fetchBscScan from "./supply-parser/fetchBscScan.js";
import { CronJob } from "cron";

import dotenv from "dotenv";
dotenv.config();

rabbitService.init();

(() => {
  new CronJob(process.env.DEV_CRON_TIME || "0 */10 * * * *", fetchBscScan, null, true, "Europe/Moscow");
})();

