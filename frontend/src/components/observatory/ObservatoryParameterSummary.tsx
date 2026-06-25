import type { QualiteExposureRecord } from "@/types/qualite";

interface ObservatoryParameterSummaryProps {
  rows: QualiteExposureRecord[];
}

export default function ObservatoryParameterSummary({ rows }: ObservatoryParameterSummaryProps) {
  const values = rows
    .map((row) => row.valeur_num)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));

  if (!values.length) {
    return (
      <div className="rounded-xl border border-emerald-200/15 bg-slate-950/25 p-2 text-[11px] text-emerald-100/75">
        Aucune statistique disponible pour la sélection.
      </div>
    );
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((total, value) => total + value, 0) / values.length;

  return (
    <div className="grid grid-cols-3 gap-1 text-[11px] text-emerald-50">
      <div className="rounded-lg border border-emerald-200/15 bg-slate-950/35 p-2">
        <div className="text-emerald-100/70">Min</div>
        <div className="font-semibold">{min.toFixed(3)}</div>
      </div>
      <div className="rounded-lg border border-emerald-200/15 bg-slate-950/35 p-2">
        <div className="text-emerald-100/70">Moy</div>
        <div className="font-semibold">{avg.toFixed(3)}</div>
      </div>
      <div className="rounded-lg border border-emerald-200/15 bg-slate-950/35 p-2">
        <div className="text-emerald-100/70">Max</div>
        <div className="font-semibold">{max.toFixed(3)}</div>
      </div>
    </div>
  );
}
