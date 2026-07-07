import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQualityStations, getQualityParameters, getQualityTimeseries } from '@/api/qualityRegulatory';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import type { QualityDashboardFilters } from './types';

interface QualityGuardDamsTabProps {
  filters?: QualityDashboardFilters;
}

export function QualityGuardDamsTab({ filters }: QualityGuardDamsTabProps) {
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [selectedParam, setSelectedParam] = useState<string>('');

  const { data: stations = [], isLoading: isLoadingStations, error: stationsError } = useQuery({
    queryKey: ['unified-stations', 'BARRAGE_GARDE'],
    queryFn: () => getQualityStations({ support_type: 'BARRAGE_GARDE' }),
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: false
  });

  const { data: parameters = [], isLoading: isLoadingParams } = useQuery({
    queryKey: ['unified-parameters', 'BARRAGE_GARDE', selectedStation],
    queryFn: () => getQualityParameters({
      support_type: 'BARRAGE_GARDE',
      ire_station: selectedStation?.includes('/') ? selectedStation : undefined,
      station_id: selectedStation && !selectedStation.includes('/') ? selectedStation : undefined,
    }),
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    enabled: !!selectedStation
  });

  const { data: timeseries = [], isLoading: isLoadingTimeseries, error: timeseriesError } = useQuery({
    queryKey: ['unified-timeseries', 'BARRAGE_GARDE', selectedStation],
    queryFn: () => getQualityTimeseries({
      support_type: 'BARRAGE_GARDE',
      ire_station: selectedStation?.includes('/') ? selectedStation : undefined,
      station_id: selectedStation && !selectedStation.includes('/') ? selectedStation : undefined,
    }),
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    enabled: !!selectedStation
  });

  // Derived KPIs
  const { totalStations, totalMesures, periodStr } = useMemo(() => {
    if (!stations.length) return { totalStations: 0, totalMesures: 0, periodStr: '...' };
    const totalStations = stations.length;
    const totalMesures = stations.reduce((sum, s) => sum + (s.n_mesures || (s as any).measure_count || 0), 0);
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
    return { totalStations, totalMesures, periodStr };
  }, [stations]);

  // Derived state
  const chartData = useMemo(() => {
    if (!timeseries.length || !selectedParam) return [];
    const filtered = timeseries.filter((row: any) => 
      (row.parametre_qualite || row.parameter) === selectedParam && 
      (row.valeur || row.value) !== null
    );
    return filtered
      .map((row: any) => ({
        date: new Date(row.date_mesure || row.date).toLocaleDateString('fr-FR'),
        timestamp: new Date(row.date_mesure || row.date).getTime(),
        valeur: row.valeur || row.value
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [timeseries, selectedParam]);

  const latestValues = useMemo(() => {
    if (!timeseries.length) return [];
    const latestMap: Record<string, any> = {};
    timeseries.forEach((row: any) => {
      const param = row.parametre_qualite || row.parameter;
      const date = row.date_mesure || row.date;
      const val = row.valeur || row.value;
      if (!param || !date || val === null) return;
      if (!latestMap[param] || new Date(date).getTime() > new Date(latestMap[param].date).getTime()) {
        latestMap[param] = { param, date, val };
      }
    });
    return Object.values(latestMap).sort((a, b) => a.param.localeCompare(b.param));
  }, [timeseries]);

  const [tooLong, setTooLong] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTooLong(true), 8000);
    return () => clearTimeout(t);
  }, []);

  if (isLoadingStations) {
    if (tooLong) {
      return (
        <div className="p-8 text-center bg-amber-50 text-amber-700 rounded-md border border-amber-200">
          <div className="font-semibold mb-2">Le chargement est très long...</div>
          <div className="text-sm">L'API /quality/unified/stations met trop de temps à répondre. Veuillez vérifier les performances du serveur.</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-md shadow-sm text-sm font-medium hover:bg-amber-50"
          >
            Réessayer
          </button>
        </div>
      );
    }
    return <div className="p-8 text-center text-slate-500">Chargement des points de garde...</div>;
  }

  if (stationsError) {
    const errorMsg = (stationsError as any)?.message || 'Erreur inconnue';
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-md border border-red-200">
        Erreur API : {errorMsg}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Suivi Barrage de Garde</h2>
          <p className="text-sm text-slate-500">Qualité des eaux aux points stratégiques de garde</p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md text-sm text-blue-800">
        <strong>Information :</strong> Suivi spécifique barrage de garde — source séparée des barrages classiques (qualite.suivi_qualite_barrage_garde_hebdo).
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 font-medium">Points suivis</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalStations}</div>
        </div>
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 font-medium">Mesures totales</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalMesures.toLocaleString('fr-FR')}</div>
        </div>
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 font-medium">Période</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{periodStr}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[250px]">
          <label className="text-xs font-medium text-slate-700 block mb-1">Sélectionner un point de garde</label>
          <select 
            className="w-full border-slate-200 rounded-md text-sm"
            value={selectedStation}
            onChange={(e) => { setSelectedStation(e.target.value); setSelectedParam(''); }}
          >
            <option value="">-- Choisir un point --</option>
            {stations.map(s => (
              <option key={s.ire_station || s.station_id} value={s.ire_station || s.station_id}>
                {s.station_name || s.station_nom} ({s.ire_station || s.station_id})
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[250px]">
          <label className="text-xs font-medium text-slate-700 block mb-1">Paramètre</label>
          <select 
            className="w-full border-slate-200 rounded-md text-sm"
            value={selectedParam}
            onChange={(e) => setSelectedParam(e.target.value)}
            disabled={!selectedStation || isLoadingParams}
          >
            <option value="">-- Choisir un paramètre --</option>
            {parameters.map(p => (
              <option key={p.parametre_qualite || p.parameter} value={p.parametre_qualite || p.parameter}>
                {p.parametre_qualite || p.parameter} ({(p as any).measure_count || p.n_mesures} mesures)
              </option>
            ))}
          </select>
        </div>
      </div>

      {!selectedStation ? (
        <div className="bg-white p-12 rounded-md border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-medium text-slate-900">Aucun point sélectionné</h3>
          <p className="text-slate-500 max-w-md mt-1">Veuillez choisir un point de garde dans la liste ci-dessus.</p>
        </div>
      ) : isLoadingTimeseries ? (
        <div className="p-8 text-center text-slate-500 bg-white border border-slate-200 rounded-md shadow-sm">Chargement de l'historique...</div>
      ) : timeseriesError ? (
        <div className="p-8 text-center text-red-600 bg-red-50 border border-red-200 rounded-md shadow-sm">
          Erreur API : {(timeseriesError as any)?.message || 'Inconnue'}
        </div>
      ) : timeseries.length === 0 ? (
        <div className="p-8 text-center text-slate-400 bg-white border border-slate-200 rounded-md shadow-sm italic">
          Aucune donnée retournée par l'API
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-md border border-slate-200 shadow-sm p-4 h-[400px] flex flex-col">
            <h3 className="font-semibold text-slate-900 mb-4">Évolution temporelle : {selectedParam || 'Sélectionnez un paramètre'}</h3>
            <div className="flex-1 w-full">
              {!selectedParam ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 italic border border-dashed border-slate-200 rounded">
                  Sélectionnez un paramètre
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <RechartsTooltip formatter={(val: number) => val.toLocaleString('fr-FR')} labelStyle={{color: '#0f172a'}} />
                    <Legend verticalAlign="top" height={36}/>
                    <Line type="monotone" dataKey="valeur" name={selectedParam} stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 italic">Aucune donnée historique</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-md border border-slate-200 shadow-sm p-4 flex flex-col h-[400px]">
            <h3 className="font-semibold text-slate-900 mb-4">Dernières valeurs mesurées</h3>
            <div className="flex-1 overflow-y-auto pr-2">
              {latestValues.length > 0 ? (
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 font-medium">Paramètre</th>
                      <th className="px-3 py-2 font-medium text-right">Valeur</th>
                      <th className="px-3 py-2 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestValues.map((row, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="px-3 py-2 font-medium text-slate-900" title={row.param}>
                          {row.param.length > 15 ? row.param.substring(0, 15) + '...' : row.param}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <span className="font-semibold">{row.val.toLocaleString('fr-FR')}</span>
                        </td>
                        <td className="px-3 py-2 text-slate-500 text-xs">
                          {new Date(row.date).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 italic text-center">
                  Aucune mesure remontée
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-center text-xs text-slate-400">
        Source : API Qualité unifiée — vue api.v_qualite_dashboard_unifiee (support_type = 'BARRAGE_GARDE')
      </div>
    </div>
  );
}
