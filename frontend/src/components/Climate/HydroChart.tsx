// import { useEffect, useState } from "react";
// import { Card } from "@/components/ui/card";
// import { fetchHydroTimeseries } from "@/api/hydro";

// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Area,
//   ComposedChart,
// } from "recharts";

// type Props = {
//   ts_id?: number;
//   aggregation?: string;
//   date_start?: string;
//   date_end?: string;
// };

// export default function HydroChart({
//   ts_id,
//   aggregation,
//   date_start,
//   date_end,
// }: Props) {
//   const [data, setData] = useState<any[]>([]);
//   const [hoveredPoint, setHoveredPoint] = useState<any>(null);

//   useEffect(() => {
//     if (!ts_id || !aggregation || !date_start || !date_end) {
//       setData([]);
//       return;
//     }

//     fetchHydroTimeseries({
//       ts_id,
//       aggregation,
//       date_start,
//       date_end,
//     }).then(setData);
//   }, [ts_id, aggregation, date_start, date_end]);

//   // Formatage des dates pour l'affichage
//   const formatXAxis = (dateStr: string) => {
//     const date = new Date(dateStr);
//     if (aggregation === 'daily') {
//       return `${date.getDate()}/${date.getMonth()+1}`;
//     } else if (aggregation === 'monthly') {
//       return `${date.getMonth()+1}/${date.getFullYear()}`.slice(0, 7);
//     }
//     return date.getFullYear().toString();
//   };

//   // Tooltip personnalisé
//   const CustomTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       const date = new Date(label);
//       return (
//         <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
//           <p className="text-sm font-semibold text-gray-700 mb-1">
//             {date.toLocaleDateString('fr-FR', {
//               day: '2-digit',
//               month: 'long',
//               year: 'numeric'
//             })}
//           </p>
//           <div className="flex items-center gap-2 text-xs">
//             <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//             <span className="text-gray-600">Débit:</span>
//             <span className="font-mono font-bold text-blue-600">
//               {Number(payload[0].value).toFixed(3)} m³/s
//             </span>
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   if (!ts_id) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[320px] bg-gradient-to-b from-gray-50 to-white rounded-b-lg">
//         <div className="text-5xl mb-3 opacity-30">📈</div>
//         <p className="text-gray-400 font-medium">Aucune donnée à visualiser</p>
//         <p className="text-gray-300 text-xs mt-1">Sélectionnez un scénario</p>
//       </div>
//     );
//   }

//   if (data.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[320px] bg-gradient-to-b from-gray-50 to-white rounded-b-lg">
//         <div className="text-5xl mb-3 opacity-30">⏳</div>
//         <p className="text-gray-400 font-medium">Chargement des données...</p>
//         <div className="flex gap-1 mt-3">
//           <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
//           <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
//           <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300"></div>
//         </div>
//       </div>
//     );
//   }

//   // Calcul des statistiques pour affichage
//   const values = data.map(d => Number(d.value));
//   const min = Math.min(...values);
//   const max = Math.max(...values);
//   const avg = values.reduce((a, b) => a + b, 0) / values.length;

//   return (
//     <div className="flex flex-col h-[320px]">
//       {/* Mini légende avec statistiques */}
//       <div className="flex justify-between items-center mb-2 px-2">
//         <div className="flex items-center gap-3">
//           <div className="flex items-center gap-1.5">
//             <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
//             <span className="text-xs text-gray-600">Débit</span>
//           </div>
//           <div className="flex items-center gap-1.5">
//             <span className="text-xs text-gray-500">Min:</span>
//             <span className="text-xs font-semibold text-green-600">{min.toFixed(2)}</span>
//           </div>
//           <div className="flex items-center gap-1.5">
//             <span className="text-xs text-gray-500">Max:</span>
//             <span className="text-xs font-semibold text-red-600">{max.toFixed(2)}</span>
//           </div>
//           <div className="flex items-center gap-1.5">
//             <span className="text-xs text-gray-500">Moy:</span>
//             <span className="text-xs font-semibold text-purple-600">{avg.toFixed(2)}</span>
//           </div>
//         </div>
//         <span className="text-xs text-gray-400">
//           {data.length} points
//         </span>
//       </div>

//       {/* Graphique */}
//       <div className="relative flex-1">
//         <ResponsiveContainer width="100%" height="100%">
//           <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
//             <defs>
//               <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
//                 <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
//               </linearGradient>
//             </defs>
            
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            
//             <XAxis 
//               dataKey="datetime" 
//               tickFormatter={formatXAxis}
//               tick={{ fontSize: 10, fill: '#6b7280' }}
//               axisLine={{ stroke: '#e5e7eb' }}
//               tickLine={{ stroke: '#e5e7eb' }}
//               interval="preserveStartEnd"
//               minTickGap={30}
//             />
            
//             <YAxis 
//               tick={{ fontSize: 10, fill: '#6b7280' }}
//               axisLine={{ stroke: '#e5e7eb' }}
//               tickLine={{ stroke: '#e5e7eb' }}
//               label={{ 
//                 value: 'm³/s', 
//                 angle: -90, 
//                 position: 'insideLeft',
//                 style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 10 }
//               }}
//             />
            
//             <Tooltip content={<CustomTooltip />} />
            
//             {/* Zone colorée sous la courbe */}
//             <Area
//               type="monotone"
//               dataKey="value"
//               stroke="none"
//               fill="url(#colorGradient)"
//             />
            
//             {/* Ligne principale */}
//             <Line
//               type="monotone"
//               dataKey="value"
//               stroke="#3b82f6"
//               strokeWidth={2.5}
//               dot={false}
//               activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
//             />
//           </ComposedChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Légende du pas de temps */}
//       <div className="text-center text-[10px] text-gray-400 mt-1">
//         {aggregation === 'daily' && 'Données journalières'}
//         {aggregation === 'monthly' && 'Moyennes mensuelles'}
//         {aggregation === 'annual' && 'Moyennes annuelles'}
//       </div>
//     </div>
//   );
// }



import { useEffect, useRef, useState, useMemo } from "react";
import { fetchHydroTimeseries } from "@/api/hydro";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ComposedChart,
} from "recharts";

type Props = {
  ts_id?: number;
  aggregation?: string;
  date_start?: string;
  date_end?: string;
};

export default function HydroChart({
  ts_id,
  aggregation,
  date_start,
  date_end,
}: Props) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ anti-race : si l'utilisateur change vite scénario/agrégation
  const reqIdRef = useRef(0);

  // ✅ key de remount : force Recharts à repartir clean
  const chartKey = useMemo(() => {
    return `${ts_id ?? "na"}|${aggregation ?? "na"}|${date_start ?? "na"}|${date_end ?? "na"}`;
  }, [ts_id, aggregation, date_start, date_end]);

  useEffect(() => {
    if (!ts_id || !aggregation || !date_start || !date_end) {
      setData([]);
      setLoading(false);
      return;
    }

    const myReqId = ++reqIdRef.current;
    setLoading(true);

    fetchHydroTimeseries({
      ts_id,
      aggregation,
      date_start,
      date_end,
    })
      .then((rows) => {
        // ignore réponse tardive
        if (reqIdRef.current !== myReqId) return;
        setData(Array.isArray(rows) ? rows : []);
      })
      .catch(() => {
        if (reqIdRef.current !== myReqId) return;
        setData([]);
      })
      .finally(() => {
        if (reqIdRef.current !== myReqId) return;
        setLoading(false);
      });
  }, [ts_id, aggregation, date_start, date_end]);

  const formatXAxis = (dateStr: string) => {
    const d = new Date(dateStr);
    if (aggregation === "daily") return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
    if (aggregation === "monthly") return d.toLocaleDateString("fr-FR", { month: "2-digit", year: "numeric" });
    return d.getFullYear().toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 notranslate" translate="no">
          <p className="text-sm font-semibold text-gray-700 mb-1">
            {date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Débit:</span>
            <span className="font-mono font-bold text-blue-600">
              {Number(payload[0].value).toFixed(3)} m³/s
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!ts_id) {
    return (
      <div className="flex flex-col items-center justify-center h-[320px] bg-gradient-to-b from-gray-50 to-white rounded-b-lg notranslate" translate="no">
        <div className="text-5xl mb-3 opacity-30">📈</div>
        <p className="text-gray-400 font-medium">Aucune donnée à visualiser</p>
        <p className="text-gray-300 text-xs mt-1">Sélectionnez un scénario</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[320px] bg-gradient-to-b from-gray-50 to-white rounded-b-lg notranslate" translate="no">
        <div className="text-5xl mb-3 opacity-30">⏳</div>
        <p className="text-gray-400 font-medium">Chargement des données...</p>
        <div className="flex gap-1 mt-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300"></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[320px] bg-gradient-to-b from-gray-50 to-white rounded-b-lg notranslate" translate="no">
        <div className="text-5xl mb-3 opacity-30">📉</div>
        <p className="text-gray-400 font-medium">Aucune donnée pour cette période</p>
        <p className="text-gray-300 text-xs mt-1">Vérifiez l’agrégation et la période</p>
      </div>
    );
  }

  const values = data.map((d) => Number(d.value)).filter((v) => !isNaN(v));
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 0;
  const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

  return (
    // ✅ bloc anti-traduction
    <div className="flex flex-col h-[320px] notranslate" translate="no">
      <div className="flex justify-between items-center mb-2 px-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Débit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">Min:</span>
            <span className="text-xs font-semibold text-green-600">{min.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">Max:</span>
            <span className="text-xs font-semibold text-red-600">{max.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">Moy:</span>
            <span className="text-xs font-semibold text-purple-600">{avg.toFixed(2)}</span>
          </div>
        </div>
        <span className="text-xs text-gray-400">{data.length} points</span>
      </div>

      <div className="relative flex-1">
        {/* ✅ Remount Recharts */}
        <div key={chartKey} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
              <defs>
                {/* ✅ id unique par chart pour éviter collisions SVG */}
                <linearGradient id={`colorGradient-${chartKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

              <XAxis
                dataKey="datetime"
                tickFormatter={formatXAxis}
                tick={{ fontSize: 10, fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={{ stroke: "#e5e7eb" }}
                interval="preserveStartEnd"
                minTickGap={30}
              />

              <YAxis
                tick={{ fontSize: 10, fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={{ stroke: "#e5e7eb" }}
                label={{
                  value: "m³/s",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fill: "#6b7280", fontSize: 10 },
                }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area type="monotone" dataKey="value" stroke="none" fill={`url(#colorGradient-${chartKey})`} />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#3b82f6" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="text-center text-[10px] text-gray-400 mt-1">
        {aggregation === "daily" && "Données journalières"}
        {aggregation === "monthly" && "Moyennes mensuelles"}
        {aggregation === "annual" && "Moyennes annuelles"}
      </div>
    </div>
  );
}
