import fetchMoralisApi from "./token-price-parser/fetchMoralisApi.js";
// import fetchCMCApi from "./token-price-parser/fetchCMCApi.js";
import { CronJob } from "cron";

(() => {
  new CronJob("*/30 * * * * *", fetchMoralisApi, null, true, "Europe/Moscow");
})();
