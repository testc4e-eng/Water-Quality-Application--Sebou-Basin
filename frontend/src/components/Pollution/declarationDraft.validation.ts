import type { PollutionDeclarationDraft } from "./declarationDraft.types";

export type DeclarationDraftField =
  | "pollutant"
  | "detectedAt"
  | "crejetMgL"
  | "qrejetM3s"
  | "qsebouM3s"
  | "qinnaouenM3s"
  | "qouerghaM3s";

export type DeclarationDraftErrors = Partial<Record<DeclarationDraftField, string>>;

export interface DeclarationDraftValidationResult {
  isValid: boolean;
  errors: DeclarationDraftErrors;
}

export const DECLARATION_DRAFT_MESSAGES = {
  pollutantUnsupported: "Seul NH4 est disponible dans cette version MVP.",
  detectedAtRequired: "La date et heure de detection sont obligatoires.",
  detectedAtInvalid: "La date et heure de detection sont invalides.",
  crejetRequired: "La concentration du rejet est obligatoire.",
  crejetPositive: "La concentration du rejet doit etre un nombre strictement positif.",
  qrejetRequired: "Le debit du rejet est obligatoire.",
  qrejetPositive: "Le debit du rejet doit etre un nombre strictement positif.",
  qsebouRequired: "Le debit du Sebou est obligatoire.",
  qsebouPositive: "Le debit du Sebou doit etre un nombre strictement positif.",
  qinnaouenRequired: "Le debit de l'Innaouen est obligatoire.",
  qinnaouenPositive: "Le debit de l'Innaouen doit etre un nombre strictement positif.",
  qouerghaRequired: "Le debit de l'Ouergha est obligatoire.",
  qouerghaPositive: "Le debit de l'Ouergha doit etre un nombre strictement positif.",
} as const;

function validateStrictlyPositiveNumber(value: string, requiredMessage: string, positiveMessage: string) {
  const trimmed = value.trim();
  if (trimmed === "") return requiredMessage;

  const numericValue = Number(trimmed);
  if (!Number.isFinite(numericValue) || numericValue <= 0) return positiveMessage;

  return undefined;
}

export function validatePollutionDeclarationDraft(
  draft: PollutionDeclarationDraft
): DeclarationDraftValidationResult {
  const errors: DeclarationDraftErrors = {};

  if (draft.pollutant !== "NH4") {
    errors.pollutant = DECLARATION_DRAFT_MESSAGES.pollutantUnsupported;
  }

  const detectedAt = draft.detectedAt.trim();
  if (!detectedAt) {
    errors.detectedAt = DECLARATION_DRAFT_MESSAGES.detectedAtRequired;
  } else if (Number.isNaN(new Date(detectedAt).getTime())) {
    errors.detectedAt = DECLARATION_DRAFT_MESSAGES.detectedAtInvalid;
  }

  errors.crejetMgL = validateStrictlyPositiveNumber(
    draft.crejetMgL,
    DECLARATION_DRAFT_MESSAGES.crejetRequired,
    DECLARATION_DRAFT_MESSAGES.crejetPositive
  );
  errors.qrejetM3s = validateStrictlyPositiveNumber(
    draft.qrejetM3s,
    DECLARATION_DRAFT_MESSAGES.qrejetRequired,
    DECLARATION_DRAFT_MESSAGES.qrejetPositive
  );
  errors.qsebouM3s = validateStrictlyPositiveNumber(
    draft.qsebouM3s,
    DECLARATION_DRAFT_MESSAGES.qsebouRequired,
    DECLARATION_DRAFT_MESSAGES.qsebouPositive
  );
  errors.qinnaouenM3s = validateStrictlyPositiveNumber(
    draft.qinnaouenM3s,
    DECLARATION_DRAFT_MESSAGES.qinnaouenRequired,
    DECLARATION_DRAFT_MESSAGES.qinnaouenPositive
  );
  errors.qouerghaM3s = validateStrictlyPositiveNumber(
    draft.qouerghaM3s,
    DECLARATION_DRAFT_MESSAGES.qouerghaRequired,
    DECLARATION_DRAFT_MESSAGES.qouerghaPositive
  );

  for (const key of Object.keys(errors) as DeclarationDraftField[]) {
    if (!errors[key]) {
      delete errors[key];
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function isDischargeDraftComplete(result: DeclarationDraftValidationResult) {
  return !result.errors.pollutant && !result.errors.crejetMgL && !result.errors.qrejetM3s;
}

export function isHydrologyDraftComplete(result: DeclarationDraftValidationResult) {
  return !result.errors.qsebouM3s && !result.errors.qinnaouenM3s && !result.errors.qouerghaM3s;
}
