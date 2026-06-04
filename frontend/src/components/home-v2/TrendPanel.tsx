import { Activity, CloudSun, ThermometerSun, Waves } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { DashboardHomeTrendSeries, DashboardHomeTrends } from "@/api/dashboardHome";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrendPanelProps {
  trends: DashboardHomeTrends;
}

export function TrendPanel({ trends }: TrendPanelProps) {
  return (
    <Card className="rounded-[28px] border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl text-slate-950">
          <Activity className="h-5 w-5 text-indigo-700" />
          Prévisions & historique récent
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
        <div className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_100%)] p-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-950">
            <CloudSun className="h-5 w-5 text-blue-700" />
            Prévisions météo & hydrologiques (7 jours)
          </div>
          <div className="mt-2 text-sm text-slate-500">Prévisions à connecter ultérieurement</div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <PlaceholderMetric title="Précipitations" value="À connecter" icon={<CloudSun className="h-4 w-4 text-emerald-600" />} />
            <PlaceholderMetric title="Température air" value="À connecter" icon={<ThermometerSun className="h-4 w-4 text-amber-600" />} />
            <PlaceholderMetric title="Débit prévisionnel" value="À connecter" icon={<Waves className="h-4 w-4 text-sky-700" />} />
          </div>
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white/80 p-3.5 text-sm leading-6 text-slate-600">
            Extension prévue : Open-Meteo, GPM IMERG puis CHIRPS / ERA5-Land. Règle métier maintenue : <span className="font-semibold">AIR_TEMPERATURE != WATER_TEMPERATURE</span>.
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <div className="text-lg font-semibold text-slate-950">Historique récent (tendances)</div>
          <div className="mt-4 grid gap-3">
            <TrendCard title="Précipitations 30 derniers jours" series={trends.rainfall_30d} color="#059669" compact />
            <TrendCard title="Débit moyen Sebou" series={trends.hydro_30d} color="#2563eb" compact />
            <TrendCard title={trends.quality_30d.points.length > 0 ? "Qualité sentinelle 30 jours" : "Température eau moyenne"} series={trends.quality_30d} color="#f97316" compact emptyMessage="À connecter" />
          </div>
        </div>
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
  series: DashboardHomeTrendSeries;
  color: string;
  compact?: boolean;
  emptyMessage?: string;
}) {
  const rows = series.points.map((point) => ({
    ...point,
    shortDate: point.date.slice(5),
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="font-semibold text-slate-950">{title}</div>
          <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{series.unit}</div>
        </div>
        <div className="text-right text-xs text-slate-500">{rows.length} points</div>
      </div>
      <div className={compact ? "h-28" : "h-44"}>
        {rows.length === 0 ? (
          <div className="grid h-full place-items-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">
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
    </div>
  );
}

function PlaceholderMetric({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        {icon}
        {title}
      </div>
      <div className="mt-3 text-sm text-slate-500">{value}</div>
    </div>
  );
}
