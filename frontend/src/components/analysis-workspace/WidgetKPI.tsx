import React from 'react';
import { AnalyticalSeries } from '@/api/analysis';

export interface WidgetKPIProps {
  series: AnalyticalSeries[];
}

export const WidgetKPI: React.FC<WidgetKPIProps> = ({ series }) => {
  if (!series || series.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-white rounded p-4">
        <div className="text-slate-400 text-sm text-center">
          Aucune donnée disponible pour cette période ou entité.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-2 h-full w-full overflow-y-auto bg-white rounded">
      {series.map(s => {
        const values = s.values.map(v => v.value).filter(v => v !== null) as number[];
        const count = values.length;
        
        if (count === 0) {
           return (
             <div key={s.id} className="border border-slate-200 rounded p-3">
               <div className="text-sm font-semibold text-slate-800">{s.object_name} - {s.parameter_label}</div>
               <div className="text-xs text-slate-500 mt-1">Aucune donnée trouvée.</div>
             </div>
           );
        }

        const isTimeseries = count > 1;

        if (!isTimeseries) {
           const lastVal = values[0];
           const lastDate = new Date(s.values[0].date).toLocaleDateString();
           return (
             <div key={s.id} className="border border-slate-200 rounded p-3 bg-slate-50">
               <div className="flex justify-between items-start">
                 <div>
                   <div className="text-[13px] font-semibold text-slate-800">{s.object_name}</div>
                   <div className="text-[11px] text-slate-500">{s.parameter_label} ({s.support_type})</div>
                 </div>
                 <div className="px-2 py-1 bg-indigo-100 text-indigo-800 text-[10px] rounded-full font-semibold">
                   Ponctuelle
                 </div>
               </div>
               <div className="mt-4 flex items-end gap-2">
                 <div className="text-3xl font-bold text-slate-900">{lastVal.toLocaleString()}</div>
                 <div className="text-sm text-slate-500 mb-1">{s.unit}</div>
               </div>
               <div className="mt-2 text-[11px] text-slate-400">Le {lastDate}</div>
             </div>
           );
        }

        const min = Math.min(...values);
        const max = Math.max(...values);
        const avg = values.reduce((a, b) => a + b, 0) / count;
        const lastVal = values[values.length - 1];
        const lastDate = s.values[s.values.length - 1].date;

        return (
          <div key={s.id} className="border border-slate-200 rounded p-3 shadow-sm">
            <div className="text-[13px] font-semibold text-slate-800 mb-1 truncate">{s.object_name} - {s.parameter_code}</div>
            <div className="text-[11px] text-slate-500 mb-3">{s.unit ? `Unité: ${s.unit}` : ''} | {count} mesures</div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="bg-slate-50 p-2 rounded">
                <div className="text-[10px] text-slate-500 uppercase">Dernière</div>
                <div className="text-lg font-semibold text-indigo-600">{lastVal.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                <div className="text-[9px] text-slate-400">{new Date(lastDate).toLocaleDateString()}</div>
              </div>
              <div className="bg-slate-50 p-2 rounded">
                <div className="text-[10px] text-slate-500 uppercase">Moyenne</div>
                <div className="text-lg font-semibold text-slate-700">{avg.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
              </div>
              <div className="bg-slate-50 p-2 rounded">
                <div className="text-[10px] text-slate-500 uppercase">Min / Max</div>
                <div className="text-sm font-semibold text-slate-700">{min.toLocaleString(undefined, {maximumFractionDigits: 1})} / {max.toLocaleString(undefined, {maximumFractionDigits: 1})}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
