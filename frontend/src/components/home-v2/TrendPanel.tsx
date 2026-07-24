import { Activity } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { RuntimeDashboardTrendsPayload, RuntimeTrendSeries } from "@/api/dashboardRuntime";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiTooltip } from "@/components/home-v2/KpiTooltip";

interface TrendPanelProps {
  trends: RuntimeDashboardTrendsPayload;
}

export function TrendPanel({ trends }: TrendPanelProps) {
  return (
    <Card className="rounded-[22px] border-slate-200 shadow-sm">
      <CardHeader className="pb-1 pt-2.5">
        <CardTitle className="flex items-center gap-2 text-sm text-slate-950">
          <Activity className="h-4 w-4 text-indigo-700" />
          Tendances
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
        <TrendCard
          title="Pluie"
          series={trends.rainfall}
          color="#059669"
          compact
          emptyMessage={trends.rainfall.message || "Série pluie indisponible"}
          info={{
            title: "Pluie",
            definition: "Précipitations journalières.",
            calculation: "Moyenne journalière des stations actives sur les 30 derniers jours.",
            source: "meteo.mesure_precipitation",
          }}
        />
        <TrendCard
          title="Débit"
          series={trends.flow}
          color="#2563eb"
          compact
          emptyMessage={trends.flow.message || "Série débit indisponible"}
          info={{
            title: "Débit",
            definition: "Débit d'eau mesuré.",
            calculation: "Moyenne des stations hydro actives sur les 30 derniers jours.",
            source: "hydro.mesure_debit",
          }}
        />
        <TrendCard
          title="Température"
          series={trends.temperature}
          color="#f97316"
          compact
          emptyMessage={trends.temperature.message || "Température non disponible en base"}
          info={{
            title: "Température",
            definition: "Température moyenne journalière.",
            calculation: "Moyenne des stations actives sur les 30 derniers jours.",
            source: "meteo.mesure_temperature",
          }}
        />
      </CardContent>
    </Card>
  );
}

function TrendCard({
  title,
  series,
  color,
  compact = false,
  emptyMessage = "Tendance indisponible pour cette série.",
  info,
}: {
  title: string;
  series: RuntimeTrendSeries;
  color: string;
  compact?: boolean;
  emptyMessage?: string;
  info?: { title: string; definition: string; calculation: string; source: string; thresholds?: string };
}) {
  const rows = series.points.map((point) => ({
    ...point,
    shortDate: point.date.slice(5),
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <div>
            <div className="text-[12px] font-semibold text-slate-950">{title}</div>
            <div className="text-[9px] uppercase tracking-[0.12em] text-slate-500">{series.unit}</div>
          </div>
          {info && (
            <KpiTooltip title={info.title} definition={info.definition} calculation={info.calculation} source={info.source} thresholds={info.thresholds} />
          )}
        </div>
        <div className="text-right text-[9px] text-slate-500">{series.count} pts</div>
      </div>
      <div className={compact ? "h-20" : "h-44"}>
        {rows.length === 0 ? (
          <div className="grid h-full place-items-center rounded-xl border border-dashed border-slate-300 bg-white text-[11px] text-slate-500">
            {emptyMessage}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="shortDate" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} width={36} />
              <Tooltip
                formatter={(value: number | null) => [value ?? "N/D", series.unit]}
                labelFormatter={(label: string) => `Date ${label}`}
                contentStyle={{ borderRadius: 14, borderColor: "#cbd5e1" }}
              />
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={false} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="mt-1 text-[9px] text-slate-500">
        Dernière donnée traitée : {series.date_max ?? "N/D"}
      </div>
    </div>
  );
}
