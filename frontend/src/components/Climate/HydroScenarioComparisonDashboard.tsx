import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { fetchHydroStations, fetchHydroStats, fetchHydroTimeseries } from "@/api/hydro";

type HydroStation = { station_id: number; station_name: string };
type HydroStat = {
  station_id: number;
  source_type: string;
  scenario_code?: string;
  scenario_name?: string;
  run_id?: number;
  property_name?: string;
  time_step: string;
  ts_id: number;
  dt_min?: string;
  dt_max?: string;
};

type ScenarioSerie = {
  key: string;
  label: string;
  color: string;
  parameter: string;
  aggregation: string;
  points: Array<{ date: string; value: number }>;
};

const COLORS = ["#2563eb", "#10b981", "#f97316", "#8b5cf6"];

function formatAggregationLabel(value?: string) {
  if (value === "annual") return "Annuel";
  if (value === "monthly") return "Mensuel";
  if (value === "daily") return "Journalier";
  if (value === "instantaneous") return "Instantane";
  return value || "";
}

function formatYearTick(value: string | number) {
  if (typeof value !== "string") return String(value);
  return value.length >= 4 ? value.slice(0, 4) : value;
}

function Select({
  value,
  onChange,
  children,
  disabled,
  placeholder,
}: {
  value?: string | number;
  onChange: (value?: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        className="w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 disabled:bg-slate-100 disabled:text-slate-400"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        disabled={disabled}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">⌄</div>
    </div>
  );
}

function mergeSeries(series: ScenarioSerie[]) {
  const map = new Map<string, Record<string, string | number>>();
  series.forEach((serie) => {
    serie.points.forEach((point) => {
      const row = map.get(point.date) || { date: point.date };
      row[serie.key] = point.value;
      map.set(point.date, row);
    });
  });
  return Array.from(map.values()).sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

export default function HydroScenarioComparisonDashboard() {
  const [stations, setStations] = useState<HydroStation[]>([]);
  const [stationId, setStationId] = useState<number | null>(null);
  const [rowsStats, setRowsStats] = useState<HydroStat[]>([]);
  const [sourceType, setSourceType] = useState<string>();
  const [parameter, setParameter] = useState<string>();
  const [aggregation, setAggregation] = useState<string>();
  const [referenceKey, setReferenceKey] = useState<string>();
  const [selectedScenarioKeys, setSelectedScenarioKeys] = useState<string[]>([]);
  const [scenarioSeries, setScenarioSeries] = useState<ScenarioSerie[]>([]);

  useEffect(() => {
    fetchHydroStations().then(setStations).catch(() => setStations([]));
  }, []);

  useEffect(() => {
    if (!stationId) {
      setRowsStats([]);
      setSourceType(undefined);
      setParameter(undefined);
      setAggregation(undefined);
      setReferenceKey(undefined);
      setSelectedScenarioKeys([]);
      setScenarioSeries([]);
      return;
    }

    fetchHydroStats(stationId)
      .then((rows) => {
        setRowsStats(rows || []);
        setSourceType(undefined);
        setParameter(undefined);
        setAggregation(undefined);
        setReferenceKey(undefined);
        setSelectedScenarioKeys([]);
        setScenarioSeries([]);
      })
      .catch(() => {
        setRowsStats([]);
      });
  }, [stationId]);

  const sourceTypes = useMemo(
    () => Array.from(new Set(rowsStats.map((row) => String(row.source_type || "").toLowerCase()))).filter(Boolean),
    [rowsStats]
  );

  const parameters = useMemo(() => {
    return Array.from(
      new Set(
        rowsStats
          .filter((row) => String(row.source_type || "").toLowerCase() === String(sourceType || "").toLowerCase())
          .map((row) => String(row.property_name || "Debit"))
      )
    ).filter(Boolean);
  }, [rowsStats, sourceType]);

  const aggregations = useMemo(() => {
    return Array.from(
      new Set(
        rowsStats
          .filter(
            (row) =>
              String(row.source_type || "").toLowerCase() === String(sourceType || "").toLowerCase() &&
              String(row.property_name || "Debit") === String(parameter || "")
          )
          .map((row) => String(row.time_step))
      )
    ).filter(Boolean);
  }, [rowsStats, sourceType, parameter]);

  const scenarioRows = useMemo(() => {
    return Array.from(
      new Map(
        rowsStats
          .filter(
            (row) =>
              String(row.source_type || "").toLowerCase() === String(sourceType || "").toLowerCase() &&
              String(row.property_name || "Debit") === String(parameter || "") &&
              String(row.time_step || "") === String(aggregation || "")
          )
          .map((row) => [
            `${row.scenario_code}_${row.run_id}`,
            {
              key: `${row.scenario_code}_${row.run_id}`,
              label: row.scenario_name ? `${row.scenario_code} - ${row.scenario_name}` : String(row.scenario_code || ""),
              row,
            },
          ])
      ).values()
    );
  }, [rowsStats, sourceType, parameter, aggregation]);

  useEffect(() => {
    setReferenceKey(undefined);
    setSelectedScenarioKeys([]);
  }, [sourceType, parameter, aggregation]);

  useEffect(() => {
    const load = async () => {
      const allKeys = [referenceKey, ...selectedScenarioKeys].filter(Boolean) as string[];
      if (!allKeys.length) {
        setScenarioSeries([]);
        return;
      }

      const nextSeries = await Promise.all(
        allKeys.map(async (key, index) => {
          const item = scenarioRows.find((scenario) => scenario.key === key);
          if (!item) return null;

          const row = item.row;
          const data = await fetchHydroTimeseries({
            ts_id: row.ts_id,
            aggregation: row.time_step,
            date_start: row.dt_min?.slice(0, 10) || "",
            date_end: row.dt_max?.slice(0, 10) || "",
          });

          return {
            key,
            label: item.label,
            color: COLORS[index % COLORS.length],
            parameter: String(row.property_name || "Debit"),
            aggregation: String(row.time_step || ""),
            points: Array.isArray(data)
              ? data.map((entry: any) => ({ date: entry.datetime, value: Number(entry.value) }))
              : [],
          } as ScenarioSerie;
        })
      );

      setScenarioSeries(nextSeries.filter((item): item is ScenarioSerie => !!item && item.points.length > 0));
    };

    void load();
  }, [referenceKey, selectedScenarioKeys, scenarioRows]);

  const chartData = useMemo(() => mergeSeries(scenarioSeries), [scenarioSeries]);
  const summaryRows = useMemo(() => {
    return scenarioSeries.map((serie) => {
      const values = serie.points.map((point) => point.value);
      const mean = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
      return {
        scenario: serie.label,
        min: Number((values.length ? Math.min(...values) : 0).toFixed(2)),
        mean: Number(mean.toFixed(2)),
        max: Number((values.length ? Math.max(...values) : 0).toFixed(2)),
      };
    });
  }, [scenarioSeries]);

  const detailRows = useMemo(() => {
    return scenarioSeries
      .flatMap((serie) =>
        serie.points.map((point) => ({
          date: point.date,
          scenario: serie.label,
          parameter: serie.parameter,
          aggregation: serie.aggregation,
          value: Number(point.value.toFixed(2)),
        }))
      )
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [scenarioSeries]);

  const stationName = stations.find((station) => station.station_id === stationId)?.station_name;

  const toggleScenario = (key: string) => {
    if (key === referenceKey) return;
    setSelectedScenarioKeys((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-base font-semibold text-slate-800">Parametres de station</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Station</label>
                <Select
                  value={stationId ?? undefined}
                  onChange={(value) => setStationId(value ? Number(value) : null)}
                  placeholder="Choisir une station..."
                >
                  {stations.map((station) => (
                    <option key={station.station_id} value={station.station_id}>
                      {station.station_name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Source</label>
                  <Select value={sourceType} onChange={setSourceType} disabled={!stationId} placeholder="Source...">
                    {sourceTypes.map((item) => (
                      <option key={item} value={item}>
                        {item === "observed" ? "Observe" : "Simule"}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Parametre</label>
                  <Select value={parameter} onChange={setParameter} disabled={!sourceType} placeholder="Choisir un parametre...">
                    {parameters.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Aggregation</label>
                  <Select value={aggregation} onChange={setAggregation} disabled={!parameter} placeholder="Choisir une aggregation...">
                    {aggregations.map((item) => (
                      <option key={item} value={item}>
                        {formatAggregationLabel(item)}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Scenario reference</label>
                  <Select
                    value={referenceKey}
                    onChange={(value) => {
                      setReferenceKey(value);
                      setSelectedScenarioKeys((prev) => prev.filter((item) => item !== value));
                    }}
                    disabled={!aggregation}
                    placeholder="Choisir le scenario reference..."
                  >
                    {scenarioRows.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {stationName && parameter && aggregation ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  Reference et comparaison pour <span className="font-semibold">{stationName}</span> • {parameter} • {formatAggregationLabel(aggregation)}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-base font-semibold text-slate-800">Scenarios de la station</h3>
            {scenarioRows.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {scenarioRows.map((item) => {
                  const isReference = item.key === referenceKey;
                  const isSelected = selectedScenarioKeys.includes(item.key);
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => (isReference ? undefined : toggleScenario(item.key))}
                      className={`rounded-xl border px-4 py-3 text-left transition ${
                        isReference
                          ? "border-blue-300 bg-blue-50 shadow-sm"
                          : isSelected
                          ? "border-emerald-300 bg-emerald-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50"
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${isReference ? "text-blue-700" : isSelected ? "text-emerald-700" : "text-slate-500"}`}>
                          {isReference ? "Reference" : isSelected ? "Compare" : "Cliquer pour comparer"}
                        </span>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] text-slate-500 shadow-sm">
                          {formatAggregationLabel(item.row.time_step)}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-slate-800">{item.label}</div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-[150px] items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
                Choisissez la station, la source, le parametre et l'aggregation pour afficher les scenarios.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-slate-800">Comparaison des scenarios</h3>
        <div className="h-[340px]">
          {scenarioSeries.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 16, left: 16, bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={formatYearTick} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip labelFormatter={formatYearTick} />
                <Legend />
                {scenarioSeries.map((serie) => (
                  <Line
                    key={serie.key}
                    type="monotone"
                    dataKey={serie.key}
                    name={serie.label}
                    stroke={serie.color}
                    dot={false}
                    strokeWidth={serie.key === referenceKey ? 3 : 2.2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
              Le graphe apparaitra ici apres choix du scenario de reference et des scenarios a comparer.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.95fr_1.25fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm xl:order-1">
          <h3 className="mb-2 text-base font-semibold text-slate-800">Synthese de comparaison</h3>
          <div className="h-[300px]">
            {summaryRows.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summaryRows.map((row) => ({ ...row, name: row.scenario }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line dataKey="min" stroke="#f97316" name="Minimum" strokeWidth={2} />
                  <Line dataKey="mean" stroke="#2563eb" name="Moyenne" strokeWidth={2} />
                  <Line dataKey="max" stroke="#10b981" name="Maximum" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
                La synthese apparaitra ici apres selection des scenarios.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm xl:order-2">
          <h3 className="mb-2 text-base font-semibold text-slate-800">Tableau de comparaison</h3>
          {detailRows.length > 0 ? (
            <div className="max-h-[300px] overflow-auto rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="sticky top-0 bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Periode</th>
                    <th className="px-3 py-2 text-left font-semibold">Scenario</th>
                    <th className="px-3 py-2 text-left font-semibold">Parametre</th>
                    <th className="px-3 py-2 text-left font-semibold">Aggregation</th>
                    <th className="px-3 py-2 text-right font-semibold">Valeur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                  {detailRows.map((row, index) => (
                    <tr key={`${row.scenario}-${row.date}-${index}`}>
                      <td className="whitespace-nowrap px-3 py-2">{formatYearTick(row.date)}</td>
                      <td className="px-3 py-2">{row.scenario}</td>
                      <td className="px-3 py-2">{row.parameter}</td>
                      <td className="px-3 py-2">{formatAggregationLabel(row.aggregation)}</td>
                      <td className="px-3 py-2 text-right">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
              Le tableau apparaitra ici apres selection des scenarios.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
