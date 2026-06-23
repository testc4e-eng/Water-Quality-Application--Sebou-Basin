import { useState, useMemo, useRef } from "react";
import type { MapLayerMouseEvent, MapRef, ViewStateChangeEvent } from "react-map-gl/maplibre";
import Map, { Source, Layer, Popup, NavigationControl, FullscreenControl } from "react-map-gl/maplibre";
import { useBusinessMapFeatures } from "@/hooks/useBusinessMapV1";
import "maplibre-gl/dist/maplibre-gl.css";
import { Loader2, Maximize, Navigation, Activity, Plus } from "lucide-react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { findParameter } from "@/config/thematiques.config";

export interface MapV1Props {
  filters: {
    support_type?: string;
    domain?: string;
    subdomain?: string;
    parameter_code?: string;
    bassin_nom?: string;
  };
  onSelectObject: (support_type: string, object_id: string) => void;
}

const SEBOU_BOUNDS: [number, number, number, number] = [-6.77, 33.15, -4.0, 35.15];

export function MapV1({ filters, onSelectObject }: MapV1Props) {
  const mapRef = useRef<MapRef>(null);
  const { mode, selectedDomain, selectedParameter, selectedThematic, selectedSubThematic, addSeriesRequest } = useWorkspaceStore();

  const activeThematicParam = useMemo(() => {
    if (mode !== 'thematic' || !selectedThematic || !selectedSubThematic || !selectedParameter) return null;
    return findParameter(selectedThematic, selectedSubThematic, selectedParameter);
  }, [mode, selectedThematic, selectedSubThematic, selectedParameter]);
  
  const [viewState, setViewState] = useState({
    longitude: -5.3,
    latitude: 34.1,
    zoom: 7,
  });

  const activeFilters = mode === 'thematic'
    ? activeThematicParam
      ? { ...filters, domain: activeThematicParam.domain, parameter_code: activeThematicParam.code }
      : { ...filters, domain: undefined, parameter_code: undefined }
    : mode === 'domain'
      ? selectedParameter
        ? { domain: selectedDomain || undefined, parameter_code: selectedParameter }
        : { ...filters, domain: undefined, parameter_code: undefined }
      : filters;

  const { data: featureCollection, isLoading } = useBusinessMapFeatures({
    support_type: activeFilters.support_type,
    domain: activeFilters.domain,
    subdomain: activeFilters.subdomain,
    parameter_code: activeFilters.parameter_code,
    bassin_nom: activeFilters.bassin_nom,
    limit: 5000,
  });

  const [hoverInfo, setHoverInfo] = useState<{
    x: number;
    y: number;
    properties: Record<string, any>;
  } | null>(null);

  const [selectedFeature, setSelectedFeature] = useState<{
    longitude: number;
    latitude: number;
    properties: Record<string, any>;
  } | null>(null);

  const handleMouseEnter = (event: MapLayerMouseEvent) => {
    if (event.features && event.features.length > 0) {
      const feature = event.features[0];
      if (feature.layer.id === "clusters") {
        if (mapRef.current) mapRef.current.getCanvas().style.cursor = "pointer";
        return;
      }
      setHoverInfo({
        x: event.point.x,
        y: event.point.y,
        properties: feature.properties || {},
      });
      if (mapRef.current) {
        mapRef.current.getCanvas().style.cursor = "pointer";
      }
    }
  };

  const handleMouseLeave = () => {
    setHoverInfo(null);
    if (mapRef.current) {
      mapRef.current.getCanvas().style.cursor = "";
    }
  };

  const handleClick = (event: MapLayerMouseEvent) => {
    if (event.features && event.features.length > 0) {
      const feature = event.features[0];
      
      if (feature.layer.id === "clusters") {
        const clusterId = feature.properties?.cluster_id;
        const mapboxSource = mapRef.current?.getSource("business-features") as any;
        if (mapboxSource && clusterId) {
          mapboxSource.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
            if (err) return;
            const geom = feature.geometry as any;
            mapRef.current?.easeTo({
              center: geom.coordinates,
              zoom: zoom + 1,
              duration: 500
            });
          });
        }
        return;
      }

      const props = feature.properties;
      const geom = feature.geometry as any;
      if (props && props.object_id && props.support_type && geom?.coordinates) {
        setSelectedFeature({
          longitude: geom.coordinates[0],
          latitude: geom.coordinates[1],
          properties: props
        });
      }
    } else {
      setSelectedFeature(null);
    }
  };

  const handleMove = (evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  };

  const emptyGeoJSON = { type: "FeatureCollection", features: [] };

  return (
    <div className="relative h-full w-full bg-slate-100">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={handleMove}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        interactiveLayerIds={mode === 'thematic' && activeThematicParam ? ["thematic-active-layer", "clusters"] : ["business-points", "clusters"]}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        minZoom={2}
      >
        <NavigationControl position="top-right" />

        <Source
          id="business-features"
          type="geojson"
          data={featureCollection || (emptyGeoJSON as any)}
          cluster={true}
          clusterMaxZoom={12}
          clusterRadius={50}
        >
          <Layer
            id="clusters"
            type="circle"
            filter={["has", "point_count"]}
            paint={{
              "circle-color": [
                "step",
                ["get", "point_count"],
                "#94a3b8", // slate-400
                10, "#64748b",
                50, "#475569"
              ],
              "circle-radius": [
                "step",
                ["get", "point_count"],
                15,
                10, 20,
                50, 25
              ],
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
            }}
          />
          <Layer
            id="cluster-count"
            type="symbol"
            filter={["has", "point_count"]}
            layout={{
              "text-field": "{point_count_abbreviated}",
              "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
              "text-size": 12,
            }}
            paint={{
              "text-color": "#ffffff"
            }}
          />
          {mode !== 'thematic' && (
            <Layer
              id="business-points"
              type="circle"
              filter={["!", ["has", "point_count"]]}
            paint={{
              "circle-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                5, 4,
                10, 6,
                15, 10,
              ],
              "circle-color": [
                "match",
                ["get", "support_type"],
                "STATION_QUALITE", "#3b82f6", // bleu
                "STATION_SENTINELLE", "#0ea5e9", // sky
                "STATION_HYDRO", "#1d4ed8", // bleu foncé
                "STATION_METEO", "#f97316", // orange
                "BARRAGE", "#8b5cf6", // violet
                "POINT_PRELEVEMENT_POLLUTION", "#f43f5e", // rose
                "SOURCE_POLLUTION", "#ef4444", // rouge
                "#94a3b8" // slate-400
              ],
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
              "circle-opacity": 0.9,
            }}
            />
          )}

          {mode === 'thematic' && activeThematicParam && (
            <Layer
              id="thematic-active-layer"
              type="circle"
              filter={["!", ["has", "point_count"]]}
              paint={{
                "circle-radius": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  5, 4,
                  10, 7,
                  15, 11,
                ],
                "circle-stroke-width": 2,
                "circle-stroke-color": "#ffffff",
                "circle-color": [
                  "case",
                  [">=", ["coalesce", ["to-number", ["get", activeThematicParam.code.toLowerCase(), ["object", ["get", "latest_values"]]]], ["to-number", ["get", activeThematicParam.code, ["object", ["get", "latest_values"]]]]], 0],
                  activeThematicParam.domain === 'QUALITE'
                    ? ["step", ["coalesce", ["to-number", ["get", activeThematicParam.code.toLowerCase(), ["object", ["get", "latest_values"]]]], ["to-number", ["get", activeThematicParam.code, ["object", ["get", "latest_values"]]]]], "#ef4444", 3, "#eab308", 7, "#22c55e"]
                    : activeThematicParam.domain === 'POLLUTION'
                      ? ["step", ["coalesce", ["to-number", ["get", activeThematicParam.code.toLowerCase(), ["object", ["get", "latest_values"]]]], ["to-number", ["get", activeThematicParam.code, ["object", ["get", "latest_values"]]]]], "#22c55e", 5, "#eab308", 20, "#ef4444"]
                      : activeThematicParam.domain === 'HYDROLOGIE'
                        ? "#3b82f6"
                        : activeThematicParam.domain === 'METEO'
                          ? "#0ea5e9"
                          : "#64748b",
                  "#94a3b8"
                ],
                "circle-opacity": 0.9,
              }}
            />
          )}
        </Source>

        {hoverInfo && !selectedFeature && (
          <div
            className="absolute z-40 pointer-events-none rounded bg-slate-900/90 px-3 py-2 text-xs text-white shadow-md backdrop-blur-sm"
            style={{ left: hoverInfo.x + 15, top: hoverInfo.y + 15 }}
          >
            <div className="font-bold mb-1">
              {hoverInfo.properties.object_name || hoverInfo.properties.object_code || "Entité"}
            </div>
            <div className="text-slate-300">
              Type: {hoverInfo.properties.support_type}
            </div>
            <div className="text-slate-400 mt-1 italic">Cliquez pour analyser</div>
          </div>
        )}

        {selectedFeature && (
          <Popup
            longitude={selectedFeature.longitude}
            latitude={selectedFeature.latitude}
            anchor="bottom"
            onClose={() => setSelectedFeature(null)}
            closeOnClick={false}
            className="z-50"
          >
            <div className="p-1 min-w-[220px]">
              <div className="font-bold text-sm text-slate-800 mb-1 leading-tight">
                {selectedFeature.properties.object_name || "Entité inconnue"}
              </div>
              <div className="text-xs text-slate-500 mb-2">
                <span className="font-mono bg-slate-100 px-1 rounded">{selectedFeature.properties.object_code}</span>
              </div>
              <div className="text-xs text-slate-600 mb-1">
                <span className="font-semibold">Support:</span> {selectedFeature.properties.support_type}
              </div>
              {selectedFeature.properties.bassin_nom && (
                <div className="text-xs text-slate-600 mb-1">
                  <span className="font-semibold">Bassin:</span> {selectedFeature.properties.bassin_nom}
                </div>
              )}
              <div className="mb-2 rounded border border-slate-200 bg-slate-50 p-1.5 text-[11px]">
                <div className="flex justify-between"><span className="text-slate-500">Nature:</span> <span className="font-medium">{selectedFeature.properties.attributes?.data_temporality === 'POINT_MEASURE' ? 'Donnée ponctuelle' : 'Série temporelle'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Famille:</span> <span className="font-medium">{String(selectedFeature.properties.attributes?.data_family || selectedFeature.properties.data_family || '-')}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Contexte:</span> <span className="font-medium">{String(selectedFeature.properties.attributes?.measurement_context || selectedFeature.properties.measurement_context || '-')}</span></div>
              </div>
              
              {mode === 'thematic' && activeThematicParam ? (
                <>
                  <div className="mb-3 rounded border border-indigo-100 bg-indigo-50 p-2">
                    <div className="text-[10px] font-bold text-indigo-800 uppercase tracking-wide">
                      Métrique: {activeThematicParam.label}
                    </div>
                    <div className="mt-1 text-xs text-indigo-900 font-medium">
                      {(selectedFeature.properties.latest_values &&
                        (selectedFeature.properties.latest_values[activeThematicParam.code] != null ||
                         selectedFeature.properties.latest_values[activeThematicParam.code.toLowerCase()] != null))
                        ? `${activeThematicParam.label}: ${
                            selectedFeature.properties.latest_values[activeThematicParam.code] ??
                            selectedFeature.properties.latest_values[activeThematicParam.code.toLowerCase()]
                          }`
                        : "Aucune valeur récente"}
                    </div>
                  </div>
                  <button
                     onClick={() => {
                       addSeriesRequest({
                         support_type: selectedFeature.properties.support_type,
                         object_id: selectedFeature.properties.object_id || selectedFeature.id || selectedFeature.properties.object_code,
                         domain: activeThematicParam.domain,
                         parameter_code: activeThematicParam.code,
                         object_name: selectedFeature.properties.object_name,
                         data_temporality: String(selectedFeature.properties.attributes?.data_temporality || selectedFeature.properties.data_temporality || 'TIME_SERIES'),
                         data_family: String(selectedFeature.properties.attributes?.data_family || selectedFeature.properties.data_family || ''),
                         measurement_context: String(selectedFeature.properties.attributes?.measurement_context || selectedFeature.properties.measurement_context || '')
                       });
                       setSelectedFeature(null);
                    }}
                    className="w-full mt-2 flex items-center justify-center gap-1.5 rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-500"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Ajouter au Workspace
                  </button>
                </>
              ) : activeFilters.domain && activeFilters.parameter_code ? (
                <>
                  {mode === 'domain' && (
                    <div className="mb-3 rounded border border-indigo-100 bg-indigo-50 p-2">
                      <div className="text-[10px] font-bold text-indigo-800 uppercase tracking-wide">
                        Paramètre: {activeFilters.parameter_code}
                      </div>
                      <div className="mt-1 text-xs text-indigo-900 font-medium">
                        {/* If we have attributes with values, show them. Otherwise show placeholder or just the parameter name */}
                        {(selectedFeature.properties.attributes && (selectedFeature.properties.attributes as any)[activeFilters.parameter_code]) 
                          ? `${(selectedFeature.properties.attributes as any)[activeFilters.parameter_code]}`
                          : "Sélectionné pour analyse"}
                      </div>
                    </div>
                  )}
                  <button 
                    onClick={() => {
                       addSeriesRequest({
                         support_type: selectedFeature.properties.support_type,
                         object_id: selectedFeature.properties.object_id || selectedFeature.id || selectedFeature.properties.object_code,
                         domain: activeFilters.domain?.toUpperCase()!,
                         parameter_code: activeFilters.parameter_code?.toUpperCase()!,
                         object_name: selectedFeature.properties.object_name,
                         data_temporality: String(selectedFeature.properties.attributes?.data_temporality || selectedFeature.properties.data_temporality || 'TIME_SERIES'),
                         data_family: String(selectedFeature.properties.attributes?.data_family || selectedFeature.properties.data_family || ''),
                         measurement_context: String(selectedFeature.properties.attributes?.measurement_context || selectedFeature.properties.measurement_context || '')
                       });
                       setSelectedFeature(null);
                    }}
                    className="w-full mt-2 flex items-center justify-center gap-1.5 rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-500"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {selectedFeature.properties.attributes?.data_temporality === 'POINT_MEASURE' ? 'Voir les valeurs' : 'Analyser en graphique'}
                  </button>
                </>
              ) : (
                <div className="mt-2 text-[10px] text-amber-600 bg-amber-50 p-1.5 rounded border border-amber-100 text-center">
                  Sélectionnez un domaine et paramètre à gauche pour analyser.
                </div>
              )}
            </div>
          </Popup>
        )}
      </Map>

      {/* Légende flottante */}
      {mode !== 'thematic' && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-200 pointer-events-auto flex items-center gap-4 text-xs font-medium text-slate-700">
           <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>Qualité</div>
           <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#1d4ed8]"></div>Hydro</div>
           <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#f97316]"></div>Météo</div>
           <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>Barrages</div>
           <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>Pollution</div>
        </div>
      )}

      {mode === 'thematic' && activeThematicParam && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-200 pointer-events-auto flex flex-col gap-1 text-xs font-medium text-slate-700">
           <div className="font-bold text-[10px] uppercase text-slate-500 text-center mb-1">
             {activeThematicParam.domain === 'QUALITE' ? 'Qualité' : activeThematicParam.domain === 'POLLUTION' ? 'Pollution' : activeThematicParam.domain === 'HYDROLOGIE' ? 'Hydrologie' : activeThematicParam.domain === 'METEO' ? 'Météo' : activeThematicParam.domain} - {activeThematicParam.label}
           </div>
           <div className="flex items-center gap-4">
             {activeThematicParam.domain === 'QUALITE' && (
               <>
                 <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>Bon</div>
                 <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#eab308]"></div>Moyen</div>
                 <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>Mauvais</div>
               </>
             )}
             {activeThematicParam.domain === 'POLLUTION' && (
               <>
                 <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>Faible</div>
                 <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#eab308]"></div>Modéré</div>
                 <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>Élevé</div>
               </>
             )}
             {activeThematicParam.domain === 'HYDROLOGIE' && (
               <>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div>Faible</div>
                 <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>Moyen</div>
                 <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full bg-[#3b82f6]"></div>Fort</div>
               </>
             )}
             {activeThematicParam.domain === 'METEO' && (
               <>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#0ea5e9]"></div>Faible</div>
                 <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#0ea5e9]"></div>Moyen</div>
                 <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full bg-[#0ea5e9]"></div>Fort</div>
               </>
             )}
           </div>
        </div>
      )}


      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px] z-20 pointer-events-none">
          <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg pointer-events-auto">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
            <span className="text-sm font-semibold text-slate-800">Chargement des données géographiques...</span>
          </div>
        </div>
      )}
    </div>
  );
}
