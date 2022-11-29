export default {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  description: "A basic line chart example.",
  width: 1400,
  height: 800,
  padding: 15,
  config: { title: { fontSize: 36 } },
  title: { text: "MAIN", color: "white" },
  background: "#231d24",
  signals: [
    {
      name: "interpolate1",
      value: "linear",
      bind: {
        input: "linear",
        options: ["basis", "cardinal", "catmull-rom", "linear", "monotone", "natural", "step", "step-after", "step-before"],
      },
    },
  ],
  scales: [
    {
      name: "x",
      type: "utc",
      range: "width",
      domain: { data: "table", field: "time" },
    },
    {
      name: "yr",
      type: "linear",
      range: "height",
      nice: true,
      zero: false,
      domain: { data: "table", field: "supply" },
    },
    {
      name: "yl",
      type: "linear",
      range: "height",
      nice: true,
      zero: false,
      domain: { data: "table", field: "holders" },
    },
  ],
  axes: [
    {
      orient: "bottom",
      scale: "x",
      labelColor: "white",
      format: "%b-%d %H:%M",
      labelFontSize: 20,
      labelFlush: true,
      tickCount: 5,
    },
    {
      orient: "right",
      scale: "yr",
      labelColor: "white",
      grid: true,
      gridColor: "#dedede",
      labelFontSize: 20,
    },
    {
      orient: "left",
      scale: "yl",
      labelColor: "white",
      labelFontSize: 20,
    },
  ],
  marks: [
    {
      type: "group",
      marks: [
        {
          type: "line",
          from: { data: "table" },
          encode: {
            enter: {
              x: { scale: "x", field: "time" },
              y: { scale: "yr", field: "supply" },
              stroke: { value: "#fdb134" },
              strokeWidth: { value: 3 },
            },
          },
        },
        {
          type: "symbol",
          from: { data: "dots" },
          encode: {
            enter: {
              x: { scale: "x", field: "time" },
              y: { scale: "yr", field: "supply" },
              stroke: { value: "#7d61d4" },
              strokeWidth: { value: 1.5 },
              fill: { value: "white" },
              size: { value: 50 },
            },
          },
        },
        {
          type: "line",
          from: { data: "table" },
          encode: {
            enter: {
              x: { scale: "x", field: "time" },
              y: { scale: "yl", field: "holders" },
              stroke: { value: "#3480fd" },
              strokeWidth: { value: 3 },
            },
          },
        },
        {
          type: "symbol",
          from: { data: "holderDots" },
          encode: {
            enter: {
              x: { scale: "x", field: "time" },
              y: { scale: "yl", field: "holders" },
              stroke: { value: "#7d61d4" },
              strokeWidth: { value: 1.5 },
              fill: { value: "white" },
              size: { value: 50 },
            },
          },
        },
      ],
    },
  ],
};