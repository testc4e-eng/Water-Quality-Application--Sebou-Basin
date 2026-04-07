import { api } from "@/api/client";

export type ResetRequestItem = {
  id: number;
  user_id?: number | null;
  username_requested?: string | null;
  email_requested?: string | null;
  status: string;
  requested_at: string;
  processed_at?: string | null;
  processed_by?: number | null;
  notes?: string | null;
};

export async function forgotPassword(usernameOrEmail: string) {
  const { data } = await api.post("/auth/forgot-password", {
    username_or_email: usernameOrEmail,
  });
  return data;
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const { data } = await api.post("/auth/change-password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return data;
}

export async function listResetRequests(status?: string) {
  const { data } = await api.get<ResetRequestItem[]>("/admin/password-reset-requests", {
    params: status ? { status } : undefined,
  });
  return data ?? [];
}

export async function approveResetRequest(id: number, notes?: string) {
  const { data } = await api.patch(`/admin/password-reset-requests/${id}/approve`, { notes });
  return data as { status: string; temporary_password: string };
}

export async function rejectResetRequest(id: number, notes?: string) {
  const { data } = await api.patch(`/admin/password-reset-requests/${id}/reject`, { notes });
  return data;
}

export async function adminForceResetUser(userId: number) {
  const { data } = await api.patch(`/admin/users/${userId}/reset-password`);
  return data as { status: string; temporary_password: string };
}
