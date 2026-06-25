import { api } from "@/api/client";
import type {
  DataAdminIngestionErrorsResponse,
  DataAdminIngestionRunDetailResponse,
  DataAdminIngestionRunsResponse,
  DataAdminIngestionStagingPreviewResponse,
  DataAdminIngestionUploadResponse,
  DataAdminValidationRulesResponse,
} from "@/types/dataAdmin";

export async function uploadDataAdminIngestionFile(
  classCode: string,
  file: File,
): Promise<DataAdminIngestionUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post<DataAdminIngestionUploadResponse>(
    `/data-admin/classes/${encodeURIComponent(classCode)}/ingestion/upload`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function getDataAdminIngestionRuns(): Promise<DataAdminIngestionRunsResponse> {
  const { data } = await api.get<DataAdminIngestionRunsResponse>("/data-admin/ingestion/runs");
  return data;
}

export async function getDataAdminIngestionRun(runId: string): Promise<DataAdminIngestionRunDetailResponse> {
  const { data } = await api.get<DataAdminIngestionRunDetailResponse>(
    `/data-admin/ingestion/runs/${encodeURIComponent(runId)}`,
  );
  return data;
}

export async function getDataAdminIngestionErrors(runId: string): Promise<DataAdminIngestionErrorsResponse> {
  const { data } = await api.get<DataAdminIngestionErrorsResponse>(
    `/data-admin/ingestion/runs/${encodeURIComponent(runId)}/errors`,
  );
  return data;
}

export async function getDataAdminIngestionStagingPreview(
  runId: string,
): Promise<DataAdminIngestionStagingPreviewResponse> {
  const { data } = await api.get<DataAdminIngestionStagingPreviewResponse>(
    `/data-admin/ingestion/runs/${encodeURIComponent(runId)}/staging-preview`,
  );
  return data;
}

export async function getDataAdminValidationRules(): Promise<DataAdminValidationRulesResponse> {
  const { data } = await api.get<DataAdminValidationRulesResponse>("/data-admin/validation-rules");
  return data;
}

export async function getDataAdminClassValidationRules(
  classCode: string,
): Promise<DataAdminValidationRulesResponse> {
  const { data } = await api.get<DataAdminValidationRulesResponse>(
    `/data-admin/classes/${encodeURIComponent(classCode)}/validation-rules`,
  );
  return data;
}
