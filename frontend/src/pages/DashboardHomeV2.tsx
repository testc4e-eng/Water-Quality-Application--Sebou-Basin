import { AlertTriangle, RefreshCcw, ThermometerSun } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { BasinStatus } from "@/components/home-v2/BasinStatus";
import { HeroSection } from "@/components/home-v2/HeroSection";
import { OperationalMap } from "@/components/home-v2/OperationalMap";
import { TrendPanel } from "@/components/home-v2/TrendPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardHome } from "@/hooks/useDashboardHome";
import { useDashboardRuntimeTrends, useQualityStationsWithTimeseries } from "@/hooks/useDashboardRuntime";

export default function DashboardHomeV2() {
  const homeQuery = useDashboardHome();
  const qualityStationsQuery = useQualityStationsWithTimeseries(6);
  const runtimeTrendsQuery = useDashboardRuntimeTrends(30);
  const [showSlowLoadNotice, setShowSlowLoadNotice] = useState(false);

  useEffect(() => {
    if (homeQuery.data || !(homeQuery.isLoading || homeQuery.isFetching)) {
      setShowSlowLoadNotice(false);
      return;
    }

    const timeout = window.setTimeout(() => setShowSlowLoadNotice(true), 5000);
    return () => window.clearTimeout(timeout);
  }, [homeQuery.data, homeQuery.isFetching, homeQuery.isLoading]);

  const payload = homeQuery.data;

  if (!homeQuery.data && (homeQuery.isLoading || homeQuery.isFetching)) {
    return (
      <main className="min-h-screen bg-[#EEF5FF] px-3 py-2 text-slate-950 sm:px-4 xl:px-4">
        <div className="flex w-full max-w-[1800px] flex-col gap-2">
          {showSlowLoadNotice ? (
            <Card className="border-amber-200 bg-amber-50 shadow-sm">
              <CardContent className="p-4 text-sm leading-6 text-amber-900">
                Chargement prolongé du Home opérationnel. Le backend `/api/v1/dashboard/home` répond lentement ; le contenu s’affichera dès réception du payload.
              </CardContent>
            </Card>
          ) : null}

          {/* Hero skeleton */}
          <div className="rounded-[28px] border border-slate-200 bg-white/80 p-4 shadow-sm">
            <div className="h-6 w-64 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-4 w-96 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200/70" />
              ))}
            </div>
          </div>

          {/* Map skeleton */}
          <div className="min-h-[520px] animate-pulse rounded-[28px] bg-slate-200/70" />

          {/* Middle grid skeleton */}
          <section className="grid gap-2 xl:grid-cols-9">
            <div className="xl:col-span-5">
              <div className="h-80 animate-pulse rounded-[28px] bg-slate-200/70" />
            </div>
            <div className="xl:col-span-4">
              <div className="h-80 animate-pulse rounded-[28px] bg-slate-200/70" />
            </div>
          </section>

          {/* Summary cards skeleton */}
          <section className="grid gap-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-[28px] bg-slate-200/70" />
            ))}
          </section>

          {/* Signal cards skeleton */}
          <section className="grid gap-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-[28px] bg-slate-200/70" />
            ))}
          </section>

          {/* Footer metadata skeleton */}
          <div className="h-10 animate-pulse rounded-2xl bg-slate-200/70" />
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

  return (
    <main className="min-h-screen bg-[#EEF5FF] px-3 py-2 text-slate-950 sm:px-4 xl:px-4">
      <div className="flex w-full max-w-[1800px] flex-col gap-2">
        {homeQuery.isFetching ? (
          <div className="rounded-2xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-[11px] font-medium text-sky-900">
            Actualisation du Home opérationnel en cours…
          </div>
        ) : null}

        <HeroSection hero={payload.hero} variant="ultra-compact" />

        <div className="min-h-[520px]">
          <OperationalMap
            mapConfig={payload.map}
            alerts={payload.alerts}
            actions={payload.recommended_actions}
          />
        </div>

        <section className="grid gap-2 xl:grid-cols-9">
          <div className="xl:col-span-5">
            <BasinStatus
              basinStatus={payload.basin_status}
              freshness={payload.data_freshness}
              stations={qualityStationsQuery.data ?? []}
              stationsLoading={qualityStationsQuery.isLoading || qualityStationsQuery.isFetching}
              stationsError={qualityStationsQuery.isError}
            />
          </div>
          <div className="xl:col-span-4">
            <TrendPanel trends={runtimeTrendsQuery.data ?? {
              rainfall: { label: "Pluie", unit: "mm", points: [], count: 0, date_min: null, date_max: null, source: "meteo.mesure_precipitation", message: "Série pluie indisponible" },
              flow: { label: "Débit", unit: "m3/s", points: [], count: 0, date_min: null, date_max: null, source: "hydro.mesure_debit", message: "Série débit indisponible" },
              temperature: { label: "Température", unit: "°C", points: [], count: 0, date_min: null, date_max: null, source: "meteo.mesure_temperature", message: "Température non disponible en base" },
              quality: { label: "Qualité", unit: "score", points: [], count: 0, date_min: null, date_max: null, source: "qualite.mesure_qualite_sebou", message: "Série qualité indisponible" },
            }} />
          </div>
        </section>

        <div className="rounded-2xl border border-slate-200 bg-white/80 px-3 py-1.5 text-[11px] text-slate-600 shadow-sm">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1 font-medium text-slate-800">
              <ThermometerSun className="h-3.5 w-3.5 text-slate-700" />
              {payload.metadata.temperature_rule}
            </span>
            <span className="truncate">{payload.metadata.scientific_warning}</span>
          </div>
        </div>

      </div>
    </main>
  );
}
