import updateBoardList from "./src/crons/parseBoards.js";
import checkPayments from "./src/crons/checkPayments.js";

import "./src/messageConsumer/consumer.js";
import "./telegraf.js";

updateBoardList();
checkPayments();
