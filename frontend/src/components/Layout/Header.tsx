/* frontend/src/components/Layout/Header.tsx */
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, PanelLeftClose, PanelLeftOpen, SunMedium, User, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { clearAuthSession, getAuthSession, getRoleDisplayName, hasPermission } from "@/lib/authz";

type NavItem = { to: string; label: string };

type HeaderProps = {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
};

const Header = ({ sidebarCollapsed, onToggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isInstitutionalRoute =
    location.pathname === "/" ||
    location.pathname === "/accueil-sad" ||
    location.pathname === "/dashboard-carto-metier" ||
    location.pathname === "/dashboard-qualite-reglementaire" ||
    location.pathname === "/dashboard-pollution" ||
    location.pathname === "/dashboard-data-qa" ||
    location.pathname === "/administration" ||
    location.pathname.startsWith("/admin/");

  const auth = getAuthSession();
  const isAdmin = auth.isSuperuser;
  const isAuthenticated = !!auth.accessToken;

  const roleLabel = useMemo(() => {
    if (!isAuthenticated) return null;
    return getRoleDisplayName(auth);
  }, [auth, isAuthenticated]);

  const roleLower = useMemo(() => {
    return auth.role ? String(auth.role).toLowerCase() : null;
  }, [auth.role]);

  const roleBadgeClass = useMemo(() => {
    switch ((roleLabel ?? "").toLowerCase()) {
      case "admin":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "gestionnaire":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  }, [roleLabel]);

  const allNavItems: NavItem[] = [
    { to: "/", label: "Accueil DG" },
    { to: "/dashboard-qualite-reglementaire", label: "Qualité des eaux" },
    { to: "/dashboard-carto-metier", label: "Carte Métier" },
    { to: "/dashboard-pollution", label: "Pollution" },
    { to: "/dashboard-data-qa", label: "Données / QA" },
    { to: "/administration", label: "Administration" },
  ];

  const navItems = useMemo(
    () =>
      allNavItems.filter((item) => {
        if (isAdmin) return true;
        const canUseDataAdmin = hasPermission("data_admin.audit.read", auth.permissions);
        const canUseLegacyData = hasPermission("security.users.manage", auth.permissions);
        if (canUseDataAdmin) {
          return [
            "/",
            "/dashboard-qualite-reglementaire",
            "/dashboard-carto-metier",
            "/dashboard-pollution",
            "/dashboard-data-qa",
            ...(canUseLegacyData ? ["/administration"] : []),
          ].includes(item.to);
        }
        return ["/", "/dashboard-qualite-reglementaire", "/dashboard-carto-metier", "/dashboard-pollution", "/dashboard-data-qa"].includes(item.to);
      }),
    [auth.permissions, isAdmin, roleLower]
  );

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  const operationalDateTime = useMemo(
    () =>
      new Intl.DateTimeFormat("fr-MA", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
    []
  );

  if (isInstitutionalRoute) {
    return (
      <header className="sticky top-0 z-40 border-b border-[#18396d] bg-[linear-gradient(90deg,#071E41_0%,#0A2B5F_45%,#0C3778_100%)] shadow-lg">
        <div className="px-3 py-1 sm:px-4">
          <div className="flex flex-col gap-0.5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hidden h-6 w-6 border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white lg:inline-flex"
                onClick={onToggleSidebar}
                aria-label={sidebarCollapsed ? "Afficher la sidebar" : "Masquer la sidebar"}
              >
                {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </Button>
              <NavLink to="/" className="flex items-center gap-2 rounded-2xl px-1 py-0.5 text-white transition-opacity hover:opacity-90">
                <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-[#0B4FD8] shadow-[0_10px_20px_rgba(11,79,216,0.35)]">
                  <img src="/logo.jpg" alt="Logo" className="h-4 w-4 rounded-full object-cover" />
                </div>
                <div>
                  <h1 className="text-[1rem] font-bold tracking-tight text-white">
                    WaterQuality <span className="text-[#4EA2FF]">SEBOU</span>
                  </h1>
                  <p className="hidden text-[7px] uppercase tracking-[0.08em] text-slate-200/90 2xl:block">
                    Plateforme intégrée de gestion du bassin du Sebou
                  </p>
                </div>
              </NavLink>
            </div>

            <div className="flex-1 px-0 text-left xl:px-4 xl:text-center">
              <div className="text-[0.95rem] font-bold tracking-tight text-white xl:text-[1.12rem]">
                PILOTER AUJOURD’HUI, PRÉSERVER DEMAIN
              </div>
              <div className="hidden text-[9px] text-slate-200 2xl:block">
                Système d’Aide à la Décision pour une gestion durable des ressources en eau
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/8 px-2 py-0.5 text-[10px] text-white backdrop-blur">
                <span>{operationalDateTime}</span>
              </div>
              <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/8 px-2 py-0.5 text-[10px] text-white backdrop-blur">
                <SunMedium className="h-2.5 w-2.5 text-amber-300" />
                <span>24°C</span>
                <span className="text-slate-300">Rabat</span>
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-white/10 text-[10px] font-semibold text-white">
                DG
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex"
              onClick={onToggleSidebar}
              aria-label={sidebarCollapsed ? "Afficher la sidebar" : "Masquer la sidebar"}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </Button>
            <NavLink to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Logo" className="h-10 w-auto rounded-xl" />
              </div>
              <div>
                <h1 className="font-roboto font-bold text-xl text-primary">WaterQual SEBOU</h1>
                <p className="text-xs text-muted-foreground">Systeme d'aide a la decision</p>
              </div>
            </NavLink>
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <Button variant="outline" asChild>
                  <NavLink to="/login">Connexion</NavLink>
                </Button>
                <Button asChild>
                  <NavLink to="/register">Inscription</NavLink>
                </Button>
              </>
            ) : (
              <>
                {roleLabel && (
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${roleBadgeClass}`}>
                    <User className="h-3.5 w-3.5" /> {roleLabel}
                  </span>
                )}
                <Button variant="outline" onClick={handleLogout}>
                  Deconnexion
                </Button>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden mt-4 border-t border-border pb-4 pt-4">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `font-medium transition-colors hover:text-primary py-2 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                {!isAuthenticated ? (
                  <>
                    <Button variant="outline" asChild>
                      <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                        Connexion
                      </NavLink>
                    </Button>
                    <Button asChild>
                      <NavLink to="/register" onClick={() => setIsMenuOpen(false)}>
                        Inscription
                      </NavLink>
                    </Button>
                  </>
                ) : (
                  <>
                    {roleLabel && (
                      <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${roleBadgeClass}`}>
                        <User className="h-3.5 w-3.5" /> {roleLabel}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      Deconnexion
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
