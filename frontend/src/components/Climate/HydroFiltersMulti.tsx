import { useEffect, useState } from "react";
import { fetchHydroStations, type HydroIdentifier } from "@/api/hydro";

export default function HydroFiltersMulti({
  rowsStats,
  selectedRows,
  dateStart,
  dateEnd,
  onStationChange,
  onSelectionChange,
  onDateStartChange,
  onDateEndChange,
  onAggregationChange,
}: any) {

  const [stations, setStations] = useState<any[]>([]);
  const [stationId, setStationId] = useState<HydroIdentifier>();
  const [aggregation, setAggregation] = useState("daily");

  useEffect(() => {
    fetchHydroStations().then(setStations);
  }, []);

  // ✅ Déduplication scénarios
  const uniqueScenarios = Array.from(
    new Map(
      rowsStats.map((r: any) => [
        `${r.source_type}-${r.scenario_code}-${r.run_id}`,
        r,
      ])
    ).values()
  );

const realTimeStepLabel =
  selectedRows.length > 0
    ? selectedRows[0].time_step === "daily"
      ? "Journalier"
      : selectedRows[0].time_step === "monthly"
      ? "Mensuel"
      : selectedRows[0].time_step === "annual"
      ? "Annuel"
      : "Instantané"
    : "";














  return (
    <div className="space-y-5">

      {/* STATION */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          <span className="text-blue-600">📍</span> Station de mesure
        </label>

        <select
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50"
          value={stationId ?? ""}
          onChange={(e) => {
            const id = e.target.value || undefined;
            setStationId(id);
            onStationChange(id);
          }}
        >
          <option value="">Sélectionner une station...</option>
          {stations.map((s) => (
            <option key={s.station_id} value={s.station_id}>
              {s.station_name}
            </option>
          ))}
        </select>
      </div>

      {/* SCÉNARIOS */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          🎯 Scénarios ({selectedRows.length}/{uniqueScenarios.length})
        </label>

        <div className="max-h-56 overflow-y-auto border rounded-lg bg-gray-50 p-2 space-y-1.5">
          {uniqueScenarios.length === 0 ? (
            <div className="text-gray-400 text-sm text-center">
              Sélectionnez d'abord une station
            </div>
          ) : (
            uniqueScenarios.map((r: any, idx: number) => {

              const isChecked = selectedRows.some(
                (sr: any) =>
                  sr.scenario_code === r.scenario_code &&
                  sr.source_type === r.source_type &&
                  sr.run_id === r.run_id
              );

              return (
                <label
                  key={`${r.source_type}-${r.scenario_code}-${r.run_id}`}
                  className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {

                      if (e.target.checked) {

                        const matchingRow = rowsStats.find(
                          (row: any) =>
                            row.scenario_code === r.scenario_code &&
                          row.source_type === r.source_type &&
                          row.run_id === r.run_id &&
                          (
                            row.source_type === "observed"
                            ? row.time_step === "instantaneous"
                            : row.time_step === aggregation
                          )
                        );


                        if (matchingRow) {
                          onSelectionChange([...selectedRows, matchingRow]);
                        }

                      } else {
                        onSelectionChange(
                          selectedRows.filter(
                            (sr: any) =>
                              !(
                                sr.scenario_code === r.scenario_code &&
                                sr.source_type === r.source_type &&
                                sr.run_id === r.run_id
                              )
                          )
                        );
                      }
                    }}
                  />

                  <div className="flex-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {r.source_type}
                    </span>
                    <span className="ml-2 text-sm text-gray-700">
                      {r.scenario_name}
                    </span>
                  </div>
                </label>
              );
            })
          )}
        </div>
      </div>

     {/* AGRÉGATION MULTI */}
<div className="space-y-2">
  <label className="text-sm font-semibold text-gray-700">
    ⏱️ Agrégation simulée
  </label>

  <select
    value={aggregation}
    onChange={(e) => {
      setAggregation(e.target.value);
      onAggregationChange(e.target.value);
    }}
    className="w-full border rounded-lg px-3 py-2.5"
  >
    <option value="real">
  {realTimeStepLabel
    ? `Réelle (BD - ${realTimeStepLabel})`
    : "Réelle (BD)"}
</option>

    <option value="monthly">Mensuel</option>
    <option value="annual">Annuel</option>
  </select>
</div>


      {/* DATES */}
      <div className="grid grid-cols-2 gap-2">
        <input
          type="date"
          value={dateStart}
          onChange={(e) => onDateStartChange(e.target.value)}
          className="border rounded-lg px-3 py-2.5"
        />

        <input
          type="date"
          value={dateEnd}
          onChange={(e) => onDateEndChange(e.target.value)}
          className="border rounded-lg px-3 py-2.5"
        />
      </div>

    </div>
  );
}
