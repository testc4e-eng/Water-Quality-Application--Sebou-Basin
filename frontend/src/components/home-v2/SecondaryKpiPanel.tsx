import { Compass, Database, Droplets, ShieldCheck, ShieldEllipsis, Siren } from "lucide-react";

import type { DashboardHomeSecondaryKpis, DashboardHomeSecondaryKpiItem } from "@/api/dashboardHome";
import { KpiTooltip } from "@/components/home-v2/KpiTooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPI_DEFINITIONS, type KpiDefinitionKey } from "@/lib/kpi-definitions";

interface SecondaryKpiPanelProps {
  kpis: DashboardHomeSecondaryKpis;
  compact?: boolean;
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

export function SecondaryKpiPanel({ kpis, compact = false }: SecondaryKpiPanelProps) {
  const entries = Object.entries(kpis) as [keyof DashboardHomeSecondaryKpis, DashboardHomeSecondaryKpiItem][];

  return (
    <Card className="rounded-[24px] border-slate-200 bg-white shadow-sm">
      <CardHeader className={compact ? "pb-1 pt-3" : "pb-1.5"}>
        <CardTitle className={compact ? "text-sm font-semibold uppercase tracking-[0.08em] text-slate-900" : "text-base font-semibold uppercase tracking-[0.08em] text-slate-900"}>
          État global du bassin
        </CardTitle>
      </CardHeader>
      <CardContent className={compact ? "grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"}>
        {entries.map(([key, item]) => {
          const meta = KPI_META[key];
          const Icon = meta.icon;
          const statusClass = STATUS_CLASS[item.status] ?? STATUS_CLASS.UNKNOWN;
          const info = KPI_DEFINITIONS[key as KpiDefinitionKey];
          return (
            <div key={key} className={compact ? "rounded-[18px] border border-slate-200 bg-white p-2 shadow-sm" : "rounded-[20px] border border-slate-200 bg-white p-2.5 shadow-sm"}>
              <div className="flex items-start justify-between gap-3">
                <div className={`flex ${compact ? "h-7 w-7 rounded-xl" : "h-8 w-8 rounded-2xl"} items-center justify-center ${meta.accent}`}>
                  <Icon className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
                </div>
                <span className={`rounded-full border ${compact ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]"} font-semibold ${statusClass}`}>
                  {meta.badge}
                </span>
              </div>
              <div className={`${compact ? "mt-1.5" : "mt-2"} flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500`}>
                <span>{key.toUpperCase()}</span>
                {info ? (
                  <KpiTooltip
                    title={info.title}
                    definition={info.definition}
                    calculation={info.calculation}
                    interpretation={info.interpretation}
                  />
                ) : null}
              </div>
              <div className="mt-0.5 flex items-end gap-1">
                <div className={compact ? "text-[1.25rem] font-semibold text-slate-950" : "text-[1.75rem] font-semibold text-slate-950"}>{item.value ?? "N/D"}</div>
                <div className="pb-0.5 text-[10px] font-medium text-slate-500">/100</div>
              </div>
              <div className={compact ? "mt-0.5 truncate text-[11px] font-medium text-slate-700" : "mt-1 text-sm font-medium text-slate-700"}>{item.label}</div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
