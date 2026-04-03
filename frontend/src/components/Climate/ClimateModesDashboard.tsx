import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import ClimateDashboardContent from "@/components/Climate/ClimateDashboardContent";
import ClimateModeBar from "@/components/Climate/ClimateModeBar";
import { getClimateStationStats, getClimateTimeseries, listClimateStations } from "@/api/climate";

type Mode = "simple" | "multi";

type ClimateStat = {
  station_id: string;
  source_type: string;
  scenario_code: string;
  scenario_name?: string;
  run_id: number;
  property_name: string;
  time_step: string;
  ts_id: string;
  dt_min?: string;
  dt_max?: string;
};

type StationItem = {
  station_id: string;
  station_name: string;
};

type ConfigCard = {
  id: string;
  stationId?: string;
  sourceType?: string;
  variable?: string;
  aggregation?: string;
  color: string;
};

type LoadedSeries = {
  id: string;
  label: string;
  stationName: string;
  variable: string;
  aggregation: string;
  color: string;
  points: Array<{ date: string; value: number }>;
};

const SERIES_COLORS = ["#2563eb", "#10b981", "#f97316", "#8b5cf6"];

function formatYearTick(value: string | number) {
  if (typeof value === "string" && value.length >= 4) {
    return value.slice(0, 4);
  }
  return String(value);
}

function formatAggregationLabel(value?: string) {
  if (value === "annual") return "Annuel";
  if (value === "monthly") return "Mensuel";
  if (value === "daily") return "Journalier";
  if (value === "instantaneous") return "Instantané";
  return value || "";
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
        className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-100 disabled:text-slate-400"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        disabled={disabled}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">▼</div>
    </div>
  );
}

function SeriesConfigurator({
  title,
  config,
  stations,
  stats,
  onUpdate,
}: {
  title: string;
  config: ConfigCard;
  stations: StationItem[];
  stats: ClimateStat[];
  onUpdate: (next: Partial<ConfigCard>) => void;
}) {
  const sourceTypes = useMemo(
    () => Array.from(new Set(stats.map((r) => String(r.source_type || "").toLowerCase()))).filter(Boolean),
    [stats]
  );

  const variables = useMemo(() => {
    return Array.from(
      new Set(
        stats
          .filter(
            (r) =>
              String(r.source_type || "").toLowerCase() === String(config.sourceType || "").toLowerCase()
          )
          .map((r) => String(r.property_name))
      )
    ).filter(Boolean);
  }, [stats, config.sourceType]);

  const aggregations = useMemo(() => {
    return Array.from(
      new Set(
        stats
          .filter(
            (r) =>
              String(r.source_type || "").toLowerCase() === String(config.sourceType || "").toLowerCase() &&
              String(r.property_name) === String(config.variable || "")
          )
          .map((r) => String(r.time_step))
      )
    ).filter(Boolean);
  }, [stats, config.sourceType, config.variable]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-md">
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: config.color }} />
        <h3 className="text-xs font-semibold text-slate-800">{title}</h3>
      </div>

      <div className="space-y-2">
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Station</label>
          <Select
            value={config.stationId}
            onChange={(value) =>
              onUpdate({
                stationId: value || undefined,
                sourceType: undefined,
                variable: undefined,
                aggregation: undefined,
              })
            }
            placeholder="Choisir une station..."
          >
            {stations.map((station) => (
              <option key={station.station_id} value={station.station_id}>
                {station.station_name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Source</label>
          <Select
            value={config.sourceType}
            onChange={(value) =>
              onUpdate({
                sourceType: value,
                variable: undefined,
                aggregation: undefined,
              })
            }
            disabled={!config.stationId}
            placeholder="Source..."
          >
            {sourceTypes.map((sourceType) => (
              <option key={sourceType} value={sourceType}>
                {sourceType === "observed" ? "Observé" : "Simulé"}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Paramètre</label>
            <Select
              value={config.variable}
              onChange={(value) =>
                onUpdate({
                  variable: value,
                  aggregation: undefined,
                })
              }
              disabled={!config.sourceType}
              placeholder="Choisir un paramètre..."
            >
              {variables.map((variable) => (
                <option key={variable} value={variable}>
                  {variable}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Agrégation</label>
            <Select
              value={config.aggregation}
              onChange={(value) => onUpdate({ aggregation: value })}
              disabled={!config.variable}
              placeholder="Choisir une agrégation..."
            >
              {aggregations.map((aggregation) => (
                <option key={aggregation} value={aggregation}>
                  {aggregation === "daily" && "Journalier"}
                  {aggregation === "monthly" && "Mensuel"}
                  {aggregation === "annual" && "Annuel"}
                  {aggregation === "instantaneous" && "Instantané"}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

function mergeSeries(series: LoadedSeries[]) {
  const map = new Map<string, Record<string, string | number>>();
  series.forEach((serie) => {
    serie.points.forEach((point) => {
      const row = map.get(point.date) || { date: point.date };
      row[serie.id] = point.value;
      map.set(point.date, row);
    });
  });
  return Array.from(map.values()).sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

function buildSummary(series: LoadedSeries[]) {
  return series.map((serie) => {
    const values = serie.points.map((point) => point.value).filter((value) => !Number.isNaN(value));
    const mean = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
    const min = values.length ? Math.min(...values) : 0;
    const max = values.length ? Math.max(...values) : 0;
    return {
      name: serie.label,
      variable: serie.variable,
      mean: Number(mean.toFixed(2)),
      min: Number(min.toFixed(2)),
      max: Number(max.toFixed(2)),
    };
  });
}

function buildGlobalStats(series: LoadedSeries[]) {
  const values = series.flatMap((serie) => serie.points.map((point) => point.value)).filter((value) => !Number.isNaN(value));
  if (!values.length) {
    return { min: 0, mean: 0, max: 0 };
  }
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return {
    min: Number(Math.min(...values).toFixed(2)),
    mean: Number(mean.toFixed(2)),
    max: Number(Math.max(...values).toFixed(2)),
  };
}

function buildDetailRows(series: LoadedSeries[]) {
  return series
    .flatMap((serie) =>
      serie.points.map((point) => ({
        date: point.date,
        stationName: serie.stationName,
        variable: serie.variable,
        aggregation: serie.aggregation,
        value: Number(point.value.toFixed(2)),
      }))
    )
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

export default function ClimateModesDashboard() {
  const [mode, setMode] = useState<Mode>("simple");
  const [multiChartType, setMultiChartType] = useState<"line" | "bar">("line");
  const [stations, setStations] = useState<StationItem[]>([]);
  const [statsCache, setStatsCache] = useState<Record<string, ClimateStat[]>>({});
  const [multiConfigs, setMultiConfigs] = useState<ConfigCard[]>(
    SERIES_COLORS.slice(0, 3).map((color, index) => ({ id: `multi-${index + 1}`, color }))
  );
  const [multiSeries, setMultiSeries] = useState<LoadedSeries[]>([]);
  const multiChartRef = useRef<HTMLDivElement | null>(null);
  const multiChartExportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listClimateStations().then(setStations).catch(() => setStations([]));
  }, []);

  useEffect(() => {
    const missingStationIds = Array.from(
      new Set(
        [...multiConfigs]
          .map((config) => config.stationId)
          .filter((stationId): stationId is string => !!stationId && !statsCache[stationId])
      )
    );

    missingStationIds.forEach((stationId) => {
      getClimateStationStats(stationId)
        .then((rows) => {
          setStatsCache((prev) => ({ ...prev, [stationId]: rows || [] }));
        })
        .catch(() => {
          setStatsCache((prev) => ({ ...prev, [stationId]: [] }));
        });
    });
  }, [multiConfigs, statsCache]);

  useEffect(() => {
    const load = async () => {
      const nextSeries = await Promise.all(
        multiConfigs.map(async (config, index) => {
          if (!config.stationId || !config.sourceType || !config.variable || !config.aggregation) {
            return null;
          }

          const row = (statsCache[config.stationId] || []).find(
            (item) =>
              String(item.source_type || "").toLowerCase() === String(config.sourceType || "").toLowerCase() &&
              String(item.property_name) === String(config.variable) &&
              String(item.time_step) === String(config.aggregation)
          );

          if (!row) return null;

          const data = await getClimateTimeseries({
            ts_id: row.ts_id,
            time_step: row.time_step,
            date_start: row.dt_min?.slice(0, 10),
            date_end: row.dt_max?.slice(0, 10),
          });

          const stationName = stations.find((station) => station.station_id === config.stationId)?.station_name || `Station ${index + 1}`;
          return {
            id: config.id,
            stationName,
            color: config.color,
            label: `${stationName} • ${config.variable}`,
            variable: String(config.variable),
            aggregation: String(config.aggregation),
            points: Array.isArray(data)
              ? data.map((entry: any) => ({ date: entry.datetime, value: Number(entry.value) }))
              : [],
          } as LoadedSeries;
        })
      );

      setMultiSeries(nextSeries.filter((item): item is LoadedSeries => !!item && item.points.length > 0));
    };

    if (mode === "multi") void load();
  }, [multiConfigs, statsCache, stations, mode]);

  const multiChartData = useMemo(() => mergeSeries(multiSeries), [multiSeries]);
  const multiSummary = useMemo(() => buildSummary(multiSeries), [multiSeries]);
  const multiDetailRows = useMemo(() => buildDetailRows(multiSeries), [multiSeries]);
  const multiGlobalStats = useMemo(() => buildGlobalStats(multiSeries), [multiSeries]);
  const multiAxisVariables = useMemo(
    () => Array.from(new Set(multiSeries.map((serie) => serie.variable))).filter(Boolean),
    [multiSeries]
  );
  const multiAggregationLabel = useMemo(
    () => formatAggregationLabel(multiSeries[0]?.aggregation),
    [multiSeries]
  );
  const multiLeftAxisVariable = multiAxisVariables[0];
  const multiRightAxisVariable = multiAxisVariables[1];

  const exportMultiChartCsv = () => {
    if (!multiChartData.length) return;
    const headers = ["date", ...multiSeries.map((serie) => serie.label)];
    const rows = multiChartData.map((row) =>
      [row.date, ...multiSeries.map((serie) => row[serie.id] ?? "")].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "series-multiples.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportMultiChartSvg = () => {
    const svg = multiChartRef.current?.querySelector("svg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgText = serializer.serializeToString(svg);
    const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "series-multiples.svg";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportMultiChartImage = async () => {
    const element = multiChartExportRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2,
      logging: false,
    });

    const link = document.createElement("a");
    link.download = "series-multiples.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const exportMultiChartPdf = async () => {
    const element = multiChartExportRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(usableWidth / imgWidth, usableHeight / imgHeight);
    const renderWidth = imgWidth * ratio;
    const renderHeight = imgHeight * ratio;
    const x = (pageWidth - renderWidth) / 2;
    const y = margin;

    pdf.addImage(imgData, "PNG", x, y, renderWidth, renderHeight);
    pdf.save("series-multiples.pdf");
  };

  return (
    <div className="space-y-6">
      <ClimateModeBar mode={mode} onChange={setMode} />

      {mode === "simple" && <ClimateDashboardContent />}

      {mode === "multi" && (
        <div className="space-y-4">

          <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
            {multiConfigs.map((config, index) => (
              <SeriesConfigurator
                key={config.id}
                title={`Station ${index + 1}`}
                config={config}
                stations={stations}
                stats={config.stationId ? statsCache[config.stationId] || [] : []}
                onUpdate={(next) =>
                  setMultiConfigs((prev) => prev.map((item) => (item.id === config.id ? { ...item, ...next } : item)))
                }
              />
            ))}
          </div>

          <div className="space-y-5">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-white">
                  Séries temporelles comparées{multiAggregationLabel ? ` - ${multiAggregationLabel}` : ""}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex rounded-lg border border-white/20 bg-white/10 p-0.5 backdrop-blur">
                    <button
                      type="button"
                      className={`rounded-md px-2 py-1 text-xs font-medium ${multiChartType === "line" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}
                      onClick={() => setMultiChartType("line")}
                    >
                      Courbe
                    </button>
                    <button
                      type="button"
                      className={`rounded-md px-2 py-1 text-xs font-medium ${multiChartType === "bar" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}
                      onClick={() => setMultiChartType("bar")}
                    >
                      Barres
                    </button>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={exportMultiChartImage}
                    disabled={!multiChartData.length}
                  >
                    Export Image
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={exportMultiChartPdf}
                    disabled={!multiChartData.length}
                  >
                    Export PDF
                  </button>
                </div>
              </div>
              </div>
              <div className="space-y-4 p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 px-3 py-3 shadow-sm">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-700">Minimum</div>
                  <div className="text-sm font-semibold text-slate-800">{multiGlobalStats.min}</div>
                </div>
                <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-fuchsia-50 px-3 py-3 shadow-sm">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-700">Moyenne</div>
                  <div className="text-sm font-semibold text-slate-800">{multiGlobalStats.mean}</div>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-green-50 to-emerald-50 px-3 py-3 shadow-sm">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">Maximum</div>
                  <div className="text-sm font-semibold text-slate-800">{multiGlobalStats.max}</div>
                </div>
              </div>
              <div className="rounded-lg bg-white">
                {multiAxisVariables.length > 0 ? (
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <span className="rounded-full bg-sky-50 px-2 py-1 font-medium text-sky-700">
                      Axe gauche: {multiLeftAxisVariable}{multiAggregationLabel ? ` (${multiAggregationLabel})` : ""}
                    </span>
                    {multiRightAxisVariable ? (
                      <span className="rounded-full bg-orange-50 px-2 py-1 font-medium text-orange-700">
                        Axe droit: {multiRightAxisVariable}{multiAggregationLabel ? ` (${multiAggregationLabel})` : ""}
                      </span>
                    ) : null}
                  </div>
                ) : null}
                <div className="h-[300px]" ref={multiChartExportRef}>
                {multiSeries.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    {multiChartType === "line" ? (
                      <LineChart data={multiChartData} margin={{ top: 8, right: multiRightAxisVariable ? 20 : 8, left: 20, bottom: 28 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={formatYearTick} />
                        <YAxis
                          yAxisId="left"
                          tick={{ fontSize: 11 }}
                          width={92}
                        />
                        {multiRightAxisVariable ? (
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fontSize: 11 }}
                            width={92}
                          />
                        ) : null}
                        <Tooltip labelFormatter={formatYearTick} />
                        <Legend
                          iconType="square"
                          iconSize={10}
                          wrapperStyle={{ paddingTop: 14 }}
                          formatter={(value) => <span style={{ color: "#2563eb", verticalAlign: "middle" }}>{String(value)}</span>}
                        />
                        {multiSeries.map((serie) => (
                          <Line
                            key={serie.id}
                            yAxisId={serie.variable === multiLeftAxisVariable ? "left" : "right"}
                            type="monotone"
                            dataKey={serie.id}
                            name={serie.label}
                            stroke={serie.color}
                            dot={false}
                            strokeWidth={2.5}
                          />
                        ))}
                      </LineChart>
                    ) : (
                      <BarChart data={multiChartData} margin={{ top: 8, right: multiRightAxisVariable ? 20 : 8, left: 20, bottom: 28 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={formatYearTick} />
                        <YAxis
                          yAxisId="left"
                          tick={{ fontSize: 11 }}
                          width={92}
                        />
                        {multiRightAxisVariable ? (
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fontSize: 11 }}
                            width={92}
                          />
                        ) : null}
                        <Tooltip labelFormatter={formatYearTick} />
                        <Legend
                          iconType="square"
                          iconSize={10}
                          wrapperStyle={{ paddingTop: 14 }}
                          formatter={(value) => <span style={{ color: "#2563eb", verticalAlign: "middle" }}>{String(value)}</span>}
                        />
                        {multiSeries.map((serie) => (
                          <Bar
                            key={serie.id}
                            yAxisId={serie.variable === multiLeftAxisVariable ? "left" : "right"}
                            dataKey={serie.id}
                            name={serie.label}
                            fill={serie.color}
                            radius={[4, 4, 0, 0]}
                          />
                        ))}
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-lg bg-slate-50 px-4 text-center text-xs text-slate-500">
                    Configurez au moins une station complète pour afficher le graphe.
                  </div>
                )}
              </div>
              </div>
              {multiAxisVariables.length > 2 ? (
                <p className="mt-2 text-xs text-slate-500">
                  Les paramètres supplémentaires utilisent aussi l'axe droit.
                </p>
              ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.95fr_1.25fr]">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md xl:order-2">
              <h3 className="mb-3 bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-base font-semibold text-white">Tableau détaillé des données</h3>
              {multiDetailRows.length > 0 ? (
                <div className="max-h-[300px] overflow-auto rounded-lg border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="sticky top-0 bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Période</th>
                        <th className="px-3 py-2 text-left font-semibold">Station</th>
                        <th className="px-3 py-2 text-left font-semibold">Paramètre</th>
                        <th className="px-3 py-2 text-left font-semibold">Agrégation</th>
                        <th className="px-3 py-2 text-right font-semibold">Valeur</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                      {multiDetailRows.map((row, index) => (
                        <tr key={`${row.stationName}-${row.variable}-${row.date}-${index}`}>
                          <td className="whitespace-nowrap px-3 py-2">{formatYearTick(row.date)}</td>
                          <td className="px-3 py-2">{row.stationName}</td>
                          <td className="px-3 py-2">{row.variable}</td>
                          <td className="px-3 py-2">{row.aggregation}</td>
                          <td className="px-3 py-2 text-right">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex h-[300px] items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
                  Le tableau détaillé apparaîtra ici après sélection des séries.
                </div>
              )}
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md xl:order-1">
              <h3 className="mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-base font-semibold text-white">Synthèse des stations</h3>
              <div className="h-[300px] px-3 pb-3">
                {multiSummary.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={multiSummary}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="min" fill="#f97316" name="Minimum" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="mean" fill="#2563eb" name="Moyenne" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="max" fill="#10b981" name="Maximum" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
                    La synthèse apparaîtra ici après sélection des séries.
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        </div>
      )}

    </div>
  );
}

