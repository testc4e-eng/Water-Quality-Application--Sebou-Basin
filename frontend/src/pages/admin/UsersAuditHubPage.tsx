import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import UserManagementPage from "./UserManagementPage";
import AuditLogsPage from "./AuditLogsPage";

type Mode = "users" | "audit";

export default function UsersAuditHubPage() {
  const { search } = useLocation();
  const mode = useMemo<Mode>(() => {
    const raw = (new URLSearchParams(search).get("mode") || "").toLowerCase();
    return raw === "audit" ? "audit" : "users";
  }, [search]);

  return mode === "users" ? <UserManagementPage /> : <AuditLogsPage />;
}

