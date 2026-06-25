import { useQuery } from "@tanstack/react-query";

import {
  getDecisionAlerts,
  getDecisionRecommendations,
  getKpiOverview,
  getKpiPollution,
  getKpiStations,
  getKpiSubbasins,
} from "@/api/decisionIntelligence";

const STALE_TIME_MS = 60_000;

export function useKpiOverview() {
  return useQuery({
    queryKey: ["decision-intelligence", "kpi", "overview"],
    queryFn: getKpiOverview,
    staleTime: STALE_TIME_MS,
  });
}

export function useKpiStations() {
  return useQuery({
    queryKey: ["decision-intelligence", "kpi", "stations"],
    queryFn: getKpiStations,
    staleTime: STALE_TIME_MS,
  });
}

export function useKpiSubbasins() {
  return useQuery({
    queryKey: ["decision-intelligence", "kpi", "subbasins"],
    queryFn: getKpiSubbasins,
    staleTime: STALE_TIME_MS,
  });
}

export function useKpiPollution() {
  return useQuery({
    queryKey: ["decision-intelligence", "kpi", "pollution"],
    queryFn: getKpiPollution,
    staleTime: STALE_TIME_MS,
  });
}

export function useDecisionAlerts(params: { type?: string; limit?: number; entity_name?: string; site_id?: string }) {
  return useQuery({
    queryKey: ["decision-intelligence", "alerts", params],
    queryFn: () => getDecisionAlerts(params),
    staleTime: STALE_TIME_MS,
  });
}

export function useDecisionRecommendations(params: { domain?: string; limit?: number; entity_name?: string; site_id?: string }) {
  return useQuery({
    queryKey: ["decision-intelligence", "recommendations", params],
    queryFn: () => getDecisionRecommendations(params),
    staleTime: STALE_TIME_MS,
  });
}
