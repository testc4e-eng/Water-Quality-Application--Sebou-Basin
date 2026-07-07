import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQualityStations } from '@/api/qualityRegulatory';
import type { QualityDashboardFilters } from './types';

interface QualityAlertsQATabProps {
  filters?: QualityDashboardFilters;
}

export function QualityAlertsQATab({ filters }: QualityAlertsQATabProps) {
  const { data: stations = [], isLoading, error } = useQuery({
    queryKey: ['unified-stations'],
    queryFn: () => getQualityStations(),
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: false
  });

  const alerts = useMemo(() => {
    if (!stations.length) return [];
    
    const issues = [];
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    stations.forEach(s => {
      const id = s.ire_station || s.station_id;
      const name = s.station_name || s.station_nom || id;
      const support = s.support_type || 'INCONNU';
      const dtMax = s.dt_max || (s as any).date_max;
      
      // Check for old data
      if (dtMax) {
        const lastDate = new Date(dtMax);
        if (lastDate < oneYearAgo) {
          issues.push({
            id,
            name,
            support,
            type: 'DONNEES_ANCIENNES',
            severity: 'warning',
            message: `Dernière mesure remonte au ${lastDate.toLocaleDateString('fr-FR')}`
          });
        }
      } else {
        issues.push({
          id,
          name,
          support,
          type: 'SANS_MESURE',
          severity: 'error',
          message: `Aucune date de mesure récente détectée`
        });
      }

      // Check if invalid exists (if API exposed it, placeholder for now)
      if ((s as any).est_valide === false) {
         issues.push({
          id,
          name,
          support,
          type: 'DONNEES_INVALIDES',
          severity: 'error',
          message: `Mesures marquées comme invalides par le système`
        });
      }
    });

    return issues.sort((a, b) => a.support.localeCompare(b.support) || a.name.localeCompare(b.name));
  }, [stations]);

  const stats = useMemo(() => {
    const errorCount = alerts.filter(a => a.severity === 'error').length;
    const warningCount = alerts.filter(a => a.severity === 'warning').length;
    return { errorCount, warningCount, total: alerts.length };
  }, [alerts]);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Analyse de la qualité des données en cours...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-md border border-red-200">
        Erreur lors du chargement des données pour l'analyse QA.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Alertes & Assurance Qualité (QA)</h2>
          <p className="text-sm text-slate-500">Supervision de l'état du réseau de mesures</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 font-medium">Stations analysées</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{stations.length}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-md border border-red-100 shadow-sm">
          <div className="text-sm text-red-600 font-medium">Alertes critiques</div>
          <div className="text-2xl font-bold text-red-700 mt-1">{stats.errorCount}</div>
        </div>
        <div className="bg-amber-50 p-4 rounded-md border border-amber-100 shadow-sm">
          <div className="text-sm text-amber-600 font-medium">Avertissements</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{stats.warningCount}</div>
        </div>
      </div>

      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-medium text-slate-900">Liste des anomalies détectées</h3>
          <span className="text-xs text-slate-500">{stats.total} résultat(s)</span>
        </div>
        
        <div className="max-h-[500px] overflow-y-auto">
          {alerts.length > 0 ? (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-white sticky top-0">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Station</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Support</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Détails</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {alerts.map((alert, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {alert.name} <span className="text-xs text-slate-400 font-normal">({alert.id})</span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{alert.support}</span>
                    </td>
                    <td className="px-4 py-3">
                      {alert.severity === 'error' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          {alert.type.replace('_', ' ')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          {alert.type.replace('_', ' ')}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {alert.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center flex flex-col items-center">
              <svg className="w-12 h-12 text-green-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-slate-900">Aucune anomalie détectée</h3>
              <p className="text-slate-500 mt-1">L'ensemble du réseau semble à jour selon les règles de base.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-slate-400 space-y-1">
        <p>Règles appliquées : "Données anciennes" (dernière mesure &gt; 1 an), "Sans mesure" (date manquante).</p>
        <p>Source : API Qualité unifiée — vue api.v_qualite_dashboard_unifiee</p>
      </div>
    </div>
  );
}
