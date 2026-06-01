import { Eye } from "lucide-react";

import { QualityStatusBadge } from "@/components/quality-regulatory/QualityStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OBSERVATIONAL_PARAMETERS = [
  "H_P_A_TOTAUX",
  "HYDROCARBURES",
  "OXYDABILITE_KMNO4",
  "PESTICIDES_PAR_SUBST",
  "PESTICIDES_TOTAUX",
];

export function ObservationalParametersPanel() {
  return (
    <Card className="rounded-md border-amber-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base"><Eye className="h-4 w-4 text-amber-700" />Paramètres observationnels</CardTitle>
        <p className="text-sm text-slate-600">Stockables et analysables. Exclus de la qualité globale et des labels réglementaires ML.</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {OBSERVATIONAL_PARAMETERS.map((parameter) => (
          <div key={parameter} className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-amber-50 px-3 py-2">
            <span className="text-sm font-semibold text-slate-800">{parameter}</span>
            <QualityStatusBadge status="NON_CLASSIFIABLE" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
