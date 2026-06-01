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
  station_id: string;
  station_name: string;
  dt_min: string;
  dt_max: string;
  n_mesures: number;
}

export interface QualityParameter {
  parameter: string;
  n_mesures: number;
}

export interface QualityTimeseriesRow {
  date: string;
  no3: number | null;
  ph: number | null;
  dbo5: number | null;
  dco: number | null;
  o2: number | null;
  mes: number | null;
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

export async function getQualityStations(): Promise<QualityStation[]> {
  const { data } = await api.get<QualityStation[]>("/quality/stations");
  return Array.isArray(data) ? data : [];
}

export async function getQualityParameters(stationId?: string): Promise<QualityParameter[]> {
  const { data } = await api.get<QualityParameter[]>("/quality/parameters", {
    params: stationId ? { station_id: stationId } : undefined,
  });
  return Array.isArray(data) ? data : [];
}

export async function getQualityTimeseries(
  stationId: string,
  dateStart?: string,
  dateEnd?: string
): Promise<QualityTimeseriesRow[]> {
  const { data } = await api.get<QualityTimeseriesRow[]>("/quality/timeseries", {
    params: { station_id: stationId, date_start: dateStart || undefined, date_end: dateEnd || undefined },
  });
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
