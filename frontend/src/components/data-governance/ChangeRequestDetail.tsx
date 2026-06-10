import { CheckCircle2, Clock3, Send, ShieldAlert, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DataAdminChangeRequestDetail as ChangeRequestDetailModel } from "@/types/dataAdmin";

type ChangeRequestDetailProps = {
  detail: ChangeRequestDetailModel | null;
  currentRole: string;
  rbacStatus: string;
  onSubmit: () => void;
  onApprove: () => void;
  onReject: () => void;
  onApply: () => void;
  onRollbackPrepare: () => void;
  onRollbackRequest: () => void;
  onRollbackApprove: () => void;
  onRollbackApply: () => void;
  canApproveRole: boolean;
  canApplyRole: boolean;
  submitPending?: boolean;
  approvePending?: boolean;
  rejectPending?: boolean;
  applyPending?: boolean;
  rollbackPreparePending?: boolean;
  rollbackRequestPending?: boolean;
  rollbackApprovePending?: boolean;
  rollbackApplyPending?: boolean;
};

export function ChangeRequestDetail({
  detail,
  currentRole,
  rbacStatus,
  onSubmit,
  onApprove,
  onReject,
  onApply,
  onRollbackPrepare,
  onRollbackRequest,
  onRollbackApprove,
  onRollbackApply,
  canApproveRole,
  canApplyRole,
  submitPending = false,
  approvePending = false,
  rejectPending = false,
  applyPending = false,
  rollbackPreparePending = false,
  rollbackRequestPending = false,
  rollbackApprovePending = false,
  rollbackApplyPending = false,
}: ChangeRequestDetailProps) {
  if (!detail) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Detail de la demande</CardTitle>
          <CardDescription>Selectionner une demande de promotion pour voir ses items et son workflow.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { request, items } = detail;
  const canSubmit = request.request_status === "DRAFT";
  const canApprove = canApproveRole && ["SUBMITTED", "UNDER_REVIEW"].includes(request.request_status);
  const canReject = canApproveRole && ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED"].includes(request.request_status);
  const canApply = canApplyRole && request.request_status === "APPROVED";
  const rollbackItems = Array.isArray(request.rollback_reference?.items)
    ? (request.rollback_reference?.items as unknown[])
    : [];
  const rollbackTarget = request.rollback_reference
    ? `${String(request.rollback_reference.target_schema ?? "")}.${String(request.rollback_reference.target_table ?? "")}`
    : "n/a";
  const canRollbackPrepare = request.request_status === "APPLIED" && ["NOT_PREPARED", "FAILED"].includes(request.rollback_status);
  const canRollbackRequest = canApproveRole && request.rollback_status === "READY";
  const canRollbackApprove = canApproveRole && request.rollback_status === "REQUESTED";
  const canRollbackApply = canApplyRole && request.rollback_status === "APPROVED";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-blue-600" />
          Change request {request.class_code}
        </CardTitle>
        <CardDescription>
          Mode {request.promotion_mode} uniquement. Les actions sont bornees par permissions réelles et l’acteur provient de l’utilisateur authentifié.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Statut</div>
            <div className="mt-2 text-lg font-bold text-slate-950">{request.request_status}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Run</div>
            <div className="mt-2 text-sm font-semibold text-slate-950">{request.run_id}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Items</div>
            <div className="mt-2 text-lg font-bold text-slate-950">{items.length}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Demandeur</div>
            <div className="mt-2 text-sm font-semibold text-slate-950">{request.requested_by}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Rollback</div>
            <div className="mt-2 text-lg font-bold text-slate-950">{request.rollback_status}</div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Role courant</div>
            <div className="mt-2 text-sm font-semibold text-slate-950">{currentRole}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Statut RBAC</div>
            <div className="mt-2 text-sm font-semibold text-slate-950">{rbacStatus}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={onSubmit} disabled={!canSubmit || submitPending}>
            <Send className="mr-2 h-4 w-4" />
            {submitPending ? "Soumission..." : "Soumettre"}
          </Button>
          <Button onClick={onApprove} disabled={!canApprove || approvePending} variant="secondary">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {approvePending ? "Approbation..." : "Approuver"}
          </Button>
          <Button onClick={onReject} disabled={!canReject || rejectPending} variant="outline">
            <XCircle className="mr-2 h-4 w-4" />
            {rejectPending ? "Rejet..." : "Rejeter"}
          </Button>
          <Button onClick={onApply} disabled={!canApply || applyPending}>
            <Clock3 className="mr-2 h-4 w-4" />
            {applyPending ? "Application..." : "Appliquer"}
          </Button>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Rollback logique</div>
          <div className="mt-2 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <div className="text-xs text-amber-700">Disponible</div>
              <div className="text-sm font-semibold text-slate-950">{request.rollback_available ? "true" : "false"}</div>
            </div>
            <div>
              <div className="text-xs text-amber-700">Table cible</div>
              <div className="text-sm font-semibold text-slate-950">{rollbackTarget}</div>
            </div>
            <div>
              <div className="text-xs text-amber-700">Items rollbackables</div>
              <div className="text-sm font-semibold text-slate-950">{rollbackItems.length}</div>
            </div>
            <div>
              <div className="text-xs text-amber-700">Role requis apply</div>
              <div className="text-sm font-semibold text-slate-950">DATA_ADMIN / SYS_ADMIN</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={onRollbackPrepare} disabled={!canRollbackPrepare || rollbackPreparePending} variant="outline">
              {rollbackPreparePending ? "Preparation..." : "Preparer rollback"}
            </Button>
            <Button onClick={onRollbackRequest} disabled={!canRollbackRequest || rollbackRequestPending} variant="outline">
              {rollbackRequestPending ? "Demande..." : "Demander rollback"}
            </Button>
            <Button onClick={onRollbackApprove} disabled={!canRollbackApprove || rollbackApprovePending} variant="outline">
              {rollbackApprovePending ? "Approbation..." : "Approuver rollback"}
            </Button>
            <Button onClick={onRollbackApply} disabled={!canRollbackApply || rollbackApplyPending} variant="destructive">
              {rollbackApplyPending ? "Rollback..." : "Appliquer rollback"}
            </Button>
          </div>
        </div>

        <ScrollArea className="h-72 rounded-2xl border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Statut</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Cible</TableHead>
                <TableHead>Payload normalise</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.item_id}>
                  <TableCell className="text-xs text-slate-700">
                    <Badge variant={item.item_status === "APPLIED" ? "default" : item.item_status === "FAILED" ? "destructive" : "secondary"}>
                      {item.item_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">{item.promotion_action}</TableCell>
                  <TableCell className="text-xs text-slate-600">{item.target_schema}.{item.target_table}</TableCell>
                  <TableCell className="max-w-[420px] text-xs text-slate-500">
                    <pre className="whitespace-pre-wrap break-words">{JSON.stringify(item.normalized_payload, null, 2)}</pre>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
