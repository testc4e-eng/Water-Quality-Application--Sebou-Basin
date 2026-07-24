import type {
  PollutionDeclarationEvaluationResponse,
  PollutionDeclarationResponse,
} from "@/api/pollutionDeclarations";

export type DeclarationExecutionStep =
  | "idle"
  | "validating"
  | "creating"
  | "submitting"
  | "evaluating"
  | "success"
  | "error";

export interface DeclarationExecutionState {
  step: DeclarationExecutionStep;
  declarationId?: string;
  snapshotId?: string;
  message?: string;
}

export interface DeclarationExecutionError {
  code: string;
  title: string;
  message: string;
  userAction: string;
  step: DeclarationExecutionStep;
  technicalMessage?: string;
}

export interface DeclarationExecutionResult {
  declaration: PollutionDeclarationResponse;
  submitted: PollutionDeclarationResponse;
  evaluation: PollutionDeclarationEvaluationResponse;
}
