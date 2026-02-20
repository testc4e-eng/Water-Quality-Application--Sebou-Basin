// frontend/src/components/Charts/GaugeChart.jsx
import React from "react";
import Plot from "react-plotly.js";

export default function GaugeChart({ value = 82 }) {
  return (
    <Plot
      data={[
        {
          type: "indicator",
          mode: "gauge+number",
          value,
          gauge: { axis: { range: [0, 100] } },
        },
      ]}
      layout={{
        autosize: true,
        height: 280,
        margin: { l: 20, r: 20, t: 10, b: 10 },
      }}
      style={{ width: "100%" }}
      config={{ displayModeBar: false }}
    />
  );
}
