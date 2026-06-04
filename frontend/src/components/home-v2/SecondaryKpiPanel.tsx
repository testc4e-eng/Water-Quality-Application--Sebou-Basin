import { Compass, Database, Droplets, ShieldCheck, ShieldEllipsis, Siren } from "lucide-react";

import type { DashboardHomeSecondaryKpis, DashboardHomeSecondaryKpiItem } from "@/api/dashboardHome";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SecondaryKpiPanelProps {
  kpis: DashboardHomeSecondaryKpis;
}

const KPI_META = {
  iqgb: { icon: ShieldCheck, accent: "text-emerald-700 bg-emerald-50", badge: "Bon" },
  ifd: { icon: Database, accent: "text-amber-700 bg-amber-50", badge: "Moyen" },
  icd: { icon: ShieldEllipsis, accent: "text-cyan-700 bg-cyan-50", badge: "Bon" },
  ich: { icon: Droplets, accent: "text-blue-700 bg-blue-50", badge: "Excellent" },
  ipp: { icon: Siren, accent: "text-orange-700 bg-orange-50", badge: "Élevé" },
  isr: { icon: Compass, accent: "text-violet-700 bg-violet-50", badge: "Moyen" },
} as const;

const STATUS_CLASS = {
  OK: "text-emerald-700 bg-emerald-50 border-emerald-200",
  SURVEILLANCE: "text-amber-700 bg-amber-50 border-amber-200",
  CRITIQUE: "text-rose-700 bg-rose-50 border-rose-200",
  UNKNOWN: "text-slate-700 bg-slate-50 border-slate-200",
} as const;

export function SecondaryKpiPanel({ kpis }: SecondaryKpiPanelProps) {
  const entries = Object.entries(kpis) as [keyof DashboardHomeSecondaryKpis, DashboardHomeSecondaryKpiItem][];

  return (
    <Card className="rounded-[28px] border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold uppercase tracking-[0.08em] text-slate-900">État global du bassin</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {entries.map(([key, item]) => {
          const meta = KPI_META[key];
          const Icon = meta.icon;
          const statusClass = STATUS_CLASS[item.status] ?? STATUS_CLASS.UNKNOWN;
          return (
            <div key={key} className="rounded-[24px] border border-slate-200 bg-white p-3.5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${meta.accent}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass}`}>
                  {meta.badge}
                </span>
              </div>
              <div className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{key.toUpperCase()}</div>
              <div className="mt-2 flex items-end gap-1">
                <div className="text-3xl font-semibold text-slate-950">{item.value ?? "N/D"}</div>
                <div className="pb-1 text-sm font-medium text-slate-500">/100</div>
              </div>
              <div className="mt-2 text-sm font-medium text-slate-700">{item.label}</div>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{item.description}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
