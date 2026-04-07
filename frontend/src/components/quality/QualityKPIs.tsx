import { useEffect, useState } from "react";
import { fetchQualityKPIs } from "@/api/quality";

export default function QualityKPIs(props: any) {
  const [kpis, setKpis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchQualityKPIs(props)
      .then(setKpis)
      .finally(() => setLoading(false));
  }, [
    props.station_code,
    props.date_start,
    props.date_end,
    props.aggregation
  ]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!kpis) return null;

  const kpiConfig = [
    { key: 'n', label: 'Azote (N)', color: 'blue', icon: '🧪', bg: 'from-blue-50 to-indigo-50', border: 'border-blue-200', text: 'text-blue-900' },
    { key: 'o', label: 'Oxygène (O)', color: 'red', icon: '💨', bg: 'from-red-50 to-orange-50', border: 'border-red-200', text: 'text-red-900' },
    { key: 'p', label: 'Phosphore (P)', color: 'green', icon: '⚗️', bg: 'from-green-50 to-emerald-50', border: 'border-green-200', text: 'text-green-900' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {kpiConfig.map((k) => {
        const value = kpis[k.key];
        if (value === undefined) return null;
        
        return (
          <div 
            key={k.key}
            className={`relative overflow-hidden bg-gradient-to-br ${k.bg} border ${k.border} rounded-xl p-5 shadow-sm hover:shadow-md transition-all`}
          >
            {/* Icône en arrière-plan */}
            <div className="absolute top-2 right-2 text-3xl opacity-20">
              {k.icon}
            </div>
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{k.icon}</span>
                <span className={`text-sm font-semibold text-${k.color}-700`}>
                  {k.label}
                </span>
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Moyenne
                  </div>
                  <div className={`text-3xl font-bold ${k.text}`}>
                    {Number(value).toFixed(2)}
                  </div>
                </div>
                
                <div className={`bg-${k.color}-100 px-3 py-1.5 rounded-lg`}>
                  <span className={`text-xs font-semibold text-${k.color}-700`}>
                    mg/L
                  </span>
                </div>
              </div>
              
              {/* Mini indicateur de tendance */}
              <div className="mt-3 flex items-center gap-1">
                <div className={`w-1 h-1 rounded-full bg-${k.color}-500`}></div>
                <div className={`w-2 h-1 rounded-full bg-${k.color}-400`}></div>
                <div className={`w-3 h-1 rounded-full bg-${k.color}-300`}></div>
                <span className="text-xs text-gray-500 ml-1">Données sur la période</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}