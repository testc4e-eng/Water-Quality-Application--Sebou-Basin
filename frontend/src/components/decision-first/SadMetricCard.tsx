import { ArrowDownRight, ArrowRight, ArrowUpRight, LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { DecisionMetric } from "@/lib/decision-metrics";

interface SadMetricCardProps {
  metric: DecisionMetric;
  icon: LucideIcon;
}

const statusLabel: Record<DecisionMetric["status"], string> = {
  ready: "calculé",
  provisional: "mvp",
  dependency: "backend requis",
};

const trendIcon = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  stable: ArrowRight,
};

export function SadMetricCard({ metric, icon: Icon }: SadMetricCardProps) {
  const TrendIcon = metric.trend ? trendIcon[metric.trend] : null;

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{metric.label}</div>
            <div className="mt-3 text-3xl font-semibold text-slate-950">{metric.value}</div>
          </div>
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="rounded-full bg-slate-100 px-2 py-1 uppercase">{statusLabel[metric.status]}</span>
          {TrendIcon && <TrendIcon className="h-3.5 w-3.5" />}
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{metric.note}</p>
      </CardContent>
    </Card>
  );
}
