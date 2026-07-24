export type ThresholdType = 'range' | 'max' | 'min';

export interface ThresholdDefinition {
  type: ThresholdType;
  good: [number, number] | number;
  medium: [number, number] | number;
  /** Unité optionnelle pour affichage des seuils */
  unit?: string;
}

export interface ThematiqueParameter {
  code: string;
  label: string;
  domain: 'QUALITE' | 'HYDROLOGIE' | 'METEO' | 'POLLUTION';
  supportTypes: string[];
  thresholds?: ThresholdDefinition;
}

export interface ThematiqueSubThematique {
  id: string;
  label: string;
  parameters: ThematiqueParameter[];
}

export interface Thematique {
  id: string;
  label: string;
  subThematiques: ThematiqueSubThematique[];
}

export type ThresholdStatus = 'good' | 'medium' | 'bad' | null;

export const THEMATIQUES: Thematique[] = [
  {
    id: 'qualite_eau',
    label: 'Qualité de l\'eau',
    subThematiques: [
      {
        id: 'physico_chimique',
        label: 'Physico-chimique',
        parameters: [
          { code: 'pH', label: 'pH', domain: 'QUALITE', supportTypes: ['STATION_QUALITE', 'STATION_SENTINELLE'], thresholds: { type: 'range', good: [6.5, 8.5], medium: [6.0, 9.0] } },
          { code: 'DBO5', label: 'DBO5', domain: 'QUALITE', supportTypes: ['STATION_QUALITE', 'POINT_PRELEVEMENT_POLLUTION'], thresholds: { type: 'max', good: 3, medium: 10 } },
          { code: 'MES', label: 'MES', domain: 'QUALITE', supportTypes: ['STATION_QUALITE', 'POINT_PRELEVEMENT_POLLUTION'], thresholds: { type: 'max', good: 20, medium: 100 } },
          { code: 'COND', label: 'Conductivité', domain: 'QUALITE', supportTypes: ['STATION_QUALITE', 'STATION_SENTINELLE'], thresholds: { type: 'range', good: [200, 1000], medium: [100, 2000] } },
          { code: 'O2_Diss', label: 'O2 Dissous', domain: 'QUALITE', supportTypes: ['STATION_QUALITE', 'POINT_PRELEVEMENT_POLLUTION'], thresholds: { type: 'min', good: 7, medium: 5 } },
        ]
      },
      {
        id: 'nutriments',
        label: 'Nutriments',
        parameters: [
          { code: 'NTK', label: 'Azote Total Kjeldahl', domain: 'QUALITE', supportTypes: ['STATION_QUALITE', 'STATION_SENTINELLE'], thresholds: { type: 'max', good: 1, medium: 2 } },
          { code: 'NO3', label: 'Nitrates', domain: 'QUALITE', supportTypes: ['STATION_QUALITE', 'STATION_SENTINELLE', 'POINT_PRELEVEMENT_POLLUTION'], thresholds: { type: 'max', good: 10, medium: 25 } },
          { code: 'NH4', label: 'Ammonium', domain: 'QUALITE', supportTypes: ['STATION_QUALITE', 'STATION_SENTINELLE', 'POINT_PRELEVEMENT_POLLUTION'], thresholds: { type: 'max', good: 0.5, medium: 2 } },
          { code: 'PT', label: 'Phosphore Total', domain: 'QUALITE', supportTypes: ['STATION_QUALITE', 'POINT_PRELEVEMENT_POLLUTION'], thresholds: { type: 'max', good: 0.1, medium: 0.5 } },
          { code: 'PO43_', label: 'Phosphates', domain: 'QUALITE', supportTypes: ['POINT_PRELEVEMENT_POLLUTION'], thresholds: { type: 'max', good: 0.1, medium: 0.5 } },
        ]
      },
      {
        id: 'metaux_lourds',
        label: 'Métaux lourds',
        parameters: [
          { code: 'Cd', label: 'Cadmium', domain: 'POLLUTION', supportTypes: ['POINT_PRELEVEMENT_POLLUTION'], thresholds: { type: 'max', good: 2, medium: 5 } },
          { code: 'Pb', label: 'Plomb', domain: 'POLLUTION', supportTypes: ['POINT_PRELEVEMENT_POLLUTION'], thresholds: { type: 'max', good: 5, medium: 10 } },
          { code: 'Hg', label: 'Mercure', domain: 'POLLUTION', supportTypes: ['POINT_PRELEVEMENT_POLLUTION'], thresholds: { type: 'max', good: 0.05, medium: 0.1 } },
          { code: 'CrT', label: 'Chrome', domain: 'POLLUTION', supportTypes: ['POINT_PRELEVEMENT_POLLUTION'], thresholds: { type: 'max', good: 20, medium: 50 } },
        ]
      },
      {
        id: 'bacteriologique',
        label: 'Bactériologique',
        parameters: [
          { code: 'CF', label: 'Coliformes Fécaux', domain: 'QUALITE', supportTypes: ['STATION_QUALITE', 'POINT_PRELEVEMENT_POLLUTION'], thresholds: { type: 'max', good: 200, medium: 1000 } },
          { code: 'CT', label: 'Coliformes Totaux', domain: 'QUALITE', supportTypes: ['STATION_QUALITE', 'POINT_PRELEVEMENT_POLLUTION'], thresholds: { type: 'max', good: 500, medium: 2000 } },
          { code: 'SF', label: 'Streptocoques Fécaux', domain: 'QUALITE', supportTypes: ['STATION_QUALITE'], thresholds: { type: 'max', good: 100, medium: 500 } },
        ]
      }
    ]
  },
  {
    id: 'hydrologie',
    label: 'Hydrologie',
    subThematiques: [
      {
        id: 'debit',
        label: 'Débit',
        parameters: [
          { code: 'DEBIT', label: 'Débit', domain: 'HYDROLOGIE', supportTypes: ['STATION_HYDRO'], thresholds: { type: 'min', good: 100, medium: 10 } },
        ]
      },
      {
        id: 'barrage',
        label: 'Barrage',
        parameters: [
          { code: 'VOLUME', label: 'Volume', domain: 'HYDROLOGIE', supportTypes: ['BARRAGE'], thresholds: { type: 'min', good: 70, medium: 30 } },
          { code: 'COTE', label: 'Cote', domain: 'HYDROLOGIE', supportTypes: ['BARRAGE'] },
        ]
      }
    ]
  },
  {
    id: 'meteo',
    label: 'Météo',
    subThematiques: [
      {
        id: 'precipitations',
        label: 'Précipitations',
        parameters: [
          { code: 'PREC', label: 'Précipitation', domain: 'METEO', supportTypes: ['STATION_METEO'], thresholds: { type: 'min', good: 50, medium: 10 } },
        ]
      },
      {
        id: 'temperature',
        label: 'Température',
        parameters: [
          { code: 'T_EAU', label: 'Température eau', domain: 'METEO', supportTypes: ['STATION_METEO', 'STATION_QUALITE', 'POINT_PRELEVEMENT_POLLUTION'], thresholds: { type: 'range', good: [10, 25], medium: [5, 30] } },
          { code: 'T_AIR', label: 'Température air', domain: 'METEO', supportTypes: ['STATION_METEO', 'STATION_QUALITE'], thresholds: { type: 'range', good: [15, 30], medium: [5, 40] } },
        ]
      }
    ]
  }
];

export function findParameter(thematiqueId: string, subThematiqueId: string, parameterCode: string): ThematiqueParameter | null {
  const thematique = THEMATIQUES.find(t => t.id === thematiqueId);
  if (!thematique) return null;
  const sub = thematique.subThematiques.find(s => s.id === subThematiqueId);
  if (!sub) return null;
  return sub.parameters.find(p => p.code === parameterCode) || null;
}

export function getSubThematiques(thematiqueId: string): ThematiqueSubThematique[] {
  return THEMATIQUES.find(t => t.id === thematiqueId)?.subThematiques || [];
}

export function getParameters(thematiqueId: string, subThematiqueId: string): ThematiqueParameter[] {
  return getSubThematiques(thematiqueId).find(s => s.id === subThematiqueId)?.parameters || [];
}

export function getAllParameters(): ThematiqueParameter[] {
  const params: ThematiqueParameter[] = [];
  for (const thematique of THEMATIQUES) {
    for (const sub of thematique.subThematiques) {
      for (const param of sub.parameters) {
        if (!params.find(p => p.code === param.code)) {
          params.push(param);
        }
      }
    }
  }
  return params;
}

export function filterThematiqueTree(availableParameters: string[]): Thematique[] {
  return THEMATIQUES
    .map(t => ({
      ...t,
      subThematiques: t.subThematiques
        .map(st => ({
          ...st,
          parameters: st.parameters.filter(p => availableParameters.includes(p.code))
        }))
        .filter(st => st.parameters.length > 0)
    }))
    .filter(t => t.subThematiques.length > 0);
}

export function findParameterByCode(parameterCode: string, domain?: string): ThematiqueParameter | null {
  for (const thematique of THEMATIQUES) {
    for (const sub of thematique.subThematiques) {
      for (const param of sub.parameters) {
        if (param.code === parameterCode && (!domain || param.domain === domain)) {
          return param;
        }
      }
    }
  }
  return null;
}

export function getThresholdStatus(thresholds: ThresholdDefinition | undefined, value: number | null | undefined): ThresholdStatus {
  if (thresholds == null || value == null || Number.isNaN(value)) return null;

  if (thresholds.type === 'range') {
    const good = thresholds.good as [number, number];
    const medium = thresholds.medium as [number, number];
    if (value >= good[0] && value <= good[1]) return 'good';
    if (value >= medium[0] && value <= medium[1]) return 'medium';
    return 'bad';
  }

  if (thresholds.type === 'max') {
    const good = thresholds.good as number;
    const medium = thresholds.medium as number;
    if (value <= good) return 'good';
    if (value <= medium) return 'medium';
    return 'bad';
  }

  if (thresholds.type === 'min') {
    const good = thresholds.good as number;
    const medium = thresholds.medium as number;
    if (value >= good) return 'good';
    if (value >= medium) return 'medium';
    return 'bad';
  }

  return null;
}

export function getThresholdLabel(status: ThresholdStatus): string {
  switch (status) {
    case 'good': return 'Bon';
    case 'medium': return 'Moyen';
    case 'bad': return 'Mauvais';
    default: return 'Non classé';
  }
}

export function getThresholdColorClasses(status: ThresholdStatus): { bg: string; text: string; border: string } {
  switch (status) {
    case 'good':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'medium':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'bad':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
  }
}

export function formatThresholdRange(thresholds: ThresholdDefinition | undefined): string {
  if (!thresholds) return '';
  if (thresholds.type === 'range') {
    const good = thresholds.good as [number, number];
    return `${good[0]} – ${good[1]}`;
  }
  if (thresholds.type === 'max') {
    return `≤ ${thresholds.good}`;
  }
  return `≥ ${thresholds.good}`;
}
