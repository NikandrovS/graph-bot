import { Markup } from "telegraf";
const defaultBoards = [
  {
    url: "cryptocurrency",
    board_id: 90,
  },
  {
    url: "rightnow",
    board_id: 177,
  },
];

export default (boards, cancelText) => {
  const suggestedBoards = boards.length ? boards : defaultBoards;
  const buttonsArr = suggestedBoards.map((b) => Markup.button.callback("b/" + b.url, "boardId:" + b.board_id));

  const chunkSize = 2;
  const formedArray = [];

  for (let i = 0; i < buttonsArr.length; i += chunkSize) {
    const chunk = buttonsArr.slice(i, i + chunkSize);

    formedArray.push(chunk);
  }

  formedArray.push([Markup.button.callback(cancelText, "cancel")]);

  return Markup.inlineKeyboard(formedArray);
};
