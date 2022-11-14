import sendNotifications from "./sendNotifications.js";
import translations from "../translations.js";

export default async (boardId, boardUrl, oldPrice, newPrice) => {
  const priceDiff = ((newPrice - oldPrice) / 100000000000000000).toFixed(4);
  const oldAmountInCoins = oldPrice / 100000000000000000;
  const newAmountInCoins = newPrice / 100000000000000000;
  const percent = ((newAmountInCoins / oldAmountInCoins - 1) * 100).toFixed(1);
  const tokensLockedBefore = Math.pow(oldAmountInCoins, 2) * 5;
  const tokensLockedAfter = Math.pow(newAmountInCoins, 2) * 5;
  const tokensSpent = Math.abs(((tokensLockedAfter - tokensLockedBefore) / 90).toFixed(1));

  const increase = priceDiff > 0;

  const ru =
    `⚜️ <a href="https://main.community/b/${boardUrl}">b/${boardUrl}</a> ${percent}%\n` +
    `${increase ? "Покупка: " : "Продажа: "}` +
    priceDiff +
    " BC\n" +
    `${increase ? "Потрачено: " : "Получено: "}` +
    tokensSpent +
    " MAIN\n" +
    `Стоимость: ${oldAmountInCoins.toFixed(1)} -> ${newAmountInCoins.toFixed(1)}`;

  const en =
    `⚜️ <a href="https://main.community/b/${boardUrl}">b/${boardUrl}</a> ${percent}%\n` +
    `${increase ? "Покупка: " : "Продажа: "}` +
    priceDiff +
    " BC\n" +
    `${increase ? "Потрачено: " : "Получено: "}` +
    tokensSpent +
    " MAIN\n" +
    `Стоимость: ${oldAmountInCoins.toFixed(1)} -> ${newAmountInCoins.toFixed(1)}`;

  sendNotifications({ ru, en }, "coin-price-change", boardId);
};
