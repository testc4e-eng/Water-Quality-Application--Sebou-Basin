// /* frontend/src/components/Dashboard/LinkedChart.jsx */
// import React, { useMemo } from "react";
// import TimeSeriesChart from "../Charts/TimeSeriesChart.jsx";
// import { useSelection } from "../../context/SelectionContext.jsx";

// export default function LinkedChart() {
//   const { selectedStation, dateFrom, dateTo } = useSelection();

//   const title = useMemo(() => {
//     if (!selectedStation) return "Évolution Débit — (sélectionnez une station)";
//     return `Évolution Débit — ${selectedStation.name}`;
//   }, [selectedStation]);

//   return (
//     <div className="card" style={{ padding: 12 }}>
//       <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
//       <TimeSeriesChart
//         stationId={selectedStation?.id || 1}
//         dateFrom={dateFrom}
//         dateTo={dateTo}
//       />
//     </div>
//   );
// }



/* frontend/src/components/Dashboard/LinkedChart.jsx */
import React, { useMemo } from "react";
import TimeSeriesChart from "../Charts/TimeSeriesChart.jsx";
import { useSelection } from "../../context/SelectionContext.jsx";
import { 
  LineChart, 
  Activity, 
  MapPin, 
  Calendar, 
  Clock,
  TrendingUp,
  Droplets,
  Waves,
  Gauge,
  Sparkles,
  RefreshCw
} from "lucide-react";

export default function LinkedChart() {
  const { selectedStation, dateFrom, dateTo } = useSelection();

  const title = useMemo(() => {
    if (!selectedStation) return "Évolution Débit — (sélectionnez une station)";
    return `Évolution Débit — ${selectedStation.name}`;
  }, [selectedStation]);

  // Fonction pour obtenir la couleur de la station
  const getStationColor = (stationName) => {
    if (!stationName) return "from-blue-600 to-indigo-600";
    
    const name = stationName.toLowerCase();
    if (name.includes("mer") || name.includes("océan") || name.includes("marée")) {
      return "from-cyan-600 to-blue-600";
    }
    if (name.includes("rivière") || name.includes("fleuve") || name.includes("cours")) {
      return "from-emerald-600 to-teal-600";
    }
    if (name.includes("lac") || name.includes("étang") || name.includes("réservoir")) {
      return "from-sky-600 to-blue-600";
    }
    if (name.includes("barrage") || name.includes("digue")) {
      return "from-amber-600 to-orange-600";
    }
    return "from-blue-600 to-indigo-600";
  };

  // Fonction pour obtenir l'icône de la station
  const getStationIcon = (stationName) => {
    if (!stationName) return <LineChart className="h-5 w-5" />;
    
    const name = stationName.toLowerCase();
    if (name.includes("eau") || name.includes("débit")) {
      return <Droplets className="h-5 w-5" />;
    }
    if (name.includes("mer") || name.includes("océan") || name.includes("marée")) {
      return <Waves className="h-5 w-5" />;
    }
    if (name.includes("barrage") || name.includes("digue")) {
      return <Gauge className="h-5 w-5" />;
    }
    return <Activity className="h-5 w-5" />;
  };

  // Formater la période
  const periodText = useMemo(() => {
    if (!dateFrom || !dateTo) return "Période non définie";
    
    const from = new Date(dateFrom).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const to = new Date(dateTo).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    return `${from} — ${to}`;
  }, [dateFrom, dateTo]);

  // Obtenir la période relative
  const getRelativePeriod = () => {
    if (!dateFrom || !dateTo) return null;
    
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const diffDays = Math.round((to - from) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return "24h";
    if (diffDays <= 7) return "7j";
    if (diffDays <= 30) return "30j";
    if (diffDays <= 90) return "3mois";
    if (diffDays <= 180) return "6mois";
    if (diffDays <= 365) return "1an";
    return `${diffDays}j`;
  };

  const relativePeriod = getRelativePeriod();

  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-gray-200">
      {/* En-tête avec gradient dynamique basé sur la station */}
      <div className={`bg-gradient-to-r ${getStationColor(selectedStation?.name)} px-6 py-4 relative overflow-hidden`}>
        {/* Effet de brillance animé */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
              {getStationIcon(selectedStation?.name)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {title}
              </h3>
              
              {/* Informations de période */}
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-xs text-white/80">
                  <Calendar className="h-3 w-3" />
                  <span>{periodText}</span>
                </div>
                {relativePeriod && (
                  <div className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white font-medium">
                    {relativePeriod}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Badge de la station si sélectionnée */}
          {selectedStation && (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <MapPin className="h-3.5 w-3.5 text-white" />
                <span className="text-xs text-white font-medium truncate max-w-[150px]">
                  {selectedStation.name}
                </span>
              </div>
              <div className="px-2 py-1 bg-white/20 rounded-lg">
                <Sparkles className="h-4 w-4 text-white animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* Indicateurs de statut */}
        {selectedStation && (
          <div className="flex gap-3 mt-3 relative z-10">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-white/80">Données en direct</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw className="h-3 w-3 text-white/80" />
              <span className="text-xs text-white/80">Mise à jour automatique</span>
            </div>
          </div>
        )}
      </div>

      {/* Corps du graphique */}
      <div className="p-4">
        {!selectedStation ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-4">
              <LineChart className="h-12 w-12 text-blue-500" />
            </div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              Aucune station sélectionnée
            </h4>
            <p className="text-gray-500 text-center max-w-md mb-4">
              Sélectionnez une station sur la carte ou dans la liste pour visualiser l'évolution du débit
            </p>
            <div className="flex gap-3">
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Cliquez sur une station
              </div>
              <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                Données historiques disponibles
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Badge d'information */}
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium shadow-sm backdrop-blur-sm">
                Débit (m³/s)
              </div>
              {dateFrom && dateTo && (
                <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium shadow-sm backdrop-blur-sm">
                  {new Date(dateFrom).toLocaleDateString('fr-FR', { month: 'short' })} - {new Date(dateTo).toLocaleDateString('fr-FR', { month: 'short' })}
                </div>
              )}
            </div>
            
            {/* Le graphique lui-même */}
            <TimeSeriesChart
              stationId={selectedStation?.id || 1}
              dateFrom={dateFrom}
              dateTo={dateTo}
            />
          </div>
        )}
      </div>

      {/* Pied de page avec métriques simulées (optionnel, peut être retiré si non désiré) */}
      {selectedStation && (
        <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Débit moyen</div>
              <div className="text-sm font-semibold text-gray-800 flex items-center justify-center gap-1">
                <Droplets className="h-3.5 w-3.5 text-blue-500" />
                <span>124.5 m³/s</span>
              </div>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Maximum</div>
              <div className="text-sm font-semibold text-gray-800 flex items-center justify-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                <span>256.8 m³/s</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Minimum</div>
              <div className="text-sm font-semibold text-gray-800 flex items-center justify-center gap-1">
                <Activity className="h-3.5 w-3.5 text-amber-500" />
                <span>42.3 m³/s</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}