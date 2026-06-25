import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

import UnifiedFilters from "@/components/Climate/UnifiedFilters";
import ClimateChart from "@/components/Climate/ClimateChart";
import ClimateTable from "@/components/Climate/ClimateTable";
import { QaBadge, type QaStatus } from "@/components/ui/qa-badge";
import { getParameterTimeseries } from "@/api/observatory";
import type { HierParameter } from "@/api/observatory";
import { getClimatMeteoSeries, getHydrologieSeries, getPollutionSeries } from "@/api/analytics";

type Selection = {
  scenario?: string;
  stationId?: string;
  parameter?: HierParameter;
  submenu?: string;
  submenuLabel?: string;
  variableEnabled?: boolean;
  entityObj?: {
    id: string;
    name: string;
    code?: string;
  };
};

type TimeseriesRow = {
  datetime: string;
  value: number;
};

function isClimateTheme(theme: string): boolean {
  const normalized = (theme || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  return normalized === "climat_meteo" || normalized.includes("climat") || normalized.includes("meteo");
}

function isHydroTheme(theme: string): boolean {
  const normalized = (theme || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  return normalized === "hydrologie" || normalized.includes("hydrolog");
}

function isPollutionTheme(theme: string): boolean {
  const normalized = (theme || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  return normalized === "pollution" || normalized.includes("pollut");
}

export default function UnifiedSimpleDashboard({ theme }: { theme: string }) {
  const [selection, setSelection] = useState<Selection>({});
  const [series, setSeries] = useState<TimeseriesRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [seriesUnit, setSeriesUnit] = useState<string>("");
  const [dateStart, setDateStart] = useState<string | undefined>(undefined);
  const [dateEnd, setDateEnd] = useState<string | undefined>(undefined);
  
  const chartRef = useRef<HTMLDivElement | null>(null);

  const values = series.map((r) => Number(r.value)).filter((v) => !Number.isNaN(v));
  const min = values.length ? Math.min(...values) : null;
  const max = values.length ? Math.max(...values) : null;
  const mean = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;

  const unit = selection.parameter?.unite || seriesUnit || "";
  const varLabel =
    selection.parameter?.param_label ||
    selection.submenuLabel ||
    selection.submenu ||
    "Choisir une variable";
  const varIcon = varLabel.toLowerCase().includes("températ") ? "🌡️" : varLabel.toLowerCase().includes("précipit") ? "☔" : "📊";
  const hydroTheme = isHydroTheme(theme);
  const sourceLabel = selection.parameter
    ? `${selection.parameter.source_schema}.${selection.parameter.source_table}`
    : selection.scenario
    ? `analytics:${selection.scenario}`
    : "Source non sélectionnée";
  const periodLabel =
    dateStart || dateEnd
      ? `${dateStart || "début"} → ${dateEnd || "fin"}`
      : "Toutes les périodes disponibles";
  const contextQaStatus: QaStatus = loading
    ? "FLAGGED"
    : series.length > 0
    ? "VALID"
    : selection.stationId
    ? "MISSING"
    : "FLAGGED";

  const applyHydroPreset = (preset: "30d" | "3m" | "1y" | "clear") => {
    if (preset === "clear") {
      setDateStart(undefined);
      setDateEnd(undefined);
      return;
    }
    const now = new Date();
    const end = now.toISOString().slice(0, 10);
    const start = new Date(now);
    if (preset === "30d") start.setDate(start.getDate() - 30);
    if (preset === "3m") start.setMonth(start.getMonth() - 3);
    if (preset === "1y") start.setFullYear(start.getFullYear() - 1);
    setDateStart(start.toISOString().slice(0, 10));
    setDateEnd(end);
  };

  useEffect(() => {
    const climateTheme = isClimateTheme(theme);
    const hydroThemeInner = isHydroTheme(theme);
    const pollutionTheme = isPollutionTheme(theme);
    const analyticsTheme = climateTheme || hydroThemeInner || pollutionTheme;
    const needsVariable = !!selection.variableEnabled;
    const hasRequiredVariable = !needsVariable || !!selection.parameter?.param_code;
    const canLoadClimate = !!selection.stationId && !!selection.submenu && hasRequiredVariable;
    const canLoadGeneric = !!selection.stationId && !!selection.submenu && !!selection.parameter;
    if ((analyticsTheme && !canLoadClimate) || (!analyticsTheme && !canLoadGeneric)) {
      setSeries([]);
      setSeriesUnit("");
      return;
    }

    let cancelled = false;
    setSeries([]);
    setLoading(true);

    const load = async () => {
      try {
        let data;
        if (analyticsTheme) {
          const loader = climateTheme
            ? getClimatMeteoSeries
            : hydroThemeInner
            ? getHydrologieSeries
            : getPollutionSeries;
          const res = await loader({
            scenario: selection.scenario || "actuel",
            submenu: selection.submenu!,
            site: selection.stationId!,
            variable: selection.parameter?.param_code,
            date_start: dateStart,
            date_end: dateEnd,
          });
          data = res.series;
          if (!cancelled) setSeriesUnit(res?.metadata?.unit || "");
        } else {
          data = await getParameterTimeseries({
            theme: theme,
            sous_menu: selection.submenu!,
            param_code: selection.parameter!.param_code,
            entity_id: selection.stationId!,
            date_start: dateStart,
            date_end: dateEnd,
          });
          if (!cancelled) setSeriesUnit(selection.parameter?.unite || "");
        }
        if (!cancelled) setSeries(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) {
          console.error("Timeseries error:", err);
          setSeries([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [theme, selection.stationId, selection.parameter, selection.submenu, selection.scenario, dateStart, dateEnd]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-12 gap-6">
        {/* FILTERS */}
        <div className="col-span-12 lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
            <div className="bg-gradient-to-r from-blue-700 to-sky-600 px-5 py-4">
              <h3 className="flex items-center gap-3 font-bold text-white tracking-wide">
                <span className="text-xl">⚙️</span> 
                <span className="uppercase text-sm">Filtres : {theme}</span>
              </h3>
            </div>
            <div className="p-5">
              <UnifiedFilters theme={theme} onChange={setSelection} />
              {hydroTheme && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Période (Hydrologie)
                  </div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => applyHydroPreset("30d")}
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      30j
                    </button>
                    <button
                      type="button"
                      onClick={() => applyHydroPreset("3m")}
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      3 mois
                    </button>
                    <button
                      type="button"
                      onClick={() => applyHydroPreset("1y")}
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      1 an
                    </button>
                    <button
                      type="button"
                      onClick={() => applyHydroPreset("clear")}
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Tout
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Début
                      </label>
                      <input
                        type="date"
                        value={dateStart || ""}
                        onChange={(e) => setDateStart(e.target.value || undefined)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Fin
                      </label>
                      <input
                        type="date"
                        value={dateEnd || ""}
                        onChange={(e) => setDateEnd(e.target.value || undefined)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="col-span-12 space-y-6 lg:col-span-9">
          <div className="rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Contexte décisionnel
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  {theme} · {selection.entityObj?.name || selection.entityObj?.code || "Site non sélectionné"}
                </h2>
              </div>
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                {loading ? "Chargement" : series.length ? `${series.length} points` : "En attente"}
              </span>
              <QaBadge status={contextQaStatus} />
            </div>
            <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-4">
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <div className="font-semibold uppercase tracking-wide text-slate-400">Thème</div>
                <div className="mt-1 font-semibold text-slate-800">{theme}</div>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <div className="font-semibold uppercase tracking-wide text-slate-400">Paramètre</div>
                <div className="mt-1 font-semibold text-slate-800">{varLabel}</div>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <div className="font-semibold uppercase tracking-wide text-slate-400">Période</div>
                <div className="mt-1 font-semibold text-slate-800">{periodLabel}</div>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <div className="font-semibold uppercase tracking-wide text-slate-400">Source</div>
                <div className="mt-1 truncate font-semibold text-slate-800" title={sourceLabel}>
                  {sourceLabel}
                </div>
              </div>
            </div>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="STATUS"
              value={
                loading
                  ? "Chargement..."
                  : !selection.submenu
                  ? "Choisir sous-menu"
                  : selection.variableEnabled && !selection.parameter?.param_code
                  ? "Choisir variable"
                  : !selection.stationId
                  ? "Choisir site"
                  : series.length > 0
                  ? "Données OK"
                  : "Aucune donnée"
              }
              bg="sky"
              icon="🛰️"
            />
            <KpiCard title="MINIMUM" value={`${fmt(min)} ${unit}`} bg="emerald" icon="📉" />
            <KpiCard title="MAXIMUM" value={`${fmt(max)} ${unit}`} bg="rose" icon="📈" />
            <KpiCard title="MOYENNE" value={`${fmt(mean)} ${unit}`} bg="violet" icon="📊" />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* TABLE */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl transition-all hover:shadow-2xl">
              <div className="flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-4">
                <h3 className="flex items-center gap-2 font-bold text-white">
                  <span>📋</span> Historique {varLabel}
                </h3>
              </div>
              <div className="p-0">
                <ClimateTable
                  unit={unit}
                  varLabel={varLabel}
                  loading={loading}
                  series={series}
                />
              </div>
            </div>

            {/* CHART */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl transition-all hover:shadow-2xl">
              <div className="bg-gradient-to-r from-violet-600 to-purple-500 px-5 py-4">
                 <h3 className="flex items-center gap-2 font-bold text-white">
                    <span>📈</span> Visualisation Temporelle
                  </h3>
              </div>
              <div ref={chartRef} className="p-4 bg-white">
                <ClimateChart
                  unit={unit}
                  varLabel={varLabel}
                  varIcon={varIcon}
                  loading={loading}
                  series={series}
                />
              </div>
            </div>
          </div>

          {!selection.stationId && !loading && (
             <div className="flex flex-col items-center justify-center p-12 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                <div className="text-6xl mb-4 grayscale opacity-20">🌍</div>
                <h3 className="text-xl font-bold text-gray-400">Prêt pour l'analyse</h3>
                <p className="text-gray-400 text-sm mt-2 text-center max-w-sm">
                  Utilisez le panneau latéral pour explorer les thématiques métiers et visualiser les chroniques de données.
                </p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

function fmt(v: number | null) {
  if (v === null) return "—";
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(v);
}

function KpiCard({ title, value, bg, icon }: any) {
  const bgConfigs: any = {
    sky: { gradient: "from-sky-500 to-blue-600", light: "bg-sky-50", border: "border-sky-100", text: "text-sky-700" },
    emerald: { gradient: "from-emerald-500 to-teal-600", light: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-700" },
    rose: { gradient: "from-rose-500 to-pink-600", light: "bg-rose-50", border: "border-rose-100", text: "text-rose-700" },
    violet: { gradient: "from-violet-500 to-purple-600", light: "bg-violet-50", border: "border-violet-100", text: "text-violet-700" },
  };
  const config = bgConfigs[bg] || bgConfigs.sky;

  return (
    <Card className={`relative overflow-hidden border-none shadow-lg ${config.light}`}>
      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${config.gradient}`} />
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className={`text-[10px] font-black uppercase tracking-widest ${config.text} opacity-80`}>{title}</span>
          <span className="text-lg">{icon}</span>
        </div>
        <div className="text-2xl font-black text-gray-800 tracking-tight">{value}</div>
      </div>
    </Card>
  );
}
