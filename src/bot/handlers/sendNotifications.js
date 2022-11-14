import { knex } from "../../models/index.js";
import config from "../../config/index.js";
import axios from "axios";

export default async (text, listener, value = null) => {
  const userIds = await knex("listeners")
    .select("user_id", "language_code")
    .leftJoin("users", "users.id", "listeners.user_id")
    .where({ listener })
    .modify((qb) => {
      if (value) qb.where({ value });
    });

  if (!userIds.length) return;

  for (const { user_id: id, language_code } of userIds) {
    const lang = language_code === "ru" ? "ru" : "en";
    await axios.get(
      `https://api.telegram.org/bot${config.botToken}/sendMessage?chat_id=${id}&text=${encodeURIComponent(
        text[lang]
      )}&disable_web_page_preview=true&parse_mode=HTML`
    );
  }
};
