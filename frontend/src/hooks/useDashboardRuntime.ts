import { useQuery } from "@tanstack/react-query";

import { getDashboardTrends, getQualityStationsWithTimeseries } from "@/api/dashboardRuntime";

const STALE_TIME_MS = 60_000;

export function useQualityStationsWithTimeseries(limit = 6) {
  return useQuery({
    queryKey: ["quality", "stations-with-timeseries", limit],
    queryFn: ({ signal }) => getQualityStationsWithTimeseries(limit, signal),
    staleTime: STALE_TIME_MS,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useDashboardRuntimeTrends(days = 30) {
  return useQuery({
    queryKey: ["dashboard", "runtime-trends", days],
    queryFn: ({ signal }) => getDashboardTrends(days, signal),
    staleTime: STALE_TIME_MS,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
