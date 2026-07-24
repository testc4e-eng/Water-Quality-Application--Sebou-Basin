import React, { useEffect, useState } from 'react';
import type { QualityDashboardFilters } from './types';

interface QualityGlobalFiltersProps {
  value?: QualityDashboardFilters;
  onApply?: (filters: QualityDashboardFilters) => void;
  onReset?: () => void;
}

export function QualityGlobalFilters({ value, onApply, onReset }: QualityGlobalFiltersProps) {
  const [draft, setDraft] = useState<QualityDashboardFilters>(value ?? {
    period: "all",
    supportType: "",
    bassin: "Sebou",
    sousBassin: "",
    stationSearch: "",
    parameter: "",
  });

  useEffect(() => {
    if (value) {
      setDraft(value);
    }
  }, [value]);

  const updateDraft = <K extends keyof QualityDashboardFilters>(key: K, nextValue: QualityDashboardFilters[K]) => {
    setDraft(current => ({ ...current, [key]: nextValue }));
  };

  const handleApply = () => {
    onApply?.(draft);
  };

  const handleReset = () => {
    onReset?.();
  };

  return (
    <div className="w-80 border-r border-slate-200 bg-white p-4 h-full overflow-y-auto">
      <h3 className="font-semibold text-slate-900 mb-4">Filtres globaux</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">Période</label>
          <select
            className="w-full border-slate-200 rounded-md text-sm"
            value={draft.period}
            onChange={(event) => updateDraft('period', event.target.value as QualityDashboardFilters['period'])}
          >
            <option value="all">Toutes les données</option>
            <option value="12m">Dernières 12 mois</option>
          </select>
        </div>
        
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">Support</label>
          <select
            className="w-full border-slate-200 rounded-md text-sm"
            value={draft.supportType}
            onChange={(event) => updateDraft('supportType', event.target.value as QualityDashboardFilters['supportType'])}
          >
            <option value="">Tous</option>
            <option value="SENTINELLE">Sentinelle</option>
            <option value="RIVIERE">Rivière</option>
            <option value="BARRAGE">Barrage</option>
            <option value="NAPPE">Nappe</option>
          </select>
        </div>
        
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">Bassin</label>
          <select
            className="w-full border-slate-200 rounded-md text-sm"
            value={draft.bassin}
            onChange={(event) => updateDraft('bassin', event.target.value)}
          >
            <option value="Sebou">Sebou</option>
            <option value="">Tous</option>
          </select>
        </div>
        
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">Sous-bassin</label>
          <input
            type="text"
            value={draft.sousBassin}
            onChange={(event) => updateDraft('sousBassin', event.target.value)}
            placeholder="Tous"
            className="w-full border-slate-200 rounded-md text-sm"
          />
        </div>
        
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">Station</label>
          <input
            type="text"
            value={draft.stationSearch}
            onChange={(event) => updateDraft('stationSearch', event.target.value)}
            placeholder="Rechercher une station..."
            className="w-full border-slate-200 rounded-md text-sm"
          />
        </div>
        
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">Paramètre</label>
          <input
            type="text"
            value={draft.parameter}
            onChange={(event) => updateDraft('parameter', event.target.value)}
            placeholder="Tous"
            className="w-full border-slate-200 rounded-md text-sm"
          />
        </div>
        
        <div className="pt-4 flex gap-2">
          <button
            onClick={handleApply}
            className="flex-1 bg-blue-600 text-white rounded-md py-2 text-sm font-medium hover:bg-blue-700"
          >
            Appliquer
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-white border border-slate-200 text-slate-700 rounded-md py-2 text-sm font-medium hover:bg-slate-50"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}
