import React, { useMemo, useState, useEffect } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { getQualityStations, getQualityTimeseries } from '@/api/qualityRegulatory';
import { getQualityDateRange, type QualityDashboardFilters } from './types';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface QualityRealtimeTabProps {
  filters?: QualityDashboardFilters;
}

const normalizeText = (value?: string | null) => (value || '').toLowerCase().trim();

export function QualityRealtimeTab({ filters }: QualityRealtimeTabProps) {
  const stationSearch = normalizeText(filters?.stationSearch);
  const { dateStart, dateEnd } = filters ? getQualityDateRange(filters.period) : { dateStart: undefined, dateEnd: undefined };

  const { data: stations = [], isLoading: isLoadingStations, error: stationsError } = useQuery({
    queryKey: ['unified-stations', 'SENTINELLE'],
    queryFn: () => getQualityStations({ support_type: 'SENTINELLE' }),
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: false
  });

  // 1. Filtrer les 6 IREs métiers validés
  const VALID_IRES = ['3695/8', '1541/15', '1540/15', '1355/8', '3738/8', '2263/15'];
  const filteredStations = useMemo(() => {
    return stations.filter(s => {
      const stationId = s.ire_station || s.station_id;
      const stationText = normalizeText([s.station_nom, s.station_name, s.ire_station, s.station_id, s.code_station].filter(Boolean).join(' '));
      return !!stationId && VALID_IRES.includes(stationId) && (!stationSearch || stationText.includes(stationSearch));
    });
  }, [stations, stationSearch]);

  // Fetch timeseries for each station to get latest values and sparklines
  const timeseriesQueries = useQueries({
    queries: filteredStations.map(station => ({
      queryKey: ['unified-timeseries', 'SENTINELLE', station.ire_station || station.station_id, dateStart, dateEnd, filters?.parameter || 'ALL'],
      queryFn: () => getQualityTimeseries({
        support_type: 'SENTINELLE',
        ire_station: station.ire_station || undefined,
        station_id: (!station.ire_station && station.station_id) ? station.station_id : undefined,
        date_from: dateStart,
        date_to: dateEnd,
        parametre_qualite: filters?.parameter || undefined,
      }),
      enabled: !!(station.ire_station || station.station_id)
    }))
  });

  const isLoading = isLoadingStations;

  // Group and format the data
  const stationsData = useMemo(() => {
    if (!filteredStations.length) return [];
    
    return filteredStations.map((station, index) => {
      const tsQuery = timeseriesQueries[index];
      const tsData = tsQuery?.data || [];
      const isLoadingTs = tsQuery?.isLoading;
      const errorTs = tsQuery?.error as any;
      const isErrorTs = tsQuery?.isError;

      // tsData is an array of rows: { date_mesure, parametre_qualite, valeur }
      // We need to pivot this to get the latest values and sparklines
      const latestValues: Record<string, { value: number, date: string }> = {};
      const pivotByDate: Record<string, Record<string, number>> = {};
      
      tsData.forEach((row: any) => {
        const date = row.date_mesure || row.date;
        const param = (row.parametre_qualite || row.parameter || '').toUpperCase();
        const val = row.valeur || row.value;
        
        if (!date || !param || val === null || val === undefined) return;
        
        if (!pivotByDate[date]) pivotByDate[date] = { date };
        pivotByDate[date][param] = val;
        
        // Track latest
        if (!latestValues[param] || new Date(date) > new Date(latestValues[param].date)) {
          latestValues[param] = { value: val, date };
        }
      });
      
      const sparklineData = Object.values(pivotByDate).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Calculate freshness
      let freshness = "Inconnu";
      let freshnessColor = "bg-slate-100 text-slate-600";
      const dtMax = station.dt_max || (station as any).date_max;
      if (dtMax) {
        const formattedDate = new Date(dtMax).toLocaleDateString('fr-FR');
        freshness = `Dernière donnée : ${formattedDate}`;
        const daysOld = Math.floor((new Date().getTime() - new Date(dtMax).getTime()) / (1000 * 3600 * 24));
        if (daysOld <= 2) {
          freshnessColor = "bg-green-100 text-green-700";
        } else if (daysOld <= 7) {
          freshnessColor = "bg-blue-100 text-blue-700";
        } else {
          freshnessColor = "bg-amber-100 text-amber-700";
        }
      }

      return {
        id: station.ire_station || station.station_id,
        name: station.station_name || station.station_nom,
        bassin: station.bassin_nom || 'Sebou',
        measureCount: station.n_mesures || (station as any).measure_count,
        latestDate: dtMax,
        freshness,
        freshnessColor,
        latestValues,
        sparklineData,
        isLoadingTs,
        isErrorTs,
        errorTs,
        hasData: tsData.length > 0
      };
    });
  }, [filteredStations, timeseriesQueries]);

  const [tooLong, setTooLong] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTooLong(true), 8000);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) {
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
    return <div className="p-8 text-center text-slate-500">Chargement des stations sentinelles...</div>;
  }

  if (stationsError) {
    const errorMsg = (stationsError as any)?.message || 'Erreur inconnue';
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-md border border-red-200">
        Erreur API : {errorMsg}
      </div>
    );
  }

  if (!stationsData.length) {
    return (
      <div className="p-8 text-center bg-white rounded-md border border-slate-200">
        <div className="text-slate-500 italic mb-2">Aucune station sentinelle trouvée.</div>
        <div className="text-xs text-slate-400">Vérifiez que des données avec support_type='SENTINELLE' existent.</div>
      </div>
    );
  }

  const TARGET_PARAMS = ['PH', 'O2 DISSOUS', 'DBO5', 'DCO', 'MES', 'NO3'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Stations Sentinelles ({stationsData.length})</h2>
          <p className="text-sm text-slate-500">Suivi quasi temps réel du réseau de capteurs automatiques</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {stationsData.map(station => (
          <div key={station.id} className="bg-white rounded-md border border-slate-200 shadow-sm p-4 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">{station.name}</h3>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                  <span className="font-medium">IRE: {station.id}</span>
                  <span>•</span>
                  <span>{station.bassin}</span>
                  <span>•</span>
                  <span>{station.measureCount?.toLocaleString('fr-FR')} mesures</span>
                </div>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full font-medium ${station.freshnessColor}`}>
                {station.freshness}
              </div>
            </div>

            <div className="flex-1">
              {station.isLoadingTs ? (
                <div className="h-24 flex items-center justify-center text-slate-500 text-sm">
                  Chargement mesures...
                </div>
              ) : station.isErrorTs ? (
                <div className="h-24 flex items-center justify-center text-red-500 italic text-sm border border-dashed border-red-200 rounded bg-red-50">
                  Erreur API : {station.errorTs?.message || 'Inconnue'}
                </div>
              ) : !station.hasData ? (
                <div className="h-24 flex items-center justify-center text-slate-400 italic text-sm border border-dashed border-slate-200 rounded">
                  Aucune donnée retournée par l'API
                </div>
              ) : Object.keys(station.latestValues).length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {TARGET_PARAMS.map(paramKey => {
                    // Try to find exact or partial match for parameter (e.g., O2, O2 DISSOUS)
                    const actualParam = Object.keys(station.latestValues).find(k => k.includes(paramKey) || paramKey.includes(k));
                    const valObj = actualParam ? station.latestValues[actualParam] : null;
                    
                    return (
                      <div key={paramKey} className="bg-slate-50 rounded p-3 border border-slate-100 flex flex-col">
                        <div className="text-xs text-slate-500 font-medium truncate" title={actualParam || paramKey}>
                          {actualParam || paramKey}
                        </div>

                        {valObj ? (
                          <div className="mt-1 flex items-end justify-between">
                            <div>
                              <span className="font-bold text-slate-900">{valObj.value.toLocaleString('fr-FR')}</span>
                              <div className="text-[10px] text-slate-400 italic leading-tight mt-0.5">unité à confirmer</div>
                            </div>
                            <div className="h-6 w-12 ml-2">
                              {station.sparklineData.length > 1 && (
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={station.sparklineData}>
                                    <YAxis domain={['dataMin', 'dataMax']} hide />
                                    <Line type="monotone" dataKey={actualParam!} stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                                  </LineChart>
                                </ResponsiveContainer>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-1 text-sm italic text-slate-400">N/D</div>
                        )}
                        {valObj && (
                          <div className="text-[10px] text-slate-400 mt-1">
                            {new Date(valObj.date).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-24 flex items-center justify-center text-slate-400 italic text-sm border border-dashed border-slate-200 rounded">
                  Aucune mesure récente
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-xs text-slate-400">
        Source : API Qualité unifiée — vue api.v_qualite_dashboard_unifiee (support_type = 'SENTINELLE')
      </div>
    </div>
  );
}
