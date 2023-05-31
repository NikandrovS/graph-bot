import checkDappRadarStats from "./src/crons/checkDappRadarStats.js";
import fetchVolumeAndLiquidity from "./src/crons/fetchDexGuruApi.js";
import updateBoardList from "./src/crons/parseBoards.js";
import checkPayments from "./src/crons/checkPayments.js";

import "./src/messageConsumer/consumer.js";
import "./src/bot/telegraf.js";

fetchVolumeAndLiquidity();
checkDappRadarStats();
updateBoardList();
checkPayments();
