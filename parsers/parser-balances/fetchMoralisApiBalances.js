import generateBalanceMessage from "./generateBalanceMessage.js";
import rabbitService from "../../supply-parser/RabbitService.js";
import { knex } from "../../src/models/index.js";
import config from "../../src/config/index.js";
import axios from "axios";

export default async (wallet, boardAddreses = [], boardUrls = [], init = false, tokenPrice = "") => {
  try {
    const { data } = await axios({
      method: "get",
      headers: { "X-API-Key": config.moralisToken },
      url: `https://deep-index.moralis.io/api/v2/${wallet}/erc20?chain=bsc`,
    });

    const balances = data
      .filter((t) => t.token_address === config.token.address || boardAddreses.includes(t.token_address))
      .map((t) => ({
        token: t.token_address,
        balance: t.balance,
        wallet,
      }));

    const lastBalances = await knex("wallets_balances").where({ wallet });

    if (init) {
      await knex("wallets_balances").where({ wallet }).del();

      await knex("wallets_balances").insert(balances);
      return;
    }

    const walletInfo = await knex("users_wallets").where({ user_wallet: wallet }).first();

    const msg = await generateBalanceMessage(boardUrls, lastBalances, balances, walletInfo, tokenPrice);

    if (msg) {
      await knex("wallets_balances").where({ wallet }).del();

      await knex("wallets_balances").insert(balances);

      rabbitService.send(msg);
    }
  } catch (error) {
    console.error("📛 ~ error", error.message || error);
  }
};
