import { api } from "@/api/client";

export interface PropagationSourceInput {
  site_id?: string;
  prelevement_id?: string;
  lng?: number;
  lat?: number;
  vitesse_reference_kmh?: number;
  station_type?: string;
  max_target_snap_distance_m?: number;
  only_reachable?: boolean;
  limit?: number;
}

export interface PropagationSourceSummary {
  source_type: string;
  source_id: string;
  input_mode: "site_id" | "prelevement_id" | "coordinates" | string;
}

export interface PropagationSnapSummary {
  edge_id: number;
  start_node: number;
  distance_to_network_m: number;
  snap_confidence: "HIGH" | "MEDIUM" | "LOW" | string;
  network_component?: number | null;
}

export interface PropagationBaseSummary {
  target_type: string;
  reachable_nodes: number;
  reachable_edges: number;
  distance_to_garde_km?: number | null;
  transfer_time_hours?: number | null;
  transfer_time_label?: string | null;
  time_model?: string | null;
  targets_total_considered?: number;
  targets_returned?: number;
}

export interface PropagationTargetStation {
  station_id: string;
  legacy_station_id?: number | null;
  station_name: string;
  station_type?: string | null;
  target_node: number;
  target_snap_distance_m: number;
  target_snap_confidence: "HIGH" | "MEDIUM" | "LOW" | string;
  reachable: boolean;
  distance_to_source_km?: number | null;
  transfer_time_hours?: number | null;
  transfer_time_label?: string | null;
}

export interface PropagationTargetBarrage {
  barrage_id: string;
  legacy_barrage_id?: number | null;
  barrage_name: string;
  target_node: number;
  target_snap_distance_m: number;
  target_snap_confidence: "HIGH" | "MEDIUM" | "LOW" | string;
  reachable: boolean;
  distance_to_source_km?: number | null;
  transfer_time_hours?: number | null;
  transfer_time_label?: string | null;
  includes_garde: boolean;
}

export interface PropagationTargetExutoire {
  node_id: number;
  node_type: string;
  component_id: number;
  reachable: boolean;
  distance_to_source_km?: number | null;
  transfer_time_hours?: number | null;
  transfer_time_label?: string | null;
}

export interface PropagationMetadata {
  network_table: string;
  targets_source?: string;
  scientific_mode: boolean;
  time_model?: string;
  warning?: string;
  exutoire_rule?: string;
}

export interface PropagationToGardeResponse {
  status: "success" | "partial" | string;
  source: PropagationSourceSummary;
  snap: PropagationSnapSummary;
  propagation: PropagationBaseSummary;
  path_geojson?: {
    type: "FeatureCollection";
    features: unknown[];
  };
  metadata: PropagationMetadata;
}

export interface SnapDiagnosticResponse {
  status: "success" | "partial" | string;
  source: PropagationSourceSummary;
  snap: PropagationSnapSummary;
  metadata: PropagationMetadata;
}

export interface PropagationToStationsResponse {
  status: "success" | "partial" | string;
  source: PropagationSourceSummary;
  snap: PropagationSnapSummary;
  propagation: PropagationBaseSummary;
  targets: PropagationTargetStation[];
  metadata: PropagationMetadata;
}

export interface PropagationToBarragesResponse {
  status: "success" | "partial" | string;
  source: PropagationSourceSummary;
  snap: PropagationSnapSummary;
  propagation: PropagationBaseSummary;
  targets: PropagationTargetBarrage[];
  metadata: PropagationMetadata;
}

export interface PropagationToExutoiresResponse {
  status: "success" | "partial" | string;
  source: PropagationSourceSummary;
  snap: PropagationSnapSummary;
  propagation: PropagationBaseSummary;
  targets: PropagationTargetExutoire[];
  metadata: PropagationMetadata;
}

function compactParams(params: PropagationSourceInput) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}

export async function getPropagationToGarde(params: PropagationSourceInput) {
  const { data } = await api.get<PropagationToGardeResponse>("/propagation/source-to-garde", {
    params: compactParams(params),
  });
  return data;
}

export async function getSnapDiagnostic(params: PropagationSourceInput) {
  const { data } = await api.get<SnapDiagnosticResponse>("/propagation/snap-diagnostic", {
    params: compactParams(params),
  });
  return data;
}

export async function getPropagationToStations(params: PropagationSourceInput) {
  const { data } = await api.get<PropagationToStationsResponse>("/propagation/source-to-stations", {
    params: compactParams(params),
  });
  return data;
}

export async function getPropagationToBarrages(params: PropagationSourceInput) {
  const { data } = await api.get<PropagationToBarragesResponse>("/propagation/source-to-barrages", {
    params: compactParams(params),
  });
  return data;
}

export async function getPropagationToExutoires(params: PropagationSourceInput) {
  const { data } = await api.get<PropagationToExutoiresResponse>("/propagation/source-to-exutoires", {
    params: compactParams(params),
  });
  return data;
}
