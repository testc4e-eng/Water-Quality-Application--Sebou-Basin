import { api } from "@/api/client";


export interface RuntimeQualityStationLatestValue {
  parameter: string;
  parameter_code: string;
  parameter_label: string;
  value: number | null;
  value_numeric: number | null;
  unit?: string | null;
  date: string | null;
  sample_date?: string | null;
  class?: string | null;
  classification?: Record<string, unknown> | null;
}

export interface RuntimeQualityStation {
  station_id: string;
  station_code: string | null;
  station_name: string;
  station_type: string | null;
  commune: string | null;
  province: string | null;
  bassin: string | null;
  sous_bassin: string | null;
  lat: number | null;
  lon: number | null;
  measure_count: number;
  parameter_count: number;
  date_min: string | null;
  date_max: string | null;
  last_measure_date: string | null;
  status: "BON" | "SURVEILLANCE" | "CRITIQUE" | "INCONNU" | string;
  status_reason: string;
  latest_values: RuntimeQualityStationLatestValue[];
  source_table?: string;
}

export interface RuntimeTrendPoint {
  date: string;
  value: number | null;
}

export interface RuntimeTrendSeries {
  label: string;
  unit: string;
  points: RuntimeTrendPoint[];
  count: number;
  date_min: string | null;
  date_max: string | null;
  source: string;
  message?: string | null;
}

export interface RuntimeDashboardTrendsPayload {
  rainfall: RuntimeTrendSeries;
  flow: RuntimeTrendSeries;
  temperature: RuntimeTrendSeries;
  quality: RuntimeTrendSeries;
}

export async function getQualityStationsWithTimeseries(limit = 6, signal?: AbortSignal): Promise<RuntimeQualityStation[]> {
  const { data } = await api.get<RuntimeQualityStation[]>("/quality/stations-with-timeseries", {
    params: { limit },
    signal,
    timeout: 10_000,
  });
  return Array.isArray(data) ? data : [];
}

export async function getDashboardTrends(days = 30, signal?: AbortSignal): Promise<RuntimeDashboardTrendsPayload> {
  const { data } = await api.get<RuntimeDashboardTrendsPayload>("/dashboard/trends", {
    params: { days },
    signal,
    timeout: 10_000,
  });
  return data;
}
