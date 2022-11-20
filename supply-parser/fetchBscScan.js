import generateCoinPriceMessage from "../supply-parser/generateCoinPriceMessage.js";
import rabbitService from "../supply-parser/RabbitService.js";
import { knex } from "../src/models/index.js";
import axios from "axios";

export default async () => {
  try {
    const time = new Date().toISOString().slice(0, 19).replace("T", " ");

    const lastSupply = knex("supply").orderBy("time", "desc").limit(4000).toString();
    const sortedSupply = knex({ last: knex.raw(`(${lastSupply})`) })
      .select("board_id AS my_id")
      .max("time as my_time")
      .groupBy("board_id")
      .toString();

    const boards = await knex({ supply: knex.raw(`(${lastSupply})`) })
      .select("boards.*", "supply.supply", "supply.holders")
      .rightJoin({ sup: knex.raw(`(${sortedSupply})`) }, function () {
        this.on("sup.my_id", "=", "supply.board_id").andOn("sup.my_time", "=", "supply.time");
      })
      .leftJoin("boards", "boards.id", "supply.board_id")
      .orderBy("time", "desc");

    const tokenPrice = await knex("token_price").orderBy("id", "desc").first();

    (function myLoop(arr) {
      setTimeout(async function () {
        if (!arr.length) return;

        const { id, url, address, supply, holders } = arr.shift();

        try {
          const { data } = await axios.get("https://api.bscscan.com/api", {
            params: {
              module: "stats",
              action: "tokenSupply",
              contractaddress: address,
              apikey: process.env.BSC_API_KEY,
            },
          });

          const priceUsd = ((data.result / 100000000000000000) * tokenPrice.usd_price).toFixed(2);

          const insertObject = { supply: data.result, board_id: id, time, holders, price_usd: priceUsd };

          if (supply !== data.result) {
            const msg = generateCoinPriceMessage(id, url, supply, data.result);

            rabbitService.send(msg);

            try {
              const res = await axios.get("https://app.main.community/tags/url/" + url);

              insertObject.holders = res.data.coin.holdersCount;
            } catch (error) {
              console.log("fetch board error");
            }
          }

          await knex("supply").insert(insertObject);
        } catch (error) {
          console.log("⚠️ ~ error", error);
        }

        myLoop(arr);
      }, 210);
    })(boards);
  } catch (error) {
    console.error(error);
  }
};
