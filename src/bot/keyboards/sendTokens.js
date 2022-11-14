import { Markup } from "telegraf";

export default (text) => Markup.inlineKeyboard([Markup.button.url(text, "https://main.community/profile/send")]);
