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
      .select("boards.*", "supply.supply")
      .rightJoin({ sup: knex.raw(`(${sortedSupply})`) }, function () {
        this.on("sup.my_id", "=", "supply.board_id").andOn("sup.my_time", "=", "supply.time");
      })
      .leftJoin("boards", "boards.id", "supply.board_id")
      .orderBy("time", "desc");

    (function myLoop(arr) {
      setTimeout(async function () {
        if (!arr.length) return;

        const { id, url, address, supply } = arr.shift();

        try {
          const { data } = await axios.get("https://api.bscscan.com/api", {
            params: {
              module: "stats",
              action: "tokenSupply",
              contractaddress: address,
              apikey: process.env.BSC_API_KEY,
            },
          });

          await knex("supply").insert({ supply: data.result, board_id: id, time });

          if (supply !== data.result) {
            const msg = generateCoinPriceMessage(id, url, supply, data.result);

            rabbitService.send(msg);
          }
        } catch (error) {
          console.log("⚠️ ~ error", error);
        }

        myLoop(arr);
      }, 260);
    })(boards);
  } catch (error) {
    console.error(error);
  }
};
