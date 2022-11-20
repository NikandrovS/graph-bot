import cancelKeyboard from "../keyboards/cancel.js";
import text from "../handlers/translatedText.js";
import { knex } from "../../models/index.js";
import { Scenes } from "telegraf";

const newTokenNotify = new Scenes.BaseScene("newTokenNotify");

newTokenNotify.enter(async (ctx) => {
  const lastRecord = await knex("token_price").orderBy("id", "desc").first();
  const multiplier = 1000;

  const currentPrice = (lastRecord.usd_price * multiplier).toFixed(2);

  const { message_id } = await ctx.reply(
    text(ctx, "tokenPriceInput") + text(ctx, "currentTokenPrice", { currentPrice, multiplier }, "\n"),
    cancelKeyboard(text(ctx, "keyboardCancel"))
  );

  ctx.scene.state.welcomeMessage = message_id;
});

newTokenNotify.on("text", async (ctx) => {
  try {
    const value = Number(ctx.message.text.replace(",", "."));
    if (isNaN(value)) return ctx.reply(text(ctx, "incorrectInteger"));

    const isExists = await knex("listeners").where({ user_id: ctx.message.from.id, listener: "token-price-change", value }).first();

    if (!isExists) await knex("listeners").insert({ user_id: ctx.message.from.id, listener: "token-price-change", value });

    ctx.reply(text(ctx, "priceNotificationWasAdded", { value }));

    return ctx.scene.leave();
  } catch (error) {
    console.log(ctx.session.__scenes.current + "_scene_ERROR:" + (error.message || error));
  }
});

newTokenNotify.action("cancel", (ctx) => ctx.scene.leave());
newTokenNotify.leave((ctx) => ctx.deleteMessage(ctx.scene.state.welcomeMessage).catch((e) => console.log(e.message)));

export default newTokenNotify;
