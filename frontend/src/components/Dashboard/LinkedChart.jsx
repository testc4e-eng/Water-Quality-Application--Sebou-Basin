/* frontend/src/components/Dashboard/LinkedChart.jsx */
import React, { useMemo } from "react";
import TimeSeriesChart from "../Charts/TimeSeriesChart.jsx";
import { useSelection } from "../../context/SelectionContext.jsx";

export default function LinkedChart() {
  const { selectedStation, dateFrom, dateTo } = useSelection();

  const title = useMemo(() => {
    if (!selectedStation) return "Évolution Débit — (sélectionnez une station)";
    return `Évolution Débit — ${selectedStation.name}`;
  }, [selectedStation]);

  return (
    <div className="card" style={{ padding: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
      <TimeSeriesChart
        stationId={selectedStation?.id || 1}
        dateFrom={dateFrom}
        dateTo={dateTo}
      />
    </div>
  );
}
