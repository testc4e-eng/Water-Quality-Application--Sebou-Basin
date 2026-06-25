import { api } from "@/api/client";
import type {
  DataAdminClassCountResponse,
  DataAdminClassDetailResponse,
  DataAdminClassListResponse,
  DataAdminClassRecordsResponse,
  DataAdminClassSchemaResponse,
  DataAdminRecordsQuery,
} from "@/types/dataAdmin";

export async function getDataAdminClasses(): Promise<DataAdminClassListResponse> {
  const { data } = await api.get<DataAdminClassListResponse>("/data-admin/classes");
  return data;
}

export async function getDataAdminClass(classCode: string): Promise<DataAdminClassDetailResponse> {
  const { data } = await api.get<DataAdminClassDetailResponse>(`/data-admin/classes/${encodeURIComponent(classCode)}`);
  return data;
}

export async function getDataAdminClassSchema(classCode: string): Promise<DataAdminClassSchemaResponse> {
  const { data } = await api.get<DataAdminClassSchemaResponse>(
    `/data-admin/classes/${encodeURIComponent(classCode)}/schema`,
  );
  return data;
}

export async function getDataAdminClassCount(classCode: string): Promise<DataAdminClassCountResponse> {
  const { data } = await api.get<DataAdminClassCountResponse>(
    `/data-admin/classes/${encodeURIComponent(classCode)}/count`,
  );
  return data;
}

export async function getDataAdminClassRecords(
  classCode: string,
  query: DataAdminRecordsQuery = {},
): Promise<DataAdminClassRecordsResponse> {
  const { data } = await api.get<DataAdminClassRecordsResponse>(
    `/data-admin/classes/${encodeURIComponent(classCode)}/records`,
    {
      params: {
        limit: query.limit ?? 20,
        offset: query.offset ?? 0,
      },
    },
  );
  return data;
}
