import { api } from "@/api/client";

export type DataScanSummary = {
  total_stations: number;
  total_basins: number;
  total_variables: number;
  total_sources: number;
  total_records: number;
  stations_with_data: number;
  basins_with_data: number;
  available_variables: DataScanTag[];
  available_sources: DataScanTag[];
  variable_time_stats: VariableTimeStat[];
};

export type DataScanTag =
  | string
  | {
  id?: string | number | null;
  name?: string | null;
  code?: string | null;
  label?: string | null;
};

export type VariableTimeStat = {
  variable_id: string | number | null;
  variable_name: string | null;
  record_count: number;
  entity_count: number;
  first_record: string | null;
  last_record: string | null;
  min_step_seconds: number | null;
  median_step_seconds: number | null;
  max_step_seconds: number | null;
};

export type StationTypeSummary = {
  station_type: string;
  station_count: number;
  record_count: number;
  variable_count: number;
  source_count: number;
  first_record: string | null;
  last_record: string | null;
};

export type BasinSummary = {
  basin_group: string;
  basin_count: number;
  record_count: number;
  variable_count: number;
  source_count: number;
  first_record: string | null;
  last_record: string | null;
};

export type EntitySourceStat = {
  source_id: string | number | null;
  source_name: string | null;
  record_count: number;
  first_record: string | null;
  last_record: string | null;
};

export type EntityVariableStat = {
  variable_id: string | number | null;
  variable_name: string | null;
  record_count: number;
  first_record: string | null;
  last_record: string | null;
  sources: EntitySourceStat[];
};

export type StationEntity = {
  station_id: string | number;
  station_name: string;
  station_type: string | null;
  total_records: number;
  variable_count: number;
  source_count: number;
  first_record: string | null;
  last_record: string | null;
  variables: EntityVariableStat[];
};

export type BasinEntity = {
  basin_id: string | number;
  basin_name: string;
  basin_group: string | null;
  total_records: number;
  variable_count: number;
  source_count: number;
  first_record: string | null;
  last_record: string | null;
  variables: EntityVariableStat[];
};

export type DataScanResponse = {
  stations: StationTypeSummary[];
  basins: BasinSummary[];
  station_entities: StationEntity[];
  basin_entities: BasinEntity[];
  basins_full?: Record<string, unknown>[];
  barrages_full?: Record<string, unknown>[];
  summary: DataScanSummary;
};

export async function runDataScan(includeTimeStats = false): Promise<DataScanResponse> {
  const { data } = await api.get<DataScanResponse>("/admin/data-availability", {
    params: { include_time_stats: includeTimeStats },
  });
  return data;
}

export function exportJson(data: unknown, filename = "data-scan-report.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
