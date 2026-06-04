import { Clock3, DatabaseZap, TriangleAlert } from "lucide-react";

import type { DashboardHomeFreshnessItem } from "@/api/dashboardHome";

interface DataFreshnessBadgeProps {
  freshness: DashboardHomeFreshnessItem;
  compact?: boolean;
}

const STATUS_META = {
  FRESH: {
    label: "FRESH",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: DatabaseZap,
  },
  STALE: {
    label: "STALE",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: Clock3,
  },
  MISSING: {
    label: "MISSING",
    className: "border-rose-200 bg-rose-50 text-rose-700",
    icon: TriangleAlert,
  },
} as const;

export function DataFreshnessBadge({ freshness, compact = false }: DataFreshnessBadgeProps) {
  const meta = STATUS_META[freshness.status] ?? STATUS_META.MISSING;
  const Icon = meta.icon;

  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
        meta.className,
      ].join(" ")}
      title={freshness.note}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{meta.label}</span>
      {!compact && freshness.age_days !== null ? <span>· {freshness.age_days} j</span> : null}
    </div>
  );
}
