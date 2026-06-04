import { NavLink, useLocation } from "react-router-dom";
import {
  AlertTriangle,
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
  ShieldCheck,
} from "lucide-react";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Home;
  group?: "decision" | "analyse" | "expert" | "modeles" | "administration" | "support";
};

type SidebarProps = {
  collapsed: boolean;
};

const Sidebar = ({ collapsed }: SidebarProps) => {
  const location = useLocation();
  const isAdmin = localStorage.getItem("is_superuser") === "true";
  const accessToken = localStorage.getItem("access_token");
  const isInstitutionalRoute =
    location.pathname === "/" ||
    location.pathname === "/accueil-sad" ||
    location.pathname === "/dashboard-carto-metier" ||
    location.pathname === "/dashboard-qualite-reglementaire" ||
    location.pathname === "/dashboard-pollution" ||
    location.pathname === "/analyses" ||
    location.pathname === "/expert" ||
    location.pathname === "/administration" ||
    location.pathname.startsWith("/admin/");

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
    { to: "/", label: "Accueil SAD", icon: Home, group: "decision" },
    { to: "/dashboard-carto-metier", label: "Carte Métier", icon: Map, group: "decision" },
    { to: "/dashboard-qualite-reglementaire", label: "Qualité des Eaux", icon: ShieldCheck, group: "decision" },
    { to: "/dashboard-pollution", label: "Pollution", icon: AlertTriangle, group: "decision" },
    { to: "/analyses", label: "Analyses", icon: LineChart, group: "analyse" },
    { to: "/expert", label: "Expert", icon: Sparkles, group: "expert" },
    { to: "/dashboard-scenarios", label: "Scénarios SWAT / WASP", icon: Sparkles, group: "modeles" },
    { to: "/administration", label: "Administration", icon: Database, group: "administration" },
    { to: "/data", label: "Données & référentiels", icon: Database, group: "administration" },
    { to: "/admin/data-scan", label: "Couverture & qualité data", icon: Search, group: "administration" },
    { to: "/admin/gestion-users", label: "Utilisateurs & audit", icon: Users, group: "administration" },
    { to: "/admin/ingestion", label: "Ingestion modèles", icon: CloudUpload, group: "administration" },
    { to: "/admin/popup-rules", label: "Popups & symbologie", icon: MessageSquare, group: "administration" },
    { to: "/about", label: "A propos", icon: Info, group: "support" },
    { to: "/contact", label: "Contact", icon: Mail, group: "support" },
  ];

  const primaryItems = allNavItems.filter((item) => {
    if (canSeeAdmin) return true;
    if (isManager) {
      const managerAdminAllowed = [
        "/data",
        "/admin/data-scan",
        "/admin/ingestion",
        "/admin/popup-rules",
      ];
      return item.group !== "administration" || managerAdminAllowed.includes(item.to);
    }
    // Utilisateur: pas d'accès aux sections Administration
    return item.group !== "administration";
  });

  const supportItems = primaryItems.filter((item) => item.group === "support");
  const navigationSections = [
    { title: "Décision", items: primaryItems.filter((item) => item.group === "decision") },
    { title: "Analyse", items: primaryItems.filter((item) => item.group === "analyse") },
    { title: "Expert", items: primaryItems.filter((item) => item.group === "expert") },
    { title: "Modèles", items: primaryItems.filter((item) => item.group === "modeles") },
    { title: "Administration", items: primaryItems.filter((item) => item.group === "administration") },
  ].filter((section) => section.items.length > 0);

  if (isInstitutionalRoute) {
    const homeItems = allNavItems.filter((item) =>
      [
        "/",
        "/dashboard-carto-metier",
        "/dashboard-qualite-reglementaire",
        "/dashboard-pollution",
        "/analyses",
        "/expert",
        "/administration",
      ].includes(item.to)
    );

    return (
      <aside
        className={[
          "hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:flex-col lg:border-r lg:border-[#12305f] lg:bg-[linear-gradient(180deg,#071E41_0%,#092956_55%,#0B234A_100%)]",
          collapsed ? "lg:w-20" : "lg:w-60",
        ].join(" ")}
      >
        <div className={["flex items-center border-b border-white/10 py-4", collapsed ? "justify-center px-3" : "px-4"].join(" ")}>
          <NavLink to="/" className="flex items-center gap-3 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B4FD8] shadow-[0_14px_28px_rgba(11,79,216,0.35)]">
              <img src="/logo.jpg" alt="Logo" className="h-6 w-6 rounded-full object-cover" />
            </div>
            {!collapsed && (
              <div>
                <div className="text-xl font-bold tracking-tight">WaterQuality</div>
                <div className="text-lg font-bold tracking-tight text-[#4EA2FF]">SEBOU</div>
              </div>
            )}
          </NavLink>
        </div>

        <div className={["flex flex-1 flex-col justify-between py-4", collapsed ? "px-2" : "px-3"].join(" ")}>
          <nav className="space-y-1.5">
            {homeItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "flex items-center rounded-2xl py-2.5 text-sm font-medium transition-all",
                      collapsed ? "justify-center px-2" : "gap-3 px-4",
                      isActive
                        ? "bg-[#0B4FD8] text-white shadow-[0_12px_30px_rgba(11,79,216,0.35)]"
                        : "text-slate-200 hover:bg-white/8 hover:text-white",
                    ].join(" ")
                  }
                >
                  <Icon className="h-5 w-5" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>

          <div className="space-y-3">
            {collapsed ? (
              <>
                <div className="flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
                    ↻
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xs font-bold text-white">
                    ABH
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-200">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-300">Données actualisées</div>
                  <div className="mt-1.5 text-sm font-semibold text-white">Il y a 30 min</div>
                  <div className="mt-1 text-[11px] text-slate-300">Flux opérationnel en supervision continue.</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white">
                  <div className="text-base font-bold tracking-tight">ABH</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">
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
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}

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
