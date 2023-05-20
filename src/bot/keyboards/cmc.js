import config from "../../config/index.js";
import { Markup } from "telegraf";

export default (stakingText, buyText, cmcText) =>
  Markup.inlineKeyboard([
    [
      Markup.button.url(stakingText, "https://app.earnpark.com/r?p=rzXD3YO8"),
      Markup.button.url(
        buyText,
        `https://pancakeswap.finance/swap?inputCurrency=${config.token.usdtAddress}&outputCurrency=${config.token.address}`
      ),
    ],
    [Markup.button.url(cmcText, "https://coinmarketcap.com/currencies/main-community/")],
  ]);
