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
  Shield,
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
  const allNavItems: NavItem[] = [
    { to: "/", label: "Accueil", icon: Home, group: "main" },
    { to: "/dashboard-cartographique", label: "Dashboard Cartographique", icon: Map, group: "main" },
    { to: "/dashboard-analytique", label: "Dashboard Analytique", icon: LineChart, group: "main" },
    { to: "/dashboard-scenarios", label: "Dashboard Scenarios", icon: Sparkles, group: "main" },
    { to: "/data", label: "Gestion Données", icon: Database, group: "admin" },
    { to: "/admin/data-scan", label: "Scan de données", icon: Search, group: "admin" },
    { to: "/admin/users", label: "Gestion utilisateurs", icon: Users, group: "admin" },
    { to: "/admin/ingestion", label: "Ingestion Scénarios", icon: CloudUpload, group: "admin" },
    { to: "/admin/audit", label: "Journal d'Audit", icon: Shield, group: "admin" },
    { to: "/admin/popup-rules", label: "Règles Popups", icon: MessageSquare, group: "admin" },
    { to: "/about", label: "A propos", icon: Info, group: "support" },
    { to: "/contact", label: "Contact", icon: Mail, group: "support" },
  ];

  const primaryItems = useMemo(
    () =>
      allNavItems.filter((item) => {
        if (isAdmin) return true;
        // Pour les non-admins, on filtre les pages d'administration sensibles
        return [
          "/",
          "/dashboard-cartographique",
          "/dashboard-analytique",
          "/dashboard-scenarios",
          "/about",
          "/contact",
          "/admin/data-scan",
        ].includes(item.to);
      }),
    [isAdmin]
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
