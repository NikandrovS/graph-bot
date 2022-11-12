import { Markup } from "telegraf";

export default ({ oneMonth, sixMonths, twelveMonths, allTime, cancel }) =>
  Markup.inlineKeyboard([
    [Markup.button.callback(oneMonth, "daterange:1")],
    [Markup.button.callback(sixMonths, "daterange:6")],
    [Markup.button.callback(twelveMonths, "daterange:12")],
    [Markup.button.callback(allTime, "daterange:1200")],
    [Markup.button.callback(cancel, "cancel")],
  ]);
