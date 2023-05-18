import { fetchBoards } from "./src/crons/parseBoards.js";
import { knex } from "./src/models/index.js";

const tables = [
  knex.schema.createTable("boards", (table) => {
    table.increments("id");
    table.string("title");
    table.string("url").notNullable();
    table.specificType("address", "CHAR(42)").notNullable().unique();
    table.charset("utf8mb4");
    table.collate("utf8mb4_unicode_ci");
  }),
  knex.schema.createTable("supply", (table) => {
    table.increments("id");
    table.decimal("supply", 21, 0).notNullable();
    table.integer("holders").unsigned();
    table.float("price_usd", 6, 2);
    table.float("price_bnb", 6, 2);
    table.integer("board_id").unsigned().references("boards.id").notNullable();
    table.timestamp("time").notNullable().defaultTo(knex.fn.now());
    table.charset("utf8mb4");
    table.collate("utf8mb4_unicode_ci");
  }),
  knex.schema.createTable("users", (table) => {
    table.bigint("id");
    table.string("first_name");
    table.string("username").defaultTo("username");
    table.specificType("language_code", "CHAR(2)").notNullable();
    table.integer("attempts").defaultTo(0);
    table.timestamp("subscription_period").defaultTo(null);
  }),
  knex.schema.createTable("vouchers", (table) => {
    table.increments("id");
    table.integer("user_id").notNullable();
    table.integer("amount").notNullable();
    table.specificType("voucher", "CHAR(7)").notNullable().unique();
    table.enu("status", ["paid", "unpaid"]).defaultTo("unpaid").notNullable();
    table.enu("period", ["1", "6", "12", "1200"]).notNullable();
  }),
  knex.schema.createTable("config", (table) => {
    table.string("key").notNullable();
    table.string("value");
  }),
  knex.schema.createTable("listeners", (table) => {
    table.bigint("user_id");
    table.enu("listener", ["new-board", "coin-price-change", "token-price-change", "user-balance-change"]);
    table.integer("board_id");
    table.string("value");
  }),
  knex.schema.createTable("board_requests", (table) => {
    table.increments("id");
    table.bigint("user_id").notNullable();
    table.integer("board_id").notNullable();
    table.string("url").notNullable();
    table.timestamp("time").notNullable().defaultTo(knex.fn.now());
  }),
  knex.schema.createTable("token_price", (table) => {
    table.increments("id");
    table.decimal("usd_price", 19, 18).notNullable();
    table.decimal("bnb_price", 19, 18).notNullable();
    table.timestamp("time").notNullable().defaultTo(knex.fn.now());
    table.decimal("liquidity", 22, 18).unsigned().notNullable();
    table.decimal("volume_24h", 22, 18).unsigned().notNullable();
  }),
  knex.schema.createTable("users_wallets", (table) => {
    table.increments("id");
    table.string("username");
    table.specificType("user_wallet", "CHAR(42)").notNullable().unique();
  }),
  knex.schema.createTable("wallets_balances", (table) => {
    table.specificType("wallet", "CHAR(42)").notNullable();
    table.specificType("token", "CHAR(42)").notNullable();
    table.decimal("balance", 26, 0).notNullable().unsigned();
  }),
];

(async () => {
  await Promise.all(
    tables.map((p) =>
      p.catch((e) => {
        if (e.code !== "ER_TABLE_EXISTS_ERROR") console.log(e.sqlMessage);
      })
    )
  );

  await fetchBoards();

  console.log("✅ done");
})();
