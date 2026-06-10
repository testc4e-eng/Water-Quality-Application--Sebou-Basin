import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DataAdminHealthSeverity, DataAdminHealthStatus } from "@/types/dataAdmin";

type DataHealthBadgeProps = {
  status: DataAdminHealthStatus | DataAdminHealthSeverity;
  title?: string;
};

const badgeClassByStatus: Record<string, string> = {
  ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  HEALTHY: "border-emerald-200 bg-emerald-50 text-emerald-700",
  EMPTY: "border-amber-200 bg-amber-50 text-amber-700",
  WARNING: "border-amber-200 bg-amber-50 text-amber-700",
  MISSING: "border-rose-200 bg-rose-50 text-rose-700",
  CRITICAL: "border-rose-200 bg-rose-50 text-rose-700",
};

export function DataHealthBadge({ status, title }: DataHealthBadgeProps) {
  return (
    <Badge
      variant="outline"
      title={title}
      className={cn("font-semibold uppercase tracking-[0.12em]", badgeClassByStatus[status] ?? badgeClassByStatus.WARNING)}
    >
      {status}
    </Badge>
  );
}
