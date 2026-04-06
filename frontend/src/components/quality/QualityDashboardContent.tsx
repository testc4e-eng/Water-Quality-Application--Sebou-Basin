import { useEffect, useMemo, useState } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileSpreadsheet, FileText } from "lucide-react";
import * as XLSX from "xlsx";

import { fetchPollutionInventoryRows, type PollutionInventoryRow } from "@/api/quality";

type PollutionMode = "inventaire" | "ponctuelle" | "diffuse";

type PollutionRow = {
  source: string;
  sourceType: string;
  parameter: string;
  sourceName: string;
  location: string;
  period: string;
  measuredValue: number;
  unit: string;
};

type ModeConfig = {
  title: string;
  description: string;
  icon: string;
  buttonActive: string;
  buttonIdle: string;
  filterTitle: string;
  tableTitle: string;
  chartTitle: string;
  chartColor: string;
  showChart: boolean;
  rows: PollutionRow[];
};

const inventoryRows: PollutionRow[] = [
  { source: "Industrie", sourceType: "Rejets liquides industriels", parameter: "DBO5", sourceName: "Zone industrielle Dokkarat", location: "Fes amont", period: "2021", measuredValue: 87.4, unit: "mg/L" },
  { source: "Industrie", sourceType: "Rejets liquides industriels", parameter: "MES", sourceName: "Plateforme industrielle Meknes", location: "Meknes aval", period: "2022", measuredValue: 132.8, unit: "mg/L" },
  { source: "Industrie", sourceType: "Rejets liquides industriels", parameter: "Nitrate", sourceName: "Zone industrielle Ain Cheggag", location: "Sefrou", period: "2024", measuredValue: 19.6, unit: "mg/L" },
  { source: "Assainissement", sourceType: "Stations d'epuration", parameter: "Nitrate", sourceName: "STEP Ain Nokbi", location: "Couloir Sebou central", period: "2023", measuredValue: 24.3, unit: "mg/L" },
  { source: "Assainissement", sourceType: "Stations d'epuration", parameter: "DBO5", sourceName: "STEP Kariat Ba Mohamed", location: "Taounate", period: "2025", measuredValue: 41.2, unit: "mg/L" },
  { source: "Ruissellement agricole", sourceType: "Diffuse", parameter: "Phosphore", sourceName: "Parcelle irriguee Gharb Nord", location: "Plaine du Gharb", period: "2021", measuredValue: 3.8, unit: "mg/L" },
  { source: "Ruissellement agricole", sourceType: "Diffuse", parameter: "Nitrate", sourceName: "Parcelle Saiss Ouest", location: "Plaine du Saiss", period: "2022", measuredValue: 31.7, unit: "mg/L" },
];

const ponctuelleRows: PollutionRow[] = [
  { source: "Rejet urbain", sourceType: "Point de rejet", parameter: "Azote", sourceName: "Exutoire Fes rive gauche", location: "Fes", period: "2021", measuredValue: 18.4, unit: "mg/L" },
  { source: "Rejet urbain", sourceType: "Point de rejet", parameter: "Azote", sourceName: "Exutoire Fes rive gauche", location: "Fes", period: "2022", measuredValue: 20.1, unit: "mg/L" },
  { source: "Station de suivi", sourceType: "Prelevement station", parameter: "Oxygene", sourceName: "Station S3", location: "Sebou central", period: "2023", measuredValue: 6.7, unit: "mg/L" },
  { source: "Station de suivi", sourceType: "Prelevement station", parameter: "Phosphore", sourceName: "Station S5", location: "Meknes aval", period: "2024", measuredValue: 2.9, unit: "mg/L" },
  { source: "Industrie", sourceType: "Point de rejet", parameter: "MES", sourceName: "Usine agroalimentaire", location: "Sidi Kacem", period: "2025", measuredValue: 74.5, unit: "mg/L" },
];

const diffuseRows: PollutionRow[] = [
  { source: "Agriculture", sourceType: "Ruissellement diffus", parameter: "Nitrate", sourceName: "Bloc irrigue Gharb", location: "Gharb", period: "2021", measuredValue: 25.0, unit: "kg/ha" },
  { source: "Agriculture", sourceType: "Ruissellement diffus", parameter: "Nitrate", sourceName: "Bloc irrigue Gharb", location: "Gharb", period: "2022", measuredValue: 27.0, unit: "kg/ha" },
  { source: "Urbain", sourceType: "Apport diffus", parameter: "MES", sourceName: "Surface impermeabilisee Fes", location: "Fes", period: "2023", measuredValue: 13.0, unit: "kg/ha" },
  { source: "Erosion", sourceType: "Versant", parameter: "Sediments", sourceName: "Versant Sebou amont", location: "Sebou amont", period: "2024", measuredValue: 18.0, unit: "kg/ha" },
  { source: "Agriculture", sourceType: "Ruissellement diffus", parameter: "Phosphore", sourceName: "Parcelle Saiss sud", location: "Saiss", period: "2025", measuredValue: 8.4, unit: "kg/ha" },
];

const MODE_CONFIGS: Record<PollutionMode, ModeConfig> = {
  inventaire: {
    title: "Inventaire",
    description: "Sources et entites suivies",
    icon: "🗂️",
    buttonActive: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md",
    buttonIdle: "text-gray-600 hover:bg-blue-50 hover:text-blue-600",
    filterTitle: "Parametres inventaire",
    tableTitle: "Données d'inventaire",
    chartTitle: "Visualisation annuelle",
    chartColor: "#2563eb",
    showChart: false,
    rows: inventoryRows,
  },
  ponctuelle: {
    title: "Pollution ponctuelle",
    description: "Stations et points de rejet",
    icon: "🧪",
    buttonActive: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md",
    buttonIdle: "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600",
    filterTitle: "Parametres ponctuels",
    tableTitle: "Données pollution ponctuelle",
    chartTitle: "Visualisation annuelle",
    chartColor: "#4f46e5",
    showChart: true,
    rows: ponctuelleRows,
  },
  diffuse: {
    title: "Pollution diffuse",
    description: "Charges et tendances spatiales",
    icon: "🌿",
    buttonActive: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md",
    buttonIdle: "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600",
    filterTitle: "Parametres diffus",
    tableTitle: "Données pollution diffuse",
    chartTitle: "Visualisation annuelle",
    chartColor: "#059669",
    showChart: true,
    rows: diffuseRows,
  },
};

function PollutionModeBar({
  mode,
  onChange,
}: {
  mode: PollutionMode;
  onChange: (mode: PollutionMode) => void;
}) {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 bg-white p-1 shadow-sm md:grid-cols-3">
        {(Object.entries(MODE_CONFIGS) as Array<[PollutionMode, ModeConfig]>).map(([key, item]) => {
          const active = mode === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={[
                "flex items-center justify-between rounded-lg px-5 py-3 text-left transition-all duration-300",
                active ? item.buttonActive : item.buttonIdle,
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <div>
                  <div className="text-sm font-semibold">{item.title}</div>
                  <div className={`text-xs ${active ? "text-white/80" : "text-slate-500"}`}>{item.description}</div>
                </div>
              </div>
              {active && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CompactKpi({
  title,
  value,
  caption,
  tone,
}: {
  title: string;
  value: string | number;
  caption: string;
  tone: "blue" | "green" | "red" | "purple";
}) {
  const styles = {
    blue: "border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700",
    green: "border-emerald-200 bg-gradient-to-br from-green-50 to-emerald-50 text-green-700",
    red: "border-red-200 bg-gradient-to-br from-red-50 to-orange-50 text-red-700",
    purple: "border-purple-200 bg-gradient-to-br from-purple-50 to-fuchsia-50 text-purple-700",
  };

  return (
    <div className={`rounded-xl border shadow-sm ${styles[tone]}`}>
      <div className="p-4">
        <div className="text-xs font-semibold uppercase tracking-wider">{title}</div>
        <div className="mt-1 text-2xl font-bold text-gray-800">{value}</div>
        <div className="mt-1 text-xs text-gray-500">{caption}</div>
      </div>
    </div>
  );
}

function Panel({
  title,
  headerClassName,
  children,
}: {
  title: string;
  headerClassName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
      <div className={headerClassName}>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function PollutionWorkspace({ config }: { config: ModeConfig }) {
  const [source, setSource] = useState<string>("all");
  const [sourceType, setSourceType] = useState<string>("all");
  const [parameterSearch, setParameterSearch] = useState("");
  const [selectedParameter, setSelectedParameter] = useState<string>("all");
  const [selectedBarLabel, setSelectedBarLabel] = useState<string>("");

  const sourceOptions = useMemo(() => Array.from(new Set(config.rows.map((row) => row.source))), [config.rows]);

  const sourceTypeOptions = useMemo(
    () =>
      Array.from(
        new Set(
          config.rows
            .filter((row) => source === "all" || row.source === source)
            .map((row) => row.sourceType)
        )
      ),
    [config.rows, source]
  );

  const parameterOptions = useMemo(() => {
    const scopedRows = config.rows.filter((row) => {
      const sourceMatch = source === "all" || row.source === source;
      const typeMatch = sourceType === "all" || row.sourceType === sourceType;
      return sourceMatch && typeMatch;
    });

    return Array.from(new Set(scopedRows.map((row) => row.parameter))).filter((item) =>
      item.toLowerCase().includes(parameterSearch.toLowerCase())
    );
  }, [config.rows, parameterSearch, source, sourceType]);

  const filteredRows = useMemo(
    () =>
      config.rows.filter((row) => {
        const sourceMatch = source === "all" || row.source === source;
        const typeMatch = sourceType === "all" || row.sourceType === sourceType;
        const parameterMatch = selectedParameter === "all" || row.parameter === selectedParameter;
        return sourceMatch && typeMatch && parameterMatch;
      }),
    [config.rows, selectedParameter, source, sourceType]
  );

  const sourceTypesCount = useMemo(() => new Set(filteredRows.map((row) => row.sourceType)).size, [filteredRows]);
  const rowsCount = filteredRows.length;
  const periodsCount = useMemo(() => new Set(filteredRows.map((row) => row.period)).size, [filteredRows]);
  const averageValue = useMemo(() => {
    if (filteredRows.length === 0) return 0;
    return filteredRows.reduce((sum, row) => sum + row.measuredValue, 0) / filteredRows.length;
  }, [filteredRows]);

  const annualChartData = useMemo(() => {
    const grouped = filteredRows.reduce<
      Record<string, { period: string; parameter: string; value: number }>
    >((acc, row) => {
      const key = `${row.period}-${row.parameter}`;
      if (!acc[key]) {
        acc[key] = {
          period: row.period,
          parameter: row.parameter,
          value: 0,
        };
      }
      acc[key].value += row.measuredValue;
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => {
      if (Number(a.period) !== Number(b.period)) {
        return Number(a.period) - Number(b.period);
      }
      return a.parameter.localeCompare(b.parameter);
    });
  }, [filteredRows]);

  const exportTableExcel = () => {
    const exportRows = filteredRows.map((row) => ({
      Source: row.source,
      Type: row.sourceType,
      Parametre: row.parameter,
      "Nom source": row.sourceName,
      Localisation: row.location,
      Periode: row.period,
      Valeur: row.measuredValue,
      Unite: row.unit,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventaire");
    XLSX.writeFile(workbook, `pollution-${config.title.toLowerCase().replace(/\s+/g, "-")}.xlsx`);
  };

  const exportTablePdf = () => {
    const pdf = new jsPDF("l", "mm", "a4");
    pdf.setFontSize(14);
    pdf.text(config.tableTitle, 14, 14);

    autoTable(pdf, {
      startY: 20,
      head: [["Source", "Type", "Parametre", "Nom source", "Localisation", "Periode", "Valeur", "Unite"]],
      body: filteredRows.map((row) => [
        row.source,
        row.sourceType,
        row.parameter,
        row.sourceName,
        row.location,
        row.period,
        String(row.measuredValue),
        row.unit,
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [16, 185, 129],
      },
    });

    pdf.save(`pollution-${config.title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-3">
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3">
            <h3 className="flex items-center gap-2 font-semibold text-white">
              <span>⚙️</span> {config.filterTitle}
            </h3>
          </div>
          <div className="space-y-4 p-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Source de pollution</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
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
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
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
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
              <select
                value={selectedParameter}
                onChange={(e) => setSelectedParameter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              >
                <option value="all">Tous les parametres</option>
                {parameterOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-9 space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <CompactKpi title="Types de source" value={sourceTypesCount} caption="Filtres actifs" tone="blue" />
          <CompactKpi title="Lignes filtrees" value={rowsCount} caption="Résultats visibles" tone="green" />
          <CompactKpi title="Periodes" value={periodsCount} caption="Vue annuelle" tone="red" />
          <CompactKpi title="Valeur moyenne" value={averageValue.toFixed(1)} caption={filteredRows[0]?.unit ?? "—"} tone="purple" />
        </div>

        <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-3 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="font-medium text-gray-800">Vue d'analyse:</span>
            <span>{source === "all" ? "Toutes les sources" : source}</span>
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">Annuel</span>
            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
              {selectedParameter === "all" ? "Tous les parametres" : selectedParameter}
            </span>
          </div>
        </div>

        <div className={`grid grid-cols-1 gap-6 ${config.showChart ? "xl:grid-cols-5" : ""}`}>
          <div className={config.showChart ? "xl:col-span-3" : ""}>
            <Panel title={config.tableTitle} headerClassName="bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3">
              <div className="flex items-center justify-end gap-2 border-b border-slate-100 bg-white px-4 py-3">
                <button
                  type="button"
                  onClick={exportTableExcel}
                  disabled={!filteredRows.length}
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  Excel
                </button>
                <button
                  type="button"
                  onClick={exportTablePdf}
                  disabled={!filteredRows.length}
                  className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FileText className="h-3.5 w-3.5" />
                  PDF
                </button>
              </div>
              <div className="overflow-auto max-h-[460px]">
                <table className="min-w-full divide-y divide-slate-200 text-[13px]">
                  <thead className="sticky top-0 bg-slate-50">
                    <tr>
                      {["Source", "Type", "Parametre", "Nom source", "Localisation", "Periode", "Valeur", "Unite"].map((header) => (
                        <th key={header} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                    {filteredRows.map((row, idx) => (
                      <tr key={`${row.source}-${row.parameter}-${row.period}-${idx}`} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-medium">{row.source}</td>
                        <td className="px-4 py-2.5">{row.sourceType}</td>
                        <td className="px-4 py-2.5">{row.parameter}</td>
                        <td className="px-4 py-2.5">{row.sourceName}</td>
                        <td className="px-4 py-2.5">{row.location}</td>
                        <td className="px-4 py-2.5">{row.period}</td>
                        <td className="px-4 py-2.5 text-right font-medium">{row.measuredValue}</td>
                        <td className="px-4 py-2.5">{row.unit}</td>
                      </tr>
                    ))}
                    {filteredRows.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">
                          Aucun resultat pour ce filtrage.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

          {config.showChart ? (
          <div className="xl:col-span-2">
            <Panel title={config.chartTitle} headerClassName="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3">
              <div className="p-4">
                <div className="h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={annualChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(value: number) => value.toFixed(1)}
                        labelFormatter={(label, payload) => {
                          const parameter = payload?.[0]?.payload?.parameter;
                          return parameter ? `Année: ${label} | Paramètre: ${parameter}` : `Année: ${label}`;
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill={config.chartColor}
                        name="Valeur annuelle"
                        radius={[8, 8, 0, 0]}
                        onClick={(data) => setSelectedBarLabel(`${data.period} - ${data.parameter}`)}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 text-xs text-slate-600">
                  {selectedBarLabel ? `Barre sélectionnée: ${selectedBarLabel}` : "Cliquez sur une barre pour afficher son paramètre."}
                </div>
              </div>
            </Panel>
          </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function QualityDashboardContent() {
  const [mode, setMode] = useState<PollutionMode>("inventaire");
  const [inventoryRowsLive, setInventoryRowsLive] = useState<PollutionRow[]>(inventoryRows);

  useEffect(() => {
    fetchPollutionInventoryRows()
      .then((rows: PollutionInventoryRow[]) =>
        setInventoryRowsLive(
          rows.map((row) => ({
            source: row.source,
            sourceType: row.sourceType,
            parameter: row.parameter,
            sourceName: row.sourceName,
            location: row.location,
            period: row.period,
            measuredValue: row.measuredValue,
            unit: row.unit,
          }))
        )
      )
      .catch(() => setInventoryRowsLive(inventoryRows));
  }, []);

  const activeConfig = useMemo(() => {
    if (mode !== "inventaire") return MODE_CONFIGS[mode];
    return {
      ...MODE_CONFIGS.inventaire,
      rows: inventoryRowsLive,
    };
  }, [inventoryRowsLive, mode]);

  return (
    <div className="space-y-6">
      <PollutionModeBar mode={mode} onChange={setMode} />
      <PollutionWorkspace config={activeConfig} />
    </div>
  );
}
