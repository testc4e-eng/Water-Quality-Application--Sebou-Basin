import { AlertTriangle, RefreshCcw, ThermometerSun } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { BasinStatus } from "@/components/home-v2/BasinStatus";
import { HeroSection } from "@/components/home-v2/HeroSection";
import { OperationalMap } from "@/components/home-v2/OperationalMap";
import { RecommendedActionsPanel } from "@/components/home-v2/RecommendedActionsPanel";
import { SecondaryKpiPanel } from "@/components/home-v2/SecondaryKpiPanel";
import { TrendPanel } from "@/components/home-v2/TrendPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardHome } from "@/hooks/useDashboardHome";

export default function DashboardHomeV2() {
  const homeQuery = useDashboardHome();
  const [showSlowLoadNotice, setShowSlowLoadNotice] = useState(false);

  useEffect(() => {
    if (homeQuery.data || !(homeQuery.isLoading || homeQuery.isFetching)) {
      setShowSlowLoadNotice(false);
      return;
    }

    const timeout = window.setTimeout(() => setShowSlowLoadNotice(true), 5000);
    return () => window.clearTimeout(timeout);
  }, [homeQuery.data, homeQuery.isFetching, homeQuery.isLoading]);

  if (!homeQuery.data && (homeQuery.isLoading || homeQuery.isFetching)) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_45%,#f8fafc_100%)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {showSlowLoadNotice ? (
            <Card className="border-amber-200 bg-amber-50 shadow-sm">
              <CardContent className="p-4 text-sm leading-6 text-amber-900">
                Chargement prolongé du Home opérationnel. Le backend `/api/v1/dashboard/home` répond lentement ; le contenu s’affichera dès réception du payload.
              </CardContent>
            </Card>
          ) : null}
          <div className="h-64 animate-pulse rounded-[28px] bg-slate-200/70" />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,1fr)]">
            <div className="h-[680px] animate-pulse rounded-[28px] bg-slate-200/70" />
            <div className="space-y-6">
              <div className="h-80 animate-pulse rounded-[28px] bg-slate-200/70" />
              <div className="h-80 animate-pulse rounded-[28px] bg-slate-200/70" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (homeQuery.isError && !homeQuery.data) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_45%,#f8fafc_100%)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Card className="border-rose-200 bg-rose-50 shadow-sm">
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex items-center gap-3 text-rose-700">
                <AlertTriangle className="h-5 w-5" />
                <div className="text-lg font-semibold">Le Home opérationnel n’a pas pu être chargé.</div>
              </div>
              <div className="text-sm leading-6 text-rose-800">
                Vérifier l’endpoint <code>/api/v1/dashboard/home</code> ou relancer la récupération.
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => homeQuery.refetch()} className="bg-slate-950 text-white hover:bg-slate-800">
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Recharger
                </Button>
                <Button asChild variant="outline">
                  <NavLink to="/dashboard-carto-metier">Ouvrir la carte métier</NavLink>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const payload = homeQuery.data;

  return (
    <main className="min-h-screen bg-[#EEF5FF] px-4 py-6 text-slate-950 sm:px-6 xl:px-7">
      <div className="mx-auto flex max-w-[1560px] flex-col gap-5">
        {homeQuery.isFetching ? (
          <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-medium text-sky-900">
            Actualisation du Home opérationnel en cours…
          </div>
        ) : null}

        {import.meta.env.DEV ? (
          <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-xs text-slate-500">
            debug home: loading={String(homeQuery.isLoading)} fetching={String(homeQuery.isFetching)} error={String(homeQuery.isError)} status={payload.status}
          </div>
        ) : null}

        <HeroSection hero={payload.hero} />

        <SecondaryKpiPanel kpis={payload.secondary_kpis} />

        <OperationalMap
          mapConfig={payload.map}
          alerts={payload.alerts}
          actions={payload.recommended_actions}
          basinStatus={payload.basin_status}
          secondaryKpis={payload.secondary_kpis}
        />

        <section className="grid gap-5 xl:grid-cols-12">
          <div className="xl:col-span-5">
            <BasinStatus basinStatus={payload.basin_status} freshness={payload.data_freshness} />
          </div>
          <div className="xl:col-span-4">
            <RecommendedActionsPanel actions={payload.recommended_actions} />
          </div>
          <div className="xl:col-span-3">
            <ConfidencePanel
            ifd={payload.secondary_kpis.ifd.value}
            icd={payload.secondary_kpis.icd.value}
            ich={payload.secondary_kpis.ich.value}
            />
          </div>
        </section>

        <TrendPanel trends={payload.trends} />

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Card className="border-slate-200 bg-white/90 shadow-sm">
            <CardContent className="flex items-start gap-3 p-5">
              <ThermometerSun className="mt-0.5 h-5 w-5 text-slate-700" />
              <div>
                <div className="font-semibold text-slate-950">Règle métier température</div>
                <div className="mt-1 text-sm leading-6 text-slate-600">{payload.metadata.temperature_rule}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white/90 shadow-sm">
            <CardContent className="p-5">
              <div className="font-semibold text-slate-950">Contexte d’interprétation</div>
              <div className="mt-1 text-sm leading-6 text-slate-600">
                {payload.metadata.scientific_warning} Portée qualité : {payload.metadata.quality_scope}. Les couches {payload.metadata.excluded_from_home.join(", ")} restent hors du Home.
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

function ConfidencePanel({ ifd, icd, ich }: { ifd: number | null; icd: number | null; ich: number | null }) {
  return (
    <Card className="rounded-[28px] border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="text-lg font-semibold text-slate-950">Confiance des données</div>
        <div className="mt-4 space-y-4">
          <GaugeRing label="IFD" value={ifd} color="#F59E0B" subtitle="Fraîcheur" />
          <GaugeRing label="ICD" value={icd} color="#10B981" subtitle="Confiance" />
          <GaugeRing label="ICH" value={ich} color="#0EA5E9" subtitle="Hydraulique" />
        </div>
      </CardContent>
    </Card>
  );
}

function GaugeRing({
  label,
  value,
  color,
  subtitle,
}: {
  label: string;
  value: number | null;
  color: string;
  subtitle: string;
}) {
  const safeValue = Math.max(0, Math.min(100, value ?? 0));
  const angle = (safeValue / 100) * 360;
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5">
      <div
        className="relative grid h-16 w-16 place-items-center rounded-full xl:h-[4.5rem] xl:w-[4.5rem]"
        style={{ background: `conic-gradient(${color} ${angle}deg, #e2e8f0 ${angle}deg 360deg)` }}
      >
        <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-center xl:h-12 xl:w-12">
          <div className="text-xs font-semibold text-slate-500">{label}</div>
          <div className="text-base font-semibold text-slate-950">{safeValue}</div>
        </div>
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-900">{subtitle}</div>
        <div className="text-xs text-slate-500">{safeValue}/100</div>
      </div>
    </div>
  );
}
