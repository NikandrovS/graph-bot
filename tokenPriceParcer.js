// import fetchPrice from "./token-price-parser/fetchMoralisApi.js";
// import fetchPrice from "./token-price-parser/fetchCMCApi.js";
import fetchPrice from "./token-price-parser/fetchLlamaApi.js";
import { CronJob } from "cron";

(() => {
  // new CronJob("*/5 * * * *", fetchPrice, null, true, "Europe/Moscow");
  new CronJob("*/15 * * * * *", fetchPrice, null, true, "Europe/Moscow");
})();
