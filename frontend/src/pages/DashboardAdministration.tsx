import { Shield, Users, KeyRound, FileCheck2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getDataAdminChangeRequests } from "@/api/dataAdminChangeRequests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAuthSession, getRoleDisplayName, hasPermission } from "@/lib/authz";
import { listResetRequests } from "@/services/passwordResetService";
import { listActivityLogs, listAuthLogs } from "@/services/auditService";
import { listUsers } from "@/services/userService";

function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return "N/D";
  return new Intl.NumberFormat("fr-MA").format(value);
}

export default function DashboardAdministration() {
  const auth = getAuthSession();
  const canManageUsers = hasPermission("security.users.manage", auth.permissions);
  const canReadLogs = hasPermission("security.logs.read", auth.permissions);
  const canReadDataAdmin = hasPermission("data_admin.audit.read", auth.permissions);

  const usersQuery = useQuery({
    queryKey: ["dashboard-administration", "users"],
    queryFn: listUsers,
    enabled: canManageUsers,
  });

  const resetRequestsQuery = useQuery({
    queryKey: ["dashboard-administration", "password-resets"],
    queryFn: () => listResetRequests("PENDING"),
    enabled: canManageUsers,
  });

  const activityLogsQuery = useQuery({
    queryKey: ["dashboard-administration", "activity-logs"],
    queryFn: () => listActivityLogs(20),
    enabled: canReadLogs,
  });

  const authLogsQuery = useQuery({
    queryKey: ["dashboard-administration", "auth-logs"],
    queryFn: () => listAuthLogs(20),
    enabled: canReadLogs,
  });

  const changeRequestsQuery = useQuery({
    queryKey: ["dashboard-administration", "change-requests"],
    queryFn: getDataAdminChangeRequests,
    enabled: canReadDataAdmin,
  });

  const users = usersQuery.data ?? [];
  const activeUsers = users.filter((user) => user.is_active).length;
  const criticalPermissions = useMemo(
    () => [
      "data_admin.audit.read",
      "security.users.manage",
      "security.password_reset.manage",
      "security.logs.read",
    ],
    [],
  );

  return (
    <main className="min-h-screen bg-[#EEF5FF] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-5">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status="OPERATIONNEL" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Administration / RBAC</span>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Gouvernance des accès et administration</h1>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Vue synthétique des rôles actifs, des permissions visibles côté session, des utilisateurs et de la
                traçabilité sécurité réellement exposée par l'application.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">Endpoints utilisés</div>
              <div className="mt-2 space-y-1 font-mono text-xs">
                <div>/api/v1/data-admin/*</div>
                <div>/api/v1/users/*</div>
                <div>/api/v1/admin/password-reset-requests/*</div>
                <div>/api/v1/security/logs/*</div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard title="Rôle courant" value={getRoleDisplayName(auth)} subtitle={auth.rbacStatus} icon={Shield} />
          <MetricCard title="Permissions actives" value={formatNumber(auth.permissions.length)} subtitle="Session authentifiée" icon={KeyRound} />
          <MetricCard title="Utilisateurs actifs" value={canManageUsers ? formatNumber(activeUsers) : "Accès restreint"} subtitle="Vue /users" icon={Users} />
          <MetricCard title="Resets en attente" value={canManageUsers ? formatNumber(resetRequestsQuery.data?.length) : "Accès restreint"} subtitle="Demandes mot de passe" icon={AlertTriangle} />
          <MetricCard title="Change requests" value={canReadDataAdmin ? formatNumber(changeRequestsQuery.data?.count) : "Accès restreint"} subtitle="Flux data-admin" icon={FileCheck2} />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_420px]">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Permissions critiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {criticalPermissions.map((permission) => {
                const granted = auth.permissions.includes(permission);
                return (
                  <div key={permission} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="font-mono text-sm text-slate-800">{permission}</div>
                    {granted ? (
                      <div className="flex items-center gap-2 text-sm text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        Visible
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-amber-700">
                        <AlertTriangle className="h-4 w-4" />
                        Non accordée
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Raccourcis expert</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Link className="block rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 hover:bg-slate-50" to="/admin/gestion-users">
                Utilisateurs & audit
              </Link>
              <Link className="block rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 hover:bg-slate-50" to="/admin/data-governance/audit">
                Gouvernance données
              </Link>
              <Link className="block rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 hover:bg-slate-50" to="/admin/password-resets">
                Réinitialisations mot de passe
              </Link>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <PanelBlock
            title="Utilisateurs"
            isAllowed={canManageUsers}
            isError={usersQuery.isError}
            empty={!usersQuery.isLoading && users.length === 0}
            lines={[
              `Total utilisateurs: ${formatNumber(users.length)}`,
              `Actifs: ${formatNumber(activeUsers)}`,
              users[0]?.email ? `Exemple visible: ${users[0].email}` : "Aucun utilisateur retourné",
            ]}
          />
          <PanelBlock
            title="Audit sécurité"
            isAllowed={canReadLogs}
            isError={activityLogsQuery.isError || authLogsQuery.isError}
            empty={!activityLogsQuery.isLoading && !authLogsQuery.isLoading && (activityLogsQuery.data?.rows.length ?? 0) === 0}
            lines={[
              `Logs API chargés: ${formatNumber(activityLogsQuery.data?.rows.length)}`,
              `Logs auth chargés: ${formatNumber(authLogsQuery.data?.length)}`,
              activityLogsQuery.data?.rows[0]?.path ? `Dernier path: ${activityLogsQuery.data.rows[0].path}` : "Aucun log récent remonté",
            ]}
          />
          <PanelBlock
            title="Workflow RBAC / data-admin"
            isAllowed={canReadDataAdmin}
            isError={changeRequestsQuery.isError}
            empty={!changeRequestsQuery.isLoading && (changeRequestsQuery.data?.count ?? 0) === 0}
            lines={[
              `Change requests: ${formatNumber(changeRequestsQuery.data?.count)}`,
              `Etat session RBAC: ${auth.rbacStatus}`,
              "L'ancienne page /admin/ingestion n'est plus la cible officielle.",
            ]}
          />
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof Shield;
}) {
  return (
    <Card className="border-slate-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</div>
            <div className="mt-2 text-2xl font-semibold text-slate-950">{value}</div>
            <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
          </div>
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PanelBlock({
  title,
  isAllowed,
  isError,
  empty,
  lines,
}: {
  title: string;
  isAllowed: boolean;
  isError: boolean;
  empty: boolean;
  lines: string[];
}) {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-slate-600">
        {!isAllowed ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            Accès refusé ou non accordé pour ce rôle. Le refus 401/403 fait partie du comportement attendu.
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
            Erreur de chargement API sur ce panneau.
          </div>
        ) : empty ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-slate-500">
            Aucun résultat disponible pour ce panneau.
          </div>
        ) : (
          lines.map((line) => (
            <div key={line} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              {line}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
