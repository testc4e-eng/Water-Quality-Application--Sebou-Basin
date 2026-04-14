/*frontend/src/pages/LandingPage.tsx*/
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const features = [
    {
      icon: Activity,
      title: t("landing.feature_monitoring_title"),
      description: t("landing.feature_monitoring_desc"),
    },
    {
      icon: BarChart3,
      title: t("landing.feature_prediction_title"),
      description: t("landing.feature_prediction_desc"),
    },
    {
      icon: Globe,
      title: t("landing.feature_map_title"),
      description: t("landing.feature_map_desc"),
    },
    {
      icon: TrendingUp,
      title: t("landing.feature_reports_title"),
      description: t("landing.feature_reports_desc"),
    },
  ];

  const values = [
    {
      icon: Shield,
      title: t("landing.value_reliability_title"),
      description: t("landing.value_reliability_desc"),
    },
    {
      icon: Zap,
      title: t("landing.value_innovation_title"),
      description: t("landing.value_innovation_desc"),
    },
    {
      icon: Users,
      title: t("landing.value_collaboration_title"),
      description: t("landing.value_collaboration_desc"),
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
            <h1 className="mb-6 text-5xl font-roboto font-bold md:text-6xl">{t("landing.hero_title")}</h1>
            <p className="mb-4 text-xl opacity-90 md:text-2xl">
              {t("landing.hero_subtitle")}
            </p>
            <p className="mx-auto mb-8 max-w-2xl text-lg opacity-80">
              {t("landing.hero_description")}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild className="shadow-elegant">
                <NavLink to="/dashboard-cartographique">
                  {t("landing.cta_dashboard")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </NavLink>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                {t("landing.cta_more")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-roboto font-bold text-primary md:text-4xl">
              {t("landing.features_title")}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t("landing.features_subtitle")}
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
                {t("landing.about_title")}
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                {t("landing.about_p1")}
              </p>
              <p className="mb-6 text-lg text-muted-foreground">
                {t("landing.about_p2")}
              </p>
              <p className="mb-6 text-lg text-muted-foreground">
                {t("landing.about_p3")}
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-secondary" />
                  <p className="text-muted-foreground">
                    {t("landing.about_bullet_1")}
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-secondary" />
                  <p className="text-muted-foreground">
                    {t("landing.about_bullet_2")}
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-secondary" />
                  <p className="text-muted-foreground">
                    {t("landing.about_bullet_3")}
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

    </div>
  );
};

export default LandingPage;
