import { knex } from "../../src/models/index.js";
import config from "../../src/config/index.js";
import t from "../../src/bot/translations.js";

const replaceTitle = (boards, address) => {
  if (address === config.token.address) return "MAIN";

  const board = boards.find((a) => a.address === address);

  return board ? board.url : "BoardName";
};

export default async (boards, oldBalances, newBalances, walletInfo, tokenPrice = 0) => {
  try {
    const bought = newBalances.reduce((acc, n) => {
      const oldBalance = oldBalances.find((o) => o.token === n.token);
      const isMain = n.token === config.token.address;

      if (!oldBalance) {
        return [
          ...acc,
          {
            amount: (n.balance / 1e18).toFixed(isMain ? 0 : 4),
            percent: 100,
            token: replaceTitle(boards, n.token),
            address: n.token,
            isMain,
          },
        ];
      }

      if (n.balance - oldBalance.balance === 0) return acc;

      return [
        ...acc,
        {
          amount: ((n.balance - oldBalance.balance) / 1e18).toFixed(isMain ? 0 : 4),
          percent: ((n.balance / oldBalance.balance - 1) * 100).toFixed(2),
          token: replaceTitle(boards, n.token),
          address: n.token,
          isMain,
        },
      ];
    }, []);

    const sold = oldBalances.reduce((acc, o) => {
      const newBalance = newBalances.find((n) => n.token === o.token);
      const isMain = o.token === config.token.address;

      return !newBalance
        ? [
            ...acc,
            {
              amount: ((0 - o.balance) / 1e18).toFixed(isMain ? 0 : 4),
              percent: -100,
              token: replaceTitle(boards, o.token),
              address: o.token,
              isMain,
            },
          ]
        : acc;
    }, []);

    const differences = [...sold, ...bought];

    if (!differences.length) return;

    const dataWithPrice = differences.map(async (item) => {
      if (item.isMain) {
        item.price = (+tokenPrice).toFixed(5);
        item.totalPrice = Math.abs(+tokenPrice * item.amount).toFixed(1);

        return item;
      }

      const boardId = boards.find((b) => b.address === item.address);

      const lastBoardsSupply = await knex("supply")
        .where({ board_id: boardId ? boardId.id : 1 })
        .orderBy("id", "desc")
        .first();

      const boardPrice = (lastBoardsSupply.supply / 1e17 || 0).toFixed();

      item.price = boardPrice;
      item.totalPrice = Math.abs(boardPrice * item.amount).toFixed();

      return item;
    });

    const handledData = await Promise.all(dataWithPrice);

    const owner = walletInfo.username
      ? `<a href="https://main.community/u/${walletInfo.username}"><b>🪪 ${walletInfo.username}</b></a>\n`
      : `<a href="https://bscscan.com/address/${walletInfo.user_wallet}"><b>💰 0x${walletInfo.user_wallet.slice(-4)}</b></a>\n`;

    const ru = handledData
      .sort((a, b) => b.totalPrice - a.totalPrice)
      .reduce((acc, i) => {
        const sym0 = i.isMain ? "" : "-BC";
        const sym1 = i.isMain ? "$" : " MAIN";
        const sym2 = i.isMain ? "$" : "";

        return (
          (acc +=
            (!acc ? owner : "") +
            t.ru.userAssetTitle.replace("<%= asset %>", i.token + sym0) +
            "\n" +
            t.ru.userAmountTitle.replace("<%= amount %>", i.amount).replace("<%= percent %>", i.percent) +
            "\n" +
            t.ru.userCostTitle.replace("<%= cost %>", i.totalPrice + sym1).replace("<%= price %>", `${i.price}${sym2}`)) + "\n\n"
        );
      }, "");

    const en = handledData
      .sort((a, b) => b.totalPrice - a.totalPrice)
      .reduce((acc, i) => {
        const sym0 = i.isMain ? "" : "-BC";
        const sym1 = i.isMain ? "$" : " MAIN";
        const sym2 = i.isMain ? "$" : "";

        return (
          (acc +=
            (!acc ? owner : "") +
            t.en.userAssetTitle.replace("<%= asset %>", i.token + sym0) +
            "\n" +
            t.en.userAmountTitle.replace("<%= amount %>", i.amount).replace("<%= percent %>", i.percent) +
            "\n" +
            t.en.userCostTitle.replace("<%= cost %>", i.totalPrice + sym1).replace("<%= price %>", `${i.price}${sym2}`)) + "\n\n"
        );
      }, "");

    return {
      listener: "user-balance-change",
      value: walletInfo.id,
      text: { ru, en },
    };
  } catch (error) {
    console.error("📛 ~ error", error.message || error);
  }
};
