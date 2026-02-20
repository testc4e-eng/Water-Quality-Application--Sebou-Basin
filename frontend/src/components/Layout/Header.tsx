/* frontend/src/components/Layout/Header.tsx */
import { NavLink } from "react-router-dom";
import { Droplets, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Accueil" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/dashboard-2", label: "Dashboard 2" },
    { to: "/dashboard-climate", label: "Dashboard Climate" },
    { to: "/data", label: "Données brutes" },
    { to: "/about", label: "À propos" },
    { to: "/contact", label: "Contact" },

  ];

  return (
    <header className="bg-card border-b border-border shadow-card sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <img src="/logo.jpg" alt="Logo" className="h-10 w-auto" />
            </div>
            <div>
              <h1 className="font-roboto font-bold text-xl text-primary">
                WaterQual SEBOU
              </h1>
              <p className="text-xs text-muted-foreground">
                Système d'aide à la décision
              </p>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
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

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" asChild>
              <NavLink to="/login">Connexion</NavLink>
            </Button>
            <Button asChild>
              <NavLink to="/register">Inscription</NavLink>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
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
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
