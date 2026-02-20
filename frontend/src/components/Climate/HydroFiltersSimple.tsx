import { useEffect, useMemo, useState } from "react";
import { fetchHydroStations } from "@/api/hydro";

type Props = {
  rowsStats: any[];
  selectedRow: any | null;
  dateStart: string;
  dateEnd: string;
  onStationChange: (id: number) => void;
  onRowChange: (row: any | null) => void;
  onDateStartChange: (v: string) => void;
  onDateEndChange: (v: string) => void;
};

type Agg = "instantaneous" | "daily" | "monthly" | "annual";

const aggLabelMap: Record<Agg, string> = {
  instantaneous: "Instantané",
  daily: "Journalier",
  monthly: "Mensuel",
  annual: "Annuel",
};

export default function HydroFiltersSimple({
  rowsStats,
  selectedRow,
  dateStart,
  dateEnd,
  onStationChange,
  onRowChange,
  onDateStartChange,
  onDateEndChange,
}: Props) {
  const [stations, setStations] = useState<any[]>([]);
  const [stationId, setStationId] = useState<number>();
  const [sourceType, setSourceType] = useState<"observed" | "simulated" | undefined>(undefined);

  // scénario "unique" (clé logique) + aggregation choisie
  const [scenarioKey, setScenarioKey] = useState<string>("");
  const [aggChoice, setAggChoice] = useState<Agg | "">("");

  useEffect(() => {
    fetchHydroStations().then(setStations);
  }, []);

  /* ================= Helpers ================= */
  // Une clé stable pour dédupliquer les scénarios simulés.
  // On privilégie scenario_code + run_id si dispo, sinon scenario_name.
  const makeScenarioKey = (r: any) => {
    const sc = r.scenario_code ?? "";
    const run = r.run_id ?? "";
    if (sc !== "" || run !== "") return `${sc}__${run}`;
    return String(r.scenario_name ?? r.ts_id ?? "");
  };

  /* ================= Derived ================= */
  const sourceTypes = useMemo(
    () => Array.from(new Set(rowsStats.map((r) => r.source_type))).filter(Boolean),
    [rowsStats]
  );

  const rowsBySource = useMemo(
    () => rowsStats.filter((r) => r.source_type === sourceType),
    [rowsStats, sourceType]
  );

  // scénarios uniques (dédupliqués) pour SIMULÉ
  const uniqueScenarios = useMemo(() => {
    if (sourceType !== "simulated") return [];

    const map = new Map<string, any>();
    for (const r of rowsBySource) {
      const key = makeScenarioKey(r);
      if (!map.has(key)) map.set(key, r);
    }
    return Array.from(map.entries()).map(([key, sampleRow]) => ({
      key,
      label: sampleRow.scenario_name ?? sampleRow.scenario_code ?? key,
    }));
  }, [rowsBySource, sourceType]);

  // rows disponibles pour le scenarioKey sélectionné (donc 1..3 time_step)
  const rowsForScenario = useMemo(() => {
    if (!scenarioKey) return [];
    return rowsBySource.filter((r) => makeScenarioKey(r) === scenarioKey);
  }, [rowsBySource, scenarioKey]);

  // agrégations possibles (pour simulé) selon ce scenario
  const availableAggs = useMemo(() => {
    const set = new Set<Agg>();
    for (const r of rowsForScenario) {
      if (r.time_step) set.add(r.time_step);
    }
    // on ne propose pas "instantaneous" pour simulé (comme Climat)
    return ["daily", "monthly", "annual"].filter((a) => set.has(a as Agg)) as Agg[];
  }, [rowsForScenario]);

  /* ================= Reset logic ================= */
  const resetAfterStationOrType = () => {
    setScenarioKey("");
    setAggChoice("");
    onRowChange(null);
  };

  /* ================= Effects: observed auto ================= */
  // Si Observé => agrégation doit être "instantaneous" automatiquement
  useEffect(() => {
    if (sourceType !== "observed") return;

    // Observé : souvent un seul scénario. On prend la 1ère ligne observée.
    const first = rowsBySource[0];
    if (!first) {
      resetAfterStationOrType();
      return;
    }

    // force l’affichage "Instantané"
    setScenarioKey(makeScenarioKey(first));
    setAggChoice("instantaneous");

    // On cherche la ligne instantaneous si elle existe,
    // sinon on retombe sur daily (car ton backend force instantaneous -> daily view)
    const row =
      rowsBySource.find((r) => makeScenarioKey(r) === makeScenarioKey(first) && r.time_step === "instantaneous") ??
      rowsBySource.find((r) => makeScenarioKey(r) === makeScenarioKey(first) && r.time_step === "daily") ??
      first;

    onRowChange(row);
  }, [sourceType, rowsBySource]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ================= Handlers ================= */
  const handleScenarioChangeSimulated = (key: string) => {
    setScenarioKey(key);
    setAggChoice("");         // IMPORTANT: pas d'auto-agrégation
    onRowChange(null);        // on attend que l’utilisateur choisisse l’agrégation
  };

  const handleAggChangeSimulated = (agg: Agg) => {
    setAggChoice(agg);
    const row = rowsForScenario.find((r) => r.time_step === agg);
    onRowChange(row ?? null);
  };

  const currentAggLabel =
    aggChoice && aggChoice !== "" ? aggLabelMap[aggChoice as Agg] : "—";

  /* ================= UI ================= */
  return (
    <div className="space-y-4">
      {/* STATION */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          <span className="text-blue-600">📍</span> Station
        </label>
        <select
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm"
          value={stationId ?? ""}
          onChange={(e) => {
            const id = Number(e.target.value);
            setStationId(id);
            setSourceType(undefined);
            resetAfterStationOrType();
            onStationChange(id);
          }}
        >
          <option value="" className="text-gray-400">
            Sélectionner une station...
          </option>
          {stations.map((s) => (
            <option key={s.station_id} value={s.station_id}>
              {s.station_name}
            </option>
          ))}
        </select>
      </div>

      {/* TYPE DE SÉRIE */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          <span className="text-purple-600">📊</span> Type de série
        </label>
        <select
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none text-sm disabled:bg-gray-100 disabled:text-gray-500"
          value={sourceType ?? ""}
          onChange={(e) => {
            const v = (e.target.value || undefined) as any;
            setSourceType(v);
            resetAfterStationOrType();
          }}
          disabled={!stationId}
        >
          <option value="" className="text-gray-400">
            Sélectionner un type...
          </option>
          {sourceTypes.map((t) => (
            <option key={t} value={t}>
              {t === "observed" ? "📋 Observé" : "🔄 Simulé"}
            </option>
          ))}
        </select>
      </div>

      {/* SCÉNARIO */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          <span className="text-amber-600">🎯</span> Scénario
        </label>

        {/* OBSERVÉ : on affiche juste le scénario (pas besoin de dropdown) */}
        {sourceType === "observed" ? (
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-100 text-gray-800 font-medium text-sm"
            value={rowsBySource[0]?.scenario_name ?? "Observé"}
            disabled
          />
        ) : (
          <select
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none text-sm disabled:bg-gray-100 disabled:text-gray-500"
            value={scenarioKey}
            disabled={!sourceType || sourceType !== "simulated" || uniqueScenarios.length === 0}
            onChange={(e) => handleScenarioChangeSimulated(e.target.value)}
          >
            <option value="" className="text-gray-400">
              Sélectionner un scénario...
            </option>
            {uniqueScenarios.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        )}

        {sourceType === "simulated" && uniqueScenarios.length === 0 && (
          <p className="text-xs text-amber-600 mt-1">Aucun scénario disponible</p>
        )}
      </div>

      {/* VARIABLE - FIXE */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          <span className="text-cyan-600">💧</span> Variable
        </label>
        <div className="relative">
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gradient-to-r from-cyan-50 to-blue-50 text-gray-800 font-medium text-sm"
            value="Débit (m³/s)"
            disabled
          />
          <span className="absolute right-3 top-2.5 text-cyan-600 text-sm">📊</span>
        </div>
      </div>

      {/* AGRÉGATION */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          <span className="text-emerald-600">⏱️</span> Agrégation
        </label>

        {/* Observé => Instantané direct */}
        {sourceType === "observed" ? (
          <div className="relative">
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-gray-800 font-medium text-sm"
              value="Instantané"
              disabled
            />
            <span className="absolute right-3 top-2.5 text-emerald-600 text-sm">⚡</span>
          </div>
        ) : (
          <select
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-sm disabled:bg-gray-100 disabled:text-gray-500"
            value={aggChoice}
            disabled={sourceType !== "simulated" || !scenarioKey || availableAggs.length === 0}
            onChange={(e) => handleAggChangeSimulated(e.target.value as Agg)}
          >
            <option value="" className="text-gray-400">
              Sélectionnez une agrégation...
            </option>
            {/* On propose l’ensemble (journalier/mensuel/annuel) selon dispo */}
            {(["daily", "monthly", "annual"] as Agg[])
              .filter((a) => availableAggs.includes(a))
              .map((a) => (
                <option key={a} value={a}>
                  {aggLabelMap[a]}
                </option>
              ))}
          </select>
        )}
      </div>

      {/* DATES */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          <span className="text-indigo-600">📆</span> Période
        </label>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Début</label>
            <div className="relative">
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm disabled:bg-gray-100 disabled:text-gray-500"
                value={dateStart}
                disabled={!selectedRow}
                onChange={(e) => onDateStartChange(e.target.value)}
              />
              <span className="absolute right-2 top-2.5 text-gray-400 text-xs">📅</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-500">Fin</label>
            <div className="relative">
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm disabled:bg-gray-100 disabled:text-gray-500"
                value={dateEnd}
                disabled={!selectedRow}
                onChange={(e) => onDateEndChange(e.target.value)}
              />
              <span className="absolute right-2 top-2.5 text-gray-400 text-xs">📅</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOUTON RÉINITIALISER */}
      {(sourceType || selectedRow) && (
        <button
          onClick={() => {
            setSourceType(undefined);
            setScenarioKey("");
            setAggChoice("");
            onRowChange(null);
          }}
          className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
        >
          <span>🔄</span> Réinitialiser
        </button>
      )}

      {/* mini feedback */}
      <div className="text-[11px] text-gray-400">
        Agrégation: <span className="font-semibold text-gray-500">{currentAggLabel}</span>
      </div>
    </div>
  );
}
