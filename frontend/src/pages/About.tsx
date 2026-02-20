/* frontend/src/pages/About.tsx */
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Zap, 
  Shield, 
  BarChart3, 
  MapPin, 
  Activity,
  FileText,
  Database,
  Cloud,
  Cpu,
  Globe,
  Users
} from "lucide-react";

const About = () => {
  const mission = [
    {
      icon: Activity,
      title: "Monitoring Précis",
      description: "Surveillance continue avec capteurs IoT de haute précision et analyses laboratoire certifiées"
    },
    {
      icon: BarChart3,
      title: "Prédiction Intelligente",
      description: "Algorithmes d'intelligence artificielle pour anticiper les évolutions et optimiser les décisions"
    },
    {
      icon: Shield,
      title: "Impact Environnemental",
      description: "Solutions durables pour la préservation des ressources hydriques et des écosystèmes"
    }
  ];

  const features = [
    {
      icon: MapPin,
      title: "Cartographie Interactive",
      description: "Visualisation géospatiale en temps réel des bassins hydrographiques avec outils de navigation avancés"
    },
    {
      icon: Activity,
      title: "Analyse Temps Réel",
      description: "Dashboard dynamique avec métriques live, alertes automatiques et tableaux de bord personnalisables"
    },
    {
      icon: FileText,
      title: "Générateur de Rapports",
      description: "Création automatisée de rapports conformes aux standards APA/ISO avec export multi-formats"
    }
  ];

const team = [
  {
    name: "Mr. Driss Ennaanay",
    role: "Directeur Général",
    speciality: "Gestion environnementale & leadership",
    experience: "20+ ans",
    description: "Directeur Général, engagé dans la protection de l’environnement et le pilotage stratégique des projets."
  },
  {
    name: "Yassine",
    role: "Chef de projet",
    speciality: "Développement fullstack",
    experience: "10+ ans",
    description: "Responsable de la gestion des projets et du développement logiciel et l'intégration des solutions."
  },
  {
    name: "Ilham",
    role: "Développeur Fullstack",
    speciality: "Architecture web & visualisation",
    experience: "1+ ans",
    description: "Spécialiste en conception d’architectures web modernes et en visualisation des données environnementales."
  },
  {
    name: "Imane",
    role: "Développeur Fullstack",
    speciality: "Systèmes d'information géographique",
    experience: "1+ ans",
    description: "Experte en développement fullstack appliqué aux SIG et à l’analyse spatiale des données environnementales."
  }
];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-roboto font-bold mb-6">
              À Propos d'WaterQual SEBOU
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Une plateforme innovante développée par C4E pour révolutionner 
              le monitoring et l'analyse de la qualité de l'eau
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-4">
                Notre Mission
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                WaterQual SEBOU combine expertise scientifique et technologies de pointe 
                pour fournir des outils d'aide à la décision précis et fiables
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mission.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card key={index} className="border-border hover:shadow-card transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="bg-primary/10 p-4 rounded-xl w-fit mx-auto mb-6">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-roboto font-semibold text-xl mb-4">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-4">
                Fonctionnalités Principales
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="border-border">
                    <CardContent className="p-8">
                      <div className="bg-secondary/10 p-3 rounded-lg w-fit mb-4">
                        <Icon className="h-6 w-6 text-secondary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-4">
                Notre Équipe
              </h2>
              <p className="text-lg text-muted-foreground">
                Des experts passionnés par l'innovation environnementale
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="border-border hover:shadow-card transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-roboto font-semibold text-lg mb-1">{member.name}</h3>
                        <p className="text-primary font-medium mb-2">{member.role}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary">{member.speciality}</Badge>
                          <Badge variant="outline">{member.experience}</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">{member.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-roboto font-bold mb-6">
              Rejoignez l'Innovation
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Découvrez comment WaterQual SEBOU peut transformer votre approche 
              du monitoring de la qualité de l'eau
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center space-y-2">
                <Target className="h-6 w-6 text-secondary" />
                <p className="text-sm opacity-80">Précision scientifique</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Zap className="h-6 w-6 text-secondary" />
                <p className="text-sm opacity-80">Innovation technologique</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Shield className="h-6 w-6 text-secondary" />
                <p className="text-sm opacity-80">Sécurité des données</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;