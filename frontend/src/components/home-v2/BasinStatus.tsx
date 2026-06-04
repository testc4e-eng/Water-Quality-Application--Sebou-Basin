import { CloudRain, Droplets, Gauge, ShieldCheck, Waves } from "lucide-react";

import type { DashboardHomeBasinStatus, DashboardHomeFreshnessItem } from "@/api/dashboardHome";
import { DataFreshnessBadge } from "@/components/home-v2/DataFreshnessBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BasinStatusProps {
  basinStatus: DashboardHomeBasinStatus;
  freshness: {
    barrages: DashboardHomeFreshnessItem;
    hydro: DashboardHomeFreshnessItem;
    pluvio: DashboardHomeFreshnessItem;
    quality_daily: DashboardHomeFreshnessItem;
  };
}

function valueOrDash(value: number | null | undefined, digits = 2) {
  return value === null || value === undefined ? "N/D" : value.toFixed(digits);
}

export function BasinStatus({ basinStatus, freshness }: BasinStatusProps) {
  const sentinelCards = buildSentinelCards(
    basinStatus.quality.sentinel_station_count,
    basinStatus.quality.conformes,
    basinStatus.quality.surveillance,
    basinStatus.quality.critiques,
    basinStatus.quality.unknown,
    basinStatus.quality.latest_date
  );

  return (
    <section>
      <Card className="rounded-[28px] border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xl font-semibold text-slate-950">
                <ShieldCheck className="h-5 w-5 text-orange-600" />
                Qualité des eaux
              </div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                6 stations avec mesures journalières
              </div>
            </div>
            <DataFreshnessBadge freshness={freshness.quality_daily} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {sentinelCards.map((card) => (
              <div key={card.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{card.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{card.date}</div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${card.badgeClass}`}>{card.status}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                  <span className={`h-2.5 w-2.5 rounded-full ${card.dotClass}`} />
                  {card.note}
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-3 xl:grid-cols-3">
            <SummaryPanel
              title="Hydrologie"
              icon={<Waves className="h-4 w-4 text-sky-700" />}
              freshness={freshness.hydro}
              metrics={[
                { label: "Débit moyen", value: `${valueOrDash(basinStatus.hydrology.debit_moyen)} ${basinStatus.hydrology.unit}` },
                { label: "Stations en hausse", value: String(basinStatus.hydrology.stations_hausse) },
                { label: "Stations en baisse", value: String(basinStatus.hydrology.stations_baisse) },
                { label: "Stations stables", value: String(basinStatus.hydrology.stations_stables) },
              ]}
            />
            <SummaryPanel
              title="Pluviométrie"
              icon={<CloudRain className="h-4 w-4 text-emerald-700" />}
              freshness={freshness.pluvio}
              note={basinStatus.rainfall.warning_typology_not_validated ? "Données pluie disponibles - typologie à consolider" : undefined}
              metrics={[
                { label: "Cumul 24h", value: `${valueOrDash(basinStatus.rainfall.cumul_24h)} ${basinStatus.rainfall.unit}` },
                { label: "Cumul 7j", value: `${valueOrDash(basinStatus.rainfall.cumul_7j)} ${basinStatus.rainfall.unit}` },
                { label: "Cumul 30j", value: `${valueOrDash(basinStatus.rainfall.cumul_30j)} ${basinStatus.rainfall.unit}` },
                { label: "Stations", value: String(basinStatus.rainfall.station_count) },
              ]}
            />
            <SummaryPanel
              title="Barrages"
              icon={<Gauge className="h-4 w-4 text-blue-700" />}
              freshness={freshness.barrages}
              metrics={[
                { label: "Barrages suivis", value: String(basinStatus.barrages.barrage_count) },
                { label: "Apport total", value: `${valueOrDash(basinStatus.barrages.apport_total)} ${basinStatus.barrages.unit_flow}` },
                { label: "Lâcher total", value: `${valueOrDash(basinStatus.barrages.lacher_total)} ${basinStatus.barrages.unit_flow}` },
                { label: "Niveau moyen", value: `${valueOrDash(basinStatus.barrages.niveau_moyen)} m` },
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function Metric({ label, value, suffix }: { label: string; value: string | number; suffix?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 flex items-end gap-2">
        <div className="text-2xl font-semibold text-slate-950">{value}</div>
        {suffix ? <div className="pb-1 text-xs font-medium text-slate-500">{suffix}</div> : null}
      </div>
    </div>
  );
}

function FullRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="sm:col-span-2 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-medium text-slate-900">{value}</div>
    </div>
  );
}

function SummaryPanel({
  title,
  icon,
  freshness,
  metrics,
  note,
}: {
  title: string;
  icon: React.ReactNode;
  freshness: DashboardHomeFreshnessItem;
  metrics: Array<{ label: string; value: string }>;
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
          {icon}
          {title}
        </div>
        <DataFreshnessBadge freshness={freshness} compact />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl bg-slate-50 p-3">
            <div className="text-xs text-slate-500">{metric.label}</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{metric.value}</div>
          </div>
        ))}
      </div>
      {note ? <div className="mt-3 text-xs leading-5 text-slate-500">{note}</div> : null}
    </div>
  );
}

function buildSentinelCards(
  count: number,
  conformes: number,
  surveillance: number,
  critiques: number,
  unknown: number,
  latestDate: string | null
) {
  const statuses = [
    ...Array.from({ length: critiques }, () => "Critique"),
    ...Array.from({ length: surveillance }, () => "Surveillance"),
    ...Array.from({ length: conformes }, () => "Bon"),
    ...Array.from({ length: unknown }, () => "Inconnu"),
  ];

  while (statuses.length < count) {
    statuses.push("Surveillance");
  }

  return Array.from({ length: count }).map((_, index) => {
    const status = statuses[index] ?? "Surveillance";
    const meta =
      status === "Critique"
        ? { badgeClass: "bg-rose-100 text-rose-700", dotClass: "bg-rose-500", note: "Surveillance immédiate" }
        : status === "Bon"
          ? { badgeClass: "bg-emerald-100 text-emerald-700", dotClass: "bg-emerald-500", note: "Situation maîtrisée" }
          : status === "Inconnu"
            ? { badgeClass: "bg-slate-100 text-slate-700", dotClass: "bg-slate-400", note: "Signal à préciser" }
            : { badgeClass: "bg-amber-100 text-amber-700", dotClass: "bg-amber-500", note: "Surveillance renforcée" };

    return {
      id: `sentinel-${index + 1}`,
      name: `Station sentinelle ${String(index + 1).padStart(2, "0")}`,
      date: latestDate || "Date à confirmer",
      status,
      ...meta,
    };
  });
}
