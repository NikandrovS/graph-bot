import { Markup } from "telegraf";

export default (activeBoards, cancelText) => {
  const buttonsArr = activeBoards
    .sort((a, b) => (a.url > b.url ? 1 : -1))
    .map((b) => Markup.button.callback("✖️ b/" + b.url, "removeId:" + b.id));

  const chunkSize = 2;
  const formedArray = [];

  for (let i = 0; i < buttonsArr.length; i += chunkSize) {
    const chunk = buttonsArr.slice(i, i + chunkSize);

    formedArray.push(chunk);
  }

  formedArray.push([Markup.button.callback(cancelText, "cancel")]);

  return Markup.inlineKeyboard(formedArray);

  return Markup.inlineKeyboard([
    [Markup.button.callback("b/now", "addSubscription"), Markup.button.callback("b/eartporn", "viewSubscriptions")],
    [Markup.button.callback("b/youtube", "addSubscription")],
    [Markup.button.callback("b/cryptocurrency", "viewSubscriptions")],
    [Markup.button.callback(cancelText, "cancel")],
  ]);
};
