import { api } from "@/api/client";

export type WorkflowStatus =
  | "BROUILLON"
  | "PRET_A_ANALYSER"
  | "ANALYSE_EN_COURS"
  | "ANALYSE_TERMINEE"
  | "RISQUE_FAIBLE"
  | "RISQUE_ELEVE"
  | "RECOMMANDATION_PROPOSEE"
  | "VALIDE_METIER"
  | "CLOTURE"
  | "REJETE"
  | "ERREUR_ANALYSE";

export interface GeoJsonPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface GeoJsonLineString {
  type: "LineString";
  coordinates: [number, number][];
}

export interface GeoJsonFeature<
  TGeometry extends GeoJsonPoint | GeoJsonLineString = GeoJsonPoint | GeoJsonLineString,
  TProperties extends Record<string, unknown> = Record<string, unknown>,
> {
  type: "Feature";
  geometry: TGeometry;
  properties: TProperties;
}

export interface GeoJsonFeatureCollection<
  TGeometry extends GeoJsonPoint | GeoJsonLineString = GeoJsonPoint | GeoJsonLineString,
  TProperties extends Record<string, unknown> = Record<string, unknown>,
> {
  type: "FeatureCollection";
  features: Array<GeoJsonFeature<TGeometry, TProperties>>;
}

export interface PollutionDeclarationCreateRequest {
  date_declaration: string;
  detected_at?: string | null;
  point_declaration: GeoJsonPoint;
  polluant: string;
  Crejet_mg_L: number;
  QRejet_m3_s: number;
  QSebou_m3_s: number;
  QInnaouen_m3_s: number;
  QOuergha_m3_s: number;
  commentaire?: string | null;
}

export interface PollutionDeclarationTransitionRequest {
  reason?: string | null;
  commentaire?: string | null;
  requested_by?: string | null;
}

export interface PollutionDeclarationEvaluateRequest {
  use_saved_values?: boolean;
  detected_at?: string | null;
  override_hydrology?: {
    QSebou_m3_s?: number;
    QInnaouen_m3_s?: number;
    QOuergha_m3_s?: number;
  } | null;
  override_discharge?: {
    Crejet_mg_L?: number;
    QRejet_m3_s?: number;
  } | null;
  commentaire_execution?: string | null;
  requested_by?: string | null;
}

export interface DeclarationTransitionRecord {
  transition_id: string;
  from_status?: WorkflowStatus | null;
  to_status: WorkflowStatus;
  trigger: string;
  actor?: string | null;
  reason?: string | null;
  created_at: string;
}

export interface PollutionDeclarationResponse {
  declaration_id: string;
  reference: string;
  status: WorkflowStatus;
  date_declaration: string;
  detected_at?: string | null;
  point_declaration: GeoJsonPoint;
  polluant: string;
  Crejet_mg_L: number;
  QRejet_m3_s: number;
  QSebou_m3_s: number;
  QInnaouen_m3_s: number;
  QOuergha_m3_s: number;
  commentaire?: string | null;
  current_snapshot_id?: string | null;
  report_available: boolean;
  created_at: string;
  updated_at: string;
  transitions: DeclarationTransitionRecord[];
}

export interface PollutionDeclarationListResponse {
  items: PollutionDeclarationResponse[];
  total: number;
  page: number;
  page_size: number;
}

export interface RecommendationResult {
  recommendation_id: string;
  type: string;
  axis: string;
  title: string;
  description: string;
  priority: number;
  confidence: string;
  justification: string;
  current_values?: Record<string, number> | null;
  delta_values?: Record<string, number> | null;
  proposed_values?: Record<string, number> | null;
  expected_matrix_result?: {
    C_SidiAllalTazi_mg_L?: number;
    C_BgGarde_mg_L?: number;
    statut_global?: string;
    [key: string]: unknown;
  } | null;
  method_used?: string;
  source_scenario_id?: string | null;
  target_scenario_id?: string | null;
  matrix_version?: string | null;
  warnings?: string[];
}

export interface StationDetected {
  station_id?: string | null;
  station_name?: string | null;
  station_code?: string | null;
  target_name?: string | null;
  target_node?: string | number | null;
  latitude?: number | null;
  longitude?: number | null;
  distance_to_source_km?: number | null;
  [key: string]: unknown;
}

export type DeclarationDetectedStation = StationDetected;

export interface TopologyResult {
  snapped_point?: GeoJsonPoint | null;
  snap_distance_m?: number | null;
  parcours_geojson?: GeoJsonFeatureCollection<GeoJsonLineString> | null;
  longueur_km?: number | null;
  stations_detectees?: StationDetected[];
  sidi_allal_tazi_detectee?: boolean;
  barrage_garde_atteint?: boolean;
  exutoire_atteint?: boolean;
  affluents_detectes?: string[];
  confidence_level?: string;
  warnings?: string[];
  diagnostic_messages?: string[];
}

export type DeclarationTopologyResult = TopologyResult;

export interface MatrixResult {
  matrix_id: string;
  matrix_version: string;
  scenario_id?: string;
  source_point_id?: string;
  exact_match?: boolean;
  pollutant: string;
  C_SidiAllalTazi_mg_L: number;
  C_BgGarde_mg_L: number;
  statut_sidi_allal_tazi: string;
  statut_bg_garde: string;
  statut_global: string;
  out_of_domain: boolean;
  confidence_level: string;
  method_used: string;
  warnings?: string[];
}

export interface RiskResult {
  risk_level: "LOW" | "HIGH" | string;
  status: WorkflowStatus;
}

export interface TravelTimeTargetResult {
  target_station_code: string;
  target_station_label?: string | null;
  target_legacy_station_id?: number | null;
  target_station_id?: string | null;
  reference_distance_km?: number | null;
  topology_distance_km?: number | null;
  distance_difference_km?: number | null;
  distance_difference_percent?: number | null;
  distance_alignment_status?: string | null;
  velocity_kmh?: number | null;
  reference_travel_time_h?: number | null;
  travel_time_h?: number | null;
  estimated_arrival_at?: string | null;
  estimated_arrival_at_local?: string | null;
  method_used?: string | null;
  confidence_level?: string | null;
  source_node?: number | string | null;
  target_node?: number | string | null;
  edge_count?: number | null;
  warnings?: string[];
}

export interface TravelTimeResult {
  reference_id: string;
  reference_version: string;
  source_point_id?: string | null;
  source_point_label?: string | null;
  reference_origin_code?: string | null;
  reference_origin_label?: string | null;
  source_offset_status?: string | null;
  reference_time?: string | null;
  reference_time_local?: string | null;
  reference_time_source?: string | null;
  timezone?: string | null;
  targets: TravelTimeTargetResult[];
  scientific_limitations?: string[];
  warnings?: string[];
  status?: string;
}

export interface PollutionDeclarationEvaluationResponse {
  declaration_id: string;
  status: WorkflowStatus;
  snapshot_id: string;
  topology_result: TopologyResult;
  matrix_result: MatrixResult;
  risk_result: RiskResult;
  travel_time_result?: TravelTimeResult | null;
  recommendations: RecommendationResult[];
  decision_reasoning?: {
    summary?: string;
    reasons?: string[];
    human_validation_required?: boolean;
  } | null;
  warnings: string[];
  errors: Array<Record<string, unknown>>;
  report_available: boolean;
}

export interface PollutionDeclarationReportResponse {
  declaration_id: string;
  snapshot_id: string;
  status: WorkflowStatus;
  report_id: string;
  generated_at: string;
  report_payload: Record<string, unknown>;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  http_status?: number;
  workflow_status?: WorkflowStatus | null;
  user_action?: string | null;
  details?: Record<string, unknown> | null;
}

export async function createDeclaration(payload: PollutionDeclarationCreateRequest) {
  const { data } = await api.post<PollutionDeclarationResponse>("/pollution/declarations", payload);
  return data;
}

export async function listDeclarations() {
  const { data } = await api.get<PollutionDeclarationListResponse>("/pollution/declarations");
  return data;
}

export async function getDeclaration(declarationId: string) {
  const { data } = await api.get<PollutionDeclarationResponse>(`/pollution/declarations/${declarationId}`);
  return data;
}

export async function submitDeclaration(declarationId: string, payload?: PollutionDeclarationTransitionRequest) {
  const { data } = await api.post<PollutionDeclarationResponse>(
    `/pollution/declarations/${declarationId}/submit`,
    payload ?? {}
  );
  return data;
}

export async function evaluateDeclaration(
  declarationId: string,
  payload?: PollutionDeclarationEvaluateRequest
) {
  const { data } = await api.post<PollutionDeclarationEvaluationResponse>(
    `/pollution/declarations/${declarationId}/evaluate`,
    payload ?? {}
  );
  return data;
}

export async function validateDeclaration(declarationId: string, payload?: PollutionDeclarationTransitionRequest) {
  const { data } = await api.post<PollutionDeclarationResponse>(
    `/pollution/declarations/${declarationId}/validate`,
    payload ?? {}
  );
  return data;
}

export async function rejectDeclaration(declarationId: string, payload?: PollutionDeclarationTransitionRequest) {
  const { data } = await api.post<PollutionDeclarationResponse>(
    `/pollution/declarations/${declarationId}/reject`,
    payload ?? {}
  );
  return data;
}

export async function closeDeclaration(declarationId: string, payload?: PollutionDeclarationTransitionRequest) {
  const { data } = await api.post<PollutionDeclarationResponse>(
    `/pollution/declarations/${declarationId}/close`,
    payload ?? {}
  );
  return data;
}

export async function getDeclarationReport(declarationId: string) {
  const { data } = await api.get<PollutionDeclarationReportResponse>(
    `/pollution/declarations/${declarationId}/report`
  );
  return data;
}

