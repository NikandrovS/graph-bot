import translations from "../translations.js";

export default (ctx, text, vars = {}, prefix = "", postfix = "") => {
  if (!ctx.update.update_id) return "Translation error, incorrect params";

  const dataObject = ctx.update.message ? "message" : "callback_query";
  const { language_code } = ctx.update[dataObject].from;
  const lang = translations[language_code] ? language_code : translations.defaultLang;

  let outputText = translations[lang][text];

  Object.entries(vars).forEach(([key, value]) => {
    outputText = outputText.replace(`<%= ${key} %>`, value);
  });

  return prefix + outputText + postfix || `Translation error, text: ${text}`;
};
