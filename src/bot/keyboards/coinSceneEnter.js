import { Markup } from "telegraf";

export default (add, view, cancelText, notifications) =>
  Markup.inlineKeyboard([
    [Markup.button.callback(add, "addSubscription")],
    notifications ? [Markup.button.callback(view, "viewSubscriptions")] : [],
    [Markup.button.callback(cancelText, "cancel")],
  ]);
