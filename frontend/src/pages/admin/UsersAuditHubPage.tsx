import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Shield } from "lucide-react";
import UserManagementPage from "./UserManagementPage";
import AuditLogsPage from "./AuditLogsPage";

type Mode = "users" | "audit";

export default function UsersAuditHubPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = useMemo<Mode>(() => {
    const raw = (searchParams.get("mode") || "").toLowerCase();
    return raw === "audit" ? "audit" : "users";
  }, [searchParams]);

  const switchMode = (nextMode: Mode) => {
    const next = new URLSearchParams(searchParams);
    next.set("mode", nextMode);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="space-y-3">
      <section className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mb-2 text-2xl font-bold text-slate-900">Gestion Users</div>
        <p className="mb-4 text-sm text-slate-500">
          Basculer entre la gestion des utilisateurs et le journal d'audit.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={mode === "users" ? "default" : "outline"}
            onClick={() => switchMode("users")}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Gestion des utilisateurs
          </Button>
          <Button
            variant={mode === "audit" ? "default" : "outline"}
            onClick={() => switchMode("audit")}
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            Journal & Audit
          </Button>
        </div>
      </section>

      {mode === "users" ? <UserManagementPage /> : <AuditLogsPage />}
    </div>
  );
}

