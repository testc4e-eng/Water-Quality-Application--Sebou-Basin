import { AlertTriangle, CheckCircle2, Loader2, PlayCircle } from "lucide-react";

import type { PollutionDeclarationEvaluationResponse } from "@/api/pollutionDeclarations";
import { Button } from "@/components/ui/button";

import type { DeclarationExecutionError, DeclarationExecutionState } from "./declarationExecution.types";

interface DeclarationAnalysisPanelProps {
  canRun: boolean;
  isRunning: boolean;
  executionState: DeclarationExecutionState;
  executionError: DeclarationExecutionError | null;
  evaluation?: PollutionDeclarationEvaluationResponse;
  missingReason?: string;
  onRun: () => void;
}

const STEP_LABELS: Record<DeclarationExecutionState["step"], string> = {
  idle: "Analyse non lancee",
  validating: "Validation locale",
  creating: "Creation du dossier",
  submitting: "Soumission du dossier",
  evaluating: "Analyse topologique et scientifique en cours",
  success: "Analyse terminee",
  error: "Analyse bloquee",
};

export default function DeclarationAnalysisPanel({
  canRun,
  isRunning,
  executionState,
  executionError,
  evaluation,
  missingReason,
  onRun,
}: DeclarationAnalysisPanelProps) {
  const uniqueWarnings = evaluation ? Array.from(new Set(evaluation.warnings.filter(Boolean))) : [];

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
          <PlayCircle className="h-4 w-4 text-blue-700" />
          Lancer l'analyse
        </div>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          La sequence officielle cree le dossier, le soumet puis lance l'evaluation backend.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-600">Etat courant</span>
          <span className="font-semibold text-slate-950">{STEP_LABELS[executionState.step]}</span>
        </div>
        {executionState.message && <p className="mt-2 text-slate-600">{executionState.message}</p>}
      </div>

      {isRunning && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm leading-6 text-blue-950">
          <div className="flex items-center gap-2 font-semibold">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyse en cours
          </div>
          <div className="mt-2">Creation du dossier</div>
          <div>Soumission du dossier</div>
          <div>Analyse topologique et scientifique en cours</div>
        </div>
      )}

      {executionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-4 w-4" />
            {executionError.title}
          </div>
          <p className="mt-2 leading-6">{executionError.message}</p>
          <p className="mt-2 leading-6">
            <span className="font-semibold">Action recommandee : </span>
            {executionError.userAction}
          </p>
          <details className="mt-3 text-xs text-red-800">
            <summary className="cursor-pointer font-semibold">Detail technique</summary>
            <div className="mt-2">Code : {executionError.code}</div>
            <div>Etape : {STEP_LABELS[executionError.step]}</div>
            {executionError.technicalMessage && <div>Message : {executionError.technicalMessage}</div>}
          </details>
        </div>
      )}

      {evaluation && executionState.step === "success" && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-950">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            Analyse terminee
          </div>
          <div className="mt-2 grid gap-2">
            <div>Dossier : {evaluation.declaration_id}</div>
            <div>Snapshot : {evaluation.snapshot_id}</div>
            <div>Statut backend : {evaluation.status}</div>
            <div>Rapport disponible : {evaluation.report_available ? "Oui" : "Non"}</div>
          </div>
          {uniqueWarnings.length > 0 && (
            <div className="mt-3 rounded border border-amber-200 bg-amber-50 p-2 text-amber-900">
              Warnings : {uniqueWarnings.join(" | ")}
            </div>
          )}
        </div>
      )}

      {!canRun && missingReason && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {missingReason}
        </div>
      )}

      <Button type="button" onClick={onRun} disabled={!canRun || isRunning} className="w-full">
        {isRunning ? "Analyse en cours..." : "Lancer l'analyse"}
      </Button>
    </div>
  );
}
