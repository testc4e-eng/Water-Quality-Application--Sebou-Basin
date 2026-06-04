import { useEffect, useMemo, useRef, useState } from "react";
import type { FeatureCollection, Geometry } from "geojson";
import type { LayerProps, MapLayerMouseEvent, MapRef, ViewStateChangeEvent } from "react-map-gl/maplibre";
import Map, { Layer, Popup, Source } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import {
  parseLatestValues,
  strongestClassification,
  type MapBusinessFeature,
  type MapBusinessFeatureCollection,
  type MapBusinessEntityProperties,
} from "@/api/mapBusiness";

import { BusinessLegend, QUALITY_CLASS_COLORS } from "./BusinessLegend";
import { BusinessPopup } from "./BusinessPopup";

interface BusinessMapProps {
  data?: MapBusinessFeatureCollection;
  loading?: boolean;
  error?: Error | null;
  entitiesVisible?: boolean;
  symbologyMode?: "classification" | "metadata";
  onFeatureSelect?: (feature: MapBusinessFeature | null) => void;
  mode?: "default" | "home";
  overlayTitle?: string;
  overlaySubtitle?: string;
  emptyMessage?: string;
}

type EnrichedProperties = MapBusinessEntityProperties & {
  map_color?: string | null;
  map_class_code?: string | null;
};

const layerStyle: LayerProps = {
  id: "business-map-entities",
  type: "circle",
  paint: {
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 6, 5, 12, 9],
    "circle-color": ["coalesce", ["get", "map_color"], "#64748b"],
    "circle-stroke-color": "#ffffff",
    "circle-stroke-width": 1.4,
    "circle-opacity": 0.9,
  },
};

function metadataColor(properties: MapBusinessEntityProperties): string {
  if (properties.data_status === "NOT_YET_MAPPED" || properties.geometry_status === "NOT_YET_MAPPED") return "#64748b";
  if (properties.validation_status === "TO_VALIDATE") return "#f59e0b";
  if (properties.support_group === "stations") return "#0284c7";
  if (properties.support_group?.startsWith("inventaire")) return "#0f766e";
  return "#2563eb";
}

function enrichFeature(
  feature: MapBusinessFeature,
  symbologyMode: "classification" | "metadata"
): MapBusinessFeature {
  const latestValues = parseLatestValues(feature.properties.latest_values);
  const classification = strongestClassification(latestValues);
  const classCode = classification?.class_code ?? null;
  const classColor = classification?.color || (classCode ? QUALITY_CLASS_COLORS[classCode] : null);
  const properties: EnrichedProperties = {
    ...feature.properties,
    map_class_code: classCode,
    map_color: symbologyMode === "classification" ? classColor || "#64748b" : metadataColor(feature.properties),
  };
  return { ...feature, properties };
}

function buildMapData(
  data: MapBusinessFeatureCollection | undefined,
  symbologyMode: "classification" | "metadata"
): FeatureCollection | undefined {
  if (!data) return undefined;
  return {
    ...data,
    features: data.features.map((feature) => enrichFeature(feature, symbologyMode)),
  };
}

function collectCoordinates(geometry: Geometry | null | undefined, output: [number, number][] = []): [number, number][] {
  if (!geometry) return output;
  if (geometry.type === "GeometryCollection") {
    geometry.geometries.forEach((child) => collectCoordinates(child, output));
    return output;
  }

  const walk = (value: unknown): void => {
    if (!Array.isArray(value)) return;
    if (typeof value[0] === "number" && typeof value[1] === "number") {
      output.push([value[0], value[1]]);
      return;
    }
    value.forEach(walk);
  };

  walk(geometry.coordinates);
  return output;
}

function boundsFromFeatures(data: FeatureCollection | undefined): [[number, number], [number, number]] | null {
  const coordinates = data?.features.flatMap((feature) => collectCoordinates(feature.geometry)) ?? [];
  const valid = coordinates.filter(([lng, lat]) => Number.isFinite(lng) && Number.isFinite(lat));
  if (!valid.length) return null;
  const lngs = valid.map(([lng]) => lng);
  const lats = valid.map(([, lat]) => lat);
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
}

export function BusinessMap({
  data,
  loading,
  error,
  entitiesVisible = true,
  symbologyMode = "classification",
  onFeatureSelect,
  mode = "default",
  overlayTitle = "Carte metier P0",
  overlaySubtitle,
  emptyMessage = "Selectionner un support metier puis cliquer sur Afficher.",
}: BusinessMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [viewState, setViewState] = useState({
    longitude: -4.8,
    latitude: 34.4,
    zoom: 7.0,
    pitch: 0,
    bearing: 0,
  });
  const [selected, setSelected] = useState<{
    longitude: number;
    latitude: number;
    properties: MapBusinessEntityProperties;
  } | null>(null);

  const mapData = useMemo(() => buildMapData(data, symbologyMode), [data, symbologyMode]);
  const featureCount = data?.features.length ?? 0;

  useEffect(() => {
    if (!mapData || mapData.features.length === 0) return;
    const bounds = boundsFromFeatures(mapData);
    if (!bounds) return;

    window.setTimeout(() => {
      const map = mapRef.current;
      if (!map) return;
      const [[minLng, minLat], [maxLng, maxLat]] = bounds;
      if (minLng === maxLng && minLat === maxLat) {
        map.flyTo({ center: [minLng, minLat], zoom: 11, duration: 500 });
        return;
      }
      map.fitBounds(bounds, { padding: 70, duration: 500, maxZoom: 12 });
    }, 80);
  }, [mapData]);

  const handleClick = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature) return;
    const selectedFeature = feature as unknown as MapBusinessFeature;
    const properties = selectedFeature.properties;
    setSelected({ longitude: event.lngLat.lng, latitude: event.lngLat.lat, properties });
    onFeatureSelect?.(selectedFeature);
  };

  return (
    <div className="relative h-full min-h-[660px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(event: ViewStateChangeEvent) => setViewState(event.viewState)}
        onClick={handleClick}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        interactiveLayerIds={entitiesVisible ? ["business-map-entities"] : []}
        cursor="grab"
      >
        {mapData && entitiesVisible && (
          <Source id="business-map-source" type="geojson" data={mapData}>
            <Layer {...layerStyle} />
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
            <BusinessPopup properties={selected.properties} />
          </Popup>
        )}
      </Map>

      <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-sm shadow">
        <div className="font-medium text-slate-900">{overlayTitle}</div>
        <div className="text-xs text-slate-600">
          {overlaySubtitle || `${featureCount.toLocaleString("fr-MA")} entites affichees`}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 w-56">
        <BusinessLegend mode={symbologyMode} />
      </div>

      {loading && (
        <div className="absolute inset-0 grid place-items-center bg-white/70">
          <div className="rounded-lg bg-white px-4 py-3 text-sm font-medium shadow">Chargement de la couche...</div>
        </div>
      )}

      {error && (
        <div className="absolute inset-x-4 bottom-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow">
          Erreur de chargement : {error.message}
        </div>
      )}

      {!loading && !mapData && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="max-w-sm rounded-lg border border-slate-200 bg-white px-5 py-4 text-center text-sm text-slate-600 shadow-sm">
            {emptyMessage}
          </div>
        </div>
      )}

      {!loading && mapData && mapData.features.length === 0 && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="max-w-sm rounded-lg border border-slate-200 bg-white px-5 py-4 text-center text-sm text-slate-600 shadow-sm">
            Aucune entite pour ce support.
          </div>
        </div>
      )}
    </div>
  );
}
