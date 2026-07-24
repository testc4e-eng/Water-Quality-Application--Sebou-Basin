import type {
  GeoJsonFeatureCollection,
  GeoJsonLineString,
  GeoJsonPoint,
  MatrixResult,
  StationDetected,
} from "@/api/pollutionDeclarations";

export type StationVisualStatus = "SUFFISANT" | "INSUFFISANT" | "INCONNU";

export interface DeclarationStationMarker {
  station: StationDetected;
  point: GeoJsonPoint;
  visualStatus: StationVisualStatus;
  role: "SAT" | "GARDE" | "OTHER";
  label: string;
}

const SAT_ALIASES = ["sidi allal tazi", "p29 a allal tazi", "allal tazi"];
const GARDE_ALIASES = [
  "amont barrage de garde",
  "barrage de garde",
  "brg de garde",
  "brg garde du sebou",
  "bg garde",
  "brg garde",
  "garde",
];

function stripDiacritics(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function normalizeStationName(value: unknown) {
  if (value === null || value === undefined) return "";
  return stripDiacritics(String(value))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stationNameCandidates(station: StationDetected) {
  return [station.station_name, station.station_code, station.target_name, station.target_node]
    .filter((value) => value !== null && value !== undefined && value !== "")
    .map(normalizeStationName);
}

export function isSatStation(station: StationDetected) {
  const candidates = stationNameCandidates(station);
  return candidates.some((candidate) => SAT_ALIASES.some((alias) => candidate.includes(alias)));
}

export function isGardeStation(station: StationDetected) {
  const candidates = stationNameCandidates(station);
  return candidates.some((candidate) => GARDE_ALIASES.some((alias) => candidate.includes(alias)));
}

export function getStationVisualStatus(
  station: StationDetected,
  matrixResult?: MatrixResult | null
): StationVisualStatus {
  if (!matrixResult) return "INCONNU";
  if (isSatStation(station)) {
    return matrixResult.statut_sidi_allal_tazi === "SUFFISANT" ? "SUFFISANT" : "INSUFFISANT";
  }
  if (isGardeStation(station)) {
    return matrixResult.statut_bg_garde === "SUFFISANT" ? "SUFFISANT" : "INSUFFISANT";
  }
  return "INCONNU";
}

function appendBounds(bounds: { minLng: number; maxLng: number; minLat: number; maxLat: number }, lng: number, lat: number) {
  bounds.minLng = Math.min(bounds.minLng, lng);
  bounds.maxLng = Math.max(bounds.maxLng, lng);
  bounds.minLat = Math.min(bounds.minLat, lat);
  bounds.maxLat = Math.max(bounds.maxLat, lat);
}

function isFiniteCoordinatePair(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number" &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1])
  );
}

export function isValidGeoJsonPoint(point?: GeoJsonPoint | null): point is GeoJsonPoint {
  return Boolean(point && point.type === "Point" && isFiniteCoordinatePair(point.coordinates));
}

export function isValidDeclarationPath(
  path?: GeoJsonFeatureCollection<GeoJsonLineString> | null
): path is GeoJsonFeatureCollection<GeoJsonLineString> {
  if (!path || path.type !== "FeatureCollection" || !Array.isArray(path.features)) return false;
  return path.features.some((feature) => {
    if (!feature || feature.type !== "Feature" || feature.geometry?.type !== "LineString") return false;
    return Array.isArray(feature.geometry.coordinates) && feature.geometry.coordinates.some(isFiniteCoordinatePair);
  });
}

export function getStationLabel(station: StationDetected) {
  return String(station.station_name ?? station.target_name ?? station.station_code ?? station.target_node ?? "Station");
}

export function getStationRole(station: StationDetected): DeclarationStationMarker["role"] {
  if (isSatStation(station)) return "SAT";
  if (isGardeStation(station)) return "GARDE";
  return "OTHER";
}

export function getStationPoint(station: StationDetected): GeoJsonPoint | null {
  const lng = typeof station.longitude === "number" ? station.longitude : null;
  const lat = typeof station.latitude === "number" ? station.latitude : null;
  if (lng === null || lat === null || !Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  return { type: "Point", coordinates: [lng, lat] };
}

export function buildDeclarationStationMarkers(
  stations: StationDetected[] | undefined,
  matrixResult?: MatrixResult | null
): DeclarationStationMarker[] {
  return (stations ?? [])
    .map((station) => {
      const point = getStationPoint(station);
      if (!point) return null;
      return {
        station,
        point,
        visualStatus: getStationVisualStatus(station, matrixResult),
        role: getStationRole(station),
        label: getStationLabel(station),
      } satisfies DeclarationStationMarker;
    })
    .filter((item): item is DeclarationStationMarker => item !== null);
}

export function getStationsWithoutCoordinates(stations: StationDetected[] | undefined) {
  return (stations ?? []).filter((station) => !getStationPoint(station));
}

export function collectMapBounds(params: {
  declarationPoint?: GeoJsonPoint | null;
  snappedPoint?: GeoJsonPoint | null;
  path?: GeoJsonFeatureCollection<GeoJsonLineString> | null;
  stations?: DeclarationStationMarker[];
}) {
  const { declarationPoint, snappedPoint, path, stations } = params;
  const bounds = {
    minLng: Number.POSITIVE_INFINITY,
    maxLng: Number.NEGATIVE_INFINITY,
    minLat: Number.POSITIVE_INFINITY,
    maxLat: Number.NEGATIVE_INFINITY,
  };

  const pushPoint = (point?: GeoJsonPoint | null) => {
    if (!isValidGeoJsonPoint(point)) return;
    const [lng, lat] = point.coordinates;
    appendBounds(bounds, lng, lat);
  };

  pushPoint(declarationPoint);
  pushPoint(snappedPoint);

  if (isValidDeclarationPath(path)) {
    for (const feature of path.features) {
      if (feature.geometry.type !== "LineString") continue;
      for (const coordinate of feature.geometry.coordinates) {
        if (isFiniteCoordinatePair(coordinate)) {
          appendBounds(bounds, coordinate[0], coordinate[1]);
        }
      }
    }
  }

  for (const marker of stations ?? []) {
    pushPoint(marker.point);
  }

  if (!Number.isFinite(bounds.minLng)) {
    return null;
  }

  return [
    [bounds.minLng, bounds.minLat],
    [bounds.maxLng, bounds.maxLat],
  ] as [[number, number], [number, number]];
}
