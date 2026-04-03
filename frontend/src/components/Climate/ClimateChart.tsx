import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  ComposedChart,
} from "recharts";
import { getClimateTimeseries } from "@/api/climate";

export default function ClimateChart({
  tsId,
  unit,
  varLabel,
  varIcon,
  dateStart,
  dateEnd,
  aggregation,
  chartType = "line",
  chartScale = "linear",
  loading = false,
}: any) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!tsId || !aggregation) {
      setData([]);
      return;
    }

    getClimateTimeseries({
      ts_id: tsId,
      time_step: aggregation,
      ...(dateStart && { date_start: dateStart }),
      ...(dateEnd && { date_end: dateEnd }),
    }).then((rows) => {
      if (!Array.isArray(rows)) {
        console.error("Invalid timeseries (chart):", rows);
        setData([]);
        return;
      }

      setData(
        rows.map((r: any) => ({
          date: r.datetime,
          value: Number(r.value),
        }))
      );
    });
  }, [tsId, dateStart, dateEnd, aggregation]);

  const formatXAxis = (dateStr: string) => {
    const date = new Date(dateStr);
    if (aggregation === "annual") return String(date.getFullYear());
    if (aggregation === "monthly") {
      return `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    }
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const formattedLabel =
        aggregation === "annual"
          ? String(date.getFullYear())
          : aggregation === "monthly"
          ? date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
          : date.toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });
      const value = payload[0].value;

      return (
        <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-lg">
          <p className="mb-1 text-sm font-semibold text-gray-700">{formattedLabel}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-xl">{varIcon || "📊"}</span>
            <span className="text-gray-600">{varLabel || "Valeur"}:</span>
            <span className="font-mono font-bold text-blue-600">
              {Number(value).toFixed(3)} {unit}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!tsId) {
    return (
      <div className="flex h-[280px] flex-col items-center justify-center rounded-lg bg-gradient-to-b from-gray-50 to-white">
        <div className="mb-3 text-5xl opacity-30">📈</div>
        <p className="font-medium text-gray-400">Aucune donnée à visualiser</p>
        <p className="mt-1 text-xs text-gray-300">Sélectionnez une variable</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[280px] flex-col items-center justify-center rounded-lg bg-gradient-to-b from-gray-50 to-white">
        <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
        <p className="text-sm text-gray-500">Chargement du graphique...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-[280px] flex-col items-center justify-center rounded-lg bg-gradient-to-b from-gray-50 to-white">
        <div className="mb-3 text-5xl opacity-30">⏳</div>
        <p className="font-medium text-gray-400">Aucune donnée</p>
        <p className="mt-1 text-xs text-gray-300">pour cette période</p>
      </div>
    );
  }

  const gradientColor = varLabel?.includes("Précipitation") ? "#10b981" : "#3b82f6";
  const gradientId = varLabel?.includes("Précipitation") ? "precipGradient" : "blueGradient";

  const displayData =
    chartScale === "log" ? data.map((item) => ({ ...item, value: item.value > 0 ? item.value : 1 })) : data;

  return (
    <div className="flex h-[320px] flex-col">
      {data.length > 0 && (
        <div className="mb-2 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{varIcon || "📊"}</span>
            <span className="text-xs font-semibold text-gray-700">{varLabel}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Min:</span>
              <span className="text-xs font-semibold text-cyan-600">
                {Math.min(...data.map((d) => d.value)).toFixed(1)} {unit}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Max:</span>
              <span className="text-xs font-semibold text-orange-600">
                {Math.max(...data.map((d) => d.value)).toFixed(1)} {unit}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Moy:</span>
              <span className="text-xs font-semibold text-purple-600">
                {(data.reduce((acc, d) => acc + d.value, 0) / data.length).toFixed(1)} {unit}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="relative flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={displayData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              tick={{ fontSize: 10, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={{ stroke: "#e5e7eb" }}
              interval="preserveStartEnd"
              minTickGap={30}
            />

            <YAxis
              scale={chartScale === "log" ? "log" : "linear"}
              domain={chartScale === "log" ? [1, "auto"] : ["auto", "auto"]}
              tick={{ fontSize: 10, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={{ stroke: "#e5e7eb" }}
              label={{
                value: unit,
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#6b7280", fontSize: 10 },
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            {chartType === "bar" ? (
              <Bar dataKey="value" fill={gradientColor} radius={[5, 5, 0, 0]} />
            ) : (
              <>
                <Area type="monotone" dataKey="value" stroke="none" fill={`url(#${gradientId})`} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={gradientColor}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0, fill: gradientColor }}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-center text-[10px] text-gray-400">
        {dateStart && dateEnd ? (
          <span>
            Du {aggregation === "annual" ? new Date(dateStart).getFullYear() : new Date(dateStart).toLocaleDateString("fr-FR")}
            {" "}au{" "}
            {aggregation === "annual" ? new Date(dateEnd).getFullYear() : new Date(dateEnd).toLocaleDateString("fr-FR")}
          </span>
        ) : (
          <span>Série temporelle</span>
        )}
      </div>
    </div>
  );
}
