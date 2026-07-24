import { useMutation } from "@tanstack/react-query";
import {
  fetchCorrelation,
  type CorrelationRequest,
  type CorrelationResponse,
  type CorrelationSeriesInput,
} from "@/api/analysis";
import { useWorkspaceStore } from "@/store/workspaceStore";

interface UseCorrelationVariables {
  seriesX: CorrelationSeriesInput;
  seriesY: CorrelationSeriesInput;
}

export function useCorrelation() {
  const { globalDateFrom, globalDateTo, globalAggregation } = useWorkspaceStore();

  return useMutation<CorrelationResponse, Error, UseCorrelationVariables>({
    mutationFn: async ({ seriesX, seriesY }) => {
      const request: CorrelationRequest = {
        series: [seriesX, seriesY] as [CorrelationSeriesInput, CorrelationSeriesInput],
        date_from: globalDateFrom,
        date_to: globalDateTo,
        aggregation: globalAggregation,
      };
      return fetchCorrelation(request);
    },
  });
}
