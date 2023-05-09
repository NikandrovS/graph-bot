import { Markup } from "telegraf";

export default ({ day, week, month, quarter, allTime, goBack }, restrictions) => {
  if (restrictions) {
    return Markup.inlineKeyboard([
      [Markup.button.callback(day, "daterange:day"), Markup.button.callback(week, "daterange:week")],
      [Markup.button.callback("🔒" + month, "daterange:locked"), Markup.button.callback("🔒" + quarter, "daterange:locked")],
      [Markup.button.callback("🔒" + allTime, "daterange:locked")],
      [Markup.button.callback(goBack, "back")],
    ]);
  }

  return Markup.inlineKeyboard([
    [Markup.button.callback(day, "daterange:day"), Markup.button.callback(week, "daterange:week")],
    [Markup.button.callback(month, "daterange:month"), Markup.button.callback(quarter, "daterange:quarter")],
    [Markup.button.callback(allTime, "daterange:all")],
    [Markup.button.callback(goBack, "back")],
  ]);
};
