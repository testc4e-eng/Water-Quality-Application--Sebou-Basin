import { api } from "./client";
import { BatchSeriesItem, AggregationLevel } from "../store/workspaceStore";

export interface BatchSeriesRequest {
  date_from: string;
  date_to: string;
  aggregation?: AggregationLevel;
  series: BatchSeriesItem[];
}

export interface AnalyticalSeriesValue {
  date: string;
  value: number | null;
  quality_flag?: string;
}

export interface SeriesSource {
  endpoint: string;
  table: string;
  refreshed_at?: string;
}

export interface AnalyticalSeries {
  id: string;
  support_type: 'STATION_QUALITE' | 'POINT_PRELEVEMENT_POLLUTION' | 'SOURCE_POLLUTION' | 'STATION_HYDRO' | 'BARRAGE' | 'STATION_METEO' | 'STATION_SENTINELLE';
  object_id: string;
  object_name: string;
  domain: string;
  subdomain?: string;
  parameter_code: string;
  parameter_label: string;
  unit?: string;
  date_from?: string;
  date_to?: string;
  aggregation?: string;
  series_type?: string;
  data_family?: string | null;
  measurement_context?: string | null;
  source: SeriesSource;
  values: AnalyticalSeriesValue[];
}

export interface BatchWarning {
  type: string;
  series_ref: string;
  message: string;
}

export interface BatchStatus {
  requested: number;
  returned: number;
  empty: number;
  failed: number;
}

export interface BatchSeriesResponse {
  status: BatchStatus;
  series: AnalyticalSeries[];
  warnings: BatchWarning[];
  meta: Record<string, any>;
}

// ============================================================
// CORRELATION TYPES
// ============================================================

export interface CorrelationSeriesInput {
  object_id: string;
  parameter_code: string;
  domain: string;
  support_type: string;
}

export interface CorrelationRequest {
  series: [CorrelationSeriesInput, CorrelationSeriesInput];
  date_from: string;
  date_to: string;
  aggregation: AggregationLevel;
}

export interface CorrelationValue {
  date: string;
  value: number;
}

export interface CorrelationSeriesOutput {
  object_id: string;
  parameter_code: string;
  domain: string;
  support_type: string;
  values: CorrelationValue[];
}

export interface AlignedPoint {
  date: string;
  x: number;
  y: number;
}

export interface RegressionPoint {
  x: number;
  y: number;
}

export interface CorrelationStats {
  pearson_r: number;
  r_squared: number;
  slope: number;
  intercept: number;
  p_value?: number;
  n_points: number;
}

export interface CorrelationResponse {
  error?: string;
  message?: string;
  series_x?: CorrelationSeriesOutput;
  series_y?: CorrelationSeriesOutput;
  aligned_data?: AlignedPoint[];
  correlation?: CorrelationStats;
  regression_line?: RegressionPoint[];
}

export interface CorrelationMatrixRequest {
  series: CorrelationSeriesInput[];
  date_from: string;
  date_to: string;
  aggregation: AggregationLevel;
}

export interface CorrelationMatrixItem {
  object_id: string;
  parameter_code: string;
  domain: string;
  support_type: string;
}

export interface CorrelationMatrixResponse {
  error?: string;
  message?: string;
  series?: CorrelationMatrixItem[];
  matrix?: (number | null)[][];
  n_points?: (number | null)[][];
}

export const fetchBatchSeries = async (request: BatchSeriesRequest): Promise<BatchSeriesResponse> => {
  const response = await api.post<BatchSeriesResponse>("/business-map/analysis/series/batch", request);
  return response.data;
};

export const fetchCorrelation = async (request: CorrelationRequest): Promise<CorrelationResponse> => {
  const response = await api.post<CorrelationResponse>("/business-map/analysis/correlation", request);
  return response.data;
};

export const fetchCorrelationMatrix = async (request: CorrelationMatrixRequest): Promise<CorrelationMatrixResponse> => {
  const response = await api.post<CorrelationMatrixResponse>("/business-map/analysis/correlation/matrix", request);
  return response.data;
};
