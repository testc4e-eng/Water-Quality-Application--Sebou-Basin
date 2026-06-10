import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQualityStations, getQualityParameters, getQualityTimeseries } from '@/api/qualityRegulatory';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

export function QualityHistoriqueTab() {
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [selectedParam, setSelectedParam] = useState<string>('');

  const { data: stations = [], isLoading: isLoadingStations, error: stationsError } = useQuery({
    queryKey: ['unified-stations', 'RIVIERE'],
    queryFn: () => getQualityStations('RIVIERE')
  });

  const { data: parameters = [], isLoading: isLoadingParams } = useQuery({
    queryKey: ['unified-parameters', 'RIVIERE', selectedStation],
    queryFn: () => getQualityParameters('RIVIERE', selectedStation)
  });

  const { data: timeseries = [], isLoading: isLoadingTimeseries, error: timeseriesError } = useQuery({
    queryKey: ['unified-timeseries', 'RIVIERE', selectedStation],
    queryFn: () => getQualityTimeseries('RIVIERE', selectedStation),
    enabled: !!selectedStation
  });

  // Derived state
  const chartData = useMemo(() => {
    if (!timeseries.length || !selectedParam) return [];
    
    // The API returns rows with date_mesure, parametre_qualite, valeur
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

  if (isLoadingStations) {
    return <div className="p-8 text-center text-slate-500">Chargement des stations (Rivières)...</div>;
  }

  if (stationsError) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-md border border-red-200">
        Erreur lors du chargement des stations.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Historique Rivières</h2>
          <p className="text-sm text-slate-500">Exploration détaillée de la qualité des eaux de surface</p>
        </div>
      </div>

      {/* Barre d'outils / Filtres spécifiques à cet onglet */}
      <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[250px]">
          <label className="text-xs font-medium text-slate-700 block mb-1">Sélectionner une station (RIVIERE)</label>
          <select 
            className="w-full border-slate-200 rounded-md text-sm"
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
          >
            <option value="">-- Choisir une station --</option>
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

      {/* Contenu dynamique */}
      {!selectedStation ? (
        <div className="bg-white p-12 rounded-md border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-slate-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900">Aucune station sélectionnée</h3>
          <p className="text-slate-500 max-w-md mt-1">Veuillez choisir une station rivière dans la liste ci-dessus pour visualiser l'historique qualité.</p>
        </div>
      ) : isLoadingTimeseries ? (
        <div className="p-8 text-center text-slate-500 bg-white border border-slate-200 rounded-md shadow-sm">Chargement de l'historique...</div>
      ) : timeseriesError ? (
        <div className="p-8 text-center text-red-600 bg-red-50 border border-red-200 rounded-md shadow-sm">Mesures indisponibles</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white rounded-md border border-slate-200 shadow-sm p-4 h-[400px] flex flex-col">
            <h3 className="font-semibold text-slate-900 mb-4">Évolution temporelle : {selectedParam || 'Sélectionnez un paramètre'}</h3>
            <div className="flex-1 w-full">
              {!selectedParam ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 italic border border-dashed border-slate-200 rounded">
                  Sélectionnez un paramètre pour tracer la courbe
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
                <div className="w-full h-full flex items-center justify-center text-slate-400 italic">Aucune donnée historique pour ce paramètre</div>
              )}
            </div>
          </div>

          {/* Table Latest Values */}
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
                          <span className="text-[10px] text-slate-400 block -mt-1">unité à conf.</span>
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
        Source : API Qualité unifiée — vue api.v_qualite_dashboard_unifiee (support_type = 'RIVIERE')
      </div>
    </div>
  );
}
