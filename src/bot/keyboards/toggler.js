import { Markup } from "telegraf";

export default (text, value, cancelText) =>
  Markup.inlineKeyboard([[Markup.button.callback(text, value)], [Markup.button.callback(cancelText, "cancel")]]);
