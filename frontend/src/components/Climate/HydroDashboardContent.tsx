import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getBarrages } from "@/api/client";

import HydroModeBar from "./HydroModeBar";
import HydroFiltersSimple from "@/components/Climate/HydroFiltersSimple";
import HydroTable from "@/components/Climate/HydroTable";
import HydroChart from "@/components/Climate/HydroChart";
import HydroMultiModesDashboard from "@/components/Climate/HydroMultiModesDashboard";

import HydroFiltersMulti from "@/components/Climate/HydroFiltersMulti";
import HydroChartMulti from "@/components/Climate/HydroChartMulti";
import HydroTableMulti from "@/components/Climate/HydroTableMulti";

import { fetchHydroStats, fetchHydroTimeseries } from "@/api/hydro";

/* =========================================================
   TYPES
========================================================= */
type Mode = "simple" | "multi";

/* =========================================================
   HELPERS
========================================================= */
function fmt(v: number | null) {
  return v === null || isNaN(v) ? "—" : v.toFixed(3);
}

function KpiCard({
  title,
  value,
  bg,
}: {
  title: string;
  value: string;
  bg: "blue" | "green" | "red" | "purple";
}) {
  const bgMap: Record<string, string> = {
    blue: "bg-blue-50 border-blue-300",
    green: "bg-green-50 border-green-300",
    red: "bg-red-50 border-red-300",
    purple: "bg-purple-50 border-purple-300",
  };

  return (
    <Card className={`p-3 border ${bgMap[bg]}`}>
      <div className="text-xs font-semibold text-gray-600">{title}</div>
      <div className="text-lg font-bold">{value}</div>
    </Card>
  );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */
export default function HydroDashboardContent() {
  const [mode, setMode] = useState<Mode>("simple");
  const [simpleScope, setSimpleScope] = useState<"station" | "barrage">("station");
  const [barrages, setBarrages] = useState<any[]>([]);
  const [selectedBarrageId, setSelectedBarrageId] = useState<number | null>(null);
  const [selectedBarrageParameter, setSelectedBarrageParameter] = useState("");

  const [stationId, setStationId] = useState<number | null>(null);
  const [rowsStats, setRowsStats] = useState<any[]>([]);
  
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const [selectedRowsMulti, setSelectedRowsMulti] = useState<any[]>([]);


  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const [series, setSeries] = useState<any[]>([]);

  const [cache, setCache] = useState<Record<string, any[]>>({});
  const [aggregationMulti, setAggregationMulti] = useState("real");

  useEffect(() => {
    getBarrages().then(setBarrages).catch(() => setBarrages([]));
  }, []);


  /* ================= AUTO INIT DATES EN MODE MULTI ================= */


useEffect(() => {
  if (mode !== "multi") return;

  if (selectedRowsMulti.length === 0) {
    setDateStart("");
    setDateEnd("");
    return;
  }

  const first = selectedRowsMulti[0];

  if (first?.dt_min && first?.dt_max) {
    setDateStart(first.dt_min.slice(0, 10));
    setDateEnd(first.dt_max.slice(0, 10));
  }
}, [selectedRowsMulti, mode]);


  /* ================= LOAD STATS (APRÈS STATION) ================= */
  useEffect(() => {
    if (!stationId) {
      setRowsStats([]);
      setSelectedRow(null);
      setSeries([]);
      setDateStart("");
      setDateEnd("");
      return;
    }

    fetchHydroStats(stationId).then((rows) => {
      setRowsStats(rows);
      setSelectedRow(null);
      setSeries([]);
      setDateStart("");
      setDateEnd("");
    });
  }, [stationId]);

  /* ================= LOAD TIMESERIES (APRÈS SCÉNARIO) ================= */



useEffect(() => {
  

  /* ================= SIMPLE ================= */
  if (mode === "simple") {
    if (!selectedRow?.ts_id || !dateStart || !dateEnd) {
      setSeries([]);
      return;
    }

    fetchHydroTimeseries({
      ts_id: selectedRow.ts_id,
      aggregation: selectedRow.time_step,
      date_start: dateStart,
      date_end: dateEnd,
    }).then(setSeries);

    return;
  }

  /* ================= MULTI ================= */
  
if (mode === "multi") {
  if (selectedRowsMulti.length === 0 || !dateStart || !dateEnd) {
    setSeries([]);
    return;
  }

  let cancelled = false;

  const loadMulti = async () => {
    const results = await Promise.all(
      selectedRowsMulti.map(async (row) => {

        const effectiveAggregation =
          aggregationMulti === "real"
            ? row.time_step
            : aggregationMulti;

        const cacheKey = `${row.ts_id}_${dateStart}_${dateEnd}_${effectiveAggregation}`;

        let data = cache[cacheKey];

        if (!data) {
          data = await fetchHydroTimeseries({
            ts_id: row.ts_id,
            aggregation: effectiveAggregation,
            date_start: dateStart,
            date_end: dateEnd,
          });

          setCache((prev) => ({
            ...prev,
            [cacheKey]: data,
          }));
        }

        return {
          scenario: row.scenario_name,
          source_type: row.source_type,
          aggregation: effectiveAggregation,
          data: data,
        };
      })
    );

    if (!cancelled) {
      setSeries(results);
    }
  };

  loadMulti();

  return () => {
    cancelled = true;
  };
}


  /* ================= FDC ================= */
  if (mode === "fdc") {
    if (!selectedRow?.ts_id || !dateStart || !dateEnd) {
      setSeries([]);
      return;
    }

    fetchHydroTimeseries({
      ts_id: selectedRow.ts_id,
      aggregation: selectedRow.time_step,
      date_start: dateStart,
      date_end: dateEnd,
    }).then((data) => {

      const sorted = [...data]
        .map((d: any) => Number(d.value))
        .filter((v) => !isNaN(v))
        .sort((a, b) => b - a);

      const n = sorted.length;

      const fdc = sorted.map((v, i) => ({
        exceedance: ((i + 1) / (n + 1)) * 100,
        value: v,
      }));

      setSeries(fdc);
    });

    return;
  }

}, [selectedRow, selectedRowsMulti, dateStart, dateEnd, mode, aggregationMulti]);



  /* ================= KPI COMPUTATION ================= */
  const values = series
    .map((r) => Number(r.value))
    .filter((v) => !isNaN(v));

  const min = values.length ? Math.min(...values) : null;
  const max = values.length ? Math.max(...values) : null;
  const mean = values.length
    ? values.reduce((a, b) => a + b, 0) / values.length
    : null;

  const pasLabel =
    selectedRow?.time_step === "daily"
      ? "Journalier"
      : selectedRow?.time_step === "monthly"
      ? "Mensuel"
      : selectedRow?.time_step === "annual"
      ? "Annuel"
      : "—";


  /* ================= RENDER ================= */
  return (
    <div>
      <HydroModeBar mode={mode} onChange={setMode} />
      {mode === "simple" && (
  <div className="space-y-6">
    <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={() => setSimpleScope("station")}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
          simpleScope === "station" ? "bg-cyan-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        Station
      </button>
      <button
        type="button"
        onClick={() => setSimpleScope("barrage")}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
          simpleScope === "barrage" ? "bg-cyan-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        Barrage
      </button>
    </div>

    {/* GRILLE PRINCIPALE */}
    {simpleScope === "station" ? (
    <div className="grid grid-cols-12 gap-6">
      
      {/* PANEL FILTRES - STYLISÉ */}
      <div className="col-span-12 lg:col-span-3">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <span>⚙️</span> Paramètres
            </h3>
          </div>
          <div className="p-4">
            <HydroFiltersSimple
              rowsStats={rowsStats}
              selectedRow={selectedRow}
              dateStart={dateStart}
              dateEnd={dateEnd}
              onStationChange={setStationId}
              onRowChange={(row) => {
                setSelectedRow(row);
                setDateStart(row?.dt_min?.slice(0, 10) ?? "");
                setDateEnd(row?.dt_max?.slice(0, 10) ?? "");
              }}

              onDateStartChange={setDateStart}
              onDateEndChange={setDateEnd}
            />
          </div>
        </div>
      </div>

      {/* PANEL PRINCIPAL - KPIs + TABLEAU + GRAPHE */}
      <div className="col-span-12 lg:col-span-9 space-y-6">
        
        {/* KPIS - CARTES STATISTIQUES AMÉLIORÉES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Carte PAS */}
          <div className={`relative overflow-hidden rounded-xl shadow-sm border ${
            selectedRow 
              ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 opacity-10">
              <span className="text-6xl">⏱️</span>
            </div>
            <div className="p-4 relative">
              <div className="text-xs uppercase tracking-wider font-semibold text-blue-700">
                Pas de temps
              </div>
              <div className="text-2xl font-bold text-gray-800 mt-1">
                {selectedRow ? pasLabel : "—"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {selectedRow ? "Agrégation" : "Non sélectionné"}
              </div>
            </div>
          </div>

          {/* Carte MIN */}
          <div className={`relative overflow-hidden rounded-xl shadow-sm border ${
            selectedRow 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 opacity-10">
              <span className="text-6xl">⬇️</span>
            </div>
            <div className="p-4 relative">
              <div className="text-xs uppercase tracking-wider font-semibold text-green-700">
                Minimum
              </div>
              <div className="text-2xl font-bold text-gray-800 mt-1">
                {selectedRow ? fmt(min) : "—"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {selectedRow ? "m³/s" : "—"}
              </div>
            </div>
          </div>

          {/* Carte MAX */}
          <div className={`relative overflow-hidden rounded-xl shadow-sm border ${
            selectedRow 
              ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 opacity-10">
              <span className="text-6xl">⬆️</span>
            </div>
            <div className="p-4 relative">
              <div className="text-xs uppercase tracking-wider font-semibold text-red-700">
                Maximum
              </div>
              <div className="text-2xl font-bold text-gray-800 mt-1">
                {selectedRow ? fmt(max) : "—"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {selectedRow ? "m³/s" : "—"}
              </div>
            </div>
          </div>

          {/* Carte MOY */}
          <div className={`relative overflow-hidden rounded-xl shadow-sm border ${
            selectedRow 
              ? 'bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 opacity-10">
              <span className="text-6xl">📊</span>
            </div>
            <div className="p-4 relative">
              <div className="text-xs uppercase tracking-wider font-semibold text-purple-700">
                Moyenne
              </div>
              <div className="text-2xl font-bold text-gray-800 mt-1">
                {selectedRow ? fmt(mean) : "—"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {selectedRow ? "m³/s" : "—"}
              </div>
            </div>
          </div>
        </div>

        {/* BANDE D'INFORMATION - PÉRIODE AFFICHÉE */}
        {selectedRow && dateStart && dateEnd && (
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">📅</span>
              <span className="text-sm text-gray-600">
                Période d'affichage : 
                <span className="font-semibold text-gray-800 ml-1">
                  {new Date(dateStart).toLocaleDateString('fr-FR')} - {new Date(dateEnd).toLocaleDateString('fr-FR')}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {values.length} points
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
                <span>📋</span> Données de débit
              </h3>
              {selectedRow && (
                <span className="bg-white/30 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
                  {selectedRow.time_step === 'daily' ? 'Journalier' : 
                   selectedRow.time_step === 'monthly' ? 'Mensuel' : 'Annuel'}
                </span>
              )}
            </div>
            <div className="p-0">
              <HydroTable
                ts_id={selectedRow?.ts_id}
                aggregation={selectedRow?.time_step}
                date_start={dateStart}
                date_end={dateEnd}
              />
            </div>
          </div>

          {/* GRAPHE - STYLISÉ */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span>📈</span> Visualisation
              </h3>
              {selectedRow && (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-white text-xs">{selectedRow.scenario_name}</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <HydroChart
                ts_id={selectedRow?.ts_id}
                aggregation={selectedRow?.time_step}
                date_start={dateStart}
                date_end={dateEnd}
              />
            </div>
          </div>
        </div>

        {/* ÉTAT VIDE - SI AUCUNE SÉLECTION */}
        {!selectedRow && (
          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-8 text-center">
            <div className="text-7xl mb-4 opacity-30">💧</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune donnée affichée</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Sélectionnez une station, un type de série et un scénario pour visualiser les données hydrologiques
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        )}
      </div>
    </div>
    ) : (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-3">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <span>⚙️</span> Paramètres barrage
            </h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Barrage</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none text-sm"
                value={selectedBarrageId ?? ""}
                onChange={(e) => setSelectedBarrageId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Sélectionner un barrage...</option>
                {barrages.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nom_barrage}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Paramètre</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none text-sm"
                value={selectedBarrageParameter}
                onChange={(e) => setSelectedBarrageParameter(e.target.value)}
              >
                <option value="">Sélectionner un paramètre...</option>
                <option value="niveau_eau_barrage">Niveau eau barrage</option>
                <option value="qualite_barrage">Qualité barrage</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-9 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative overflow-hidden rounded-xl shadow-sm border bg-gray-50 border-gray-200"><div className="p-4 relative"><div className="text-xs uppercase tracking-wider font-semibold text-blue-700">Pas de temps</div><div className="text-2xl font-bold text-gray-800 mt-1">—</div><div className="text-xs text-gray-500 mt-1">Barrage</div></div></div>
          <div className="relative overflow-hidden rounded-xl shadow-sm border bg-gray-50 border-gray-200"><div className="p-4 relative"><div className="text-xs uppercase tracking-wider font-semibold text-green-700">Minimum</div><div className="text-2xl font-bold text-gray-800 mt-1">—</div><div className="text-xs text-gray-500 mt-1">À connecter</div></div></div>
          <div className="relative overflow-hidden rounded-xl shadow-sm border bg-gray-50 border-gray-200"><div className="p-4 relative"><div className="text-xs uppercase tracking-wider font-semibold text-red-700">Maximum</div><div className="text-2xl font-bold text-gray-800 mt-1">—</div><div className="text-xs text-gray-500 mt-1">À connecter</div></div></div>
          <div className="relative overflow-hidden rounded-xl shadow-sm border bg-gray-50 border-gray-200"><div className="p-4 relative"><div className="text-xs uppercase tracking-wider font-semibold text-purple-700">Moyenne</div><div className="text-2xl font-bold text-gray-800 mt-1">—</div><div className="text-xs text-gray-500 mt-1">À connecter</div></div></div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span>📋</span> Données barrage
              </h3>
            </div>
            <div className="p-8 text-center text-gray-500">
              {selectedBarrageId && selectedBarrageParameter
                ? "Tableau barrage prêt côté interface. En attente de branchement des données."
                : "Sélectionnez un barrage et un paramètre."}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span>📈</span> Visualisation barrage
              </h3>
            </div>
            <div className="p-8 text-center text-gray-500">
              {selectedBarrageId && selectedBarrageParameter
                ? "Graphe barrage prêt côté interface. En attente de branchement des séries temporelles."
                : "Sélectionnez un barrage et un paramètre."}
            </div>
          </div>
        </div>
      </div>
    </div>
    )}
  </div>
)}
{mode === "multi" && <HydroMultiModesDashboard />}
     



    </div>  

  );
}
