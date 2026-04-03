/*frontend/src/pages/LandingPage.tsx*/
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Shield,
  Zap,
  Users,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Globe,
  Activity,
} from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: Activity,
      title: "Monitoring Temps Reel",
      description: "Surveillance continue de la qualite de l'eau avec des capteurs IoT de pointe",
    },
    {
      icon: BarChart3,
      title: "Analyse Predictive",
      description: "Algorithmes d'IA pour anticiper les risques et optimiser la gestion",
    },
    {
      icon: Globe,
      title: "Cartographie Interactive",
      description: "Visualisation geospatiale des bassins hydrographiques en temps reel",
    },
    {
      icon: TrendingUp,
      title: "Rapports Automatises",
      description: "Generation de rapports conformes aux standards APA/ISO",
    },
  ];

  const values = [
    {
      icon: Shield,
      title: "Fiabilite",
      description: "Donnees precises et methodologies scientifiques rigoureuses",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Technologies de pointe pour une surveillance efficace",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Partenariat avec les acteurs publics et prives",
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-hero py-20 text-primary-foreground">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container relative z-10 mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <img src="/logo.jpg" alt="Logo" className="h-24 w-auto" />
            </div>
            <h1 className="mb-6 text-5xl font-roboto font-bold md:text-6xl">WaterQual SEBOU</h1>
            <p className="mb-4 text-xl opacity-90 md:text-2xl">
              Systeme d'Aide a la Decision pour la Qualite de l'Eau
            </p>
            <p className="mx-auto mb-8 max-w-2xl text-lg opacity-80">
              WaterQual SEBOU : Plateforme Web Securisee pour le Monitoring et l'Analyse de la
              Qualite de l'Eau
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild className="shadow-elegant">
                <NavLink to="/dashboard-2">
                  Acceder au Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </NavLink>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-roboto font-bold text-primary md:text-4xl">
              Fonctionnalites Avancees
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Une plateforme complete pour le monitoring et l'analyse de la qualite de l'eau
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-border transition-shadow hover:shadow-card">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 w-fit rounded-lg bg-accent p-3">
                      <Icon className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-roboto font-bold text-primary md:text-4xl">
                A propos de C4E
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                C4E AFRICA est une entreprise a taille humaine qui propose des solutions
                scientifiques et techniques pour repondre aux defis du developpement durable a
                l'echelle internationale.
              </p>
              <p className="mb-6 text-lg text-muted-foreground">
                Le Centre for Environment & Sustainability (C4E) est un laboratoire de recherche
                de premier plan specialise dans les solutions environnementales innovantes.
              </p>
              <p className="mb-6 text-lg text-muted-foreground">
                Nous intervenons dans les domaines de l'eau, de l'energie, de l'environnement et
                de l'education, en appliquant des outils bases sur la recherche et en developpant
                des services et des applications innovantes.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-secondary" />
                  <p className="text-muted-foreground">
                    Plus de 10 ans d'expertise en monitoring environnemental
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-secondary" />
                  <p className="text-muted-foreground">
                    Collaborations avec institutions publiques et entreprises privees
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-secondary" />
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
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="mb-2 font-semibold">{value.title}</h3>
                          <p className="text-sm text-muted-foreground">{value.description}</p>
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

      <section className="bg-background py-16">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-roboto font-bold text-primary md:text-4xl">
              Notre Equipe
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Des experts passionnes au service de l'environnement
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="border-border transition-shadow hover:shadow-card">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-primary text-4xl">
                  👩‍💼
                </div>
                <h3 className="mb-1 text-lg font-semibold">Mr. Driss Ennaanay</h3>
                <p className="mb-3 font-medium text-primary">Directeur General</p>
              </CardContent>
            </Card>

            <Card className="border-border transition-shadow hover:shadow-card">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-primary text-4xl">
                  👨‍💻
                </div>
                <h3 className="mb-1 text-lg font-semibold">Yassine</h3>
                <p className="mb-3 font-medium text-primary">Chef de projet</p>
                <p className="text-sm text-muted-foreground">Developpeur fullstack</p>
              </CardContent>
            </Card>

            <Card className="border-border transition-shadow hover:shadow-card">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-primary text-4xl">
                  👩‍💻
                </div>
                <h3 className="mb-1 text-lg font-semibold">Ilham</h3>
                <p className="mb-3 font-medium text-primary">Developpeur fullstack</p>
                <p className="text-sm text-muted-foreground">Architecture web et visualisation</p>
              </CardContent>
            </Card>

            <Card className="border-border transition-shadow hover:shadow-card md:col-span-3 md:mx-auto md:w-[320px]">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-primary text-4xl">
                  👩‍💻
                </div>
                <h3 className="mb-1 text-lg font-semibold">Imane</h3>
                <p className="mb-3 font-medium text-primary">Developpeur fullstack</p>
                <p className="text-sm text-muted-foreground">Systemes d'information geographique</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
