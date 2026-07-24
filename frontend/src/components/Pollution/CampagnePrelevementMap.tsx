import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, Popup, type MapRef, type ViewStateChangeEvent } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import type { PrelevementListItem } from "@/api/pollutionCampagnes";

interface CampagnePrelevementMapProps {
  prelevements: PrelevementListItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading?: boolean;
}

const CAMPAGNE_COLORS: Record<string, string> = {
  IDP_GLOBALE_2024: "#2563eb", // blue
  IDP_MARCHE_CADRE_2024: "#16a34a", // green
  INCONNU: "#64748b",
};

const SEBOU_VIEW_STATE = {
  latitude: 34.15,
  longitude: -5.35,
  zoom: 7.8,
};

const SEBOU_BOUNDS_ZOOM = 7.2;

function isValidSebouCoordinate(point: PrelevementListItem) {
  return (
    typeof point.longitude === "number" &&
    Number.isFinite(point.longitude) &&
    typeof point.latitude === "number" &&
    Number.isFinite(point.latitude) &&
    point.longitude >= -8 &&
    point.longitude <= -2 &&
    point.latitude >= 31 &&
    point.latitude <= 36
  );
}

function getPointsBounds(points: PrelevementListItem[]) {
  if (!points.length) return null;

  const longitudes = points.map((point) => point.longitude as number);
  const latitudes = points.map((point) => point.latitude as number);

  return {
    minLon: Math.min(...longitudes),
    maxLon: Math.max(...longitudes),
    minLat: Math.min(...latitudes),
    maxLat: Math.max(...latitudes),
  };
}

function getBoundsKey(bounds: ReturnType<typeof getPointsBounds>) {
  if (!bounds) return "campagnes-empty";
  return [
    bounds.minLon.toFixed(4),
    bounds.minLat.toFixed(4),
    bounds.maxLon.toFixed(4),
    bounds.maxLat.toFixed(4),
  ].join(":");
}

export default function CampagnePrelevementMap({
  prelevements,
  selectedId,
  onSelect,
  loading,
}: CampagnePrelevementMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [hovered, setHovered] = useState<PrelevementListItem | null>(null);
  const [viewState, setViewState] = useState(SEBOU_VIEW_STATE);

  const points = useMemo(
    () => prelevements.filter(isValidSebouCoordinate),
    [prelevements]
  );

  const pointsBounds = useMemo(() => getPointsBounds(points), [points]);

  const mapKey = useMemo(() => getBoundsKey(pointsBounds), [pointsBounds]);

  const initialViewState = useMemo(() => {
    if (!pointsBounds) return SEBOU_VIEW_STATE;

    return {
      latitude: (pointsBounds.minLat + pointsBounds.maxLat) / 2,
      longitude: (pointsBounds.minLon + pointsBounds.maxLon) / 2,
      zoom: SEBOU_BOUNDS_ZOOM,
    };
  }, [pointsBounds]);

  useEffect(() => {
    setViewState(initialViewState);
  }, [initialViewState]);

  const fitMapToPoints = useCallback((duration = 500) => {
    const map = mapRef.current;
    if (!map || !pointsBounds) return;

    window.requestAnimationFrame(() => {
      map.resize();

      if (pointsBounds.minLon === pointsBounds.maxLon && pointsBounds.minLat === pointsBounds.maxLat) {
        map.flyTo({
          center: [pointsBounds.minLon, pointsBounds.minLat],
          zoom: 10,
          duration,
        });
        return;
      }

      const bounds: [[number, number], [number, number]] = [
        [pointsBounds.minLon, pointsBounds.minLat],
        [pointsBounds.maxLon, pointsBounds.maxLat],
      ];

      map.fitBounds(bounds, {
        padding: 70,
        duration,
        maxZoom: 10,
      });
    });
  }, [pointsBounds]);

  useEffect(() => {
    fitMapToPoints();
  }, [fitMapToPoints]);

  const selected = useMemo(
    () => points.find((p) => p.id_prelevement === selectedId) || null,
    [points, selectedId]
  );

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
      <Map
        key={mapKey}
        ref={mapRef}
        {...viewState}
        onMove={(event: ViewStateChangeEvent) => setViewState(event.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        onLoad={() => fitMapToPoints(0)}
      >
        {points.map((p) => {
          const color = CAMPAGNE_COLORS[p.campagne_id] || CAMPAGNE_COLORS.INCONNU;
          const isSelected = p.id_prelevement === selectedId;
          return (
            <Marker
              key={p.id_prelevement}
              longitude={p.longitude!}
              latitude={p.latitude!}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                onSelect(p.id_prelevement);
              }}
            >
              <div
                className={`flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded-full border-2 border-white shadow-sm transition-all ${
                  isSelected ? "ring-2 ring-yellow-400 ring-offset-1" : ""
                }`}
                style={{ backgroundColor: p.nb_alertes > 0 ? "#dc2626" : color }}
                onMouseEnter={() => setHovered(p)}
                onMouseLeave={() => setHovered(null)}
              />
            </Marker>
          );
        })}

        {(hovered || selected) && (
          <Popup
            longitude={(hovered ?? selected)!.longitude!}
            latitude={(hovered ?? selected)!.latitude!}
            closeButton={false}
            closeOnClick={false}
            anchor="bottom"
            offset={12}
          >
            <div className="max-w-[240px] text-sm">
              <div className="font-semibold text-slate-900">
                {(hovered ?? selected)!.point_prelevement || "Point sans nom"}
              </div>
              <div className="text-xs text-slate-500">
                {(hovered ?? selected)!.campagne_id} —{" "}
                {new Date((hovered ?? selected)!.date_prelevement).toLocaleDateString("fr-MA")}
              </div>
              <div className="mt-1 text-xs text-slate-600">
                {(hovered ?? selected)!.nb_mesures} mesures
                {(hovered ?? selected)!.nb_alertes > 0 && (
                  <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-red-700">
                    {(hovered ?? selected)!.nb_alertes} alerte
                    {(hovered ?? selected)!.nb_alertes > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </Popup>
        )}
      </Map>

      <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow">
        <div className="font-medium text-slate-900">Prélèvements de campagne</div>
        <div className="text-slate-500">
          {points.length} point{points.length > 1 ? "s" : ""} affiché
          {points.length > 1 ? "s" : ""}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow">
        <div className="mb-1.5 font-medium text-slate-900">Légende</div>
        <div className="space-y-1">
          {Object.entries(CAMPAGNE_COLORS).map(([key, color]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full border border-white" style={{ backgroundColor: color }} />
              <span className="text-slate-600">{key === "INCONNU" ? "Inconnu" : key}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full border border-white bg-red-600" />
            <span className="text-slate-600">Avec alerte</span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 grid place-items-center bg-white/60">
          <div className="rounded-lg bg-white px-4 py-2 text-sm font-medium shadow">Chargement...</div>
        </div>
      )}
    </div>
  );
}
