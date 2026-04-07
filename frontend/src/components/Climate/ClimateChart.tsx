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

export default function ClimateChart({
  unit,
  varLabel,
  varIcon,
  chartType = "line",
  chartScale = "linear",
  loading = false,
  series = [],
}: any) {
  const data = (series || []).map((r: any) => ({
    date: r.datetime,
    value: Number(r.value),
  }));

  const formatXAxis = (dateStr: string) => {
    const date = new Date(dateStr);
    // Simple logic: if year is the same for all, show month/day. If many years, show years.
    const year = date.getFullYear();
    if (isNaN(year)) return dateStr;
    return String(year);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const formattedLabel = date.toLocaleDateString("fr-FR", {
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
        <p className="mt-1 text-xs text-gray-300">pour cette sélection</p>
      </div>
    );
  }

  const gradientColor = varLabel?.toLowerCase().includes("précipit") ? "#10b981" : "#3b82f6";
  const gradientId = varLabel?.toLowerCase().includes("précipit") ? "precipGradient" : "blueGradient";

  const displayData =
    chartScale === "log" ? data.map((item) => ({ ...item, value: item.value > 0 ? item.value : 1 })) : data;

  return (
    <div className="flex h-[320px] flex-col">
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
    </div>
  );
}
