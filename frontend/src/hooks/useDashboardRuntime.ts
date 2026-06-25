import { useQuery } from "@tanstack/react-query";

import { getDashboardTrends, getQualityStationsWithTimeseries } from "@/api/dashboardRuntime";

const STALE_TIME_MS = 60_000;

export function useQualityStationsWithTimeseries(limit = 6) {
  return useQuery({
    queryKey: ["quality", "stations-with-timeseries", limit],
    queryFn: () => getQualityStationsWithTimeseries(limit),
    staleTime: STALE_TIME_MS,
  });
}

export function useDashboardRuntimeTrends(days = 30) {
  return useQuery({
    queryKey: ["dashboard", "runtime-trends", days],
    queryFn: () => getDashboardTrends(days),
    staleTime: STALE_TIME_MS,
  });
}
