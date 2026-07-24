import { useQuery } from "@tanstack/react-query";

import { getDashboardHome, readDashboardHomeCache } from "@/api/dashboardHome";

const STALE_TIME_MS = 60_000;
const MAX_RETRIES = 2;

function isAbortLikeError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as { name?: string; code?: string };
  return maybeError.name === "CanceledError" || maybeError.name === "AbortError" || maybeError.code === "ERR_CANCELED";
}

export function useDashboardHome() {
  return useQuery({
    queryKey: ["dashboard-home-v2"],
    queryFn: ({ signal }) => getDashboardHome(signal),
    initialData: readDashboardHomeCache,
    staleTime: STALE_TIME_MS,
    gcTime: 15 * 60_000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => !isAbortLikeError(error) && failureCount < MAX_RETRIES,
    retryDelay: (attemptIndex) => Math.min(3_000 * 2 ** attemptIndex, 12_000),
  });
}
