import { useEffect, useMemo, useRef, useState } from "react";
import type { FeatureCollection, Geometry } from "geojson";
import type { LayerProps, MapLayerMouseEvent, MapRef, ViewStateChangeEvent } from "react-map-gl/maplibre";
import Map, { Layer, Marker, Popup, Source } from "react-map-gl/maplibre";
import { Building2, CloudRain, ShieldCheck, Waves } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";

import {
  parseLatestValues,
  strongestClassification,
  type MapBusinessFeature,
  type MapBusinessFeatureCollection,
  type MapBusinessEntityProperties,
} from "@/api/mapBusiness";
import { useMapEntityDetail } from "@/hooks/useMapBusiness";

import { BusinessLegend, QUALITY_CLASS_COLORS } from "./BusinessLegend";
import { BusinessPopup } from "./BusinessPopup";

interface BusinessMapProps {
  data?: MapBusinessFeatureCollection;
  loading?: boolean;
  error?: Error | null;
  entitiesVisible?: boolean;
  symbologyMode?: "classification" | "metadata";
  onFeatureSelect?: (feature: MapBusinessFeature | null) => void;
  mode?: "default" | "full" | "home";
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

function getPointCoordinates(feature: MapBusinessFeature): [number, number] | null {
  if (feature.geometry?.type !== "Point") return null;
  const [lng, lat] = feature.geometry.coordinates;
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  return [lng, lat];
}

function getHomeMarkerStyle(properties: MapBusinessEntityProperties) {
  if (properties.entity_type === "barrage" || properties.support === "barrages" || properties.support_type === "barrage") {
    return {
      Icon: Building2,
      containerClassName: "bg-amber-500 text-white ring-amber-100",
      iconClassName: "h-3.5 w-3.5",
      label: "Barrage",
    };
  }

  if (properties.support_type === "hydro" || properties.entity_type === "station_hydro") {
    return {
      Icon: Waves,
      containerClassName: "bg-blue-600 text-white ring-blue-100",
      iconClassName: "h-3.5 w-3.5",
      label: "Station hydro",
    };
  }

  if (properties.support_type === "pluvio" || properties.entity_type === "station_pluvio") {
    return {
      Icon: CloudRain,
      containerClassName: "bg-cyan-500 text-white ring-cyan-100",
      iconClassName: "h-3.5 w-3.5",
      label: "Station pluvio",
    };
  }

  return {
    Icon: ShieldCheck,
    containerClassName: "bg-emerald-600 text-white ring-emerald-100",
    iconClassName: "h-3.5 w-3.5",
    label: "Station qualité",
  };
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
    feature: MapBusinessFeature;
    properties: MapBusinessEntityProperties;
  } | null>(null);

  const mapData = useMemo(() => buildMapData(data, symbologyMode), [data, symbologyMode]);
  const featureCount = data?.features.length ?? 0;
  const isHomeMode = mode === "home";
  const homeMarkerFeatures = useMemo(
    () => (isHomeMode ? data?.features.filter((feature) => getPointCoordinates(feature)) ?? [] : []),
    [data?.features, isHomeMode],
  );
  const selectedDetailQuery = useMapEntityDetail(
    selected
      ? {
          entityId: String(selected.feature.properties.entity_id ?? selected.feature.id),
          support:
            selected.feature.properties.support_group && selected.feature.properties.support_type
              ? undefined
              : (selected.feature.properties.support as string | undefined),
          group_code: selected.feature.properties.support_group as string | undefined,
          support_code: selected.feature.properties.support_type as string | undefined,
        }
      : null,
    Boolean(selected),
  );
  const popupProperties = selectedDetailQuery.data?.properties ?? selected?.properties ?? null;

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
    setSelected({ longitude: event.lngLat.lng, latitude: event.lngLat.lat, feature: selectedFeature, properties });
    onFeatureSelect?.(selectedFeature);
  };

  return (
    <div
      className={[
        "relative h-full overflow-hidden border border-slate-200 bg-slate-100",
        isHomeMode ? "min-h-[360px] rounded-[20px]" : "min-h-[660px] rounded-lg",
      ].join(" ")}
    >
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(event: ViewStateChangeEvent) => setViewState(event.viewState)}
        onClick={handleClick}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        interactiveLayerIds={!isHomeMode && entitiesVisible ? ["business-map-entities"] : []}
        cursor="grab"
      >
        {!isHomeMode && mapData && entitiesVisible && (
          <Source id="business-map-source" type="geojson" data={mapData}>
            <Layer {...layerStyle} />
          </Source>
        )}

        {isHomeMode &&
          entitiesVisible &&
          homeMarkerFeatures.map((feature, index) => {
            const coordinates = getPointCoordinates(feature);
            if (!coordinates) return null;
            const [longitude, latitude] = coordinates;
            const markerStyle = getHomeMarkerStyle(feature.properties);
            const markerTitle =
              feature.properties.label || feature.properties.display_label || feature.properties.support_type || "Entité";

            return (
              <Marker
                key={String(feature.properties.entity_id ?? feature.id ?? `home-marker-${index}`)}
                longitude={longitude}
                latitude={latitude}
                anchor="bottom"
              >
                <button
                  type="button"
                  title={`${markerStyle.label} — ${markerTitle}`}
                  aria-label={`${markerStyle.label} — ${markerTitle}`}
                  className={`grid h-8 w-8 place-items-center rounded-full border-2 border-white shadow-lg ring-4 transition-transform hover:scale-105 ${markerStyle.containerClassName}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelected({ longitude, latitude, feature, properties: feature.properties });
                    onFeatureSelect?.(feature);
                  }}
                >
                  <markerStyle.Icon className={markerStyle.iconClassName} />
                </button>
              </Marker>
            );
          })}

        {selected && popupProperties && (
          <Popup
            longitude={selected.longitude}
            latitude={selected.latitude}
            closeButton
            closeOnClick={false}
            maxWidth="360px"
            onClose={() => setSelected(null)}
          >
            <BusinessPopup properties={popupProperties} />
          </Popup>
        )}
      </Map>

      {isHomeMode ? (
        <div className="pointer-events-none absolute left-3 top-3 rounded-2xl border border-white/70 bg-white/90 px-2.5 py-1.5 shadow backdrop-blur">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{overlayTitle}</div>
          <div className="text-xs font-semibold text-slate-900">{featureCount.toLocaleString("fr-MA")} entités</div>
        </div>
      ) : (
        <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-sm shadow">
          <div className="font-medium text-slate-900">{overlayTitle}</div>
          <div className="text-xs text-slate-600">
            {overlaySubtitle || `${featureCount.toLocaleString("fr-MA")} entites affichees`}
          </div>
        </div>
      )}

      {!isHomeMode ? (
        <div className="pointer-events-none absolute bottom-4 left-4 w-56">
          <BusinessLegend mode={symbologyMode} />
        </div>
      ) : null}

      {loading && (
        <div className="absolute inset-0 grid place-items-center bg-white/70">
          <div className={`bg-white font-medium shadow ${isHomeMode ? "rounded-2xl px-3 py-2 text-xs" : "rounded-lg px-4 py-3 text-sm"}`}>
            Chargement de la couche...
          </div>
        </div>
      )}

      {error && (
        <div className={`absolute border border-red-200 bg-red-50 text-red-700 shadow ${isHomeMode ? "inset-x-3 bottom-3 rounded-2xl px-3 py-2 text-xs" : "inset-x-4 bottom-4 rounded-lg px-4 py-3 text-sm"}`}>
          Erreur de chargement : {error.message}
        </div>
      )}

      {!loading && !mapData && (
        <div className="absolute inset-0 grid place-items-center">
          <div className={`max-w-sm border border-slate-200 bg-white text-center text-slate-600 shadow-sm ${isHomeMode ? "rounded-2xl px-4 py-3 text-xs" : "rounded-lg px-5 py-4 text-sm"}`}>
            {emptyMessage}
          </div>
        </div>
      )}

      {!loading && mapData && mapData.features.length === 0 && (
        <div className="absolute inset-0 grid place-items-center">
          <div className={`max-w-sm border border-slate-200 bg-white text-center text-slate-600 shadow-sm ${isHomeMode ? "rounded-2xl px-4 py-3 text-xs" : "rounded-lg px-5 py-4 text-sm"}`}>
            Aucune entite pour ce support.
          </div>
        </div>
      )}
    </div>
  );
}
