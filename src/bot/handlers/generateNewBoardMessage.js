import sendNotifications from "./sendNotifications.js";
import translations from "../translations.js";

const region = {
  0: "🇬🇧",
  1: "🇷🇺",
};

export default async (boardsList) => {
  const ru = boardsList.reduce((acc, b) => {
    if (!acc) acc += translations.ru.newBoards.replace("<%= count %>", boardsList.length) + "\n";

    acc +=
      `${region[b.regionId]} <a href="https://main.community/b/${b.url}">b/${b.url}</a>` +
      (b.owner ? ` от <a href="https://main.community/u/${b.owner}">${b.owner}</a>` : "") +
      "\n";
    acc += b.description + "\n";
    acc +=
      "<b>" + translations.ru.newBoardPrice + ": " + b.coin.coinPrice.toFixed(1) + (b.coin.coinPrice >= 1000 ? " ⚜️" : "") + "</b>\n\n";
    return acc;
  }, "");

  const en = boardsList.reduce((acc, b) => {
    if (!acc) acc += translations.ru.newBoards.replace("<%= count %>", boardsList.length) + "\n";

    acc +=
      `${region[b.regionId]} <a href="https://main.community/b/${b.url}">b/${b.url}</a>` +
      (b.owner ? ` by <a href="https://main.community/u/${b.owner}">${b.owner}</a>` : "") +
      "\n";
    acc += b.description + "\n";
    acc +=
      "<b>" + translations.en.newBoardPrice + ": " + b.coin.coinPrice.toFixed(1) + (b.coin.coinPrice >= 1000 ? " ⚜️" : "") + "</b>\n\n";
    return acc;
  }, "");

  sendNotifications({ ru, en }, "new-board");
};
