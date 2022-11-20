import { Markup } from "telegraf";

export default (notifications, cancelText) => {
  const buttonsArr = notifications
    .sort((a, b) => +a.value - +b.value)
    .map((n) => Markup.button.callback(n.value + "$", "removeValue:" + n.value));

  const chunkSize = 3;
  const formedArray = [];

  for (let i = 0; i < buttonsArr.length; i += chunkSize) {
    const chunk = buttonsArr.slice(i, i + chunkSize);

    formedArray.push(chunk);
  }

  formedArray.push([Markup.button.callback(cancelText, "cancel")]);

  return Markup.inlineKeyboard(formedArray);
};
