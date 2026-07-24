import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";

import { getDeclarationReport, type PollutionDeclarationEvaluationResponse, type PollutionDeclarationReportResponse } from "@/api/pollutionDeclarations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DeclarationReportPanelProps {
  evaluation: PollutionDeclarationEvaluationResponse;
}

export default function DeclarationReportPanel({ evaluation }: DeclarationReportPanelProps) {
  const [report, setReport] = useState<PollutionDeclarationReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReport = async () => {
    setLoading(true);
    setError(null);
    try {
      setReport(await getDeclarationReport(evaluation.declaration_id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rapport indisponible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base text-slate-950">
            <FileText className="h-5 w-5 text-blue-700" />
            Rapport
          </CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={loadReport} disabled={loading || !evaluation.report_available}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Charger le rapport
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div>Dossier : {evaluation.declaration_id}</div>
          <div>Snapshot : {evaluation.snapshot_id}</div>
          <div>Rapport disponible : {evaluation.report_available ? "oui" : "non"}</div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-900">
            {error}
          </div>
        )}

        {report && (
          <div className="space-y-3">
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-green-950">
              Rapport {report.report_id} genere le {new Date(report.generated_at).toLocaleString("fr-MA")}.
            </div>
            <pre className="max-h-[360px] overflow-auto rounded-xl border border-slate-200 bg-slate-950 p-4 text-xs leading-5 text-slate-50">
              {JSON.stringify(report.report_payload, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
