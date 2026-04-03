import { useEffect, useMemo, useState } from "react";
import { getClimateStationStats, listClimateStations } from "@/api/climate";

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

type ScenarioItem = {
  key: string;
  label: string;
  scenario_code: string;
  run_id: number;
};

export default function ClimateFilters({ onChange }: Props) {
  const [stations, setStations] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);

  const [stationId, setStationId] = useState<number | undefined>(undefined);
  const [sourceType, setSourceType] = useState<string | undefined>(undefined);
  const [scenario, setScenario] = useState<ScenarioItem | undefined>(undefined);
  const [variable, setVariable] = useState<string | undefined>(undefined);
  const [aggregation, setAggregation] = useState<string | undefined>(undefined);
  const [dateStart, setDateStart] = useState<string | undefined>(undefined);
  const [dateEnd, setDateEnd] = useState<string | undefined>(undefined);

  const scenarioKey = scenario ? `${scenario.scenario_code}_${scenario.run_id}` : "";

  useEffect(() => {
    listClimateStations().then(setStations);
  }, []);

  useEffect(() => {
    if (!stationId) {
      setStats([]);
      return;
    }

    getClimateStationStats(stationId).then((rows) => {
      setStats(rows || []);

      // reset cascade after station change
      setSourceType(undefined);
      setScenario(undefined);
      setVariable(undefined);
      setAggregation(undefined);
      setDateStart(undefined);
      setDateEnd(undefined);
      onChange({});
    });
  }, [stationId, onChange]);

  const sourceTypes = useMemo(
    () =>
      Array.from(
        new Set((stats || []).map((r) => String(r.source_type || "").toLowerCase()))
      ).filter(Boolean),
    [stats]
  );

  const scenariosForType = useMemo(
    () =>
      (stats || []).filter(
        (r) =>
          String(r.source_type || "").toLowerCase() ===
          String(sourceType || "").toLowerCase()
      ),
    [stats, sourceType]
  );

  const scenarioItems = useMemo(
    () =>
      Array.from(
        new Map(
          scenariosForType.map((r) => {
            const key = `${r.scenario_code}_${r.run_id}`;
            return [
              key,
              {
                key,
                label: r.scenario_name
                  ? `${r.scenario_code} - ${r.scenario_name}`
                  : String(r.scenario_code),
                scenario_code: String(r.scenario_code),
                run_id: Number(r.run_id),
              } as ScenarioItem,
            ];
          })
        ).values()
      ),
    [scenariosForType]
  );

  const variables = useMemo(
    () =>
      Array.from(
        new Set(
          (stats || [])
            .filter(
              (r) =>
                String(r.source_type || "").toLowerCase() ===
                  String(sourceType || "").toLowerCase() &&
                String(r.scenario_code) === String(scenario?.scenario_code) &&
                String(r.run_id) === String(scenario?.run_id)
            )
            .map((r) => String(r.property_name))
        )
      ).filter(Boolean),
    [stats, sourceType, scenario]
  );

  const aggregations = useMemo(
    () =>
      Array.from(
        new Set(
          (stats || [])
            .filter(
              (r) =>
                String(r.source_type || "").toLowerCase() ===
                  String(sourceType || "").toLowerCase() &&
                String(r.scenario_code) === String(scenario?.scenario_code) &&
                String(r.run_id) === String(scenario?.run_id) &&
                String(r.property_name) === String(variable)
            )
            .map((r) => String(r.time_step))
        )
      ).filter(Boolean),
    [stats, sourceType, scenario, variable]
  );

  useEffect(() => {
    if (!sourceType) {
      onChange({});
      return;
    }

    // reset children when source changes
    setScenario(undefined);
    setVariable(undefined);
    setAggregation(undefined);
    setDateStart(undefined);
    setDateEnd(undefined);
    onChange({});
  }, [sourceType, onChange]);

  useEffect(() => {
    if (!scenario) {
      onChange({});
      return;
    }

    // reset children when scenario changes
    setVariable(undefined);
    setAggregation(undefined);
    setDateStart(undefined);
    setDateEnd(undefined);
    onChange({});
  }, [scenario, onChange]);

  useEffect(() => {
    if (!variable) {
      onChange({});
      return;
    }

    // reset children when variable changes
    setAggregation(undefined);
    setDateStart(undefined);
    setDateEnd(undefined);
    onChange({});
  }, [variable, onChange]);

  useEffect(() => {
    if (!stationId || !sourceType || !scenario || !variable || !aggregation) {
      return;
    }

    const match = (stats || []).find(
      (r: any) =>
        String(r.source_type || "").toLowerCase() ===
          String(sourceType || "").toLowerCase() &&
        String(r.scenario_code) === String(scenario.scenario_code) &&
        String(r.run_id) === String(scenario.run_id) &&
        String(r.property_name) === String(variable) &&
        String(r.time_step) === String(aggregation)
    );

    if (!match) {
      setDateStart(undefined);
      setDateEnd(undefined);
      onChange({});
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
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          Station
        </label>
        <Select
          value={stationId}
          onChange={(v: string | undefined) => setStationId(v ? Number(v) : undefined)}
          placeholder="Selectionner une station..."
        >
          {stations.map((s) => (
            <option key={s.station_id} value={s.station_id}>
              {s.station_name}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          Type de serie
        </label>
        <Select
          value={sourceType}
          onChange={setSourceType}
          disabled={!stationId}
          placeholder="Selectionner un type..."
        >
          {sourceTypes.map((s) => (
            <option key={s} value={s}>
              {s === "observed" ? "Observe" : "Simule"}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          Scenario
        </label>
        <Select
          value={scenarioKey}
          onChange={(v: string | undefined) => {
            setScenario(scenarioItems.find((s) => s.key === v));
          }}
          disabled={!sourceType || scenarioItems.length === 0}
          placeholder="Selectionner un scenario..."
        >
          {scenarioItems.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          Variable
        </label>
        <Select
          value={variable}
          onChange={setVariable}
          disabled={!scenario}
          placeholder="Selectionner une variable..."
        >
          {variables.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          Agregation
        </label>
        <Select
          value={aggregation}
          onChange={setAggregation}
          disabled={!variable}
          placeholder="Selectionner une agregation..."
        >
          {aggregations.map((a) => (
            <option key={a} value={a}>
              {a === "daily" && "Journalier"}
              {a === "monthly" && "Mensuel"}
              {a === "annual" && "Annuel"}
              {a === "instantaneous" && "Instantane"}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          Periode disponible
        </label>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Debut</label>
            <div className="relative">
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 text-sm"
                value={dateStart || ""}
                readOnly
              />
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
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 italic">Periode determinee par les donnees</p>
      </div>

      {stationId && (
        <button
          onClick={() => {
            setStationId(undefined);
            setStats([]);
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
          Reinitialiser
        </button>
      )}
    </div>
  );
}

function Select({ value, onChange, children, disabled, placeholder }: any) {
  return (
    <div className="relative">
      <select
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all outline-none text-sm appearance-none disabled:bg-gray-100 disabled:text-gray-500"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        disabled={disabled}
      >
        <option value="" disabled hidden>
          {placeholder || "Selectionner..."}
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
