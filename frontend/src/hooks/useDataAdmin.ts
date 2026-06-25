import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";

import {
  getDataAdminClass,
  getDataAdminClassCount,
  getDataAdminClasses,
  getDataAdminClassRecords,
  getDataAdminClassSchema,
} from "@/api/dataAdmin";
import type { DataAdminClassSummary } from "@/types/dataAdmin";

export function useDataAdminClasses() {
  return useQuery({
    queryKey: ["data-admin", "classes"],
    queryFn: getDataAdminClasses,
  });
}

export function useDataAdminClass(classCode: string | null) {
  return useQuery({
    queryKey: ["data-admin", "class", classCode],
    queryFn: () => getDataAdminClass(classCode!),
    enabled: Boolean(classCode),
  });
}

export function useDataAdminClassSchema(classCode: string | null) {
  return useQuery({
    queryKey: ["data-admin", "schema", classCode],
    queryFn: () => getDataAdminClassSchema(classCode!),
    enabled: Boolean(classCode),
  });
}

export function useDataAdminClassCount(classCode: string | null) {
  return useQuery({
    queryKey: ["data-admin", "count", classCode],
    queryFn: () => getDataAdminClassCount(classCode!),
    enabled: Boolean(classCode),
  });
}

export function useDataAdminClassRecords(classCode: string | null, page: number, pageSize: number) {
  return useQuery({
    queryKey: ["data-admin", "records", classCode, page, pageSize],
    queryFn: () =>
      getDataAdminClassRecords(classCode!, {
        limit: pageSize,
        offset: page * pageSize,
      }),
    enabled: Boolean(classCode),
    placeholderData: (previousData) => previousData,
  });
}

export function useDataAdminClassCounts(classes: DataAdminClassSummary[]) {
  const queryResults = useQueries({
    queries: classes.map((dataClass) => ({
      queryKey: ["data-admin", "count", dataClass.class_code],
      queryFn: () => getDataAdminClassCount(dataClass.class_code),
      staleTime: 60_000,
    })),
  });

  const countsByClassCode = useMemo(
    () =>
      classes.reduce<Record<string, number | null>>((acc, dataClass, index) => {
        acc[dataClass.class_code] = queryResults[index]?.data?.count ?? null;
        return acc;
      }, {}),
    [classes, queryResults],
  );

  const isLoading = queryResults.some((result) => result.isLoading);
  const isError = queryResults.some((result) => result.isError);

  return {
    results: queryResults,
    countsByClassCode,
    isLoading,
    isError,
  };
}
