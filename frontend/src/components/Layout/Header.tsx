/* frontend/src/components/Layout/Header.tsx */
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, PanelLeftClose, PanelLeftOpen, User, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

type NavItem = { to: string; label: string };

type HeaderProps = {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
};

const Header = ({ sidebarCollapsed, onToggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = localStorage.getItem("is_superuser") === "true";
  const isAuthenticated = !!localStorage.getItem("access_token");
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

  const getRoleLabel = (role?: string | null) => {
    switch ((role ?? "").toLowerCase()) {
      case "admin":
        return t("header.role_admin");
      case "manager":
      case "gestionnaire":
        return t("header.role_manager");
      case "user":
        return t("header.role_user");
      default:
        return t("header.role_user");
    }
  };

  const roleLabel = useMemo(() => {
    if (!isAuthenticated) return null;
    if (isAdmin) return t("header.role_admin");
    const payload = decodeTokenPayload(accessToken);
    const role = payload?.role ?? payload?.user?.role ?? payload?.type ?? null;
    if (!role) return t("header.role_user");
    return getRoleLabel(String(role));
  }, [accessToken, isAdmin, isAuthenticated, t]);

  const roleLower = useMemo(() => {
    if (isAdmin) return "admin";
    const payload = decodeTokenPayload(accessToken);
    const role = payload?.role ?? payload?.user?.role ?? payload?.type ?? null;
    return role ? String(role).toLowerCase() : null;
  }, [accessToken, isAdmin]);

  const roleBadgeClass = useMemo(() => {
    switch ((roleLabel ?? "").toLowerCase()) {
      case "admin":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "gestionnaire":
      case "manager":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  }, [roleLabel]);

  const allNavItems: NavItem[] = [
    { to: "/", label: t("nav.accueil") },
    { to: "/dashboard-cartographique", label: t("nav.dashboard_cartographique") },
    { to: "/dashboard-analytique", label: t("nav.dashboard_analytique") },
    { to: "/data", label: t("nav.gestion_donnees") },
    { to: "/admin/data-scan", label: t("nav.scan_donnees") },
    { to: "/about", label: t("nav.a_propos") },
    { to: "/contact", label: t("nav.contact") },
  ];

  const navItems = useMemo(
    () =>
      allNavItems.filter((item) => {
        if (isAdmin) return true;
        if (roleLower === "manager" || roleLower === "gestionnaire") {
          return [
            "/",
            "/dashboard-cartographique",
            "/dashboard-analytique",
            "/about",
            "/contact",
            "/data",
            "/admin/data-scan",
            "/admin/ingestion",
            "/admin/popup-rules",
          ].includes(item.to);
        }
        return [
          "/",
          "/dashboard-cartographique",
          "/dashboard-analytique",
          "/about",
          "/contact",
        ].includes(item.to);
      }),
    [allNavItems, isAdmin, roleLower]
  );

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_email");
    localStorage.removeItem("is_superuser");
    navigate("/login");
  };

  const currentLang = (i18n.resolvedLanguage ?? i18n.language ?? "fr").toLowerCase();
  const languageOptions = [
    { code: "fr", label: t("lang.fr") },
    { code: "en", label: t("lang.en") },
  ];

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  const renderLanguageSwitcher = (className?: string) => (
    <div className={["inline-flex items-center rounded-full border border-slate-200 bg-white/80 p-1", className ?? ""].join(" ")}>
      {languageOptions.map((lang) => {
        const isActive = currentLang === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => handleLanguageChange(lang.code)}
            className={[
              "rounded-full px-2.5 py-1 text-xs font-semibold transition",
              isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900",
            ].join(" ")}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );

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
              aria-label={sidebarCollapsed ? t("header.sidebar_show") : t("header.sidebar_hide")}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </Button>
            <NavLink to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Logo" className="h-10 w-auto rounded-xl" />
              </div>
              <div>
                <h1 className="font-roboto font-bold text-xl text-primary">WaterQual SEBOU</h1>
                <p className="text-xs text-muted-foreground">{t("header.system_subtitle")}</p>
              </div>
            </NavLink>
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            {renderLanguageSwitcher()}
            {!isAuthenticated ? (
              <>
                <Button variant="outline" asChild>
                  <NavLink to="/login">{t("header.login")}</NavLink>
                </Button>
                <Button asChild>
                  <NavLink to="/register">{t("header.register")}</NavLink>
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
                  {t("header.logout")}
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
              <div className="flex items-center justify-start pt-4 border-t border-border">
                {renderLanguageSwitcher()}
              </div>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                {!isAuthenticated ? (
                  <>
                    <Button variant="outline" asChild>
                      <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                        {t("header.login")}
                      </NavLink>
                    </Button>
                    <Button asChild>
                      <NavLink to="/register" onClick={() => setIsMenuOpen(false)}>
                        {t("header.register")}
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
                      {t("header.logout")}
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
