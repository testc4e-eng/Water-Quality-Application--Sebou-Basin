import { ArrowUpRight, ClipboardCheck } from "lucide-react";

import type { DashboardHomeRecommendedAction } from "@/api/dashboardHome";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecommendedActionsPanelProps {
  actions: DashboardHomeRecommendedAction[];
}

const PRIORITY_CLASS = {
  P0: "border-rose-200 bg-rose-50 text-rose-700",
  P1: "border-amber-200 bg-amber-50 text-amber-700",
  P2: "border-emerald-200 bg-emerald-50 text-emerald-700",
} as const;

export function RecommendedActionsPanel({ actions }: RecommendedActionsPanelProps) {
  return (
    <Card className="rounded-[28px] border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl text-slate-950">
          <ClipboardCheck className="h-5 w-5 text-blue-700" />
          Recommandations immédiates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            Aucune action prioritaire remontée par le moteur de recommandations. Le Home reste lisible et exploitable sans surcharge.
          </div>
        ) : (
          actions.slice(0, 5).map((item) => {
            const priorityClass = PRIORITY_CLASS[item.priority as keyof typeof PRIORITY_CLASS] ?? PRIORITY_CLASS.P2;
            const priorityLabel = item.priority === "P0" ? "Haute" : item.priority === "P1" ? "Moyenne" : "Suivi";
            return (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-950">{item.title}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-600">{item.why}</div>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${priorityClass}`}>
                    {priorityLabel}
                  </span>
                </div>
                <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <div className="flex items-start gap-2">
                    <ArrowUpRight className="mt-0.5 h-4 w-4 text-slate-500" />
                    <span>{item.action}</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-500">
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
