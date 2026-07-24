import type { PollutionDeclarationDraft } from "./declarationDraft.types";
import type { DeclarationPoint } from "./declarationPoint.types";

export type DeclarationDemoScenarioId = "sufficient" | "risk";

export interface DeclarationDemoScenario {
  id: DeclarationDemoScenarioId;
  label: string;
  description: string;
  sourcePointLabel: string;
  matrixVersion: string;
  scenarioId: string;
  expectedStatus: "SUFFISANT" | "INSUFFISANT";
  point: DeclarationPoint;
  draft: PollutionDeclarationDraft;
}

export const MATRIX_SOURCE_POINT_TO_VALIDATE: DeclarationPoint = {
  longitude: -4.908418523493339,
  latitude: 34.16528818110318,
  source: "preset",
};

export const MATRIX_SOURCE_POINT_LABEL =
  "Point source matrice NH4 - avant station Dar El Arsa";

export const NH4_MATRIX_DEMO_SCENARIOS: Record<DeclarationDemoScenarioId, DeclarationDemoScenario> = {
  sufficient: {
    id: "sufficient",
    label: "Charger scenario matrice suffisant",
    description:
      "Scenario exact issu de la matrice NH4 v1 pour demontrer un statut suffisant.",
    sourcePointLabel: MATRIX_SOURCE_POINT_LABEL,
    matrixVersion: "1.0.0",
    scenarioId: "SC_QR01_C01_QS01_QI01_QO01",
    expectedStatus: "SUFFISANT",
    point: MATRIX_SOURCE_POINT_TO_VALIDATE,
    draft: {
      pollutant: "NH4",
      detectedAt: "2026-07-15T08:30",
      crejetMgL: "100",
      qrejetM3s: "0.055555556",
      qsebouM3s: "7.5",
      qinnaouenM3s: "10",
      qouerghaM3s: "10",
      comment:
        "Scenario Excel NH4 suffisant SC_QR01_C01_QS01_QI01_QO01 - point source matrice avant station Dar El Arsa.",
    },
  },
  risk: {
    id: "risk",
    label: "Charger scenario matrice a risque",
    description:
      "Scenario exact issu de la matrice NH4 v1 pour demontrer un statut insuffisant et les strategies de dilution.",
    sourcePointLabel: MATRIX_SOURCE_POINT_LABEL,
    matrixVersion: "1.0.0",
    scenarioId: "SC_QR02_C04_QS01_QI01_QO01",
    expectedStatus: "INSUFFISANT",
    point: MATRIX_SOURCE_POINT_TO_VALIDATE,
    draft: {
      pollutant: "NH4",
      detectedAt: "2026-07-15T08:30",
      crejetMgL: "250",
      qrejetM3s: "0.277777778",
      qsebouM3s: "7.5",
      qinnaouenM3s: "10",
      qouerghaM3s: "10",
      comment:
        "Scenario Excel NH4 a risque SC_QR02_C04_QS01_QI01_QO01 - point source matrice avant station Dar El Arsa.",
    },
  },
};
