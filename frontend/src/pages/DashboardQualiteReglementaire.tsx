import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useMemo, useState } from "react";

import { KPIQualiteCards } from "@/components/quality-regulatory/KPIQualiteCards";
import { ObservationalParametersPanel } from "@/components/quality-regulatory/ObservationalParametersPanel";
import { QualityParametersTable } from "@/components/quality-regulatory/QualityParametersTable";
import { QualityStationsPanel } from "@/components/quality-regulatory/QualityStationsPanel";
import { QualityTimeSeries } from "@/components/quality-regulatory/QualityTimeSeries";
import { RegulatoryHeader } from "@/components/quality-regulatory/RegulatoryHeader";
import { QualityStatusBadge } from "@/components/quality-regulatory/QualityStatusBadge";
import {
  useActiveThresholds,
  useQualityClassification,
  useQualityStations,
  useQualityTimeseries,
  useRegulatoryStatus,
} from "@/hooks/useQualityRegulatory";

const SERIES_KEY: Record<string, "dbo5" | "dco" | "no3" | "ph" | "o2" | "mes"> = {
  DBO5: "dbo5", DCO: "dco", NO3: "no3", pH: "ph", O2_DISSOUS: "o2", MES: "mes",
};

export default function DashboardQualiteReglementaire() {
  const [stationId, setStationId] = useState<string>();
  const [parameter, setParameter] = useState("DBO5");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const statusQuery = useRegulatoryStatus();
  const thresholdsQuery = useActiveThresholds();
  const stationsQuery = useQualityStations();
  const timeseriesQuery = useQualityTimeseries(stationId, dateStart, dateEnd);
  const latestPoint = useMemo(() => {
    const key = SERIES_KEY[parameter];
    return [...(timeseriesQuery.data ?? [])].reverse().find((row) => row[key] !== null && row[key] !== undefined);
  }, [parameter, timeseriesQuery.data]);
  const latestValue = latestPoint?.[SERIES_KEY[parameter]] as number | null | undefined;
  const classificationQuery = useQualityClassification(parameter, latestValue, parameter === "pH" ? "" : "mg/L");

  const summary = statusQuery.data?.summary ?? {};
  const stations = stationsQuery.data ?? [];
  const measuresCount = stations.reduce((total, station) => total + station.n_mesures, 0);
  const lastUpdate = stations.map((station) => station.dt_max).sort().reverse()[0];
  const hasError = statusQuery.isError || thresholdsQuery.isError || stationsQuery.isError;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <RegulatoryHeader status={statusQuery.data} />
      <div className="mx-auto flex max-w-[1600px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm">
          <div className="flex items-center gap-2 text-blue-950"><Info className="h-4 w-4" />Contrat API officiel : <strong>type_eau=surface_generale</strong>. Aucun fallback silencieux.</div>
          <div className="flex flex-wrap gap-2"><QualityStatusBadge status="NON_CLASSIFIABLE" /><QualityStatusBadge status="HORS_PERIMETRE_REGLEMENTAIRE" /><QualityStatusBadge status="TYPE_EAU_NON_OPERATIONNEL" /></div>
        </section>

        {hasError ? (
          <section className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            <AlertTriangle className="h-4 w-4" />API qualité indisponible. Vérifiez le backend sur `/api/v1/quality/*`.
          </section>
        ) : (
          <section className="flex items-center gap-2 text-sm text-emerald-800"><CheckCircle2 className="h-4 w-4" />API réglementaire lecture seule connectée.</section>
        )}

        <KPIQualiteCards
          stationsCount={stations.length}
          measuresCount={measuresCount}
          classifiableCount={summary.parameters_classifiable ?? 0}
          nonClassifiableCount={(summary.parameters ?? 0) - (summary.parameters_classifiable ?? 0)}
          lastUpdate={lastUpdate}
        />

        <QualityStationsPanel
          stations={stations}
          selectedStationId={stationId}
          onSelectStation={(value) => setStationId(value || undefined)}
          dateStart={dateStart}
          dateEnd={dateEnd}
          onDateStartChange={setDateStart}
          onDateEndChange={setDateEnd}
          selectedParameter={parameter}
          onParameterChange={setParameter}
          classification={classificationQuery.data}
          latestValue={latestValue}
          latestDate={latestPoint?.date}
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <QualityTimeSeries rows={timeseriesQuery.data ?? []} parameter={parameter} />
          <ObservationalParametersPanel />
        </div>

        <QualityParametersTable thresholds={thresholdsQuery.data?.data ?? []} version={statusQuery.data?.version_reglementaire} />

        <section className="grid gap-3 rounded-md border bg-white p-4 text-sm md:grid-cols-3">
          <div><p className="font-semibold text-slate-900">Codes sensibles</p><p className="mt-1 text-slate-600">MO — Matières organiques ≠ Mo — Molybdène. La casse est conservée.</p></div>
          <div><p className="font-semibold text-slate-900">Alias validé</p><p className="mt-1 text-slate-600">NO3 → NO3- uniquement. Aucun fuzzy matching automatique.</p></div>
          <div><p className="font-semibold text-slate-900">Oxygène dissous</p><p className="mt-1 text-slate-600">O2_DISSOUS → O2_DISS. Ne pas confondre avec la saturation oxygène.</p></div>
        </section>
      </div>
    </main>
  );
}
