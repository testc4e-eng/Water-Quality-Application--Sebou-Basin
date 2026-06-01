import { useQuery } from "@tanstack/react-query";

import { getQualiteFamily, type QualiteFamilyId } from "@/api/qualite";
import { findObservatoryFamily } from "@/config/observatoryCatalog";
import type { QualiteExposureResponse, QualiteFilters } from "@/types/qualite";

export interface ObservatoryDataSelection {
  domainId?: string;
  familyId?: string;
  parameterCode?: string;
  dateStart?: string;
  dateEnd?: string;
  supportType?: string;
  limit?: number;
  includeGeom?: boolean;
}

export function buildObservatoryFilters(selection: ObservatoryDataSelection): QualiteFilters {
  return {
    code_parametre: selection.parameterCode,
    date_start: selection.dateStart,
    date_end: selection.dateEnd,
    support_type: selection.supportType,
    limit: selection.limit ?? 100,
    offset: 0,
    include_geom: selection.includeGeom ?? false,
  };
}

export function useObservatoryData(selection: ObservatoryDataSelection) {
  const family = findObservatoryFamily(selection.domainId, selection.familyId);
  const filters = buildObservatoryFilters(selection);
  const enabled = Boolean(
    selection.domainId &&
      selection.familyId &&
      selection.parameterCode &&
      family?.status === "active" &&
      family.apiFamily
  );

  return useQuery<QualiteExposureResponse>({
    queryKey: ["observatory", selection.domainId, selection.familyId, filters],
    queryFn: () => getQualiteFamily(family?.apiFamily as QualiteFamilyId, filters),
    enabled,
    staleTime: 60_000,
    placeholderData: (previousData) => previousData,
  });
}
