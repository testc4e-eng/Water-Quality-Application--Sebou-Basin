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

import { fetchHydroStations, fetchHydroStats, fetchHydroTimeseries } from "@/api/hydro";
import { getBarrages } from "@/api/client";

type SeriesTypeId =
  | "debit_station"
  | "niveau_eau_barrage"
  | "qualite_barrage"
  | "qualite_nappe"
  | "points_eau"
  | "suivi_qualite"
  | "qualite_eau_surface";

type HydroStation = { station_id: number; station_name: string };
type BarrageItem = { id: number; nom_barrage: string };
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

type EntityOption = { id: string; label: string };
type ConfigCard = {
  id: string;
  color: string;
  seriesType?: SeriesTypeId;
  entityId?: string;
  sourceType?: string;
  scenarioKey?: string;
  scenarioCode?: string;
  runId?: number;
  parameter?: string;
  aggregation?: string;
};
type LoadedSeries = {
  id: string;
  label: string;
  entityLabel: string;
  parameter: string;
  aggregation: string;
  color: string;
  points: Array<{ date: string; value: number }>;
  origin: "hydro" | "preview";
};

const SERIES_COLORS = ["#2563eb", "#10b981", "#f97316"];
const SERIES_TYPES: Array<{
  id: SeriesTypeId;
  label: string;
  entityLabel: string;
  entitySource: "hydroStation" | "barrage";
  parameters: string[];
}> = [
  { id: "debit_station", label: "Débit (SWAT output) / station", entityLabel: "Station", entitySource: "hydroStation", parameters: ["Débit"] },
  { id: "niveau_eau_barrage", label: "Niveau eau barrage", entityLabel: "Barrage", entitySource: "barrage", parameters: ["Niveau eau barrage"] },
  { id: "qualite_barrage", label: "Qualité barrage", entityLabel: "Barrage", entitySource: "barrage", parameters: ["N", "O", "P"] },
  { id: "qualite_nappe", label: "Qualité nappe", entityLabel: "Station", entitySource: "hydroStation", parameters: ["N", "O", "P"] },
  { id: "points_eau", label: "Points eau", entityLabel: "Station", entitySource: "hydroStation", parameters: ["Débit", "Temperature", "N", "O", "P"] },
  { id: "suivi_qualite", label: "Suivi de qualité / point de prélèvement", entityLabel: "Station", entitySource: "hydroStation", parameters: ["N", "O", "P"] },
  { id: "qualite_eau_surface", label: "Qualité eau de surface (WASP) / segment", entityLabel: "Station", entitySource: "hydroStation", parameters: ["N", "O", "P"] },
];

function formatAggregationLabel(value?: string) {
  if (value === "annual") return "Annuel";
  if (value === "monthly") return "Mensuel";
  if (value === "daily") return "Journalier";
  if (value === "instantaneous") return "Instantané";
  return value || "";
}

function formatPeriodTick(value: string | number) {
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
        className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100 disabled:text-slate-400"
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

function buildDateSeries(aggregation: string) {
  if (aggregation === "daily") {
    return Array.from({ length: 120 }, (_, index) => {
      const date = new Date(2020, 0, 1 + index);
      return date.toISOString().slice(0, 10);
    });
  }
  if (aggregation === "monthly") {
    const rows: string[] = [];
    for (let year = 2016; year <= 2020; year += 1) {
      for (let month = 0; month < 12; month += 1) rows.push(new Date(year, month, 1).toISOString().slice(0, 10));
    }
    return rows;
  }
  return Array.from({ length: 28 }, (_, index) => `${1993 + index}-01-01`);
}

function hashSeed(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) hash = (hash * 31 + value.charCodeAt(index)) % 2147483647;
  return hash || 1;
}

function scaleForParameter(seriesType?: SeriesTypeId, parameter?: string) {
  if (seriesType === "niveau_eau_barrage") return { base: 45, amplitude: 18 };
  if (parameter === "Débit") return { base: 8, amplitude: 5 };
  if (parameter === "Temperature") return { base: 18, amplitude: 6 };
  if (parameter === "N") return { base: 6, amplitude: 2.2 };
  if (parameter === "O") return { base: 10, amplitude: 3.5 };
  if (parameter === "P") return { base: 2.4, amplitude: 1.2 };
  return { base: 5, amplitude: 2 };
}

function buildPreviewSeries(config: ConfigCard, entityLabel: string) {
  const aggregation = config.aggregation || "annual";
  const dates = buildDateSeries(aggregation);
  const seed = hashSeed(`${config.seriesType}_${entityLabel}_${config.parameter}_${aggregation}`);
  const scale = scaleForParameter(config.seriesType, config.parameter);
  return dates.map((date, index) => {
    const sin1 = Math.sin((index + (seed % 11)) / 3.1);
    const sin2 = Math.cos((index + (seed % 7)) / 5.4);
    const noise = ((seed + index * 17) % 23) / 23;
    const value = Math.max(0, scale.base + sin1 * scale.amplitude + sin2 * (scale.amplitude / 2) + noise * scale.amplitude);
    return { date, value: Number(value.toFixed(2)) };
  });
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
    return {
      name: serie.label,
      parameter: serie.parameter,
      min: Number((values.length ? Math.min(...values) : 0).toFixed(2)),
      mean: Number(mean.toFixed(2)),
      max: Number((values.length ? Math.max(...values) : 0).toFixed(2)),
    };
  });
}

function buildGlobalStats(series: LoadedSeries[]) {
  const values = series.flatMap((serie) => serie.points.map((point) => point.value)).filter((value) => !Number.isNaN(value));
  if (!values.length) return { min: 0, mean: 0, max: 0 };
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
        entityLabel: serie.entityLabel,
        parameter: serie.parameter,
        aggregation: serie.aggregation,
        value: Number(point.value.toFixed(2)),
      }))
    )
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

function SeriesConfigurator({
  title,
  config,
  hydroStations,
  barrageOptions,
  stats,
  onUpdate,
}: {
  title: string;
  config: ConfigCard;
  hydroStations: HydroStation[];
  barrageOptions: BarrageItem[];
  stats: HydroStat[];
  onUpdate: (next: Partial<ConfigCard>) => void;
}) {
  const typeMeta = SERIES_TYPES.find((item) => item.id === config.seriesType);

  const entityOptions = useMemo(() => {
    if (!typeMeta) return [] as EntityOption[];
    if (typeMeta.entitySource === "barrage") {
      return barrageOptions.map((barrage) => ({ id: String(barrage.id), label: barrage.nom_barrage }));
    }
    return hydroStations.map((station) => ({ id: String(station.station_id), label: station.station_name }));
  }, [typeMeta, hydroStations, barrageOptions]);

  const sourceTypes = useMemo(
    () => Array.from(new Set(stats.map((row) => String(row.source_type || "").toLowerCase()))).filter(Boolean),
    [stats]
  );

  const scenarioItems = useMemo(() => {
    const rows = stats.filter(
      (row) => String(row.source_type || "").toLowerCase() === String(config.sourceType || "").toLowerCase()
    );
    return Array.from(
      new Map(
        rows.map((row) => [
          `${row.scenario_code}_${row.run_id}`,
          {
            key: `${row.scenario_code}_${row.run_id}`,
            label: row.scenario_name ? `${row.scenario_code} - ${row.scenario_name}` : String(row.scenario_code || ""),
            scenarioCode: String(row.scenario_code || ""),
            runId: Number(row.run_id),
          },
        ])
      ).values()
    );
  }, [stats, config.sourceType]);

  const parameters = useMemo(() => {
    if (config.seriesType !== "debit_station") return typeMeta?.parameters || [];
    return Array.from(
      new Set(
        stats
          .filter(
            (row) =>
              String(row.source_type || "").toLowerCase() === String(config.sourceType || "").toLowerCase() &&
              String(row.scenario_code || "") === String(config.scenarioCode || "") &&
              String(row.run_id || "") === String(config.runId || "")
          )
          .map((row) => String(row.property_name || "Débit"))
      )
    ).filter(Boolean);
  }, [config.seriesType, config.sourceType, config.scenarioCode, config.runId, stats, typeMeta]);

  const aggregations = useMemo(() => {
    if (config.seriesType !== "debit_station") return ["daily", "monthly", "annual"];
    return Array.from(
      new Set(
        stats
          .filter(
            (row) =>
              String(row.source_type || "").toLowerCase() === String(config.sourceType || "").toLowerCase() &&
              String(row.scenario_code || "") === String(config.scenarioCode || "") &&
              String(row.run_id || "") === String(config.runId || "") &&
              String(row.property_name || "") === String(config.parameter || "")
          )
          .map((row) => String(row.time_step))
      )
    ).filter(Boolean);
  }, [config.seriesType, config.sourceType, config.scenarioCode, config.runId, config.parameter, stats]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm shadow-slate-100">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: config.color }} />
        <h3 className="text-[13px] font-semibold text-slate-800">{title}</h3>
      </div>

      <div className="space-y-1.5">
        <div className="space-y-1">
          <label className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Type</label>
          <Select
            value={config.seriesType}
            onChange={(value) =>
              onUpdate({
                seriesType: value as SeriesTypeId | undefined,
                entityId: undefined,
                sourceType: undefined,
                scenarioKey: undefined,
                scenarioCode: undefined,
                runId: undefined,
                parameter: undefined,
                aggregation: undefined,
              })
            }
            placeholder="Choisir un type..."
          >
            {SERIES_TYPES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
            {typeMeta?.entityLabel || "Entité"}
          </label>
          <Select
            value={config.entityId}
            onChange={(value) =>
              onUpdate({
                entityId: value,
                sourceType: undefined,
                scenarioKey: undefined,
                scenarioCode: undefined,
                runId: undefined,
                parameter: undefined,
                aggregation: undefined,
              })
            }
            disabled={!config.seriesType}
            placeholder="Choisir..."
          >
            {entityOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </Select>
        </div>

        {config.seriesType === "debit_station" ? (
          <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Source</label>
              <Select
                value={config.sourceType}
                onChange={(value) =>
                  onUpdate({
                    sourceType: value,
                    scenarioKey: undefined,
                    scenarioCode: undefined,
                    runId: undefined,
                    parameter: undefined,
                    aggregation: undefined,
                  })
                }
                disabled={!config.entityId}
                placeholder="Source..."
              >
                {sourceTypes.map((sourceType) => (
                  <option key={sourceType} value={sourceType}>
                    {sourceType === "observed" ? "Observé" : "Simulé"}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Scénario</label>
              <Select
                value={config.scenarioKey}
                onChange={(value) => {
                  const picked = scenarioItems.find((item) => item.key === value);
                  onUpdate({
                    scenarioKey: picked?.key,
                    scenarioCode: picked?.scenarioCode,
                    runId: picked?.runId,
                    parameter: undefined,
                    aggregation: undefined,
                  });
                }}
                disabled={!config.sourceType}
                placeholder="Choisir un scenario..."
              >
                {scenarioItems.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Paramètre</label>
            <Select
              value={config.parameter}
              onChange={(value) => onUpdate({ parameter: value, aggregation: undefined })}
              disabled={!config.entityId || (config.seriesType === "debit_station" && !config.scenarioKey)}
              placeholder="Choisir un parametre..."
            >
              {parameters.map((parameter) => (
                <option key={parameter} value={parameter}>
                  {parameter}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">Agrégation</label>
            <Select
              value={config.aggregation}
              onChange={(value) => onUpdate({ aggregation: value })}
              disabled={!config.parameter}
              placeholder="Choisir une aggregation..."
            >
              {aggregations.map((aggregation) => (
                <option key={aggregation} value={aggregation}>
                  {formatAggregationLabel(aggregation)}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HydroMultiModesDashboard() {
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [hydroStations, setHydroStations] = useState<HydroStation[]>([]);
  const [barrages, setBarrages] = useState<BarrageItem[]>([]);
  const [statsCache, setStatsCache] = useState<Record<string, HydroStat[]>>({});
  const [configs, setConfigs] = useState<ConfigCard[]>(
    SERIES_COLORS.map((color, index) => ({ id: `hydro-multi-${index + 1}`, color }))
  );
  const [series, setSeries] = useState<LoadedSeries[]>([]);
  const chartExportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchHydroStations().then(setHydroStations).catch(() => setHydroStations([]));
    getBarrages().then(setBarrages).catch(() => setBarrages([]));
  }, []);

  useEffect(() => {
    const stationIds = Array.from(
      new Set(
        configs
          .filter((config) => config.seriesType === "debit_station" && config.entityId)
          .map((config) => String(config.entityId))
          .filter((stationId) => stationId && !statsCache[stationId])
      )
    );

    stationIds.forEach((stationId) => {
      fetchHydroStats(Number(stationId))
        .then((rows) => setStatsCache((prev) => ({ ...prev, [stationId]: rows || [] })))
        .catch(() => setStatsCache((prev) => ({ ...prev, [stationId]: [] })));
    });
  }, [configs, statsCache]);

  useEffect(() => {
    const load = async () => {
      const nextSeries = await Promise.all(
        configs.map(async (config, index) => {
          if (!config.seriesType || !config.entityId || !config.parameter || !config.aggregation) return null;

          const typeMeta = SERIES_TYPES.find((item) => item.id === config.seriesType);
          const entityLabel =
            typeMeta?.entitySource === "barrage"
              ? barrages.find((item) => String(item.id) === String(config.entityId))?.nom_barrage
              : hydroStations.find((item) => String(item.station_id) === String(config.entityId))?.station_name;
          const label = entityLabel || `Série ${index + 1}`;

          if (config.seriesType === "debit_station") {
            if (!config.sourceType || !config.scenarioCode || !config.runId) return null;
            const row = (statsCache[String(config.entityId)] || []).find(
              (item) =>
                String(item.source_type || "").toLowerCase() === String(config.sourceType || "").toLowerCase() &&
                String(item.scenario_code || "") === String(config.scenarioCode || "") &&
                String(item.run_id || "") === String(config.runId || "") &&
                String(item.property_name || "") === String(config.parameter || "") &&
                String(item.time_step || "") === String(config.aggregation || "")
            );
            if (!row) return null;

            const data = await fetchHydroTimeseries({
              ts_id: row.ts_id,
              aggregation: row.time_step,
              date_start: row.dt_min?.slice(0, 10) || "",
              date_end: row.dt_max?.slice(0, 10) || "",
            });

            return {
              id: config.id,
              label: `${label} â€¢ ${config.parameter}`,
              entityLabel: label,
              parameter: String(config.parameter),
              aggregation: String(config.aggregation),
              color: config.color,
              origin: "hydro",
              points: Array.isArray(data)
                ? data.map((entry: any) => ({ date: entry.datetime, value: Number(entry.value) }))
                : [],
            } as LoadedSeries;
          }

          return {
            id: config.id,
            label: `${label} â€¢ ${config.parameter}`,
            entityLabel: label,
            parameter: String(config.parameter),
            aggregation: String(config.aggregation),
            color: config.color,
            origin: "preview",
            points: buildPreviewSeries(config, label),
          } as LoadedSeries;
        })
      );

      setSeries(nextSeries.filter((item): item is LoadedSeries => !!item && item.points.length > 0));
    };

    void load();
  }, [configs, hydroStations, barrages, statsCache]);

  const chartData = useMemo(() => mergeSeries(series), [series]);
  const summaryRows = useMemo(() => buildSummary(series), [series]);
  const detailRows = useMemo(() => buildDetailRows(series), [series]);
  const globalStats = useMemo(() => buildGlobalStats(series), [series]);
  const axisParameters = useMemo(() => Array.from(new Set(series.map((item) => item.parameter))).filter(Boolean), [series]);
  const aggregationLabel = useMemo(() => formatAggregationLabel(series[0]?.aggregation), [series]);
  const leftAxisParameter = axisParameters[0];
  const rightAxisParameter = axisParameters[1];
  const hasPreviewSeries = useMemo(() => series.some((item) => item.origin === "preview"), [series]);

  const exportChartImage = async () => {
    const element = chartExportRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { backgroundColor: "#ffffff", scale: 2, logging: false });
    const link = document.createElement("a");
    link.download = "hydrologie-multiple.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const exportChartPdf = async () => {
    const element = chartExportRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { backgroundColor: "#ffffff", scale: 2, logging: false });
    const pdf = new jsPDF("l", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const ratio = Math.min((pageWidth - margin * 2) / canvas.width, (pageHeight - margin * 2) / canvas.height);
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", (pageWidth - canvas.width * ratio) / 2, margin, canvas.width * ratio, canvas.height * ratio);
    pdf.save("hydrologie-multiple.pdf");
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        {configs.map((config, index) => (
          <SeriesConfigurator
            key={config.id}
            title={`Série ${index + 1}`}
            config={config}
            hydroStations={hydroStations}
            barrageOptions={barrages}
            stats={config.seriesType === "debit_station" && config.entityId ? statsCache[String(config.entityId)] || [] : []}
            onUpdate={(next) =>
              setConfigs((prev) => prev.map((item) => (item.id === config.id ? { ...item, ...next } : item)))
            }
          />
        ))}
      </div>

      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
          <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-violet-600 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-white">
                Séries temporelles comparées{aggregationLabel ? ` - ${aggregationLabel}` : ""}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-lg border border-white/20 bg-white/10 p-0.5 backdrop-blur">
                  <button
                    type="button"
                    className={`rounded-md px-2 py-1 text-xs font-medium ${chartType === "line" ? "bg-white text-slate-800 shadow-sm" : "text-white/75"}`}
                    onClick={() => setChartType("line")}
                  >
                    Courbe
                  </button>
                  <button
                    type="button"
                    className={`rounded-md px-2 py-1 text-xs font-medium ${chartType === "bar" ? "bg-white text-slate-800 shadow-sm" : "text-white/75"}`}
                    onClick={() => setChartType("bar")}
                  >
                    Barres
                  </button>
                </div>
                <button
                  type="button"
                  className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={exportChartImage}
                  disabled={!chartData.length}
                >
                  Export Image
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={exportChartPdf}
                  disabled={!chartData.length}
                >
                  Export PDF
                </button>
              </div>
            </div>
          </div>
          <div className="px-4 pb-4 pt-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 px-3 py-3 shadow-sm">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-700">Minimum</div>
              <div className="text-sm font-semibold text-slate-800">{globalStats.min}</div>
            </div>
            <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-fuchsia-50 px-3 py-3 shadow-sm">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-700">Moyenne</div>
              <div className="text-sm font-semibold text-slate-800">{globalStats.mean}</div>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-green-50 to-emerald-50 px-3 py-3 shadow-sm">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">Maximum</div>
              <div className="text-sm font-semibold text-slate-800">{globalStats.max}</div>
            </div>
            </div>
          </div>

          {axisParameters.length > 0 ? (
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span className="rounded-full bg-sky-50 px-2 py-1 font-medium text-sky-700">
                Axe gauche: {leftAxisParameter}{aggregationLabel ? ` (${aggregationLabel})` : ""}
              </span>
              {rightAxisParameter ? (
                <span className="rounded-full bg-orange-50 px-2 py-1 font-medium text-orange-700">
                  Axe droit: {rightAxisParameter}{aggregationLabel ? ` (${aggregationLabel})` : ""}
                </span>
              ) : null}
            </div>
          ) : null}

          <div className="rounded-lg bg-white" ref={chartExportRef}>
            <div className="h-[300px]">
              {series.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "line" ? (
                    <LineChart data={chartData} margin={{ top: 8, right: rightAxisParameter ? 20 : 8, left: 20, bottom: 28 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={formatPeriodTick} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11 }} width={92} />
                      {rightAxisParameter ? <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} width={92} /> : null}
                      <Tooltip labelFormatter={formatPeriodTick} />
                      <Legend
                        iconType="square"
                        iconSize={10}
                        wrapperStyle={{ paddingTop: 14 }}
                        formatter={(value) => <span style={{ color: "#2563eb", verticalAlign: "middle" }}>{String(value)}</span>}
                      />
                      {series.map((serie) => (
                        <Line
                          key={serie.id}
                          yAxisId={serie.parameter === leftAxisParameter ? "left" : "right"}
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
                    <BarChart data={chartData} margin={{ top: 8, right: rightAxisParameter ? 20 : 8, left: 20, bottom: 28 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={formatPeriodTick} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11 }} width={92} />
                      {rightAxisParameter ? <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} width={92} /> : null}
                      <Tooltip labelFormatter={formatPeriodTick} />
                      <Legend
                        iconType="square"
                        iconSize={10}
                        wrapperStyle={{ paddingTop: 14 }}
                        formatter={(value) => <span style={{ color: "#2563eb", verticalAlign: "middle" }}>{String(value)}</span>}
                      />
                      {series.map((serie) => (
                        <Bar
                          key={serie.id}
                          yAxisId={serie.parameter === leftAxisParameter ? "left" : "right"}
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
                  Configurez au moins une série complète pour afficher le graphe.
                </div>
              )}
            </div>
          </div>

          {axisParameters.length > 2 ? (
            <p className="mt-2 text-xs text-slate-500">Les paramètres supplémentaires utilisent aussi l'axe droit.</p>
          ) : null}
          {hasPreviewSeries ? (
            <p className="mt-2 text-xs text-amber-600">
              Certaines familles non encore branchées au backend sont affichées en mode prévisualisation pour garder la même logique que le dashboard climat.
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.95fr_1.25fr]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md xl:order-2">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3">
              <h3 className="text-base font-semibold text-white">Tableau détaillé des données</h3>
            </div>
            <div className="p-4">
            {detailRows.length > 0 ? (
              <div className="max-h-[300px] overflow-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="sticky top-0 bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">Période</th>
                      <th className="px-3 py-2 text-left font-semibold">Entité</th>
                      <th className="px-3 py-2 text-left font-semibold">Paramètre</th>
                      <th className="px-3 py-2 text-left font-semibold">Agrégation</th>
                      <th className="px-3 py-2 text-right font-semibold">Valeur</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                    {detailRows.map((row, index) => (
                      <tr key={`${row.entityLabel}-${row.parameter}-${row.date}-${index}`}>
                        <td className="whitespace-nowrap px-3 py-2">{formatPeriodTick(row.date)}</td>
                        <td className="px-3 py-2">{row.entityLabel}</td>
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
                Le tableau détaillé apparaîtra ici après sélection des séries.
              </div>
            )}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md xl:order-1">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
              <h3 className="text-base font-semibold text-white">Synthèse des stations</h3>
            </div>
            <div className="p-4">
            <div className="h-[300px]">
              {summaryRows.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summaryRows}>
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
    </div>
  );
}

