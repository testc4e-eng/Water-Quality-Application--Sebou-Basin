import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import QualityFilters from "@/components/quality/QualityFilters";
import QualityKPIs from "@/components/quality/QualityKPIs";
import QualityTable from "@/components/quality/QualityTable";
import QualityChart from "@/components/quality/QualityChart";

type PollutionMode = "inventaire" | "ponctuelle" | "diffuse";

const inventoryRows = [
  { source: "Stations de suivi", category: "Eau de surface", entities: 18, status: "Actif" },
  { source: "Campagnes terrain", category: "Pollution ponctuelle", entities: 9, status: "Actif" },
  { source: "Rejets identifies", category: "Industrie", entities: 14, status: "A verifier" },
  { source: "Apports diffus", category: "Agriculture", entities: 26, status: "Actif" },
  { source: "Barrages", category: "Retenues", entities: 7, status: "Actif" },
];

const diffuseChartData = [
  { period: "2016", agriculture: 18, urban: 9, erosion: 11 },
  { period: "2017", agriculture: 22, urban: 10, erosion: 13 },
  { period: "2018", agriculture: 25, urban: 12, erosion: 14 },
  { period: "2019", agriculture: 27, urban: 11, erosion: 16 },
  { period: "2020", agriculture: 24, urban: 13, erosion: 15 },
  { period: "2021", agriculture: 29, urban: 14, erosion: 18 },
];

function PollutionModeBar({
  mode,
  onChange,
}: {
  mode: PollutionMode;
  onChange: (mode: PollutionMode) => void;
}) {
  const items: Array<{ key: PollutionMode; label: string; description: string; icon: string }> = [
    { key: "inventaire", label: "Inventaire", description: "Sources et entites suivies", icon: "🗂️" },
    { key: "ponctuelle", label: "Pollution ponctuelle", description: "Stations et points de rejet", icon: "🧪" },
    { key: "diffuse", label: "Pollution diffuse", description: "Charges et tendances spatiales", icon: "🌿" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {items.map((item) => {
          const active = mode === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={[
                "flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all",
                active
                  ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-md"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="text-sm font-semibold">{item.label}</div>
                  <div className={`text-xs ${active ? "text-white/80" : "text-slate-500"}`}>{item.description}</div>
                </div>
              </div>
              {active && <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">Actif</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function InventoryMode() {
  const totalEntities = useMemo(
    () => inventoryRows.reduce((sum, row) => sum + row.entities, 0),
    []
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Sources</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{inventoryRows.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Entites suivies</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{totalEntities}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Etat de l'inventaire</div>
          <div className="mt-2 text-3xl font-bold text-emerald-600">Actif</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Inventaire des sources de pollution</h3>
          <div className="overflow-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Categorie</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Entites</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                {inventoryRows.map((row) => (
                  <tr key={`${row.source}-${row.category}`} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">{row.source}</td>
                    <td className="px-4 py-3">{row.category}</td>
                    <td className="px-4 py-3 text-right">{row.entities}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Synthese de l'inventaire</h3>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryRows}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="source" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="entities" fill="#14b8a6" name="Entites inventoriees" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function PonctualMode() {
  const [station, setStation] = useState<string[]>([]);
  const [parametres, setParametres] = useState<string[]>(["N", "O", "P"]);
  const [aggregation, setAggregation] = useState("M");
  const [dateStart, setDateStart] = useState("1992-01-01");
  const [dateEnd, setDateEnd] = useState("2020-12-31");

  const apiParams = {
    station_code: station.join(","),
    parametres,
    aggregation,
    date_start: dateStart,
    date_end: dateEnd,
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-3">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3">
            <h3 className="font-semibold text-white">Filtres pollution ponctuelle</h3>
          </div>
          <div className="p-4">
            <QualityFilters
              station={station}
              parametres={parametres}
              aggregation={aggregation}
              dateStart={dateStart}
              dateEnd={dateEnd}
              onStationChange={setStation}
              onParametresChange={setParametres}
              onAggregationChange={setAggregation}
              onDateStartChange={setDateStart}
              onDateEndChange={setDateEnd}
            />
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-9 space-y-6">
        {station.length > 0 ? (
          <QualityKPIs {...apiParams} />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { title: "Azote (N)", accent: "text-blue-700", bg: "bg-blue-50" },
              { title: "Oxygene (O)", accent: "text-red-700", bg: "bg-red-50" },
              { title: "Phosphore (P)", accent: "text-green-700", bg: "bg-green-50" },
            ].map((k) => (
              <div key={k.title} className={`rounded-xl border border-gray-100 p-4 shadow-sm ${k.bg}`}>
                <div className={`text-sm font-semibold ${k.accent}`}>{k.title}</div>
                <div className="mt-3 text-3xl font-bold text-gray-400">—</div>
                <div className="mt-1 text-xs text-gray-500">Selectionnez une station</div>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="font-medium text-gray-800">Periode d'analyse:</span>
            <span>{new Date(dateStart).toLocaleDateString("fr-FR")} - {new Date(dateEnd).toLocaleDateString("fr-FR")}</span>
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">
              {aggregation === "D" ? "Journalier" : "Mensuel"}
            </span>
            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
              {station.length} station(s)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <div className="xl:col-span-2">
            <div className="h-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3">
                <h3 className="font-semibold text-white">Donnees pollution ponctuelle</h3>
              </div>
              <div className="p-0">
                <QualityTable {...apiParams} />
              </div>
            </div>
          </div>

          <div className="xl:col-span-3">
            <div className="h-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3">
                <h3 className="font-semibold text-white">Evolution temporelle des polluants</h3>
              </div>
              <div className="p-3">
                <QualityChart {...apiParams} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiffuseMode() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Charge agricole</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">29</div>
          <div className="mt-1 text-xs text-slate-500">unites relatives</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Charge urbaine</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">14</div>
          <div className="mt-1 text-xs text-slate-500">unites relatives</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Erosion</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">18</div>
          <div className="mt-1 text-xs text-slate-500">indice moyen</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Etat</div>
          <div className="mt-2 text-3xl font-bold text-amber-600">Surveillance</div>
          <div className="mt-1 text-xs text-slate-500">zones diffuses actives</div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">Tendance de la pollution diffuse</h3>
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={diffuseChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="period" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="agriculture" stroke="#16a34a" name="Agriculture" strokeWidth={2.5} />
              <Line type="monotone" dataKey="urban" stroke="#2563eb" name="Urbain" strokeWidth={2.5} />
              <Line type="monotone" dataKey="erosion" stroke="#f97316" name="Erosion" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">Tableau de synthese des apports diffus</h3>
        <div className="overflow-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Periode</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Agriculture</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Urbain</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Erosion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {diffuseChartData.map((row) => (
                <tr key={row.period} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{row.period}</td>
                  <td className="px-4 py-3 text-right">{row.agriculture}</td>
                  <td className="px-4 py-3 text-right">{row.urban}</td>
                  <td className="px-4 py-3 text-right">{row.erosion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function QualityDashboardContent() {
  const [mode, setMode] = useState<PollutionMode>("inventaire");

  return (
    <div className="space-y-6">
      <PollutionModeBar mode={mode} onChange={setMode} />

      {mode === "inventaire" && <InventoryMode />}
      {mode === "ponctuelle" && <PonctualMode />}
      {mode === "diffuse" && <DiffuseMode />}
    </div>
  );
}
