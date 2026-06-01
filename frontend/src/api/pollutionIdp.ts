import type { FeatureCollection, Point } from "geojson";

import { api } from "./client";

export const P0_POLLUTION_PARAMETERS = ["DBO5", "DCO", "NH4", "NO3", "MES"] as const;

export type PollutionP0Parameter = (typeof P0_POLLUTION_PARAMETERS)[number];
export type PollutionSymbologyMode = "validation_status" | "regulatory_status";

export interface PollutionIdpFilters {
  parameter_code?: PollutionP0Parameter;
  source_type_code?: string;
  commune?: string;
  limit?: number;
}

export interface PollutionLatestResult {
  parameter_code: string | null;
  parameter_label?: string | null;
  value_numeric?: number | null;
  value_text?: string | null;
  unit?: string | null;
  sample_date?: string | null;
  quality_flag?: string | null;
  regulatory_status?: string | null;
  class_code?: string | null;
  class_label?: string | null;
  color?: string | null;
  severity_order?: number | null;
  threshold?: {
    borne_min?: number | null;
    operateur_min?: string | null;
    borne_max?: number | null;
    operateur_max?: string | null;
    valeur_intervalle_originale?: string | null;
    unite_source?: string | null;
    unite_moteur?: string | null;
    tableau_source?: string | null;
    page_source?: number | null;
  } | null;
  non_classifiable_reason?: string | null;
}

export interface PollutionSiteProperties {
  site_id: string;
  site_code?: string | null;
  site_name?: string | null;
  commune?: string | null;
  province?: string | null;
  bassin?: string | null;
  source_origin?: string | null;
  validation_status?: string | null;
  source_type_code?: string | null;
  source_type_label?: string | null;
  pollution_category_code?: string | null;
  pollution_category_label?: string | null;
  longitude?: number | null;
  latitude?: number | null;
  map_regulatory_class?: string | null;
  map_regulatory_color?: string | null;
  latest_results?: PollutionLatestResult[] | string | null;
}

export type PollutionSitesGeoJson = FeatureCollection<Point, PollutionSiteProperties>;

export async function getPollutionIdpSites(
  filters: PollutionIdpFilters
): Promise<PollutionSitesGeoJson> {
  const params: Record<string, string | number> = {
    limit: filters.limit ?? 5000,
  };

  if (filters.parameter_code) params.parameter_code = filters.parameter_code;
  if (filters.source_type_code) params.source_type_code = filters.source_type_code;
  if (filters.commune) params.commune = filters.commune;

  const { data } = await api.get<PollutionSitesGeoJson>("/pollution/sites.geojson", {
    params,
  });
  return data;
}
