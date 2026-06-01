import { useQuery } from "@tanstack/react-query";

import { getPollutionIdpSites, type PollutionIdpFilters } from "@/api/pollutionIdp";

export function usePollutionIdp(filters: PollutionIdpFilters) {
  return useQuery({
    queryKey: ["pollution-idp", "sites", filters],
    queryFn: () => getPollutionIdpSites(filters),
    staleTime: 60_000,
    placeholderData: (previousData) => previousData,
  });
}
