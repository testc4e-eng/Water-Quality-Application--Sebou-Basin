import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQualityStations, getQualityParameters } from '@/api/qualityRegulatory';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

export function QualityOverviewTab() {
  const { data: stations = [], isLoading: isLoadingStations } = useQuery({
    queryKey: ['unified-stations'],
    queryFn: () => getQualityStations()
  });

  const { data: parameters = [], isLoading: isLoadingParams } = useQuery({
    queryKey: ['unified-parameters'],
    queryFn: () => getQualityParameters()
  });

  const isLoading = isLoadingStations || isLoadingParams;

  const {
    totalStations,
    totalMesures,
    totalParameters,
    periodStr,
    supportData
  } = useMemo(() => {
    if (!stations.length || !parameters.length) {
      return { totalStations: 0, totalMesures: 0, totalParameters: 0, periodStr: '...', supportData: [] };
    }

    const totalStations = stations.length;
    // sum measure_count (it might be in n_mesures or measure_count based on API returned type)
    // Looking at the endpoint, it returns measure_count, but the TS interface has n_mesures.
    // Let's handle both to be safe
    const getMeasureCount = (item: any) => item.measure_count || item.n_mesures || 0;
    
    const totalMesures = stations.reduce((sum, s) => sum + getMeasureCount(s), 0);
    const totalParameters = parameters.length;

    const dates = stations.flatMap(s => {
      const min = s.dt_min || (s as any).date_min;
      const max = s.dt_max || (s as any).date_max;
      const res = [];
      if (min) res.push(new Date(min).getTime());
      if (max) res.push(new Date(max).getTime());
      return res;
    }).filter(d => !isNaN(d));

    const minDate = dates.length ? new Date(Math.min(...dates)).getFullYear() : '...';
    const maxDate = dates.length ? new Date(Math.max(...dates)).getFullYear() : '...';
    const periodStr = `${minDate} - ${maxDate}`;

    // Compute Support Data for Donut
    const supportMap: Record<string, number> = {};
    stations.forEach(s => {
      const type = s.support_type || 'INCONNU';
      supportMap[type] = (supportMap[type] || 0) + getMeasureCount(s);
    });

    const supportData = Object.entries(supportMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    return { totalStations, totalMesures, totalParameters, periodStr, supportData };
  }, [stations, parameters]);

  const topParamsData = useMemo(() => {
    if (!parameters.length) return [];
    const getMeasureCount = (item: any) => item.measure_count || item.n_mesures || 0;
    const getName = (item: any) => item.parametre_qualite || item.parameter || 'Inconnu';
    
    return [...parameters]
      .map(p => ({
        name: getName(p),
        mesures: getMeasureCount(p)
      }))
      .sort((a, b) => b.mesures - a.mesures)
      .slice(0, 5);
  }, [parameters]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Chargement des données...</div>;
  }

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 font-medium">Stations</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalStations.toLocaleString('fr-FR')}</div>
        </div>
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 font-medium">Mesures totales</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalMesures.toLocaleString('fr-FR')}</div>
          <div className="text-xs text-slate-400 mt-1">Toutes sources confondues</div>
        </div>
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 font-medium">Paramètres uniques</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalParameters}</div>
        </div>
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 font-medium">Période des données</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{periodStr}</div>
        </div>
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="text-sm text-slate-500 font-medium">Données valides</div>
          <div className="text-lg font-medium text-slate-400 mt-1 italic">Donnée à brancher</div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm h-[320px] flex flex-col">
          <h3 className="font-semibold text-slate-900 mb-2">Répartition par type de support</h3>
          <div className="flex-1 w-full relative">
            {supportData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={supportData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {supportData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(val: number) => val.toLocaleString('fr-FR') + ' mesures'} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 italic">Aucune donnée</div>
            )}
            
            {/* Inner Text for Donut */}
            {supportData.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
                <span className="text-xl font-bold text-slate-800">{totalMesures.toLocaleString('fr-FR')}</span>
                <span className="text-xs text-slate-500">mesures</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm h-[320px] flex flex-col">
          <h3 className="font-semibold text-slate-900 mb-2">Évolution temporelle des mesures</h3>
          <div className="flex-1 bg-slate-50 rounded border border-dashed border-slate-300 flex items-center justify-center text-slate-500 text-sm italic">
            Donnée à brancher
          </div>
        </div>

        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm h-[320px] flex flex-col">
          <h3 className="font-semibold text-slate-900 mb-2">Top 5 paramètres mesurés</h3>
          <div className="flex-1 w-full">
            {topParamsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topParamsData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                  <RechartsTooltip cursor={{fill: '#f1f5f9'}} formatter={(val: number) => val.toLocaleString('fr-FR')} />
                  <Bar dataKey="mesures" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="w-full h-full flex items-center justify-center text-slate-400 italic">Aucune donnée</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm h-48 flex flex-col">
          <h3 className="font-semibold text-slate-900 mb-2">Qualité globale (toutes stations, toutes périodes)</h3>
          <div className="flex-1 bg-slate-50 rounded border border-dashed border-slate-300 flex items-center justify-center text-slate-500 text-sm italic">
            Donnée à brancher
          </div>
        </div>
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm h-48 flex flex-col">
          <h3 className="font-semibold text-slate-900 mb-2">Aperçu carte</h3>
          <div className="flex-1 bg-slate-50 rounded border border-dashed border-slate-300 flex items-center justify-center text-slate-500 text-sm italic">
            Donnée à brancher
          </div>
        </div>
      </div>
    </div>
  );
}
