import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type DashboardStatus =
  | "OPERATIONNEL"
  | "PARTIEL"
  | "PREPROD_CONDITIONNEL"
  | "DEV_PARTIAL"
  | "DEV"
  | "EN_CONSTRUCTION"
  | "LEGACY";

const STATUS_CLASSNAME: Record<DashboardStatus, string> = {
  OPERATIONNEL: "border-emerald-200 bg-emerald-50 text-emerald-700",
  PARTIEL: "border-amber-200 bg-amber-50 text-amber-800",
  PREPROD_CONDITIONNEL: "border-sky-200 bg-sky-50 text-sky-700",
  DEV_PARTIAL: "border-cyan-200 bg-cyan-50 text-cyan-700",
  DEV: "border-rose-200 bg-rose-50 text-rose-700",
  EN_CONSTRUCTION: "border-slate-200 bg-slate-100 text-slate-700",
  LEGACY: "border-violet-200 bg-violet-50 text-violet-700",
};

type StatusBadgeProps = {
  status: DashboardStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn("font-semibold", STATUS_CLASSNAME[status], className)}>
      {status}
    </Badge>
  );
}
