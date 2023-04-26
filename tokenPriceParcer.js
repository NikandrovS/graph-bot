// import fetchMoralisApi from "./token-price-parser/fetchMoralisApi.js";
import fetchCMCApi from "./token-price-parser/fetchCMCApi.js";
import { CronJob } from "cron";

(() => {
  new CronJob("*/30 * * * * *", fetchCMCApi, null, true, "Europe/Moscow");
})();
