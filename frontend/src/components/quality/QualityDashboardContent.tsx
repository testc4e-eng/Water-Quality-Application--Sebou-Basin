import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import QualityFilters from "@/components/quality/QualityFilters";
import QualityKPIs from "@/components/quality/QualityKPIs";
import QualityTable from "@/components/quality/QualityTable";
import QualityChart from "@/components/quality/QualityChart";

export default function QualityDashboardContent() {
 const [station, setStation] = useState<string[]>([]);

  const [parametres, setParametres] = useState<string[]>(["N", "O", "P"]);
  const [aggregation, setAggregation] = useState("M");
  const [dateStart, setDateStart] = useState("1992-01-01");
  const [dateEnd, setDateEnd] = useState("2020-12-31");

  const apiParams = {
    station_code: station.join(","),
    parametres,
    aggregation,
    date_start: dateStart,
    date_end: dateEnd,
  };

  return (
    <div className="space-y-6">
      {/* EN-TÊTE COLORÉ - QUALITÉ */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-3xl">🧪</span> Qualité de l'eau - Analyse multi-paramètres
            </h2>
            <p className="text-emerald-100 mt-1">
              Surveillance et analyse des paramètres physico-chimiques
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
            <span className="font-semibold">{parametres.length}</span> paramètre(s) actif(s)
          </div>
        </div>
      </div>

      {/* GRILLE PRINCIPALE */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* PANEL FILTRES - STYLISÉ */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span>⚙️</span> Filtres qualité
              </h3>
            </div>
            <div className="p-4">
              <QualityFilters
                station={station}
                parametres={parametres}
                aggregation={aggregation}
                dateStart={dateStart}
                dateEnd={dateEnd}
                onStationChange={setStation}
                onParametresChange={setParametres}
                onAggregationChange={setAggregation}
                onDateStartChange={setDateStart}
                onDateEndChange={setDateEnd}
              />
            </div>
          </div>
        </div>

       {/* PANEL PRINCIPAL */}
<div className="col-span-12 lg:col-span-9 space-y-6">

  {/* KPIs : toujours visibles */}
  {station.length > 0 ? (
    <QualityKPIs {...apiParams} />
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { title: "Azote (N)", accent: "text-blue-700", bg: "bg-blue-50" },
        { title: "Oxygène (O)", accent: "text-red-700", bg: "bg-red-50" },
        { title: "Phosphore (P)", accent: "text-green-700", bg: "bg-green-50" },
      ].map((k) => (
        <div key={k.title} className={`rounded-xl border border-gray-100 shadow-sm p-4 ${k.bg}`}>
          <div className={`text-sm font-semibold ${k.accent}`}>{k.title}</div>
          <div className="mt-3 text-3xl font-bold text-gray-400">—</div>
          <div className="mt-1 text-xs text-gray-500">Sélectionnez une station</div>
        </div>
      ))}
    </div>
  )}

  {/* Bande période : toujours visible */}
  <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-3">
    <div className="flex items-center gap-2">
      <span className="text-emerald-600">📅</span>
      <span className="text-sm text-gray-600">
        Période d'analyse :
        <span className="font-semibold text-gray-800 ml-1">
          {new Date(dateStart).toLocaleDateString("fr-FR")} -{" "}
          {new Date(dateEnd).toLocaleDateString("fr-FR")}
        </span>
      </span>
    </div>

    <div className="flex items-center gap-2 mt-2">
      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
        {aggregation === "D" ? "Journalier" : "Mensuel"}
      </span>
      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
        {station.length} station(s)
      </span>
    </div>
  </div>

  {/* Grille Table + Graphe : toujours visible */}
  <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

    {/* TABLEAU */}
    <div className="xl:col-span-2">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden h-full">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <span>📋</span> Données qualité
          </h3>
        </div>
        <div className="p-0">
          <QualityTable {...apiParams} />
        </div>
      </div>
    </div>

    {/* GRAPHE */}
    <div className="xl:col-span-3">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden h-full">
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <span>📈</span> Évolution temporelle
          </h3>
        </div>
        <div className="p-3">
          <QualityChart {...apiParams} />
        </div>
      </div>
    </div>

  </div>
</div>

          

        </div> 

      </div> 
     
  );
}
