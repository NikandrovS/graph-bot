import { knex } from "../../models/index.js";
import config from "../../config/index.js";
import axios from "axios";

export default async (text, listener, boardId, range) => {
  const result = await knex("listeners")
    .select("user_id", "language_code", "subscription_period", "value")
    .leftJoin("users", "users.id", "listeners.user_id")
    .where({ listener })
    .modify((qb) => {
      if (boardId) qb.where({ board_id: boardId });
      if (range) qb.whereBetween("value", range);
    });

  if (!result.length) return;

  await knex("listeners")
    .del()
    .where({ listener })
    .modify((qb) => {
      if (boardId) qb.where({ board_id: boardId });
      if (range) qb.whereBetween("value", range);
    });

  const userIds = result.reduce((acc, n) => {
    const isExists = acc.find((u) => u.user_id === n.user_id);

    if (!isExists) {
      const userNotifiers = result.reduce((acc, item) => (item.user_id === n.user_id ? [...acc, item.value] : acc), []);

      n.executedNotifications = userNotifiers.sort().join("$, ") + "$";
      acc.push(n);
    }

    return acc;
  }, []);

  for (const { user_id: id, language_code, executedNotifications } of userIds) {
    const lang = language_code === "ru" ? "ru" : "en";

    try {
      await axios.get(
        `https://api.telegram.org/bot${config.botToken}/sendMessage?chat_id=${id}&text=${encodeURIComponent(
          text[lang].replace("<%= executedNotifications %>", executedNotifications)
        )}&disable_web_page_preview=true&parse_mode=HTML`
      );
    } catch (error) {
      console.log('📛 telegram api error:', error.message || error);
    }
  }
};
