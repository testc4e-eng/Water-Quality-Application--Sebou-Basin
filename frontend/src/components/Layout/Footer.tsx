import { Button } from "@/components/ui/button";
import { Mail, MapPin, Users, ArrowRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
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
  const isFullScreenDashboard =
    location.pathname === "/dashboard-2" ||
    location.pathname === "/dashboard" ||
    location.pathname === "/dashboard-cartographique";

  if (isFullScreenDashboard || isInstitutionalRoute) {
    return null;
  }

  if (!isHomePage) {
    return (
      <footer className="bg-primary px-6 py-3 text-center text-primary-foreground">
        <p className="text-sm text-primary-foreground/90">2026 WaterQual Sebou</p>
      </footer>
    );
  }

  return (
    <footer className="bg-primary px-6 py-6 text-primary-foreground">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Prêt à Commencer ?</h2>
        <p className="mx-auto mt-3 max-w-3xl text-sm text-primary-foreground/85 sm:text-base">
          Rejoignez notre plateforme pour accéder aux outils de monitoring les plus avancés
        </p>

        <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild variant="secondary" className="min-w-[170px] shadow-elegant">
            <NavLink to="/register">
              Créer un compte
              <ArrowRight className="ml-2 h-4 w-4" />
            </NavLink>
          </Button>
          <Button
            asChild
            variant="outline"
            className="min-w-[170px] border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <NavLink to="/contact">Nous contacter</NavLink>
          </Button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 text-sm text-primary-foreground/90 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2">
            <Mail className="h-5 w-5 text-secondary" />
            <span>c4e.africa@gmail.com</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <MapPin className="h-5 w-5 text-secondary" />
            <span>75 Boulevard d’Anfa, Casablanca</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Users className="h-5 w-5 text-secondary" />
            <span>Bureau d'étude spécialisé</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
