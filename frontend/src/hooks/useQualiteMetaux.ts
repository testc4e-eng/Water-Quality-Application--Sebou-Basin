import { useQuery } from "@tanstack/react-query";

import { getQualiteMetaux } from "@/api/qualite";
import type { QualiteExposureResponse, QualiteFilters } from "@/types/qualite";

export function useQualiteMetaux(filters: QualiteFilters) {
  return useQuery<QualiteExposureResponse>({
    queryKey: ["qualite", "metaux", filters],
    queryFn: () => getQualiteMetaux(filters),
    staleTime: 60_000,
    placeholderData: (previousData) => previousData,
  });
}
