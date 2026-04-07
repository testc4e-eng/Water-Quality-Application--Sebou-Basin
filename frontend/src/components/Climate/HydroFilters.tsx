import { useEffect, useState } from "react";
import { fetchHydroStations } from "@/api/hydro";

export default function HydroFilters({
  rowsStats = [],
  selectedRow,
  aggregation,
  dateStart,
  dateEnd,
  onStationChange,
  onRowChange,
  onAggregationChange,
  onDateStartChange,
  onDateEndChange,
}: any) {
  const [stations, setStations] = useState<any[]>([]);

  useEffect(() => {
    fetchHydroStations().then(setStations);
  }, []);

  const scenarios = rowsStats.filter(
    (r: any) =>
      r.time_step === aggregation &&
      r.ts_id != null
  );

  return (
    <div className="space-y-3">
      {/* STATION */}
      <select
        className="w-full border p-2"
        value=""
        onChange={(e) => onStationChange(Number(e.target.value))}
      >
        <option value="">— Station —</option>
        {stations.map((s) => (
          <option key={s.station_id} value={s.station_id}>
            {s.station_name}
          </option>
        ))}
      </select>

      {/* SCENARIO */}
      <select
        className="w-full border p-2"
        value={selectedRow?.ts_id ?? ""}
        onChange={(e) => {
          const tsId = Number(e.target.value);
          const row = scenarios.find((r: any) => r.ts_id === tsId);
          if (row) onRowChange(row);
        }}
      >
        <option value="">— Scénario —</option>
        {scenarios.map((r: any) => (
          <option key={r.ts_id} value={r.ts_id}>
            {r.source_type.toUpperCase()} – {r.scenario_name}
          </option>
        ))}
      </select>

      {/* AGGREGATION */}
      <select
        className="w-full border p-2"
        value={aggregation}
        onChange={(e) => {
          const agg = e.target.value;
          onAggregationChange(agg);

          const next = rowsStats.find(
            (r: any) => r.time_step === agg
          );
          if (next) onRowChange(next);
        }}
      >
        <option value="daily">Journalier</option>
        <option value="monthly">Mensuel</option>
        <option value="annual">Annuel</option>
      </select>

      {/* DATES */}
      <input
        type="date"
        className="w-full border p-2"
        value={dateStart}
        onChange={(e) => onDateStartChange(e.target.value)}
      />
      <input
        type="date"
        className="w-full border p-2"
        value={dateEnd}
        onChange={(e) => onDateEndChange(e.target.value)}
      />
    </div>
  );
}
