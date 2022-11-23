import { Markup } from "telegraf";

export default (types, cancel) =>
  Markup.inlineKeyboard([
    [
      Markup.button.callback(types.main.title, "type:" + types.main.action),
      Markup.button.callback(types.usdt.title, "type:" + types.usdt.action),
    ],
    [Markup.button.callback(types.mainHolders.title, "type:" + types.mainHolders.action)],
    [Markup.button.callback(types.usdtHolders.title, "type:" + types.usdtHolders.action)],
    [Markup.button.callback(cancel, "cancel")],
  ]);
