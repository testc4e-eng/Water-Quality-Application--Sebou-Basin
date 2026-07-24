import { useQuery } from "@tanstack/react-query";

import {
  getCampagnes,
  getPollutionAlerts,
  getPrelevementDetail,
  getPrelevementLiens,
  getPrelevementMesures,
  getPrelevements,
  type AlertFilters,
  type PrelevementFilters,
} from "@/api/pollutionCampagnes";

export function useCampagnes() {
  return useQuery({
    queryKey: ["pollution-campagnes", "campagnes"],
    queryFn: () => getCampagnes(),
    staleTime: 60_000,
  });
}

export function usePrelevements(filters: PrelevementFilters) {
  return useQuery({
    queryKey: ["pollution-campagnes", "prelevements", filters],
    queryFn: () => getPrelevements(filters),
    staleTime: 60_000,
    placeholderData: (previousData) => previousData,
  });
}

export function usePrelevementDetail(id: string | null) {
  return useQuery({
    queryKey: ["pollution-campagnes", "prelevement", id],
    queryFn: () => getPrelevementDetail(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function usePrelevementMesures(id: string | null) {
  return useQuery({
    queryKey: ["pollution-campagnes", "prelevement-mesures", id],
    queryFn: () => getPrelevementMesures(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function usePrelevementLiens(id: string | null) {
  return useQuery({
    queryKey: ["pollution-campagnes", "prelevement-liens", id],
    queryFn: () => getPrelevementLiens(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function usePollutionAlerts(filters: AlertFilters = {}) {
  return useQuery({
    queryKey: ["pollution-campagnes", "alerts", filters],
    queryFn: () => getPollutionAlerts(filters),
    staleTime: 60_000,
  });
}
