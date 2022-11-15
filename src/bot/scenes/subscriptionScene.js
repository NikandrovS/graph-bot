import subscriptionKeyboard from "../keyboards/subscriptionPeriod.js";
import sendTokensKeyboard from "../keyboards/sendTokens.js";
import { getVoucher } from "../handlers/getVoucher.js";
import text from "../handlers/translatedText.js";
import translations from "../translations.js";
import { knex } from "../../models/index.js";
import config from "../../config/index.js";
import { Scenes } from "telegraf";

const subscriptionScene = new Scenes.BaseScene("subscriptionScene");

const prices = [
  {
    price: 500,
    keyboard: "oneMonth",
    period: 1,
  },
  {
    price: 2500,
    keyboard: "sixMonths",
    period: 6,
  },
  {
    price: 4000,
    keyboard: "twelveMonths",
    period: 12,
  },
  {
    price: 10000,
    keyboard: "allTime",
    period: 1200,
  },
];

subscriptionScene.enter(async (ctx) => {
  const lang = ctx.update.message.from.language_code;
  const sceneLang = translations[lang] ? lang : translations.defaultLang;

  const user = await knex("users").where({ id: ctx.update.message.from.id }).first();

  if (!user) return ctx.reply("Use /start");

  let subscriptionText = "";

  if (new Date() > user.subscription_period) {
    // Subscription is unavailable
    subscriptionText += text(ctx, "subscriptionIsUnavailable");
    if (user.attempts < config.freeAttempts) {
      subscriptionText += text(ctx, "availableAttempts", {}, ". ", " ");
      subscriptionText += config.freeAttempts - user.attempts;
    }
  } else {
    subscriptionText += text(ctx, "subscriptionIsAvailableUntil", {}, "", " ");
    subscriptionText += user.subscription_period.toLocaleDateString("fr-FR");
  }

  const keyboardValues = prices.reduce((acc, { keyboard, price }, idx) => {
    if (!idx) acc.cancel = translations[sceneLang].keyboardSubscription.cancel;

    acc[keyboard] = translations[sceneLang].keyboardSubscription[keyboard] + " - " + price + " MAIN";

    return acc;
  }, {});

  const welcomeMessage = await ctx.reply(subscriptionText);
  ctx.scene.state.welcomeMessages = [welcomeMessage.message_id];
  const priceList = await ctx.reply(text(ctx, "renewSubscription"), subscriptionKeyboard(keyboardValues));
  ctx.scene.state.welcomeMessages.push(priceList.message_id);
});

subscriptionScene.action(/^daterange:.*/, async (ctx) => {
  const period = ctx.callbackQuery.data.split(":")[1];

  const voucher = await getVoucher();
  const amount = prices.find((p) => p.period === +period).price;

  await knex("vouchers").insert({ user_id: ctx.callbackQuery.from.id, amount, voucher, period });

  let paymentText = "";

  paymentText += text(ctx, "paymentAmount", { tokensAmount: amount });
  paymentText += text(ctx, "paymentGuide", {}, "\n");
  paymentText += text(ctx, "paymentWarning", {}, "\n");

  await ctx.reply(paymentText);

  await ctx.replyWithHTML(
    text(ctx, "paymentCode", { voucher: `<code>${voucher}</code>` }),
    sendTokensKeyboard(text(ctx, "keyboardSendTokens"))
  );

  ctx.scene.leave();
});

subscriptionScene.action("cancel", (ctx) => ctx.scene.leave());
subscriptionScene.leave((ctx) => {
  try {
    return ctx.scene.state.welcomeMessages.forEach((id) => ctx.deleteMessage(id).catch((e) => console.log(e.message)));
  } catch (error) {
    console.log(error);
  }
});

export default subscriptionScene;
