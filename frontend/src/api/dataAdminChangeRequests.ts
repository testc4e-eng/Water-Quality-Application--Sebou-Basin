import api from "@/lib/api";
import type {
  DataAdminChangeRequestDetailResponse,
  DataAdminChangeRequestListResponse,
  DataAdminPromotionAuditLogResponse,
  DataAdminRollbackStatusResponse,
} from "@/types/dataAdmin";

type ChangeRequestPayload = {
  comments?: string | null;
};

export async function createDataAdminChangeRequest(runId: string, payload: ChangeRequestPayload = {}) {
  const { data } = await api.post<DataAdminChangeRequestDetailResponse>(
    `/data-admin/ingestion/runs/${encodeURIComponent(runId)}/change-request`,
    payload,
  );
  return data;
}

export async function getDataAdminChangeRequests() {
  const { data } = await api.get<DataAdminChangeRequestListResponse>("/data-admin/change-requests");
  return data;
}

export async function getDataAdminChangeRequest(changeRequestId: string) {
  const { data } = await api.get<DataAdminChangeRequestDetailResponse>(
    `/data-admin/change-requests/${encodeURIComponent(changeRequestId)}`,
  );
  return data;
}

export async function submitDataAdminChangeRequest(changeRequestId: string, payload: ChangeRequestPayload = {}) {
  const { data } = await api.post<DataAdminChangeRequestDetailResponse>(
    `/data-admin/change-requests/${encodeURIComponent(changeRequestId)}/submit`,
    payload,
  );
  return data;
}

export async function approveDataAdminChangeRequest(changeRequestId: string, payload: ChangeRequestPayload = {}) {
  const { data } = await api.post<DataAdminChangeRequestDetailResponse>(
    `/data-admin/change-requests/${encodeURIComponent(changeRequestId)}/approve`,
    payload,
  );
  return data;
}

export async function rejectDataAdminChangeRequest(changeRequestId: string, payload: ChangeRequestPayload = {}) {
  const { data } = await api.post<DataAdminChangeRequestDetailResponse>(
    `/data-admin/change-requests/${encodeURIComponent(changeRequestId)}/reject`,
    payload,
  );
  return data;
}

export async function applyDataAdminChangeRequest(changeRequestId: string, payload: ChangeRequestPayload = {}) {
  const { data } = await api.post<DataAdminChangeRequestDetailResponse>(
    `/data-admin/change-requests/${encodeURIComponent(changeRequestId)}/apply`,
    payload,
  );
  return data;
}

export async function getDataAdminChangeRequestAuditLog(changeRequestId: string) {
  const { data } = await api.get<DataAdminPromotionAuditLogResponse>(
    `/data-admin/change-requests/${encodeURIComponent(changeRequestId)}/audit-log`,
  );
  return data;
}

export async function prepareDataAdminRollback(changeRequestId: string, payload: ChangeRequestPayload = {}) {
  const { data } = await api.post<DataAdminRollbackStatusResponse>(
    `/data-admin/change-requests/${encodeURIComponent(changeRequestId)}/rollback/prepare`,
    payload,
  );
  return data;
}

export async function requestDataAdminRollback(changeRequestId: string, payload: ChangeRequestPayload = {}) {
  const { data } = await api.post<DataAdminRollbackStatusResponse>(
    `/data-admin/change-requests/${encodeURIComponent(changeRequestId)}/rollback/request`,
    payload,
  );
  return data;
}

export async function approveDataAdminRollback(changeRequestId: string, payload: ChangeRequestPayload = {}) {
  const { data } = await api.post<DataAdminRollbackStatusResponse>(
    `/data-admin/change-requests/${encodeURIComponent(changeRequestId)}/rollback/approve`,
    payload,
  );
  return data;
}

export async function applyDataAdminRollback(changeRequestId: string, payload: ChangeRequestPayload = {}) {
  const { data } = await api.post<DataAdminRollbackStatusResponse>(
    `/data-admin/change-requests/${encodeURIComponent(changeRequestId)}/rollback/apply`,
    payload,
  );
  return data;
}

export async function getDataAdminRollbackStatus(changeRequestId: string) {
  const { data } = await api.get<DataAdminRollbackStatusResponse>(
    `/data-admin/change-requests/${encodeURIComponent(changeRequestId)}/rollback/status`,
  );
  return data;
}
