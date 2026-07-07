import { AlertTriangle, RefreshCcw, ThermometerSun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

import { BasinStatus } from "@/components/home-v2/BasinStatus";
import { HeroSection } from "@/components/home-v2/HeroSection";
import { KpiTooltip } from "@/components/home-v2/KpiTooltip";
import { OperationalMap } from "@/components/home-v2/OperationalMap";
import { TrendPanel } from "@/components/home-v2/TrendPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardHome } from "@/hooks/useDashboardHome";
import { KPI_DEFINITIONS } from "@/lib/kpi-definitions";
import { readPreviousDashboardHomeCache } from "@/api/dashboardHome";
import { StatusBadge } from "@/components/ui/status-badge";
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
  const previousPayload = useMemo(
    () => (payload?.generated_at ? readPreviousDashboardHomeCache() : null),
    [payload?.generated_at],
  );
  const kpiTrends = useMemo(() => {
    if (!payload || !previousPayload) {
      return {};
    }

    const current = payload.secondary_kpis;
    const previous = previousPayload.secondary_kpis;
    const diff = (a: number | null, b: number | null) => (a !== null && b !== null ? a - b : null);

    return {
      IQGB: diff(current.iqgb.value, previous.iqgb.value),
      IFD: diff(current.ifd.value, previous.ifd.value),
      IPP: diff(current.ipp.value, previous.ipp.value),
      ISR: diff(current.isr.value, previous.isr.value),
    };
  }, [payload, previousPayload]);

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
          <section className="grid gap-2 xl:grid-cols-12">
            <div className="xl:col-span-5">
              <div className="h-80 animate-pulse rounded-[28px] bg-slate-200/70" />
            </div>
            <div className="xl:col-span-3">
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

        <HeroSection hero={payload.hero} secondaryKpis={payload.secondary_kpis} kpiTrends={kpiTrends} variant="ultra-compact" />

        <div className="min-h-[520px]">
          <OperationalMap
            mapConfig={payload.map}
            alerts={payload.alerts}
            actions={payload.recommended_actions}
          />
        </div>

        <section className="grid gap-2 xl:grid-cols-12">
          <div className="xl:col-span-5">
            <BasinStatus
              basinStatus={payload.basin_status}
              freshness={payload.data_freshness}
              stations={qualityStationsQuery.data ?? []}
              stationsLoading={qualityStationsQuery.isLoading || qualityStationsQuery.isFetching}
              stationsError={qualityStationsQuery.isError}
            />
          </div>
          <div className="xl:col-span-3">
            <ConfidencePanel
            ifd={payload.secondary_kpis.ifd.value}
            icd={payload.secondary_kpis.icd.value}
            ich={payload.secondary_kpis.ich.value}
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

        <section className="grid gap-2 xl:grid-cols-4">
          <HomeSummaryCard
            title="Modules opérationnels"
            status="OPERATIONNEL"
            items={["Accueil DG", "Qualité réglementaire", "Pollution assistée", "Données / QA", "Administration / RBAC"]}
          />
          <HomeSummaryCard
            title="Modules partiels"
            status="PARTIEL"
            items={["Carte Métier", "Stations en sous-vues", "Barrages en sous-vues", "Référentiel réglementaire sous condition PREPROD"]}
          />
          <HomeSummaryCard
            title="Décisions métier restantes"
            status="PREPROD_CONDITIONNEL"
            items={["Validation référentiel réglementaire", "Arbitrages pollution IDP", "Dictionnaire final paramètres"]}
          />
          <HomeSummaryCard
            title="Modules masqués ou déclassés"
            status="EN_CONSTRUCTION"
            items={["SWAT", "WASP", "Prédiction pollution", "Recommandations autonomes", "Reporting autonome"]}
          />
        </section>


      </div>
    </main>
  );
}

function ConfidencePanel({ ifd, icd, ich }: { ifd: number | null; icd: number | null; ich: number | null }) {
  return (
    <Card className="rounded-[22px] border-slate-200 bg-white shadow-sm lg:h-full">
      <CardContent className="p-2.5">
        <div className="text-sm font-semibold text-slate-950">Confiance données</div>
        <div className="mt-2 space-y-1.5">
          <GaugeRing label="IFD" value={ifd} color="#F59E0B" subtitle="Fraîcheur" info={KPI_DEFINITIONS.ifd} />
          <GaugeRing label="ICD" value={icd} color="#10B981" subtitle="Confiance" info={KPI_DEFINITIONS.icd} />
          <GaugeRing label="ICH" value={ich} color="#0EA5E9" subtitle="Hydraulique" info={KPI_DEFINITIONS.ich} />
        </div>
      </CardContent>
    </Card>
  );
}

function HomeSummaryCard({
  title,
  status,
  items,
}: {
  title: string;
  status: "OPERATIONNEL" | "PARTIEL" | "PREPROD_CONDITIONNEL" | "EN_CONSTRUCTION";
  items: string[];
}) {
  return (
    <Card className="rounded-[22px] border-slate-200 bg-white shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold text-slate-950">{title}</div>
          <StatusBadge status={status} />
        </div>
        <div className="mt-3 space-y-2 text-sm text-slate-600">
          {items.map((item) => (
            <div key={item} className="rounded-xl bg-slate-50 px-3 py-2">
              {item}
            </div>
          ))}
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
  info,
}: {
  label: string;
  value: number | null;
  color: string;
  subtitle: string;
  info?: {
    title: string;
    definition: string;
    calculation: string;
    interpretation?: string;
    source?: string;
    thresholds?: string;
  };
}) {
  const safeValue = Math.max(0, Math.min(100, value ?? 0));
  const angle = (safeValue / 100) * 360;
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-2">
      <div
        className="relative grid h-10 w-10 place-items-center rounded-full xl:h-12 xl:w-12"
        style={{ background: `conic-gradient(${color} ${angle}deg, #e2e8f0 ${angle}deg 360deg)` }}
      >
        <div className="grid h-7 w-7 place-items-center rounded-full bg-white text-center xl:h-8 xl:w-8">
          <div className="text-[9px] font-semibold text-slate-500">{label}</div>
          <div className="text-[10px] font-semibold text-slate-950 xl:text-xs">{safeValue}</div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1">
          <div className="text-[11px] font-semibold text-slate-900">{subtitle}</div>
          {info ? (
            <KpiTooltip
              title={info.title}
              definition={info.definition}
              calculation={info.calculation}
              interpretation={info.interpretation}
              source={info.source}
              thresholds={info.thresholds}
            />
          ) : null}
        </div>
        <div className="text-[9px] text-slate-500">{safeValue}/100</div>
      </div>
    </div>
  );
}
