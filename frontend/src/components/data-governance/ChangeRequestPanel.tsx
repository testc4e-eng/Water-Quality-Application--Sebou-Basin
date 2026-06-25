import { useEffect, useMemo, useState } from "react";
import { GitPullRequestCreateArrow, History } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  approveDataAdminChangeRequest,
  approveDataAdminRollback,
  applyDataAdminRollback,
  applyDataAdminChangeRequest,
  createDataAdminChangeRequest,
  getDataAdminChangeRequest,
  getDataAdminChangeRequestAuditLog,
  getDataAdminChangeRequests,
  prepareDataAdminRollback,
  rejectDataAdminChangeRequest,
  requestDataAdminRollback,
  submitDataAdminChangeRequest,
} from "@/api/dataAdminChangeRequests";
import { ChangeRequestDetail } from "@/components/data-governance/ChangeRequestDetail";
import { PromotionAuditLog } from "@/components/data-governance/PromotionAuditLog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAuthSession, hasPermission } from "@/lib/authz";
import { toast } from "@/components/ui/sonner";
import type { DataAdminIngestionRunSummary } from "@/types/dataAdmin";

type ChangeRequestPanelProps = {
  selectedRun: DataAdminIngestionRunSummary | null;
};

export function ChangeRequestPanel({ selectedRun }: ChangeRequestPanelProps) {
  const queryClient = useQueryClient();
  const [selectedChangeRequestId, setSelectedChangeRequestId] = useState<string | null>(null);

  const changeRequestsQuery = useQuery({
    queryKey: ["data-admin", "change-requests"],
    queryFn: getDataAdminChangeRequests,
  });

  const selectedChangeRequest = useMemo(() => {
    if (selectedChangeRequestId) return selectedChangeRequestId;
    return changeRequestsQuery.data?.data[0]?.change_request_id ?? null;
  }, [changeRequestsQuery.data?.data, selectedChangeRequestId]);

  const authContext = useMemo(() => {
    const auth = getAuthSession();
    if (!auth.accessToken) {
      return { role: "anonymous", rbacStatus: "AUTH_MISSING", canApprove: false, canApply: false };
    }
    return {
      role: auth.role ?? "unknown",
      rbacStatus: auth.rbacStatus,
      canApprove: hasPermission("data_admin.change_request.approve", auth.permissions),
      canApply: hasPermission("data_admin.change_request.apply", auth.permissions),
    };
  }, []);

  useEffect(() => {
    if (!selectedChangeRequestId && selectedChangeRequest) {
      setSelectedChangeRequestId(selectedChangeRequest);
    }
  }, [selectedChangeRequest, selectedChangeRequestId]);

  const detailQuery = useQuery({
    queryKey: ["data-admin", "change-request", selectedChangeRequestId],
    queryFn: () => getDataAdminChangeRequest(selectedChangeRequestId!),
    enabled: Boolean(selectedChangeRequestId),
  });

  const auditLogQuery = useQuery({
    queryKey: ["data-admin", "change-request-audit-log", selectedChangeRequestId],
    queryFn: () => getDataAdminChangeRequestAuditLog(selectedChangeRequestId!),
    enabled: Boolean(selectedChangeRequestId),
  });

  const invalidateAll = (changeRequestId?: string | null) => {
    queryClient.invalidateQueries({ queryKey: ["data-admin", "change-requests"] });
    if (changeRequestId) {
      queryClient.invalidateQueries({ queryKey: ["data-admin", "change-request", changeRequestId] });
      queryClient.invalidateQueries({ queryKey: ["data-admin", "change-request-audit-log", changeRequestId] });
    }
    queryClient.invalidateQueries({ queryKey: ["data-admin", "ingestion-runs"] });
  };

  const createMutation = useMutation({
    mutationFn: (runId: string) => createDataAdminChangeRequest(runId),
    onSuccess: (payload) => {
      toast.success(`Change request creee pour ${payload.data.request.class_code}.`);
      setSelectedChangeRequestId(payload.data.request.change_request_id);
      invalidateAll(payload.data.request.change_request_id);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail ?? "Creation impossible.");
    },
  });

  const submitMutation = useMutation({
    mutationFn: (changeRequestId: string) => submitDataAdminChangeRequest(changeRequestId),
    onSuccess: (payload) => {
      toast.success(`Demande ${payload.data.request.request_status}.`);
      invalidateAll(payload.data.request.change_request_id);
    },
    onError: (error: any) => toast.error(error?.response?.data?.detail ?? "Soumission impossible."),
  });

  const approveMutation = useMutation({
    mutationFn: (changeRequestId: string) => approveDataAdminChangeRequest(changeRequestId),
    onSuccess: (payload) => {
      toast.success(`Demande ${payload.data.request.request_status}.`);
      invalidateAll(payload.data.request.change_request_id);
    },
    onError: (error: any) => toast.error(error?.response?.data?.detail ?? "Approbation impossible."),
  });

  const rejectMutation = useMutation({
    mutationFn: (changeRequestId: string) => rejectDataAdminChangeRequest(changeRequestId),
    onSuccess: (payload) => {
      toast.success(`Demande ${payload.data.request.request_status}.`);
      invalidateAll(payload.data.request.change_request_id);
    },
    onError: (error: any) => toast.error(error?.response?.data?.detail ?? "Rejet impossible."),
  });

  const applyMutation = useMutation({
    mutationFn: (changeRequestId: string) => applyDataAdminChangeRequest(changeRequestId),
    onSuccess: (payload) => {
      toast.success(`Demande ${payload.data.request.request_status}.`);
      invalidateAll(payload.data.request.change_request_id);
      queryClient.invalidateQueries({ queryKey: ["data-admin", "ingestion-run", payload.data.request.run_id] });
    },
    onError: (error: any) => toast.error(error?.response?.data?.detail ?? "Application impossible."),
  });

  const rollbackPrepareMutation = useMutation({
    mutationFn: (changeRequestId: string) => prepareDataAdminRollback(changeRequestId),
    onSuccess: (payload) => {
      toast.success(`Rollback ${payload.data.rollback_status}.`);
      invalidateAll(payload.data.change_request_id);
    },
    onError: (error: any) => toast.error(error?.response?.data?.detail ?? "Preparation rollback impossible."),
  });

  const rollbackRequestMutation = useMutation({
    mutationFn: (changeRequestId: string) => requestDataAdminRollback(changeRequestId),
    onSuccess: (payload) => {
      toast.success(`Rollback ${payload.data.rollback_status}.`);
      invalidateAll(payload.data.change_request_id);
    },
    onError: (error: any) => toast.error(error?.response?.data?.detail ?? "Demande rollback impossible."),
  });

  const rollbackApproveMutation = useMutation({
    mutationFn: (changeRequestId: string) => approveDataAdminRollback(changeRequestId),
    onSuccess: (payload) => {
      toast.success(`Rollback ${payload.data.rollback_status}.`);
      invalidateAll(payload.data.change_request_id);
    },
    onError: (error: any) => toast.error(error?.response?.data?.detail ?? "Approbation rollback impossible."),
  });

  const rollbackApplyMutation = useMutation({
    mutationFn: (changeRequestId: string) => applyDataAdminRollback(changeRequestId),
    onSuccess: (payload) => {
      toast.success(`Rollback ${payload.data.rollback_status}.`);
      invalidateAll(payload.data.change_request_id);
      queryClient.invalidateQueries({ queryKey: ["data-admin", "ingestion-run", payload.data.run_id] });
    },
    onError: (error: any) => toast.error(error?.response?.data?.detail ?? "Application rollback impossible."),
  });

  const canCreate =
    selectedRun !== null &&
    ["STAGED", "VALIDATED_WITH_WARNINGS"].includes(selectedRun.run_status) &&
    !changeRequestsQuery.data?.data.some((item) => item.run_id === selectedRun.run_id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitPullRequestCreateArrow className="h-5 w-5 text-blue-600" />
            Change request et promotion controlee
          </CardTitle>
          <CardDescription>
            Workflow <code>DRAFT -&gt; SUBMITTED -&gt; APPROVED -&gt; APPLIED</code> avec promotion <code>INSERT_ONLY</code> seulement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => selectedRun && createMutation.mutate(selectedRun.run_id)}
              disabled={!canCreate || createMutation.isPending}
            >
              <GitPullRequestCreateArrow className="mr-2 h-4 w-4" />
              {createMutation.isPending ? "Creation..." : "Creer demande de promotion"}
            </Button>
            <span className="text-xs text-slate-500">
              Run selectionne: {selectedRun ? `${selectedRun.class_code} / ${selectedRun.run_status}` : "aucun"}
            </span>
            <span className="text-xs text-slate-500">
              Role: {authContext.role} · {authContext.rbacStatus}
            </span>
          </div>

          <ScrollArea className="h-52 rounded-2xl border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Classe</TableHead>
                  <TableHead>Run</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Mode</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(changeRequestsQuery.data?.data ?? []).map((request) => (
                  <TableRow
                    key={request.change_request_id}
                    className={selectedChangeRequestId === request.change_request_id ? "bg-blue-50/70" : undefined}
                    onClick={() => setSelectedChangeRequestId(request.change_request_id)}
                  >
                    <TableCell className="text-xs font-medium text-slate-700">{request.class_code}</TableCell>
                    <TableCell className="text-xs text-slate-600">{request.run_id}</TableCell>
                    <TableCell className="text-xs text-slate-600">{request.request_status}</TableCell>
                    <TableCell className="text-xs text-slate-600">{request.promotion_mode}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <ChangeRequestDetail
        detail={detailQuery.data?.data ?? null}
        currentRole={authContext.role}
        rbacStatus={authContext.rbacStatus}
        onSubmit={() => selectedChangeRequestId && submitMutation.mutate(selectedChangeRequestId)}
        onApprove={() => selectedChangeRequestId && approveMutation.mutate(selectedChangeRequestId)}
        onReject={() => selectedChangeRequestId && rejectMutation.mutate(selectedChangeRequestId)}
        onApply={() => {
          if (!selectedChangeRequestId) return;
          const confirmed = window.confirm(
            "Cette action va écrire dans les tables métier. Confirmez-vous l'application contrôlée ?",
          );
          if (!confirmed) return;
          applyMutation.mutate(selectedChangeRequestId);
        }}
        onRollbackPrepare={() => selectedChangeRequestId && rollbackPrepareMutation.mutate(selectedChangeRequestId)}
        onRollbackRequest={() => selectedChangeRequestId && rollbackRequestMutation.mutate(selectedChangeRequestId)}
        onRollbackApprove={() => selectedChangeRequestId && rollbackApproveMutation.mutate(selectedChangeRequestId)}
        onRollbackApply={() => {
          if (!selectedChangeRequestId) return;
          const confirmed = window.confirm(
            "Cette action va annuler une promotion déjà appliquée et supprimer les lignes insérées par data_admin. Confirmez-vous ?",
          );
          if (!confirmed) return;
          rollbackApplyMutation.mutate(selectedChangeRequestId);
        }}
        canApproveRole={authContext.canApprove}
        canApplyRole={authContext.canApply}
        submitPending={submitMutation.isPending}
        approvePending={approveMutation.isPending}
        rejectPending={rejectMutation.isPending}
        applyPending={applyMutation.isPending}
        rollbackPreparePending={rollbackPrepareMutation.isPending}
        rollbackRequestPending={rollbackRequestMutation.isPending}
        rollbackApprovePending={rollbackApproveMutation.isPending}
        rollbackApplyPending={rollbackApplyMutation.isPending}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-600" />
            Audit log de promotion
          </CardTitle>
          <CardDescription>Traçabilité des actions create, submit, approve, reject et apply.</CardDescription>
        </CardHeader>
        <CardContent>
          <PromotionAuditLog entries={auditLogQuery.data?.data ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
