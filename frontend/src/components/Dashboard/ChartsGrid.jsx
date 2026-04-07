// /* frontend/src/components/Dashboard/ChartsGrid.jsx */
// import React from "react";
// import TimeSeriesChart from "../Charts/TimeSeriesChart.jsx";
// import ScatterPlotChart from "../Charts/ScatterPlotChart.jsx";
// import HeatmapChart from "../Charts/HeatmapChart.jsx";
// import GaugeChart from "../Charts/GaugeChart.jsx";

// export default function ChartsGrid() {
//   return (
//     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//       <div className="card" style={{ padding: 12 }}>
//         <div style={{ fontWeight: 700, marginBottom: 6 }}>
//           Évolution Débit — Station A23
//         </div>
//         <TimeSeriesChart stationId={1} />
//       </div>
//       <div className="card" style={{ padding: 12 }}>
//         <div style={{ fontWeight: 700, marginBottom: 6 }}>
//           Comparaison SWAT vs WASP
//         </div>
//         <ScatterPlotChart />
//       </div>
//       <div className="card" style={{ padding: 12 }}>
//         <div style={{ fontWeight: 700, marginBottom: 6 }}>
//           Matrice Corrélations
//         </div>
//         <HeatmapChart />
//       </div>
//       <div className="card" style={{ padding: 12 }}>
//         <div style={{ fontWeight: 700, marginBottom: 6 }}>
//           Indicateur Temps Réel
//         </div>
//         <GaugeChart value={82} />
//       </div>
//     </div>
//   );
// }


/* frontend/src/components/Dashboard/ChartsGrid.jsx */
import React, { useState } from "react";
import TimeSeriesChart from "../Charts/TimeSeriesChart.jsx";
import ScatterPlotChart from "../Charts/ScatterPlotChart.jsx";
import HeatmapChart from "../Charts/HeatmapChart.jsx";
import GaugeChart from "../Charts/GaugeChart.jsx";
import {
  LineChart,
  Activity,
  Grid,
  BarChart3,
  PieChart,
  TrendingUp,
  Droplets,
  Wind,
  Gauge,
  Sparkles,
  Maximize2,
  Minimize2,
  RefreshCw,
  Download,
  MoreVertical,
  Eye,
  EyeOff
} from "lucide-react";

export default function ChartsGrid() {
  const [fullscreenChart, setFullscreenChart] = useState(null);
  const [hiddenCharts, setHiddenCharts] = useState([]);
  const [chartSizes, setChartSizes] = useState({});

  // Configuration des graphiques
  const charts = [
    {
      id: 1,
      title: "Évolution Débit — Station A23",
      subtitle: "Analyse temporelle • Données 30 jours",
      icon: <LineChart className="h-4 w-4" />,
      color: "from-blue-500 to-cyan-500",
      chart: <TimeSeriesChart stationId={1} />,
      stats: { avg: "124.5", min: "42.3", max: "256.8", unit: "m³/s" }
    },
    {
      id: 2,
      title: "Comparaison SWAT vs WASP",
      subtitle: "Modèles hydrologiques • Corrélation",
      icon: <Activity className="h-4 w-4" />,
      color: "from-purple-500 to-pink-500",
      chart: <ScatterPlotChart />,
      stats: { r2: "0.92", mae: "8.3", rmse: "12.7" }
    },
    {
      id: 3,
      title: "Matrice Corrélations",
      subtitle: "Variables environnementales",
      icon: <Grid className="h-4 w-4" />,
      color: "from-emerald-500 to-teal-500",
      chart: <HeatmapChart />,
      stats: { variables: "8", correlations: ">0.7" }
    },
    {
      id: 4,
      title: "Indicateur Temps Réel",
      subtitle: "Seuil d'alerte • Capacité",
      icon: <Gauge className="h-4 w-4" />,
      color: "from-amber-500 to-orange-500",
      chart: <GaugeChart value={82} />,
      stats: { current: "82%", threshold: "75%", status: "Alerte" }
    }
  ];

  const toggleFullscreen = (chartId) => {
    setFullscreenScreen(fullscreenChart === chartId ? null : chartId);
  };

  const toggleHideChart = (chartId) => {
    setHiddenCharts(prev =>
      prev.includes(chartId)
        ? prev.filter(id => id !== chartId)
        : [...prev, chartId]
    );
  };

  const toggleChartSize = (chartId) => {
    setChartSizes(prev => ({
      ...prev,
      [chartId]: prev[chartId] === "large" ? "normal" : "large"
    }));
  };

  // Filtrer les graphiques cachés
  const visibleCharts = charts.filter(chart => !hiddenCharts.includes(chart.id));

  // Si un graphique est en plein écran
  if (fullscreenChart) {
    const chart = charts.find(c => c.id === fullscreenChart);
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <div className={`bg-gradient-to-r ${chart.color} px-6 py-4 flex justify-between items-center`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                {chart.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{chart.title}</h3>
                <p className="text-xs text-white/80">{chart.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => setFullscreenChart(null)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Minimize2 className="h-5 w-5 text-white" />
            </button>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            {chart.chart}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barre d'outils */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Tableau de bord analytique</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors group relative">
            <RefreshCw className="h-4 w-4 text-gray-600 group-hover:rotate-180 transition-transform duration-500" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Actualiser
            </span>
          </button>
          <button className="p-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors group relative">
            <Download className="h-4 w-4 text-gray-600" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Exporter
            </span>
          </button>
          {hiddenCharts.length > 0 && (
            <button
              onClick={() => setHiddenCharts([])}
              className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors"
            >
              Réafficher {hiddenCharts.length} graphique{hiddenCharts.length > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>

      {/* Grille de graphiques */}
      <div className={`
        grid gap-4 transition-all duration-300
        ${fullscreenChart ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}
      `}>
        {visibleCharts.map((chart) => {
          const isLarge = chartSizes[chart.id] === "large";
          
          return (
            <div
              key={chart.id}
              className={`
                group relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg 
                border border-gray-100 overflow-hidden transition-all duration-300
                hover:shadow-xl hover:border-gray-200
                ${isLarge ? 'md:col-span-2 row-span-2' : ''}
              `}
            >
              {/* En-tête avec gradient */}
              <div className={`bg-gradient-to-r ${chart.color} px-4 py-3 relative overflow-hidden`}>
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded-lg">
                      {chart.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{chart.title}</h3>
                      <p className="text-xs text-white/80">{chart.subtitle}</p>
                    </div>
                  </div>
                  
                  {/* Menu d'actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleChartSize(chart.id)}
                      className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      title={isLarge ? "Réduire" : "Agrandir"}
                    >
                      {isLarge ? 
                        <Minimize2 className="h-3.5 w-3.5 text-white" /> : 
                        <Maximize2 className="h-3.5 w-3.5 text-white" />
                      }
                    </button>
                    <button
                      onClick={() => toggleFullscreen(chart.id)}
                      className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      title="Plein écran"
                    >
                      <Eye className="h-3.5 w-3.5 text-white" />
                    </button>
                    <button
                      onClick={() => toggleHideChart(chart.id)}
                      className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      title="Masquer"
                    >
                      <EyeOff className="h-3.5 w-3.5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Corps du graphique */}
              <div className="p-4">
                {chart.chart}
              </div>

              {/* Pied de page avec statistiques */}
              <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  {chart.id === 1 && (
                    <>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-blue-500" />
                        <span className="text-gray-600">Moy: {chart.stats.avg} {chart.stats.unit}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-green-500" />
                        <span className="text-gray-600">Max: {chart.stats.max} {chart.stats.unit}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Droplets className="h-3 w-3 text-cyan-500" />
                        <span className="text-gray-600">Min: {chart.stats.min} {chart.stats.unit}</span>
                      </div>
                    </>
                  )}
                  {chart.id === 2 && (
                    <>
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-purple-500" />
                        <span className="text-gray-600">R²: {chart.stats.r2}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-pink-500" />
                        <span className="text-gray-600">MAE: {chart.stats.mae}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3 text-indigo-500" />
                        <span className="text-gray-600">RMSE: {chart.stats.rmse}</span>
                      </div>
                    </>
                  )}
                  {chart.id === 3 && (
                    <>
                      <div className="flex items-center gap-1">
                        <Grid className="h-3 w-3 text-emerald-500" />
                        <span className="text-gray-600">{chart.stats.variables} variables</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-teal-500" />
                        <span className="text-gray-600">Corrélations {chart.stats.correlations}</span>
                      </div>
                    </>
                  )}
                  {chart.id === 4 && (
                    <>
                      <div className="flex items-center gap-1">
                        <Gauge className="h-3 w-3 text-amber-500" />
                        <span className="text-gray-600">Actuel: {chart.stats.current}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-orange-500" />
                        <span className="text-gray-600">Seuil: {chart.stats.threshold}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${chart.stats.status === 'Alerte' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                        <span className="text-gray-600">{chart.stats.status}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Badge de statut */}
              <div className="absolute top-2 right-2">
                <div className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium shadow-sm">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    Live
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message si tous les graphiques sont cachés */}
      {visibleCharts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 bg-white/50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <EyeOff className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucun graphique affiché</h3>
          <p className="text-gray-500 mb-4">Tous les graphiques ont été masqués</p>
          <button
            onClick={() => setHiddenCharts([])}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors"
          >
            Réafficher tous les graphiques
          </button>
        </div>
      )}

      {/* Légende */}
      <div className="flex items-center justify-end gap-4 text-xs text-gray-500 mt-2">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          <span>Données temps réel</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          <span>Modèles prédictifs</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          <span>Analyses croisées</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
          <span>Indicateurs</span>
        </div>
      </div>
    </div>
  );
}