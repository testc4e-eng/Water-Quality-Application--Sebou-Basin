import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  ComposedChart,
} from "recharts";
import { fetchQualityChart } from "@/api/quality";
import { Card } from "@/components/ui/card";
import html2canvas from "html2canvas";

export default function QualityChart(props: any) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);

 useEffect(() => {

  if (!props.station_code) {
    setData([]);
    setLoading(false);
    return;
  }

  setLoading(true);

  fetchQualityChart(props)
    .then((result) => {
      setData(Array.isArray(result) ? result : []);
    })
    .finally(() => setLoading(false));

}, [
  props.station_code,
  props.date_start,
  props.date_end,
  props.aggregation
]);


  // ============================
  // EXPORT PNG
  // ============================
  async function exportChartPNG() {
    const element = document.getElementById("chart-export-area");
    if (!element) return;

    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2,
      logging: false,
    });

    const link = document.createElement("a");
    link.download = `qualite_${props.station_code}_${props.date_start}_${props.date_end}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  // Configuration des couleurs par paramètre
  const paramConfig: any = {
    N: { color: "#3b82f6", gradient: "blueGradient", name: "Azote (N)", icon: "🧪" },
    O: { color: "#ef4444", gradient: "redGradient", name: "Oxygène (O)", icon: "💨" },
    P: { color: "#10b981", gradient: "greenGradient", name: "Phosphore (P)", icon: "⚗️" }
  };

  // Formatage des dates pour l'affichage
  const formatXAxis = (dateStr: string) => {
    const date = new Date(dateStr);
    if (props.aggregation === 'D') {
      return `${date.getDate()}/${date.getMonth()+1}`;
    }
    return `${date.getMonth()+1}/${date.getFullYear()}`.slice(0, 7);
  };

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            {date.toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
          </p>
          {payload.map((entry: any, index: number) => {
            const param = entry.dataKey === 'n' ? 'N' : entry.dataKey === 'o' ? 'O' : 'P';
            return (
              <div key={index} className="flex items-center gap-2 text-xs mb-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: paramConfig[param]?.color }}></div>
                <span className="text-gray-600">{paramConfig[param]?.name}:</span>
                <span className="font-mono font-bold" style={{ color: paramConfig[param]?.color }}>
                  {Number(entry.value).toFixed(2)} mg/L
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };


  if (!props.station_code) {
  return (
    <div className="flex flex-col items-center justify-center h-[350px] bg-gradient-to-b from-gray-50 to-white rounded-lg">
      <div className="text-5xl mb-3 opacity-30">📈</div>
      <p className="text-gray-400 font-medium">Aucune donnée à visualiser</p>
      <p className="text-gray-300 text-xs mt-1">Sélectionnez une station</p>
    </div>
  );
}

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[350px] bg-gradient-to-b from-gray-50 to-white rounded-lg">
        <div className="text-5xl mb-3 opacity-30">📊</div>
        <p className="text-gray-400 font-medium">Chargement du graphique...</p>
        <div className="flex gap-1 mt-3">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-300"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[350px] bg-gradient-to-b from-gray-50 to-white rounded-lg">
        <div className="text-5xl mb-3 opacity-30">📈</div>
        <p className="text-gray-400 font-medium">Aucune donnée à visualiser</p>
        <p className="text-gray-300 text-xs mt-1">Sélectionnez des paramètres</p>
      </div>
    );
  }

  // Calcul des statistiques pour affichage
  const stats = props.parametres.map((p: string) => {
    const values = data
  .map(d => d[p.toLowerCase()])
  .filter(v => typeof v === "number");

    return {
      param: p,
      avg: values.reduce((a, b) => a + b, 0) / values.length || 0,
      min: Math.min(...values),
      max: Math.max(...values)
    };
  });

  return (
    <div className="flex flex-col">
      {/* Header avec bouton d'export */}
      <div className="flex justify-between items-center mb-3 px-2">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-700">
            Évolution des paramètres
          </h3>
          <div className="flex gap-2">
            {props.parametres.map((p: string) => (
              <div key={p} className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: paramConfig[p]?.color }}></div>
                <span className="text-xs text-gray-600">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={exportChartPNG}
          className="text-xs px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-md transition-all flex items-center gap-1"
        >
          <span>📸</span> PNG
        </button>
      </div>

      {/* Mini statistiques */}
      <div className="grid grid-cols-3 gap-2 mb-3 px-2">
        {stats.map((s) => (
          <div key={s.param} className="bg-gray-50 rounded-lg p-2 text-center">
            <span className="text-xs text-gray-500">{paramConfig[s.param]?.name}</span>
            <div className="flex justify-center gap-2 mt-1">
              <span className="text-xs font-semibold text-gray-700">{s.avg.toFixed(2)} mg/L</span>
            </div>
          </div>
        ))}
      </div>

      {/* Zone exportable */}
      <div
        id="chart-export-area"
        className="bg-white p-4 rounded-lg"
      >
        <div className="text-center font-semibold mb-3 text-gray-800">
          Evolution des paramètres de qualité - {props.station_code.replace(/,/g, ', ')}
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                tick={{ fontSize: 10, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              
              <YAxis 
                tick={{ fontSize: 10, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
                label={{ 
                  value: 'mg/L', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 10 }
                }}
              />
              
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {props.parametres.includes("N") && (
                <>
                  <Area
                    type="monotone"
                    dataKey="n"
                    stroke="none"
                    fill="url(#blueGradient)"
                    name="Azote (N)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="n" 
                    stroke="#3b82f6" 
                    strokeWidth={2.5} 
                    dot={false} 
                    activeDot={{ r: 6, strokeWidth: 0, fill: "#3b82f6" }}
                    name="Azote (N)"
                  />
                </>
              )}
              
              {props.parametres.includes("O") && (
                <>
                  <Area
                    type="monotone"
                    dataKey="o"
                    stroke="none"
                    fill="url(#redGradient)"
                    name="Oxygène (O)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="o" 
                    stroke="#ef4444" 
                    strokeWidth={2.5} 
                    dot={false} 
                    activeDot={{ r: 6, strokeWidth: 0, fill: "#ef4444" }}
                    name="Oxygène (O)"
                  />
                </>
              )}
              
              {props.parametres.includes("P") && (
                <>
                  <Area
                    type="monotone"
                    dataKey="p"
                    stroke="none"
                    fill="url(#greenGradient)"
                    name="Phosphore (P)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="p" 
                    stroke="#10b981" 
                    strokeWidth={2.5} 
                    dot={false} 
                    activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
                    name="Phosphore (P)"
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Légende */}
      <div className="flex justify-center gap-4 mt-3 text-xs text-gray-500">
        <span>Période: {new Date(props.date_start).toLocaleDateString()} - {new Date(props.date_end).toLocaleDateString()}</span>
        <span>•</span>
        <span>{props.aggregation === 'D' ? 'Données journalières' : 'Moyennes mensuelles'}</span>
      </div>
    </div>
  );
}