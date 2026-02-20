/*frontend/src/pages/LandingPage.tsx*/
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import { 
  Droplets, 
  BarChart3, 
  Shield, 
  Zap, 
  Users, 
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Globe,
  Activity
} from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: Activity,
      title: "Monitoring Temps Réel",
      description: "Surveillance continue de la qualité de l'eau avec des capteurs IoT de pointe"
    },
    {
      icon: BarChart3,
      title: "Analyse Prédictive",
      description: "Algorithmes d'IA pour anticiper les risques et optimiser la gestion"
    },
    {
      icon: Globe,
      title: "Cartographie Interactive",
      description: "Visualisation géospatiale des bassins hydrographiques en temps réel"
    },
    {
      icon: TrendingUp,
      title: "Rapports Automatisés",
      description: "Génération de rapports conformes aux standards APA/ISO"
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Marie Dubois",
      role: "Directrice Scientifique",
      description: "Spécialiste en hydrochimie et modélisation environnementale"
    },
    {
      name: "Prof. Jean Martin",
      role: "Chef de Projet",
      description: "Expert en systèmes d'information géographique et télédétection"
    },
    {
      name: "Dr. Sophie Laurent",
      role: "Analyste Senior",
      description: "Chercheuse en qualité de l'eau et écotoxicologie"
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Fiabilité",
      description: "Données précises et méthodologies scientifiques rigoureuses"
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Technologies de pointe pour une surveillance efficace"
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Partenariat avec les acteurs publics et privés"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
<div className="flex justify-center mb-6">
  <img
    src="/logo.jpg"
    alt="Logo"
    className="h-24 w-auto"  // taille augmentée
  />
</div>
            <h1 className="text-5xl md:text-6xl font-roboto font-bold mb-6">
              WaterQual SEBOU
            </h1>
            <p className="text-xl md:text-2xl mb-4 opacity-90">
              Système d'Aide à la Décision pour la Qualité de l'Eau
            </p>
            <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto">
           WaterQual SEBOU : Plateforme Web Sécurisée pour le Monitoring et l’Analyse de la Qualité de l’Eau
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="shadow-elegant">
                <NavLink to="/dashboard">
                  Accéder au Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </NavLink>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-4">
              Fonctionnalités Avancées
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une plateforme complète pour le monitoring et l'analyse de la qualité de l'eau
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-border hover:shadow-card transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="bg-accent p-3 rounded-lg w-fit mx-auto mb-4">
                      <Icon className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About C4E Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-6">
                À propos de C4E
              </h2>
<p className="text-lg text-muted-foreground mb-6">
  C4E AFRICA est une entreprise à taille humaine qui propose des solutions scientifiques et techniques pour répondre aux défis du développement durable à l’échelle internationale.
</p>
<p className="text-lg text-muted-foreground mb-6">
  Le Centre for Environment & Sustainability (C4E) est un laboratoire de recherche 
  de premier plan spécialisé dans les solutions environnementales innovantes.
</p>
<p className="text-lg text-muted-foreground mb-6">
  Nous intervenons dans les domaines de l’eau, de l’énergie, de l’environnement et de l’éducation, 
  en appliquant des outils basés sur la recherche et en développant des services et des applications innovantes.
</p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Plus de 10 ans d'expertise en monitoring environnemental
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Collaborations avec institutions publiques et entreprises privées
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Publications scientifiques reconnues internationalement
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{value.title}</h3>
                          <p className="text-muted-foreground text-sm">{value.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
<section className="py-16 bg-background">
  <div className="container mx-auto px-6">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-4">
        Notre Équipe
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Des experts passionnés au service de l'environnement
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Driss */}
      <Card className="border-border hover:shadow-card transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="w-28 h-28 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
            🧑‍💼
          </div>
          <h3 className="font-semibold text-lg mb-1">Mr. Driss Ennaanay</h3>
          <p className="text-primary font-medium mb-3">Directeur Général</p>
        </CardContent>
      </Card>

      {/* Yassine */}
      <Card className="border-border hover:shadow-card transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="w-28 h-28 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
            👨‍💻
          </div>
          <h3 className="font-semibold text-lg mb-1">Yassine</h3>
          <p className="text-primary font-medium mb-3">Chef de projet</p>
          <p className="text-muted-foreground text-sm">Développeur fullstack</p>
        </CardContent>
      </Card>

      {/* Ilham */}
      <Card className="border-border hover:shadow-card transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="w-28 h-28 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
            👩‍💻
          </div>
          <h3 className="font-semibold text-lg mb-1">Ilham</h3>
          <p className="text-primary font-medium mb-3">Développeur fullstack</p>
          <p className="text-muted-foreground text-sm">Architecture web et visualisation</p>
        </CardContent>
      </Card>

      {/* Imane */}
      <Card className="border-border hover:shadow-card transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="w-28 h-28 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
            👩‍💻
          </div>
          <h3 className="font-semibold text-lg mb-1">Imane</h3>
          <p className="text-primary font-medium mb-3">Développeur fullstack</p>
          <p className="text-muted-foreground text-sm">Systèmes d'information géographique</p>
        </CardContent>
      </Card>
    </div>
  </div>
</section>


      {/* Contact Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-roboto font-bold mb-6">
              Prêt à Commencer ?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Rejoignez notre plateforme pour accéder aux outils de monitoring les plus avancés
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" variant="secondary" asChild>
                <NavLink to="/register">
                  Créer un compte
                  <ArrowRight className="ml-2 h-5 w-5" />
                </NavLink>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                <NavLink to="/contact">
                  Nous contacter
                </NavLink>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center space-y-2">
                <Mail className="h-6 w-6 text-secondary" />
                <p className="text-sm opacity-80">contact@hydroqual-dss.fr</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <MapPin className="h-6 w-6 text-secondary" />
                <p className="text-sm opacity-80">Université de Recherche</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Users className="h-6 w-6 text-secondary" />
                <p className="text-sm opacity-80">Équipe dédiée 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;