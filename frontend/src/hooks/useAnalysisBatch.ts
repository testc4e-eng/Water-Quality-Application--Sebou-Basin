import { useQuery } from "@tanstack/react-query";
import { useWorkspaceStore } from "../store/workspaceStore";
import { fetchBatchSeries } from "../api/analysis";

export function useAnalysisBatch() {
  const { 
    selectedSeriesRequests, 
    globalDateFrom, 
    globalDateTo, 
    globalAggregation 
  } = useWorkspaceStore();

  const isEnabled = selectedSeriesRequests.length > 0;

  const query = useQuery({
    queryKey: ["analysis", "batch", globalDateFrom, globalDateTo, globalAggregation, selectedSeriesRequests],
    queryFn: async () => {
      const response = await fetchBatchSeries({
        date_from: globalDateFrom,
        date_to: globalDateTo,
        aggregation: globalAggregation,
        series: selectedSeriesRequests
      });
      console.log("Batch response structure:", JSON.stringify(response, null, 2).substring(0, 500));
      return response;
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });

  return query;
}
