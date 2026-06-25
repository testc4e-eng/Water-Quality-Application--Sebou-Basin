import React from 'react';

export function QualityGlobalFilters() {
  return (
    <div className="w-80 border-r border-slate-200 bg-white p-4 h-full overflow-y-auto">
      <h3 className="font-semibold text-slate-900 mb-4">Filtres globaux</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">Période</label>
          <select className="w-full border-slate-200 rounded-md text-sm"><option>Dernières 12 mois</option></select>
        </div>
        
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">Support</label>
          <select className="w-full border-slate-200 rounded-md text-sm"><option>Tous</option></select>
        </div>
        
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">Bassin</label>
          <select className="w-full border-slate-200 rounded-md text-sm"><option>Sebou</option></select>
        </div>
        
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">Sous-bassin</label>
          <select className="w-full border-slate-200 rounded-md text-sm"><option>Tous</option></select>
        </div>
        
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">Station</label>
          <input type="text" placeholder="Rechercher une station..." className="w-full border-slate-200 rounded-md text-sm" />
        </div>
        
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1">Paramètre</label>
          <select className="w-full border-slate-200 rounded-md text-sm"><option>Tous</option></select>
        </div>
        
        <div className="pt-4 flex gap-2">
          <button className="flex-1 bg-blue-600 text-white rounded-md py-2 text-sm font-medium hover:bg-blue-700">Appliquer</button>
          <button className="flex-1 bg-white border border-slate-200 text-slate-700 rounded-md py-2 text-sm font-medium hover:bg-slate-50">Réinitialiser</button>
        </div>
      </div>
    </div>
  );
}
