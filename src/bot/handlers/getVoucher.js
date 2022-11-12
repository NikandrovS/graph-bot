import { knex } from "../../models/index.js";

export const getVoucher = async () => {
  const defaultCount = 3;

  const packs = {
    abc: "ABCDEFGHIJKLMNPQRSTUVWXYZ",
    num: "0123456789",
  };

  const gen = (c, s) => [...Array(c).keys()].map(() => s[Math.floor(Math.random() * s.length)]).join("");

  const voucher = gen(defaultCount, packs.abc) + "-" + gen(defaultCount, packs.num);

  const isExists = await knex("vouchers").where({ voucher }).first();

  return isExists ? getVoucher() : voucher;
};
