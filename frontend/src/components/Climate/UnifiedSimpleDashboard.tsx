import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

import UnifiedFilters from "@/components/Climate/UnifiedFilters";
import ClimateChart from "@/components/Climate/ClimateChart";
import ClimateTable from "@/components/Climate/ClimateTable";
import { getParameterTimeseries } from "@/api/observatory";
import type { HierParameter } from "@/api/observatory";

type Selection = {
  stationId?: string;
  parameter?: HierParameter;
  submenu?: string;
};

type TimeseriesRow = {
  datetime: string;
  value: number;
};

export default function UnifiedSimpleDashboard({ theme }: { theme: string }) {
  const [selection, setSelection] = useState<Selection>({});
  const [series, setSeries] = useState<TimeseriesRow[]>([]);
  const [loading, setLoading] = useState(false);
  
  const chartRef = useRef<HTMLDivElement | null>(null);

  const values = series.map((r) => Number(r.value)).filter((v) => !Number.isNaN(v));
  const min = values.length ? Math.min(...values) : null;
  const max = values.length ? Math.max(...values) : null;
  const mean = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;

  const unit = selection.parameter?.unite || "";
  const varLabel = selection.parameter?.param_label || "Choisir une variable";
  const varIcon = varLabel.toLowerCase().includes("températ") ? "🌡️" : varLabel.toLowerCase().includes("précipit") ? "☔" : "📊";

  useEffect(() => {
    if (!selection.stationId || !selection.parameter || !selection.submenu) {
      setSeries([]);
      return;
    }

    let cancelled = false;
    setSeries([]);
    setLoading(true);

    const load = async () => {
      try {
        const data = await getParameterTimeseries({
          theme: theme,
          sous_menu: selection.submenu!,
          param_code: selection.parameter!.param_code,
          entity_id: selection.stationId!,
        });
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
  }, [theme, selection.stationId, selection.parameter, selection.submenu]);

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
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="col-span-12 space-y-6 lg:col-span-9">
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard title="STATUS" value={loading ? "Chargement..." : selection.stationId ? "Données OK" : "En attente"} bg="sky" icon="🛰️" />
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
