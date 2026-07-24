import { describe, expect, it } from "vitest";

import { buildPollutionDeclarationCreateRequest } from "./declarationDraft.mapper";
import { NH4_MATRIX_DEMO_SCENARIOS } from "./declarationDemoScenarios";
import type { DeclarationPoint } from "./declarationPoint.types";

const DEMO_POLLUTION_DECLARATION_DRAFT = NH4_MATRIX_DEMO_SCENARIOS.sufficient.draft;
const EXPECTED_DETECTED_AT = new Date(DEMO_POLLUTION_DECLARATION_DRAFT.detectedAt).toISOString();

const POINT: DeclarationPoint = {
  longitude: -4.908418523493339,
  latitude: 34.16528818110318,
  source: "preset",
};

describe("buildPollutionDeclarationCreateRequest", () => {
  it("maps a complete draft to the API create request", () => {
    const payload = buildPollutionDeclarationCreateRequest(POINT, DEMO_POLLUTION_DECLARATION_DRAFT);

    expect(payload.point_declaration).toEqual({
      type: "Point",
      coordinates: [-4.908418523493339, 34.16528818110318],
    });
    expect(payload.date_declaration).toBe(EXPECTED_DETECTED_AT);
    expect(payload.detected_at).toBe(EXPECTED_DETECTED_AT);
    expect(payload.polluant).toBe("NH4");
    expect(payload.Crejet_mg_L).toBe(100);
    expect(payload.QRejet_m3_s).toBe(0.055555556);
    expect(payload.QSebou_m3_s).toBe(7.5);
    expect(payload.QInnaouen_m3_s).toBe(10);
    expect(payload.QOuergha_m3_s).toBe(10);
    expect(payload.commentaire).toBe(DEMO_POLLUTION_DECLARATION_DRAFT.comment);
    expect(Number.isNaN(payload.Crejet_mg_L)).toBe(false);
  });

  it("maps an empty comment to undefined", () => {
    const payload = buildPollutionDeclarationCreateRequest(POINT, {
      ...DEMO_POLLUTION_DECLARATION_DRAFT,
      comment: "   ",
    });

    expect(payload.commentaire).toBeUndefined();
  });

  it("throws before producing NaN values", () => {
    expect(() =>
      buildPollutionDeclarationCreateRequest(POINT, {
        ...DEMO_POLLUTION_DECLARATION_DRAFT,
        qsebouM3s: "not-a-number",
      })
    ).toThrow("Valeur numerique invalide pour QSebou_m3_s.");
  });

  it("throws on invalid detection date", () => {
    expect(() =>
      buildPollutionDeclarationCreateRequest(POINT, {
        ...DEMO_POLLUTION_DECLARATION_DRAFT,
        detectedAt: "not-a-date",
      })
    ).toThrow("Date de detection invalide.");
  });
});
