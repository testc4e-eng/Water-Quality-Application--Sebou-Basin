import { Activity } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { RuntimeDashboardTrendsPayload, RuntimeTrendSeries } from "@/api/dashboardRuntime";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <CardContent className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-4">
        <TrendCard title="Pluie" series={trends.rainfall} color="#059669" compact emptyMessage={trends.rainfall.message || "Série pluie indisponible"} />
        <TrendCard title="Débit" series={trends.flow} color="#2563eb" compact emptyMessage={trends.flow.message || "Série débit indisponible"} />
        <TrendCard title="Température" series={trends.temperature} color="#f97316" compact emptyMessage={trends.temperature.message || "Température non disponible en base"} />
        <TrendCard title="Qualité" series={trends.quality} color="#7c3aed" compact emptyMessage={trends.quality.message || "Série qualité indisponible"} />
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
}: {
  title: string;
  series: RuntimeTrendSeries;
  color: string;
  compact?: boolean;
  emptyMessage?: string;
}) {
  const rows = series.points.map((point) => ({
    ...point,
    shortDate: point.date.slice(5),
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <div>
          <div className="text-[12px] font-semibold text-slate-950">{title}</div>
          <div className="text-[9px] uppercase tracking-[0.12em] text-slate-500">{series.unit}</div>
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
        {series.date_min && series.date_max ? `${series.date_min} -> ${series.date_max}` : series.source}
      </div>
    </div>
  );
}
