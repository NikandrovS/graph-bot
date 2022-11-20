import toggleKeyboard from "../keyboards/toggler.js";
import text from "../handlers/translatedText.js";
import { knex } from "../../models/index.js";
import { Scenes } from "telegraf";

const notifyForNewBoard = new Scenes.BaseScene("notifyForNewBoard");

notifyForNewBoard.enter(async (ctx) => {
  const user = await knex("users")
    .leftJoin("listeners as l", function () {
      this.on("l.user_id", "=", "users.id").andOn(`l.listener`, "=", knex.raw("?", "new-board"));
    })
    .where({ id: ctx.update.message.from.id })
    .first();

  if (!user) return ctx.reply("Use /start");

  const isEnabled = Boolean(user.listener);
  const actionToDo = Boolean(user.listener) ? "disableAction" : "enableAction";

  const { message_id } = await ctx.reply(
    text(ctx, "newBoardNotify", { state: text(ctx, isEnabled ? "enabledState" : "disabledState") }),
    toggleKeyboard(text(ctx, actionToDo), actionToDo, text(ctx, "keyboardCancel"))
  );

  ctx.scene.state.welcomeMessage = message_id;
});

notifyForNewBoard.action("enableAction", async (ctx) => {
  try {
    await knex("listeners").insert({ user_id: ctx.callbackQuery.from.id, listener: "new-board" });
    await ctx.reply(text(ctx, "settingsUpdate"));
    return ctx.scene.leave();
  } catch (error) {
    console.log("EnableAction ERROR: " + (error.message || error));
  }
});

notifyForNewBoard.action("disableAction", async (ctx) => {
  try {
    await knex("listeners").where({ user_id: ctx.callbackQuery.from.id, listener: "new-board" }).del();
    await ctx.reply(text(ctx, "settingsUpdate"));
    return ctx.scene.leave();
  } catch (error) {
    console.log("DisableAction ERROR: " + (error.message || error));
  }
});

notifyForNewBoard.action("cancel", (ctx) => ctx.scene.leave());
notifyForNewBoard.leave((ctx) => ctx.deleteMessage(ctx.scene.state.welcomeMessage).catch((e) => console.log(e.message)));

export default notifyForNewBoard;
