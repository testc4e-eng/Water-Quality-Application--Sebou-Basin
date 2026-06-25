import { useMemo, useState } from "react";
import type { MapLayerMouseEvent, ViewStateChangeEvent } from "react-map-gl/maplibre";
import Map, { Layer, Popup, Source } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import type {
  PollutionLatestResult,
  PollutionSiteProperties,
  PollutionSitesGeoJson,
  PollutionSymbologyMode,
} from "@/api/pollutionIdp";

interface PollutionIdpMapProps {
  data?: PollutionSitesGeoJson;
  loading?: boolean;
  error?: Error | null;
  symbologyMode?: PollutionSymbologyMode;
  selectedSiteId?: string | null;
  onSiteSelect?: (properties: PollutionSiteProperties) => void;
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

  const featureCount = data?.features.length ?? 0;
  const sitesWithResults = useMemo(
    () => data?.features.filter((feature) => parseLatestResults(feature.properties.latest_results).length > 0).length ?? 0,
    [data]
  );
  const mapData = useMemo(() => buildMapData(data), [data]);

  const onClick = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature) return;
    const properties = feature.properties as PollutionSiteProperties;
    setSelected({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      properties,
    });
    onSiteSelect?.(properties);
  };

  return (
    <div className="relative h-full min-h-[640px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
      <Map
        {...viewState}
        onMove={(event: ViewStateChangeEvent) => setViewState(event.viewState)}
        onClick={onClick}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        interactiveLayerIds={["pollution-idp-sites"]}
        cursor="grab"
      >
        {mapData && (
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
      </Map>

      <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-sm shadow">
        <div className="font-medium text-slate-900">Sites IDP pollution</div>
        <div className="text-xs text-slate-600">
          {featureCount.toLocaleString("fr-MA")} sites affiches, {sitesWithResults.toLocaleString("fr-MA")} avec resultats P0
        </div>
      </div>

      {symbologyMode === "regulatory_status" && (
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
    </div>
  );
}
