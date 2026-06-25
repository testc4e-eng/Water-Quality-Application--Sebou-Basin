import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { QualiteExposureRecord } from "@/types/qualite";

interface MetauxChartProps {
  rows: QualiteExposureRecord[];
}

const COLORS = ["#0f766e", "#b45309", "#1d4ed8", "#be123c", "#6d28d9"];

export default function MetauxChart({ rows }: MetauxChartProps) {
  const { data, parameters } = useMemo(() => {
    const counts = new Map<string, number>();
    rows.forEach((row) => {
      if (row.code_parametre && row.valeur_num !== null && row.date_mesure) {
        counts.set(row.code_parametre, (counts.get(row.code_parametre) ?? 0) + 1);
      }
    });

    const selectedParameters = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([code]) => code);

    const byDate = new Map<string, Record<string, string | number | null>>();
    rows.forEach((row) => {
      if (!row.date_mesure || row.valeur_num === null || !selectedParameters.includes(row.code_parametre)) {
        return;
      }
      const date = row.date_mesure.slice(0, 10);
      const point = byDate.get(date) ?? { date };
      point[row.code_parametre] = row.valeur_num;
      byDate.set(date, point);
    });

    return {
      data: [...byDate.values()].sort((a, b) => String(a.date).localeCompare(String(b.date))),
      parameters: selectedParameters,
    };
  }, [rows]);

  if (data.length === 0 || parameters.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground">
        Aucune série temporelle disponible pour les filtres sélectionnés.
      </div>
    );
  }

  return (
    <div className="h-80 rounded-xl border bg-card p-4">
      <ResponsiveContainer height="100%" width="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" minTickGap={28} />
          <YAxis width={56} />
          <Tooltip />
          <Legend />
          {parameters.map((parameter, index) => (
            <Line
              key={parameter}
              connectNulls
              dataKey={parameter}
              dot={false}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              type="monotone"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
