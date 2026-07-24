import { describe, expect, it } from "vitest";

import { EMPTY_POLLUTION_DECLARATION_DRAFT } from "./declarationDraft.types";
import { NH4_MATRIX_DEMO_SCENARIOS } from "./declarationDemoScenarios";
import {
  DECLARATION_DRAFT_MESSAGES,
  validatePollutionDeclarationDraft,
} from "./declarationDraft.validation";

const DEMO_POLLUTION_DECLARATION_DRAFT = NH4_MATRIX_DEMO_SCENARIOS.sufficient.draft;

describe("validatePollutionDeclarationDraft", () => {
  it("rejects an empty draft", () => {
    const result = validatePollutionDeclarationDraft(EMPTY_POLLUTION_DECLARATION_DRAFT);

    expect(result.isValid).toBe(false);
    expect(result.errors.crejetMgL).toBe(DECLARATION_DRAFT_MESSAGES.crejetRequired);
    expect(result.errors.qrejetM3s).toBe(DECLARATION_DRAFT_MESSAGES.qrejetRequired);
    expect(result.errors.qsebouM3s).toBe(DECLARATION_DRAFT_MESSAGES.qsebouRequired);
    expect(result.errors.qinnaouenM3s).toBe(DECLARATION_DRAFT_MESSAGES.qinnaouenRequired);
    expect(result.errors.qouerghaM3s).toBe(DECLARATION_DRAFT_MESSAGES.qouerghaRequired);
  });

  it("rejects an invalid detection date", () => {
    const result = validatePollutionDeclarationDraft({
      ...DEMO_POLLUTION_DECLARATION_DRAFT,
      detectedAt: "not-a-date",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.detectedAt).toBe(DECLARATION_DRAFT_MESSAGES.detectedAtInvalid);
  });

  it("rejects invalid numeric values", () => {
    const result = validatePollutionDeclarationDraft({
      ...DEMO_POLLUTION_DECLARATION_DRAFT,
      crejetMgL: "abc",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.crejetMgL).toBe(DECLARATION_DRAFT_MESSAGES.crejetPositive);
  });

  it("rejects negative values", () => {
    const result = validatePollutionDeclarationDraft({
      ...DEMO_POLLUTION_DECLARATION_DRAFT,
      qrejetM3s: "-0.1",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.qrejetM3s).toBe(DECLARATION_DRAFT_MESSAGES.qrejetPositive);
  });

  it("rejects zero values because the backend create contract requires positive values", () => {
    const result = validatePollutionDeclarationDraft({
      ...DEMO_POLLUTION_DECLARATION_DRAFT,
      crejetMgL: "0",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.crejetMgL).toBe(DECLARATION_DRAFT_MESSAGES.crejetPositive);
  });

  it("accepts NH4 with valid positive values", () => {
    const result = validatePollutionDeclarationDraft(DEMO_POLLUTION_DECLARATION_DRAFT);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });
});
