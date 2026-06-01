import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { RegulatoryStatusResponse } from "@/api/qualityRegulatory";

export function RegulatoryHeader({ status }: { status?: RegulatoryStatusResponse }) {
  const summary = status?.summary ?? {};
  const excluded = (summary.thresholds ?? 0) - (summary.thresholds_active ?? 0);

  return (
    <section className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
            <ShieldCheck className="h-4 w-4" />
            Référentiel réglementaire officiel SAD
          </div>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">Qualité Réglementaire</h1>
          <p className="mt-1 text-sm text-slate-600">
            Tableau n°1 eaux de surface. Les grilles simplifiées restent documentaires et non opérationnelles.
          </p>
        </div>
        <Badge className="w-fit bg-amber-100 text-amber-900 hover:bg-amber-100">
          PREPROD_READY_CONDITIONNEL
        </Badge>
      </div>
      <div className="mx-auto mt-4 grid max-w-[1600px] gap-2 sm:grid-cols-2 xl:grid-cols-6">
        <HeaderMetric label="Version" value={status?.version_reglementaire ?? "Chargement..."} />
        <HeaderMetric label="Type d'eau" value="surface_generale" />
        <HeaderMetric label="Paramètres" value={summary.parameters ?? "..."} />
        <HeaderMetric label="Classifiables" value={summary.parameters_classifiable ?? "..."} />
        <HeaderMetric label="Seuils actifs" value={summary.thresholds_active ?? "..."} />
        <HeaderMetric label="Seuils exclus" value={excluded || "..."} />
      </div>
    </section>
  );
}

function HeaderMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="min-w-0 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-900" title={String(value)}>{value}</p>
    </div>
  );
}
