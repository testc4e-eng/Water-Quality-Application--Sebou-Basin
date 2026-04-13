import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
  Database,
  LineChart,
  Home,
  Info,
  Map,
  Mail,
  Search,
  Sparkles,
  Users,
  CloudUpload,
  MessageSquare,
} from "lucide-react";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Home;
  group?: "main" | "admin" | "support";
};

type SidebarProps = {
  collapsed: boolean;
};

const Sidebar = ({ collapsed }: SidebarProps) => {
  const isAdmin = localStorage.getItem("is_superuser") === "true";
  const accessToken = localStorage.getItem("access_token");

  const decodeTokenPayload = (token: string | null) => {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    try {
      const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, "=");
      const json = atob(padded);
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  const roleFromToken = (() => {
    if (isAdmin) return "admin";
    const payload = decodeTokenPayload(accessToken);
    const role = payload?.role ?? payload?.user?.role ?? payload?.type ?? null;
    return role ? String(role).toLowerCase() : null;
  })();

  const canSeeAdmin = isAdmin;
  const isManager =
    roleFromToken === "manager" || roleFromToken === "gestionnaire";
  const allNavItems: NavItem[] = [
    { to: "/", label: "Accueil", icon: Home, group: "main" },
    { to: "/dashboard-cartographique", label: "Dashboard Cartographique", icon: Map, group: "main" },
    { to: "/dashboard-analytique", label: "Dashboard Analytique", icon: LineChart, group: "main" },
    { to: "/dashboard-scenarios", label: "Dashboard Scenarios", icon: Sparkles, group: "main" },
    { to: "/data", label: "Gestion Données", icon: Database, group: "admin" },
    { to: "/admin/data-scan", label: "Scan de données", icon: Search, group: "admin" },
    { to: "/admin/gestion-users", label: "Gestion Users", icon: Users, group: "admin" },
    { to: "/admin/ingestion", label: "Ingestion Scénarios", icon: CloudUpload, group: "admin" },
    { to: "/admin/popup-rules", label: "Gestion des couches", icon: MessageSquare, group: "admin" },
    { to: "/about", label: "A propos", icon: Info, group: "support" },
    { to: "/contact", label: "Contact", icon: Mail, group: "support" },
  ];

  const primaryItems = useMemo(
    () =>
      allNavItems.filter((item) => {
        if (canSeeAdmin) return true;
        if (isManager) {
          const managerAdminAllowed = [
            "/data",
            "/admin/data-scan",
            "/admin/ingestion",
            "/admin/popup-rules",
          ];
          return item.group !== "admin" || managerAdminAllowed.includes(item.to);
        }
        // Utilisateur: pas d'accès aux sections Administration
        return item.group !== "admin";
      }),
    [canSeeAdmin, isManager]
  );

  const supportItems = primaryItems.filter((item) => item.group === "support");
  const adminItems = primaryItems.filter((item) => item.group === "admin");
  const mainItems = primaryItems.filter((item) => item.group === "main");

  return (
    <aside
      className={[
        "hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:flex-col lg:border-r lg:border-slate-200 lg:bg-white",
        collapsed ? "lg:w-20" : "lg:w-72",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-[77px] items-center border-b border-slate-200",
          collapsed ? "px-3" : "px-5",
        ].join(" ")}
      >
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
            <img src="/logo.jpg" alt="Logo" className="h-6 w-6 rounded-full object-cover" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">WQDSS</h1>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                Sebou Basin
              </p>
            </div>
          )}
        </NavLink>
      </div>

      <div className={["flex flex-1 flex-col overflow-y-auto py-5", collapsed ? "px-2" : "px-4"].join(" ")}>
        <div className="space-y-6">
          {!collapsed && <p className="px-3 text-xs font-medium text-slate-500">Surveillance & Métiers</p>}
          <nav className="mt-4 space-y-1">
            {mainItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "flex items-center rounded-xl py-3 text-sm font-medium transition-colors",
                      collapsed ? "justify-center px-2" : "gap-3 px-3",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  <Icon className="h-4 w-4" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>

          <div>
            {adminItems.length > 0 && (
              <>
                {!collapsed && (
                  <p className="px-3 text-xs font-medium text-slate-500">Administration</p>
                )}
                <nav className="mt-3 space-y-1">
                  {adminItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                          [
                            "flex items-center rounded-xl py-3 text-sm font-medium transition-colors",
                            collapsed ? "justify-center px-2" : "gap-3 px-3",
                            isActive
                              ? "bg-blue-50 text-blue-700"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                          ].join(" ")
                        }
                      >
                        <Icon className="h-4 w-4" />
                        {!collapsed && <span>{item.label}</span>}
                      </NavLink>
                    );
                  })}
                </nav>
              </>
            )}
          </div>

          <div>
            {!collapsed && <p className="px-3 text-xs font-medium text-slate-500">Support</p>}
            <nav className="mt-3 space-y-1">
              {supportItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        "flex items-center rounded-xl py-3 text-sm font-medium transition-colors",
                        collapsed ? "justify-center px-2" : "gap-3 px-3",
                        isActive
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                      ].join(" ")
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
