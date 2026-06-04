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
    <Card className="rounded-[28px] border-[#17396f] bg-[linear-gradient(180deg,#0B2248_0%,#102D5C_100%)] text-white shadow-[0_24px_60px_rgba(7,30,65,0.18)]">
      <CardHeader className={compact ? "pb-3" : "pb-4"}>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-xl text-white">
            <AlertTriangle className="h-5 w-5 text-rose-300" />
            Alertes ouvertes
          </CardTitle>
          <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white">{alerts.length}</div>
        </div>
      </CardHeader>
      <CardContent className={compact ? "max-h-[320px] space-y-2 overflow-y-auto pr-1" : "space-y-3"}>
        {alerts.length === 0 ? (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-50">
            Aucune alerte prioritaire à afficher. Le bassin reste sous surveillance normale au niveau de l’accueil.
          </div>
        ) : (
          alerts.slice(0, maxVisible).map((alert) => {
            const Icon = TYPE_ICON[alert.type as keyof typeof TYPE_ICON] ?? AlertTriangle;
            const severityClass = SEVERITY_CLASS[alert.severity as keyof typeof SEVERITY_CLASS] ?? SEVERITY_CLASS.INFO;
            return (
              <div key={alert.id} className={`rounded-2xl border border-white/10 bg-white/5 ${compact ? "p-3" : "p-4"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex items-center justify-center rounded-xl bg-white/10 text-white shadow-sm ${compact ? "h-8 w-8" : "h-9 w-9"}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{alert.title}</div>
                      <div className={`mt-1 text-slate-200 ${compact ? "line-clamp-2 text-xs leading-5" : "text-sm leading-6"}`}>{alert.message}</div>
                    </div>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${severityClass}`}>
                    {alert.type}
                  </span>
                </div>
                <div className={`grid gap-1.5 text-xs text-slate-300 ${compact ? "mt-2" : "mt-3"}`}>
                  {alert.object_label ? <div>Objet : {alert.object_label}</div> : null}
                  <div>Action : {alert.action_hint}</div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
