import { Eye, EyeOff } from "lucide-react";

import type { DashboardHomeMap } from "@/api/dashboardHome";

interface LayerSummaryProps {
  mapConfig: DashboardHomeMap;
}

export function LayerSummary({ mapConfig }: LayerSummaryProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {mapConfig.default_layers.map((layerKey) => {
        const layer = mapConfig.layers[layerKey];
        if (!layer) return null;
        return (
          <div key={layerKey} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-900">{layer.label}</span>
            <span className="text-sm font-semibold text-slate-950">{layer.count}</span>
            <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-700">
              <Eye className="h-3 w-3" />
              Actif
            </span>
          </div>
        );
      })}

      {mapConfig.secondary_layers.map((layerKey) => (
        <div key={layerKey} className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 bg-slate-50/80 px-3 py-1.5">
          <span className="text-[11px] font-medium capitalize text-slate-700">{layerKey}</span>
          <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
            <EyeOff className="h-3 w-3" />
            Option
          </span>
        </div>
      ))}
    </div>
  );
}
