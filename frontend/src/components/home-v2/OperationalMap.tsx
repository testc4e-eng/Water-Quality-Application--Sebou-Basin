import { AlertTriangle, Layers3, MapPinned } from "lucide-react";
import { NavLink } from "react-router-dom";

import type { DashboardHomeAlert, DashboardHomeBasinStatus, DashboardHomeMap, DashboardHomeRecommendedAction, DashboardHomeSecondaryKpis } from "@/api/dashboardHome";
import { BusinessMap } from "@/components/DashboardMetier/BusinessMap";
import { AlertsPanel } from "@/components/home-v2/AlertsPanel";
import { LayerSummary } from "@/components/home-v2/LayerSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OperationalMapProps {
  mapConfig: DashboardHomeMap;
  alerts: DashboardHomeAlert[];
  actions: DashboardHomeRecommendedAction[];
  basinStatus: DashboardHomeBasinStatus;
  secondaryKpis: DashboardHomeSecondaryKpis;
}

export function OperationalMap({ mapConfig, alerts, actions, basinStatus, secondaryKpis }: OperationalMapProps) {
  const stationItems = buildStationItems(alerts, basinStatus);
  const pollutionItems = buildPollutionItems(actions, secondaryKpis.ipp.value);

  return (
    <Card className="overflow-hidden rounded-[28px] border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
      <CardHeader className="border-b border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl text-slate-950">
              <MapPinned className="h-5 w-5 text-blue-700" />
              Carte métier - Vue bassin
            </CardTitle>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              La carte métier reste le cœur du Home opérationnel. Barrages, hydro, pluvio et qualité sont visibles immédiatement.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="bg-slate-950 text-white hover:bg-slate-800">
              <NavLink to="/dashboard-carto-metier">Ouvrir la carte métier complète</NavLink>
            </Button>
            <Button asChild variant="outline">
              <NavLink to="/dashboard-pollution">Ouvrir Pollution</NavLink>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 xl:p-5">
        <LayerSummary mapConfig={mapConfig} />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(360px,0.95fr)]">
          <div className="relative min-h-[430px] xl:min-h-[480px]">
            <BusinessMap
              mode="home"
              overlayTitle="CARTE MÉTIER - VUE BASSIN"
              overlaySubtitle="Barrages, stations hydrométriques, stations pluviométriques et qualité eau."
              emptyMessage="La carte Home V2 réutilise le moteur métier existant. Le rendu multicouche opérationnel complet reste consolidé dans /dashboard-carto-metier."
            />

            <div className="pointer-events-none absolute right-4 top-4">
              <div className="rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <Layers3 className="h-3.5 w-3.5 text-blue-700" />
                  Couches métier
                </div>
                <div className="mt-2 text-lg font-semibold text-slate-950">{mapConfig.default_layers.length}</div>
                <div className="text-sm text-slate-600">actives au chargement</div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4">
              <Button asChild className="bg-[#0B2D66] text-white shadow-lg hover:bg-[#0A2450]">
                <NavLink to="/dashboard-carto-metier">Voir la carte complète</NavLink>
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <AlertsPanel alerts={alerts} compact maxVisible={4} />
            <SideListCard title="Stations critiques" items={stationItems} footerLabel="Voir toutes les stations" footerTo="/dashboard-qualite-reglementaire" compact />
            <SideListCard title="Pollutions prioritaires" items={pollutionItems} footerLabel="Voir toutes les pollutions" footerTo="/dashboard-pollution" compact />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SideListCard({
  title,
  items,
  footerLabel,
  footerTo,
}: {
  title: string;
  items: Array<{ id: string; title: string; subtitle: string; badge: string; badgeClass: string; metric?: string }>;
  footerLabel: string;
  footerTo: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-lg font-semibold text-slate-950">{title}</div>
      <div className="mt-4 space-y-2.5">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-900">{item.title}</div>
                <div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{item.subtitle}</div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.badgeClass}`}>{item.badge}</span>
            </div>
            {item.metric ? <div className="mt-3 text-xs font-semibold text-slate-500">{item.metric}</div> : null}
          </div>
        ))}
      </div>
      <div className="mt-5">
        <Button asChild variant="ghost" className="px-0 text-[#0B4FD8] hover:bg-transparent hover:text-[#0A3FAC]">
          <NavLink to={footerTo}>{footerLabel}</NavLink>
        </Button>
      </div>
    </div>
  );
}

function buildStationItems(alerts: DashboardHomeAlert[], basinStatus: DashboardHomeBasinStatus) {
  const source = alerts.filter((alert) => alert.type === "QUALITE" || alert.type === "HYDRO").slice(0, 5);

  if (source.length > 0) {
    return source.map((alert, index) => ({
      id: `${alert.id}-${index}`,
      title: alert.object_label || alert.title,
      subtitle: `Dernière mesure : ${basinStatus.quality.latest_date || basinStatus.hydrology.latest_date || "N/D"}`,
      badge: alert.severity === "CRITIQUE" ? "Critique" : "Surveillance",
      badgeClass: alert.severity === "CRITIQUE" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700",
    }));
  }

  return [
    {
      id: "fallback-quality-critical",
      title: "Réseau qualité quotidien",
      subtitle: `Stations critiques : ${basinStatus.quality.critiques}`,
      badge: "Surveillance",
      badgeClass: "bg-amber-100 text-amber-700",
    },
    {
      id: "fallback-hydro-up",
      title: "Hydrologie opérationnelle",
      subtitle: `Stations en hausse : ${basinStatus.hydrology.stations_hausse}`,
      badge: "Suivi",
      badgeClass: "bg-sky-100 text-sky-700",
    },
  ];
}

function buildPollutionItems(actions: DashboardHomeRecommendedAction[], ippValue: number | null) {
  const pollutionActions = actions.slice(0, 4);
  if (pollutionActions.length > 0) {
    return pollutionActions.map((item, index) => ({
      id: `${item.id}-${index}`,
      title: item.target_label || item.title,
      subtitle: item.action,
      badge: item.priority === "P0" ? "Élevé" : "Moyen",
      badgeClass: item.priority === "P0" ? "bg-orange-100 text-orange-700" : "bg-amber-100 text-amber-700",
      metric: `IPP ${ippValue ?? "N/D"}`,
    }));
  }

  return [
    {
      id: "fallback-pollution",
      title: "Pression pollution",
      subtitle: "Aucune liste prioritaire détaillée exposée par le contrat Home V2.",
      badge: "Moyen",
      badgeClass: "bg-amber-100 text-amber-700",
      metric: `IPP ${ippValue ?? "N/D"}`,
    },
  ];
}
