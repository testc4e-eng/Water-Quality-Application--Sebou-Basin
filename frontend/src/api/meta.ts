// frontend/src/api/meta.ts
// ============================================================
// Client pour les endpoints du schéma metadata.
// Expose les 3 vues : api_view_catalog, api_view_column_catalog,
// v_api_dictionary.
// ============================================================
import { api } from "@/api/client";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

export type ApiViewCatalogRow = {
  view_name: string;
  schema_name?: string;
  description?: string | null;
  [key: string]: unknown;
};

export type ApiViewColumnRow = {
  view_name: string;
  column_name: string;
  data_type?: string;
  description?: string | null;
  [key: string]: unknown;
};

export type ApiDictionaryRow = {
  schema_name?: string;
  view_name: string;
  column_name?: string;
  data_type?: string;
  description?: string | null;
  [key: string]: unknown;
};

/* ─────────────────────────────────────────────
   ENDPOINTS
───────────────────────────────────────────── */

/**
 * GET /meta/api-catalog
 * Liste des vues exposées dans le schéma api avec leur description.
 */
export const fetchApiCatalog = async (): Promise<ApiViewCatalogRow[]> => {
  const { data } = await api.get<ApiViewCatalogRow[]>("/meta/api-catalog");
  return Array.isArray(data) ? data : [];
};

/**
 * GET /meta/api-column-catalog?view_name=...
 * Colonnes de chaque vue API avec type et description.
 * Le paramètre view_name est optionnel pour filtrer sur une vue spécifique.
 */
export const fetchApiColumnCatalog = async (
  view_name?: string
): Promise<ApiViewColumnRow[]> => {
  const { data } = await api.get<ApiViewColumnRow[]>("/meta/api-column-catalog", {
    params: view_name ? { view_name } : undefined,
  });
  return Array.isArray(data) ? data : [];
};

/**
 * GET /meta/api-dictionary
 * Vue agrégée : schéma + colonnes + descriptions de toutes les vues API.
 */
export const fetchApiDictionary = async (): Promise<ApiDictionaryRow[]> => {
  const { data } = await api.get<ApiDictionaryRow[]>("/meta/api-dictionary");
  return Array.isArray(data) ? data : [];
};
