import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { QualityTimeseriesRow } from "@/api/qualityRegulatory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SERIES_KEY: Record<string, keyof QualityTimeseriesRow> = {
  DBO5: "dbo5", DCO: "dco", NO3: "no3", pH: "ph", O2_DISSOUS: "o2", MES: "mes",
};

export function QualityTimeSeries({ rows, parameter }: { rows: QualityTimeseriesRow[]; parameter: string }) {
  const dataKey = SERIES_KEY[parameter] ?? "dbo5";

  return (
    <Card className="rounded-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Historique qualité</CardTitle>
        <p className="text-sm text-slate-500">Évolution temporelle de {parameter}. Comparaisons multi-stations et classes historiques prévues en P1.</p>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="flex h-72 items-center justify-center rounded-md border bg-slate-50 text-sm text-slate-500">Sélectionnez une station ou élargissez la période.</div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={rows}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" minTickGap={28} />
                <YAxis width={52} />
                <Tooltip />
                <Legend />
                <Line connectNulls dataKey={dataKey} dot={false} name={parameter} stroke="#0369a1" strokeWidth={2} type="monotone" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
