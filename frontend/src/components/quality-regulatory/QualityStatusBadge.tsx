import { Badge } from "@/components/ui/badge";

export function QualityStatusBadge({ status }: { status?: string }) {
  const value = status ?? "NON_CLASSIFIABLE";
  const className =
    value === "CLASSIFIED"
      ? "bg-emerald-100 text-emerald-900 hover:bg-emerald-100"
      : value === "NON_CLASSIFIABLE" || value === "HORS_PERIMETRE_REGLEMENTAIRE"
        ? "bg-amber-100 text-amber-900 hover:bg-amber-100"
        : value === "TYPE_EAU_NON_OPERATIONNEL" || value === "PARAMETRE_NON_REGLEMENTAIRE"
          ? "bg-red-100 text-red-900 hover:bg-red-100"
          : "bg-slate-100 text-slate-700 hover:bg-slate-100";

  return <Badge className={className}>{value}</Badge>;
}
