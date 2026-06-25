import { cn } from "@/lib/utils";

export type QaStatus = "VALID" | "FLAGGED" | "OUTLIER" | "MISSING";

const qaClasses: Record<QaStatus, string> = {
  VALID: "border-emerald-200 bg-emerald-50 text-emerald-700",
  FLAGGED: "border-amber-200 bg-amber-50 text-amber-700",
  OUTLIER: "border-rose-200 bg-rose-50 text-rose-700",
  MISSING: "border-slate-200 bg-slate-100 text-slate-600",
};

export function QaBadge({ status, className }: { status: QaStatus; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold", qaClasses[status], className)}>
      {status}
    </span>
  );
}
