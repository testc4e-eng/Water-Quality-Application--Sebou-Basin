import { api } from "@/api/client";

export const REGULATORY_TYPE_EAU = "surface_generale";

export type RegulatoryStatusCode =
  | "CLASSIFIED"
  | "NON_CLASSIFIABLE"
  | "HORS_PERIMETRE_REGLEMENTAIRE"
  | "TYPE_EAU_NON_OPERATIONNEL"
  | "PARAMETRE_NON_REGLEMENTAIRE"
  | "NON_CLASSABLE_VALEUR_MANQUANTE"
  | "NON_CLASSABLE_UNITE"
  | string;

export interface RegulatoryStatusResponse {
  status: string;
  version_reglementaire: string | null;
  summary: {
    sources?: number;
    types_eau?: number;
    classes?: number;
    parameters?: number;
    parameters_classifiable?: number;
    mappings_active?: number;
    thresholds?: number;
    thresholds_active?: number;
    rules?: number;
  };
  issues: {
    parameters_without_mapping?: Array<Record<string, unknown>>;
    true_absent_canonical?: Array<Record<string, unknown>>;
  };
  rules?: Record<string, string>;
}

export interface RegulatoryThreshold {
  code_reglementaire: string;
  code_canonique: string | null;
  parametre_pdf: string;
  libelle_reglementaire: string;
  famille_parametre: string | null;
  classifiable: boolean;
  statut_operationnel: string;
  code_type_eau: string;
  code_classe: string;
  libelle_classe: string;
  ordre_qualite: number;
  couleur_sad: string;
  valeur_intervalle_originale: string | null;
  unite_reglementaire_source: string | null;
  unite_moteur: string | null;
  actif: boolean;
  validation_metier: string;
  version_reglementaire: string;
}

export interface ThresholdsResponse {
  status: RegulatoryStatusCode;
  count: number;
  filters: Record<string, string | boolean | null>;
  data: RegulatoryThreshold[];
  message?: string;
}

export interface QualityStation {
  ire_station: string | null;
  station_id: string | null;
  station_nom: string | null;
  code_station: string | null;
  bassin_nom: string | null;
  sous_bassin_nom: string | null;
  latitude: number | null;
  longitude: number | null;
  support_type: string;
  measure_count: number;
  parameter_count: number;
  date_min: string | null;
  date_max: string | null;
}

export interface QualityParameter {
  parametre_qualite: string;
  measure_count: number;
  station_count: number;
  date_min: string | null;
  date_max: string | null;
}

export interface QualityTimeseriesRow {
  date_mesure: string;
  ire_station: string | null;
  station_nom: string | null;
  parametre_qualite: string;
  valeur: number | null;
  support_type: string;
  source_table: string;
}

export interface ClassificationResponse {
  status: RegulatoryStatusCode;
  message?: string;
  parameter_code?: string;
  code_reglementaire?: string;
  code_canonique?: string | null;
  value?: number | null;
  unit?: string | null;
  class_code?: string;
  class_label?: string;
  color?: string;
  severity_order?: number;
  reason_code?: string;
  type_eau_resolved?: string;
  deprecated_field_used?: boolean;
}

export async function getRegulatoryStatus(): Promise<RegulatoryStatusResponse> {
  const { data } = await api.get<RegulatoryStatusResponse>("/quality/regulatory-status");
  return data;
}

export async function getActiveThresholds(): Promise<ThresholdsResponse> {
  const { data } = await api.get<ThresholdsResponse>("/quality/thresholds", {
    params: { type_eau: REGULATORY_TYPE_EAU, active_only: true },
  });
  return data;
}

const QUALITY_TIMEOUT_MS = 20_000;

export async function getQualityStations(
  params: {
    support_type?: string;
    ire_station?: string;
    station_id?: string;
  } = {},
  signal?: AbortSignal
): Promise<QualityStation[]> {
  const { data } = await api.get<QualityStation[]>("/quality/unified/stations", {
    params,
    signal,
    timeout: QUALITY_TIMEOUT_MS,
  });
  return Array.isArray(data) ? data : [];
}

export async function getQualityParameters(
  params: {
    support_type?: string;
    ire_station?: string;
    station_id?: string;
  } = {},
  signal?: AbortSignal
): Promise<QualityParameter[]> {
  const { data } = await api.get<QualityParameter[]>("/quality/unified/parameters", {
    params,
    signal,
    timeout: QUALITY_TIMEOUT_MS,
  });
  return Array.isArray(data) ? data : [];
}

export async function getQualityTimeseries(
  params: {
    support_type?: string;
    ire_station?: string;
    station_id?: string;
    parametre_qualite?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  } = {},
  signal?: AbortSignal
): Promise<QualityTimeseriesRow[]> {
  if (import.meta.env.DEV) {
    console.debug('[quality unified timeseries] request params:', params);
  }
  const { data } = await api.get<QualityTimeseriesRow[]>("/quality/unified/timeseries", {
    params,
    signal,
    timeout: QUALITY_TIMEOUT_MS,
  });
  if (import.meta.env.DEV) {
    console.debug('[quality unified timeseries] response length:', data?.length);
  }
  return Array.isArray(data) ? data : [];
}

export async function classifyQualityValue(
  parameterCode: string,
  value: number,
  unit: string
): Promise<ClassificationResponse> {
  const { data } = await api.post<ClassificationResponse>("/quality/classify", {
    parameter_code: parameterCode,
    value,
    unit,
    type_eau: REGULATORY_TYPE_EAU,
  });
  return data;
}
