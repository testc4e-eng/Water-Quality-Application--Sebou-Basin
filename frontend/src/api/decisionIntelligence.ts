import { api } from "@/api/client";

export interface KpiOverviewResponse {
  iqgb: number;
  ifd: number;
  icd: number;
  ich: number;
  ipp: number;
  isr: number;
  metadata?: Record<string, unknown>;
}

export interface KpiStationItem {
  station_id: string;
  station_name: string;
  sous_bassin_nom: string;
  status: "conforme" | "surveillance" | "critique" | "inconnu" | string;
  severity_order?: number | null;
  latest_date?: string | null;
  freshness_days?: number | null;
  freshness_score?: number | null;
}

export interface KpiStationsResponse {
  conforme: number;
  surveillance: number;
  critique: number;
  inconnu: number;
  total: number;
  top_stations: KpiStationItem[];
}

export interface KpiSubbasinItem {
  subbasin_name: string;
  stations_total: number;
  critical: number;
  surveillance: number;
  freshness_score?: number | null;
  risk_score: number;
}

export interface KpiSubbasinsResponse {
  subbasins_total: number;
  top_subbasins: KpiSubbasinItem[];
}

export interface KpiPollutionSite {
  site_id: string;
  site_name?: string | null;
  commune?: string | null;
  bassin?: string | null;
  validation_status?: string | null;
  pollution_severity?: number | null;
  snap_confidence?: string | null;
  distance_to_garde_km?: number | null;
  reachable_stations?: number;
  reachable_barrages?: number;
  ipp: number;
}

export interface KpiPollutionResponse {
  active_sites: number;
  sites_considered: number;
  ipp?: number | null;
  top_sites: KpiPollutionSite[];
}

export interface DecisionAlert {
  type: "QUALITY" | "POLLUTION" | "DATA" | "HYDRO" | string;
  code: string;
  severity: "HIGH" | "MEDIUM" | "LOW" | string;
  title: string;
  description: string;
  recommendation: string;
  entity_name?: string | null;
  site_id?: string | null;
}

export interface RecommendationItem {
  domain: string;
  priority: "HIGH" | "MEDIUM" | "LOW" | string;
  action: string;
  why: string;
}

export async function getKpiOverview() {
  const { data } = await api.get<KpiOverviewResponse>("/kpi/overview");
  return data;
}

export async function getKpiStations() {
  const { data } = await api.get<KpiStationsResponse>("/kpi/stations");
  return data;
}

export async function getKpiSubbasins() {
  const { data } = await api.get<KpiSubbasinsResponse>("/kpi/subbasins");
  return data;
}

export async function getKpiPollution() {
  const { data } = await api.get<KpiPollutionResponse>("/kpi/pollution");
  return data;
}

export async function getDecisionAlerts(params: {
  type?: string;
  limit?: number;
  entity_name?: string;
  site_id?: string;
}) {
  const { data } = await api.get<DecisionAlert[]>("/alerts", {
    params,
  });
  return data;
}

export async function getDecisionRecommendations(params: {
  domain?: string;
  limit?: number;
  entity_name?: string;
  site_id?: string;
}) {
  const { data } = await api.get<RecommendationItem[]>("/recommendations", {
    params,
  });
  return data;
}
