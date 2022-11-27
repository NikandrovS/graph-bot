import { knex } from "../../models/index.js";
import config from "../../config/index.js";
import axios from "axios";

export default async (text, listener, boardId, value) => {
  const userIds = await knex("listeners")
    .select("user_id", "language_code", "subscription_period")
    .leftJoin("users", "users.id", "listeners.user_id")
    .where({ listener })
    .modify((qb) => {
      if (boardId) qb.where({ board_id: boardId });
      if (value) qb.where({ value: value });
    });

  if (!userIds.length) return;

  for (const { user_id: id, language_code, subscription_period } of userIds) {
    // if (!subscription_period || new Date() > subscription_period) continue;

    const lang = language_code === "ru" ? "ru" : "en";

    try {
      await axios.get(
        `https://api.telegram.org/bot${config.botToken}/sendMessage?chat_id=${id}&text=${encodeURIComponent(
          text[lang]
        )}&disable_web_page_preview=true&parse_mode=HTML`
      );
    } catch (error) {
      console.log("📛 telegram api error:", error.message || error);
    }
  }
};
