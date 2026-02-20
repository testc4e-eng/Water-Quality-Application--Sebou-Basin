import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  ComposedChart,
} from "recharts";
import { Card } from "@/components/ui/card";
import { getClimateTimeseries } from "@/api/climate";

export default function ClimateChart({
  tsId,
  title,
  unit,
  varLabel,
  varIcon,
  dateStart,
  dateEnd,
  aggregation,   // ✅ AJOUTER
  loading = false,
}: any) {
  const [data, setData] = useState<any[]>([]);

 useEffect(() => {
  if (!tsId || !aggregation) {
    setData([]);
    return;
  }

  getClimateTimeseries({
    ts_id: tsId,
    time_step: aggregation,   // ✅ OBLIGATOIRE
    ...(dateStart && { date_start: dateStart }),
    ...(dateEnd && { date_end: dateEnd }),
  }).then((rows) => {

    if (!Array.isArray(rows)) {
      console.error("Invalid timeseries (chart):", rows);
      setData([]);
      return;
    }

    setData(
      rows.map((r: any) => ({
        date: r.datetime,
        value: Number(r.value),
        formattedDate: new Date(r.datetime).toLocaleDateString("fr-FR"),
      }))
    );
  });
}, [tsId, dateStart, dateEnd, aggregation]);


  // Formatage des dates pour l'affichage
  const formatXAxis = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const value = payload[0].value;
      
      let bgColor = "bg-white";
      let textColor = "text-gray-800";
      let icon = varIcon || "📊";
      
      if (varLabel?.includes("Température")) {
        if (value > 25) bgColor = "bg-gradient-to-br from-orange-50 to-red-50";
        else if (value < 10) bgColor = "bg-gradient-to-br from-cyan-50 to-sky-50";
      } else if (varLabel?.includes("Précipitation")) {
        if (value > 20) bgColor = "bg-gradient-to-br from-blue-50 to-indigo-50";
      }

      return (
        <div className={`${bgColor} p-3 rounded-lg shadow-lg border border-gray-100`}>
          <p className="text-sm font-semibold text-gray-700 mb-1">
            {date.toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
          </p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-xl">{icon}</span>
            <span className="text-gray-600">{varLabel || "Valeur"}:</span>
            <span className="font-mono font-bold text-blue-600">
              {Number(value).toFixed(3)} {unit}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!tsId) {
    return (
      <div className="flex flex-col items-center justify-center h-[280px] bg-gradient-to-b from-gray-50 to-white rounded-lg">
        <div className="text-5xl mb-3 opacity-30">📈</div>
        <p className="text-gray-400 font-medium">Aucune donnée à visualiser</p>
        <p className="text-gray-300 text-xs mt-1">Sélectionnez une variable</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[280px] bg-gradient-to-b from-gray-50 to-white rounded-lg">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-gray-500 text-sm">Chargement du graphique...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[280px] bg-gradient-to-b from-gray-50 to-white rounded-lg">
        <div className="text-5xl mb-3 opacity-30">⏳</div>
        <p className="text-gray-400 font-medium">Aucune donnée</p>
        <p className="text-gray-300 text-xs mt-1">pour cette période</p>
      </div>
    );
  }

  // Déterminer la couleur du dégradé en fonction de la variable
  let gradientColor = "#3b82f6";
  let gradientId = "blueGradient";
  
  if (varLabel?.includes("Température")) {
    gradientColor = "#ef4444";
    gradientId = "temperatureGradient";
  } else if (varLabel?.includes("Précipitation")) {
    gradientColor = "#10b981";
    gradientId = "precipGradient";
  }

  return (
    <div className="flex flex-col h-[320px]">
      {/* Mini légende avec statistiques */}
      {data.length > 0 && (
        <div className="flex justify-between items-center mb-2 px-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{varIcon || "📊"}</span>
            <span className="text-xs font-semibold text-gray-700">{varLabel}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Min:</span>
              <span className="text-xs font-semibold text-cyan-600">
                {Math.min(...data.map(d => d.value)).toFixed(1)} {unit}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Max:</span>
              <span className="text-xs font-semibold text-orange-600">
                {Math.max(...data.map(d => d.value)).toFixed(1)} {unit}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Moy:</span>
              <span className="text-xs font-semibold text-purple-600">
                {(data.reduce((acc, d) => acc + d.value, 0) / data.length).toFixed(1)} {unit}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Graphique */}
      <div className="relative flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0.05}/>
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
                value: unit, 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 10 }
              }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Zone colorée sous la courbe */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill={`url(#${gradientId})`}
            />
            
            {/* Ligne principale */}
            <Line
              type="monotone"
              dataKey="value"
              stroke={gradientColor}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: gradientColor }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Légende du pas de temps */}
      <div className="text-center text-[10px] text-gray-400 mt-2">
        {dateStart && dateEnd ? (
          <span>Du {new Date(dateStart).toLocaleDateString('fr-FR')} au {new Date(dateEnd).toLocaleDateString('fr-FR')}</span>
        ) : (
          <span>Série temporelle</span>
        )}
      </div>
    </div>
  );
}