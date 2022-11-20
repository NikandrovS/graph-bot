import translations from "../src/bot/translations.js";
import config from "../src/config/index.js";

export default (previousPrice, newPrice) => {
  const ru =
    translations.ru.priceHasBeenReached +
    "\n" +
    translations.ru.currentTokenPrice
      .replace("<%= currentPrice %>", newPrice.toFixed(2))
      .replace("<%= multiplier %>", config.token.multiplier);

  const en =
    translations.en.priceHasBeenReached +
    "\n" +
    translations.en.currentTokenPrice
      .replace("<%= currentPrice %>", newPrice.toFixed(2))
      .replace("<%= multiplier %>", config.token.multiplier);

  return {
    range: [previousPrice, newPrice].sort(),
    listener: "token-price-change",
    text: { ru, en },
  };
};
