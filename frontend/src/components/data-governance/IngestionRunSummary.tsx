import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DataAdminIngestionRunSummary } from "@/types/dataAdmin";

type IngestionRunSummaryProps = {
  run: DataAdminIngestionRunSummary | null;
};

export function IngestionRunSummary({ run }: IngestionRunSummaryProps) {
  if (!run) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-slate-500">
          Aucun run selectionne.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Synthese du run</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Classe</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">{run.class_code}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Statut</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">{run.run_status}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Lignes</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">{run.row_count}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Valides</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">{run.valid_row_count}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Erreurs</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">{run.error_row_count}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Warnings</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">{run.warning_count}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Fichier</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">{run.file_name}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Cree le</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">
            {new Date(run.created_at).toLocaleString("fr-MA")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
