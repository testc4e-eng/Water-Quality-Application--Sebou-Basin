import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQualityParameters, getActiveThresholds, getRegulatoryStatus, RegulatoryThreshold } from '@/api/qualityRegulatory';
import type { QualityDashboardFilters } from './types';

const OBSERVATIONAL_PARAMS = [
  'H_P_A_TOTAUX',
  'HYDROCARBURES',
  'OXYDABILITE_KMNO4',
  'PESTICIDES_PAR_SUBST',
  'PESTICIDES_TOTAUX'
];

interface MergedParam {
  code: string;
  label: string;
  family: string | null;
  unit: string | null;
  isClassifiable: boolean;
  isObservational: boolean;
  measureCount: number;
  stationCount: number;
  dateMin: string | null;
  dateMax: string | null;
  thresholds: RegulatoryThreshold[];
  statusMessage: string;
  isMeasured: boolean;
  hasActiveThresholds: boolean;
  version: string | null;
  sourceRef: string | null;
}

interface QualityParametersTabProps {
  filters?: QualityDashboardFilters;
}

export function QualityParametersTab({ filters }: QualityParametersTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClassifiable, setFilterClassifiable] = useState<string>('ALL');
  const [filterMeasured, setFilterMeasured] = useState<string>('ALL');
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  const { data: parameters = [], isLoading: isLoadingParams, error: paramsError } = useQuery({
    queryKey: ['unified-parameters'],
    queryFn: () => getQualityParameters(),
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: false
  });

  const { data: thresholdsResp, isLoading: isLoadingThresholds, error: thresholdsError } = useQuery({
    queryKey: ['active-thresholds'],
    queryFn: () => getActiveThresholds(),
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  const { data: regStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ['regulatory-status'],
    queryFn: () => getRegulatoryStatus(),
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  const isLoading = isLoadingParams || isLoadingThresholds || isLoadingStatus;
  const error = paramsError || thresholdsError;

  const mergedData = useMemo(() => {
    if (!parameters || !thresholdsResp?.data) return [];
    
    const thresholds = thresholdsResp.data;
    const mergedMap = new Map<string, MergedParam>();

    // Helper pour trouver les seuils
    const findThresholds = (pName: string) => {
      let match = thresholds.filter(t => t.code_canonique === pName);
      if (match.length) return match;
      match = thresholds.filter(t => t.code_reglementaire === pName);
      if (match.length) return match;
      match = thresholds.filter(t => t.parametre_pdf === pName);
      if (match.length) return match;
      match = thresholds.filter(t => t.libelle_reglementaire === pName);
      return match;
    };

    // 1. Process Measured Parameters
    parameters.forEach(p => {
      const pName = p.parametre_qualite;
      const thMatch = findThresholds(pName);
      const isObs = OBSERVATIONAL_PARAMS.includes(pName);
      
      const paramCode = thMatch.length > 0 ? (thMatch[0].code_canonique || thMatch[0].code_reglementaire) : pName;
      
      mergedMap.set(paramCode, {
        code: paramCode,
        label: thMatch.length > 0 ? thMatch[0].libelle_reglementaire : pName,
        family: thMatch.length > 0 ? thMatch[0].famille_parametre : null,
        unit: thMatch.length > 0 ? (thMatch[0].unite_reglementaire_source || thMatch[0].unite_moteur) : null,
        isClassifiable: thMatch.length > 0 ? thMatch[0].classifiable : false,
        isObservational: isObs,
        measureCount: (p as any).measure_count || p.n_mesures || 0,
        stationCount: p.station_count || 0,
        dateMin: p.date_min || null,
        dateMax: p.date_max || null,
        thresholds: thMatch,
        isMeasured: true,
        hasActiveThresholds: thMatch.length > 0,
        statusMessage: thMatch.length > 0 ? 'Mesuré et réglementé' : 'Mesuré — non réglementé / non classifiable',
        version: thMatch.length > 0 ? thMatch[0].version_reglementaire : null,
        sourceRef: thMatch.length > 0 ? 'Tableau n°1 eaux de surface' : null
      });
    });

    // 2. Process Regulatory Thresholds without measurements
    thresholds.forEach(t => {
      const pCode = t.code_canonique || t.code_reglementaire;
      if (!mergedMap.has(pCode)) {
        const thMatch = thresholds.filter(th => (th.code_canonique || th.code_reglementaire) === pCode);
        const isObs = OBSERVATIONAL_PARAMS.includes(pCode);
        mergedMap.set(pCode, {
          code: pCode,
          label: t.libelle_reglementaire,
          family: t.famille_parametre,
          unit: t.unite_reglementaire_source || t.unite_moteur,
          isClassifiable: t.classifiable,
          isObservational: isObs,
          measureCount: 0,
          stationCount: 0,
          dateMin: null,
          dateMax: null,
          thresholds: thMatch,
          isMeasured: false,
          hasActiveThresholds: true,
          statusMessage: 'Référentiel actif — aucune mesure disponible',
          version: t.version_reglementaire,
          sourceRef: 'Tableau n°1 eaux de surface'
        });
      }
    });

    return Array.from(mergedMap.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [parameters, thresholdsResp]);

  const filteredParams = useMemo(() => {
    let result = mergedData;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.code.toLowerCase().includes(lower) || 
        p.label.toLowerCase().includes(lower) ||
        (p.family && p.family.toLowerCase().includes(lower))
      );
    }

    if (filterClassifiable !== 'ALL') {
      const wantClassifiable = filterClassifiable === 'YES';
      result = result.filter(p => p.isClassifiable === wantClassifiable);
    }

    if (filterMeasured !== 'ALL') {
      if (filterMeasured === 'MEASURED') result = result.filter(p => p.isMeasured);
      if (filterMeasured === 'UNMEASURED') result = result.filter(p => !p.isMeasured);
      if (filterMeasured === 'THRESHOLDS') result = result.filter(p => p.hasActiveThresholds);
      if (filterMeasured === 'NO_THRESHOLDS') result = result.filter(p => !p.hasActiveThresholds);
    }

    return result;
  }, [mergedData, searchTerm, filterClassifiable, filterMeasured]);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Chargement du référentiel et des paramètres...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-md border border-red-200">
        Erreur API : {(error as any)?.message || 'Erreur inconnue'}
      </div>
    );
  }

  const toggleExpand = (code: string) => {
    setExpandedCode(prev => prev === code ? null : code);
  };

  const getStatusBadge = (param: MergedParam) => {
    if (param.isObservational) {
      return <span className="px-2 py-1 text-[10px] font-semibold bg-purple-100 text-purple-800 rounded-full">OBSERVATIONNEL</span>;
    }
    if (param.isClassifiable) {
      return <span className="px-2 py-1 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full">CLASSIFIABLE</span>;
    }
    if (param.hasActiveThresholds && !param.isClassifiable) {
      return <span className="px-2 py-1 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded-full">NON_CLASSIFIABLE</span>;
    }
    return <span className="px-2 py-1 text-[10px] font-semibold bg-slate-100 text-slate-800 rounded-full">NON_MAPPÉ</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Référentiel des Paramètres</h2>
          <p className="text-sm text-slate-500">Croisement des mesures terrain avec les seuils réglementaires actifs</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 font-medium">Paramètres mesurés</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{parameters.length}</div>
        </div>
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 font-medium">Seuils actifs (API)</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{regStatus?.summary.thresholds_active || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 font-medium">Paramètres classifiables</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{regStatus?.summary.parameters_classifiable || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 font-medium">Version réglementaire</div>
          <div className="text-sm font-semibold text-slate-900 mt-1 truncate" title={regStatus?.version_reglementaire || 'Inconnue'}>
            {regStatus?.version_reglementaire?.split('_').pop() || 'Inconnue'}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 flex-1">
          <div className="relative w-64">
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-md"
              placeholder="Rechercher paramètre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="border-slate-300 rounded-md text-sm"
            value={filterClassifiable}
            onChange={(e) => setFilterClassifiable(e.target.value)}
          >
            <option value="ALL">Tous les statuts</option>
            <option value="YES">Classifiables uniquement</option>
            <option value="NO">Non classifiables</option>
          </select>
          <select 
            className="border-slate-300 rounded-md text-sm"
            value={filterMeasured}
            onChange={(e) => setFilterMeasured(e.target.value)}
          >
            <option value="ALL">Toutes les présences</option>
            <option value="MEASURED">Mesurés sur le terrain</option>
            <option value="UNMEASURED">Sans mesure terrain</option>
            <option value="THRESHOLDS">Avec seuil actif</option>
            <option value="NO_THRESHOLDS">Sans seuil (Non réglementé)</option>
          </select>
        </div>
        <div className="text-sm text-slate-500 font-medium">
          {filteredParams.length} résultat{filteredParams.length > 1 ? 's' : ''}
        </div>
      </div>

      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-left">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium text-slate-500">Paramètre / Libellé</th>
                <th scope="col" className="px-4 py-3 font-medium text-slate-500">Famille</th>
                <th scope="col" className="px-4 py-3 font-medium text-slate-500">Volumétrie</th>
                <th scope="col" className="px-4 py-3 font-medium text-slate-500">Statut</th>
                <th scope="col" className="px-4 py-3 font-medium text-slate-500">Seuils Actifs</th>
                <th scope="col" className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredParams.length > 0 ? (
                filteredParams.map((p) => {
                  const isExpanded = expandedCode === p.code;
                  return (
                    <React.Fragment key={p.code}>
                      <tr 
                        className={`hover:bg-slate-50 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-50' : ''}`}
                        onClick={() => toggleExpand(p.code)}
                      >
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{p.label}</div>
                          <div className="text-xs text-slate-500">{p.code}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{p.family || 'N/D'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {p.isMeasured ? (
                              <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-800 rounded">MESURÉ</span>
                            ) : (
                              <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded">SANS_MESURE</span>
                            )}
                            <span className="text-slate-900 font-medium">{p.measureCount.toLocaleString('fr-FR')}</span>
                            <span className="text-xs text-slate-500">({p.stationCount} st.)</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col items-start gap-1">
                            {getStatusBadge(p)}
                            <div className="text-[10px] text-slate-400 italic" title={p.statusMessage}>
                              {p.statusMessage.length > 30 ? p.statusMessage.substring(0, 30) + '...' : p.statusMessage}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {p.hasActiveThresholds ? (
                            <span className="px-2 py-1 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                              OUI ({p.thresholds.length})
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                              NON (0)
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <svg className={`w-5 h-5 text-slate-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-slate-50/80 border-b border-slate-200">
                          <td colSpan={6} className="px-4 py-4">
                            <div className="flex flex-col gap-4 max-w-4xl border-l-2 border-blue-500 pl-4 ml-2">
                              {p.hasActiveThresholds ? (
                                <>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Informations Générales</h4>
                                      <ul className="text-sm text-slate-700 space-y-1">
                                        <li><strong>Unité réglementaire :</strong> {p.unit || 'Non définie'}</li>
                                        <li><strong>Source / Version :</strong> {p.sourceRef} / <span className="text-xs text-slate-500">{p.version}</span></li>
                                        {p.isObservational && (
                                          <li className="text-purple-700 italic">Paramètre d'observation sans classe fixée.</li>
                                        )}
                                      </ul>
                                    </div>
                                    <div>
                                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Définition des Seuils</h4>
                                      <div className="space-y-2">
                                        {p.thresholds.map(t => (
                                          <div key={t.code_reglementaire} className="flex items-center text-sm">
                                            <span 
                                              className="w-4 h-4 rounded-full mr-2 shadow-sm border border-black/10" 
                                              style={{ backgroundColor: t.couleur_sad || '#ccc' }}
                                            />
                                            <span className="font-medium w-24">{t.libelle_classe}</span>
                                            <span className="font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                                              {t.valeur_intervalle_originale || 'Valeur N/D'}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="text-sm text-slate-500 italic py-2">
                                  Ce paramètre n'a aucun seuil de qualité actif dans le référentiel actuel.
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500 italic">
                    Aucun paramètre ne correspond aux filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
