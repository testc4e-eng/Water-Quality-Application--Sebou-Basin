import { ArrowUpRight, ClipboardCheck } from "lucide-react";

import type { DashboardHomeRecommendedAction } from "@/api/dashboardHome";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecommendedActionsPanelProps {
  actions: DashboardHomeRecommendedAction[];
  compact?: boolean;
  maxVisible?: number;
}

const PRIORITY_CLASS = {
  P0: "border-rose-200 bg-rose-50 text-rose-700",
  P1: "border-amber-200 bg-amber-50 text-amber-700",
  P2: "border-emerald-200 bg-emerald-50 text-emerald-700",
} as const;

export function RecommendedActionsPanel({ actions, compact = false, maxVisible = 5 }: RecommendedActionsPanelProps) {
  return (
    <Card className="rounded-[22px] border-slate-200 shadow-sm">
      <CardHeader className={compact ? "pb-1 pt-2" : "pb-4"}>
        <CardTitle className={`flex items-center gap-1.5 ${compact ? "text-[13px]" : "text-xl"} text-slate-950`}>
          <ClipboardCheck className={compact ? "h-3.5 w-3.5 text-blue-700" : "h-5 w-5 text-blue-700"} />
          Recommandations immédiates
        </CardTitle>
      </CardHeader>
      <CardContent className={compact ? "max-h-[148px] space-y-1 overflow-y-auto" : "space-y-3"}>
        {actions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-[11px] leading-4 text-slate-600">
            Aucune action prioritaire remontée par le moteur de recommandations. Le Home reste lisible et exploitable sans surcharge.
          </div>
        ) : (
          actions.slice(0, maxVisible).map((item) => {
            const priorityClass = PRIORITY_CLASS[item.priority as keyof typeof PRIORITY_CLASS] ?? PRIORITY_CLASS.P2;
            const priorityLabel = item.priority === "P0" ? "Haute" : item.priority === "P1" ? "Moyenne" : "Suivi";
            return (
              <div key={item.id} className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${compact ? "p-1.5" : "p-4"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className={`font-semibold text-slate-950 ${compact ? "truncate text-[11px] leading-4" : ""}`}>{item.title}</div>
                    <div className={`mt-0.5 text-slate-600 ${compact ? "line-clamp-1 text-[10px] leading-3.5" : "text-sm leading-6"}`}>{item.why}</div>
                  </div>
                  <span className={`shrink-0 rounded-full border ${compact ? "px-1.5 py-0.5 text-[8px]" : "px-3 py-1 text-xs"} font-semibold ${priorityClass}`}>
                    {priorityLabel}
                  </span>
                </div>
                <div className={`rounded-xl bg-slate-50 text-slate-700 ${compact ? "mt-1.5 px-2 py-1 text-[10px]" : "mt-3 px-3 py-2 text-sm"}`}>
                  <div className="flex items-start gap-2">
                    <ArrowUpRight className={`${compact ? "mt-0.5 h-2.5 w-2.5" : "mt-0.5 h-4 w-4"} text-slate-500`} />
                    <span className={compact ? "line-clamp-1" : ""}>{item.action}</span>
                  </div>
                </div>
                <div className={`text-slate-500 ${compact ? "mt-1 truncate text-[9px]" : "mt-2 text-xs"}`}>
                  Cible : {item.target_label || item.target_type || "Non précisée"}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
