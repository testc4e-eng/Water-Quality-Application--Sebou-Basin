import { Card } from "@/components/ui/card";
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

const colors = ["#3b82f6", "#ef4444", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"];
const gradients = [
  { id: "blueGradient", start: "#3b82f6", end: "#93c5fd" },
  { id: "redGradient", start: "#ef4444", end: "#fca5a5" },
  { id: "greenGradient", start: "#10b981", end: "#6ee7b7" },
  { id: "purpleGradient", start: "#8b5cf6", end: "#c4b5fd" },
];

export default function HydroChartMulti({ series, className = "" }: any) {
  const hasData = series && series.length > 0 && series[0]?.data?.length > 0;

  const merged = hasData
    ? series[0]?.data.map((_: any, i: number) => {
        const row: any = { 
          datetime: series[0].data[i].datetime,
          formattedDate: new Date(series[0].data[i].datetime).toLocaleDateString('fr-FR')
        };
        series.forEach((s: any) => {
          row[s.scenario] = s.data[i]?.value;
        });
        return row;
      })
    : [];

  // Formatage des dates pour l'affichage
  const formatXAxis = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth()+1}`;
  };

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            {new Date(label).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-mono font-bold" style={{ color: entry.color }}>
                {Number(entry.value).toFixed(3)} m³/s
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`flex flex-col h-[380px] ${className}`}>
      {hasData ? (
        <>
          {/* Légende interactive */}
          <div className="flex flex-wrap gap-4 mb-3 px-2">
            {series.map((s: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: colors[idx % colors.length] }}
                ></div>
                <span className="text-xs font-medium text-gray-600">{s.scenario}</span>
                <span className="text-xs text-gray-400">
                  (moy. {s.data.reduce((acc: number, d: any) => acc + d.value, 0) / s.data.length || 0} m³/s)
                </span>
              </div>
            ))}
          </div>

          <div className="relative flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={merged} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <defs>
                  {gradients.map((g, idx) => (
                    <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={g.start} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={g.end} stopOpacity={0.1}/>
                    </linearGradient>
                  ))}
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                
                <XAxis 
                  dataKey="datetime" 
                  tickFormatter={formatXAxis}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  interval="preserveStartEnd"
                  minTickGap={30}
                />
                
                <YAxis 
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  label={{ 
                    value: 'Débit (m³/s)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 11 }
                  }}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                {series.map((s: any, idx: number) => (
                  <Line
                    key={idx}
                    type="monotone"
                    dataKey={s.scenario}
                    stroke={colors[idx % colors.length]}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0, fill: colors[idx % colors.length] }}
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-gray-50 to-white rounded-lg">
          <div className="text-7xl mb-4 opacity-20">📈</div>
          <p className="text-gray-400 font-medium">Aucune donnée à visualiser</p>
          <p className="text-gray-300 text-sm mt-2 max-w-xs text-center">
            Sélectionnez une station et cochez au moins un scénario pour afficher le graphique
          </p>
          <div className="flex gap-2 mt-4">
            <div className="w-8 h-1 bg-blue-200 rounded-full animate-pulse"></div>
            <div className="w-8 h-1 bg-red-200 rounded-full animate-pulse delay-150"></div>
            <div className="w-8 h-1 bg-green-200 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
      )}
    </div>
  );
}