import type { Feature, FeatureCollection, Geometry } from "geojson";
import { isAxiosError } from "axios";

import { api } from "./client";

const MAP_TIMEOUT_MS = 20_000;

export interface MapBusinessSupport {
  support_code: string;
  support?: string;
  label: string;
  support_group?: string | null;
  support_type?: string | null;
  source_backend?: string | null;
  display_label?: string | null;
  description?: string | null;
  available_parameters: string[];
  geometry_status?: string | null;
  data_status?: string | null;
  legacy_support?: boolean;
  classification?: boolean;
}

export interface MapBusinessGroup {
  group_code: string;
  group_label: string;
  supports: MapBusinessSupport[];
}

export interface MapBusinessCatalog {
  status: string;
  version: string;
  groups: MapBusinessGroup[];
  legacy_supports: MapBusinessSupport[];
  display_modes: string[];
}

export interface MapLatestValue {
  parameter_code?: string | null;
  parameter_label?: string | null;
  value_numeric?: number | null;
  value_text?: string | null;
  unit?: string | null;
  sample_date?: string | null;
  quality_flag?: string | null;
  classification?: MapClassificationResult | null;
}

export interface MapClassificationResult {
  status?: string | null;
  regulatory_status?: string | null;
  class_code?: string | null;
  class_label?: string | null;
  color?: string | null;
  severity_order?: number | null;
  threshold?: unknown;
  non_classifiable_reason?: string | null;
  reason?: string | null;
  message?: string | null;
}

export interface MapBusinessEntityProperties {
  entity_id: string;
  label?: string | null;
  support?: string | null;
  entity_type?: string | null;
  category?: string | null;
  support_group?: string | null;
  support_type?: string | null;
  source_backend?: string | null;
  display_label?: string | null;
  data_status?: string | null;
  geometry_status?: string | null;
  legacy_support?: boolean;
  commune?: string | null;
  province?: string | null;
  bassin?: string | null;
  validation_status?: string | null;
  qa_status?: string | null;
  latest_values?: MapLatestValue[] | string | null;
  [key: string]: unknown;
}

export type MapBusinessFeature = Feature<Geometry, MapBusinessEntityProperties>;
export type MapBusinessFeatureCollection = FeatureCollection<Geometry, MapBusinessEntityProperties> & {
  metadata?: {
    support?: string | null;
    group_code?: string | null;
    support_code?: string | null;
    legacy_support?: boolean;
    source?: string | null;
    source_backend?: string | null;
    count?: number;
    limit?: number;
    parameter_code?: string | null;
    message?: string | null;
    [key: string]: unknown;
  };
};

export interface MapEntitiesFilters {
  group_code?: string;
  support_code?: string;
  parameter_code?: string;
  commune?: string;
  bbox?: string;
  limit?: number;
}

export interface MapLatestValuesFilters {
  support?: string;
  parameter_code?: string;
  limit?: number;
}

export interface MapLatestValuesResponse {
  status: string;
  support: string;
  count?: number;
  data: MapLatestValue[];
  metadata?: Record<string, unknown>;
}

export interface MapClassificationRequest {
  parameter_code: string;
  value?: number | null;
  unit?: string | null;
}

function compactParams<T extends Record<string, unknown>>(params: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  ) as Partial<T>;
}

export async function getCatalog(): Promise<MapBusinessCatalog> {
  const { data } = await api.get<MapBusinessCatalog>("/map/catalog", { timeout: MAP_TIMEOUT_MS });
  return data;
}

export async function getEntities(filters: MapEntitiesFilters): Promise<MapBusinessFeatureCollection> {
  const { data } = await api.get<MapBusinessFeatureCollection>("/map/entities", {
    params: compactParams(filters),
    timeout: MAP_TIMEOUT_MS,
  });
  return data;
}

export function buildMapEntitiesEndpoint(filters: MapEntitiesFilters | null | undefined): string {
  const params = new URLSearchParams();
  Object.entries(compactParams(filters ?? {})).forEach(([key, value]) => {
    params.set(key, String(value));
  });
  const query = params.toString();
  return `/api/v1/map/entities${query ? `?${query}` : ""}`;
}

export function describeMapApiError(error: unknown) {
  if (isAxiosError(error)) {
    const backendDetail = error.response?.data?.detail ?? error.response?.data?.message ?? error.message;
    return {
      status: error.response?.status,
      message: typeof backendDetail === "string" ? backendDetail : JSON.stringify(backendDetail),
    };
  }
  if (error instanceof Error) return { status: undefined, message: error.message };
  return { status: undefined, message: "Erreur inconnue" };
}

export async function getLatestValues(filters: MapLatestValuesFilters = {}): Promise<MapLatestValuesResponse> {
  const { data } = await api.get<MapLatestValuesResponse>("/map/latest-values", {
    params: compactParams(filters),
    timeout: MAP_TIMEOUT_MS,
  });
  return data;
}

export async function getClassification(request: MapClassificationRequest): Promise<MapClassificationResult> {
  const { data } = await api.get<MapClassificationResult>("/map/classification", {
    params: compactParams(request),
    timeout: MAP_TIMEOUT_MS,
  });
  return data;
}

export function parseLatestValues(value: MapBusinessEntityProperties["latest_values"]): MapLatestValue[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function latestValueLabel(value: MapLatestValue): string {
  const measuredValue = value.value_numeric ?? value.value_text ?? "n/a";
  return `${value.parameter_code ?? "?"}: ${measuredValue}${value.unit ? ` ${value.unit}` : ""}`;
}

export function strongestClassification(values: MapLatestValue[]): MapClassificationResult | null {
  const classified = values
    .map((value) => value.classification)
    .filter((classification): classification is MapClassificationResult => Boolean(classification?.class_code));

  if (!classified.length) return null;
  return classified.sort((a, b) => Number(b.severity_order ?? -1) - Number(a.severity_order ?? -1))[0];
}
