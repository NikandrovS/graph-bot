import { Markup } from "telegraf";

export default ({ day, week, month, allTime, cancel }) =>
  Markup.inlineKeyboard([
    [Markup.button.callback(day, "daterange:day"), Markup.button.callback(week, "daterange:week")],
    [Markup.button.callback(month, "daterange:month"), Markup.button.callback(allTime, "daterange:all")],
    [Markup.button.callback(cancel, "cancel")],
  ]);
