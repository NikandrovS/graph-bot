export default {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: 900,
  height: 450,
  title: {
    text: "MAIN/USD Price Chart Past 24 Hours",
    fontSize: 28,
    color: "black",
    subtitleFontSize: 24,
    subtitleFontWeight: 600,
    subtitlePadding: 10,
  },
  padding: 20,
  mark: {
    type: "area",
    line: { color: "#8f7adc" },
    color: {
      x1: 1,
      y1: 1,
      x2: 1,
      y2: 0,
      gradient: "linear",
      stops: [
        { offset: 0, color: "#8f7adc" },
        { offset: 1, color: "#8f7adc00" },
      ],
    },
  },
  encoding: {
    x: {
      title: "",
      field: "date",
      type: "temporal",
      axis: { format: "%H", tickCount: 6, labelFontSize: 23, tickSize: 10, tickWidth: 3 },
    },
    y: {
      title: "",
      field: "price",
      type: "quantitative",
      scale: { zero: false, nice: true },
      axis: { tickCount: 6, labelFontSize: 23, tickSize: 10, tickWidth: 3 },

      stack: null,
    },
  },
};
