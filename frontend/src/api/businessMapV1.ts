import { api } from "./client";

const MAP_TIMEOUT_MS = 20_000;

export interface BusinessMapAvailabilityItem {
  support_type: string;
  domain: string;
  subdomain?: string | null;
  parameter_code: string;
  parameter_label: string;
  unit?: string | null;
  object_count: number;
  measure_count: number;
  date_count?: number | null;
  date_min?: string | null;
  date_max?: string | null;
  has_geometry: boolean;
  has_timeseries: boolean;
  has_thresholds: boolean;
  recommended_v1: boolean;
  authorized_basin?: string | null;
  source_table?: string | null;
  data_family?: string | null;
  measurement_context?: string | null;
  data_temporality?: string | null;
}

export interface AvailableOptions {
  supports: string[];
  domains: string[];
  parameters: string[];
}

export interface BusinessMapAvailabilityResponse {
  items: BusinessMapAvailabilityItem[];
  total: number;
  available_options: AvailableOptions;
}

export interface BusinessMapFeatureProperties {
  object_id: string;
  object_name?: string | null;
  object_code?: string | null;
  support_type: string;
  bassin_nom?: string | null;
  sous_bassin_nom?: string | null;
  attributes?: Record<string, unknown> | null;
  recommended_v1: boolean;
  data_temporality?: string | null;
  data_family?: string | null;
  measurement_context?: string | null;
  source_table?: string | null;
  measure_count?: number | null;
  date_count?: number | null;
  date_min?: string | null;
  date_max?: string | null;
}

export interface BusinessMapFeature {
  type: "Feature";
  id?: string | number;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: BusinessMapFeatureProperties;
}

export interface BusinessMapFeatureCollection {
  type: "FeatureCollection";
  features: BusinessMapFeature[];
  metadata: {
    count: number;
    limit: number;
    offset: number;
  };
}

export interface AnalyticalSeriesValue {
  date: string;
  value: number;
  flag?: string | null;
}

export interface AnalyticalSeries {
  id: string;
  support_type: string;
  support_id: string;
  support_name?: string | null;
  domain: string;
  subdomain?: string | null;
  parameter_code: string;
  parameter_label?: string | null;
  unit?: string | null;
  date_from?: string | null;
  date_to?: string | null;
  aggregation?: string | null;
  series_type?: string | null;
  data_family?: string | null;
  measurement_context?: string | null;
  source_table?: string | null;
  values: AnalyticalSeriesValue[];
}

export interface LayerMetadata {
  id: string;
  name: string;
  type: "fill" | "line" | "circle" | "symbol";
  source: string;
  "source-layer"?: string;
  paint: Record<string, any>;
  layout?: Record<string, any>;
  filter?: any[];
}

export interface BusinessMapLayersResponse {
  layers: LayerMetadata[];
}

function compactParams<T extends Record<string, unknown>>(params: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  ) as Partial<T>;
}

export async function getBusinessMapAvailability(filters: {
  support_type?: string;
  domain?: string;
  subdomain?: string;
  parameter_code?: string;
  bassin_nom?: string;
  recommended_v1?: boolean;
  data_temporality?: string;
  data_family?: string;
  measurement_context?: string;
} = {}): Promise<BusinessMapAvailabilityResponse> {
  const { data } = await api.get<BusinessMapAvailabilityResponse>("/business-map/availability", {
    params: compactParams(filters),
    timeout: MAP_TIMEOUT_MS,
  });
  return data;
}

export async function getBusinessMapFeatures(filters: {
  support_type?: string;
  domain?: string;
  subdomain?: string;
  parameter_code?: string;
  bassin_nom?: string;
  bbox?: string;
  limit?: number;
  offset?: number;
  data_temporality?: string;
  data_family?: string;
  measurement_context?: string;
} = {}): Promise<BusinessMapFeatureCollection> {
  const { data } = await api.get<BusinessMapFeatureCollection>("/business-map/features", {
    params: compactParams(filters),
    timeout: MAP_TIMEOUT_MS,
  });
  return data;
}

export async function getBusinessMapSeries(params: {
  support_type: string;
  object_id: string;
  parameter_code: string;
  domain?: string;
  date_from?: string;
  date_to?: string;
  aggregation?: "raw" | "daily" | "monthly" | "annual";
}): Promise<AnalyticalSeries> {
  const { date_from = "2015-01-01", date_to = new Date().toISOString().split("T")[0], aggregation = "monthly", ...rest } = params;
  const { data } = await api.get<AnalyticalSeries>("/business-map/series", {
    params: compactParams({ ...rest, date_from, date_to, aggregation }),
    timeout: MAP_TIMEOUT_MS,
  });
  return data;
}

export async function getBusinessMapObject(support_type: string, object_id: string): Promise<Record<string, any>> {
  const { data } = await api.get<Record<string, any>>(`/business-map/object/${support_type}/${object_id}`, {
    timeout: MAP_TIMEOUT_MS,
  });
  return data;
}

export async function getBusinessMapLayers(): Promise<BusinessMapLayersResponse> {
  const { data } = await api.get<BusinessMapLayersResponse>("/business-map/layers", {
    timeout: MAP_TIMEOUT_MS,
  });
  return data;
}
