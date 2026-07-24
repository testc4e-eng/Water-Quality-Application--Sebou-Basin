import { NavLink, useLocation } from "react-router-dom";
import {
  AlertTriangle,
  Database,
  FlaskConical,
  Home,
  Map,
  ShieldCheck,
  BriefcaseBusiness,
} from "lucide-react";
import { getAuthSession, hasPermission } from "@/lib/authz";
import { StatusBadge, type DashboardStatus } from "@/components/ui/status-badge";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Home;
  status: DashboardStatus;
  group?: "decision" | "administration";
};

type SidebarProps = {
  collapsed: boolean;
};

const Sidebar = ({ collapsed }: SidebarProps) => {
  const location = useLocation();
  const auth = getAuthSession();
  const isAdmin = auth.isSuperuser;
  const isInstitutionalRoute =
    location.pathname === "/" ||
    location.pathname === "/accueil-sad" ||
    location.pathname === "/dashboard-carto-metier" ||
    location.pathname === "/dashboard-qualite-reglementaire" ||
    location.pathname === "/dashboard-pollution" ||
    location.pathname === "/dashboard-pollution-campagnes" ||
    location.pathname === "/dashboard-data-qa" ||
    location.pathname === "/administration" ||
    location.pathname.startsWith("/admin/");

  const canViewDataAdmin = hasPermission("data_admin.audit.read", auth.permissions);
  const canSeeAdmin = isAdmin;
  const allNavItems: NavItem[] = [
    { to: "/", label: "Accueil DG", icon: Home, status: "OPERATIONNEL", group: "decision" },
    { to: "/dashboard-qualite-reglementaire", label: "Qualité des eaux", icon: ShieldCheck, status: "PREPROD_CONDITIONNEL", group: "decision" },
    { to: "/dashboard-carto-metier", label: "Carte Métier", icon: Map, status: "PARTIEL", group: "decision" },
    { to: "/dashboard-pollution", label: "Pollution", icon: AlertTriangle, status: "DEV", group: "decision" },
    { to: "/dashboard-pollution-campagnes", label: "Pollution — Campagnes", icon: FlaskConical, status: "DEV", group: "decision" },
    { to: "/dashboard-data-qa", label: "Données / QA", icon: Database, status: "OPERATIONNEL", group: "decision" },
    { to: "/administration", label: "Administration", icon: BriefcaseBusiness, status: "OPERATIONNEL", group: "administration" },
  ];

  const primaryItems = allNavItems.filter((item) => {
    if (canSeeAdmin) return true;
    if (canViewDataAdmin) {
      const managerAdminAllowed = ["/administration"];
      return item.group !== "administration" || managerAdminAllowed.includes(item.to);
    }
    return item.to !== "/administration";
  });

  const navigationSections = [
    { title: "Décision", items: primaryItems.filter((item) => item.group === "decision") },
    { title: "Administration", items: primaryItems.filter((item) => item.group === "administration") },
  ].filter((section) => section.items.length > 0);

  if (isInstitutionalRoute) {
    const homeItems = allNavItems.filter((item) =>
      [
        "/",
        "/dashboard-qualite-reglementaire",
        "/dashboard-carto-metier",
        "/dashboard-pollution",
        "/dashboard-pollution-campagnes",
        "/dashboard-data-qa",
        "/administration",
      ].includes(item.to)
    );

    return (
      <aside
        className={[
          "hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:flex-col lg:border-r lg:border-[#12305f] lg:bg-[linear-gradient(180deg,#071E41_0%,#092956_55%,#0B234A_100%)]",
          collapsed ? "lg:w-[56px]" : "lg:w-[188px]",
        ].join(" ")}
      >
        <div className={["flex items-center border-b border-white/10 py-2", collapsed ? "justify-center px-1.5" : "px-2.5"].join(" ")}>
          <NavLink to="/" className="flex items-center gap-3 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[#0B4FD8] shadow-[0_14px_28px_rgba(11,79,216,0.35)]">
              <img src="/logo.jpg" alt="Logo" className="h-4.5 w-4.5 rounded-full object-cover" />
            </div>
            {!collapsed && (
              <div>
                    <div className="text-[15px] font-bold tracking-tight">WaterQuality</div>
                    <div className="text-[13px] font-bold tracking-tight text-[#4EA2FF]">SEBOU</div>
                  </div>
                )}
          </NavLink>
        </div>

        <div className={["flex flex-1 flex-col justify-between py-1.5", collapsed ? "px-1" : "px-2"].join(" ")}>
          <nav className="space-y-0.5">
            {homeItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "flex items-center rounded-2xl py-1.5 text-[13px] font-medium transition-all",
                      collapsed ? "justify-center px-1.5" : "gap-2.5 px-3",
                      isActive
                        ? "bg-[#0B4FD8] text-white shadow-[0_12px_30px_rgba(11,79,216,0.35)]"
                        : "text-slate-200 hover:bg-white/8 hover:text-white",
                    ].join(" ")
                  }
                >
                  <Icon className="h-4 w-4" />
                  {!collapsed && (
                    <div className="flex min-w-0 items-center justify-between gap-2">
                      <span className="truncate">{item.label}</span>
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="space-y-2 max-[900px]:space-y-0">
            {collapsed ? (
              <>
                <div className="flex justify-center">
                  <div className="flex h-6 w-6 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[10px] text-white">
                    ↻
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="flex h-6 w-6 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[8px] font-bold text-white">
                    ABH
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-200 max-[950px]:hidden">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-slate-300">Données actualisées</div>
                  <div className="mt-1 text-xs font-semibold text-white">Il y a 30 min</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-2 text-white max-[950px]:hidden">
                  <div className="text-xs font-bold tracking-tight">ABH</div>
                  <div className="mt-1 text-[9px] uppercase tracking-[0.16em] text-slate-300">
                    Agence du Bassin Hydraulique du Sebou
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    );
  }

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
          {navigationSections.map((section) => (
            <div key={section.title}>
              {!collapsed && <p className="px-3 text-xs font-medium text-slate-500">{section.title}</p>}
              <nav className="mt-3 space-y-1">
                {section.items.map((item) => {
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
                      {!collapsed && (
                        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                          <span className="truncate">{item.label}</span>
                          <StatusBadge status={item.status} className="shrink-0 text-[10px]" />
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
