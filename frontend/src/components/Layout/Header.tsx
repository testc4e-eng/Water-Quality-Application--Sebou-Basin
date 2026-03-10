/* frontend/src/components/Layout/Header.tsx */
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type NavItem = { to: string; label: string };

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = localStorage.getItem("is_superuser") === "true";
  const isAuthenticated = !!localStorage.getItem("access_token");

  const allNavItems: NavItem[] = [
    { to: "/", label: "Accueil" },
    { to: "/dashboard-2", label: "Dashboard" },
    { to: "/dashboard-climate", label: "Dashboard Climate" },
    { to: "/data", label: "Donnees brutes" },
    { to: "/about", label: "A propos" },
    { to: "/contact", label: "Contact" },
  ];

  const navItems = useMemo(
    () =>
      allNavItems.filter((item) => {
        if (isAdmin) return true;
        return ["/", "/dashboard-2", "/dashboard-climate", "/about", "/contact"].includes(item.to);
      }),
    [isAdmin]
  );

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_email");
    localStorage.removeItem("is_superuser");
    navigate("/login");
  };

  return (
    <header className="bg-card border-b border-border shadow-card sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-2">
              <img src="/logo.jpg" alt="Logo" className="h-10 w-auto" />
            </div>
            <div>
              <h1 className="font-roboto font-bold text-xl text-primary">WaterQual SEBOU</h1>
              <p className="text-xs text-muted-foreground">Systeme d'aide a la decision</p>
            </div>
          </NavLink>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `font-medium transition-colors hover:text-primary relative ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
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
              <Button variant="outline" onClick={handleLogout}>
                Deconnexion
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
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
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    Deconnexion
                  </Button>
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
