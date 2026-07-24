import { useEffect, useMemo, useRef, useState } from "react";
import type { FeatureCollection } from "geojson";
import type { LngLatBoundsLike, MapLayerMouseEvent, MapRef, ViewStateChangeEvent } from "react-map-gl/maplibre";
import Map, { Layer, Popup, Source } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import type {
  PollutionLatestResult,
  PollutionSiteProperties,
  PollutionSitesGeoJson,
  PollutionSymbologyMode,
} from "@/api/pollutionIdp";
import type { DeclarationTopologyResult, GeoJsonPoint, MatrixResult } from "@/api/pollutionDeclarations";
import { getPropagationNetworkGeoJSON } from "@/api/propagation";
import type { ImpactedStation } from "@/api/propagation";
import type { DeclarationPoint } from "./declarationPoint.types";
import {
  buildDeclarationStationMarkers,
  collectMapBounds,
  getStationsWithoutCoordinates,
  isValidDeclarationPath,
  isValidGeoJsonPoint,
} from "./declarationMapPanel.utils";

interface PollutionIdpMapProps {
  data?: PollutionSitesGeoJson;
  loading?: boolean;
  error?: Error | null;
  symbologyMode?: PollutionSymbologyMode;
  selectedSiteId?: string | null;
  onSiteSelect?: (properties: PollutionSiteProperties) => void;
  propagationPath?: FeatureCollection;
  impactedTargets?: ImpactedStation[];
  simulating?: boolean;
  selectedSiteCoordinates?: [number, number];
  sitesVisible?: boolean;
  qualityStations?: FeatureCollection;
  drawMode?: boolean;
  onMapClick?: (lat: number, lon: number) => void;
  signalPoint?: { lat: number; lon: number } | null;
  declarationMode?: boolean;
  declarationPoint?: DeclarationPoint | null;
  isDeclarationPointPicking?: boolean;
  onDeclarationMapClick?: (point: { longitude: number; latitude: number }) => void;
  declarationTopologyResult?: DeclarationTopologyResult | null;
  declarationMatrixResult?: MatrixResult | null;
  declarationWarnings?: string[];
}

const QUALITY_CLASS_COLORS: Record<string, string> = {
  excellente: "#2563eb",
  bonne: "#16a34a",
  moyenne: "#f59e0b",
  mauvaise: "#dc2626",
  tres_mauvaise: "#7c3aed",
};

const QUALITY_LEGEND = [
  { code: "excellente", label: "Excellente", color: QUALITY_CLASS_COLORS.excellente },
  { code: "bonne", label: "Bonne", color: QUALITY_CLASS_COLORS.bonne },
  { code: "moyenne", label: "Moyenne", color: QUALITY_CLASS_COLORS.moyenne },
  { code: "mauvaise", label: "Mauvaise", color: QUALITY_CLASS_COLORS.mauvaise },
  { code: "tres_mauvaise", label: "Tres mauvaise", color: QUALITY_CLASS_COLORS.tres_mauvaise },
];


type DeclarationPopup =
  | { kind: "declared"; point: GeoJsonPoint }
  | { kind: "snapped"; point: GeoJsonPoint }
  | { kind: "path"; longitude: number; latitude: number }
  | { kind: "station"; markerIndex: number }
  | null;

function toDeclarationGeoJsonPoint(point?: DeclarationPoint | null): GeoJsonPoint | null {
  if (!point) return null;
  return { type: "Point", coordinates: [point.longitude, point.latitude] };
}

function formatCoordinates(point?: GeoJsonPoint | null) {
  if (!isValidGeoJsonPoint(point)) return "n/a";
  const [lng, lat] = point.coordinates;
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}
function parseLatestResults(value: PollutionSiteProperties["latest_results"]): PollutionLatestResult[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function resultLabel(result: PollutionLatestResult) {
  const value = result.value_numeric ?? result.value_text ?? "n/a";
  return `${result.parameter_code ?? "?"}: ${value}${result.unit ? ` ${result.unit}` : ""}`;
}

function worstRegulatoryResult(results: PollutionLatestResult[]) {
  return results
    .filter((result) => result.regulatory_status === "CLASSIFIED" && result.severity_order != null)
    .sort((a, b) => Number(b.severity_order) - Number(a.severity_order))[0];
}

function qualityColor(result: PollutionLatestResult) {
  return result.color || (result.class_code ? QUALITY_CLASS_COLORS[result.class_code] : undefined) || "#64748b";
}

function buildMapData(data?: PollutionSitesGeoJson): PollutionSitesGeoJson | undefined {
  if (!data) return undefined;
  return {
    ...data,
    features: data.features.map((feature) => {
      const results = parseLatestResults(feature.properties.latest_results);
      const worst = worstRegulatoryResult(results);
      return {
        ...feature,
        properties: {
          ...feature.properties,
          map_regulatory_class: worst?.class_code ?? null,
          map_regulatory_color: worst ? qualityColor(worst) : null,
        },
      };
    }),
  };
}

export default function PollutionIdpMap({
  data,
  loading,
  error,
  symbologyMode = "validation_status",
  selectedSiteId,
  onSiteSelect,
  propagationPath,
  impactedTargets,
  simulating,
  selectedSiteCoordinates,
  sitesVisible = false,
  qualityStations,
  drawMode = false,
  onMapClick,
  signalPoint,
  declarationMode = false,
  declarationPoint,
  isDeclarationPointPicking = false,
  onDeclarationMapClick,
  declarationTopologyResult,
  declarationMatrixResult,
  declarationWarnings,
}: PollutionIdpMapProps) {
  const [viewState, setViewState] = useState({
    longitude: -4.8,
    latitude: 34.4,
    zoom: 7.1,
    pitch: 0,
    bearing: 0,
  });
  const [selected, setSelected] = useState<{
    longitude: number;
    latitude: number;
    properties: PollutionSiteProperties;
  } | null>(null);
  const mapRef = useRef<MapRef | null>(null);
  const [declarationPopup, setDeclarationPopup] = useState<DeclarationPopup>(null);
  const [networkData, setNetworkData] = useState<FeatureCollection | null>(null);
  const [networkError, setNetworkError] = useState<Error | null>(null);
  const declaredPoint = useMemo(() => toDeclarationGeoJsonPoint(declarationPoint), [declarationPoint]);
  const snappedPoint = isValidGeoJsonPoint(declarationTopologyResult?.snapped_point)
    ? declarationTopologyResult.snapped_point
    : null;
  const declarationPath = isValidDeclarationPath(declarationTopologyResult?.parcours_geojson)
    ? declarationTopologyResult.parcours_geojson
    : null;
  const declarationStationMarkers = useMemo(
    () => buildDeclarationStationMarkers(declarationTopologyResult?.stations_detectees, declarationMatrixResult),
    [declarationMatrixResult, declarationTopologyResult?.stations_detectees]
  );
  const declarationStationsWithoutCoordinates = useMemo(
    () => getStationsWithoutCoordinates(declarationTopologyResult?.stations_detectees),
    [declarationTopologyResult?.stations_detectees]
  );
  const declarationBounds = useMemo(
    () => collectMapBounds({ declarationPoint: declaredPoint, snappedPoint, path: declarationPath, stations: declarationStationMarkers }),
    [declaredPoint, declarationPath, declarationStationMarkers, snappedPoint]
  );
  const declarationCombinedWarnings = useMemo(() => {
    const warnings = [
      ...(declarationWarnings ?? []),
      ...(declarationTopologyResult?.warnings ?? []),
    ];
    if (declarationStationsWithoutCoordinates.length > 0) {
      warnings.push(`${declarationStationsWithoutCoordinates.length} station(s) detectee(s) sans coordonnees cartographiques.`);
    }
    if (declarationMode && declarationTopologyResult && !declarationPath) {
      warnings.push("Le backend n'a retourne aucun parcours cartographique exploitable.");
    }
    return [...new Set(warnings.filter(Boolean))];
  }, [declarationMode, declarationPath, declarationStationsWithoutCoordinates.length, declarationTopologyResult, declarationWarnings]);

  useEffect(() => {
    if (!selectedSiteCoordinates || !mapRef.current) return;
    mapRef.current.flyTo({
      center: selectedSiteCoordinates,
      zoom: 11,
      duration: 1200,
    });
  }, [selectedSiteCoordinates]);
  useEffect(() => {
    if (!declarationMode || !declaredPoint || !mapRef.current || declarationBounds) return;
    mapRef.current.flyTo({
      center: declaredPoint.coordinates,
      zoom: 11,
      duration: 800,
    });
  }, [declarationBounds, declarationMode, declaredPoint]);

  useEffect(() => {
    if (!declarationMode || !declarationBounds || !mapRef.current) return;
    mapRef.current.fitBounds(declarationBounds as LngLatBoundsLike, {
      padding: 72,
      duration: 700,
      maxZoom: 13,
    });
  }, [declarationBounds, declarationMode]);

  useEffect(() => {
    if (!mapRef.current) return;
    const resizeFrame = window.requestAnimationFrame(() => {
      mapRef.current?.resize();
    });
    const resizeTimeout = window.setTimeout(() => {
      mapRef.current?.resize();
    }, 250);
    return () => {
      window.cancelAnimationFrame(resizeFrame);
      window.clearTimeout(resizeTimeout);
    };
  }, [declarationMode, declarationTopologyResult?.snapped_point, declarationPath]);

  useEffect(() => {
    let cancelled = false;
    getPropagationNetworkGeoJSON()
      .then((data) => {
        if (!cancelled) setNetworkData(data);
      })
      .catch((err) => {
        if (!cancelled) setNetworkError(err instanceof Error ? err : new Error(String(err)));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const featureCount = data?.features.length ?? 0;
  const sitesWithResults = useMemo(
    () => data?.features.filter((feature) => parseLatestResults(feature.properties.latest_results).length > 0).length ?? 0,
    [data]
  );
  const mapData = useMemo(() => buildMapData(data), [data]);

  const impactedTargetsGeojson = useMemo<FeatureCollection | undefined>(() => {
    if (!impactedTargets?.length) return undefined;
    return {
      type: "FeatureCollection",
      features: impactedTargets.map((target) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [target.lon, target.lat],
        },
        properties: {
          station_id: target.station_id,
          station_name: target.station_name,
          station_type: target.station_type,
          distance_km: target.distance_km,
          arrival_time: target.arrival_time,
          estimated_concentration_mg_l: target.estimated_concentration_mg_l,
          alert_level: target.alert_level,
        },
      })),
    };
  }, [impactedTargets]);

  const declarationPathGeojson = useMemo<FeatureCollection | undefined>(() => {
    if (!declarationMode || !declarationPath) return undefined;
    return {
      type: "FeatureCollection",
      features: declarationPath.features.map((feature) => ({
        ...feature,
        properties: {
          ...(feature.properties ?? {}),
          declaration_kind: "path",
        },
      })),
    };
  }, [declarationMode, declarationPath]);
  const declarationPointGeojson = useMemo<FeatureCollection | undefined>(() => {
    if (!declarationMode || !declaredPoint) return undefined;
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: declaredPoint,
          properties: { declaration_kind: "declared", source: declarationPoint?.source },
        },
      ],
    };
  }, [declarationMode, declarationPoint?.source, declaredPoint]);

  const declarationSnappedPointGeojson = useMemo<FeatureCollection | undefined>(() => {
    if (!declarationMode || !snappedPoint) return undefined;
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: snappedPoint,
          properties: { declaration_kind: "snapped" },
        },
      ],
    };
  }, [declarationMode, snappedPoint]);

  const declarationStationsGeojson = useMemo<FeatureCollection | undefined>(() => {
    if (!declarationMode || declarationStationMarkers.length === 0) return undefined;
    return {
      type: "FeatureCollection",
      features: declarationStationMarkers.map((marker, markerIndex) => ({
        type: "Feature",
        geometry: marker.point,
        properties: {
          declaration_kind: "station",
          marker_index: markerIndex,
          station_name: marker.label,
          role: marker.role,
          visual_status: marker.visualStatus,
        },
      })),
    };
  }, [declarationMode, declarationStationMarkers]);

  const declarationInteractiveLayerIds = declarationMode && !isDeclarationPointPicking
    ? [
        "declaration-point-marker",
        "declaration-snapped-point-marker",
        "declaration-official-path-line",
        "declaration-stations-circle",
      ]
    : [];
  const interactiveLayerIds = drawMode || (declarationMode && isDeclarationPointPicking)
    ? []
    : [...(sitesVisible ? ["pollution-idp-sites"] : []), ...declarationInteractiveLayerIds];
  const onClick = (event: MapLayerMouseEvent) => {
    if (declarationMode && isDeclarationPointPicking && onDeclarationMapClick) {
      onDeclarationMapClick({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
      });
      return;
    }
    if (drawMode && onMapClick) {
      onMapClick(event.lngLat.lat, event.lngLat.lng);
      return;
    }
    const feature = event.features?.[0];
    const declarationKind = feature?.properties?.declaration_kind;
    if (declarationMode && declarationKind) {
      if (declarationKind === "declared" && declaredPoint) {
        setDeclarationPopup({ kind: "declared", point: declaredPoint });
        return;
      }
      if (declarationKind === "snapped" && snappedPoint) {
        setDeclarationPopup({ kind: "snapped", point: snappedPoint });
        return;
      }
      if (declarationKind === "path") {
        setDeclarationPopup({ kind: "path", longitude: event.lngLat.lng, latitude: event.lngLat.lat });
        return;
      }
      if (declarationKind === "station") {
        const markerIndex = Number(feature.properties?.marker_index);
        if (Number.isInteger(markerIndex)) {
          setDeclarationPopup({ kind: "station", markerIndex });
          return;
        }
      }
    }
    if (!feature) return;
    const properties = feature.properties as PollutionSiteProperties;
    setSelected({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      properties,
    });
    onSiteSelect?.(properties);
  };

  const selectedDeclarationStation = declarationPopup?.kind === "station"
    ? declarationStationMarkers[declarationPopup.markerIndex]
    : null;

  return (
    <div className="relative h-[clamp(500px,64vh,700px)] min-h-[500px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(event: ViewStateChangeEvent) => setViewState(event.viewState)}
        onClick={onClick}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        interactiveLayerIds={interactiveLayerIds}
        cursor={drawMode || (declarationMode && isDeclarationPointPicking) ? "crosshair" : "grab"}
      >
        {networkData && (
          <Source id="hydro-network" type="geojson" data={networkData}>
            <Layer
              id="hydro-lines"
              type="line"
              paint={{
                "line-color": "#3b82f6",
                "line-width": 1,
                "line-opacity": 0.5,
              }}
            />
          </Source>
        )}

        {propagationPath && (
          <Source id="propagation-path" type="geojson" data={propagationPath}>
            <Layer
              id="propagation-path-line"
              type="line"
              paint={{
                "line-color": "#f59e0b",
                "line-width": 4,
                "line-opacity": 0.85,
              }}
            />
          </Source>
        )}


        {declarationMode && declarationPathGeojson && (
          <Source id="declaration-official-path" type="geojson" data={declarationPathGeojson}>
            <Layer
              id="declaration-official-path-line"
              type="line"
              paint={{
                "line-color": "#0284c7",
                "line-width": 4,
                "line-opacity": 0.9,
              }}
            />
          </Source>
        )}
        {impactedTargetsGeojson && (
          <Source id="impacted-targets" type="geojson" data={impactedTargetsGeojson}>
            <Layer
              id="impacted-targets-circle"
              type="circle"
              paint={{
                "circle-radius": ["interpolate", ["linear"], ["zoom"], 6, 5, 12, 9],
                "circle-color": [
                  "match",
                  ["get", "alert_level"],
                  "CRITICAL",
                  "#dc2626",
                  "WARNING",
                  "#f59e0b",
                  "#16a34a",
                ],
                "circle-stroke-color": "#ffffff",
                "circle-stroke-width": 1.5,
                "circle-opacity": 0.9,
              }}
            />
          </Source>
        )}

        {qualityStations && (
          <Source id="quality-stations" type="geojson" data={qualityStations}>
            <Layer
              id="quality-stations-circle"
              type="circle"
              paint={{
                "circle-radius": ["interpolate", ["linear"], ["zoom"], 6, 5, 12, 9],
                "circle-color": "#16a34a",
                "circle-stroke-color": "#ffffff",
                "circle-stroke-width": 1.5,
                "circle-opacity": 0.9,
              }}
            />
          </Source>
        )}

        {signalPoint && (
          <Source
            id="signal-point"
            type="geojson"
            data={{
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: { type: "Point", coordinates: [signalPoint.lon, signalPoint.lat] },
                  properties: {},
                },
              ],
            }}
          >
            <Layer
              id="signal-marker"
              type="circle"
              paint={{
                "circle-radius": 10,
                "circle-color": "#dc2626",
                "circle-stroke-color": "#ffffff",
                "circle-stroke-width": 2,
                "circle-opacity": 0.95,
              }}
            />
          </Source>
        )}

        {declarationPointGeojson && (
          <Source id="declaration-point-source" type="geojson" data={declarationPointGeojson}>
            <Layer
              id="declaration-point-marker"
              type="circle"
              paint={{
                "circle-radius": 10,
                "circle-color": "#0f172a",
                "circle-stroke-color": "#f8fafc",
                "circle-stroke-width": 3,
                "circle-opacity": 0.95,
              }}
            />
          </Source>
        )}


        {declarationSnappedPointGeojson && (
          <Source id="declaration-snapped-point-source" type="geojson" data={declarationSnappedPointGeojson}>
            <Layer
              id="declaration-snapped-point-marker"
              type="circle"
              paint={{
                "circle-radius": 8,
                "circle-color": "#38bdf8",
                "circle-stroke-color": "#082f49",
                "circle-stroke-width": 2.5,
                "circle-opacity": 0.95,
              }}
            />
          </Source>
        )}

        {declarationStationsGeojson && (
          <Source id="declaration-stations-source" type="geojson" data={declarationStationsGeojson}>
            <Layer
              id="declaration-stations-circle"
              type="circle"
              paint={{
                "circle-radius": ["interpolate", ["linear"], ["zoom"], 6, 6, 12, 10],
                "circle-color": [
                  "match",
                  ["get", "visual_status"],
                  "SUFFISANT",
                  "#16a34a",
                  "INSUFFISANT",
                  "#dc2626",
                  "#64748b",
                ],
                "circle-stroke-color": [
                  "match",
                  ["get", "role"],
                  "GARDE",
                  "#0f172a",
                  "SAT",
                  "#0f172a",
                  "#ffffff",
                ],
                "circle-stroke-width": 2.5,
                "circle-opacity": 0.95,
              }}
            />
          </Source>
        )}
        {sitesVisible && mapData && (
          <Source id="pollution-idp-source" type="geojson" data={mapData}>
            <Layer
              id="pollution-idp-sites"
              type="circle"
              paint={{
                "circle-radius": ["interpolate", ["linear"], ["zoom"], 6, 4, 12, 8],
                "circle-color":
                  symbologyMode === "regulatory_status"
                    ? [
                        "match",
                        ["get", "map_regulatory_class"],
                        "excellente",
                        QUALITY_CLASS_COLORS.excellente,
                        "bonne",
                        QUALITY_CLASS_COLORS.bonne,
                        "moyenne",
                        QUALITY_CLASS_COLORS.moyenne,
                        "mauvaise",
                        QUALITY_CLASS_COLORS.mauvaise,
                        "tres_mauvaise",
                        QUALITY_CLASS_COLORS.tres_mauvaise,
                        "#64748b",
                      ]
                    : [
                        "match",
                        ["get", "validation_status"],
                        "VALIDATED",
                        "#1b9e77",
                        "TO_VALIDATE",
                        "#d95f02",
                        "#7570b3",
                      ],
                "circle-stroke-color": "#ffffff",
                "circle-stroke-width": [
                  "case",
                  ["==", ["get", "site_id"], selectedSiteId ?? ""],
                  2.6,
                  1.2,
                ],
                "circle-stroke-opacity": [
                  "case",
                  ["==", ["get", "site_id"], selectedSiteId ?? ""],
                  1,
                  0.9,
                ],
                "circle-opacity": 0.86,
              }}
            />
          </Source>
        )}

        {selected && (
          <Popup
            longitude={selected.longitude}
            latitude={selected.latitude}
            closeButton
            closeOnClick={false}
            maxWidth="360px"
            onClose={() => setSelected(null)}
          >
            <div className="space-y-2 text-sm">
              <div>
                <div className="font-semibold text-slate-950">
                  {selected.properties.site_name || selected.properties.site_code || "Site pollution"}
                </div>
                <div className="text-xs text-slate-600">{selected.properties.commune || "Commune non renseignee"}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">
                <div>{selected.properties.source_type_label || selected.properties.source_type_code || "Typologie non renseignee"}</div>
                <div>Statut : {selected.properties.validation_status || "n/a"}</div>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium uppercase text-slate-500">Derniers resultats P0</div>
                <div className="space-y-1">
                  {parseLatestResults(selected.properties.latest_results).length > 0 ? (
                    parseLatestResults(selected.properties.latest_results).map((result, index) => (
                      <div key={`${result.parameter_code}-${index}`} className="rounded bg-white px-2 py-1 text-xs shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                          <span>{resultLabel(result)}</span>
                          {result.class_label && (
                            <span
                              className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white"
                              style={{ backgroundColor: qualityColor(result) }}
                            >
                              {result.class_label}
                            </span>
                          )}
                        </div>
                        {result.non_classifiable_reason && (
                          <div className="mt-1 text-[11px] text-slate-500">
                            Non classifiable : {result.non_classifiable_reason}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500">Aucun resultat P0 rattache</div>
                  )}
                </div>
              </div>
            </div>
          </Popup>
        )}

        {declarationPopup?.kind === "declared" && (
          <Popup longitude={declarationPopup.point.coordinates[0]} latitude={declarationPopup.point.coordinates[1]} closeButton closeOnClick={false} maxWidth="280px" onClose={() => setDeclarationPopup(null)}>
            <div className="space-y-1 text-xs">
              <div className="font-semibold text-slate-950">Point declare</div>
              <div>Coordonnees : {formatCoordinates(declarationPopup.point)}</div>
              <div>Origine : {declarationPoint?.source ?? "n/a"}</div>
            </div>
          </Popup>
        )}

        {declarationPopup?.kind === "snapped" && (
          <Popup longitude={declarationPopup.point.coordinates[0]} latitude={declarationPopup.point.coordinates[1]} closeButton closeOnClick={false} maxWidth="300px" onClose={() => setDeclarationPopup(null)}>
            <div className="space-y-1 text-xs">
              <div className="font-semibold text-slate-950">Point snappe</div>
              <div>Coordonnees : {formatCoordinates(declarationPopup.point)}</div>
              <div>Distance de snap : {declarationTopologyResult?.snap_distance_m ?? "n/a"} m</div>
              <div>Confiance : {declarationTopologyResult?.confidence_level ?? "n/a"}</div>
            </div>
          </Popup>
        )}

        {declarationPopup?.kind === "path" && (
          <Popup longitude={declarationPopup.longitude} latitude={declarationPopup.latitude} closeButton closeOnClick={false} maxWidth="300px" onClose={() => setDeclarationPopup(null)}>
            <div className="space-y-1 text-xs">
              <div className="font-semibold text-slate-950">Parcours topologique estime</div>
              <div>Longueur : {declarationTopologyResult?.longueur_km ?? "n/a"} km</div>
              <div>Ce trace ne represente pas une concentration.</div>
            </div>
          </Popup>
        )}

        {selectedDeclarationStation && (
          <Popup longitude={selectedDeclarationStation.point.coordinates[0]} latitude={selectedDeclarationStation.point.coordinates[1]} closeButton closeOnClick={false} maxWidth="320px" onClose={() => setDeclarationPopup(null)}>
            <div className="space-y-1 text-xs">
              <div className="font-semibold text-slate-950">{selectedDeclarationStation.label}</div>
              <div>Role : {selectedDeclarationStation.role}</div>
              <div>Statut visuel : {selectedDeclarationStation.visualStatus}</div>
              <div>Distance source : {selectedDeclarationStation.station.distance_to_source_km ?? "n/a"} km</div>
              <div>Coordonnees : {formatCoordinates(selectedDeclarationStation.point)}</div>
            </div>
          </Popup>
        )}
      </Map>

      <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-sm shadow">
        <div className="font-medium text-slate-900">Couches actives</div>
        <div className="text-xs text-slate-600">
          {sitesVisible
            ? `${featureCount.toLocaleString("fr-MA")} sites pollution, ${sitesWithResults.toLocaleString("fr-MA")} avec résultats P0`
            : "Sites pollution masqués"}
          {qualityStations ? ` · ${qualityStations.features.length} stations qualité` : ""}
        </div>
      </div>

      {declarationMode && declarationPoint && !declarationTopologyResult && !isDeclarationPointPicking && (
        <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full border border-slate-300 bg-white/95 px-4 py-1.5 text-xs font-medium text-slate-700 shadow">
          Lancez l'analyse pour afficher le parcours officiel.
        </div>
      )}

      {declarationMode && declarationCombinedWarnings.length > 0 && (
        <div className="absolute right-4 top-4 max-w-sm rounded-lg border border-amber-200 bg-amber-50/95 px-3 py-2 text-xs text-amber-950 shadow">
          <div className="font-semibold">Avertissements topologiques</div>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            {declarationCombinedWarnings.slice(0, 4).map((warning, index) => (
              <li key={`${index}-${warning}`}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
      {symbologyMode === "regulatory_status" && !declarationMode && (
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow">
          <div className="mb-2 font-medium text-slate-900">Legende qualite reglementaire</div>
          <div className="space-y-1">
            {QUALITY_LEGEND.map((item) => (
              <div key={item.code} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-slate-500" />
              <span>Non classe</span>
            </div>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-4 right-4 max-w-[260px] rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow">
        <div className="mb-2 font-medium text-slate-900">Stations qualité</div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-600" />
          <span>Stations qualité ({qualityStations?.features.length ?? 0})</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-600 ring-2 ring-white" />
          <span>Source pointée</span>
        </div>
      </div>

      {declarationMode && (
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow">
          <div className="mb-2 font-medium text-slate-900">Legende declaration</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-slate-900" /><span>Point declare</span></div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-sky-400 ring-1 ring-sky-950" /><span>Point snappe backend</span></div>
            <div className="flex items-center gap-2"><span className="h-1 w-5 rounded bg-sky-600" /><span>Parcours topologique</span></div>
          </div>
        </div>
      )}
      {drawMode && (
        <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-xs font-medium text-amber-900 shadow">
          Cliquez sur la carte pour positionner la source de pollution
        </div>
      )}

      {declarationMode && isDeclarationPointPicking && (
        <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full border border-blue-300 bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-900 shadow">
          Cliquez sur la carte pour definir le point declare
        </div>
      )}

      {(loading || simulating) && (
        <div className="absolute inset-0 grid place-items-center bg-white/70">
          <div className="rounded-lg bg-white px-4 py-3 text-sm font-medium shadow">
            {simulating ? "Propagation en cours..." : "Chargement de la couche..."}
          </div>
        </div>
      )}

      {!declarationMode && (error || networkError) && (
        <div className="absolute inset-x-4 bottom-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow">
          Erreur de chargement : {(error ?? networkError)?.message}
        </div>
      )}

      {declarationMode && (error || networkError) && (
        <div className="absolute inset-x-4 bottom-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow">
          Contexte cartographique partiel : {(error ?? networkError)?.message}. L'analyse officielle reste executee par le backend Declaration.
        </div>
      )}
    </div>
  );
}


















