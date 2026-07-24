import { describe, expect, it, vi } from "vitest";

import type { PollutionDeclarationEvaluationResponse, PollutionDeclarationResponse } from "@/api/pollutionDeclarations";

import { EMPTY_POLLUTION_DECLARATION_DRAFT } from "./declarationDraft.types";
import { NH4_MATRIX_DEMO_SCENARIOS } from "./declarationDemoScenarios";
import {
  DeclarationExecutionValidationError,
  executeDeclarationAnalysis,
} from "./declarationExecution.service";
import type { DeclarationPoint } from "./declarationPoint.types";

const DEMO_POLLUTION_DECLARATION_DRAFT = NH4_MATRIX_DEMO_SCENARIOS.sufficient.draft;
const EXPECTED_DETECTED_AT = new Date(DEMO_POLLUTION_DECLARATION_DRAFT.detectedAt).toISOString();

const POINT: DeclarationPoint = {
  longitude: -4.908418523493339,
  latitude: 34.16528818110318,
  source: "preset",
};

function declaration(status = "BROUILLON"): PollutionDeclarationResponse {
  return {
    declaration_id: "decl-1",
    reference: "DP-1",
    status: status as PollutionDeclarationResponse["status"],
    date_declaration: "2026-07-10T12:00:00.000Z",
    point_declaration: { type: "Point", coordinates: [POINT.longitude, POINT.latitude] },
    polluant: "NH4",
    Crejet_mg_L: 100,
    QRejet_m3_s: 0.055555556,
    QSebou_m3_s: 7.5,
    QInnaouen_m3_s: 10,
    QOuergha_m3_s: 10,
    commentaire: null,
    report_available: false,
    detected_at: EXPECTED_DETECTED_AT,
    created_at: "2026-07-10T12:00:00.000Z",
    updated_at: "2026-07-10T12:00:00.000Z",
    transitions: [],
  };
}

function evaluation(): PollutionDeclarationEvaluationResponse {
  return {
    declaration_id: "decl-1",
    status: "RISQUE_FAIBLE",
    snapshot_id: "snap-1",
    topology_result: {
      barrage_garde_atteint: true,
      sidi_allal_tazi_detectee: true,
    },
    matrix_result: {
      matrix_id: "NH4_DAR_EL_ARSSA",
      matrix_version: "1.0.0",
      scenario_id: "SC_QR01_C01_QS01_QI01_QO01",
      exact_match: true,
      pollutant: "NH4",
      C_SidiAllalTazi_mg_L: 0.035751168,
      C_BgGarde_mg_L: 0.046694335,
      statut_sidi_allal_tazi: "A_VALIDER",
      statut_bg_garde: "A_VALIDER",
      statut_global: "SUFFISANT",
      out_of_domain: false,
      confidence_level: "HIGH",
      method_used: "EXACT_MATCH",
    },
    risk_result: {
      risk_level: "LOW",
      status: "RISQUE_FAIBLE",
    },
    recommendations: [],
    decision_reasoning: null,
    warnings: [],
    errors: [],
    report_available: true,
    travel_time_result: {
      reference_id: "TC_STATIONS_V1",
      reference_version: "1.0.0",
      reference_time: EXPECTED_DETECTED_AT,
      targets: [
        {
          target_station_code: "1355/8",
          travel_time_h: 78.32,
          estimated_arrival_at: "2026-07-18T14:49:12.000Z",
        },
      ],
      warnings: [],
    },
  };
}

function dependencies() {
  return {
    createDeclaration: vi.fn().mockResolvedValue(declaration("BROUILLON")),
    submitDeclaration: vi.fn().mockResolvedValue(declaration("PRET_A_ANALYSER")),
    evaluateDeclaration: vi.fn().mockResolvedValue(evaluation()),
    onStepChange: vi.fn(),
  };
}

describe("executeDeclarationAnalysis", () => {
  it("does not call API when point is absent", async () => {
    const deps = dependencies();

    await expect(executeDeclarationAnalysis({ point: null, draft: DEMO_POLLUTION_DECLARATION_DRAFT }, deps))
      .rejects.toBeInstanceOf(DeclarationExecutionValidationError);

    expect(deps.createDeclaration).not.toHaveBeenCalled();
    expect(deps.submitDeclaration).not.toHaveBeenCalled();
    expect(deps.evaluateDeclaration).not.toHaveBeenCalled();
  });

  it("does not call API when draft is invalid", async () => {
    const deps = dependencies();

    await expect(executeDeclarationAnalysis({ point: POINT, draft: EMPTY_POLLUTION_DECLARATION_DRAFT }, deps))
      .rejects.toBeInstanceOf(DeclarationExecutionValidationError);

    expect(deps.createDeclaration).not.toHaveBeenCalled();
    expect(deps.submitDeclaration).not.toHaveBeenCalled();
    expect(deps.evaluateDeclaration).not.toHaveBeenCalled();
  });

  it("stops when create fails", async () => {
    const deps = dependencies();
    deps.createDeclaration.mockRejectedValueOnce(new Error("create failed"));

    await expect(executeDeclarationAnalysis({ point: POINT, draft: DEMO_POLLUTION_DECLARATION_DRAFT }, deps))
      .rejects.toThrow("create failed");

    expect(deps.submitDeclaration).not.toHaveBeenCalled();
    expect(deps.evaluateDeclaration).not.toHaveBeenCalled();
  });

  it("stops when submit fails", async () => {
    const deps = dependencies();
    deps.submitDeclaration.mockRejectedValueOnce(new Error("submit failed"));

    await expect(executeDeclarationAnalysis({ point: POINT, draft: DEMO_POLLUTION_DECLARATION_DRAFT }, deps))
      .rejects.toThrow("submit failed");

    expect(deps.createDeclaration).toHaveBeenCalledOnce();
    expect(deps.evaluateDeclaration).not.toHaveBeenCalled();
  });

  it("runs create submit evaluate in order", async () => {
    const deps = dependencies();
    const calls: string[] = [];
    deps.createDeclaration.mockImplementation(async () => {
      calls.push("create");
      return declaration("BROUILLON");
    });
    deps.submitDeclaration.mockImplementation(async () => {
      calls.push("submit");
      return declaration("PRET_A_ANALYSER");
    });
    deps.evaluateDeclaration.mockImplementation(async () => {
      calls.push("evaluate");
      return evaluation();
    });

    const result = await executeDeclarationAnalysis({ point: POINT, draft: DEMO_POLLUTION_DECLARATION_DRAFT }, deps);

    expect(calls).toEqual(["create", "submit", "evaluate"]);
    expect(result.evaluation.snapshot_id).toBe("snap-1");
    expect(deps.createDeclaration.mock.calls[0][0].detected_at).toBe(EXPECTED_DETECTED_AT);
    expect(deps.evaluateDeclaration).toHaveBeenCalledWith({
      declarationId: "decl-1",
      payload: { use_saved_values: true },
    });
  });

  it("propagates evaluate topology errors", async () => {
    const deps = dependencies();
    const topologyError = {
      response: {
        data: {
          code: "TOPOLOGY_PATH_NOT_FOUND",
          message: "Aucun parcours aval exploitable.",
        },
      },
    };
    deps.evaluateDeclaration.mockRejectedValueOnce(topologyError);

    await expect(executeDeclarationAnalysis({ point: POINT, draft: DEMO_POLLUTION_DECLARATION_DRAFT }, deps))
      .rejects.toBe(topologyError);
  });
});
