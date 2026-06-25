import { ShieldCheck } from "lucide-react";

import type { RuntimeQualityStation } from "@/api/dashboardRuntime";
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
  stations: RuntimeQualityStation[];
  stationsLoading?: boolean;
  stationsError?: boolean;
}

export function BasinStatus({ basinStatus, freshness, stations, stationsLoading = false, stationsError = false }: BasinStatusProps) {
  const { conformes, surveillance, critiques, unknown } = basinStatus.quality;
  const stationCards = buildStationCards(stations);
  const titleCount = stations.length || basinStatus.quality.sentinel_station_count;

  return (
    <section>
      <Card className="rounded-[22px] border-slate-200 shadow-sm lg:h-full">
        <CardHeader className="pb-1 pt-2.5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                <ShieldCheck className="h-4 w-4 text-orange-600" />
                Qualité des eaux
              </div>
              <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {titleCount} stations avec séries qualité réelles
              </div>
            </div>
            <DataFreshnessBadge freshness={freshness.quality_daily} />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 lg:flex lg:h-[calc(100%-48px)] lg:flex-col">
          <div className="flex flex-wrap gap-1.5">
            <MiniStatusBadge label="Bon" value={conformes} tone="emerald" />
            <MiniStatusBadge label="Surveillance" value={surveillance} tone="amber" />
            <MiniStatusBadge label="Critique" value={critiques} tone="rose" />
            <MiniStatusBadge label="Inconnu" value={unknown} tone="slate" />
          </div>
          {stationsLoading ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-600">
              Chargement des stations qualité réelles...
            </div>
          ) : stationsError ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-4 text-sm text-rose-700">
              Impossible de charger les stations qualité réelles.
            </div>
          ) : stationCards.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-600">
              Aucune station qualité avec série temporelle n’a été remontée par l’API.
            </div>
          ) : (
            <div className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
              {stationCards.map((card) => (
              <div key={card.id} className="rounded-xl border border-slate-200 bg-slate-50 p-1.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-semibold text-slate-900">{card.name}</div>
                    <div className="mt-0.5 text-[9px] text-slate-500">{card.dateLine}</div>
                  </div>
                  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${card.badgeClass}`}>{card.status}</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[9px] text-slate-600">
                  <span className={`h-2 w-2 rounded-full ${card.dotClass}`} />
                  {card.note}
                </div>
                <div className="mt-1 text-[9px] text-slate-500">{card.meta}</div>
              </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function MiniStatusBadge({ label, value, tone }: { label: string; value: number; tone: "emerald" | "amber" | "rose" | "slate" }) {
  const classes = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
    slate: "border-slate-200 bg-slate-100 text-slate-700",
  } as const;

  return <div className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${classes[tone]}`}>{label} {value}</div>;
}

function buildStationCards(stations: RuntimeQualityStation[]) {
  return stations.map((station) => {
    const status = station.status === "CRITIQUE" ? "Critique" : station.status === "BON" ? "Bon" : station.status === "INCONNU" ? "Inconnu" : "Surveillance";
    const meta =
      status === "Critique"
        ? { badgeClass: "bg-rose-100 text-rose-700", dotClass: "bg-rose-500", note: station.status_reason }
        : status === "Bon"
          ? { badgeClass: "bg-emerald-100 text-emerald-700", dotClass: "bg-emerald-500", note: station.status_reason }
          : status === "Inconnu"
            ? { badgeClass: "bg-slate-100 text-slate-700", dotClass: "bg-slate-400", note: station.status_reason }
            : { badgeClass: "bg-amber-100 text-amber-700", dotClass: "bg-amber-500", note: station.status_reason };

    return {
      id: station.station_id,
      name: station.station_name,
      dateLine: station.last_measure_date || station.date_max || "Date inconnue",
      status,
      meta: `${station.parameter_count} paramètres • ${station.measure_count} mesures`,
      ...meta,
    };
  });
}
