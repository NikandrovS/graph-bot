import userBalanceCron from "./parsers/parser-balances/userBalanceCron.js";

import { CronJob } from "cron";

(() => {
  new CronJob("0 */1 * * * *", userBalanceCron, null, true, "Europe/Moscow");
})();
