import { useQuery } from "@tanstack/react-query";
import {
  getBusinessMapAvailability,
  getBusinessMapFeatures,
  getBusinessMapLayers,
  getBusinessMapSeries,
  getBusinessMapObject,
} from "@/api/businessMapV1";

export function useBusinessMapAvailability(
  filters: Parameters<typeof getBusinessMapAvailability>[0] = {},
  enabled = true
) {
  return useQuery({
    queryKey: ["business-map", "availability", filters],
    queryFn: () => getBusinessMapAvailability(filters),
    enabled,
    staleTime: 30000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useBusinessMapFeatures(
  filters: Parameters<typeof getBusinessMapFeatures>[0] = {},
  enabled = true
) {
  return useQuery({
    queryKey: ["business-map", "features", filters],
    queryFn: () => getBusinessMapFeatures(filters),
    enabled,
    staleTime: 30000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useBusinessMapSeries(
  params: Parameters<typeof getBusinessMapSeries>[0],
  enabled = true
) {
  return useQuery({
    queryKey: ["business-map", "series", params],
    queryFn: () => getBusinessMapSeries(params),
    enabled,
    staleTime: 30000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useBusinessMapObject(
  support_type?: string,
  object_id?: string,
  enabled = true
) {
  return useQuery({
    queryKey: ["business-map", "object", support_type, object_id],
    queryFn: () => getBusinessMapObject(support_type!, object_id!),
    enabled: enabled && !!support_type && !!object_id,
    staleTime: 30000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useBusinessMapLayers(enabled = true) {
  return useQuery({
    queryKey: ["business-map", "layers"],
    queryFn: getBusinessMapLayers,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
