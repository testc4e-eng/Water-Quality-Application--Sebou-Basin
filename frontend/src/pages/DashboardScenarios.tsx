import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarRange,
  Database,
  Filter,
  Gauge,
  Layers3,
  LineChart,
  Table2,
} from "lucide-react";

type ScopeType = "station" | "barrage" | "segment";
type SourceType = "observed" | "swat" | "wasp" | "field";
type AggregationType = "daily" | "monthly" | "annual";

const scopeOptions: Array<{ value: ScopeType; label: string }> = [
  { value: "station", label: "Station" },
  { value: "barrage", label: "Barrage" },
  { value: "segment", label: "Segment reseau" },
];

const sourceOptions: Array<{ value: SourceType; label: string }> = [
  { value: "observed", label: "Observed database" },
  { value: "swat", label: "SWAT outputs" },
  { value: "wasp", label: "WASP outputs" },
  { value: "field", label: "Measured campaigns" },
];

const entityOptions: Record<ScopeType, string[]> = {
  station: ["Ait Tamlilt", "Brg Moulay Youssef", "Tamesmate", "Sebou amont"],
  barrage: ["Al Wahda", "Idriss 1er", "Moulay Youssef", "Garde Sebou"],
  segment: ["Segment R01", "Segment R08", "Segment R14", "Segment R22"],
};

const parameterGroups: Record<ScopeType, string[]> = {
  station: ["Hydrologie", "Climat", "Qualite surface"],
  barrage: ["Niveau barrage", "Qualite barrage", "Apports"],
  segment: ["Qualite eau surface", "Charge polluante", "Debit reseau"],
};

const parameterOptions: Record<string, string[]> = {
  Hydrologie: ["Debit", "Debit pointe", "Debit moyen", "Volume ecoule"],
  Climat: ["Precipitation", "Temperature", "Evapotranspiration"],
  "Qualite surface": ["Nitrate", "Phosphore", "Oxygene", "MES"],
  "Niveau barrage": ["Cote d'eau", "Volume stocke", "Taux remplissage"],
  "Qualite barrage": ["Nitrate", "Phosphore", "Chlorophylle", "Oxygene"],
  Apports: ["Apport entrant", "Apport sortant", "Sediments"],
  "Qualite eau surface": ["Nitrate", "Phosphore", "DBO5", "Oxygene"],
  "Charge polluante": ["NO3 load", "P load", "Sediment load"],
  "Debit reseau": ["Debit segment", "Debit minimum", "Debit maximum"],
};

function buildSeries(aggregation: AggregationType, parameter: string) {
  const points = aggregation === "daily" ? 16 : aggregation === "monthly" ? 12 : 10;
  const base = parameter.toLowerCase().includes("debit")
    ? 18
    : parameter.toLowerCase().includes("temperature")
    ? 24
    : parameter.toLowerCase().includes("volume")
    ? 65
    : 9;

  return Array.from({ length: points }, (_, index) => {
    const period =
      aggregation === "daily"
        ? `J-${index + 1}`
        : aggregation === "monthly"
        ? `2025-${String(index + 1).padStart(2, "0")}`
        : `${2016 + index}`;

    const reference = Number((base + Math.sin(index / 1.7) * (base * 0.22) + index * 0.4).toFixed(2));
    const scenarioA = Number((reference * 1.08 + Math.cos(index / 2.3) * 1.5).toFixed(2));
    const scenarioB = Number((reference * 0.92 + Math.sin(index / 2.1) * 1.2).toFixed(2));

    return {
      period,
      reference,
      scenarioA,
      scenarioB,
    };
  });
}

export default function DashboardScenarios() {
  const [scope, setScope] = useState<ScopeType>("station");
  const [source, setSource] = useState<SourceType>("swat");
  const [entity, setEntity] = useState(entityOptions.station[0]);
  const [scenarioFamily, setScenarioFamily] = useState("Baseline 2025");
  const [referenceScenario, setReferenceScenario] = useState("Reference");
  const [parameterGroup, setParameterGroup] = useState(parameterGroups.station[0]);
  const [parameter, setParameter] = useState(parameterOptions.Hydrologie[0]);
  const [aggregation, setAggregation] = useState<AggregationType>("monthly");
  const [dateStart, setDateStart] = useState("2025-01-01");
  const [dateEnd, setDateEnd] = useState("2025-12-31");

  const availableParameterGroups = parameterGroups[scope];
  const availableParameters = parameterOptions[parameterGroup] || [];

  const chartData = useMemo(() => buildSeries(aggregation, parameter), [aggregation, parameter]);

  const stats = useMemo(() => {
    const values = chartData.flatMap((row) => [row.reference, row.scenarioA, row.scenarioB]);
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    return {
      min: Math.min(...values).toFixed(2),
      mean: mean.toFixed(2),
      max: Math.max(...values).toFixed(2),
      rows: chartData.length,
    };
  }, [chartData]);

  const summaryData = useMemo(
    () => [
      {
        name: referenceScenario,
        min: Number(stats.min),
        mean: Number(stats.mean),
        max: Number(stats.max),
      },
      {
        name: "Scenario A",
        min: Number((Number(stats.min) * 1.04).toFixed(2)),
        mean: Number((Number(stats.mean) * 1.08).toFixed(2)),
        max: Number((Number(stats.max) * 1.09).toFixed(2)),
      },
      {
        name: "Scenario B",
        min: Number((Number(stats.min) * 0.96).toFixed(2)),
        mean: Number((Number(stats.mean) * 0.93).toFixed(2)),
        max: Number((Number(stats.max) * 0.95).toFixed(2)),
      },
    ],
    [referenceScenario, stats]
  );

  const scopeChanged = (value: ScopeType) => {
    setScope(value);
    const nextGroup = parameterGroups[value][0];
    setEntity(entityOptions[value][0]);
    setParameterGroup(nextGroup);
    setParameter(parameterOptions[nextGroup][0]);
  };

  const groupChanged = (value: string) => {
    setParameterGroup(value);
    setParameter(parameterOptions[value][0]);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50 px-5 py-6 lg:px-6">
      <div className="space-y-5">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 px-6 py-8 text-white lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/75">
                  Dashboard Scenarios
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight">Scenario analysis workspace</h1>
                <p className="mt-2 max-w-3xl text-sm text-white/80">
                  Configure sources, periods, parameters, and comparison scenarios. Statistics, charts, and tables now
                  use the full dashboard workspace.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm lg:min-w-[360px]">
                <div className="rounded-2xl bg-white/12 px-4 py-3 backdrop-blur">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/65">Source</div>
                  <div className="mt-1 font-semibold">{sourceOptions.find((item) => item.value === source)?.label}</div>
                </div>
                <div className="rounded-2xl bg-white/12 px-4 py-3 backdrop-blur">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/65">Periode</div>
                  <div className="mt-1 font-semibold">{dateStart.slice(0, 4)} - {dateEnd.slice(0, 4)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-sky-100 p-2 text-sky-700">
                <Filter className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Filtres scenarios</h2>
                <p className="text-xs text-slate-500">Source, periode, parametres, comparaison</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {scopeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => scopeChanged(option.value)}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                      scope === option.value
                        ? "bg-sky-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Source</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as SourceType)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                >
                  {sourceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {scope === "station" ? "Station" : scope === "barrage" ? "Barrage" : "Segment"}
                </label>
                <select
                  value={entity}
                  onChange={(e) => setEntity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                >
                  {entityOptions[scope].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Famille scenarios</label>
                  <select
                    value={scenarioFamily}
                    onChange={(e) => setScenarioFamily(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  >
                    <option>Baseline 2025</option>
                    <option>Optimistic pathway</option>
                    <option>Critical dry years</option>
                    <option>Restoration program</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Scenario reference</label>
                  <select
                    value={referenceScenario}
                    onChange={(e) => setReferenceScenario(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  >
                    <option>Reference</option>
                    <option>Scenario A</option>
                    <option>Scenario B</option>
                    <option>Scenario C</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Groupe parametres</label>
                <select
                  value={parameterGroup}
                  onChange={(e) => groupChanged(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                >
                  {availableParameterGroups.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Parametre</label>
                <select
                  value={parameter}
                  onChange={(e) => setParameter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                >
                  {availableParameters.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Aggregation</label>
                  <select
                    value={aggregation}
                    onChange={(e) => setAggregation(e.target.value as AggregationType)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  >
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mode</label>
                  <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100">
                    <option>Reference vs scenarios</option>
                    <option>Scenario only</option>
                    <option>Trend review</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Date start</label>
                  <input
                    type="date"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Date end</label>
                  <input
                    type="date"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-sky-100 p-2 text-sky-700">
                    <Gauge className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Minimum</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.min}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-indigo-100 p-2 text-indigo-700">
                    <Layers3 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Moyenne</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.mean}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-700">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Maximum</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.max}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-amber-100 p-2 text-amber-700">
                    <CalendarRange className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Points</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.rows}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Scenario chart</h2>
                  <p className="text-sm text-slate-500">
                    {entity} • {parameter} • {scenarioFamily} • {aggregation}
                  </p>
                </div>
                <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  En development
                </div>
              </div>

              <div className="h-[420px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="referenceFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="reference" stroke="#2563eb" fill="url(#referenceFill)" name={referenceScenario} />
                    <Area type="monotone" dataKey="scenarioA" stroke="#10b981" fill="transparent" name="Scenario A" />
                    <Area type="monotone" dataKey="scenarioB" stroke="#f97316" fill="transparent" name="Scenario B" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid gap-5 2xl:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-violet-100 p-2 text-violet-700">
                    <LineChart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Synthese scenarios</h3>
                    <p className="text-sm text-slate-500">Min, moyenne et max par scenario</p>
                  </div>
                </div>

                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={summaryData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="min" fill="#f97316" name="Minimum" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="mean" fill="#2563eb" name="Moyenne" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="max" fill="#10b981" name="Maximum" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-700">
                    <Table2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Tableau de comparaison</h3>
                    <p className="text-sm text-slate-500">Valeurs de reference et scenarios sur toute la periode</p>
                  </div>
                </div>

                <div className="max-h-[320px] overflow-auto rounded-2xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="sticky top-0 bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Periode</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">{referenceScenario}</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Scenario A</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Scenario B</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                      {chartData.map((row) => (
                        <tr key={String(row.period)} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium">{String(row.period)}</td>
                          <td className="px-4 py-3 text-right">{String(row.reference)}</td>
                          <td className="px-4 py-3 text-right">{String(row.scenarioA)}</td>
                          <td className="px-4 py-3 text-right">{String(row.scenarioB)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
