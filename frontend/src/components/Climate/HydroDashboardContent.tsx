import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

import HydroModeBar from "./HydroModeBar";
import HydroFiltersSimple from "@/components/Climate/HydroFiltersSimple";
import HydroTable from "@/components/Climate/HydroTable";
import HydroChart from "@/components/Climate/HydroChart";

import HydroFiltersMulti from "@/components/Climate/HydroFiltersMulti";
import HydroChartMulti from "@/components/Climate/HydroChartMulti";
import HydroTableMulti from "@/components/Climate/HydroTableMulti";

import HydroFiltersFDC from "@/components/Climate/HydroFiltersFDC";
import HydroChartFDC from "@/components/Climate/HydroChartFDC";
import HydroTableFDC from "@/components/Climate/HydroTableFDC";

import { fetchHydroStats, fetchHydroTimeseries } from "@/api/hydro";

/* =========================================================
   TYPES
========================================================= */
type Mode = "simple" | "multi" | "fdc";

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

  const [stationId, setStationId] = useState<number | null>(null);
  const [rowsStats, setRowsStats] = useState<any[]>([]);
  
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  const [selectedRowsMulti, setSelectedRowsMulti] = useState<any[]>([]);


  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const [series, setSeries] = useState<any[]>([]);

  const [cache, setCache] = useState<Record<string, any[]>>({});
  const [aggregationMulti, setAggregationMulti] = useState("real");


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
    {/* EN-TÊTE COLORÉ - MODE SIMPLE */}
    <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">💧</span> Mode Simple - Analyse hydrologique
          </h2>
          <p className="text-blue-100 mt-1">
            Visualisation et analyse des séries temporelles de débit
          </p>
        </div>
        {selectedRow && (
          <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
            <span className="font-semibold">{selectedRow.scenario_name}</span>
          </div>
        )}
      </div>
    </div>

    {/* GRILLE PRINCIPALE */}
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
  </div>
)}

{mode === "multi" && (
  <div className="space-y-6">
    {/* EN-TÊTE COLORÉ */}
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">📊</span> Mode Multi-Scénarios
          </h2>
          <p className="text-indigo-100 mt-1">
            Comparez plusieurs scénarios simultanément
          </p>
        </div>
        <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
          <span className="font-semibold">{selectedRowsMulti.length}</span> scénario(s) sélectionné(s)
        </div>
      </div>
    </div>

    {/* GRILLE PRINCIPALE */}
    <div className="grid grid-cols-12 gap-6">
      
      {/* PANEL FILTRES - STYLISÉ */}
      <div className="col-span-12 lg:col-span-3">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <span>🎛️</span> Configuration
            </h3>
          </div>
          <div className="p-4">
            <HydroFiltersMulti
            rowsStats={rowsStats}
            selectedRows={selectedRowsMulti}
            dateStart={dateStart}
            dateEnd={dateEnd}
            onStationChange={setStationId}
            onSelectionChange={setSelectedRowsMulti}
            onDateStartChange={setDateStart}
            onDateEndChange={setDateEnd}
            onAggregationChange={setAggregationMulti}
/>

          </div>
        </div>
      </div>

      {/* PANEL TABLEAU + GRAPHE */}
      <div className="col-span-12 lg:col-span-9 space-y-6">
        
        {/* CARTE STATISTIQUES RAPIDES (si données chargées) */}
        {series.length > 0 && series[0]?.data?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 shadow-sm">
              <div className="text-xs uppercase tracking-wider text-amber-700 font-semibold">Période</div>
              <div className="text-lg font-bold text-amber-900">
                {series.length > 0 &&
 series[0]?.data?.length > 0 &&
 series[series.length - 1]?.data?.length > 0 && (
  <>
    {series.length > 0 &&
 series[0]?.data?.length > 0 &&
 series[series.length - 1]?.data?.length > 0 && (
  <>
    {new Date(series[0].data[0].datetime).toLocaleDateString()} -
    {new Date(
      series[series.length - 1].data[
        series[series.length - 1].data.length - 1
      ].datetime
    ).toLocaleDateString()}
  </>
)}

    {new Date(
      series[series.length - 1].data[
        series[series.length - 1].data.length - 1
      ].datetime
    ).toLocaleDateString()}
  </>
)}




              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
              <div className="text-xs uppercase tracking-wider text-blue-700 font-semibold">Scénarios</div>
              <div className="text-lg font-bold text-blue-900">{series.length}</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm">
              <div className="text-xs uppercase tracking-wider text-green-700 font-semibold">Moyenne globale</div>
              <div className="text-lg font-bold text-green-900">
                {(() => {
                  const allValues = series.flatMap(s => s.data.map((d: any) => d.value)).filter(Boolean);
                  return allValues.length ? (allValues.reduce((a, b) => a + b, 0) / allValues.length).toFixed(2) : '—';
                })()} m³/s
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-200 rounded-xl p-4 shadow-sm">
              <div className="text-xs uppercase tracking-wider text-purple-700 font-semibold">Variable</div>
              <div className="text-lg font-bold text-purple-900">Débit</div>
            </div>
          </div>
        )}

        {/* GRILLE TABLEAU + GRAPHE */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* TABLEAU - STYLISÉ */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span>📋</span> Comparaison des scénarios
              </h3>
              {selectedRowsMulti.length > 0 && (
                <span className="bg-white/30 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
                  {selectedRowsMulti.length} colonnes
                </span>
              )}
            </div>
            <div className="p-0">
              <HydroTableMulti series={series} className="border-0 rounded-none" />
            </div>
          </div>

          {/* GRAPHE - STYLISÉ */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span>📈</span> Visualisation
              </h3>
              <div className="flex gap-1">
                {series.map((s: any, idx: number) => (
                  <div 
                    key={idx} 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#8b5cf6'][idx % 4] }}
                    title={s.scenario}
                  />
                ))}
              </div>
            </div>
            <div className="p-3">
              <HydroChartMulti series={series} className="border-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
     


{mode === "fdc" && (
  <div className="space-y-6">
    {/* EN-TÊTE COLORÉ - MODE FDC */}
    <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-xl p-6 text-white shadow-lg">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl"></div>
      
      <div className="relative flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">📈</span>
            <h2 className="text-2xl font-bold">Mode FDC - Courbe de débit classé</h2>
          </div>
          <p className="text-amber-100 mt-1 max-w-2xl">
            Analyse fréquentielle des débits : probabilité de dépassement et débits caractéristiques
          </p>
        </div>
        {selectedRow && (
          <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg flex items-center gap-2">
            <span className="text-sm font-semibold">{selectedRow.scenario_name}</span>
            <span className="bg-white/30 text-white text-xs px-2 py-0.5 rounded-full">
              FDC
            </span>
          </div>
        )}
      </div>

      {/* Indicateurs statistiques rapides */}
      {series.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-6">
          <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
            <div className="text-xs text-amber-100">Débit max (Q0.1)</div>
            <div className="text-xl font-bold">{Math.max(...series.map((d: any) => d.value)).toFixed(2)} m³/s</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
            <div className="text-xs text-amber-100">Débit médian (Q50)</div>
            <div className="text-xl font-bold">
              {series.find((d: any) => d.exceedance >= 50 && d.exceedance <= 55)?.value.toFixed(2) || '—'} m³/s
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
            <div className="text-xs text-amber-100">Débit min (Q99.9)</div>
            <div className="text-xl font-bold">{Math.min(...series.map((d: any) => d.value)).toFixed(2)} m³/s</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
            <div className="text-xs text-amber-100">Points FDC</div>
            <div className="text-xl font-bold">{series.length}</div>
          </div>
        </div>
      )}
    </div>

    {/* GRILLE PRINCIPALE */}
    <div className="grid grid-cols-12 gap-6">
      
      {/* PANEL FILTRES - STYLISÉ */}
      <div className="col-span-12 lg:col-span-3">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-3">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <span>⚙️</span> Paramètres FDC
            </h3>
          </div>
          <div className="p-4">
            <HydroFiltersFDC
              rowsStats={rowsStats}
              selectedRow={selectedRow}
              dateStart={dateStart}
              dateEnd={dateEnd}
              onStationChange={setStationId}
              onRowChange={(row: any) => {
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

      {/* PANEL TABLEAU + GRAPHE */}
      <div className="col-span-12 lg:col-span-9 space-y-6">
        
        {/* BANDE D'INFORMATION - STATISTIQUES FDC */}
        {series.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-amber-800">Analyse fréquentielle</div>
                <div className="text-xs text-amber-600">
                  {new Date(dateStart).toLocaleDateString('fr-FR')} - {new Date(dateEnd).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                Q5: {series.find((d: any) => d.exceedance <= 5)?.value.toFixed(2)} m³/s
              </span>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                Q50: {series.find((d: any) => d.exceedance >= 50 && d.exceedance <= 55)?.value.toFixed(2)} m³/s
              </span>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                Q95: {series.find((d: any) => d.exceedance >= 95)?.value.toFixed(2)} m³/s
              </span>
            </div>
          </div>
        )}

        {/* GRILLE TABLEAU + GRAPHE */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* TABLEAU FDC - STYLISÉ */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span>📋</span> Tableau FDC
              </h3>
              {series.length > 0 && (
                <span className="bg-white/30 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
                  {series.length} points
                </span>
              )}
            </div>
            <div className="p-0">
              <HydroTableFDC data={series} />
            </div>
          </div>

          {/* GRAPHE FDC - STYLISÉ */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="bg-gradient-to-r from-amber-600 to-red-600 px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span>📈</span> Courbe de débit classé
              </h3>
              {selectedRow && (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-amber-300 rounded-full"></div>
                  <span className="text-white text-xs">{selectedRow.scenario_name}</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <HydroChartFDC data={series} />
            </div>
          </div>
        </div>

        {/* ÉTAT VIDE - SI AUCUNE SÉLECTION */}
        {!selectedRow && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-8 text-center">
            <div className="text-7xl mb-4 opacity-30">📊</div>
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Aucune donnée FDC</h3>
            <p className="text-amber-600 max-w-md mx-auto">
              Sélectionnez une station, une agrégation et une période pour générer la courbe de débit classé
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}

    </div>  

  );
}
