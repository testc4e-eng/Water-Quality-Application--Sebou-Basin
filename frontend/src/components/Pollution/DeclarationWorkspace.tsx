import {
  Activity,
  AlertCircle,
  CheckCircle2,
  FlaskConical,
} from "lucide-react";

import type { PollutionDeclarationEvaluationResponse } from "@/api/pollutionDeclarations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeclarationAnalysisPanel from "./DeclarationAnalysisPanel";
import DeclarationDischargePanel from "./DeclarationDischargePanel";
import DeclarationHydrologyPanel from "./DeclarationHydrologyPanel";
import DeclarationPointSelector from "./DeclarationPointSelector";
import type { PollutionDeclarationDraft } from "./declarationDraft.types";
import {
  isDischargeDraftComplete,
  isHydrologyDraftComplete,
  validatePollutionDeclarationDraft,
} from "./declarationDraft.validation";
import { NH4_MATRIX_DEMO_SCENARIOS, type DeclarationDemoScenarioId } from "./declarationDemoScenarios";
import type { DeclarationPoint } from "./declarationPoint.types";
import { useDeclarationExecution } from "./useDeclarationExecution";

interface DeclarationWorkspaceProps {
  declarationPoint: DeclarationPoint | null;
  onDeclarationPointChange: (point: DeclarationPoint | null) => void;
  declarationDraft: PollutionDeclarationDraft;
  onDeclarationDraftChange: (draft: PollutionDeclarationDraft) => void;
  onEvaluationChange?: (evaluation: PollutionDeclarationEvaluationResponse | null) => void;
  isMapPickingActive: boolean;
  onStartMapPicking: () => void;
  onCancelMapPicking: () => void;
}

function CompletionItem({ label, complete }: { label: string; complete: boolean }) {
  const Icon = complete ? CheckCircle2 : AlertCircle;
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
      <span className="text-slate-600">{label}</span>
      <span className={complete ? "flex items-center gap-2 font-semibold text-green-700" : "flex items-center gap-2 font-semibold text-amber-700"}>
        <Icon className="h-4 w-4" />
        {complete ? "Renseigne" : "Manquant"}
      </span>
    </div>
  );
}

export default function DeclarationWorkspace({
  declarationPoint,
  onDeclarationPointChange,
  declarationDraft,
  onDeclarationDraftChange,
  onEvaluationChange,
  isMapPickingActive,
  onStartMapPicking,
  onCancelMapPicking,
}: DeclarationWorkspaceProps) {
  const draftValidation = validatePollutionDeclarationDraft(declarationDraft);
  const dischargeComplete = isDischargeDraftComplete(draftValidation);
  const hydrologyComplete = isHydrologyDraftComplete(draftValidation);
  const {
    currentEvaluation,
    executionState,
    executionError,
    isRunning,
    runAnalysis,
    resetExecution,
  } = useDeclarationExecution();

  const canRunAnalysis = Boolean(declarationPoint) && draftValidation.isValid;
  const missingReason = !declarationPoint
    ? "Selectionnez un point de detection avant de lancer l'analyse."
    : !draftValidation.isValid
      ? "Completez les donnees de rejet et les conditions hydrologiques avant de lancer l'analyse."
      : undefined;

  const handleLoadDemoScenario = (scenarioId: DeclarationDemoScenarioId) => {
    const scenario = NH4_MATRIX_DEMO_SCENARIOS[scenarioId];
    onCancelMapPicking();
    onDeclarationPointChange(scenario.point);
    onDeclarationDraftChange(scenario.draft);
    resetExecution();
    onEvaluationChange?.(null);
  };

  const handleRunAnalysis = async () => {
    try {
      const result = await runAnalysis(declarationPoint, declarationDraft);
      onEvaluationChange?.(result.evaluation);
    } catch {
      // Error state is normalized and displayed by DeclarationAnalysisPanel.
    }
  };

  const matrix = currentEvaluation?.matrix_result;
  const confidence = matrix?.confidence_level ?? currentEvaluation?.topology_result?.confidence_level ?? "A evaluer";

  return (
    <section className="space-y-5" aria-labelledby="declaration-workspace-title">
      <Card className="border-slate-200">
        <CardHeader>
          <div>
            <CardTitle id="declaration-workspace-title" className="text-xl text-slate-950">
              Declaration de pollution
            </CardTitle>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Localisez le point detecte, renseignez les donnees de rejet et lancez l'analyse officielle.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
            {currentEvaluation ? (
              <>
                Analyse backend terminee. Snapshot : {currentEvaluation.snapshot_id}. Confiance : {confidence}.
              </>
            ) : executionState.step === "error" ? (
              <>Analyse non aboutie. Derniere erreur : {executionError?.code ?? "inconnue"}.</>
            ) : (
              <>Aucune analyse n'a encore ete lancee pour cette declaration.</>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base text-slate-950">Assistant Declaration d'incident</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => handleLoadDemoScenario("sufficient")} disabled={isRunning}>
                  Charger scenario matrice suffisant
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => handleLoadDemoScenario("risk")} disabled={isRunning}>
                  Charger scenario matrice a risque
                </Button>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Scenarios exacts issus de la matrice NH4 v1, au point source avant la station Dar El Arsa.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Etape 1
                </div>
                <DeclarationPointSelector
                  declarationPoint={declarationPoint}
                  onDeclarationPointChange={onDeclarationPointChange}
                  isMapPickingActive={isMapPickingActive}
                  onStartMapPicking={onStartMapPicking}
                  onCancelMapPicking={onCancelMapPicking}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <FlaskConical className="h-4 w-4" />
                  Etape 2
                </div>
                <DeclarationDischargePanel
                  draft={declarationDraft}
                  errors={draftValidation.errors}
                  onChange={onDeclarationDraftChange}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <Activity className="h-4 w-4" />
                  Etape 3
                </div>
                <DeclarationHydrologyPanel
                  draft={declarationDraft}
                  errors={draftValidation.errors}
                  onChange={onDeclarationDraftChange}
                />
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Etape 4
                </div>
                <DeclarationAnalysisPanel
                  canRun={canRunAnalysis}
                  isRunning={isRunning}
                  executionState={executionState}
                  executionError={executionError}
                  evaluation={currentEvaluation}
                  missingReason={missingReason}
                  onRun={handleRunAnalysis}
                />
              </div>

            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base text-slate-950">Qualite et completude des donnees</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <CompletionItem label="Point de detection" complete={Boolean(declarationPoint)} />
            <CompletionItem label="Donnees de rejet" complete={dischargeComplete} />
            <CompletionItem label="Contexte hydrologique" complete={hydrologyComplete} />

            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-700">
              <div className="font-semibold text-slate-950">Donnees utilisees</div>
              <div className="mt-2 grid gap-1">
                <div>Point : {currentEvaluation ? "snappe par le backend" : "declare, non analyse"}</div>
                <div>Matrice : {matrix?.matrix_version ?? "prototype"}</div>
                <div>Methode : {matrix?.method_used ?? "non evaluee"}</div>
                <div>Snapshot : {currentEvaluation?.snapshot_id ?? "non cree"}</div>
                <div>Confiance : {confidence}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
