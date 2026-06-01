import { api } from "@/api/client";
import type { QualiteExposureResponse, QualiteFilters } from "@/types/qualite";

export const QUALITE_METAUX_EXCLUDED_CODES = ["FM", "F_M_MES", "MO_METAL"] as const;
export type QualiteFamilyId = "metaux" | "chimie-minerale" | "physicochimie" | "pollution-organique";

const QUALITE_FAMILY_ENDPOINTS: Record<QualiteFamilyId, string> = {
  metaux: "/qualite/metaux",
  "chimie-minerale": "/qualite/chimie-minerale",
  physicochimie: "/qualite/physicochimie",
  "pollution-organique": "/qualite/pollution-organique",
};

function cleanFilters(filters: QualiteFilters): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== "")
  ) as Record<string, string | number | boolean>;
}

export async function getQualiteMetaux(
  filters: QualiteFilters = {}
): Promise<QualiteExposureResponse> {
  return getQualiteFamily("metaux", filters);
}

export async function getQualiteChimieMinerale(
  filters: QualiteFilters = {}
): Promise<QualiteExposureResponse> {
  return getQualiteFamily("chimie-minerale", filters);
}

export async function getQualitePhysicochimie(
  filters: QualiteFilters = {}
): Promise<QualiteExposureResponse> {
  return getQualiteFamily("physicochimie", filters);
}

export async function getQualitePollutionOrganique(
  filters: QualiteFilters = {}
): Promise<QualiteExposureResponse> {
  return getQualiteFamily("pollution-organique", filters);
}

export async function getQualiteFamily(
  family: QualiteFamilyId,
  filters: QualiteFilters = {}
): Promise<QualiteExposureResponse> {
  const endpoint = QUALITE_FAMILY_ENDPOINTS[family];
  const { data } = await api.get<QualiteExposureResponse>(endpoint, {
    params: cleanFilters(filters),
  });

  return data;
}
