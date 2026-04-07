// frontend/src/services/ingestionService.ts
import { api } from "@/api/client";

export interface IngestedScenario {
  id: number;
  name: string;
  description: string;
}

export interface IngestionScenariosResponse {
  swat: IngestedScenario[];
  wasp: IngestedScenario[];
}

export interface Anomaly {
  entite?: number | string;
  bassin?: string | null;
  date: string | null;
  variable: string;
  valeur: number;
  seuil_min?: number | null;
  seuil_max?: number | null;
  statut: "CRITIQUE" | "AVERTISSEMENT" | "INFO";
}

export interface QaSummary {
  total_lignes: number;
  total_erreurs: number;
  total_critiques: number;
  total_avertissements: number;
  statut_global: "VALIDE" | "ERREURS DETECTEES";
  message?: string | null;
}

export interface AnomaliesResponse {
  scenario_id: number;
  model: string;
  anomalies_count: number;
  alerts: Anomaly[];
  qa_summary?: QaSummary;
}

export type StructuralStatus = "VALIDE" | "INVALIDE" | "AVERTISSEMENT";

export interface StructuralReport {
  modele_detecte: string;
  format_detecte?: string;
  colonnes_detectees: string[];
  colonnes_manquantes: string[];
  types_inferres: Record<string, string>;
  lignes_vides: number;
  encodage: string;
  statut_format: StructuralStatus;
  colonnes_mal_nommees?: Array<{ attendu: string; detecte: string }>;
  ordre_incorrect?: boolean;
  valeurs_nulles?: Record<string, number>;
  source_table?: string | null;
  message?: string;
}

export interface UploadValidationItem {
  filename: string;
  rapport_structurel: StructuralReport;
}

export interface UploadFilesResponse {
  message: string;
  files: string[];
  status: string;
  validation_structurelle?: UploadValidationItem[];
  rapport_mapping?: UploadMappingItem[];
  controle_doublon?: UploadDuplicateItem[];
}

export interface SimulationDryRunReport {
  mode_simulation: boolean;
  fichier?: string | null;
  etape_1_analyse_format: StructuralReport;
  etape_2_mapping: MappingReport;
  etape_3_detection_doublons: DuplicateReport;
  etape_4_validation_qa: {
    modele: string;
    total_points_analyses: number;
    total_critiques: number;
    anomalies: Anomaly[];
  };
  etape_5_bilan_dry_run: {
    nb_lignes_traitees: number;
    nb_erreurs_format: number;
    nb_doublons: number;
    nb_critiques_qa: number;
    score_qualite_pct: number;
    recommandation: "PUBLIER" | "CORRIGER_ET_RETESTER" | "REJETER";
  };
}

export interface MappingRow {
  statut: "INCOMPATIBLE" | "TRANSFORMABLE" | "ORPHELIN" | "VALIDE";
  champ_source: string | null;
  champ_cible: string | null;
  type_source: string;
  type_cible: string;
  compatible: boolean;
  transformable?: boolean;
  taux_remplissage_pct: number;
  valeurs_nulles: number | null;
}

export interface MappingReport {
  modele_detecte: string;
  format_detecte?: string;
  score_completude_pct: number;
  score_pret_migration_pct?: number;
  colonnes_orphelines: string[];
  champs_cibles_non_couverts: string[];
  champs_cibles_non_prets_migration?: string[];
  tableau_mapping: MappingRow[];
  message?: string;
}

export interface UploadMappingItem {
  filename: string;
  rapport_mapping: MappingReport;
}

export interface DuplicateOverlapZone {
  scenario_id: number;
  date_debut: string;
  date_fin: string;
  entites_chevauchees: number[];
  nb_entites_chevauchees: number;
}

export interface DuplicateReport {
  statut: "DOUBLON_EXACT" | "DOUBLON_PARTIEL" | "NOUVEAU";
  scenario_existant_id?: number | null;
  date_ingestion_originale?: string | null;
  action_requise: "BLOQUER" | "AVERTIR" | "PROCEDER";
  zones_chevauchement?: DuplicateOverlapZone[];
  autorisation?: "PROCEDER" | null;
  signature?: {
    file_md5: string;
    type_modele: string;
    plage_dates: { debut: string | null; fin: string | null };
    liste_entites: number[];
    nb_entites: number;
    signature_key: string;
  };
  message?: string;
}

export interface UploadDuplicateItem {
  filename: string;
  controle_doublon: DuplicateReport;
}

export interface IngestionAuditRow {
  id: number;
  action: "IMPORT" | "VALIDATION" | "VIDER_CACHE" | "PUBLICATION" | "REJET";
  utilisateur: string;
  horodatage: string;
  fichier: {
    nom?: string | null;
    type?: string | null;
    taille?: number | null;
    hash_md5?: string | null;
  };
  scenario_id?: number | null;
  resultat: {
    statut: string;
    nb_erreurs: number;
    nb_lignes: number;
    duree_ms: number;
  };
  message_lisible: string;
  duplicate_count?: number;
}

export interface IngestionAuditResponse {
  rows: IngestionAuditRow[];
  count: number;
}

export const getScenarios = async (): Promise<IngestionScenariosResponse> => {
  const { data } = await api.get("/ingestion/scenarios");
  return data;
};

export const getAnomalies = async (
  scenarioId: number,
  model: "swat" | "wasp",
  filters?: {
    variable?: string;
    entity_id?: number;
    date_from?: string;
    date_to?: string;
    statut?: "CRITIQUE" | "AVERTISSEMENT" | "INFO";
    limit?: number;
  }
): Promise<AnomaliesResponse> => {
  const params = new URLSearchParams();
  params.set("scenario_id", String(scenarioId));
  params.set("model", model);
  if (filters?.variable) params.set("variable", filters.variable);
  if (typeof filters?.entity_id === "number") params.set("entity_id", String(filters.entity_id));
  if (filters?.date_from) params.set("date_from", filters.date_from);
  if (filters?.date_to) params.set("date_to", filters.date_to);
  if (filters?.statut) params.set("statut", filters.statut);
  if (typeof filters?.limit === "number") params.set("limit", String(filters.limit));
  const { data } = await api.get(`/ingestion/validation/anomalies?${params.toString()}`);
  return data;
};

export const uploadFiles = async (files: File[]): Promise<UploadFilesResponse> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const { data } = await api.post("/ingestion/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getIngestionAuditHistory = async (limit = 200): Promise<IngestionAuditResponse> => {
  const { data } = await api.get(`/ingestion/audit/history?limit=${limit}`);
  return data;
};

export const simulateIngestionDryRun = async (file: File): Promise<SimulationDryRunReport> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/ingestion/simulation/dry-run", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const exportQaCriticalCsv = async (
  scenarioId: number,
  model: "swat" | "wasp"
): Promise<{ blob: Blob; filename: string }> => {
  const response = await api.get(`/ingestion/qa/export/critique?scenario_id=${scenarioId}&model=${model}`, {
    responseType: "blob",
  });
  const disposition = String(response.headers["content-disposition"] || "");
  const match = disposition.match(/filename=\"?([^\";]+)\"?/i);
  const filename = match?.[1] || `QA_erreurs_${model}_${scenarioId}.csv`;
  return { blob: response.data as Blob, filename };
};
