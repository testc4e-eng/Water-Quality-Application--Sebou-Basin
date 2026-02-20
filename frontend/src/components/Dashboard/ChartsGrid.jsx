/* frontend/src/components/Dashboard/ChartsGrid.jsx */
import React from "react";
import TimeSeriesChart from "../Charts/TimeSeriesChart.jsx";
import ScatterPlotChart from "../Charts/ScatterPlotChart.jsx";
import HeatmapChart from "../Charts/HeatmapChart.jsx";
import GaugeChart from "../Charts/GaugeChart.jsx";

export default function ChartsGrid() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <div className="card" style={{ padding: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>
          Évolution Débit — Station A23
        </div>
        <TimeSeriesChart stationId={1} />
      </div>
      <div className="card" style={{ padding: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>
          Comparaison SWAT vs WASP
        </div>
        <ScatterPlotChart />
      </div>
      <div className="card" style={{ padding: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>
          Matrice Corrélations
        </div>
        <HeatmapChart />
      </div>
      <div className="card" style={{ padding: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>
          Indicateur Temps Réel
        </div>
        <GaugeChart value={82} />
      </div>
    </div>
  );
}
