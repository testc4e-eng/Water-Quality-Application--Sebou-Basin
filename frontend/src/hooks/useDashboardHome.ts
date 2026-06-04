import { useQuery } from "@tanstack/react-query";

import { getDashboardHome, readDashboardHomeCache } from "@/api/dashboardHome";

const STALE_TIME_MS = 30_000;

export function useDashboardHome() {
  return useQuery({
    queryKey: ["dashboard-home-v2"],
    queryFn: getDashboardHome,
    initialData: readDashboardHomeCache,
    staleTime: STALE_TIME_MS,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}
