import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQualityStations, getQualityParameters } from '@/api/qualityRegulatory';
import type { QualityDashboardFilters } from './types';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

interface QualityOverviewTabProps {
  filters?: QualityDashboardFilters;
}

const normalizeText = (value?: string | null) => (value || '').toLowerCase().trim();
const getMeasureCount = (item: any) => item.measure_count || item.n_mesures || 0;
const getStationName = (station: any) => station.station_nom || station.station_name || station.ire_station || station.station_id || 'Station sans nom';
const getParameterName = (parameter: any) => parameter.parametre_qualite || parameter.parameter || 'Inconnu';

export function QualityOverviewTab({ filters }: QualityOverviewTabProps) {
  const supportType = filters?.supportType;

  const { data: stations = [], isLoading: isLoadingStations, error: stationsError } = useQuery({
    queryKey: ['unified-stations', supportType || 'ALL'],
    queryFn: () => getQualityStations({ support_type: supportType || undefined }),
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: false
  });

  const { data: parameters = [], isLoading: isLoadingParams, error: paramsError } = useQuery({
    queryKey: ['unified-parameters', supportType || 'ALL'],
    queryFn: () => getQualityParameters({ support_type: supportType || undefined }),
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: false
  });

  const isLoading = isLoadingStations || isLoadingParams;

  const filteredStations = useMemo(() => {
    if (!filters) return stations;
    const stationSearch = normalizeText(filters.stationSearch);
    const sousBassinSearch = normalizeText(filters.sousBassin);
    const bassinSearch = normalizeText(filters.bassin);

    return stations.filter((station: any) => {
      const bassin = normalizeText(station.bassin_nom);
      const sousBassin = normalizeText(station.sous_bassin_nom);
      const stationText = normalizeText([
        getStationName(station),
        station.ire_station,
        station.station_id,
        station.code_station,
      ].filter(Boolean).join(' '));

      return (
        (!bassinSearch || bassin.includes(bassinSearch)) &&
        (!sousBassinSearch || sousBassin.includes(sousBassinSearch)) &&
        (!stationSearch || stationText.includes(stationSearch))
      );
    });
  }, [stations, filters]);

  const filteredParameters = useMemo(() => {
    if (!filters) return parameters;
    const parameterSearch = normalizeText(filters.parameter);
    return parameters.filter((parameter: any) => !parameterSearch || normalizeText(getParameterName(parameter)).includes(parameterSearch));
  }, [parameters, filters]);

  const {
    totalStations,
    totalMesures,
    totalParameters,
    periodStr,
    supportData
  } = useMemo(() => {
    if (!filteredStations.length || !filteredParameters.length) {
      return { totalStations: 0, totalMesures: 0, totalParameters: 0, periodStr: '...', supportData: [] };
    }

    const totalStations = filteredStations.length;
    const totalMesures = filteredStations.reduce((sum, s) => sum + getMeasureCount(s), 0);
    const totalParameters = filteredParameters.length;

    const dates = filteredStations.flatMap(s => {
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
    filteredStations.forEach(s => {
      const type = s.support_type || 'INCONNU';
      supportMap[type] = (supportMap[type] || 0) + getMeasureCount(s);
    });

    const supportData = Object.entries(supportMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    return { totalStations, totalMesures, totalParameters, periodStr, supportData };
  }, [filteredStations, filteredParameters]);

  const topParamsData = useMemo(() => {
    if (!filteredParameters.length) return [];
    return [...filteredParameters]
      .map(p => ({
        name: getParameterName(p),
        mesures: getMeasureCount(p)
      }))
      .sort((a, b) => b.mesures - a.mesures)
      .slice(0, 5);
  }, [filteredParameters]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Chargement des données...</div>;
  }

  if (stationsError || paramsError) {
    const err = stationsError || paramsError;
    const errorMsg = (err as any)?.message || 'Erreur inconnue';
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-md border border-red-200">
        Erreur API : {errorMsg}
      </div>
    );
  }

  if (!filteredStations.length) {
    return (
      <div className="p-8 text-center bg-white rounded-md border border-slate-200 shadow-sm text-slate-500 italic">
        Aucune donnée retournée par l'API
      </div>
    );
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
          <div className="text-sm font-medium text-slate-400 mt-1 italic">Donnée insuffisante</div>
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
          <div className="flex-1 bg-slate-50 rounded border border-dashed border-slate-300 flex items-center justify-center text-slate-500 text-sm italic text-center p-4">
            Donnée insuffisante — nécessite agrégat backend par mois/année.
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
    </div>
  );
}
