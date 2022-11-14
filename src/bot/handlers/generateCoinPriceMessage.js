import sendNotifications from "./sendNotifications.js";
import translations from "../translations.js";

export default async (boardId, boardUrl, oldPrice, newPrice) => {
  const priceDiff = ((newPrice - oldPrice) / 1000000000000000000).toFixed(3);
  const oldAmountInCoins = oldPrice / 100000000000000000;
  const newAmountInCoins = newPrice / 100000000000000000;
  const percent = ((newAmountInCoins / oldAmountInCoins - 1) * 100).toFixed(1);
  const tokensLockedBefore = Math.pow(oldAmountInCoins, 2) * 5;
  const tokensLockedAfter = Math.pow(newAmountInCoins, 2) * 5;
  const increase = priceDiff > 0;

  const delimiter = increase ? 90 : 100;
  const tokensSpent = Math.abs(((tokensLockedAfter - tokensLockedBefore) / delimiter).toFixed(1));

  const ru =
    `⚜️ <a href="https://main.community/b/${boardUrl}">b/${boardUrl}</a> ${percent}%\n` +
    `${increase ? translations.ru.buyEvent : translations.ru.sellEvent}: ` +
    priceDiff +
    " BC\n" +
    `${increase ? translations.ru.spentEvent : translations.ru.recievedEvent}: ` +
    tokensSpent +
    " MAIN\n" +
    translations.ru.priceChange
      .replace("<%= oldPrice %>", oldAmountInCoins.toFixed(1))
      .replace("<%= newPrice %>", newAmountInCoins.toFixed(1));

  const en =
    `⚜️ <a href="https://main.community/b/${boardUrl}">b/${boardUrl}</a> ${percent}%\n` +
    `${increase ? translations.en.buyEvent : translations.en.sellEvent}: ` +
    priceDiff +
    " BC\n" +
    `${increase ? translations.en.spentEvent : translations.en.recievedEvent}: ` +
    tokensSpent +
    " MAIN\n" +
    translations.en.priceChange
      .replace("<%= oldPrice %>", oldAmountInCoins.toFixed(1))
      .replace("<%= newPrice %>", newAmountInCoins.toFixed(1));

  sendNotifications({ ru, en }, "coin-price-change", boardId);
};
