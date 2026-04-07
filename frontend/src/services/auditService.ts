import { api } from "@/api/client";

export interface ActivityLogItem {
  id: number;
  user_id: number | null;
  username: string | null;
  method: string;
  path: string;
  status_code: number;
  duration_ms: number;
  ip_address: string | null;
  user_agent: string | null;
  query_params: string | null;
  request_payload: string | null;
  created_at: string;
}

export interface AuthLogItem {
  id: number;
  user_id: number | null;
  username_attempted: string | null;
  action: string;
  status: string;
  ip_address: string | null;
  user_agent: string | null;
  details: string | null;
  created_at: string;
}

export async function listActivityLogs(limit: number = 200, username?: string): Promise<ActivityLogItem[]> {
  const params = new URLSearchParams();
  params.append("limit", limit.toString());
  if (username) params.append("username", username);
  
  const { data } = await api.get<ActivityLogItem[]>(`/security/logs/activity?${params.toString()}`);
  return data;
}

export async function listAuthLogs(limit: number = 200): Promise<AuthLogItem[]> {
  const { data } = await api.get<AuthLogItem[]>(`/security/logs/auth?limit=${limit}`);
  return data;
}
