import { useMemo } from "react";

import type { RegulatoryThreshold } from "@/api/qualityRegulatory";
import { QualityStatusBadge } from "@/components/quality-regulatory/QualityStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QualityParametersTableProps {
  thresholds: RegulatoryThreshold[];
  version?: string | null;
}

export function QualityParametersTable({ thresholds, version }: QualityParametersTableProps) {
  const parameters = useMemo(() => {
    const byCode = new Map<string, RegulatoryThreshold>();
    thresholds.forEach((threshold) => byCode.set(threshold.code_reglementaire, threshold));
    return [...byCode.values()].sort((a, b) => a.code_reglementaire.localeCompare(b.code_reglementaire));
  }, [thresholds]);

  return (
    <Card className="rounded-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Paramètres réglementaires actifs</CardTitle>
        <p className="text-sm text-slate-500">Seuils actifs uniquement. Les seuils A_VALIDER et REJECTED ne sont pas chargés dans cette vue.</p>
      </CardHeader>
      <CardContent>
        <div className="max-h-[420px] overflow-auto rounded-md border">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="sticky top-0 bg-slate-100 text-xs text-slate-600">
              <tr>
                <th className="px-3 py-2">Code</th><th className="px-3 py-2">Libellé</th><th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Classifiable</th><th className="px-3 py-2">Statut</th><th className="px-3 py-2">Classe actuelle</th>
                <th className="px-3 py-2">Nombre seuils</th><th className="px-3 py-2">Version</th>
              </tr>
            </thead>
            <tbody>
              {parameters.map((parameter) => {
                const count = thresholds.filter((item) => item.code_reglementaire === parameter.code_reglementaire).length;
                return (
                  <tr key={parameter.code_reglementaire} className="border-t bg-white">
                    <td className="px-3 py-2 font-semibold">{parameter.code_reglementaire}</td>
                    <td className="px-3 py-2">{parameter.libelle_reglementaire}</td>
                    <td className="px-3 py-2 text-slate-600">{parameter.famille_parametre ?? "Non renseigné"}</td>
                    <td className="px-3 py-2">{parameter.classifiable ? "Oui" : "Non"}</td>
                    <td className="px-3 py-2"><QualityStatusBadge status={parameter.classifiable ? "CLASSIFIED" : "NON_CLASSIFIABLE"} /></td>
                    <td className="px-3 py-2 text-slate-500">Selon mesure</td>
                    <td className="px-3 py-2">{count}</td>
                    <td className="max-w-[180px] truncate px-3 py-2 text-xs text-slate-500" title={version ?? ""}>{version ?? "N/D"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
