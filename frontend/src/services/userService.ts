import { api } from "@/api/client";

export type UserRole = {
  id: number;
  code: "viewer" | "manager" | "admin" | string;
  label: string;
  description?: string | null;
};

export type UserItem = {
  id: number;
  username: string;
  email: string;
  full_name?: string | null;
  role?: UserRole;
  is_active: boolean;
  must_change_password?: boolean;
  failed_login_attempts?: number;
  last_login_at?: string | null;
  last_login_ip?: string | null;
};

export type CreateUserPayload = {
  username: string;
  email: string;
  full_name?: string;
  password: string;
  role_code: string;
};

export type UpdateUserPayload = {
  username?: string;
  email?: string;
  full_name?: string;
  role_code?: string;
};

export async function listUsers(): Promise<UserItem[]> {
  const { data } = await api.get<UserItem[]>("/users");
  return data ?? [];
}

export async function createUser(payload: CreateUserPayload): Promise<UserItem> {
  const { data } = await api.post<UserItem>("/users", payload);
  return data;
}

export async function updateUser(userId: number, payload: UpdateUserPayload): Promise<UserItem> {
  const { data } = await api.put<UserItem>(`/users/${userId}`, payload);
  return data;
}

export async function updateUserStatus(userId: number, isActive: boolean): Promise<UserItem> {
  const { data } = await api.patch<UserItem>(`/users/${userId}/status`, { is_active: isActive });
  return data;
}

export async function resetUserPassword(userId: number, newPassword: string) {
  const { data } = await api.patch(`/users/${userId}/reset-password`, { new_password: newPassword });
  return data;
}

export async function deleteUser(userId: number) {
  const { data } = await api.delete(`/users/${userId}`);
  return data;
}
