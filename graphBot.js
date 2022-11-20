import updateBoardList from "./src/crons/parseBoards.js";
import checkPayments from "./src/crons/checkPayments.js";

import "./src/messageConsumer/consumer.js";
import "./src/bot/telegraf.js";

updateBoardList();
checkPayments();
