import { api } from "./client";

export interface CampagneSummary {
  campagne_id: string;
  date_min: string;
  date_max: string;
  nb_prelevements: number;
  nb_points: number;
  nb_parametres: number;
}

export interface PrelevementListItem {
  id_prelevement: string;
  date_prelevement: string;
  point_prelevement: string | null;
  campagne_id: string;
  longitude: number | null;
  latitude: number | null;
  nb_mesures: number;
  nb_alertes: number;
}

export interface PrelevementDetail {
  id_prelevement: string;
  date_prelevement: string;
  point_prelevement: string | null;
  campagne_id: string;
  commune: string | null;
  province: string | null;
  nature: string | null;
  observation: string | null;
  debit_raw: string | null;
  coord_x: number | null;
  coord_y: number | null;
  longitude: number | null;
  latitude: number | null;
}

export interface MesureItem {
  parametre: string;
  valeur: number | null;
  valeur_raw: string | null;
  unite: string | null;
  lq: number | null;
  qualifieur: string | null;
  alert_level: "WARNING" | "CRITICAL" | null;
  is_prioritaire?: boolean;
}

export interface PrelevementMesuresResponse {
  prelevement: PrelevementDetail;
  mesures: MesureItem[];
}

export interface PrelevementLien {
  entite_type: string;
  entite_id: string;
  mapping_method: string | null;
  is_primary: boolean;
}

export interface PrelevementLiensResponse {
  entites: PrelevementLien[];
}

export interface PollutionAlert {
  parametre: string;
  valeur: number;
  seuil: number;
  unite: string | null;
  station_nom: string | null;
  date_prelevement: string;
  alert_level: "WARNING" | "CRITICAL";
  prelevement_id: string;
  campagne_id: string;
}

export interface PrelevementFilters {
  date_from?: string;
  date_to?: string;
  campagne?: string;
  site?: string;
  parametre?: string;
  limit?: number;
  offset?: number;
}

export interface AlertFilters {
  date_from?: string;
  date_to?: string;
  parametre?: string;
  level?: "WARNING" | "CRITICAL";
  campagne?: string;
  limit?: number;
}

function compactParams<T extends Record<string, unknown>>(params: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  ) as Partial<T>;
}

export async function getCampagnes(): Promise<CampagneSummary[]> {
  const { data } = await api.get<CampagneSummary[]>("/pollution/campagnes");
  return data;
}

export async function getPrelevements(filters: PrelevementFilters = {}): Promise<PrelevementListItem[]> {
  const { data } = await api.get<PrelevementListItem[]>("/pollution/prelevements", { params: compactParams(filters) });
  return data;
}

export async function getPrelevementDetail(id: string): Promise<PrelevementDetail> {
  const { data } = await api.get<PrelevementDetail>(`/pollution/prelevements/${id}`);
  return data;
}

export async function getPrelevementMesures(id: string): Promise<PrelevementMesuresResponse> {
  const { data } = await api.get<PrelevementMesuresResponse>(`/pollution/prelevements/${id}/mesures`);
  return data;
}

export async function getPrelevementLiens(id: string): Promise<PrelevementLiensResponse> {
  const { data } = await api.get<PrelevementLiensResponse>(`/pollution/prelevements/${id}/liens`);
  return data;
}

export async function getPollutionAlerts(filters: AlertFilters = {}): Promise<PollutionAlert[]> {
  const { data } = await api.get<PollutionAlert[]>("/pollution/alerts", { params: compactParams(filters) });
  return data;
}
