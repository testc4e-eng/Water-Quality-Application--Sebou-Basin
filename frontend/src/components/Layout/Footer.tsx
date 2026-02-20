/* frontend/src/components/Layout/Footer.tsx */
import { Droplets, Mail, MapPin, Phone } from "lucide-react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src="/logo.jpg" alt="Logo" className="h-10 w-auto" />
              <div>
                <h3 className="font-roboto font-bold text-xl">WaterQual SEBOU</h3>
                <p className="text-sm opacity-80">
                  Système d'aide à la décision
                </p>
              </div>
            </div>
            <p className="text-sm opacity-90 mb-4 max-w-md">
              Plateforme de monitoring et d'analyse de la qualité de l'eau,
              développée par C4E pour une gestion durable des ressources
              hydriques.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <nav className="flex flex-col space-y-2">
              <NavLink
                to="/"
                className="text-sm opacity-80 hover:opacity-100 transition-opacity"
              >
                Accueil
              </NavLink>
              <NavLink
                to="/dashboard"
                className="text-sm opacity-80 hover:opacity-100 transition-opacity"
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/dashboard-2"
                className="text-sm opacity-80 hover:opacity-100 transition-opacity"
              >
                Dashboard 2
              </NavLink>

              <NavLink to="/dashboard-swat"   
              className="text-sm opacity-80 hover:opacity-100 transition-opacity"
              >
              Dashboard Climat
              </NavLink>

              <NavLink to="/dashboard-climate"   
              className="text-sm opacity-80 hover:opacity-100 transition-opacity"
              >
              Analyse SWAT
              
              </NavLink>


              <NavLink
                to="/data"
                className="text-sm opacity-80 hover:opacity-100 transition-opacity"
              >
                Données brutes
              </NavLink>
              <NavLink
                to="/about"
                className="text-sm opacity-80 hover:opacity-100 transition-opacity"
              >
                À propos
              </NavLink>
              <NavLink
                to="/contact"
                className="text-sm opacity-80 hover:opacity-100 transition-opacity"
              >
                Contact
              </NavLink>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2 text-sm opacity-80">
                <Mail className="h-4 w-4" />
                <span>contact@hydroqual-dss.fr</span>
              </div>
              <div className="flex items-center space-x-2 text-sm opacity-80">
                <Phone className="h-4 w-4" />
                <span>+212 X XX XX XX XX</span>
              </div>
              <div className="flex items-center space-x-2 text-sm opacity-80">
                <MapPin className="h-4 w-4" />
                <span>Université de Recherche</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm opacity-80">
            © 2024 WaterQual SEBOU - C4E. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
