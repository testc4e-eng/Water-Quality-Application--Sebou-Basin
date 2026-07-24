import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQualityStations, getQualityParameters, getQualityTimeseries } from '@/api/qualityRegulatory';
import { getQualityDateRange, type QualityDashboardFilters } from './types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

interface QualityHistoriqueTabProps {
  filters?: QualityDashboardFilters;
}

const normalizeText = (value?: string | null) => (value || '').toLowerCase().trim();
const getStationName = (station: any) => station.station_nom || station.station_name || station.ire_station || station.station_id || 'Station sans nom';
const getParameterName = (parameter: any) => parameter.parametre_qualite || parameter.parameter || 'Inconnu';
const getRowParameter = (row: any) => row.parametre_qualite || row.parameter || '';
const getRowDate = (row: any) => row.date_mesure || row.date || row.date_prelevement || '';
const getRowValue = (row: any): number | null => {
  const raw = row.valeur ?? row.value;
  if (raw === null || raw === undefined || raw === '') return null;
  const value = typeof raw === 'number' ? raw : Number(String(raw).replace(',', '.'));
  return Number.isFinite(value) ? value : null;
};
const formatValue = (value: number | null) => value === null ? 'n/a' : value.toLocaleString('fr-FR');

export function QualityHistoriqueTab({ filters }: QualityHistoriqueTabProps) {
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [selectedParam, setSelectedParam] = useState<string>('');
  const [graphPeriod, setGraphPeriod] = useState<QualityDashboardFilters['period']>('all');
  const stationSearch = normalizeText(filters?.stationSearch);
  const sousBassinSearch = normalizeText(filters?.sousBassin);
  const { dateStart, dateEnd, label: graphPeriodLabel } = getQualityDateRange(graphPeriod);

  const { data: stations = [], isLoading: isLoadingStations, error: stationsError } = useQuery({
    queryKey: ['unified-stations', 'RIVIERE'],
    queryFn: () => getQualityStations({ support_type: 'RIVIERE' }),
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: false
  });

  const filteredStations = useMemo(() => {
    return stations.filter((station: any) => {
      const stationText = normalizeText([getStationName(station), station.ire_station, station.station_id, station.code_station].filter(Boolean).join(' '));
      const sousBassin = normalizeText(station.sous_bassin_nom);
      return (
        (!stationSearch || stationText.includes(stationSearch)) &&
        (!sousBassinSearch || sousBassin.includes(sousBassinSearch))
      );
    });
  }, [stations, stationSearch, sousBassinSearch]);

  const { data: parameters = [], isLoading: isLoadingParams } = useQuery({
    queryKey: ['unified-parameters', 'RIVIERE', selectedStation],
    queryFn: () => getQualityParameters({
      support_type: 'RIVIERE',
      ire_station: selectedStation?.includes('/') ? selectedStation : undefined,
      station_id: selectedStation && !selectedStation.includes('/') ? selectedStation : undefined,
    }),
    enabled: !!selectedStation
  });

  const filteredParameters = useMemo(() => {
    const parameterSearch = normalizeText(filters?.parameter);
    return parameters.filter((parameter: any) => !parameterSearch || normalizeText(getParameterName(parameter)).includes(parameterSearch));
  }, [parameters, filters?.parameter]);

  const effectiveParam = selectedParam || (filters?.parameter.trim() ? filters.parameter.trim() : '');

  const { data: timeseries = [], isLoading: isLoadingTimeseries, error: timeseriesError } = useQuery({
    queryKey: ['unified-timeseries', 'RIVIERE', selectedStation, dateStart, dateEnd, effectiveParam || 'ALL'],
    queryFn: () => getQualityTimeseries({
      support_type: 'RIVIERE',
      ire_station: selectedStation?.includes('/') ? selectedStation : undefined,
      station_id: selectedStation && !selectedStation.includes('/') ? selectedStation : undefined,
      date_from: dateStart,
      date_to: dateEnd,
      parametre_qualite: effectiveParam || undefined,
    }),
    enabled: !!selectedStation
  });

  // Derived state
  const chartData = useMemo(() => {
    if (!timeseries.length || !effectiveParam) return [];
    
    // The API returns rows with date_mesure, parametre_qualite, valeur
    const filtered = timeseries.filter((row: any) => getRowParameter(row) === effectiveParam && getRowValue(row) !== null);
    
    return filtered
      .map((row: any) => ({
        date: new Date(getRowDate(row)).toLocaleDateString('fr-FR'),
        timestamp: new Date(getRowDate(row)).getTime(),
        valeur: getRowValue(row) ?? 0
      }))
      .filter(row => !Number.isNaN(row.timestamp))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [timeseries, effectiveParam]);

  const selectedParamRows = useMemo(() => {
    if (!timeseries.length || !effectiveParam) return [];

    return timeseries
      .filter((row: any) => getRowParameter(row) === effectiveParam && getRowValue(row) !== null && getRowDate(row))
      .map((row: any) => ({
        param: getRowParameter(row),
        date: getRowDate(row),
        timestamp: new Date(getRowDate(row)).getTime(),
        val: getRowValue(row),
        source: row.source_table || row.source || row.support_type || 'API qualité',
      }))
      .filter(row => !Number.isNaN(row.timestamp))
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [timeseries, effectiveParam]);

  const latestValues = useMemo(() => {
    if (!timeseries.length) return [];
    
    const latestMap: Record<string, any> = {};
    timeseries.forEach((row: any) => {
      const param = getRowParameter(row);
      const date = getRowDate(row);
      const val = getRowValue(row);
      
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

  useEffect(() => {
    if (!selectedStation) return;
    const stillVisible = filteredStations.some((station: any) => (station.ire_station || station.station_id) === selectedStation);
    if (!stillVisible) {
      setSelectedStation('');
      setSelectedParam('');
    }
  }, [filteredStations, selectedStation]);

  useEffect(() => {
    if (!selectedParam) return;
    const stillAvailable = filteredParameters.some(parameter => getParameterName(parameter) === selectedParam);
    if (!stillAvailable) setSelectedParam('');
  }, [filteredParameters, selectedParam]);

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
    return <div className="p-8 text-center text-slate-500">Chargement des stations (Rivières)...</div>;
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
            {filteredStations.map((s: any) => (
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
            {filteredParameters.map((p: any) => (
              <option key={getParameterName(p)} value={getParameterName(p)}>
                {getParameterName(p)} ({(p as any).measure_count ?? p.n_mesures ?? 0} mesures)
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-[220px]">
          <label className="text-xs font-medium text-slate-700 block mb-1">Période du graphique</label>
          <select
            className="w-full border-slate-200 rounded-md text-sm"
            value={graphPeriod}
            onChange={(event) => setGraphPeriod(event.target.value as QualityDashboardFilters['period'])}
          >
            <option value="all">Toutes les données</option>
            <option value="12m">Dernières 12 mois</option>
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
        <div className="p-8 text-center text-red-600 bg-red-50 border border-red-200 rounded-md shadow-sm">
          Erreur API : {(timeseriesError as any)?.message || 'Inconnue'}
        </div>
      ) : timeseries.length === 0 ? (
        <div className="p-8 text-center text-slate-400 bg-white border border-slate-200 rounded-md shadow-sm italic">
          Aucune donnée retournée par l'API
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white rounded-md border border-slate-200 shadow-sm p-4 h-[400px] flex flex-col">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-slate-900">Évolution temporelle : {selectedParam || 'Sélectionnez un paramètre'}</h3>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{graphPeriodLabel}</span>
            </div>
            <div className="flex-1 w-full">
              {!effectiveParam ? (
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
                    <Line type="monotone" dataKey="valeur" name={effectiveParam} stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 italic">Aucune donnée historique pour ce paramètre</div>
              )}
            </div>
          </div>

          {/* Side Panel - Values */}
          <div className="bg-white rounded-md border border-slate-200 shadow-sm p-4 h-[400px] flex flex-col">
            <h3 className="font-semibold text-slate-900 mb-4">{effectiveParam ? 'Valeurs existantes' : 'Dernières valeurs'}</h3>
            <div className="flex-1 overflow-y-auto">
              {effectiveParam ? (
                selectedParamRows.length > 0 ? (
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-3 py-2 font-medium">Date</th>
                        <th className="px-3 py-2 text-right font-medium">Valeur</th>
                        <th className="px-3 py-2 font-medium">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedParamRows.map((row, index) => (
                        <tr key={`${row.date}-${index}`} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                          <td className="px-3 py-2 text-slate-600">{new Date(row.date).toLocaleDateString('fr-FR')}</td>
                          <td className="px-3 py-2 text-right font-semibold text-slate-900">{formatValue(row.val)}</td>
                          <td className="px-3 py-2 text-xs text-slate-500">{row.source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">
                    Aucune valeur disponible pour ce paramètre
                  </div>
                )
              ) : latestValues.length > 0 ? (
                <div className="space-y-2">
                  {latestValues.map((item: any) => (
                    <div key={item.param} className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{item.param}</div>
                        <div className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString('fr-FR')}</div>
                      </div>
                      <div className="text-sm font-bold text-blue-600">{formatValue(item.val)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">
                  Aucune valeur disponible
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
