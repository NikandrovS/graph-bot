import translations from "../translations.js";

import { knex } from "../../models/index.js";

export default async (ctx) => {
  const { id, first_name, username, language_code } = ctx.update.message.from;
  const lang = translations[language_code] ? language_code : translations.defaultLang;

  const user = await knex("users").where({ id }).first();

  if (user) return ctx.reply(translations[lang].alreadyStarted);

  await knex("users").insert({ id, first_name, username, language_code });

  await ctx.reply(translations[lang].welcome);
  return ctx.reply(translations[lang].welcomeGuide);
};
