import { api } from "@/api/client";

const DASHBOARD_HOME_CACHE_KEY = "dashboard-home-v2:last-payload";
const DASHBOARD_HOME_PREVIOUS_CACHE_KEY = "dashboard-home-v2:previous-payload";

export type HomeSectionStatus = "OK" | "SURVEILLANCE" | "CRITIQUE" | "UNKNOWN";
export type HomeTrendStatus = "UP" | "DOWN" | "STABLE" | "UNKNOWN";
export type FreshnessStatus = "FRESH" | "STALE" | "MISSING";

export interface DashboardHomeFreshnessItem {
  latest_date: string | null;
  age_days: number | null;
  status: FreshnessStatus;
  note: string;
}

export interface DashboardHomeHeroCard {
  id: "barrages_suivis" | "donnees_pluie_disponibles" | "stations_hydro_actives" | "stations_sentinelles_qualite";
  label: string;
  value: number;
  unit: string;
  status: HomeSectionStatus;
  trend: HomeTrendStatus;
  description: string;
  color_hint: string;
  icon: string;
  freshness: DashboardHomeFreshnessItem;
}

export interface DashboardHomeHero {
  title: string;
  subtitle: string;
  operational_date: string;
  summary_label: string;
  cards: DashboardHomeHeroCard[];
}

export interface DashboardHomeLayer {
  label: string;
  enabled: boolean;
  count: number;
  symbology: {
    shape: string;
    color: string;
    size: string;
  };
  features_endpoint: string;
}

export interface DashboardHomeMap {
  default_layers: string[];
  secondary_layers: string[];
  layers: Record<string, DashboardHomeLayer>;
}

export interface DashboardHomeHydrologyStatus {
  debit_moyen: number | null;
  unit: string;
  stations_hausse: number;
  stations_baisse: number;
  stations_stables: number;
  station_count: number;
  latest_date: string | null;
}

export interface DashboardHomeRainfallStatus {
  cumul_24h: number | null;
  cumul_7j: number | null;
  cumul_30j: number | null;
  unit: string;
  station_count: number;
  latest_date: string | null;
  warning_typology_not_validated: boolean;
  label: string;
}

export interface DashboardHomeQualityStatus {
  sentinel_station_count: number;
  conformes: number;
  surveillance: number;
  critiques: number;
  unknown: number;
  latest_date: string | null;
  label: string;
}

export interface DashboardHomeBarragesStatus {
  barrage_count: number;
  apport_total: number | null;
  lacher_total: number | null;
  niveau_moyen: number | null;
  unit_flow: string;
  latest_date: string | null;
}

export interface DashboardHomeBasinStatus {
  hydrology: DashboardHomeHydrologyStatus;
  rainfall: DashboardHomeRainfallStatus;
  quality: DashboardHomeQualityStatus;
  barrages: DashboardHomeBarragesStatus;
}

export interface DashboardHomeAlert {
  id: string;
  type: "BARRAGE" | "HYDRO" | "PLUVIO" | "QUALITE" | "DATA" | string;
  severity: "INFO" | "SURVEILLANCE" | "CRITIQUE" | string;
  title: string;
  message: string;
  object_label: string | null;
  object_type: string | null;
  action_hint: string;
  created_at: string;
  source: "alert_engine" | string;
}

export interface DashboardHomeRecommendedAction {
  id: string;
  priority: "P0" | "P1" | "P2" | string;
  title: string;
  why: string;
  action: string;
  target_type: string | null;
  target_label: string | null;
  source: "recommendation_engine" | string;
}

export interface DashboardHomeTrendPoint {
  date: string;
  value: number | null;
}

export interface DashboardHomeTrendSeries {
  label: string;
  unit: string;
  points: DashboardHomeTrendPoint[];
}

export interface DashboardHomeTrends {
  hydro_30d: DashboardHomeTrendSeries;
  rainfall_30d: DashboardHomeTrendSeries;
  barrage_apport_30d: DashboardHomeTrendSeries;
  quality_30d: DashboardHomeTrendSeries;
}

export interface DashboardHomeSecondaryKpiItem {
  value: number | null;
  label: string;
  status: HomeSectionStatus;
  description: string;
  source_endpoint: string;
}

export interface DashboardHomeSecondaryKpis {
  iqgb: DashboardHomeSecondaryKpiItem;
  ifd: DashboardHomeSecondaryKpiItem;
  icd: DashboardHomeSecondaryKpiItem;
  ich: DashboardHomeSecondaryKpiItem;
  ipp: DashboardHomeSecondaryKpiItem;
  isr: DashboardHomeSecondaryKpiItem;
}

export interface DashboardHomeMetadata {
  mode: string;
  scientific_warning: string;
  temperature_rule: string;
  quality_scope: string;
  rainfall_typology_status: string;
  excluded_from_home: string[];
}

export interface DashboardHomePayload {
  status: "success" | "partial";
  generated_at: string;
  data_freshness: {
    barrages: DashboardHomeFreshnessItem;
    hydro: DashboardHomeFreshnessItem;
    pluvio: DashboardHomeFreshnessItem;
    quality_daily: DashboardHomeFreshnessItem;
  };
  hero: DashboardHomeHero;
  map: DashboardHomeMap;
  basin_status: DashboardHomeBasinStatus;
  alerts: DashboardHomeAlert[];
  recommended_actions: DashboardHomeRecommendedAction[];
  trends: DashboardHomeTrends;
  secondary_kpis: DashboardHomeSecondaryKpis;
  metadata: DashboardHomeMetadata;
}

export function readDashboardHomeCache(): DashboardHomePayload | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const raw = window.sessionStorage.getItem(DASHBOARD_HOME_CACHE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as DashboardHomePayload;
  } catch {
    return undefined;
  }
}

export function readPreviousDashboardHomeCache(): DashboardHomePayload | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const raw = window.sessionStorage.getItem(DASHBOARD_HOME_PREVIOUS_CACHE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as DashboardHomePayload;
  } catch {
    return undefined;
  }
}

export async function getDashboardHome(signal?: AbortSignal) {
  const { data } = await api.get<DashboardHomePayload>("/dashboard/home", {
    signal,
    timeout: 90_000,
  });
  if (typeof window !== "undefined") {
    try {
      const current = window.sessionStorage.getItem(DASHBOARD_HOME_CACHE_KEY);
      if (current) {
        window.sessionStorage.setItem(DASHBOARD_HOME_PREVIOUS_CACHE_KEY, current);
      }
      window.sessionStorage.setItem(DASHBOARD_HOME_CACHE_KEY, JSON.stringify(data));
    } catch {
      // noop
    }
  }
  return data;
}
