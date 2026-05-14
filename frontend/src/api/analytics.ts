// frontend/src/api/analytics.ts

import { api } from "./client";

export type AnalyticsOption = {
  code: string;
  label: string;
};

export type AnalyticsVariable = AnalyticsOption & {
  unit?: string | null;
  source_schema?: string;
  source_table?: string;
};

export type AnalyticsSubmenu = {
  code: string;
  label: string;
  variable_enabled?: boolean;
  variables: AnalyticsVariable[];
};

export type AnalyticsSite = {
  site_id: string;
  site_code: string;
  site_name: string;
  station_type: string;
};

export type AnalyticsDateRange = {
  minDate: string | null;
  maxDate: string | null;
  count: number;
};

export type AnalyticsOptionsResponse = {
  scenarios: AnalyticsOption[];
  submenus: AnalyticsSubmenu[];
  sites?: AnalyticsSite[];
};

export type AnalyticsSeriesResponse = {
  metadata: {
    scenario: string;
    submenu: string;
    variable?: string;
    site: string;
    unit: string | null;
  };
  table: {
    date_obs: string;
    value_num: number;
    unit: string | null;
    variable_code?: string | null;
    variable_label?: string | null;
    source_table?: string | null;
    data_quality_flag?: string | null;
  }[];
  series: {
    datetime: string;
    value: number;
  }[];
  kpis: {
    min: number | null;
    max: number | null;
    mean: number | null;
    count?: number;
    status?: string;
    unit: string | null;
  };
};

export async function getClimatMeteoOptions(): Promise<AnalyticsOptionsResponse> {
  const { data } = await api.get("/analytics/climat-meteo/options");
  return data;
}

export async function getClimatMeteoSites(params: {
  submenu: string;
  variable?: string;
  scenario?: string;
  date_start?: string;
  date_end?: string;
}): Promise<AnalyticsSite[]> {
  const { data } = await api.get("/analytics/climat-meteo/sites", { params });
  return data;
}

export async function getClimatMeteoScenarios(params: {
  submenu: string;
  variable?: string;
}): Promise<AnalyticsOption[]> {
  const { data } = await api.get("/analytics/climat-meteo/scenarios", { params });
  return data;
}

export async function getClimatMeteoSeries(params: {
  scenario: string;
  submenu: string;
  site: string;
  variable?: string;
  date_start?: string;
  date_end?: string;
}): Promise<AnalyticsSeriesResponse> {
  const { data } = await api.get("/analytics/climat-meteo/series", { params });
  return data;
}

export async function getClimatMeteoDateRange(params: {
  submenu: string;
  scenario: string;
  aggregation: string;
  variable?: string;
}): Promise<AnalyticsDateRange> {
  const { data } = await api.get("/analytics/climat-meteo/date-range", { params });
  return data;
}

export async function getHydrologieOptions(): Promise<AnalyticsOptionsResponse> {
  const { data } = await api.get("/analytics/hydrologie/options");
  return data;
}

export async function getHydrologieSites(params: {
  submenu: string;
  variable?: string;
  scenario?: string;
}): Promise<AnalyticsSite[]> {
  const { data } = await api.get("/analytics/hydrologie/sites", { params });
  return data;
}

export async function getHydrologieSeries(params: {
  scenario: string;
  submenu: string;
  site: string;
  variable?: string;
  date_start?: string;
  date_end?: string;
}): Promise<AnalyticsSeriesResponse> {
  const { data } = await api.get("/analytics/hydrologie/series", { params });
  return data;
}

export async function getPollutionOptions(): Promise<AnalyticsOptionsResponse> {
  const { data } = await api.get("/analytics/pollution/options");
  return data;
}

export async function getPollutionSites(params: {
  submenu: string;
  variable?: string;
  scenario?: string;
}): Promise<AnalyticsSite[]> {
  const { data } = await api.get("/analytics/pollution/sites", { params });
  return data;
}

export async function getPollutionSeries(params: {
  scenario: string;
  submenu: string;
  site: string;
  variable?: string;
  date_start?: string;
  date_end?: string;
}): Promise<AnalyticsSeriesResponse> {
  const { data } = await api.get("/analytics/pollution/series", { params });
  return data;
}
