import { useQuery } from "@tanstack/react-query";

import { getPollutionIdpSites, getPollutionLatestResults, type PollutionIdpFilters } from "@/api/pollutionIdp";

export function usePollutionIdp(filters: PollutionIdpFilters) {
  return useQuery({
    queryKey: ["pollution-idp", "sites", filters],
    queryFn: () => getPollutionIdpSites(filters),
    staleTime: 60_000,
    placeholderData: (previousData) => previousData,
  });
}

export function usePollutionLatestResults(filters: PollutionIdpFilters) {
  return useQuery({
    queryKey: ["pollution-idp", "latest-results", filters],
    queryFn: () => getPollutionLatestResults(filters),
    staleTime: 60_000,
    placeholderData: (previousData) => previousData,
  });
}
