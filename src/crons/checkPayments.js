import translations from "../bot/translations.js";
import { knex } from "../models/index.js";
import { CronJob } from "cron";
import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

export default () => {
  const job = new CronJob("0 */3 * * * *", fetchPayments, null, true, "Europe/Moscow");
};

export const fetchPayments = async () => {
  try {
    const config = await knex("config").where({ key: "access-token" }).first();

    const { data } = await axios.get("https://app.main.community/transfers", {
      headers: {
        "access-token": config.value,
      },
    });

    if (!data) return;

    // const data = {
    //   items: [
    //     {
    //       from: [Object],
    //       to: [Object],
    //       amount: 1000,
    //       message: "IMR-302",
    //       id: 10,
    //       date: "2019-10-04T11:45:15.83872Z",
    //     },
    //   ],
    // };

    const regExp = /[A-Z]{3}-[0-9]{3}/gm;

    const msgs = data.items.reduce(
      (acc, { amount, message }) => (regExp.test(message) ? [...acc, { amount, voucher: message.match(regExp)[0] }] : acc),
      []
    );

    for (const { voucher, amount } of msgs) {
      const unpaidVoucher = await knex("vouchers").where({ voucher, status: "unpaid" }).where("amount", "<=", amount).first();

      if (unpaidVoucher) {
        const trx = await knex.transaction();

        try {
          const user = await knex("users").where({ id: unpaidVoucher.user_id }).first();
          const date = user.subscription_period || new Date();
          date.setMonth(date.getMonth() + +unpaidVoucher.period);

          const lang = user.language_code;
          const messageLang = translations[lang] ? lang : translations.defaultLang;

          await trx("vouchers").update({ status: "paid" }).where({ id: unpaidVoucher.id });
          await trx("users")
            .where({ id: unpaidVoucher.user_id })
            .update({ subscription_period: date < "2038-01-01 23:59:59" ? date : "2038-01-01 23:59:59" });

          await trx.commit();

          await axios.get(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${
              unpaidVoucher.user_id
            }&text=${encodeURIComponent(translations[messageLang].paymentRecieved.replace("<%= voucher %>", unpaidVoucher.voucher))}`
          );
        } catch (error) {
          await trx.rollback();
          console.error(error.messa || error);
        }
      }
    }
  } catch (error) {
    console.log("⚠️ ~ error", error);
  }
};
