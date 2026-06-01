import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getCatalog,
  getEntities,
  getLatestValues,
  type MapEntitiesFilters,
  type MapLatestValuesFilters,
} from "@/api/mapBusiness";

const STALE_TIME_MS = 60_000;

export function useMapCatalog() {
  return useQuery({
    queryKey: ["map-business", "catalog"],
    queryFn: getCatalog,
    staleTime: STALE_TIME_MS,
  });
}

export function useMapEntities(filters: MapEntitiesFilters | null, enabled = false) {
  return useQuery({
    queryKey: ["map-business", "entities", filters],
    queryFn: () => getEntities(filters ?? {}),
    enabled: enabled && Boolean(filters),
    staleTime: STALE_TIME_MS,
    placeholderData: keepPreviousData,
  });
}

export function useLatestValues(filters: MapLatestValuesFilters | null, enabled = false) {
  return useQuery({
    queryKey: ["map-business", "latest-values", filters],
    queryFn: () => getLatestValues(filters ?? {}),
    enabled: enabled && Boolean(filters),
    staleTime: STALE_TIME_MS,
    placeholderData: keepPreviousData,
  });
}
