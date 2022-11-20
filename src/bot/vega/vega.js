import text from "../handlers/translatedText.js";
import vegaConfig from "./vegaConfig.js";
import vega from "vega";

import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
const __dirname = path.dirname("./");

export default (data, ctx, currentPrice) => {
  const spec = vegaConfig;
  spec.title.text = "b/" + ctx.scene.state.url;
  spec.data = data;

  const view = new vega.View(vega.parse(spec), { renderer: "none" });

  // generate a static PNG image
  view
    .toCanvas()
    .then(function (canvas) {
      const name = uuid();
      const out = fs.createWriteStream(__dirname + `/${name}.jpeg`);
      const stream = canvas.createJPEGStream({
        quality: 0.75,
        chromaSubsampling: false,
      });

      stream.pipe(out);
      out.on("finish", async () => {
        await ctx.replyWithPhoto(
          { source: `./${name}.jpeg` },
          {
            caption: `📋 ${text(ctx, "chartTitleBoard")}: ${ctx.scene.state.title}\n💸 ${text(ctx, "chartTitlePrice")}: ${currentPrice}`,
          }
        );
        fs.unlinkSync(__dirname + `/${name}.jpeg`);
      });
    })
    .catch(function (err) {
      console.error(err);
    });
};
