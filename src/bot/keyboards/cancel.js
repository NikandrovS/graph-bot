import { Markup } from "telegraf";

export default (text) => Markup.inlineKeyboard([Markup.button.callback(text, "cancel")]);
