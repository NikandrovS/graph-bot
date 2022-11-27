import { Markup } from "telegraf";

export default (notifications, cancelText) => {
  const buttonsArr = notifications.map((n) =>
    Markup.button.callback(n.username ? "👤" + n.username : "💰 0x" + n.user_wallet.slice(-4), "removeValue:" + n.id)
  );

  const chunkSize = 2;
  const formedArray = [];

  for (let i = 0; i < buttonsArr.length; i += chunkSize) {
    const chunk = buttonsArr.slice(i, i + chunkSize);

    formedArray.push(chunk);
  }

  formedArray.push([Markup.button.callback(cancelText, "cancel")]);

  return Markup.inlineKeyboard(formedArray);
};
