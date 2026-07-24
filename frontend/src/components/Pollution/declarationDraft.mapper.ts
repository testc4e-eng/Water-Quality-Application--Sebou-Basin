import type { PollutionDeclarationCreateRequest } from "@/api/pollutionDeclarations";

import type { DeclarationPoint } from "./declarationPoint.types";
import type { PollutionDeclarationDraft } from "./declarationDraft.types";

function toFiniteNumber(value: string, fieldName: string) {
  const numericValue = Number(value.trim());
  if (!Number.isFinite(numericValue)) {
    throw new Error(`Valeur numerique invalide pour ${fieldName}.`);
  }
  return numericValue;
}

function toIsoDateTime(value: string) {
  const trimmed = value.trim();
  const date = trimmed ? new Date(trimmed) : new Date();
  if (Number.isNaN(date.getTime())) {
    throw new Error("Date de detection invalide.");
  }
  return date.toISOString();
}

export function buildPollutionDeclarationCreateRequest(
  point: DeclarationPoint,
  draft: PollutionDeclarationDraft
): PollutionDeclarationCreateRequest {
  const detectedAt = toIsoDateTime(draft.detectedAt);
  return {
    date_declaration: detectedAt,
    detected_at: detectedAt,
    point_declaration: {
      type: "Point",
      coordinates: [point.longitude, point.latitude],
    },
    polluant: "NH4",
    Crejet_mg_L: toFiniteNumber(draft.crejetMgL, "Crejet_mg_L"),
    QRejet_m3_s: toFiniteNumber(draft.qrejetM3s, "QRejet_m3_s"),
    QSebou_m3_s: toFiniteNumber(draft.qsebouM3s, "QSebou_m3_s"),
    QInnaouen_m3_s: toFiniteNumber(draft.qinnaouenM3s, "QInnaouen_m3_s"),
    QOuergha_m3_s: toFiniteNumber(draft.qouerghaM3s, "QOuergha_m3_s"),
    commentaire: draft.comment.trim() || undefined,
  };
}
