import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getClimateKPIs } from "@/api/climate";

export default function ClimateKPIs({ tsId, varLabel, unit }: any) {
  const [kpis, setKpis] = useState<any>(null);

  useEffect(() => {
    if (tsId) getClimateKPIs(tsId).then(setKpis);
  }, [tsId]);

  if (!kpis) return null;

  const kpiConfig = [
    { key: 'min', label: 'Minimum', bg: 'green', icon: '⬇️', value: kpis.min },
    { key: 'max', label: 'Maximum', bg: 'red', icon: '⬆️', value: kpis.max },
    { key: 'mean', label: 'Moyenne', bg: 'purple', icon: '📊', value: kpis.mean },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {kpiConfig.map((k) => (
        <div key={k.key} className={`relative overflow-hidden bg-gradient-to-br from-${k.bg}-50 to-${k.bg}-100 border border-${k.bg}-200 rounded-xl p-4 shadow-sm`}>
          <div className="absolute top-2 right-2 text-2xl opacity-20">{k.icon}</div>
          <div className="relative">
            <div className={`text-xs uppercase tracking-wider font-semibold text-${k.bg}-700`}>
              {k.label}
            </div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              {k.value?.toFixed(3)} {unit}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {varLabel || "Valeur"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}