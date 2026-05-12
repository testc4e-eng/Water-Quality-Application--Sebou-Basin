import { useEffect, useMemo, useState } from "react";
import type { HydroIdentifier } from "@/api/hydro";

type Props = {
  stations: any[];
  stationsLoading?: boolean;
  rowsStats: any[];
  selectedRow: any | null;
  dateStart: string;
  dateEnd: string;
  onStationChange: (id: HydroIdentifier | null) => void;
  onRowChange: (row: any | null) => void;
  onDateStartChange: (v: string) => void;
  onDateEndChange: (v: string) => void;
};

type Agg = "instantaneous" | "daily" | "monthly" | "annual";

const aggLabelMap: Record<Agg, string> = {
  instantaneous: "Instantane",
  daily: "Journalier",
  monthly: "Mensuel",
  annual: "Annuel",
};

export default function HydroFiltersSimple({
  stations,
  stationsLoading = false,
  rowsStats,
  selectedRow,
  dateStart,
  dateEnd,
  onStationChange,
  onRowChange,
  onDateStartChange,
  onDateEndChange,
}: Props) {
  const [stationId, setStationId] = useState<HydroIdentifier | undefined>(undefined);
  const [sourceType, setSourceType] = useState<"observed" | "simulated" | undefined>(undefined);
  const [aggChoice, setAggChoice] = useState<Agg | "">("");

  const rowsBySource = useMemo(
    () => rowsStats.filter((row) => row.source_type === sourceType),
    [rowsStats, sourceType],
  );

  const availableAggs = useMemo(() => {
    const set = new Set<Agg>();
    for (const row of rowsBySource) {
      if (row.time_step) set.add(row.time_step);
    }
    return ["daily", "monthly", "annual"].filter((agg) => set.has(agg as Agg)) as Agg[];
  }, [rowsBySource]);

  useEffect(() => {
    if (!sourceType) {
      onRowChange(null);
      return;
    }

    if (sourceType === "observed") {
      const observedRow =
        rowsBySource.find((row) => row.time_step === "instantaneous") ??
        rowsBySource.find((row) => row.time_step === "daily") ??
        rowsBySource[0] ??
        null;

      setAggChoice(observedRow?.time_step ?? "");
      onRowChange(observedRow);
      return;
    }

    if (!aggChoice) {
      onRowChange(null);
      return;
    }

    const selected = rowsBySource.find((row) => row.time_step === aggChoice) ?? null;
    onRowChange(selected);
  }, [sourceType, aggChoice, rowsBySource, onRowChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-700">
          <span className="text-blue-600">📍</span> Station
        </label>
        <select
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
          value={stationId ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            const id = value || undefined;
            setStationId(id);
            setSourceType(undefined);
            setAggChoice("");
            onStationChange(id ?? null);
            onRowChange(null);
            onDateStartChange("");
            onDateEndChange("");
          }}
        >
          <option value="">
            {stationsLoading ? "Chargement des stations..." : "Selectionner une station..."}
          </option>
          {stations.map((station) => (
            <option key={station.station_id} value={station.station_id}>
              {station.station_name}
            </option>
          ))}
        </select>
        {!stationsLoading && stations.length > 0 && (
          <p className="text-[11px] text-gray-400">{stations.length} stations chargees</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-700">
          <span className="text-cyan-600">💧</span> Variable
        </label>
        <input
          className="w-full rounded-lg border border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50 px-3 py-2.5 text-sm font-medium text-gray-800"
          value="Debit (m3/s)"
          disabled
        />
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-700">
          <span className="text-purple-600">📊</span> Type de serie
        </label>
        <select
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-all focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500"
          value={sourceType ?? ""}
          onChange={(e) => {
            const value = (e.target.value || undefined) as "observed" | "simulated" | undefined;
            setSourceType(value);
            setAggChoice("");
            onRowChange(null);
            onDateStartChange("");
            onDateEndChange("");
          }}
          disabled={!stationId}
        >
          <option value="">Selectionner un type...</option>
          {Array.from(new Set(rowsStats.map((row) => row.source_type)))
            .filter(Boolean)
            .map((type) => (
              <option key={type} value={type}>
                {type === "observed" ? "Observe" : "Simule"}
              </option>
            ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-700">
          <span className="text-emerald-600">⏱️</span> Agregation
        </label>
        <select
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:text-gray-500"
          value={aggChoice}
          onChange={(e) => setAggChoice(e.target.value as Agg)}
          disabled={!sourceType || (sourceType === "simulated" && availableAggs.length === 0)}
        >
          <option value="">Selectionnez une agregation...</option>
          {sourceType === "observed" && selectedRow && (
            <option value={selectedRow.time_step}>{aggLabelMap[selectedRow.time_step as Agg] ?? selectedRow.time_step}</option>
          )}
          {sourceType === "simulated" &&
            availableAggs.map((agg) => (
              <option key={agg} value={agg}>
                {aggLabelMap[agg]}
              </option>
            ))}
        </select>
      </div>

      <div className="space-y-3 pt-2">
        <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-700">
          <span className="text-indigo-600">📆</span> Periode
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Debut</label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
              value={dateStart}
              disabled={!selectedRow}
              onChange={(e) => onDateStartChange(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Fin</label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
              value={dateEnd}
              disabled={!selectedRow}
              onChange={(e) => onDateEndChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {(stationId || sourceType || selectedRow) && (
        <button
          onClick={() => {
            setStationId(undefined);
            setSourceType(undefined);
            setAggChoice("");
            onStationChange(null);
            onRowChange(null);
            onDateStartChange("");
            onDateEndChange("");
          }}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:from-gray-200 hover:to-gray-300"
        >
          <span>🔄</span> Reinitialiser
        </button>
      )}
    </div>
  );
}
