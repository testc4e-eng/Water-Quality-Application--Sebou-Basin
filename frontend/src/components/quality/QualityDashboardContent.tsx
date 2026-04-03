import { useEffect, useMemo, useState } from "react";
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
import { fetchQualityInventory } from "@/api/quality";

type PollutionMode = "inventaire" | "ponctuelle" | "diffuse";

type InventoryRow = {
  source: string;
  sourceType: string;
  parameter: string;
  sourceName: string;
  location: string;
  period: string;
  entities: number;
  measuredValue: number;
  unit: string;
  pressure: "Faible" | "Moyenne" | "Elevee";
  status: "Actif" | "Surveillance" | "A verifier";
};

const fallbackInventoryRows: InventoryRow[] = [
  {
    source: "Industrie",
    sourceType: "Rejets liquides industriels",
    parameter: "DBO5",
    sourceName: "Zone industrielle Dokkarat",
    location: "Fes amont",
    period: "2025",
    entities: 12,
    measuredValue: 87.4,
    unit: "mg/L",
    pressure: "Elevee",
    status: "Actif",
  },
  {
    source: "Industrie",
    sourceType: "Rejets liquides industriels",
    parameter: "MES",
    sourceName: "Plateforme industrielle Meknes",
    location: "Meknes aval",
    period: "2025",
    entities: 9,
    measuredValue: 132.8,
    unit: "mg/L",
    pressure: "Moyenne",
    status: "Actif",
  },
  {
    source: "Assainissement",
    sourceType: "Stations d'epuration",
    parameter: "Nitrate",
    sourceName: "STEP Ain Nokbi",
    location: "Couloir Sebou central",
    period: "2025",
    entities: 7,
    measuredValue: 24.3,
    unit: "mg/L",
    pressure: "Moyenne",
    status: "Actif",
  },
  {
    source: "Ruissellement agricole",
    sourceType: "Diffuse",
    parameter: "Phosphore",
    sourceName: "Parcelle irriguee Gharb Nord",
    location: "Plaine du Gharb",
    period: "2024",
    entities: 21,
    measuredValue: 3.8,
    unit: "mg/L",
    pressure: "Elevee",
    status: "Surveillance",
  },
  {
    source: "Ruissellement agricole",
    sourceType: "Diffuse",
    parameter: "Nitrate",
    sourceName: "Parcelle Saiss Ouest",
    location: "Plaine du Saiss",
    period: "2024",
    entities: 18,
    measuredValue: 31.7,
    unit: "mg/L",
    pressure: "Elevee",
    status: "Actif",
  },
  {
    source: "Erosion des sols",
    sourceType: "Diffuse",
    parameter: "Sediments",
    sourceName: "Versant Sebou amont",
    location: "Sebou amont",
    period: "2024",
    entities: 16,
    measuredValue: 412.5,
    unit: "mg/L",
    pressure: "Moyenne",
    status: "Actif",
  },
  {
    source: "Depots urbains",
    sourceType: "Diffuse",
    parameter: "Oxygene",
    sourceName: "Perimetre urbain Fes Sud",
    location: "Perimetre urbain Fes",
    period: "2025",
    entities: 11,
    measuredValue: 5.4,
    unit: "mg/L",
    pressure: "Moyenne",
    status: "A verifier",
  },
  {
    source: "Barrages",
    sourceType: "Qualite barrage",
    parameter: "Chlorophylle",
    sourceName: "Barrage Al Wahda",
    location: "Ouazzane",
    period: "2025",
    entities: 5,
    measuredValue: 11.2,
    unit: "ug/L",
    pressure: "Faible",
    status: "Actif",
  },
  {
    source: "Barrages",
    sourceType: "Qualite barrage",
    parameter: "Oxygene",
    sourceName: "Barrage Idriss 1er",
    location: "Sidi Kacem",
    period: "2025",
    entities: 4,
    measuredValue: 7.9,
    unit: "mg/L",
    pressure: "Faible",
    status: "Actif",
  },
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
  const [inventoryRows, setInventoryRows] = useState<InventoryRow[]>([]);
  const [source, setSource] = useState<string>("all");
  const [sourceType, setSourceType] = useState<string>("all");
  const [parameterSearch, setParameterSearch] = useState("");
  const [selectedParameter, setSelectedParameter] = useState<string>("all");

  useEffect(() => {
    fetchQualityInventory()
      .then((rows) => {
        if (rows && rows.length) setInventoryRows(rows);
        else setInventoryRows(fallbackInventoryRows);
      })
      .catch(() => setInventoryRows(fallbackInventoryRows));
  }, []);

  const rows = inventoryRows.length ? inventoryRows : fallbackInventoryRows;

  const sourceOptions = useMemo(
    () => Array.from(new Set(rows.map((row) => row.source))),
    [rows]
  );

  const sourceTypeOptions = useMemo(
    () =>
      Array.from(
        new Set(
          rows
            .filter((row) => source === "all" || row.source === source)
            .map((row) => row.sourceType)
        )
      ),
    [source, rows]
  );

  const parameterOptions = useMemo(() => {
    const scopedRows = rows.filter((row) => {
      const sourceMatch = source === "all" || row.source === source;
      const typeMatch = sourceType === "all" || row.sourceType === sourceType;
      return sourceMatch && typeMatch;
    });

    return Array.from(new Set(scopedRows.map((row) => row.parameter))).filter((item) =>
      item.toLowerCase().includes(parameterSearch.toLowerCase())
    );
  }, [source, sourceType, parameterSearch]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const sourceMatch = source === "all" || row.source === source;
      const typeMatch = sourceType === "all" || row.sourceType === sourceType;
      const parameterMatch = selectedParameter === "all" || row.parameter === selectedParameter;
      return sourceMatch && typeMatch && parameterMatch;
    });
  }, [source, sourceType, selectedParameter, rows]);

  const totalEntities = useMemo(
    () => filteredRows.reduce((sum, row) => sum + row.entities, 0),
    [filteredRows]
  );

  const activeSourceTypes = useMemo(
    () => new Set(filteredRows.map((row) => row.sourceType)).size,
    [filteredRows]
  );

  const criticalCount = useMemo(
    () => filteredRows.filter((row) => row.pressure === "Elevee").length,
    [filteredRows]
  );

  const averageValue = useMemo(() => {
    if (filteredRows.length === 0) return 0;
    return filteredRows.reduce((sum, row) => sum + row.measuredValue, 0) / filteredRows.length;
  }, [filteredRows]);

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:col-span-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Filtres inventaire</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Source de pollution</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="all">Toutes les sources</option>
                {sourceOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Type de source</label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="all">Tous les types</option>
                {sourceTypeOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Parametre</label>
              <input
                type="text"
                value={parameterSearch}
                onChange={(e) => setParameterSearch(e.target.value)}
                placeholder="Filtrer les parametres..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
              <select
                value={selectedParameter}
                onChange={(e) => setSelectedParameter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="all">Tous les parametres</option>
                {parameterOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Vue active</div>
              <div className="mt-2 text-sm text-slate-700">{source === "all" ? "Toutes les sources" : source}</div>
              <div className="mt-1 text-sm text-slate-700">{sourceType === "all" ? "Tous les types" : sourceType}</div>
              <div className="mt-1 text-sm text-slate-700">
                {selectedParameter === "all" ? "Tous les parametres" : selectedParameter}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 xl:col-span-9 space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Types de source</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{activeSourceTypes}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Entites filtrees</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{totalEntities}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Valeur moyenne</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{averageValue.toFixed(1)}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Pression elevee</div>
            <div className="mt-2 text-3xl font-bold text-amber-600">{criticalCount}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Tableau des donnees filtrees</h3>
              <p className="text-sm text-slate-500">Apercu des donnees d'exemple selon les filtres selectionnes.</p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {filteredRows.length} ligne{filteredRows.length > 1 ? "s" : ""}
            </div>
          </div>

          <div className="overflow-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Parametre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Nom source</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Localisation</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Periode</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Valeur</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Unite</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Entites</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Pression</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                {filteredRows.map((row) => (
                  <tr key={`${row.source}-${row.parameter}-${row.location}-${row.period}`} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">{row.source}</td>
                    <td className="px-4 py-3">{row.sourceType}</td>
                    <td className="px-4 py-3">{row.parameter}</td>
                    <td className="px-4 py-3">{row.sourceName}</td>
                    <td className="px-4 py-3">{row.location}</td>
                    <td className="px-4 py-3">{row.period}</td>
                    <td className="px-4 py-3 text-right font-medium">{row.measuredValue}</td>
                    <td className="px-4 py-3">{row.unit}</td>
                    <td className="px-4 py-3 text-right">{row.entities}</td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          "rounded-full px-2 py-1 text-xs font-medium",
                          row.pressure === "Elevee"
                            ? "bg-amber-50 text-amber-700"
                            : row.pressure === "Moyenne"
                              ? "bg-sky-50 text-sky-700"
                              : "bg-emerald-50 text-emerald-700",
                        ].join(" ")}
                      >
                        {row.pressure}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          "rounded-full px-2 py-1 text-xs font-medium",
                          row.status === "Actif"
                            ? "bg-emerald-50 text-emerald-700"
                            : row.status === "Surveillance"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700",
                        ].join(" ")}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-4 py-10 text-center text-sm text-slate-500">
                      Aucun resultat pour ce filtrage.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
