import { AlertTriangle, BellRing, Database, Gauge, ShieldAlert, Waves } from "lucide-react";

import type { DashboardHomeAlert } from "@/api/dashboardHome";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AlertsPanelProps {
  alerts: DashboardHomeAlert[];
  compact?: boolean;
  maxVisible?: number;
}

const TYPE_ICON = {
  BARRAGE: Gauge,
  HYDRO: Waves,
  PLUVIO: BellRing,
  QUALITE: ShieldAlert,
  DATA: Database,
} as const;

const SEVERITY_CLASS = {
  INFO: "border-sky-200 bg-sky-50 text-sky-700",
  SURVEILLANCE: "border-amber-200 bg-amber-50 text-amber-700",
  CRITIQUE: "border-rose-200 bg-rose-50 text-rose-700",
} as const;

export function AlertsPanel({ alerts, compact = false, maxVisible = 5 }: AlertsPanelProps) {
  return (
    <Card className="rounded-[22px] border-[#17396f] bg-[linear-gradient(180deg,#0B2248_0%,#102D5C_100%)] text-white shadow-[0_20px_40px_rgba(7,30,65,0.18)]">
      <CardHeader className={compact ? "pb-1 pt-2" : "pb-4"}>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className={`flex items-center gap-1.5 ${compact ? "text-[13px]" : "text-xl"} text-white`}>
            <AlertTriangle className={compact ? "h-3.5 w-3.5 text-rose-300" : "h-5 w-5 text-rose-300"} />
            Alertes ouvertes
          </CardTitle>
          <div className={`rounded-full bg-white/10 ${compact ? "px-1.5 py-0.5 text-[9px]" : "px-3 py-1 text-sm"} font-semibold text-white`}>{alerts.length}</div>
        </div>
      </CardHeader>
      <CardContent className={compact ? "max-h-[148px] space-y-1 overflow-y-auto pr-1" : "space-y-3"}>
        {alerts.length === 0 ? (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-2.5 text-[11px] leading-4 text-emerald-50">
            Aucune alerte prioritaire à afficher. Le bassin reste sous surveillance normale au niveau de l’accueil.
          </div>
        ) : (
          alerts.slice(0, maxVisible).map((alert) => {
            const Icon = TYPE_ICON[alert.type as keyof typeof TYPE_ICON] ?? AlertTriangle;
            const severityClass = SEVERITY_CLASS[alert.severity as keyof typeof SEVERITY_CLASS] ?? SEVERITY_CLASS.INFO;
            return (
              <div key={alert.id} className={`rounded-2xl border border-white/10 bg-white/5 ${compact ? "p-1.5" : "p-4"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-start gap-2">
                    <div className={`mt-0.5 flex items-center justify-center rounded-xl bg-white/10 text-white shadow-sm ${compact ? "h-6 w-6" : "h-9 w-9"}`}>
                      <Icon className={compact ? "h-3 w-3" : "h-4 w-4"} />
                    </div>
                    <div className="min-w-0">
                      <div className={`font-semibold text-white ${compact ? "truncate text-[11px] leading-4" : ""}`}>{alert.title}</div>
                      <div className={`mt-0.5 text-slate-200 ${compact ? "line-clamp-1 text-[10px] leading-3.5" : "text-sm leading-6"}`}>{alert.message}</div>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full border ${compact ? "px-1.5 py-0.5 text-[8px]" : "px-2.5 py-1 text-[11px]"} font-semibold ${severityClass}`}>
                    {alert.type}
                  </span>
                </div>
                <div className={`grid gap-0.5 text-xs text-slate-300 ${compact ? "mt-1 text-[10px]" : "mt-3"}`}>
                  {alert.object_label ? <div className={compact ? "truncate" : ""}>Objet : {alert.object_label}</div> : null}
                  <div className={compact ? "truncate" : ""}>Action : {alert.action_hint}</div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
