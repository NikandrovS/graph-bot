import { Markup } from "telegraf";

export default (text) => Markup.inlineKeyboard([Markup.button.url(text, "https://coinmarketcap.com/currencies/main-community/")]);
