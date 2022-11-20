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
    table.enu("listener", ["new-board", "coin-price-change", "token-price-change"]);
    table.int("board_id");
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
    table.timestamp("time").notNullable().defaultTo(knex.fn.now());
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
