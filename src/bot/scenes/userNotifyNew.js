import fetchMoralisApiBalances from "../../../parsers/parser-balances/fetchMoralisApiBalances.js";
import cancelKeyboard from "../keyboards/cancel.js";
import text from "../handlers/translatedText.js";
import { knex } from "../../models/index.js";
import { Scenes } from "telegraf";
import axios from "axios";

const newNotification = async (user_id, value) => {
  const exists = await knex("listeners").where({ listener: "user-balance-change", value }).first();

  await knex("listeners").insert({ user_id, listener: "user-balance-change", value });

  if (!exists) {
    const wallet = await knex("users_wallets").where({ id: value }).first();

    const [boardAddreses, boardUrls] = await knex("boards")
      .select(knex.raw("LOWER(address) as address, url, id"))
      .then((r) =>
        r.reduce(
          (acc, b) => {
            acc[0].push(b.address);
            acc[1].push(b);

            return acc;
          },
          [[], []]
        )
      );

    await fetchMoralisApiBalances(wallet.user_wallet, boardAddreses, boardUrls, true);
  }
};

const newUserBalanceNotify = new Scenes.BaseScene("newUserBalanceNotify");

newUserBalanceNotify.enter(async (ctx) => {
  const { message_id } = await ctx.reply(text(ctx, "userInput"), cancelKeyboard(text(ctx, "keyboardCancel")));

  ctx.scene.state.welcomeMessage = message_id;
});

newUserBalanceNotify.on("text", async (ctx) => {
  try {
    const requestTypeAddress = /^0x[a-fA-F0-9]{40}$/.test(ctx.message.text);
    const searchParam = requestTypeAddress ? { user_wallet: ctx.message.text } : { username: ctx.message.text };

    const user = await knex("users_wallets").where(searchParam).first();

    if (user) {
      const isExists = await knex("listeners")
        .where({ user_id: ctx.message.from.id, listener: "user-balance-change", value: user.id })
        .first();

      if (!isExists) await newNotification(ctx.message.from.id, user.id);

      const value = user.username || "0x" + user.user_wallet.slice(-4);

      await ctx.reply(text(ctx, user.username ? "userNotificationWasAdded" : "addressNotificationWasAdded", { value }));

      return ctx.scene.leave();
    }

    if (requestTypeAddress) {
      const [newRecordId] = await knex("users_wallets").insert({ user_wallet: ctx.message.text });

      await newNotification(ctx.message.from.id, newRecordId);

      await ctx.reply(text(ctx, "addressNotificationWasAdded", { value: "0x" + ctx.message.text.slice(-4) }));

      return ctx.scene.leave();
    }

    try {
      const { data } = await axios.get("https://app.main.community/users/name/" + ctx.message.text);

      if (!data.bscAddress) {
        await ctx.reply(text(ctx, "noBscWallet"));
        return ctx.scene.leave();
      }

      await ctx.reply(text(ctx, "userNotificationWasAdded", { value: ctx.message.text }));


      const walletExists = await knex("users_wallets").where({ user_wallet: data.bscAddress }).first();

      if (walletExists) {
        await knex("users_wallets").update({ username: data.name }).where({ user_wallet: data.bscAddress });

        const existedListener = await knex("listeners")
          .where({ user_id: ctx.message.from.id, listener: "user-balance-change", value: walletExists.id })
          .first();

        if (!existedListener) await newNotification(ctx.message.from.id, walletExists.id);
      } else {
        const [newRecordId] = await knex("users_wallets").insert({ username: data.name, user_wallet: data.bscAddress });

        await newNotification(ctx.message.from.id, newRecordId);
      }


      return ctx.scene.leave();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        if (!ctx.scene.state.tries) ctx.scene.state.tries = 0;
        if (ctx.scene.state.tries >= 2) {
          ctx.reply(text(ctx, "tryLater"));
          return ctx.scene.leave();
        }

        ctx.scene.state.tries += 1;

        return ctx.reply(text(ctx, "mainUserNotFound"));
      }

      console.log(error.message || error);

      return ctx.scene.leave();
    }
  } catch (error) {
    console.log(ctx.session.__scenes.current + "_scene_ERROR:" + (error.message || error));
  }
});

newUserBalanceNotify.action("cancel", (ctx) => ctx.scene.leave());
newUserBalanceNotify.leave((ctx) => ctx.deleteMessage(ctx.scene.state.welcomeMessage).catch((e) => console.log(e.message)));

export default newUserBalanceNotify;
