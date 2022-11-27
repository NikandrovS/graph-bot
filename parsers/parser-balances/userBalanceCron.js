import fetchMoralisApiBalances from "./fetchMoralisApiBalances.js";
import { knex } from "../../src/models/index.js";

export default async () => {
  try {
    const ids = await knex("listeners").select("value").where({ listener: "user-balance-change" }).groupBy("value").pluck("value");

    const walletList = await knex("users_wallets").pluck("user_wallet").whereIn("id", ids);

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

    const { usd_price } = await knex("token_price").orderBy("id", "desc").first();

    for (const wallet of walletList) {
      await fetchMoralisApiBalances(wallet, boardAddreses, boardUrls, false, usd_price);
    }
  } catch (error) {
    console.error("📛 ~ error", error.message || error);
  }
};
