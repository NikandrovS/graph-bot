import fetchMoralisApi from "./token-price-parser/fetchMoralisApi.js";
import { CronJob } from "cron";

(() => {
  new CronJob("*/15 * * * * *", fetchMoralisApi, null, true, "Europe/Moscow");
})();
