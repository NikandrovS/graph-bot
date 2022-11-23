import mainConfig from "./vegaConfigMain.js";
import usdtConfig from "./vegaConfigUsdt.js";
import mainHoldersConfig from "./vegaConfigMainHolders.js";
import usdtHoldersConfig from "./vegaConfigUsdtHolders.js";
import vega from "vega";

import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
const __dirname = path.dirname("./");

export default (type, data, ctx, caption) => {
  const config = {
    main: mainConfig,
    mainHolders: mainHoldersConfig,
    usdt: usdtConfig,
    usdtHolders: usdtHoldersConfig,
  };

  const spec = config[type];
  spec.title.text = "b/" + ctx.scene.state.url;
  spec.data = data;

  if (["mainHolders", "usdtHolders"].includes(type)) {
    const idx = spec.scales.findIndex((s) => s.name === "yl");

    const largest = data[0].values.reduce((acc, v) => (v.holders > acc ? v.holders : acc), 0) + 4;
    const smallest = largest > 4 ? data[0].values.reduce((acc, v) => (v.holders < acc ? v.holders : acc), largest) - 4 : 0;

    spec.scales[idx].domainMin = smallest;
    spec.scales[idx].domainMax = largest;
  }

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
        await ctx.replyWithPhoto({ source: `./${name}.jpeg` }, { caption });
        fs.unlinkSync(__dirname + `/${name}.jpeg`);
      });
    })
    .catch(function (err) {
      console.error(err);
    });
};
