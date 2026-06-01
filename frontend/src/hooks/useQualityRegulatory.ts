import { useQuery } from "@tanstack/react-query";

import {
  classifyQualityValue,
  getActiveThresholds,
  getQualityParameters,
  getQualityStations,
  getQualityTimeseries,
  getRegulatoryStatus,
} from "@/api/qualityRegulatory";

const STALE_TIME_MS = 60_000;

export function useRegulatoryStatus() {
  return useQuery({ queryKey: ["quality-regulatory", "status"], queryFn: getRegulatoryStatus, staleTime: STALE_TIME_MS });
}

export function useActiveThresholds() {
  return useQuery({ queryKey: ["quality-regulatory", "thresholds", "active"], queryFn: getActiveThresholds, staleTime: STALE_TIME_MS });
}

export function useQualityStations() {
  return useQuery({ queryKey: ["quality-regulatory", "stations"], queryFn: getQualityStations, staleTime: STALE_TIME_MS });
}

export function useQualityParameters(stationId?: string) {
  return useQuery({
    queryKey: ["quality-regulatory", "parameters", stationId],
    queryFn: () => getQualityParameters(stationId),
    enabled: Boolean(stationId),
    staleTime: STALE_TIME_MS,
  });
}

export function useQualityTimeseries(stationId?: string, dateStart?: string, dateEnd?: string) {
  return useQuery({
    queryKey: ["quality-regulatory", "timeseries", stationId, dateStart, dateEnd],
    queryFn: () => getQualityTimeseries(stationId!, dateStart, dateEnd),
    enabled: Boolean(stationId),
    staleTime: STALE_TIME_MS,
  });
}

export function useQualityClassification(parameterCode?: string, value?: number | null, unit = "mg/L") {
  return useQuery({
    queryKey: ["quality-regulatory", "classification", parameterCode, value, unit],
    queryFn: () => classifyQualityValue(parameterCode!, value!, unit),
    enabled: Boolean(parameterCode) && value !== null && value !== undefined,
    staleTime: STALE_TIME_MS,
  });
}
