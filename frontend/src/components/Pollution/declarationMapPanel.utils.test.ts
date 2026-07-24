import { describe, expect, it } from "vitest";

import type { MatrixResult, StationDetected } from "@/api/pollutionDeclarations";
import {
  buildDeclarationStationMarkers,
  collectMapBounds,
  getStationPoint,
  getStationVisualStatus,
  getStationsWithoutCoordinates,
  isGardeStation,
  isSatStation,
  isValidDeclarationPath,
  normalizeStationName,
} from "./declarationMapPanel.utils";

const MATRIX_RESULT: MatrixResult = {
  matrix_id: "NH4_DAR_EL_ARSSA",
  matrix_version: "1.0.0",
  scenario_id: "SC_QR02_C04_QS01_QI01_QO01",
  exact_match: true,
  pollutant: "NH4",
  C_SidiAllalTazi_mg_L: 0.42,
  C_BgGarde_mg_L: 0.18,
  statut_sidi_allal_tazi: "SUFFISANT",
  statut_bg_garde: "INSUFFISANT",
  statut_global: "INSUFFISANT",
  out_of_domain: false,
  confidence_level: "MEDIUM",
  method_used: "EXACT_MATCH",
};

const VALID_PATH = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [-6.3054, 34.5156],
          [-6.29, 34.5],
        ],
      },
      properties: {},
    },
  ],
};

describe("declarationMapPanel.utils", () => {
  it("normalise les variantes SAT", () => {
    expect(normalizeStationName("P29 à Allal-Tazi")).toBe("p29 a allal tazi");
  });

  it("normalise sans crash une valeur non textuelle", () => {
    expect(normalizeStationName(464)).toBe("464");
  });

  it("reconnait SAT et Garde via alias", () => {
    const sat: StationDetected = { station_name: "P29 a allal tazi" };
    const garde: StationDetected = { station_name: "amont barrage de garde" };

    expect(isSatStation(sat)).toBe(true);
    expect(isGardeStation(garde)).toBe(true);
  });

  it("calcule le statut visuel a partir du resultat matrice", () => {
    expect(getStationVisualStatus({ station_name: "Sidi Allal Tazi" }, MATRIX_RESULT)).toBe("SUFFISANT");
    expect(getStationVisualStatus({ station_name: "amont barrage de garde" }, MATRIX_RESULT)).toBe("INSUFFISANT");
  });

  it("valide un parcours GeoJSON exploitable", () => {
    expect(isValidDeclarationPath(VALID_PATH)).toBe(true);
  });

  it("rejette un parcours GeoJSON vide", () => {
    expect(isValidDeclarationPath({ type: "FeatureCollection", features: [] })).toBe(false);
  });

  it("extrait un marker station uniquement si les coordonnees existent", () => {
    const station: StationDetected = {
      station_name: "P29 a allal tazi",
      longitude: -6.3,
      latitude: 34.51,
    };

    expect(getStationPoint(station)).toEqual({ type: "Point", coordinates: [-6.3, 34.51] });
    expect(getStationPoint({ station_name: "Sans coordonnees" })).toBeNull();
  });

  it("separe stations cartographiables et stations sans coordonnees", () => {
    const stations: StationDetected[] = [
      { station_name: "P29 a allal tazi", longitude: -6.3, latitude: 34.51 },
      { station_name: "Barrage de Garde" },
    ];

    const markers = buildDeclarationStationMarkers(stations, MATRIX_RESULT);
    const missing = getStationsWithoutCoordinates(stations);

    expect(markers).toHaveLength(1);
    expect(markers[0].role).toBe("SAT");
    expect(markers[0].visualStatus).toBe("SUFFISANT");
    expect(missing).toHaveLength(1);
    expect(missing[0].station_name).toBe("Barrage de Garde");
  });

  it("calcule les bornes a partir du point et du parcours", () => {
    const bounds = collectMapBounds({
      declarationPoint: { type: "Point", coordinates: [-6.3054, 34.5156] },
      snappedPoint: { type: "Point", coordinates: [-6.3053, 34.5155] },
      path: VALID_PATH,
    });

    expect(bounds).toEqual([
      [-6.3054, 34.5],
      [-6.29, 34.5156],
    ]);
  });

  it("inclut les stations dans les bornes", () => {
    const markers = buildDeclarationStationMarkers([
      { station_name: "P29 a allal tazi", longitude: -6.28, latitude: 34.49 },
    ]);

    const bounds = collectMapBounds({
      declarationPoint: { type: "Point", coordinates: [-6.3054, 34.5156] },
      path: VALID_PATH,
      stations: markers,
    });

    expect(bounds).toEqual([
      [-6.3054, 34.49],
      [-6.28, 34.5156],
    ]);
  });
});
