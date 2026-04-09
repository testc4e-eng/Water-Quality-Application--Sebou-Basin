/* frontend/src/components/Layout/Header.tsx */
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, PanelLeftClose, PanelLeftOpen, User, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type NavItem = { to: string; label: string };

type HeaderProps = {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
};

const Header = ({ sidebarCollapsed, onToggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();
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
        return "Admin";
      case "manager":
      case "gestionnaire":
        return "Gestionnaire";
      case "user":
        return "Utilisateur";
      default:
        return "Utilisateur";
    }
  };

  const roleLabel = useMemo(() => {
    if (!isAuthenticated) return null;
    if (isAdmin) return "Admin";
    const payload = decodeTokenPayload(accessToken);
    const role = payload?.role ?? payload?.user?.role ?? payload?.type ?? null;
    if (!role) return "Utilisateur";
    return getRoleLabel(String(role));
  }, [accessToken, isAdmin, isAuthenticated]);

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
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  }, [roleLabel]);

  const allNavItems: NavItem[] = [
    { to: "/", label: "Accueil" },
    { to: "/dashboard-cartographique", label: "Dashboard Cartographique" },
    { to: "/dashboard-analytique", label: "Dashboard Analytique" },
    { to: "/data", label: "Gestion Données" },
    { to: "/admin/data-scan", label: "Scan de données" },
    { to: "/about", label: "A propos" },
    { to: "/contact", label: "Contact" },
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
    [isAdmin, roleLower]
  );

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_email");
    localStorage.removeItem("is_superuser");
    navigate("/login");
  };

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
