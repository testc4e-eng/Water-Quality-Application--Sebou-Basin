import { useRef, useState } from "react";

import type { PollutionDeclarationEvaluationResponse } from "@/api/pollutionDeclarations";
import { usePollutionDeclarations } from "@/hooks/usePollutionDeclarations";

import type { PollutionDeclarationDraft } from "./declarationDraft.types";
import { normalizeDeclarationExecutionError } from "./declarationExecution.errors";
import {
  executeDeclarationAnalysis,
  DeclarationExecutionValidationError,
} from "./declarationExecution.service";
import type {
  DeclarationExecutionError,
  DeclarationExecutionState,
} from "./declarationExecution.types";
import type { DeclarationPoint } from "./declarationPoint.types";

const INITIAL_EXECUTION_STATE: DeclarationExecutionState = {
  step: "idle",
};

function normalizeLocalValidationError(error: DeclarationExecutionValidationError): DeclarationExecutionError {
  return normalizeDeclarationExecutionError(
    {
      response: {
        data: {
          code: error.code,
          message: error.message,
          user_action: error.message,
        },
      },
    },
    "validating"
  );
}

export function useDeclarationExecution() {
  const [currentDeclarationId, setCurrentDeclarationId] = useState<string | null>(null);
  const [executionState, setExecutionState] = useState<DeclarationExecutionState>(INITIAL_EXECUTION_STATE);
  const [executionError, setExecutionError] = useState<DeclarationExecutionError | null>(null);
  const [currentEvaluation, setCurrentEvaluation] = useState<PollutionDeclarationEvaluationResponse | undefined>(undefined);
  const currentStepRef = useRef<DeclarationExecutionState["step"]>("idle");

  const { declarationQuery, createMutation, submitMutation, evaluateMutation } =
    usePollutionDeclarations(currentDeclarationId, {
      enableList: false,
      enableDetail: false,
      invalidateOnMutation: false,
    });

  const isRunning =
    executionState.step === "validating" ||
    executionState.step === "creating" ||
    executionState.step === "submitting" ||
    executionState.step === "evaluating";

  const runAnalysis = async (point: DeclarationPoint | null, draft: PollutionDeclarationDraft) => {
    setExecutionError(null);
    setCurrentEvaluation(undefined);
    currentStepRef.current = "validating";
    setExecutionState({ step: "validating", message: "Validation locale des entrees" });

    try {
      const result = await executeDeclarationAnalysis(
        { point, draft },
        {
          createDeclaration: createMutation.mutateAsync,
          submitDeclaration: submitMutation.mutateAsync,
          evaluateDeclaration: evaluateMutation.mutateAsync,
          onStepChange: (step, message) => {
            currentStepRef.current = step;
            setExecutionState((previous) => ({
              step,
              declarationId: previous.declarationId,
              snapshotId: previous.snapshotId,
              message,
            }));
          },
        }
      );

      setCurrentDeclarationId(result.declaration.declaration_id);
      setCurrentEvaluation(result.evaluation);
      setExecutionState({
        step: "success",
        declarationId: result.declaration.declaration_id,
        snapshotId: result.evaluation.snapshot_id,
        message: "Analyse terminee",
      });

      return result;
    } catch (error) {
      const normalizedError =
        error instanceof DeclarationExecutionValidationError
          ? normalizeLocalValidationError(error)
          : normalizeDeclarationExecutionError(
              error,
              currentStepRef.current === "idle" ? "error" : currentStepRef.current
            );

      setExecutionError(normalizedError);
      setExecutionState((previous) => ({
        step: "error",
        declarationId: previous.declarationId,
        snapshotId: previous.snapshotId,
        message: normalizedError.title,
      }));
      throw normalizedError;
    }
  };

  return {
    currentDeclarationId,
    currentDeclaration: declarationQuery.data ?? createMutation.data ?? null,
    currentEvaluation,
    executionState,
    executionError,
    isRunning,
    runAnalysis,
    resetExecution: () => {
      setCurrentDeclarationId(null);
      setCurrentEvaluation(undefined);
      setExecutionError(null);
      currentStepRef.current = "idle";
      setExecutionState(INITIAL_EXECUTION_STATE);
    },
  };
}
