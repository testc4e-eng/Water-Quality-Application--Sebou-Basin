import { useQuery } from "@tanstack/react-query";

import {
  getPropagationToBarrages,
  getPropagationToExutoires,
  getPropagationToGarde,
  getPropagationToStations,
  getSnapDiagnostic,
  type PropagationSourceInput,
} from "@/api/propagation";

const STALE_TIME_MS = 60_000;

export function useSnapDiagnostic(params: PropagationSourceInput | null, enabled = false) {
  return useQuery({
    queryKey: ["propagation", "snap-diagnostic", params],
    queryFn: () => getSnapDiagnostic(params ?? {}),
    enabled: enabled && Boolean(params),
    staleTime: STALE_TIME_MS,
  });
}

export function usePropagationToGarde(params: PropagationSourceInput | null, enabled = false) {
  return useQuery({
    queryKey: ["propagation", "source-to-garde", params],
    queryFn: () => getPropagationToGarde(params ?? {}),
    enabled: enabled && Boolean(params),
    staleTime: STALE_TIME_MS,
  });
}

export function usePropagationToStations(params: PropagationSourceInput | null, enabled = false) {
  return useQuery({
    queryKey: ["propagation", "source-to-stations", params],
    queryFn: () => getPropagationToStations(params ?? {}),
    enabled: enabled && Boolean(params),
    staleTime: STALE_TIME_MS,
  });
}

export function usePropagationToBarrages(params: PropagationSourceInput | null, enabled = false) {
  return useQuery({
    queryKey: ["propagation", "source-to-barrages", params],
    queryFn: () => getPropagationToBarrages(params ?? {}),
    enabled: enabled && Boolean(params),
    staleTime: STALE_TIME_MS,
  });
}

export function usePropagationToExutoires(params: PropagationSourceInput | null, enabled = false) {
  return useQuery({
    queryKey: ["propagation", "source-to-exutoires", params],
    queryFn: () => getPropagationToExutoires(params ?? {}),
    enabled: enabled && Boolean(params),
    staleTime: STALE_TIME_MS,
  });
}
