import cancelKeyboard from "../keyboards/cancel.js";
import text from "../handlers/translatedText.js";
import { Scenes } from "telegraf";

const feedbackScene = new Scenes.BaseScene("feedbackScene");

feedbackScene.enter(async (ctx) => {
  const { message_id } = await ctx.reply(text(ctx, "feedback"), cancelKeyboard(text(ctx, "keyboardCancel")));
  ctx.scene.state.welcomeMessage = message_id;
});

feedbackScene.on("text", (ctx) => {
  ctx.telegram.sendMessage(309661344, `Новой фидбек от @${ctx.message.from.username}\nТекст: ${ctx.message.text}`);
  ctx.reply(text(ctx, "messageSent"));

  return ctx.scene.leave();
});

feedbackScene.action("cancel", (ctx) => ctx.scene.leave());
feedbackScene.leave((ctx) => ctx.deleteMessage(ctx.scene.state.welcomeMessage));

export default feedbackScene;
