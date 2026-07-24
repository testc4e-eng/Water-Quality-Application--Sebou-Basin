import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createDeclaration,
  evaluateDeclaration,
  getDeclaration,
  getDeclarationReport,
  listDeclarations,
  submitDeclaration,
  type PollutionDeclarationCreateRequest,
  type PollutionDeclarationEvaluateRequest,
  type PollutionDeclarationTransitionRequest,
} from "@/api/pollutionDeclarations";

interface UsePollutionDeclarationsOptions {
  enableList?: boolean;
  enableDetail?: boolean;
  invalidateOnMutation?: boolean;
}

export function usePollutionDeclarations(
  currentDeclarationId: string | null,
  options: UsePollutionDeclarationsOptions = {},
) {
  const {
    enableList = true,
    enableDetail = true,
    invalidateOnMutation = true,
  } = options;
  const queryClient = useQueryClient();

  const declarationsQuery = useQuery({
    queryKey: ["pollution-declarations", "list"],
    queryFn: listDeclarations,
    enabled: enableList,
  });

  const declarationQuery = useQuery({
    queryKey: ["pollution-declarations", "detail", currentDeclarationId],
    queryFn: () => getDeclaration(currentDeclarationId!),
    enabled: enableDetail && Boolean(currentDeclarationId),
  });

  const reportQuery = useQuery({
    queryKey: ["pollution-declarations", "report", currentDeclarationId],
    queryFn: () => getDeclarationReport(currentDeclarationId!),
    enabled: false,
  });

  const invalidateDeclaration = async (declarationId?: string | null) => {
    if (!invalidateOnMutation) {
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["pollution-declarations", "list"] });
    if (declarationId) {
      await queryClient.invalidateQueries({ queryKey: ["pollution-declarations", "detail", declarationId] });
      await queryClient.invalidateQueries({ queryKey: ["pollution-declarations", "report", declarationId] });
    }
  };

  const createMutation = useMutation({
    mutationFn: (payload: PollutionDeclarationCreateRequest) => createDeclaration(payload),
    onSuccess: async (data) => {
      await invalidateDeclaration(data.declaration_id);
    },
  });

  const submitMutation = useMutation({
    mutationFn: (params: { declarationId: string; payload?: PollutionDeclarationTransitionRequest }) =>
      submitDeclaration(params.declarationId, params.payload),
    onSuccess: async (data) => {
      await invalidateDeclaration(data.declaration_id);
    },
  });

  const evaluateMutation = useMutation({
    mutationFn: (params: { declarationId: string; payload?: PollutionDeclarationEvaluateRequest }) =>
      evaluateDeclaration(params.declarationId, params.payload),
    onSuccess: async (data) => {
      await invalidateDeclaration(data.declaration_id);
    },
  });

  return {
    declarationsQuery,
    declarationQuery,
    reportQuery,
    createMutation,
    submitMutation,
    evaluateMutation,
    refresh: () => invalidateDeclaration(currentDeclarationId),
  };
}
