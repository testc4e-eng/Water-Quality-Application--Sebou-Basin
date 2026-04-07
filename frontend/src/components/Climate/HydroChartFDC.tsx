import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";

export default function HydroChartFDC({ data = [] }: any) {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[380px] bg-gradient-to-b from-gray-50 to-white rounded-lg">
        <div className="text-5xl mb-3 opacity-30">📈</div>
        <p className="text-gray-400 font-medium">Aucune donnée à visualiser</p>
        <p className="text-gray-300 text-xs mt-1">Sélectionnez une station et une periode</p>
      </div>
    );
  }

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="text-sm font-semibold text-amber-700 mb-1">
            Exceedance: {label}%
          </p>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-gray-600">Débit:</span>
            <span className="font-mono font-bold text-amber-600">
              {payload[0].value.toFixed(3)} m³/s
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Ajouter des lignes de référence pour Q5, Q50, Q95
  const getQValue = (percent: number) => {
    const item = data.find((d: any) => d.exceedance >= percent);
    return item?.value || 0;
  };

  return (
    <div className="flex flex-col h-[380px]">
      {/* Légende des quantiles */}
      <div className="flex justify-between items-center mb-2 px-2">
        <span className="text-xs font-semibold text-gray-600">Quantiles caractéristiques</span>
        <div className="flex gap-3">
          <div className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-red-500"></span>
            <span className="text-xs text-gray-500">Q5 (haut)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-amber-500"></span>
            <span className="text-xs text-gray-500">Q50 (médian)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-green-500"></span>
            <span className="text-xs text-gray-500">Q95 (bas)</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
          <defs>
            <linearGradient id="fdcGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          
          <XAxis
            dataKey="exceedance"
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
            label={{
              value: "Probabilité de dépassement (%)",
              position: "insideBottom",
              offset: -15,
              style: { fill: '#6b7280', fontSize: 11 }
            }}
          />
          
          <YAxis
            tick={{ fontSize: 10, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
            label={{
              value: "Débit (m³/s)",
              angle: -90,
              position: "insideLeft",
              style: { fill: '#6b7280', fontSize: 11 }
            }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {/* Zone colorée sous la courbe */}
          <Area
            type="monotone"
            dataKey="value"
            stroke="none"
            fill="url(#fdcGradient)"
          />
          
          {/* Ligne principale */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#f59e0b"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0, fill: "#f59e0b" }}
          />
          
          {/* Lignes de référence */}
          <ReferenceLine
            x={5}
            stroke="#ef4444"
            strokeDasharray="3 3"
            label={{ value: "Q5", position: "top", fill: "#ef4444", fontSize: 10 }}
          />
          <ReferenceLine
            x={50}
            stroke="#f59e0b"
            strokeDasharray="3 3"
            label={{ value: "Q50", position: "top", fill: "#f59e0b", fontSize: 10 }}
          />
          <ReferenceLine
            x={95}
            stroke="#10b981"
            strokeDasharray="3 3"
            label={{ value: "Q95", position: "bottom", fill: "#10b981", fontSize: 10 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Informations complémentaires */}
      <div className="text-center text-[10px] text-gray-400 mt-2">
        Courbe de débit classé (FDC) - {data.length} points de dépassement
      </div>
    </div>
  );
}