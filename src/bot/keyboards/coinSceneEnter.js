import { Markup } from "telegraf";

export default (add, view, cancelText) =>
  Markup.inlineKeyboard([
    [Markup.button.callback(add, 'addSubscription')],
    [Markup.button.callback(view, 'viewSubscriptions')],
    [Markup.button.callback(cancelText, "cancel")],
  ]);
