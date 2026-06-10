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

export function useQualityStations(supportType?: string) {
  return useQuery({ queryKey: ["quality-regulatory", "stations", supportType], queryFn: () => getQualityStations(supportType), staleTime: STALE_TIME_MS });
}

export function useQualityParameters(supportType?: string, stationId?: string) {
  return useQuery({
    queryKey: ["quality-regulatory", "parameters", supportType, stationId],
    queryFn: () => getQualityParameters(supportType, stationId),
    staleTime: STALE_TIME_MS,
  });
}

export function useQualityTimeseries(supportType?: string, stationId?: string, dateStart?: string, dateEnd?: string) {
  return useQuery({
    queryKey: ["quality-regulatory", "timeseries", supportType, stationId, dateStart, dateEnd],
    queryFn: () => getQualityTimeseries(supportType, stationId!, dateStart, dateEnd),
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
