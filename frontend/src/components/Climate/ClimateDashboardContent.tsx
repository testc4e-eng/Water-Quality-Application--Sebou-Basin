import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

import ClimateFilters from "@/components/Climate/ClimateFilters";
import ClimateChart from "@/components/Climate/ClimateChart";
import ClimateTable from "@/components/Climate/ClimateTable";

import { getClimateTimeseries } from "@/api/climate";

/* =========================================================
   TYPES
========================================================= */
type Selection = {
  stationId?: number;
  sourceType?: string;
  scenarioCode?: string;
  runId?: number;
  variable?: string;
  aggregation?: string;
  dateStart?: string;
  dateEnd?: string;
  tsId?: number;
};

/* =========================================================
   HELPERS
========================================================= */
function fmt(v: number | null) {
  return v === null ? "—" : v.toFixed(3);
}

function KpiCard({
  title,
  value,
  bg,
  icon,
}: {
  title: string;
  value: string;
  bg: "blue" | "green" | "red" | "purple" | "orange" | "cyan" | "amber";
  icon?: string;
}) {
  const bgMap: Record<string, string> = {
    blue: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
    green: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200",
    red: "bg-gradient-to-br from-red-50 to-orange-50 border-red-200",
    purple: "bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-200",
    orange: "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200",
    cyan: "bg-gradient-to-br from-cyan-50 to-sky-50 border-cyan-200",
    amber: "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200",
  };

  const textColors: Record<string, string> = {
    blue: "text-blue-700",
    green: "text-green-700",
    red: "text-red-700",
    purple: "text-purple-700",
    orange: "text-orange-700",
    cyan: "text-cyan-700",
    amber: "text-amber-700",
  };

  return (
    <Card className={`relative overflow-hidden p-4 border ${bgMap[bg]} shadow-sm hover:shadow-md transition-all`}>
      {icon && <div className="absolute top-2 right-2 text-2xl opacity-20">{icon}</div>}
      <div className="relative">
        <div className={`text-xs uppercase tracking-wider font-semibold ${textColors[bg]}`}>
          {title}
        </div>
        <div className="text-2xl font-bold text-gray-800 mt-1">{value}</div>
      </div>
    </Card>
  );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */
export default function ClimateDashboardContent() {
  const [selection, setSelection] = useState<Selection>({});
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= KPI COMPUTATION ================= */
  const values = series
    .map((r) => Number(r.value))
    .filter((v) => !isNaN(v));

  const min = values.length ? Math.min(...values) : null;
  const max = values.length ? Math.max(...values) : null;
  const mean = values.length
    ? values.reduce((a, b) => a + b, 0) / values.length
    : null;

  const minRow = min !== null
    ? series.find((r) => Number(r.value) === min)
    : null;

  const maxRow = max !== null
    ? series.find((r) => Number(r.value) === max)
    : null;

  const unit = selection.variable?.toLowerCase().includes("temperature")
    ? "°C"
    : selection.variable?.toLowerCase().includes("precip")
    ? "mm"
    : "";

  const varLabel =
    selection.variable?.toLowerCase().includes("temperature")
      ? "Température"
      : selection.variable?.toLowerCase().includes("precip")
      ? "Précipitation"
      : selection.variable || "Valeur";

  const varIcon = selection.variable?.toLowerCase().includes("temperature")
    ? "🌡️"
    : selection.variable?.toLowerCase().includes("precip")
    ? "☔"
    : "📊";

const pasLabel =
  selection.aggregation === "daily"
    ? "Journalier"
    : selection.aggregation === "monthly"
    ? "Mensuel"
    : selection.aggregation === "annual"
    ? "Annuel"
    : selection.aggregation === "instantaneous"
    ? "Instantané"
    : "—";
const [refreshKey, setRefreshKey] = useState(0);
  /* ================= LOAD SERIES ================= */
  useEffect(() => {
  if (!selection.tsId || !selection.aggregation) {
  setSeries([]);
  return;
}

  let cancelled = false;

  // 🔥 reset immédiat pour éviter mélange ancien scénario
  setSeries([]);
  setLoading(true);

  const load = async () => {
    try {
      const data = await getClimateTimeseries({
        ts_id: selection.tsId,
        time_step: selection.aggregation,
        date_start: selection.dateStart,
        date_end: selection.dateEnd,
      });

      if (!cancelled) {
        if (Array.isArray(data)) {
          setSeries(data);
        } else {
          setSeries([]);
        }
      }
    } catch (err) {
      if (!cancelled) {
        console.error("Timeseries error:", err);
        setSeries([]);
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  load();

  return () => {
    cancelled = true;
  };
}, [
  selection.tsId,
  selection.dateStart,
  selection.dateEnd,
  selection.aggregation,
  refreshKey
]);





  /* ================= RENDER ================= */
  return (
    <div className="space-y-6">
      {/* EN-TÊTE COLORÉ - CLIMAT */}
      <div className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-3xl">🌤️</span> Dashboard Climat - Séries temporelles
            </h2>
            <p className="text-sky-100 mt-1">
              Analyse des données climatiques : température, précipitations et plus
            </p>
          </div>

          {selection.stationId && (
  <div className="flex items-center gap-3">
    <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg flex items-center gap-2">
      <span className="text-xl">📍</span>
      <span className="font-semibold">{selection.stationId}</span>
    </div>

    <button
      onClick={() => {
        setRefreshKey((prev) => prev + 1);
      }}
      className="bg-white/20 hover:bg-white/30 backdrop-blur px-3 py-2 rounded-lg text-sm transition-all"
    >
      🔄 Actualiser
    </button>
  </div>
)}


        </div>
      </div>

      {/* GRILLE PRINCIPALE */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* PANEL FILTRES - STYLISÉ */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="bg-gradient-to-r from-sky-600 to-blue-600 px-4 py-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span>⚙️</span> Paramètres climatiques
              </h3>
            </div>
            <div className="p-4">
              <ClimateFilters onChange={setSelection} />
            </div>
          </div>
        </div>

        {/* PANEL PRINCIPAL */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          
          {/* KPIS PRINCIPAUX */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard 
              title="PAS DE TEMPS" 
              value={pasLabel} 
              bg="blue" 
              icon="⏱️" 
            />
            <KpiCard 
              title="MINIMUM" 
              value={`${fmt(min)} ${unit}`} 
              bg="green" 
              icon="⬇️" 
            />
            <KpiCard 
              title="MAXIMUM" 
              value={`${fmt(max)} ${unit}`} 
              bg="red" 
              icon="⬆️" 
            />
            <KpiCard 
              title="MOYENNE" 
              value={`${fmt(mean)} ${unit}`} 
              bg="purple" 
              icon="📊" 
            />
          </div>

          {/* CARTES EXTREMES - JOURNÉES REMARQUABLES */}
          {(minRow || maxRow) && selection.variable && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {maxRow && (
                <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🔥</span>
                        <span className="text-xs uppercase tracking-wider font-semibold text-orange-700">
                          {varLabel === "Température" ? "Journée la plus chaude" : "Journée la plus humide"}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-gray-800">
                          {new Date(maxRow.datetime).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="ml-2 text-lg font-semibold text-orange-600">
                          {fmt(max)} {unit}
                        </span>
                      </div>
                    </div>
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <span className="text-2xl">📆</span>
                    </div>
                  </div>
                </div>
              )}
              
              {minRow && (
                <div className="bg-gradient-to-br from-cyan-50 to-sky-50 border border-cyan-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">❄️</span>
                        <span className="text-xs uppercase tracking-wider font-semibold text-cyan-700">
                          {varLabel === "Température" ? "Journée la plus froide" : "Journée la plus sèche"}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-gray-800">
                          {new Date(minRow.datetime).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="ml-2 text-lg font-semibold text-cyan-600">
                          {fmt(min)} {unit}
                        </span>
                      </div>
                    </div>
                    <div className="bg-cyan-100 p-2 rounded-lg">
                      <span className="text-2xl">❄️</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BANDE D'INFORMATION - PÉRIODE */}
          {selection.dateStart && selection.dateEnd && (
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-blue-600">📅</span>
                <span className="text-sm text-gray-600">
                  Période d'analyse : 
                  <span className="font-semibold text-gray-800 ml-1">
                    {new Date(selection.dateStart).toLocaleDateString('fr-FR')} - {new Date(selection.dateEnd).toLocaleDateString('fr-FR')}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {series.length} points
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {varIcon} {varLabel}
                </span>
              </div>
            </div>
          )}

          {/* GRILLE TABLEAU + GRAPHE */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* TABLEAU - STYLISÉ */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span>📋</span> Données {varLabel}
                </h3>
                {unit && (
                  <span className="bg-white/30 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
                    {unit}
                  </span>
                )}
              </div>
              <div className="p-0">
                <ClimateTable
                  tsId={selection.tsId}
                  unit={unit}
                  varLabel={varLabel}
                  dateStart={selection.dateStart}
                  dateEnd={selection.dateEnd}
                  aggregation={selection.aggregation}   // ✅ AJOUT
                  loading={loading}
                />
              </div>
            </div>

            {/* GRAPHE - STYLISÉ */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span>📈</span> {varLabel} — Séries climatiques
                </h3>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-white text-xs">{varLabel}</span>
                </div>
              </div>
              <div className="p-3">
                <ClimateChart
                  tsId={selection.tsId}
                  title={`${varLabel} — Séries climatiques`}
                  unit={unit}
                  varLabel={varLabel}
                  varIcon={varIcon}
                  dateStart={selection.dateStart}
                  dateEnd={selection.dateEnd}
                  aggregation={selection.aggregation}   // ✅ AJOUT
                  loading={loading}
                />
              </div>
            </div>
          </div>

          {/* ÉTAT VIDE - AUCUNE SÉLECTION */}
          {!selection.tsId && (
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-8 text-center">
              <div className="text-7xl mb-4 opacity-30">🌤️</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune donnée affichée</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Sélectionnez une station, un type de série, un scénario et une variable pour visualiser les données climatiques
              </p>
              <div className="flex justify-center gap-2 mt-4">
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}