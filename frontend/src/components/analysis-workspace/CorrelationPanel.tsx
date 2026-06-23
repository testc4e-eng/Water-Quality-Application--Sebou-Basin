import React, { useMemo } from 'react';
import { X, Activity, Loader2, AlertCircle, Plus } from 'lucide-react';
import { useWorkspaceStore, type BatchSeriesItem } from '@/store/workspaceStore';
import { useCorrelation } from '@/hooks/useCorrelation';

export const CorrelationPanel: React.FC = () => {
  const {
    widgets,
    globalDateFrom,
    globalDateTo,
    globalAggregation,
    correlationSeriesX,
    correlationSeriesY,
    correlationResult,
    closeCorrelationPanel,
    setCorrelationSeriesX,
    setCorrelationSeriesY,
    setCorrelationResult,
    addCorrelationWidget,
  } = useWorkspaceStore();

  const { mutate, isPending } = useCorrelation();

  // Extraire les séries temporelles actives (hors POINT_MEASURE)
  const availableSeries = useMemo(() => {
    const map = new Map<string, BatchSeriesItem>();
    widgets
      .flatMap((w) => w.seriesRequests)
      .filter((s) => s.data_temporality !== 'POINT_MEASURE')
      .forEach((s) => {
        const key = `${s.support_type}|${s.object_id}|${s.parameter_code}`;
        if (!map.has(key)) map.set(key, s);
      });
    return Array.from(map.values());
  }, [widgets]);

  const seriesLabel = (s: BatchSeriesItem | null) => {
    if (!s) return '—';
    return `${s.parameter_code} — ${s.object_name || s.object_id} (${s.domain})`;
  };

  const canCompute = correlationSeriesX && correlationSeriesY && correlationSeriesX !== correlationSeriesY;

  const handleCompute = () => {
    if (!canCompute || !correlationSeriesX || !correlationSeriesY) return;
    setCorrelationResult(null);
    mutate(
      {
        seriesX: {
          object_id: correlationSeriesX.object_id,
          parameter_code: correlationSeriesX.parameter_code,
          domain: correlationSeriesX.domain,
          support_type: correlationSeriesX.support_type,
        },
        seriesY: {
          object_id: correlationSeriesY.object_id,
          parameter_code: correlationSeriesY.parameter_code,
          domain: correlationSeriesY.domain,
          support_type: correlationSeriesY.support_type,
        },
      },
      {
        onSuccess: (data) => setCorrelationResult(data),
      }
    );
  };

  const aggLabel: Record<string, string> = {
    raw: 'Brute',
    daily: 'Journalière',
    monthly: 'Mensuelle',
    annual: 'Annuelle',
  };

  return (
    <div className="absolute top-12 right-0 w-96 h-[calc(100%-3rem)] bg-white border-l border-slate-200 shadow-xl z-50 flex flex-col pointer-events-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-purple-50">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-purple-700" />
          <h3 className="text-sm font-bold text-slate-800">Corrélations</h3>
        </div>
        <button
          onClick={closeCorrelationPanel}
          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors"
          title="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
          Période : <span className="font-medium text-slate-700">{globalDateFrom}</span> →{' '}
          <span className="font-medium text-slate-700">{globalDateTo}</span>
          <br />
          Agrégation : <span className="font-medium text-slate-700">{aggLabel[globalAggregation] || globalAggregation}</span>
        </div>

        {availableSeries.length < 2 ? (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>
              Ajoutez au moins <strong>2 séries temporelles</strong> au workspace pour analyser les corrélations.
              Les séries ponctuelles (pollution) ne sont pas éligibles.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Série X</label>
              <select
                value={correlationSeriesX ? `${correlationSeriesX.support_type}|${correlationSeriesX.object_id}|${correlationSeriesX.parameter_code}` : ''}
                onChange={(e) => {
                  const selected = availableSeries.find(
                    (s) => `${s.support_type}|${s.object_id}|${s.parameter_code}` === e.target.value
                  );
                  setCorrelationSeriesX(selected || null);
                  setCorrelationResult(null);
                }}
                className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-purple-500"
              >
                <option value="">Sélectionner une série X</option>
                {availableSeries.map((s) => (
                  <option key={`x-${s.support_type}|${s.object_id}|${s.parameter_code}`} value={`${s.support_type}|${s.object_id}|${s.parameter_code}`}>
                    {seriesLabel(s)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Série Y</label>
              <select
                value={correlationSeriesY ? `${correlationSeriesY.support_type}|${correlationSeriesY.object_id}|${correlationSeriesY.parameter_code}` : ''}
                onChange={(e) => {
                  const selected = availableSeries.find(
                    (s) => `${s.support_type}|${s.object_id}|${s.parameter_code}` === e.target.value
                  );
                  setCorrelationSeriesY(selected || null);
                  setCorrelationResult(null);
                }}
                className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs outline-none focus:border-purple-500"
              >
                <option value="">Sélectionner une série Y</option>
                {availableSeries
                  .filter((s) => s !== correlationSeriesX)
                  .map((s) => (
                    <option key={`y-${s.support_type}|${s.object_id}|${s.parameter_code}`} value={`${s.support_type}|${s.object_id}|${s.parameter_code}`}>
                      {seriesLabel(s)}
                    </option>
                  ))}
              </select>
            </div>

            <button
              onClick={handleCompute}
              disabled={!canCompute || isPending}
              className="w-full flex items-center justify-center gap-2 text-xs px-3 py-2 bg-purple-600 text-white rounded font-medium hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Activity className="h-3.5 w-3.5" />}
              Calculer la corrélation
            </button>

            {correlationResult && (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                {correlationResult.error ? (
                  <div className="p-3 bg-red-50 border-l-4 border-red-400 text-xs text-red-800">
                    <div className="font-semibold mb-0.5">{correlationResult.error}</div>
                    <div>{correlationResult.message}</div>
                  </div>
                ) : correlationResult.correlation ? (
                  <div className="p-3 space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-purple-50 rounded p-2">
                        <div className="text-[10px] text-slate-500 uppercase">R²</div>
                        <div className="text-sm font-bold text-purple-900">
                          {correlationResult.correlation.r_squared.toFixed(2)}
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded p-2">
                        <div className="text-[10px] text-slate-500 uppercase">Pearson r</div>
                        <div className="text-sm font-bold text-purple-900">
                          {correlationResult.correlation.pearson_r.toFixed(2)}
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded p-2">
                        <div className="text-[10px] text-slate-500 uppercase">Points</div>
                        <div className="text-sm font-bold text-purple-900">
                          {correlationResult.correlation.n_points}
                        </div>
                      </div>
                    </div>

                    {correlationResult.correlation.p_value !== undefined && (
                      <div className="text-[11px] text-slate-500 text-center">
                        p-value = {correlationResult.correlation.p_value.toFixed(4)}
                      </div>
                    )}

                    <button
                      onClick={() => addCorrelationWidget(correlationResult)}
                      className="w-full flex items-center justify-center gap-1.5 text-xs px-3 py-2 bg-white border border-purple-300 text-purple-700 rounded font-medium hover:bg-purple-50 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Ajouter au workspace
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 border-l-4 border-amber-400 text-xs text-amber-800">
                    <div className="font-semibold mb-0.5">Résultat incomplet</div>
                    <div>La corrélation n'a pas pu être calculée sur la période commune.</div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
