import { api } from "@/api/client";
import type { DataAdminTemplateSpecResponse } from "@/types/dataAdmin";

export async function getDataAdminTemplateSpec(classCode: string): Promise<DataAdminTemplateSpecResponse> {
  const { data } = await api.get<DataAdminTemplateSpecResponse>(
    `/data-admin/classes/${encodeURIComponent(classCode)}/template/spec`,
  );
  return data;
}

export async function generateDataAdminTemplate(
  classCode: string,
  options?: { format?: "xlsx" | "csv"; generatedBy?: string },
): Promise<{ blob: Blob; filename: string }> {
  const response = await api.post(
    `/data-admin/classes/${encodeURIComponent(classCode)}/template/generate`,
    {
      format: options?.format ?? "xlsx",
      generated_by: options?.generatedBy ?? "data_admin_ui",
    },
    {
      responseType: "blob",
    },
  );

  const disposition = response.headers["content-disposition"] ?? "";
  const match = disposition.match(/filename=\"?([^"]+)\"?/i);
  return {
    blob: response.data as Blob,
    filename: match?.[1] ?? `${classCode.toLowerCase()}_template.${options?.format ?? "xlsx"}`,
  };
}
