import { useEffect, useMemo, useRef, useState } from "react";
import type { LngLatBoundsLike, MapRef } from "react-map-gl/maplibre";
import Map, { Layer, Popup, Source } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import type {
  GeoJsonPoint,
  MatrixResult,
  PollutionDeclarationResponse,
  StationDetected,
  TopologyResult,
} from "@/api/pollutionDeclarations";
import {
  collectMapBounds,
  getStationVisualStatus,
  isGardeStation,
  isSatStation,
} from "./declarationMapPanel.utils";

type DeclarationMapPanelProps = {
  declaration?: PollutionDeclarationResponse | null;
  topologyResult?: TopologyResult | null;
  matrixResult?: MatrixResult | null;
  warnings?: string[];
  isLoading?: boolean;
  error?: string | null;
};

type PopupState =
  | { kind: "declared"; point: GeoJsonPoint }
  | { kind: "snapped"; point: GeoJsonPoint }
  | { kind: "station"; station: StationDetected; point: GeoJsonPoint }
  | null;

const DEFAULT_VIEW = {
  latitude: 34.4,
  longitude: -4.8,
  zoom: 7.1,
};

function formatPoint(point?: GeoJsonPoint | null) {
  if (!point?.coordinates?.length) return "-";
  const [lng, lat] = point.coordinates;
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

function statusColor(status: string) {
  if (status === "SUFFISANT") return "#16a34a";
  if (status === "INSUFFISANT") return "#dc2626";
  return "#64748b";
}

function stationCoordinates(station: StationDetected): GeoJsonPoint | null {
  const lng = typeof station.longitude === "number" ? station.longitude : null;
  const lat = typeof station.latitude === "number" ? station.latitude : null;
  if (lng === null || lat === null) return null;
  return { type: "Point", coordinates: [lng, lat] };
}

export default function DeclarationMapPanel({
  declaration,
  topologyResult,
  matrixResult,
  warnings,
  isLoading,
  error,
}: DeclarationMapPanelProps) {
  const mapRef = useRef<MapRef>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [popup, setPopup] = useState<PopupState>(null);

  const declarationPoint = declaration?.point_declaration ?? null;
  const snappedPoint = topologyResult?.snapped_point ?? null;
  const pathGeoJson = topologyResult?.parcours_geojson ?? null;
  const pathFeatureCount = pathGeoJson?.features?.length ?? 0;

  const declaredPointGeoJson = useMemo(() => {
    if (!declarationPoint) return null;
    return {
      type: "FeatureCollection",
      features: [{ type: "Feature", geometry: declarationPoint, properties: { kind: "declared" } }],
    } as const;
  }, [declarationPoint]);

  const snappedPointGeoJson = useMemo(() => {
    if (!snappedPoint) return null;
    return {
      type: "FeatureCollection",
      features: [{ type: "Feature", geometry: snappedPoint, properties: { kind: "snapped" } }],
    } as const;
  }, [snappedPoint]);

  const stationsWithCoordinates = useMemo(() => {
    return (topologyResult?.stations_detectees ?? [])
      .map((station) => ({
        station,
        point: stationCoordinates(station),
        visualStatus: getStationVisualStatus(station, matrixResult),
      }))
      .filter((item) => item.point !== null)
      .map((item) => ({ ...item, point: item.point as GeoJsonPoint }));
  }, [matrixResult, topologyResult?.stations_detectees]);

  const stationsWithoutCoordinates = useMemo(() => {
    return (topologyResult?.stations_detectees ?? []).filter((station) => !stationCoordinates(station));
  }, [topologyResult?.stations_detectees]);

  const stationGeoJson = useMemo(() => {
    if (!stationsWithCoordinates.length) return null;
    return {
      type: "FeatureCollection",
      features: stationsWithCoordinates.map(({ station, point, visualStatus }) => ({
        type: "Feature",
        geometry: point,
        properties: {
          station_id: station.station_id,
          station_name: station.station_name ?? station.target_name ?? station.station_code ?? "Station",
          visual_status: visualStatus,
        },
      })),
    } as const;
  }, [stationsWithCoordinates]);

  const bounds = useMemo(() => {
    return collectMapBounds({ declarationPoint, snappedPoint, path: pathGeoJson ?? undefined });
  }, [declarationPoint, pathGeoJson, snappedPoint]);

  useEffect(() => {
    if (!bounds || !mapRef.current) return;
    mapRef.current.fitBounds(bounds as LngLatBoundsLike, {
      padding: 56,
      duration: 0,
      maxZoom: 13,
    });
  }, [bounds]);

  useEffect(() => {
    if (!containerRef.current || !mapRef.current) return;
    const observer = new ResizeObserver(() => {
      mapRef.current?.resize();
      if (bounds) {
        mapRef.current?.fitBounds(bounds as LngLatBoundsLike, {
          padding: 56,
          duration: 0,
          maxZoom: 13,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [bounds]);

  const satStation = (topologyResult?.stations_detectees ?? []).find((station) => isSatStation(station));
  const gardeStation = (topologyResult?.stations_detectees ?? []).find((station) => isGardeStation(station));

  const mapMessage = error
    ? error
    : !topologyResult
      ? "Lancez l'analyse pour afficher le parcours aval."
      : pathFeatureCount === 0
        ? "Le backend n'a retourne aucun parcours cartographique exploitable."
        : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="rounded-full border border-slate-300 bg-white px-3 py-1">Point declare</span>
        <span className="rounded-full border border-sky-300 bg-sky-50 px-3 py-1">Point snappe</span>
        <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1">Parcours topologique</span>
        <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1">Station suffisante</span>
        <span className="rounded-full border border-rose-300 bg-rose-50 px-3 py-1">Station insuffisante</span>
      </div>

      <div ref={containerRef} className="relative h-[460px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        <Map
          ref={mapRef}
          initialViewState={DEFAULT_VIEW}
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          onClick={() => setPopup(null)}
        >
          {pathGeoJson && pathFeatureCount > 0 && (
            <Source id="declaration-path" type="geojson" data={pathGeoJson}>
              <Layer
                id="declaration-path-line"
                type="line"
                paint={{
                  "line-color": "#f59e0b",
                  "line-width": 4,
                  "line-opacity": 0.9,
                }}
              />
            </Source>
          )}

          {declaredPointGeoJson && (
            <Source id="declaration-point" type="geojson" data={declaredPointGeoJson}>
              <Layer
                id="declaration-point-circle"
                type="circle"
                paint={{
                  "circle-radius": 8,
                  "circle-color": "#0f172a",
                  "circle-stroke-color": "#ffffff",
                  "circle-stroke-width": 2,
                }}
              />
            </Source>
          )}

          {snappedPointGeoJson && (
            <Source id="snapped-point" type="geojson" data={snappedPointGeoJson}>
              <Layer
                id="snapped-point-circle"
                type="circle"
                paint={{
                  "circle-radius": 7,
                  "circle-color": "#0ea5e9",
                  "circle-stroke-color": "#ffffff",
                  "circle-stroke-width": 2,
                }}
              />
            </Source>
          )}

          {stationGeoJson && (
            <Source id="detected-stations" type="geojson" data={stationGeoJson}>
              <Layer
                id="detected-stations-circle"
                type="circle"
                paint={{
                  "circle-radius": 7,
                  "circle-color": [
                    "match",
                    ["get", "visual_status"],
                    "SUFFISANT",
                    "#16a34a",
                    "INSUFFISANT",
                    "#dc2626",
                    "#64748b",
                  ],
                  "circle-stroke-color": "#ffffff",
                  "circle-stroke-width": 2,
                }}
              />
            </Source>
          )}

          {popup?.kind === "declared" && (
            <Popup
              longitude={popup.point.coordinates[0]}
              latitude={popup.point.coordinates[1]}
              closeButton={false}
              offset={18}
            >
              <div className="space-y-1 text-xs">
                <div className="font-semibold text-slate-900">Point declare</div>
                <div>Coordonnees: {formatPoint(popup.point)}</div>
                <div>Polluant: {declaration?.polluant ?? "-"}</div>
                <div>Reference: {declaration?.reference ?? "-"}</div>
              </div>
            </Popup>
          )}

          {popup?.kind === "snapped" && (
            <Popup
              longitude={popup.point.coordinates[0]}
              latitude={popup.point.coordinates[1]}
              closeButton={false}
              offset={18}
            >
              <div className="space-y-1 text-xs">
                <div className="font-semibold text-slate-900">Point snappe</div>
                <div>Coordonnees: {formatPoint(popup.point)}</div>
                <div>Distance de snap: {topologyResult?.snap_distance_m ?? "-"} m</div>
                <div>Confiance: {topologyResult?.confidence_level ?? "-"}</div>
              </div>
            </Popup>
          )}

          {popup?.kind === "station" && (
            <Popup
              longitude={popup.point.coordinates[0]}
              latitude={popup.point.coordinates[1]}
              closeButton={false}
              offset={18}
            >
              <div className="space-y-1 text-xs">
                <div className="font-semibold text-slate-900">
                  {popup.station.station_name ?? popup.station.target_name ?? popup.station.station_code ?? "Station"}
                </div>
                <div>Coordonnees: {formatPoint(popup.point)}</div>
                {isSatStation(popup.station) && (
                  <>
                    <div>Concentration estimee: {matrixResult?.C_SidiAllalTazi_mg_L ?? "-"} mg/L</div>
                    <div>Statut: {matrixResult?.statut_sidi_allal_tazi ?? "-"}</div>
                  </>
                )}
                {isGardeStation(popup.station) && (
                  <>
                    <div>Concentration estimee: {matrixResult?.C_BgGarde_mg_L ?? "-"} mg/L</div>
                    <div>Statut: {matrixResult?.statut_bg_garde ?? "-"}</div>
                    <div>Garde atteint: {topologyResult?.barrage_garde_atteint ? "Oui" : "Non"}</div>
                  </>
                )}
              </div>
            </Popup>
          )}
        </Map>

        {declarationPoint && (
          <button
            type="button"
            className="absolute left-4 bottom-4 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow"
            onClick={() => setPopup({ kind: "declared", point: declarationPoint })}
          >
            Ouvrir popup point declare
          </button>
        )}

        {snappedPoint && (
          <button
            type="button"
            className="absolute left-44 bottom-4 rounded-lg border border-sky-300 bg-sky-50 px-3 py-2 text-xs font-medium text-sky-800 shadow"
            onClick={() => setPopup({ kind: "snapped", point: snappedPoint })}
          >
            Ouvrir popup point snappe
          </button>
        )}

        {mapMessage && (
          <div className="pointer-events-none absolute inset-x-4 top-4 rounded-lg border border-slate-300 bg-white/95 px-4 py-3 text-sm text-slate-700 shadow">
            {mapMessage}
          </div>
        )}

        {isLoading && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/60 text-sm font-medium text-slate-700">
            Analyse en cours. Chargement du parcours aval...
          </div>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
          <div className="font-semibold text-slate-900">Point declare</div>
          <div className="mt-1 text-slate-600">{formatPoint(declarationPoint)}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
          <div className="font-semibold text-slate-900">Point snappe</div>
          <div className="mt-1 text-slate-600">{formatPoint(snappedPoint)}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
          <div className="font-semibold text-slate-900">Sidi Allal Tazi</div>
          <div className="mt-1 text-slate-600">Detectee: {topologyResult?.sidi_allal_tazi_detectee ? "Oui" : "Non"}</div>
          <div className="text-slate-600">Statut: {matrixResult?.statut_sidi_allal_tazi ?? "-"}</div>
          <div className="text-slate-600">Concentration: {matrixResult?.C_SidiAllalTazi_mg_L ?? "-"}</div>
          {satStation && stationCoordinates(satStation) && (
            <button
              type="button"
              className="mt-2 text-xs font-medium text-sky-700 underline"
              onClick={() => setPopup({ kind: "station", station: satStation, point: stationCoordinates(satStation) as GeoJsonPoint })}
            >
              Ouvrir popup SAT
            </button>
          )}
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
          <div className="font-semibold text-slate-900">Amont Barrage de Garde</div>
          <div className="mt-1 text-slate-600">Atteint: {topologyResult?.barrage_garde_atteint ? "Oui" : "Non"}</div>
          <div className="text-slate-600">Statut: {matrixResult?.statut_bg_garde ?? "-"}</div>
          <div className="text-slate-600">Concentration: {matrixResult?.C_BgGarde_mg_L ?? "-"}</div>
          {gardeStation && stationCoordinates(gardeStation) && (
            <button
              type="button"
              className="mt-2 text-xs font-medium text-sky-700 underline"
              onClick={() => setPopup({ kind: "station", station: gardeStation, point: stationCoordinates(gardeStation) as GeoJsonPoint })}
            >
              Ouvrir popup Garde
            </button>
          )}
        </div>
      </div>

      {!!warnings?.length && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="font-semibold">Warnings API</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {warnings.map((warning, index) => (
              <li key={`${index}-${warning}`}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {!!topologyResult?.warnings?.length && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="font-semibold">Warnings topologiques</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {topologyResult.warnings.map((warning, index) => (
              <li key={`${index}-${warning}`}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {!!topologyResult?.diagnostic_messages?.length && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <div className="font-semibold text-slate-900">Diagnostics topologiques</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {topologyResult.diagnostic_messages.map((message, index) => (
              <li key={`${index}-${message}`}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {!!stationsWithCoordinates.length && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <div className="font-semibold text-slate-900">Stations cartographiees</div>
          <ul className="mt-2 grid gap-2 md:grid-cols-2">
            {stationsWithCoordinates.map(({ station, point, visualStatus }) => (
              <li key={`${station.station_id ?? station.station_name ?? point.coordinates.join(",")}`} className="rounded border border-slate-200 p-3">
                <div className="font-medium text-slate-900">
                  {station.station_name ?? station.target_name ?? station.station_code ?? "Station"}
                </div>
                <div className="text-xs text-slate-500">{formatPoint(point)}</div>
                <div className="mt-1 text-xs" style={{ color: statusColor(visualStatus) }}>
                  Statut visuel: {visualStatus}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!!stationsWithoutCoordinates.length && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <div className="font-semibold text-slate-900">Stations detectees sans coordonnees cartographiques</div>
          <div className="mt-1 text-xs text-slate-500">
            Le contrat declaration retourne bien les stations detectees, mais certaines ne portent pas encore de latitude/longitude. Elles restent visibles dans le panneau resultat sans positionnement geographique local.
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {stationsWithoutCoordinates.map((station, index) => (
              <li key={`${index}-${station.station_id ?? station.station_name ?? station.target_node ?? "station"}`}>
                {station.station_name ?? station.target_name ?? station.station_code ?? station.target_node ?? "Station"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
