/* frontend/src/components/Charts/TimeSeriesChart.jsx */
import React from "react";
import Plot from "react-plotly.js";

/**
 * Props attendues :
 * - data: Array<{ date: string, discharge_m3s?, temperature_c?, precipitation_mm? }>
 * - showPrecipitation?: boolean
 * - showDischarge?: boolean
 * - showTemperature?: boolean
 * - showGrid?: boolean
 */
export default function TimeSeriesChart({
  data = [],
  showPrecipitation = true,
  showDischarge = true,
  showTemperature = true,
  showGrid = true,
}) {
  const x = data.map((d) => d.date);

  const traces = [];

  if (showDischarge) {
    const y = data.map((d) =>
      typeof d.discharge_m3s === "number" ? d.discharge_m3s : null
    );
    if (y.some((v) => v !== null)) {
      traces.push({
        x,
        y,
        type: "scatter",
        mode: "lines+markers",
        name: "Débit (m³/s)",
      });
    }
  }

  if (showTemperature) {
    const y = data.map((d) =>
      typeof d.temperature_c === "number" ? d.temperature_c : null
    );
    if (y.some((v) => v !== null)) {
      traces.push({
        x,
        y,
        type: "scatter",
        mode: "lines+markers",
        name: "Température (°C)",
        yaxis: "y2",
      });
    }
  }

  if (showPrecipitation) {
    const y = data.map((d) =>
      typeof d.precipitation_mm === "number" ? d.precipitation_mm : null
    );
    if (y.some((v) => v !== null)) {
      traces.push({
        x,
        y,
        type: "bar",
        name: "Précipitations (mm)",
        yaxis: "y3",
        opacity: 0.6,
      });
    }
  }

  return (
    <Plot
      data={traces}
      layout={{
        margin: { t: 40, l: 50, r: 30, b: 50 },
        xaxis: { title: "Date", showgrid: showGrid },
        yaxis: { title: "Débit (m³/s)", showgrid: showGrid },
        yaxis2: {
          title: "Température (°C)",
          overlaying: "y",
          side: "right",
          showgrid: false,
        },
        yaxis3: {
          title: "Précipitations (mm)",
          overlaying: "y",
          side: "right",
          position: 1,
          showgrid: false,
        },
        legend: { orientation: "h" },
        title: "Séries temporelles",
      }}
      style={{ width: "100%", height: "400px" }}
      config={{ displayModeBar: false }}
    />
  );
}
