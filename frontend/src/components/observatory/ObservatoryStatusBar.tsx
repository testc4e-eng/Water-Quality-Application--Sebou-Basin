import { Badge } from "@/components/ui/badge";

interface ObservatoryStatusBarProps {
  loading: boolean;
  error?: unknown;
  count?: number;
  source?: string;
  familyLabel?: string;
  parameterCode?: string;
}

export default function ObservatoryStatusBar({
  loading,
  error,
  count,
  source,
  familyLabel,
  parameterCode,
}: ObservatoryStatusBarProps) {
  return (
    <div className="rounded-xl border border-emerald-200/15 bg-slate-950/35 p-2 text-[11px] text-emerald-50/90">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-semibold">Statut observatoire V2</span>
        <Badge variant={error ? "destructive" : loading ? "secondary" : "default"}>
          {error ? "ERREUR" : loading ? "CHARGEMENT" : "PRET"}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-1 text-emerald-100/80">
        <span>Famille</span>
        <span className="truncate text-right">{familyLabel ?? "-"}</span>
        <span>Paramètre</span>
        <span className="truncate text-right">{parameterCode ?? "-"}</span>
        <span>Volume</span>
        <span className="text-right">{count === undefined ? "-" : count.toLocaleString("fr-MA")}</span>
        <span>Source</span>
        <span className="truncate text-right">{source ?? "-"}</span>
      </div>
    </div>
  );
}
