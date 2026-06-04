import { Eye, EyeOff } from "lucide-react";

import type { DashboardHomeMap } from "@/api/dashboardHome";

interface LayerSummaryProps {
  mapConfig: DashboardHomeMap;
}

export function LayerSummary({ mapConfig }: LayerSummaryProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {mapConfig.default_layers.map((layerKey) => {
        const layer = mapConfig.layers[layerKey];
        if (!layer) return null;
        return (
          <div key={layerKey} className="rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-900">{layer.label}</div>
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-700">
                <Eye className="h-3.5 w-3.5" />
                Actif
              </span>
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-950">{layer.count}</div>
            <div className="mt-1 text-xs text-slate-500">Couche par défaut du Home</div>
          </div>
        );
      })}

      {mapConfig.secondary_layers.map((layerKey) => (
        <div key={layerKey} className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium capitalize text-slate-700">{layerKey}</div>
            <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
              <EyeOff className="h-3.5 w-3.5" />
              Option
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500">Masquée par défaut</div>
        </div>
      ))}
    </div>
  );
}
