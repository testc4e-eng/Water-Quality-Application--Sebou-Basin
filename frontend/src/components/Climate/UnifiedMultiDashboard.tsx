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

import UnifiedFilters from "@/components/Climate/UnifiedFilters";
import { getParameterTimeseries } from "@/api/observatory";
import type { HierParameter, HierSubMenu, HierEntity } from "@/api/observatory";

type Selection = {
  stationId?: string;
  parameter?: HierParameter;
  submenu?: string;
  entityObj?: HierEntity;
};

type ConfigCard = {
  id: string;
  color: string;
  selection: Selection;
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

function isSameSelection(a: Selection, b: Selection) {
  return (
    (a.stationId ?? "") === (b.stationId ?? "") &&
    (a.submenu ?? "") === (b.submenu ?? "") &&
    (a.parameter?.param_code ?? "") === (b.parameter?.param_code ?? "")
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

function formatYearTick(value: string | number) {
  if (typeof value === "string" && value.length >= 4) {
    if (value.includes("-")) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d.toLocaleDateString("fr-FR", { day: '2-digit', month: '2-digit', year: 'numeric'});
    }
  }
  return String(value);
}

export default function UnifiedMultiDashboard({ theme }: { theme: string }) {
  const [multiChartType, setMultiChartType] = useState<"line" | "bar">("line");
  const [multiConfigs, setMultiConfigs] = useState<ConfigCard[]>(
    SERIES_COLORS.slice(0, 3).map((color, index) => ({ id: `multi-${index + 1}`, color, selection: {} }))
  );
  const [multiSeries, setMultiSeries] = useState<LoadedSeries[]>([]);
  const multiChartExportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const nextSeries = await Promise.all(
        multiConfigs.map(async (config, index) => {
          const sel = config.selection;
          if (!sel.stationId || !sel.submenu || !sel.parameter) return null;

          try {
            const data = await getParameterTimeseries({
              theme: theme,
              sous_menu: sel.submenu,
              param_code: sel.parameter.param_code,
              entity_id: sel.stationId,
            });

            if (cancelled) return null;

            const name = sel.entityObj?.libelle || `Série ${index + 1}`;
            return {
              id: config.id,
              stationName: name,
              color: config.color,
              label: `${name} • ${sel.parameter.param_label}`,
              variable: sel.parameter.param_label,
              aggregation: sel.parameter.frequence || "Brut",
              points: Array.isArray(data)
                ? data.map((entry: any) => ({ date: entry.datetime, value: Number(entry.value) }))
                : [],
            } as LoadedSeries;
          } catch (e) {
            console.error("Erreur chargement serie", e);
            return null;
          }
        })
      );

      if (!cancelled) setMultiSeries(nextSeries.filter((item): item is LoadedSeries => !!item && item.points.length > 0));
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [multiConfigs, theme]);

  const multiChartData = useMemo(() => mergeSeries(multiSeries), [multiSeries]);
  const multiSummary = useMemo(() => buildSummary(multiSeries), [multiSeries]);
  const multiDetailRows = useMemo(() => buildDetailRows(multiSeries), [multiSeries]);
  const multiGlobalStats = useMemo(() => buildGlobalStats(multiSeries), [multiSeries]);
  const multiAxisVariables = useMemo(
    () => Array.from(new Set(multiSeries.map((serie) => serie.variable))).filter(Boolean),
    [multiSeries]
  );
  
  const multiLeftAxisVariable = multiAxisVariables[0];
  const multiRightAxisVariable = multiAxisVariables[1];

  const exportMultiChartImage = async () => {
    const element = multiChartExportRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { backgroundColor: "#ffffff", scale: 2, logging: false });
    const link = document.createElement("a");
    link.download = `comparaison-multiple-${theme}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const exportMultiChartPdf = async () => {
    const element = multiChartExportRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { backgroundColor: "#ffffff", scale: 2, logging: false });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const ratio = Math.min((pageWidth - margin * 2) / canvas.width, (pageHeight - margin * 2) / canvas.height);
    pdf.addImage(imgData, "PNG", (pageWidth - canvas.width * ratio) / 2, margin, canvas.width * ratio, canvas.height * ratio);
    pdf.save(`comparaison-multiple-${theme}.pdf`);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        {multiConfigs.map((config, index) => (
          <div key={config.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
              <div className="bg-gradient-to-r from-blue-700 to-sky-600 px-5 py-3">
                <h3 className="flex items-center gap-2 font-bold text-white tracking-wide">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: config.color }}></span>
                  <span className="uppercase text-sm">Série {index + 1}</span>
                </h3>
              </div>
              <div className="p-3 bg-gray-50/30">
                <UnifiedFilters 
                  theme={theme} 
                  onChange={(sel) => {
                    if (isSameSelection(config.selection, sel)) return;
                    setMultiConfigs((prev) => {
                      let changed = false;
                      const next = prev.map((item) => {
                        if (item.id !== config.id) return item;
                        if (isSameSelection(item.selection, sel)) return item;
                        changed = true;
                        return { ...item, selection: sel };
                      });
                      return changed ? next : prev;
                    });
                  }} 
                  compact={true}
                />
              </div>
          </div>
        ))}
      </div>

      <div className="space-y-5">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl transition-all hover:shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-white">Séries temporelles comparées</h3>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-lg border border-white/20 bg-white/10 p-0.5 backdrop-blur">
                <button
                  type="button"
                  className={`rounded-md px-2 py-1 text-xs font-medium ${multiChartType === "line" ? "bg-white text-slate-800 shadow-sm" : "text-white/70 hover:text-white"}`}
                  onClick={() => setMultiChartType("line")}
                >
                  Courbe
                </button>
                <button
                  type="button"
                  className={`rounded-md px-2 py-1 text-xs font-medium ${multiChartType === "bar" ? "bg-white text-slate-800 shadow-sm" : "text-white/70 hover:text-white"}`}
                  onClick={() => setMultiChartType("bar")}
                >
                  Barres
                </button>
              </div>
              <button
                type="button"
                className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs font-medium text-white transition hover:bg-white/20 disabled:opacity-50"
                onClick={exportMultiChartImage}
                disabled={!multiChartData.length}
              >
                Export Image
              </button>
              <button
                type="button"
                className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs font-medium text-white transition hover:bg-white/20 disabled:opacity-50"
                onClick={exportMultiChartPdf}
                disabled={!multiChartData.length}
              >
                Export PDF
              </button>
            </div>
          </div>
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 px-4 py-4 shadow-sm">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-700">Minimum</div>
                <div className="mt-1 text-xl font-bold text-slate-800">{multiGlobalStats.min}</div>
              </div>
              <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-fuchsia-50 px-4 py-4 shadow-sm">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-700">Moyenne</div>
                <div className="mt-1 text-xl font-bold text-slate-800">{multiGlobalStats.mean}</div>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-green-50 to-emerald-50 px-4 py-4 shadow-sm">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">Maximum</div>
                <div className="mt-1 text-xl font-bold text-slate-800">{multiGlobalStats.max}</div>
              </div>
            </div>
            <div className="rounded-lg bg-white">
              {multiAxisVariables.length > 0 ? (
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="rounded-full bg-sky-50 px-2 py-1 font-medium text-sky-700">Axe gauche: {multiLeftAxisVariable}</span>
                  {multiRightAxisVariable ? (<span className="rounded-full bg-orange-50 px-2 py-1 font-medium text-orange-700">Axe droit: {multiRightAxisVariable}</span>) : null}
                </div>
              ) : null}
              <div className="h-[300px]" ref={multiChartExportRef}>
                {multiSeries.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    {multiChartType === "line" ? (
                      <LineChart data={multiChartData} margin={{ top: 8, right: multiRightAxisVariable ? 20 : 8, left: 20, bottom: 28 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={formatYearTick} />
                        <YAxis yAxisId="left" tick={{ fontSize: 11 }} width={50} />
                        {multiRightAxisVariable ? <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} width={50} /> : null}
                        <Tooltip labelFormatter={formatYearTick} />
                        <Legend iconType="square" iconSize={10} wrapperStyle={{ paddingTop: 14 }} />
                        {multiSeries.map((serie) => (
                          <Line key={serie.id} yAxisId={serie.variable === multiLeftAxisVariable ? "left" : "right"} type="monotone" dataKey={serie.id} name={serie.label} stroke={serie.color} dot={false} strokeWidth={2.5} />
                        ))}
                      </LineChart>
                    ) : (
                      <BarChart data={multiChartData} margin={{ top: 8, right: multiRightAxisVariable ? 20 : 8, left: 20, bottom: 28 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={formatYearTick} />
                        <YAxis yAxisId="left" tick={{ fontSize: 11 }} width={50} />
                        {multiRightAxisVariable ? <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} width={50} /> : null}
                        <Tooltip labelFormatter={formatYearTick} />
                        <Legend iconType="square" iconSize={10} wrapperStyle={{ paddingTop: 14 }} />
                        {multiSeries.map((serie) => (
                          <Bar key={serie.id} yAxisId={serie.variable === multiLeftAxisVariable ? "left" : "right"} dataKey={serie.id} name={serie.label} fill={serie.color} radius={[4, 4, 0, 0]} />
                        ))}
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-lg bg-slate-50 px-4 text-center text-xs text-slate-500">Configurez au moins une série pour afficher le graphe.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <h3 className="mb-0 bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 text-sm font-semibold text-white">Tableau détaillé des données</h3>
            {multiDetailRows.length > 0 ? (
              <div className="max-h-[300px] overflow-auto">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="sticky top-0 bg-slate-50 text-slate-600">
                    <tr><th className="px-4 py-3 text-left font-semibold">Période</th><th className="px-4 py-3 text-left font-semibold">Station / Entité</th><th className="px-4 py-3 text-left font-semibold">Paramètre</th><th className="px-4 py-3 text-right font-semibold">Valeur</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                    {multiDetailRows.map((row, index) => (
                      <tr key={`${row.stationName}-${row.variable}-${row.date}-${index}`} className="hover:bg-slate-50">
                        <td className="whitespace-nowrap px-4 py-3">{formatYearTick(row.date)}</td><td className="px-4 py-3">{row.stationName}</td><td className="px-4 py-3">{row.variable}</td><td className="px-4 py-3 text-right tracking-wide font-mono">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (<div className="flex h-[300px] items-center justify-center bg-slate-50 text-sm text-slate-500">Le tableau détaillé apparaîtra ici.</div>)}
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <h3 className="mb-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-sm font-semibold text-white">Synthèse (Moyennes, Min, Max)</h3>
            <div className="h-[300px] px-3 pb-3 pt-4">
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
              ) : (<div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">La synthèse apparaîtra ici.</div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
