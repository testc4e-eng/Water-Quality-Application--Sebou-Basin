import { useEffect, useState } from "react";
import {
  listClimateStations,
  getClimateStationStats,
} from "@/api/climate";

type Props = {
  onChange: (params: {
    stationId?: number;
    sourceType?: string;
    scenarioCode?: string;
    runId?: number;
    variable?: string;
    aggregation?: string;
    dateStart?: string;
    dateEnd?: string;
    tsId?: number;
  }) => void;
};

export default function ClimateFilters({ onChange }: Props) {
  const [stations, setStations] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);

  const [stationId, setStationId] = useState<number>();
  const [sourceType, setSourceType] = useState<string>();
  const [scenario, setScenario] = useState<any>();
  const [variable, setVariable] = useState<string>();
  const [aggregation, setAggregation] = useState<string>();
  const [dateStart, setDateStart] = useState<string>();
  const [dateEnd, setDateEnd] = useState<string>();

  const scenarioKey = scenario
    ? `${scenario.scenario_code}_${scenario.run_id}`
    : "";

  /* ===========================
     LOAD STATIONS
  =========================== */
  useEffect(() => {
    listClimateStations().then(setStations);
  }, []);

  /* ===========================
     LOAD STATION STATS
  =========================== */
 useEffect(() => {
  if (!stationId) return;

  getClimateStationStats(stationId).then((rows) => {
    setStats(rows);

    setSourceType(undefined);
    setScenario(undefined);
    setVariable(undefined);
    setAggregation(undefined);
    setDateStart(undefined);
    setDateEnd(undefined);

    onChange({});
  });
}, [stationId]);

  /* ===========================
     DERIVED LISTS
  =========================== */
  const sourceTypes = [...new Set(stats.map((r) => r.source_type))];

  const scenarios = stats.filter(
    (r) => r.source_type === sourceType
  );

  const scenarioItems = Array.from(
    new Map(
      scenarios.map((r) => [
        `${r.scenario_code}_${r.run_id}`,
        {
          label: r.scenario_name
            ? `${r.scenario_code} – ${r.scenario_name}`
            : r.scenario_code,
          scenario_code: r.scenario_code,
          run_id: r.run_id,
        },
      ])
    ).values()
  );

  const variables = stats
    .filter(
      (r) =>
        r.source_type === sourceType &&
        r.scenario_code === scenario?.scenario_code &&
        r.run_id === scenario?.run_id
    )
    .map((r) => r.property_name);

  const aggregations = stats
    .filter(
      (r) =>
        r.source_type === sourceType &&
        r.scenario_code === scenario?.scenario_code &&
        r.run_id === scenario?.run_id &&
        r.property_name === variable
    )
    .map((r) => r.time_step);

  /* ===========================
     HANDLE FINAL CHANGE
  =========================== */
  useEffect(() => {
    if (
      !stationId ||
      !sourceType ||
      !scenario?.scenario_code ||
      !scenario?.run_id ||
      !variable ||
      !aggregation
    ) {
      return;
    }

    const match = stats.find(
      (r: any) =>
        r.source_type === sourceType &&
        r.scenario_code === scenario.scenario_code &&
        r.run_id === scenario.run_id &&
        r.property_name === variable &&
        r.time_step === aggregation
    );



    if (!match) {
  console.warn("❌ No matching ts_id");
  return;
}

const start = match.dt_min?.slice(0, 10);
const end = match.dt_max?.slice(0, 10);

setDateStart(start);
setDateEnd(end);

onChange({
  stationId,
  sourceType,
  scenarioCode: scenario.scenario_code,
  runId: scenario.run_id,
  variable,
  aggregation,
  tsId: match.ts_id,
  dateStart: start,
  dateEnd: end,
});





  }, [stationId, sourceType, scenario, variable, aggregation, stats, onChange]);

  return (
    <div className="space-y-4">
      {/* STATION */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          <span className="text-sky-600">📍</span> Station
        </label>
        <Select
          value={stationId}
          onChange={setStationId}
          placeholder="Sélectionner une station..."
        >
          {stations.map((s) => (
            <option key={s.station_id} value={s.station_id}>
              {s.station_name}
            </option>
          ))}
        </Select>
      </div>

      {/* TYPE DE SÉRIE */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          <span className="text-purple-600">📊</span> Type de série
        </label>
        <Select
          value={sourceType}
          onChange={setSourceType}
          disabled={!stationId}
          placeholder="Sélectionner un type..."
        >
          {sourceTypes.map((s) => (
            <option key={s} value={s}>
              {s === "observed" ? "📋 Observé" : "🔄 Simulé"}
            </option>
          ))}
        </Select>
      </div>

      {/* SCÉNARIO */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          <span className="text-amber-600">🎯</span> Scénario
        </label>
        <Select
          value={scenarioKey}
          onChange={(v) =>
            setScenario(
              scenarioItems.find((s) => `${s.scenario_code}_${s.run_id}` === v)
            )
          }
          disabled={!sourceType || scenarioItems.length === 0}
          placeholder="Sélectionner un scénario..."
        >
          {scenarioItems.map((s) => (
            <option
              key={`${s.scenario_code}_${s.run_id}`}
              value={`${s.scenario_code}_${s.run_id}`}
            >
              {s.label}
            </option>
          ))}
        </Select>
      </div>

      {/* VARIABLE */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          <span className="text-emerald-600">📏</span> Variable
        </label>
        <Select
          value={variable}
          onChange={setVariable}
          disabled={!scenario}
          placeholder="Sélectionner une variable..."
        >
          {variables.map((v) => (
            <option key={v} value={v}>
              {v.includes("temperature") ? "🌡️ " : v.includes("precip") ? "☔ " : "📊 "}
              {v}
            </option>
          ))}
        </Select>
      </div>

      {/* AGRÉGATION */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          <span className="text-indigo-600">⏱️</span> Agrégation
        </label>
        <Select
          value={aggregation}
          onChange={setAggregation}
          disabled={!variable}
          placeholder="Sélectionner une agrégation..."
        >
          {aggregations.map((a) => (
            <option key={a} value={a}>
              {a === "daily" && "📅 Journalier"}
              {a === "monthly" && "📆 Mensuel"}
              {a === "annual" && "📅 Annuel"}
              {a === "instantaneous" && "⚡ Instantané"}
              </option>
          ))}
        </Select>
      </div>

      {/* DATES - READ ONLY */}
      <div className="space-y-2 pt-2">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          <span className="text-cyan-600">📆</span> Période disponible
        </label>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Début</label>
            <div className="relative">
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm"
                value={dateStart || ""}
                readOnly
              />
              <span className="absolute right-2 top-2.5 text-gray-400 text-xs">📅</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-500">Fin</label>
            <div className="relative">
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm"
                value={dateEnd || ""}
                readOnly
              />
              <span className="absolute right-2 top-2.5 text-gray-400 text-xs">📅</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 italic">Période déterminée par les données</p>
      </div>

      {/* BOUTON RÉINITIALISER */}
      {stationId && (
        <button
          onClick={() => {
  setStationId(undefined);
  setSourceType(undefined);
  setScenario(undefined);
  setVariable(undefined);
  setAggregation(undefined);
  setDateStart(undefined);
  setDateEnd(undefined);
  onChange({});
}}
          className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
        >
          <span>🔄</span> Réinitialiser
        </button>
      )}
    </div>
  );
}

/* ===========================
   REUSABLE SELECT STYLISÉ
=========================== */
function Select({ label, value, onChange, children, disabled, placeholder }: any) {
  return (
    <div className="relative">
      <select
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all outline-none text-sm appearance-none disabled:bg-gray-100 disabled:text-gray-500"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        disabled={disabled}
      >
        <option value="" disabled hidden>
          {placeholder || "Sélectionner..."}
        </option>
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}