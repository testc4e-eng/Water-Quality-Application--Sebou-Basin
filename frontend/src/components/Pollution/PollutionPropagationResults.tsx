import { Download, X } from "lucide-react";

import type { SimulatePropagationResponse } from "@/api/propagation";

interface PollutionPropagationResultsProps {
  results: SimulatePropagationResponse;
  onClose: () => void;
}

function alertClass(alertLevel: string) {
  if (alertLevel === "CRITICAL") return "bg-red-50 border-red-200 text-red-700";
  if (alertLevel === "WARNING") return "bg-amber-50 border-amber-200 text-amber-700";
  return "bg-green-50 border-green-200 text-green-700";
}

export default function PollutionPropagationResults({
  results,
  onClose,
}: PollutionPropagationResultsProps) {
  const { impacted_stations, impacted_barrages, impacted_exutoires, recommendations, path } = results;

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `propagation-${results.propagation_id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const allTargets = [
    ...impacted_stations,
    ...impacted_barrages,
    ...impacted_exutoires,
  ].sort((a, b) => a.distance_km - b.distance_km);

  return (
    <div className="absolute top-4 right-4 z-10 flex w-96 max-h-[80vh] flex-col rounded-lg border border-slate-200 bg-white shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-100 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Résultats de la simulation</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="text-indigo-600 hover:text-indigo-800"
            title="Exporter JSON"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4 grid grid-cols-3 gap-2">
          <div className="rounded bg-slate-50 p-2 text-center">
            <div className="text-lg font-bold text-slate-700">{path.length_km.toFixed(1)}</div>
            <div className="text-[10px] text-slate-400">km parcourus</div>
          </div>
          <div className="rounded bg-slate-50 p-2 text-center">
            <div className="text-lg font-bold text-slate-700">{path.travel_time_h.toFixed(1)}</div>
            <div className="text-[10px] text-slate-400">heures</div>
          </div>
          <div className="rounded bg-slate-50 p-2 text-center">
            <div className="text-lg font-bold text-slate-700">{allTargets.length}</div>
            <div className="text-[10px] text-slate-400">cibles impactées</div>
          </div>
        </div>

        {results.warnings.length > 0 && (
          <div className="mb-4 rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-700">
            {results.warnings.map((w, i) => (
              <div key={i}>⚠️ {w}</div>
            ))}
          </div>
        )}

        <div className="mb-4">
          <h4 className="mb-2 text-xs font-medium text-slate-600">Cibles impactées</h4>
          <div className="space-y-1.5">
            {allTargets.map((target) => (
              <div
                key={`${target.station_type}-${target.station_id}`}
                className={`rounded border p-2 text-xs ${alertClass(target.alert_level)}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{target.station_name}</span>
                  <span className="text-[10px] font-semibold uppercase">{target.alert_level}</span>
                </div>
                <div className="mt-0.5 text-[10px] opacity-90">
                  {target.station_type} — {target.distance_km.toFixed(1)} km —{" "}
                  {new Date(target.arrival_time).toLocaleString("fr-MA")}
                </div>
                <div className="mt-0.5 text-[10px] opacity-90">
                  Concentration estimée : {target.estimated_concentration_mg_l.toFixed(3)} mg/L
                </div>
              </div>
            ))}
            {allTargets.length === 0 && (
              <div className="text-xs text-slate-500">Aucune cible atteinte dans l'horizon de simulation.</div>
            )}
          </div>
        </div>

        {recommendations.length > 0 && (
          <div>
            <h4 className="mb-2 text-xs font-medium text-slate-600">Recommandations</h4>
            <div className="space-y-1.5">
              {recommendations.map((rec, i) => (
                <div key={i} className="rounded border border-indigo-200 bg-indigo-50 p-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-semibold text-white">
                      {rec.priority}
                    </span>
                    <span className="font-medium text-slate-900">{rec.action}</span>
                  </div>
                  <div className="mt-1 text-[10px] text-slate-600">{rec.reason}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
