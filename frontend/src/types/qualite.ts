export type ApiStatus = "success" | "error";

export interface QualiteFilters {
  date_start?: string;
  date_end?: string;
  support_type?: string;
  support_id?: string;
  code_parametre?: string;
  qa_status?: string;
  geo_status?: string;
  limit?: number;
  offset?: number;
  include_geom?: boolean;
}

export interface QualiteExposureRecord {
  source_table: string;
  support_type: string | null;
  support_id: string | null;
  support_nom: string | null;
  date_mesure: string | null;
  parametre_ref_id: string | null;
  code_parametre: string;
  libelle_parametre: string | null;
  unite_reference: string | null;
  valeur_num: number | null;
  valeur_raw: string | number | null;
  qa_status: string | null;
  geo_status: string | null;
  source_row_id: string | null;
  campagne_id?: string | null;
  ingestion_batch_id?: string | null;
  geom?: unknown | null;
}

export interface QualiteExposureMetadata {
  source_view?: string;
  source_version?: string;
  total_count?: number;
  returned_count?: number;
  limit?: number;
  offset?: number;
  has_more?: boolean;
  excluded_parameters?: string[];
  business_rules?: string[];
  elapsed_ms?: number;
  [key: string]: unknown;
}

export interface QualiteExposureResponse {
  status: ApiStatus;
  count: number;
  filters: QualiteFilters;
  data: QualiteExposureRecord[];
  metadata: QualiteExposureMetadata;
}
