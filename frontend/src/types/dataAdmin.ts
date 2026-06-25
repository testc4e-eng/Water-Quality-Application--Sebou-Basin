export type DataAdminDomain =
  | "GEO"
  | "INFRA"
  | "HYDRO"
  | "METEO"
  | "QUALITE"
  | "POLLUTION"
  | "REFERENTIEL"
  | "MODELES";

export type DataAdminHealthStatus = "ACTIVE" | "EMPTY" | "WARNING" | "MISSING";
export type DataAdminHealthSeverity = "HEALTHY" | "WARNING" | "CRITICAL";

export interface DataAdminClassSummary {
  class_code: string;
  class_label: string;
  domain: DataAdminDomain | string;
  target_schema: string;
  target_table: string;
  exposure_view_schema: string | null;
  exposure_view_name: string | null;
  staging_schema: string | null;
  staging_table: string | null;
  geometry_required: boolean;
  temporal_required: boolean;
  validation_level: string;
  editable: boolean;
  ingestable: boolean;
  realtime_capable: boolean;
  owner_role: string;
  status: string;
  db_execution_pending: boolean;
}

export interface DataAdminFieldSchema {
  field_name: string;
  field_label: string;
  data_type: string;
  required: boolean;
  editable: boolean;
  ingestable: boolean;
  validation_rule: string | null;
  reference_source: string | null;
  display_order: number;
}

export type DataAdminRecord = Record<string, unknown>;

export interface DataAdminMetadata {
  registry_source?: string;
  db_execution_pending?: boolean;
  warning?: string | null;
  source_schema?: string;
  source_name?: string;
  source_kind?: string;
  filters?: Record<string, unknown>;
  total_count?: number;
}

export interface DataAdminClassListResponse {
  status: string;
  count: number;
  data: DataAdminClassSummary[];
  metadata: DataAdminMetadata;
}

export interface DataAdminClassDetailResponse {
  status: string;
  data: DataAdminClassSummary;
  metadata: DataAdminMetadata;
}

export interface DataAdminClassSchemaResponse {
  status: string;
  class_code: string;
  count: number;
  data: DataAdminFieldSchema[];
  metadata: DataAdminMetadata;
}

export interface DataAdminClassCountResponse {
  status: string;
  class_code: string;
  count: number;
  metadata: DataAdminMetadata;
}

export interface DataAdminClassRecordsResponse {
  status: string;
  class_code: string;
  count: number;
  limit: number;
  offset: number;
  data: DataAdminRecord[];
  metadata: DataAdminMetadata;
}

export interface DataAdminRecordsQuery {
  limit?: number;
  offset?: number;
}

export interface DataAdminClassHealth {
  status: DataAdminHealthStatus;
  severity: DataAdminHealthSeverity;
  label: string;
  reason: string;
}

export interface DataAdminTemplateFieldSpec {
  field_name: string;
  field_label: string;
  data_type: string;
  required: boolean;
  editable: boolean;
  ingestable: boolean;
  validation_rule: string | null;
  reference_source: string | null;
  example_value: string | null;
  unit_expected: string | null;
  allowed_values_source: string | null;
  description: string | null;
  display_order: number;
}

export interface DataAdminTemplateSheetSpec {
  sheet_name: string;
  purpose: string;
  columns: string[];
}

export interface DataAdminTemplateMetadataRow {
  key: string;
  value: string;
}

export interface DataAdminTemplateSpecData {
  class_code: string;
  class_label: string;
  domain: string;
  target_schema: string;
  target_table: string;
  staging_schema: string | null;
  staging_table: string | null;
  template_version: string;
  file_formats: string[];
  field_source: string;
  field_registry_incomplete: boolean;
  fields: DataAdminTemplateFieldSpec[];
  sheets: DataAdminTemplateSheetSpec[];
  instructions: string[];
  metadata_rows: DataAdminTemplateMetadataRow[];
  warnings: string[];
}

export interface DataAdminTemplateSpecResponse {
  status: string;
  class_code: string;
  data: DataAdminTemplateSpecData;
  metadata: DataAdminMetadata & {
    field_source?: string;
    field_registry_incomplete?: boolean;
  };
}

export interface DataAdminIngestionError {
  error_id: string;
  run_id: string;
  row_number: number | null;
  field_name: string | null;
  error_scope: string;
  severity: string;
  error_code: string;
  error_message: string;
  raw_value: string | null;
  expected_rule: string | null;
  created_at: string;
}

export interface DataAdminIngestionRunSummary {
  run_id: string;
  class_code: string;
  run_status: string;
  file_name: string;
  file_format: string;
  row_count: number;
  valid_row_count: number;
  error_row_count: number;
  warning_count: number;
  created_by: string;
  created_at: string;
  validated_at: string | null;
  staged_at: string | null;
  metadata: Record<string, unknown>;
}

export interface DataAdminIngestionFileSummary {
  file_id: string;
  run_id: string;
  file_name: string;
  file_format: string;
  mime_type: string;
  file_size_bytes: number;
  sha256: string;
  stored_path: string | null;
  raw_preview: Record<string, unknown>[];
  created_at: string;
}

export interface DataAdminIngestionUploadResponse {
  status: string;
  run: DataAdminIngestionRunSummary;
  file: DataAdminIngestionFileSummary;
  errors: DataAdminIngestionError[];
  staging_row_count: number;
  metadata: Record<string, unknown>;
}

export interface DataAdminIngestionRunsResponse {
  status: string;
  count: number;
  data: DataAdminIngestionRunSummary[];
  metadata: Record<string, unknown>;
}

export interface DataAdminIngestionRunDetailResponse {
  status: string;
  run: DataAdminIngestionRunSummary;
  file: DataAdminIngestionFileSummary | null;
  metadata: Record<string, unknown>;
}

export interface DataAdminIngestionErrorsResponse {
  status: string;
  run_id: string;
  count: number;
  data: DataAdminIngestionError[];
  metadata: Record<string, unknown>;
}

export interface DataAdminIngestionStagingPreviewRow {
  staging_row_id: string;
  run_id: string;
  class_code: string;
  row_number: number;
  row_status: string;
  raw_payload: Record<string, unknown>;
  normalized_payload: Record<string, unknown>;
  validation_errors: Record<string, unknown>[];
  created_at: string;
}

export interface DataAdminIngestionStagingPreviewResponse {
  status: string;
  run_id: string;
  count: number;
  data: DataAdminIngestionStagingPreviewRow[];
  metadata: Record<string, unknown>;
}

export interface DataAdminValidationRule {
  rule_id: string;
  class_code: string;
  field_name: string | null;
  rule_code: string;
  rule_label: string;
  severity: string;
  rule_type: string;
  reference_schema: string | null;
  reference_table: string | null;
  reference_column: string | null;
  sql_template: string | null;
  active: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface DataAdminValidationRulesResponse {
  status: string;
  count: number;
  data: DataAdminValidationRule[];
  metadata: Record<string, unknown>;
}

export interface DataAdminChangeRequestSummary {
  change_request_id: string;
  run_id: string;
  class_code: string;
  request_status: string;
  promotion_mode: string;
  requested_by: string;
  requested_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  approved_by: string | null;
  approved_at: string | null;
  rejected_by: string | null;
  rejected_at: string | null;
  applied_by: string | null;
  applied_at: string | null;
  rollback_available: boolean;
  rollback_status: string;
  rollback_reference: Record<string, unknown> | null;
  rollback_requested_by: string | null;
  rollback_requested_at: string | null;
  rollback_approved_by: string | null;
  rollback_approved_at: string | null;
  rollback_applied_by: string | null;
  rollback_applied_at: string | null;
  summary: Record<string, unknown>;
  comments: string | null;
}

export interface DataAdminChangeRequestItem {
  item_id: string;
  change_request_id: string;
  staging_row_id: string;
  item_status: string;
  raw_payload: Record<string, unknown>;
  normalized_payload: Record<string, unknown>;
  validation_errors: Record<string, unknown>[];
  promotion_action: string;
  target_schema: string;
  target_table: string;
  target_pk: Record<string, unknown> | null;
  applied_at: string | null;
  error_message: string | null;
}

export interface DataAdminChangeRequestDetail {
  request: DataAdminChangeRequestSummary;
  items: DataAdminChangeRequestItem[];
}

export interface DataAdminChangeRequestListResponse {
  status: string;
  count: number;
  data: DataAdminChangeRequestSummary[];
  metadata: Record<string, unknown>;
}

export interface DataAdminChangeRequestDetailResponse {
  status: string;
  data: DataAdminChangeRequestDetail;
  metadata: Record<string, unknown>;
}

export interface DataAdminPromotionAuditLogEntry {
  audit_id: string;
  change_request_id: string;
  run_id: string;
  class_code: string;
  action: string;
  target_schema: string | null;
  target_table: string | null;
  target_pk: Record<string, unknown> | null;
  payload: Record<string, unknown>;
  actor: string;
  created_at: string;
  metadata: Record<string, unknown>;
}

export interface DataAdminPromotionAuditLogResponse {
  status: string;
  change_request_id: string;
  count: number;
  data: DataAdminPromotionAuditLogEntry[];
  metadata: Record<string, unknown>;
}

export interface DataAdminRollbackStatusResponse {
  status: string;
  data: DataAdminChangeRequestSummary;
  metadata: Record<string, unknown>;
}

export function getDataAdminClassDescription(dataClass: DataAdminClassSummary): string {
  const exposure = dataClass.exposure_view_name
    ? `${dataClass.exposure_view_schema}.${dataClass.exposure_view_name}`
    : `${dataClass.target_schema}.${dataClass.target_table}`;
  return `${dataClass.class_label} exposee en lecture via ${exposure}.`;
}

export function getDataAdminClassHealth(
  dataClass: DataAdminClassSummary,
  count: number | null | undefined,
): DataAdminClassHealth {
  if (dataClass.db_execution_pending) {
    return {
      status: "MISSING",
      severity: "CRITICAL",
      label: "MISSING",
      reason: "Registre ou source non disponible au runtime.",
    };
  }

  if ((count ?? null) === 0) {
    return {
      status: "EMPTY",
      severity: "WARNING",
      label: "EMPTY",
      reason: "Classe enregistree mais sans enregistrement exploitable.",
    };
  }

  if (!dataClass.exposure_view_name) {
    return {
      status: "WARNING",
      severity: "WARNING",
      label: "WARNING",
      reason: "Lecture sans vue d'exposition dediee.",
    };
  }

  return {
    status: "ACTIVE",
    severity: "HEALTHY",
    label: "ACTIVE",
    reason: "Classe alimentee et exposee via l'API data-admin.",
  };
}
