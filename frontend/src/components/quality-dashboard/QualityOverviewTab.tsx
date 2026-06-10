import React from 'react';

export function QualityOverviewTab() {
  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 font-medium">Stations</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">361</div>
        </div>
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 font-medium">Mesures totales</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">119 089</div>
        </div>
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 font-medium">Paramètres mesurés</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">151</div>
        </div>
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 font-medium">Période des données</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">1980 - 2026</div>
        </div>
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 font-medium">Données valides</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">94,2 %</div>
        </div>
      </div>
      
      {/* Charts placeholder */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm h-64 flex flex-col">
          <h3 className="font-semibold text-slate-900 mb-2">Répartition par support</h3>
          <div className="flex-1 bg-slate-50 rounded border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm">[Donut Chart]</div>
        </div>
        <div className="col-span-2 bg-white p-4 rounded-md border border-slate-200 shadow-sm h-64 flex flex-col">
          <h3 className="font-semibold text-slate-900 mb-2">Évolution temporelle</h3>
          <div className="flex-1 bg-slate-50 rounded border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm">[Area Chart]</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm h-64 flex flex-col">
          <h3 className="font-semibold text-slate-900 mb-2">Qualité globale</h3>
          <div className="flex-1 bg-slate-50 rounded border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm">[KPIs Qualité]</div>
        </div>
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm h-64 flex flex-col">
          <h3 className="font-semibold text-slate-900 mb-2">Aperçu carte</h3>
          <div className="flex-1 bg-slate-50 rounded border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm">[MapLibre]</div>
        </div>
      </div>
    </div>
  );
}
