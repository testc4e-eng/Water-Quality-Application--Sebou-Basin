import { useState, useMemo } from 'react';
import Map, { Source, Layer, Marker, ViewStateChangeEvent } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { StationInfo } from '../../mocks/pollutionSimulationData';
import { MapPin, AlertTriangle, Droplets } from 'lucide-react';

interface PollutionMapProps {
  onLocationSelect: (lon: number, lat: number) => void;
  selectedLocation: [number, number] | null;
  simulationResults: any | null;
  hydroNetwork: any;
  stations: StationInfo[];
  qaMode?: boolean;
  topologyQaData?: any;
}

export default function PollutionMap({ onLocationSelect, selectedLocation, simulationResults, hydroNetwork, stations, qaMode = false, topologyQaData }: PollutionMapProps) {
  const [viewState, setViewState] = useState({
    longitude: -5.70,
    latitude: 34.30,
    zoom: 8,
    pitch: 0,
    bearing: 0
  });

  const handleMapClick = (e: any) => {
    // on autorise le clic uniquement s'il n'y a pas déjà une simulation complète (ou on permet de réinitialiser)
    if (e.lngLat) {
      onLocationSelect(e.lngLat.lng, e.lngLat.lat);
    }
  };

  // Utilisation du GeoJSON renvoyé par l'API Backend
  const pollutedRiverFeature = useMemo(() => {
    if (!simulationResults || !simulationResults.path_geojson) return null;
    return simulationResults.path_geojson;
  }, [simulationResults]);

  return (
    <div className="h-full w-full relative overflow-hidden rounded-2xl border border-slate-200 shadow-inner">
      <Map
        {...viewState}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        interactiveLayerIds={['hydro-network']}
        cursor={!selectedLocation ? "crosshair" : "grab"}
      >
        {/* Ligne bleue : Réseau hydrographique de base */}
        {hydroNetwork && (
          <Source id="hydro-source" type="geojson" data={hydroNetwork}>
            <Layer 
              id="hydro-network"
              type="line"
              paint={{
                'line-color': '#0ea5e9',
                'line-width': 3,
                'line-opacity': qaMode ? 0.2 : 0.5
              }}
            />
          </Source>
        )}

        {/* MODE QA : Réseau complet avec statut connectivité */}
        {qaMode && topologyQaData && topologyQaData.edges && (
          <Source id="qa-edges-source" type="geojson" data={topologyQaData.edges}>
            <Layer
              id="qa-edges-layer"
              type="line"
              paint={{
                'line-color': [
                  'case',
                  ['get', 'is_cycle'], '#a855f7', // Cycle = Violet
                  ['get', 'is_micro_segment'], '#ef4444', // Micro = Rouge
                  ['==', ['get', 'component_id'], 0], '#22c55e', // Main = Vert
                  ['==', ['get', 'component_id'], 1], '#f59e0b', // Comp 1 = Ambre
                  ['==', ['get', 'component_id'], 2], '#ec4899', // Comp 2 = Rose
                  ['==', ['get', 'component_id'], 3], '#8b5cf6', // Comp 3 = Violet
                  '#94a3b8' // Autres = Gris
                ],
                'line-width': [
                  'case',
                  ['get', 'is_micro_segment'], 4,
                  ['get', 'is_cycle'], 4,
                  2
                ],
                'line-opacity': 0.8
              }}
            />
            <Layer
              id="qa-edges-arrows"
              type="symbol"
              layout={{
                'symbol-placement': 'line',
                'symbol-spacing': 100,
                'text-field': '▶',
                'text-size': 12,
                'text-rotation-alignment': 'map',
                'text-keep-upright': false
              }}
              paint={{
                'text-color': '#ffffff',
                'text-halo-color': '#000000',
                'text-halo-width': 1
              }}
            />
          </Source>
        )}

        {/* MODE QA : Noeuds topologiques */}
        {qaMode && topologyQaData && topologyQaData.nodes && (
          <Source id="qa-nodes-source" type="geojson" data={topologyQaData.nodes}>
            <Layer
              id="qa-nodes-layer"
              type="circle"
              paint={{
                'circle-radius': [
                  'interpolate', ['linear'], ['zoom'],
                  8, 2,
                  12, 6
                ],
                'circle-color': [
                  'case',
                  ['get', 'is_isolated'], '#ef4444', // Rouge si isolé
                  ['get', 'is_confluence'], '#22c55e', // Vert si confluence
                  ['get', 'is_bifurcation'], '#a855f7', // Violet si bifurcation
                  '#3b82f6' // Bleu par défaut
                ],
                'circle-stroke-width': 1,
                'circle-stroke-color': '#ffffff'
              }}
            />
          </Source>
        )}

        {/* Ligne rouge : Portion polluée + flèches QA */}
        {pollutedRiverFeature && (
          <Source id="polluted-source" type="geojson" data={pollutedRiverFeature as any}>
            <Layer
              id="polluted-network"
              type="line"
              paint={{
                'line-color': '#ef4444',
                'line-width': 6,
                'line-opacity': 0.8,
                'line-dasharray': [2, 1],
              }}
            />
            {qaMode && (
              <Layer
                id="qa-flow-arrows"
                type="symbol"
                layout={{
                  'symbol-placement': 'line',
                  'symbol-spacing': 60,
                  'text-field': '▶',
                  'text-size': 14,
                  'text-keep-upright': false,
                  'text-rotation-alignment': 'map',
                }}
                paint={{
                  'text-color': [
                    'match',
                    ['get', 'flow_status'],
                    'FLOW_CONFIRMED',          '#22c55e',
                    'FLOW_PROBABLE',           '#3b82f6',
                    'FLOW_UNKNOWN',            '#f97316',
                    'FLOW_DIRECTION_UNCERTAIN','#f97316',
                    'FLOW_REVERSED_SUSPECTED', '#ef4444',
                    '#ffffff',
                  ],
                  'text-halo-color': '#000000',
                  'text-halo-width': 1,
                }}
              />
            )}
          </Source>
        )}

        {/* Marqueurs des stations */}
        {stations.map(station => {
          const isImpacted = simulationResults?.enrichedStations?.some((s: any) => s.id === station.id);
          
          return (
            <Marker 
              key={station.id} 
              longitude={station.coordinates[0]} 
              latitude={station.coordinates[1]}
              anchor="bottom"
            >
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="bg-white px-2 py-1 rounded shadow-md text-xs font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  {station.name}
                </div>
                <div className={`p-1.5 rounded-full shadow-lg text-white transition-colors duration-500 ${
                  isImpacted ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse' :
                  station.type === 'hydro' ? 'bg-blue-500' :
                  station.type === 'dam' ? 'bg-slate-700' : 'bg-red-700'
                }`}>
                  {isImpacted ? <AlertTriangle size={16} /> : station.type === 'hydro' ? <Droplets size={16} /> : <MapPin size={16} />}
                </div>
              </div>
            </Marker>
          );
        })}

        {/* Marqueur du point de pollution cliqué */}
        {selectedLocation && (
          <Marker 
            longitude={selectedLocation[0]} 
            latitude={selectedLocation[1]}
            anchor="bottom"
          >
            <div className="animate-bounce">
              <div className="bg-red-500 p-2 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.7)] text-white">
                <AlertTriangle size={20} />
              </div>
            </div>
          </Marker>
        )}
      </Map>
      
      {/* Overlay Instructions */}
      {!selectedLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur text-white px-6 py-3 rounded-full text-sm font-medium shadow-xl pointer-events-none flex items-center gap-2 animate-pulse">
          <MapPin size={16} className="text-red-400" />
          Cliquez sur la carte près du fleuve pour déclarer un point de pollution
        </div>
      )}

      {/* Légende QA Mode */}
      {qaMode && (
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur text-white rounded-xl p-3 text-xs shadow-xl space-y-1.5 pointer-events-none">
          <div className="font-bold uppercase tracking-wider text-purple-400 mb-2">Mode QA – Topologie</div>
          {[
            { color: '#22c55e', label: 'Composant Principal (0)' },
            { color: '#f59e0b', label: 'Composant Secondaire (1)' },
            { color: '#ec4899', label: 'Composant Secondaire (2)' },
            { color: '#a855f7', label: 'Cycle Artificiel (DANGER)' },
            { color: '#ef4444', label: 'Micro-segment Parasite' },
            { color: '#94a3b8', label: 'Autres / Isolés' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span style={{ backgroundColor: color }} className="w-3 h-3 rounded-full"></span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
