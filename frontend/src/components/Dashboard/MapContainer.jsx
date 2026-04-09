// /* frontend/src/components/Dashboard/MapContainer.jsx */
// import React from "react";
// import InteractiveMap from "../Map/InteractiveMap.jsx";
// import { useStations } from "../../services/api.js";

// export default function MapContainer() {
//   const { data: stations, isLoading, error } = useStations();

//   return (
//     <div className="card" style={{ padding: 12 }}>
//       <div style={{ fontWeight: 700, marginBottom: 6 }}>
//         Carte Interactive Bassin Versant
//       </div>
//       <div style={{ height: 420, borderRadius: 12, overflow: "hidden" }}>
//         <InteractiveMap
//           stations={stations || []}
//           isLoading={isLoading}
//           error={error}
//         />
//       </div>
//       <div style={{ fontSize: 12, color: "#667085", marginTop: 6 }}>
//         MapLibre
//       </div>
//     </div>
//   );
// }


/* frontend/src/components/Dashboard/MapContainer.jsx */
import React, { useState } from "react";
import InteractiveMap from "../Map/InteractiveMap.jsx";
import { useStations } from "../../services/api.js";
import {
  MapPin,
  Layers,
  Compass,
  ZoomIn,
  ZoomOut,
  Navigation,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  Satellite,
  Mountain,
  Droplets,
  Wind,
  Thermometer,
  Gauge,
  AlertCircle,
  CheckCircle2,
  Info
} from "lucide-react";

export default function MapContainer() {
  const { data: stations, isLoading, error } = useStations();
  const [mapStyle, setMapStyle] = useState("streets");
  const [showControls, setShowControls] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState("all");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Statistiques des stations
  const stats = {
    total: stations?.length || 0,
    active: stations?.filter(s => s.status === "active" || s.active).length || 0,
    alert: stations?.filter(s => s.alert || s.status === "alert").length || 0,
    offline: stations?.filter(s => s.status === "offline" || !s.active).length || 0
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="space-y-3">
      {/* En-tête avec gradient */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-lg">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Carte Interactive</h2>
            <p className="text-xs text-gray-500">Bassin Versant • Visualisation temps réel</p>
          </div>
        </div>

        {/* Badges de statistiques */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-gray-200">
            <div className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>{stats.active} actives</span>
            </div>
            {stats.alert > 0 && (
              <div className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>{stats.alert} alertes</span>
              </div>
            )}
            {stats.offline > 0 && (
              <div className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium flex items-center gap-1">
                <EyeOff className="h-3 w-3" />
                <span>{stats.offline} hors ligne</span>
              </div>
            )}
          </div>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
          >
            {isFullscreen ? (
              <EyeOff className="h-4 w-4 text-gray-600" />
            ) : (
              <Eye className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Conteneur de la carte avec effets */}
      <div className={`
        relative group rounded-xl overflow-hidden transition-all duration-300
        ${isFullscreen ? 'fixed inset-4 z-50' : ''}
        bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl
      `}>
        {/* Barre d'outils flottante */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {/* Contrôles de zoom */}
          <div className="flex flex-col gap-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-1 border border-gray-200">
            <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
              <ZoomIn className="h-4 w-4 text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
              <ZoomOut className="h-4 w-4 text-gray-700" />
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
              <Compass className="h-4 w-4 text-gray-700" />
            </button>
          </div>

          {/* Styles de carte */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-1 border border-gray-200">
            <button
              onClick={() => setMapStyle("satellite")}
              className={`p-2 rounded-md transition-colors ${mapStyle === "satellite" ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}`}
              title="Vue satellite"
            >
              <Satellite className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMapStyle("streets")}
              className={`p-2 rounded-md transition-colors ${mapStyle === "streets" ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}`}
              title="Vue routière"
            >
              <Mountain className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMapStyle("terrain")}
              className={`p-2 rounded-md transition-colors ${mapStyle === "terrain" ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}`}
              title="Relief"
            >
              <Layers className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Contrôles droits */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          {/* Filtres de couches */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-1 border border-gray-200">
            <button
              onClick={() => setSelectedLayer("all")}
              className={`p-2 rounded-md transition-colors ${selectedLayer === "all" ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-gray-100 text-gray-700'}`}
              title="Toutes les stations"
            >
              <MapPin className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSelectedLayer("water")}
              className={`p-2 rounded-md transition-colors ${selectedLayer === "water" ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}`}
              title="Points d'eau"
            >
              <Droplets className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSelectedLayer("weather")}
              className={`p-2 rounded-md transition-colors ${selectedLayer === "weather" ? 'bg-amber-100 text-amber-600' : 'hover:bg-gray-100 text-gray-700'}`}
              title="Stations météo"
            >
              <Wind className="h-4 w-4" />
            </button>
          </div>

          {/* Bouton de localisation */}
          <button className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 border border-gray-200 hover:bg-gray-100 transition-colors">
            <Navigation className="h-4 w-4 text-gray-700" />
          </button>
        </div>

        {/* Légende */}
        {showLegend && (
          <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-200 max-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700">Légende</span>
              <button
                onClick={() => setShowLegend(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <EyeOff className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600">Station active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600">Alerte en cours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-xs text-gray-600">Hors ligne</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Station sélectionnée</span>
              </div>
            </div>
          </div>
        )}

        {/* Mini carte de statistiques */}
        <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 border border-gray-200">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="px-2 py-1 bg-emerald-50 rounded">
              <div className="text-xs text-emerald-600 font-medium">{stats.active}</div>
              <div className="text-[10px] text-gray-500">Actives</div>
            </div>
            <div className="px-2 py-1 bg-red-50 rounded">
              <div className="text-xs text-red-600 font-medium">{stats.alert}</div>
              <div className="text-[10px] text-gray-500">Alertes</div>
            </div>
          </div>
        </div>

        {/* Overlay de chargement */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="bg-white/90 rounded-lg p-4 flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-emerald-600 animate-pulse" />
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">Chargement de la carte...</span>
            </div>
          </div>
        )}

        {/* Overlay d'erreur */}
        {error && (
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="bg-white/90 rounded-lg p-4 max-w-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <span className="font-medium text-gray-800">Erreur de chargement</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{error.message || "Impossible de charger les données de la carte"}</p>
              <button className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors">
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* La carte elle-même */}
        <div className={isFullscreen ? 'h-full' : 'h-[500px]'}>
          <InteractiveMap
            stations={stations || []}
            isLoading={false} // On gère le loading nous-mêmes
            error={null} // On gère l'erreur nous-mêmes
          />
        </div>

        {/* Badge de crédit */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white">
          MapLibre • © OpenStreetMap
        </div>
      </div>

      {/* Barre d'outils inférieure */}
      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            <span>Mise à jour temps réel</span>
          </div>
          <div className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            <span>{stations?.length || 0} stations</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="hover:text-gray-700 transition-colors">
            <Download className="h-3 w-3" />
          </button>
          <button 
            onClick={() => setShowLegend(!showLegend)}
            className="hover:text-gray-700 transition-colors"
          >
            {showLegend ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          </button>
        </div>
      </div>
    </div>
  );
}