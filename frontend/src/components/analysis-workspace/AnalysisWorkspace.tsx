import React, { useState } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { AnalysisWidget } from './AnalysisWidget';
import { useAnalysisBatch } from '@/hooks/useAnalysisBatch';
import { RefreshCw, Minimize2, XSquare, Plus, Loader2, Activity } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CorrelationPanel } from './CorrelationPanel';

export const AnalysisWorkspace: React.FC = () => {
  const { 
    widgets, 
    updateWidgetPosition, 
    updateWidgetSize, 
    minimizeWidget, 
    removeWidget,
    closeAllWidgets,
    minimizeAllWidgets,
    globalDateFrom,
    globalDateTo,
    globalAggregation,
    setGlobalDateRange,
    setGlobalAggregation,
    isCorrelationPanelOpen,
    openCorrelationPanel,
  } = useWorkspaceStore();

  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [tempFrom, setTempFrom] = useState(globalDateFrom);
  const [tempTo, setTempTo] = useState(globalDateTo);
  const [tempAgg, setTempAgg] = useState(globalAggregation);

  // Utiliser le même hook batch que dans V1, mais il écoute toutes les requêtes des widgets
  // Pour éviter des appels en double, nous compilons toutes les requêtes uniques
  const allRequests = widgets.flatMap(w => w.seriesRequests);
  const uniqueRequests = Array.from(new Set(allRequests.map(r => JSON.stringify(r)))).map(s => JSON.parse(s));

  const timeSeriesCount = React.useMemo(
    () => widgets.flatMap(w => w.seriesRequests).filter(s => s.data_temporality !== 'POINT_MEASURE').length,
    [widgets]
  );

  const { data: batchData, isLoading, isFetching } = useAnalysisBatch();

  const handleSync = () => {
    setGlobalDateRange(tempFrom, tempTo);
    setGlobalAggregation(tempAgg as any);
    setIsSyncOpen(false);
  };

  return (
    <div className="absolute top-0 right-0 w-[60%] h-full flex flex-col pointer-events-none z-10">
      {/* Toolbar Globale */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/95 backdrop-blur-sm border-b border-l border-slate-200 shadow-sm shrink-0 sticky top-0 z-50 pointer-events-auto">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold text-slate-800">Workspace Analytique</h2>
          <div className="flex gap-2">
            <Popover open={isSyncOpen} onOpenChange={setIsSyncOpen}>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 text-xs px-2 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded font-medium transition-colors">
                  <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                  Synchroniser temps
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="start">
                <h4 className="font-semibold text-sm mb-3">Période Globale</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-500 text-xs font-semibold">Date de début</label>
                    <input type="date" value={tempFrom} onChange={e => setTempFrom(e.target.value)} className="border rounded p-1 text-sm outline-none focus:border-indigo-500" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-500 text-xs font-semibold">Date de fin</label>
                    <input type="date" value={tempTo} onChange={e => setTempTo(e.target.value)} className="border rounded p-1 text-sm outline-none focus:border-indigo-500" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-500 text-xs font-semibold">Agrégation</label>
                    <select value={tempAgg} onChange={e => setTempAgg(e.target.value as any)} className="border rounded p-1 text-sm outline-none focus:border-indigo-500">
                      <option value="raw">Brute (Raw)</option>
                      <option value="daily">Journalière</option>
                      <option value="monthly">Mensuelle</option>
                      <option value="annual">Annuelle</option>
                    </select>
                  </div>
                  <button onClick={handleSync} className="w-full mt-2 bg-indigo-600 text-white rounded py-1.5 font-medium hover:bg-indigo-700">
                    Appliquer à tous les widgets
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            <button
              onClick={openCorrelationPanel}
              disabled={timeSeriesCount < 2}
              className="flex items-center gap-1 text-xs px-2 py-1.5 text-purple-700 hover:bg-purple-50 rounded transition-colors disabled:text-slate-400 disabled:hover:bg-transparent disabled:cursor-not-allowed"
              title={timeSeriesCount < 2 ? "Sélectionnez au moins 2 séries temporelles pour analyser les corrélations" : "Analyser les corrélations"}
            >
              <Activity className="h-3.5 w-3.5" /> Corrélations
            </button>
            <button onClick={minimizeAllWidgets} className="flex items-center gap-1 text-xs px-2 py-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors" title="Réduire tout">
              <Minimize2 className="h-3.5 w-3.5" /> Réduire tout
            </button>
            <button onClick={closeAllWidgets} className="flex items-center gap-1 text-xs px-2 py-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Fermer tout">
              <XSquare className="h-3.5 w-3.5" /> Fermer tout
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Chargement...
            </div>
          )}
          <div className="text-xs text-slate-500 font-mono">
            {widgets.length} Widget{widgets.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {isCorrelationPanelOpen && <CorrelationPanel />}

      {/* Zone Widgets */}
      <div className="flex-1 relative overflow-hidden p-4">
        {widgets.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
            <Plus className="h-12 w-12 text-slate-300" />
            <p className="text-sm">Aucun widget dans le workspace.</p>
            <p className="text-xs text-slate-400">Cliquez sur une station de la carte pour ajouter une analyse.</p>
          </div>
        )}
        
        {widgets.map(w => {
          // Filtrer les séries de batchData pour ce widget
          const widgetSeries = batchData?.series?.filter(s => 
            w.seriesRequests.some(r => {
              const match = String(r.support_type || '').toLowerCase() === String(s.support_type || '').toLowerCase() && 
                            String(r.object_id || '').toLowerCase() === String(s.object_id || '').toLowerCase() && 
                            String(r.parameter_code || '').toLowerCase() === String(s.parameter_code || '').toLowerCase();
              console.log("Matching:", r.object_id, r.parameter_code, "vs", s.object_id, s.parameter_code, "->", match ? "TROUVE" : "NON TROUVE");
              return match;
            })
          ) || [];

          return (
            <AnalysisWidget
              key={w.id}
              id={w.id}
              title={w.title}
              type={w.type}
              series={widgetSeries}
              correlationData={w.correlationData}
              position={w.position}
              size={w.size}
              isMinimized={w.isMinimized}
              onClose={() => removeWidget(w.id)}
              onMinimize={() => minimizeWidget(w.id)}
              onUpdatePosition={(pos) => updateWidgetPosition(w.id, pos)}
              onUpdateSize={(size) => updateWidgetSize(w.id, size)}
            />
          );
        })}
      </div>
    </div>
  );
};
