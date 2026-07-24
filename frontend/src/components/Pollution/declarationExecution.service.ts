import type {
  PollutionDeclarationCreateRequest,
  PollutionDeclarationEvaluateRequest,
  PollutionDeclarationEvaluationResponse,
  PollutionDeclarationResponse,
  PollutionDeclarationTransitionRequest,
} from "@/api/pollutionDeclarations";

import { buildPollutionDeclarationCreateRequest } from "./declarationDraft.mapper";
import type { PollutionDeclarationDraft } from "./declarationDraft.types";
import { validatePollutionDeclarationDraft } from "./declarationDraft.validation";
import type { DeclarationExecutionStep } from "./declarationExecution.types";
import type { DeclarationPoint } from "./declarationPoint.types";

export interface DeclarationExecutionDependencies {
  createDeclaration: (payload: PollutionDeclarationCreateRequest) => Promise<PollutionDeclarationResponse>;
  submitDeclaration: (params: {
    declarationId: string;
    payload?: PollutionDeclarationTransitionRequest;
  }) => Promise<PollutionDeclarationResponse>;
  evaluateDeclaration: (params: {
    declarationId: string;
    payload?: PollutionDeclarationEvaluateRequest;
  }) => Promise<PollutionDeclarationEvaluationResponse>;
  onStepChange?: (step: DeclarationExecutionStep, message?: string) => void;
}

export interface ExecuteDeclarationAnalysisParams {
  point: DeclarationPoint | null;
  draft: PollutionDeclarationDraft;
}

export class DeclarationExecutionValidationError extends Error {
  readonly code: "DECLARATION_POINT_REQUIRED" | "DECLARATION_INPUT_REQUIRED";

  constructor(code: "DECLARATION_POINT_REQUIRED" | "DECLARATION_INPUT_REQUIRED", message: string) {
    super(message);
    this.name = "DeclarationExecutionValidationError";
    this.code = code;
  }
}

export async function executeDeclarationAnalysis(
  params: ExecuteDeclarationAnalysisParams,
  dependencies: DeclarationExecutionDependencies
) {
  dependencies.onStepChange?.("validating", "Validation locale des entrees");

  if (!params.point) {
    throw new DeclarationExecutionValidationError(
      "DECLARATION_POINT_REQUIRED",
      "Selectionnez un point sur la carte ou renseignez ses coordonnees."
    );
  }

  const validation = validatePollutionDeclarationDraft(params.draft);
  if (!validation.isValid) {
    throw new DeclarationExecutionValidationError(
      "DECLARATION_INPUT_REQUIRED",
      "Completez les donnees de rejet et les conditions hydrologiques."
    );
  }

  const payload = buildPollutionDeclarationCreateRequest(params.point, params.draft);

  dependencies.onStepChange?.("creating", "Creation du dossier");
  const declaration = await dependencies.createDeclaration(payload);

  dependencies.onStepChange?.("submitting", "Soumission du dossier");
  const submitted = await dependencies.submitDeclaration({
    declarationId: declaration.declaration_id,
    payload: {
      reason: "Soumission depuis le cockpit Pollution integre",
    },
  });

  dependencies.onStepChange?.("evaluating", "Analyse topologique et scientifique en cours");
  const evaluation = await dependencies.evaluateDeclaration({
    declarationId: declaration.declaration_id,
    payload: {
      use_saved_values: true,
    },
  });

  dependencies.onStepChange?.("success", "Analyse terminee");

  return {
    declaration,
    submitted,
    evaluation,
  };
}
