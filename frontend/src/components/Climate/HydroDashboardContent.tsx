import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { getBarrages } from "@/api/client";
import {
  fetchBarrageQualityParameters,
  fetchBarrageQualitySeries,
  fetchHydroStations,
  fetchHydroStats,
  fetchHydroTimeseries,
} from "@/api/hydro";

import HydroModeBar from "./HydroModeBar";
import HydroFiltersSimple from "./HydroFiltersSimple";
import HydroTable from "./HydroTable";
import HydroChart from "./HydroChart";
import HydroMultiModesDashboard from "./HydroMultiModesDashboard";

type Mode = "simple" | "multi";
type BarrageAggregation = "raw" | "monthly" | "annual";

function fmt(value: number | null) {
  return value === null || Number.isNaN(value) ? "—" : value.toFixed(2);
}

function formatDisplayDate(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatChartLabel(dateValue: string, aggregation?: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  if (aggregation === "annual") return String(date.getFullYear());
  if (aggregation === "monthly") return date.toLocaleDateString("fr-FR", { month: "2-digit", year: "numeric" });
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

function aggregationLabel(value: string) {
  if (value === "annual") return "Annuel";
  if (value === "monthly") return "Mensuel";
  if (value === "raw") return "Brut";
  return "—";
}

function ActionButton({
  label,
  onClick,
  disabled = false,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label}
    </button>
  );
}

function OverlayModal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-6 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-200"
          >
            Fermer
          </button>
        </div>
        <div className="max-h-[calc(92vh-72px)] overflow-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function PointWaterTable({ rows, parameter, unit }: { rows: any[]; parameter: string; unit: string }) {
  if (!rows.length) {
    return (
      <div className="flex h-[320px] flex-col items-center justify-center rounded-b-lg bg-gradient-to-b from-gray-50 to-white">
        <div className="mb-3 text-5xl opacity-30">📋</div>
        <p className="font-medium text-gray-400">Aucune donnee a afficher</p>
      </div>
    );
  }

  return (
    <div className="flex h-[360px] flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-2">
        <span className="text-xs font-semibold text-gray-600">{rows.length} enregistrements</span>
        <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs text-cyan-700">{parameter}</span>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gradient-to-r from-gray-100 to-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Periode</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Parametre</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Valeur</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Unite</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, index) => (
              <tr key={`${row.datetime}-${index}`} className="hover:bg-cyan-50/40">
                <td className="px-4 py-2.5 text-gray-700">{String(row.period ?? "").trim() || new Date(row.datetime).getFullYear()}</td>
                <td className="px-4 py-2.5 text-gray-700">{parameter}</td>
                <td className="px-4 py-2.5 text-right font-mono font-semibold text-gray-800">{Number(row.value).toFixed(2)}</td>
                <td className="px-4 py-2.5 text-gray-500">{unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PointWaterChart({ rows, parameter, unit }: { rows: any[]; parameter: string; unit: string }) {
  if (!rows.length) {
    return (
      <div className="flex h-[320px] flex-col items-center justify-center rounded-b-lg bg-gradient-to-b from-gray-50 to-white">
        <div className="mb-3 text-5xl opacity-30">📈</div>
        <p className="font-medium text-gray-400">Aucune donnee a visualiser</p>
      </div>
    );
  }

  return (
    <div className="h-[320px]">
      <div className="mb-2 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-cyan-500"></div>
          <span className="text-xs text-gray-600">{parameter}</span>
        </div>
        <span className="text-xs text-gray-400">{rows.length} points</span>
      </div>
      <ResponsiveContainer width="100%" height="92%">
        <BarChart data={rows} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5eefc" />
          <XAxis dataKey="period" tick={{ fontSize: 10, fill: "#64748b" }} />
          <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
          <Tooltip
            formatter={(value: any) => [`${Number(value).toFixed(2)} ${unit}`, parameter]}
            labelFormatter={(label) => `Periode : ${label}`}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#06b6d4" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function DataTable({
  rows,
  emptyText,
  showParameter = true,
  showUnit = true,
}: {
  rows: Array<{ period: string; parameter: string; value: number; unit: string }>;
  emptyText: string;
  showParameter?: boolean;
  showUnit?: boolean;
}) {
  if (!rows.length) {
    return (
      <div className="flex h-[320px] flex-col items-center justify-center rounded-b-lg bg-gradient-to-b from-gray-50 to-white">
        <div className="mb-3 text-5xl opacity-30">📋</div>
        <p className="font-medium text-gray-400">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="flex h-[360px] flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-2">
        <span className="text-xs font-semibold text-gray-600">{rows.length} enregistrements</span>
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">Tableau detaille</span>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-gray-100 to-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Periode</th>
              {showParameter && (
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Parametre</th>
              )}
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Valeur</th>
              {showUnit && (
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Unite</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, index) => (
              <tr key={`${row.period}-${row.parameter}-${index}`} className="transition-colors hover:bg-blue-50/40">
                <td className="px-4 py-2.5 text-gray-700">{row.period}</td>
                {showParameter && <td className="px-4 py-2.5 text-gray-700">{row.parameter}</td>}
                <td className="px-4 py-2.5 text-right font-mono font-semibold text-gray-800">{row.value.toFixed(2)}</td>
                {showUnit && <td className="px-4 py-2.5 text-gray-500">{row.unit}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChartView({
  data,
  unit,
  chartType,
  chartScale,
  aggregation,
  emptyText,
}: {
  data: Array<{ label: string; value: number }>;
  unit: string;
  chartType: "line" | "bar";
  chartScale: "linear" | "log";
  aggregation?: string;
  emptyText: string;
}) {
  if (!data.length) {
    return (
      <div className="flex h-[320px] flex-col items-center justify-center rounded-b-lg bg-gradient-to-b from-gray-50 to-white">
        <div className="mb-3 text-5xl opacity-30">📈</div>
        <p className="font-medium text-gray-400">{emptyText}</p>
      </div>
    );
  }

  const chartData = chartScale === "log" ? data.filter((item) => item.value > 0) : data;

  if (!chartData.length) {
    return (
      <div className="flex h-[320px] flex-col items-center justify-center rounded-b-lg bg-gradient-to-b from-gray-50 to-white">
        <div className="mb-3 text-5xl opacity-30">📈</div>
        <p className="font-medium text-gray-400">Aucune valeur positive pour l'echelle logarithmique</p>
      </div>
    );
  }

  return (
    <div className="h-[340px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 16, left: 4, bottom: 18 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5eefc" />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#64748b" }} minTickGap={20} />
          <YAxis
            tick={{ fontSize: 10, fill: "#64748b" }}
            scale={chartScale === "log" ? "log" : "auto"}
            domain={chartScale === "log" ? [1, "auto"] : ["auto", "auto"]}
          />
          <Tooltip formatter={(value: any) => [`${Number(value).toFixed(2)} ${unit}`, "Valeur"]} />
          {chartType === "bar" ? (
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#2563eb" />
          ) : (
            <>
              <Bar dataKey="value" fill="#bfdbfe" opacity={0.2} radius={[6, 6, 0, 0]} />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2.5} dot={false} />
            </>
          )}
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-1 text-center text-[10px] text-gray-400">
        {aggregation === "daily" && "Donnees journalieres"}
        {aggregation === "monthly" && "Moyennes mensuelles"}
        {aggregation === "annual" && "Moyennes annuelles"}
      </div>
    </div>
  );
}

function BarrageChartView({
  data,
  primaryParameter,
  secondaryParameter,
  chartType,
  chartScale,
  aggregation,
  emptyText,
}: {
  data: Array<{ label: string; primaryValue: number | null; secondaryValue: number | null }>;
  primaryParameter: string;
  secondaryParameter?: string;
  chartType: "line" | "bar";
  chartScale: "linear" | "log";
  aggregation: BarrageAggregation;
  emptyText: string;
}) {
  if (!data.length) {
    return (
      <div className="flex h-[320px] flex-col items-center justify-center rounded-b-lg bg-gradient-to-b from-gray-50 to-white">
        <div className="mb-3 text-5xl opacity-30">📈</div>
        <p className="font-medium text-gray-400">{emptyText}</p>
      </div>
    );
  }

  const hasSecondary = Boolean(secondaryParameter);
  const positivePrimary = data.some((item) => (item.primaryValue ?? 0) > 0);
  const positiveSecondary = !hasSecondary || data.some((item) => (item.secondaryValue ?? 0) > 0);
  if (chartScale === "log" && (!positivePrimary || !positiveSecondary)) {
    return (
      <div className="flex h-[320px] flex-col items-center justify-center rounded-b-lg bg-gradient-to-b from-gray-50 to-white">
        <div className="mb-3 text-5xl opacity-30">📈</div>
        <p className="font-medium text-gray-400">Aucune valeur positive pour l'echelle logarithmique</p>
      </div>
    );
  }

  return (
    <div className="h-[340px]">
      <div className="mb-2 flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-gray-600"><span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>{primaryParameter}</span>
          {hasSecondary && (
            <span className="flex items-center gap-1 text-gray-600"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>{secondaryParameter}</span>
          )}
        </div>
        <span className="text-gray-400">{data.length} points</span>
      </div>
      <ResponsiveContainer width="100%" height="92%">
        <ComposedChart data={data} margin={{ top: 10, right: 18, left: 4, bottom: 18 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5eefc" />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#64748b" }} minTickGap={20} />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 10, fill: "#64748b" }}
            scale={chartScale === "log" ? "log" : "auto"}
            domain={chartScale === "log" ? [1, "auto"] : ["auto", "auto"]}
          />
          {hasSecondary && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 10, fill: "#64748b" }}
              scale={chartScale === "log" ? "log" : "auto"}
              domain={chartScale === "log" ? [1, "auto"] : ["auto", "auto"]}
            />
          )}
          <Tooltip
            formatter={(value: any, name: string) => [value === null || value === undefined ? "—" : Number(value).toFixed(2), name]}
          />
          {chartType === "bar" ? (
            <>
              <Bar yAxisId="left" dataKey="primaryValue" name={primaryParameter} radius={[6, 6, 0, 0]} fill="#3b82f6" />
              {hasSecondary && <Bar yAxisId="right" dataKey="secondaryValue" name={secondaryParameter} radius={[6, 6, 0, 0]} fill="#10b981" />}
            </>
          ) : (
            <>
              <Line yAxisId="left" type="monotone" dataKey="primaryValue" name={primaryParameter} stroke="#3b82f6" strokeWidth={2.5} dot={false} />
              {hasSecondary && <Line yAxisId="right" type="monotone" dataKey="secondaryValue" name={secondaryParameter} stroke="#10b981" strokeWidth={2.5} dot={false} />}
            </>
          )}
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-1 text-center text-[10px] text-gray-400">
        {aggregation === "raw" && "Donnees brutes"}
        {aggregation === "monthly" && "Moyennes mensuelles"}
        {aggregation === "annual" && "Moyennes annuelles"}
      </div>
    </div>
  );
}

export default function HydroDashboardContent() {
  const stationCacheKey = "hydro_simple_stations_cache";
  const [mode, setMode] = useState<Mode>("simple");
  const [simpleScope, setSimpleScope] = useState<"station" | "barrage">("station");
  const [stationChartType, setStationChartType] = useState<"line" | "bar">("line");
  const [stationChartScale, setStationChartScale] = useState<"linear" | "log">("linear");
  const [barrageChartType, setBarrageChartType] = useState<"line" | "bar">("bar");
  const [barrageChartScale, setBarrageChartScale] = useState<"linear" | "log">("linear");
  const [expandedPanel, setExpandedPanel] = useState<"stationTable" | "stationChart" | "barrageTable" | "barrageChart" | null>(null);

  const [barrages, setBarrages] = useState<any[]>([]);
  const [selectedBarrageId, setSelectedBarrageId] = useState<number | null>(null);
  const [barrageAggregation, setBarrageAggregation] = useState<BarrageAggregation>("raw");
  const [selectedBarrageParameter, setSelectedBarrageParameter] = useState("");
  const [selectedBarrageSecondaryParameter, setSelectedBarrageSecondaryParameter] = useState("");
  const [barrageDateStart, setBarrageDateStart] = useState("");
  const [barrageDateEnd, setBarrageDateEnd] = useState("");
  const [barrageParameterOptions, setBarrageParameterOptions] = useState<Array<{ parameter: string; date_min?: string; date_max?: string }>>([]);
  const [barrageSeries, setBarrageSeries] = useState<Array<{ datetime: string; parameter: string; value: number }>>([]);

  const [stations, setStations] = useState<any[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.sessionStorage.getItem(stationCacheKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [stationsLoading, setStationsLoading] = useState<boolean>(stations.length === 0);
  const [stationId, setStationId] = useState<number | null>(null);
  const [rowsStats, setRowsStats] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [series, setSeries] = useState<any[]>([]);
  const stationTableRef = useRef<HTMLDivElement | null>(null);
  const stationChartRef = useRef<HTMLDivElement | null>(null);
  const barrageTableRef = useRef<HTMLDivElement | null>(null);
  const barrageChartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getBarrages().then(setBarrages).catch(() => setBarrages([]));
    setStationsLoading(true);
    fetchHydroStations()
      .then((rows) => {
        const safeRows = Array.isArray(rows) ? rows : [];
        setStations(safeRows);
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(stationCacheKey, JSON.stringify(safeRows));
        }
      })
      .catch(() => setStations([]))
      .finally(() => setStationsLoading(false));
  }, []);

  useEffect(() => {
    if (!stationId) {
      setRowsStats([]);
      setSelectedRow(null);
      setSeries([]);
      setDateStart("");
      setDateEnd("");
      return;
    }

    fetchHydroStats(stationId)
      .then((rows) => {
        setRowsStats(rows);
        setSelectedRow(null);
        setSeries([]);
        setDateStart("");
        setDateEnd("");
      })
      .catch(() => {
        setRowsStats([]);
        setSelectedRow(null);
      });
  }, [stationId]);

  useEffect(() => {
    if (mode !== "simple" || simpleScope !== "station") return;

    if (selectedRow?.source_kind === "points_eau") {
      setSeries(Array.isArray(selectedRow.details) ? selectedRow.details : []);
      return;
    }

    if (!selectedRow?.ts_id || !dateStart || !dateEnd) {
      setSeries([]);
      return;
    }

    fetchHydroTimeseries({
      ts_id: selectedRow.ts_id,
      aggregation: selectedRow.time_step === "instantaneous" ? "monthly" : selectedRow.time_step,
      date_start: dateStart,
      date_end: dateEnd,
    })
      .then((rows) => setSeries(rows))
      .catch(() => setSeries([]));
  }, [selectedRow, dateStart, dateEnd, mode, simpleScope]);

  useEffect(() => {
    if (!selectedBarrageId) {
      setBarrageParameterOptions([]);
      setSelectedBarrageParameter("");
      setSelectedBarrageSecondaryParameter("");
      setBarrageAggregation("raw");
      setBarrageDateStart("");
      setBarrageDateEnd("");
      setBarrageSeries([]);
      return;
    }

    fetchBarrageQualityParameters(selectedBarrageId)
      .then((rows) => {
        const safeRows = Array.isArray(rows) ? rows : [];
        setBarrageParameterOptions(safeRows);
        const firstParameter = safeRows[0]?.parameter ?? "";
        setSelectedBarrageParameter(firstParameter);
        setSelectedBarrageSecondaryParameter("");
        setBarrageAggregation("raw");
        const minDate = safeRows
          .map((row) => String(row.date_min ?? ""))
          .filter(Boolean)
          .sort()[0] ?? "";
        const maxDate = safeRows
          .map((row) => String(row.date_max ?? ""))
          .filter(Boolean)
          .sort()
          .slice(-1)[0] ?? "";
        setBarrageDateStart(minDate);
        setBarrageDateEnd(maxDate);
      })
      .catch(() => {
        setBarrageParameterOptions([]);
        setSelectedBarrageParameter("");
        setSelectedBarrageSecondaryParameter("");
        setBarrageDateStart("");
        setBarrageDateEnd("");
      });
  }, [selectedBarrageId]);

  useEffect(() => {
    if (mode !== "simple" || simpleScope !== "barrage" || !selectedBarrageId || !selectedBarrageParameter) {
      setBarrageSeries([]);
      return;
    }

    fetchBarrageQualitySeries({
      barrage_id: selectedBarrageId,
      aggregation: barrageAggregation,
      date_start: barrageDateStart,
      date_end: barrageDateEnd,
      parameter: selectedBarrageParameter,
      parameter_secondary: selectedBarrageSecondaryParameter || undefined,
    })
      .then((rows) => setBarrageSeries(Array.isArray(rows) ? rows : []))
      .catch(() => setBarrageSeries([]));
  }, [
    mode,
    simpleScope,
    selectedBarrageId,
    selectedBarrageParameter,
    selectedBarrageSecondaryParameter,
    barrageAggregation,
    barrageDateStart,
    barrageDateEnd,
  ]);

  useEffect(() => {
    if (selectedBarrageSecondaryParameter && selectedBarrageSecondaryParameter === selectedBarrageParameter) {
      setSelectedBarrageSecondaryParameter("");
    }
  }, [selectedBarrageParameter, selectedBarrageSecondaryParameter]);

  useEffect(() => {
    if (!barrageParameterOptions.length || selectedBarrageParameter) return;
    setSelectedBarrageParameter(barrageParameterOptions[0]?.parameter ?? "");
  }, [barrageParameterOptions, selectedBarrageParameter]);

  const values = useMemo(
    () => series.map((row) => Number(row.value)).filter((value) => !Number.isNaN(value)),
    [series],
  );

  const min = values.length ? Math.min(...values) : null;
  const max = values.length ? Math.max(...values) : null;
  const mean = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;

  const pasLabel =
    selectedRow?.source_kind === "points_eau"
      ? "Annuel"
      : selectedRow?.time_step === "daily"
        ? "Journalier"
        : selectedRow?.time_step === "monthly"
          ? "Mensuel"
          : selectedRow?.time_step === "annual"
            ? "Annuel"
            : selectedRow?.time_step === "instantaneous"
              ? "Instantane"
              : "—";

  const stationUnit = selectedRow?.source_kind === "points_eau" ? selectedRow?.unit ?? "" : "m3/s";
  const stationDataTitle = selectedRow?.source_kind === "points_eau" ? "Donnees points d'eau" : "Donnees de debit";
  const stationChartTitle = selectedRow?.source_kind === "points_eau" ? "Visualisation points d'eau" : "Visualisation";

  const selectedBarrage = barrages.find((item) => item.id === selectedBarrageId) ?? null;
  const barragePrimaryValues = useMemo(
    () =>
      barrageSeries
        .filter((row) => row.parameter === selectedBarrageParameter)
        .map((row) => Number(row.value))
        .filter((value) => !Number.isNaN(value)),
    [barrageSeries, selectedBarrageParameter],
  );
  const barrageMin = barragePrimaryValues.length ? Math.min(...barragePrimaryValues) : null;
  const barrageMax = barragePrimaryValues.length ? Math.max(...barragePrimaryValues) : null;
  const barrageMean = barragePrimaryValues.length
    ? barragePrimaryValues.reduce((sum, value) => sum + value, 0) / barragePrimaryValues.length
    : null;

  const barrageMetricCards = [
    { title: "Pas de temps", value: aggregationLabel(barrageAggregation), unit: selectedBarrageParameter || "Barrage", color: "text-blue-700" },
    {
      title: "Minimum",
      value: fmt(barrageMin),
      unit: selectedBarrageParameter ? "valeur" : "—",
      color: "text-green-700",
    },
    {
      title: "Maximum",
      value: fmt(barrageMax),
      unit: selectedBarrageParameter ? "valeur" : "—",
      color: "text-red-700",
    },
    {
      title: "Moyenne",
      value: fmt(barrageMean),
      unit: selectedBarrageParameter ? "valeur" : "—",
      color: "text-purple-700",
    },
  ];

  const handleSimpleRowChange = (row: any | null) => {
    setSelectedRow(row);
    if (!row) {
      setDateStart("");
      setDateEnd("");
      return;
    }
    setDateStart(row?.dt_min?.slice?.(0, 10) ?? row?.dt_min ?? "");
    setDateEnd(row?.dt_max?.slice?.(0, 10) ?? row?.dt_max ?? "");
  };

  const stationTableRows = useMemo(() => {
    if (!series.length) return [] as Array<{ period: string; parameter: string; value: number; unit: string }>;
    if (selectedRow?.source_kind === "points_eau") {
      return series.map((row) => ({
        period: String(row.period ?? "").trim() || formatChartLabel(row.datetime, "annual"),
        parameter: selectedRow?.property_name ?? "Parametre",
        value: Number(row.value),
        unit: stationUnit,
      }));
    }
    return series.map((row) => ({
      period: formatDisplayDate(row.datetime),
      parameter: "Debit",
      value: Number(row.value),
      unit: stationUnit,
    }));
  }, [series, selectedRow, stationUnit]);

  const stationChartData = useMemo(
    () =>
      series.map((row) => ({
        label: selectedRow?.source_kind === "points_eau"
          ? String(row.period ?? "").trim()
          : formatChartLabel(row.datetime, selectedRow?.time_step),
        value: Number(row.value),
      })),
    [series, selectedRow],
  );

  const barrageTableRows = useMemo(() => {
    if (!barrageSeries.length) return [] as Array<{ period: string; parameter: string; value: number; unit: string }>;
    return barrageSeries.map((row) => ({
      period: formatDisplayDate(row.datetime),
      parameter: row.parameter,
      value: Number(row.value),
      unit: "",
    }));
  }, [barrageSeries]);

  const barrageChartData = useMemo(() => {
    if (!barrageSeries.length || !selectedBarrageParameter) {
      return [] as Array<{ label: string; primaryValue: number | null; secondaryValue: number | null }>;
    }

    const grouped = new Map<string, { label: string; primaryValue: number | null; secondaryValue: number | null }>();
    barrageSeries.forEach((row) => {
      const key = String(row.datetime);
      const existing = grouped.get(key) ?? {
        label: formatChartLabel(row.datetime, barrageAggregation),
        primaryValue: null,
        secondaryValue: null,
      };
      if (row.parameter === selectedBarrageParameter) {
        existing.primaryValue = Number(row.value);
      }
      if (selectedBarrageSecondaryParameter && row.parameter === selectedBarrageSecondaryParameter) {
        existing.secondaryValue = Number(row.value);
      }
      grouped.set(key, existing);
    });

    return Array.from(grouped.entries())
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([, value]) => value);
  }, [barrageSeries, selectedBarrageParameter, selectedBarrageSecondaryParameter, barrageAggregation]);

  const exportChartImage = async (ref: React.RefObject<HTMLDivElement | null>, fileName: string) => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { backgroundColor: "#ffffff", scale: 2 });
    const link = document.createElement("a");
    link.download = `${fileName}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const exportChartPdf = async (ref: React.RefObject<HTMLDivElement | null>, fileName: string) => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { backgroundColor: "#ffffff", scale: 2 });
    const imageData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height] });
    pdf.addImage(imageData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${fileName}.pdf`);
  };

  const exportTableCsv = (
    rows: Array<{ period: string; parameter: string; value: number; unit: string }>,
    fileName: string,
  ) => {
    if (!rows.length) return;
    const header = ["Periode", "Parametre", "Valeur", "Unite"];
    const csvRows = rows.map((row) => [row.period, row.parameter, String(row.value), row.unit]);
    const content = [header, ...csvRows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, "\"\"")}"`).join(";"))
      .join("\n");
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportTableExcel = (
    rows: Array<{ period: string; parameter: string; value: number; unit: string }>,
    fileName: string,
  ) => {
    if (!rows.length) return;
    const html = `
      <table>
        <tr><th>Periode</th><th>Parametre</th><th>Valeur</th><th>Unite</th></tr>
        ${rows
          .map((row) => `<tr><td>${row.period}</td><td>${row.parameter}</td><td>${row.value}</td><td>${row.unit}</td></tr>`)
          .join("")}
      </table>
    `;
    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <HydroModeBar mode={mode} onChange={setMode} />

      {mode === "simple" && (
        <div className="space-y-6">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setSimpleScope("station")}
              className={`min-w-[92px] rounded-lg px-5 py-2 text-sm font-semibold transition ${
                simpleScope === "station" ? "bg-cyan-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Station
            </button>
            <button
              type="button"
              onClick={() => setSimpleScope("barrage")}
              className={`min-w-[92px] rounded-lg px-5 py-2 text-sm font-semibold transition ${
                simpleScope === "barrage" ? "bg-cyan-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Barrage
            </button>
          </div>

          {simpleScope === "station" ? (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-3">
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3">
                    <h3 className="flex items-center gap-2 font-semibold text-white">
                      <span>⚙️</span> Parametres
                    </h3>
                  </div>
                  <div className="p-4">
                    <HydroFiltersSimple
                      stations={stations}
                      stationsLoading={stationsLoading}
                      rowsStats={rowsStats}
                      selectedRow={selectedRow}
                      dateStart={dateStart}
                      dateEnd={dateEnd}
                      onStationChange={setStationId}
                      onRowChange={handleSimpleRowChange}
                      onDateStartChange={setDateStart}
                      onDateEndChange={setDateEnd}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-12 space-y-6 lg:col-span-9">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm"><div className="p-4"><div className="text-xs font-semibold uppercase tracking-wider text-blue-700">Pas de temps</div><div className="mt-1 text-2xl font-bold text-gray-800">{selectedRow ? pasLabel : "—"}</div><div className="mt-1 text-xs text-gray-500">{selectedRow ? "Aggregation" : "Non selectionne"}</div></div></div>
                  <div className="relative overflow-hidden rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm"><div className="p-4"><div className="text-xs font-semibold uppercase tracking-wider text-green-700">Minimum</div><div className="mt-1 text-2xl font-bold text-gray-800">{selectedRow ? fmt(min) : "—"}</div><div className="mt-1 text-xs text-gray-500">{selectedRow ? stationUnit : "—"}</div></div></div>
                  <div className="relative overflow-hidden rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 shadow-sm"><div className="p-4"><div className="text-xs font-semibold uppercase tracking-wider text-red-700">Maximum</div><div className="mt-1 text-2xl font-bold text-gray-800">{selectedRow ? fmt(max) : "—"}</div><div className="mt-1 text-xs text-gray-500">{selectedRow ? stationUnit : "—"}</div></div></div>
                  <div className="relative overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-fuchsia-50 shadow-sm"><div className="p-4"><div className="text-xs font-semibold uppercase tracking-wider text-purple-700">Moyenne</div><div className="mt-1 text-2xl font-bold text-gray-800">{selectedRow ? fmt(mean) : "—"}</div><div className="mt-1 text-xs text-gray-500">{selectedRow ? stationUnit : "—"}</div></div></div>
                </div>

                {selectedRow && dateStart && dateEnd && (
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">📅</span>
                      <span className="text-sm text-gray-600">Periode d'affichage : <span className="ml-1 font-semibold text-gray-800">{dateStart} - {dateEnd}</span></span>
                    </div>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">{values.length} points</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3">
                      <h3 className="flex items-center gap-2 font-semibold text-white"><span>📋</span> {stationDataTitle}</h3>
                      <div className="flex items-center gap-2">
                        {selectedRow && <span className="rounded-full bg-white/30 px-2 py-1 text-xs text-white">{selectedRow?.source_kind === "points_eau" ? selectedRow?.property_name : pasLabel}</span>}
                        <ActionButton label="⤢" onClick={() => setExpandedPanel("stationTable")} disabled={!stationTableRows.length} />
                        <ActionButton label="Excel" onClick={() => exportTableExcel(stationTableRows, "hydro_station_table")} disabled={!stationTableRows.length} />
                        <ActionButton label="CSV" onClick={() => exportTableCsv(stationTableRows, "hydro_station_table")} disabled={!stationTableRows.length} />
                      </div>
                    </div>
                    <div ref={stationTableRef} className="p-0">
                      <DataTable rows={stationTableRows} emptyText="Aucune donnee a afficher" showParameter={false} showUnit={false} />
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
                    <div className="flex flex-col gap-3 bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-2 font-semibold text-white"><span>📈</span> {stationChartTitle}</h3>
                        <div className="flex items-center gap-2">
                          <ActionButton label="⤢" onClick={() => setExpandedPanel("stationChart")} disabled={!stationChartData.length} />
                          <ActionButton label="PNG" onClick={() => exportChartImage(stationChartRef, "hydro_station_chart")} disabled={!stationChartData.length} />
                          <ActionButton label="PDF" onClick={() => exportChartPdf(stationChartRef, "hydro_station_chart")} disabled={!stationChartData.length} />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <select value={stationChartType} onChange={(e) => setStationChartType(e.target.value as "line" | "bar")} className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-white outline-none">
                          <option className="text-slate-900" value="line">Courbe</option>
                          <option className="text-slate-900" value="bar">Barres</option>
                        </select>
                        <select value={stationChartScale} onChange={(e) => setStationChartScale(e.target.value as "linear" | "log")} className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-white outline-none">
                          <option className="text-slate-900" value="linear">Lineaire</option>
                          <option className="text-slate-900" value="log">Logarithmique</option>
                        </select>
                        <input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-white outline-none" />
                        <input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-white outline-none" />
                      </div>
                    </div>
                    <div ref={stationChartRef} className="p-3">
                      <ChartView
                        data={stationChartData}
                        unit={stationUnit}
                        chartType={stationChartType}
                        chartScale={stationChartScale}
                        aggregation={selectedRow?.source_kind === "points_eau" ? "annual" : selectedRow?.time_step}
                        emptyText="Aucune donnee a visualiser"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-3">
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3">
                    <h3 className="flex items-center gap-2 font-semibold text-white"><span>⚙️</span> Parametres barrage</h3>
                  </div>
                  <div className="space-y-4 p-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Barrage</label>
                      <select
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-all focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                        value={selectedBarrageId ?? ""}
                        onChange={(e) => setSelectedBarrageId(e.target.value ? Number(e.target.value) : null)}
                      >
                        <option value="">Selectionner un barrage...</option>
                        {barrages.map((barrage) => (
                          <option key={barrage.id} value={barrage.id}>{barrage.nom_barrage}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Parametre principal</label>
                      <select
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-all focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                        value={selectedBarrageParameter}
                        onChange={(e) => setSelectedBarrageParameter(e.target.value)}
                      >
                        <option value="">Selectionner un parametre...</option>
                        {barrageParameterOptions.map((option) => (
                          <option key={option.parameter} value={option.parameter}>{option.parameter}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Parametre secondaire</label>
                      <select
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-all focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                        value={selectedBarrageSecondaryParameter}
                        onChange={(e) => setSelectedBarrageSecondaryParameter(e.target.value)}
                      >
                        <option value="">Aucun</option>
                        {barrageParameterOptions
                          .filter((option) => option.parameter !== selectedBarrageParameter)
                          .map((option) => (
                            <option key={option.parameter} value={option.parameter}>{option.parameter}</option>
                          ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Agregation</label>
                      <select
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-all focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                        value={barrageAggregation}
                        onChange={(e) => setBarrageAggregation(e.target.value as BarrageAggregation)}
                      >
                        <option value="raw">Brut</option>
                        <option value="monthly">Mensuel</option>
                        <option value="annual">Annuel</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Periode</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          value={barrageDateStart}
                          onChange={(e) => setBarrageDateStart(e.target.value)}
                          className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-all focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                        />
                        <input
                          type="date"
                          value={barrageDateEnd}
                          onChange={(e) => setBarrageDateEnd(e.target.value)}
                          className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition-all focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 space-y-6 lg:col-span-9">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {barrageMetricCards.map((card) => (
                    <div key={card.title} className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
                      <div className="p-4"><div className={`text-xs font-semibold uppercase tracking-wider ${card.color}`}>{card.title}</div><div className="mt-1 text-2xl font-bold text-gray-800">{selectedBarrageParameter ? card.value : "—"}</div><div className="mt-1 text-xs text-gray-500">{card.unit}</div></div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
                    <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3">
                      <h3 className="flex items-center gap-2 font-semibold text-white"><span>📋</span> Donnees barrage</h3>
                      <div className="flex items-center gap-2">
                        <ActionButton label="⤢" onClick={() => setExpandedPanel("barrageTable")} disabled={!barrageTableRows.length} />
                        <ActionButton label="Excel" onClick={() => exportTableExcel(barrageTableRows, "hydro_barrage_table")} disabled={!barrageTableRows.length} />
                        <ActionButton label="CSV" onClick={() => exportTableCsv(barrageTableRows, "hydro_barrage_table")} disabled={!barrageTableRows.length} />
                      </div>
                    </div>
                    <div ref={barrageTableRef} className="p-0">
                      <DataTable rows={barrageTableRows} emptyText="Selectionnez un barrage et un parametre." showUnit={false} />
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
                    <div className="flex flex-col gap-3 bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-2 font-semibold text-white"><span>📈</span> Visualisation barrage</h3>
                        <div className="flex items-center gap-2">
                          <ActionButton label="⤢" onClick={() => setExpandedPanel("barrageChart")} disabled={!barrageChartData.length} />
                          <ActionButton label="PNG" onClick={() => exportChartImage(barrageChartRef, "hydro_barrage_chart")} disabled={!barrageChartData.length} />
                          <ActionButton label="PDF" onClick={() => exportChartPdf(barrageChartRef, "hydro_barrage_chart")} disabled={!barrageChartData.length} />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <select value={barrageChartType} onChange={(e) => setBarrageChartType(e.target.value as "line" | "bar")} className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-white outline-none">
                          <option className="text-slate-900" value="line">Courbe</option>
                          <option className="text-slate-900" value="bar">Barres</option>
                        </select>
                        <select value={barrageChartScale} onChange={(e) => setBarrageChartScale(e.target.value as "linear" | "log")} className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-white outline-none">
                          <option className="text-slate-900" value="linear">Lineaire</option>
                          <option className="text-slate-900" value="log">Logarithmique</option>
                        </select>
                        <span className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-white">{aggregationLabel(barrageAggregation)}</span>
                      </div>
                    </div>
                    <div ref={barrageChartRef} className="p-3">
                      <BarrageChartView
                        data={barrageChartData}
                        primaryParameter={selectedBarrageParameter}
                        secondaryParameter={selectedBarrageSecondaryParameter || undefined}
                        chartType={barrageChartType}
                        chartScale={barrageChartScale}
                        aggregation={barrageAggregation}
                        emptyText="Selectionnez un barrage et un parametre."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "multi" && <HydroMultiModesDashboard />}

      <OverlayModal open={expandedPanel === "stationTable"} title="Tableau station" onClose={() => setExpandedPanel(null)}>
        <DataTable rows={stationTableRows} emptyText="Aucune donnee a afficher" showParameter={false} showUnit={false} />
      </OverlayModal>
      <OverlayModal open={expandedPanel === "stationChart"} title="Graphe station" onClose={() => setExpandedPanel(null)}>
        <ChartView
          data={stationChartData}
          unit={stationUnit}
          chartType={stationChartType}
          chartScale={stationChartScale}
          aggregation={selectedRow?.source_kind === "points_eau" ? "annual" : selectedRow?.time_step}
          emptyText="Aucune donnee a visualiser"
        />
      </OverlayModal>
      <OverlayModal open={expandedPanel === "barrageTable"} title="Tableau barrage" onClose={() => setExpandedPanel(null)}>
        <DataTable rows={barrageTableRows} emptyText="Selectionnez un barrage et un parametre." showUnit={false} />
      </OverlayModal>
      <OverlayModal open={expandedPanel === "barrageChart"} title="Graphe barrage" onClose={() => setExpandedPanel(null)}>
        <BarrageChartView
          data={barrageChartData}
          primaryParameter={selectedBarrageParameter}
          secondaryParameter={selectedBarrageSecondaryParameter || undefined}
          chartType={barrageChartType}
          chartScale={barrageChartScale}
          aggregation={barrageAggregation}
          emptyText="Selectionnez un barrage et un parametre."
        />
      </OverlayModal>
    </div>
  );
}

