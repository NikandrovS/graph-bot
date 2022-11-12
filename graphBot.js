import updateBoardList from "./src/crons/parseBoards.js";
import checkPayments from "./src/crons/checkPayments.js";
import fetchSupply from "./src/crons/parseSupply.js";
import "./telegraf.js";

updateBoardList();
checkPayments();
fetchSupply();
