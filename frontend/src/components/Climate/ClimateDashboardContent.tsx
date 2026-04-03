import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import ClimateFilters from "@/components/Climate/ClimateFilters";
import ClimateChart from "@/components/Climate/ClimateChart";
import ClimateTable from "@/components/Climate/ClimateTable";
import { getClimateTimeseries } from "@/api/climate";

type Selection = {
  stationId?: string;
  sourceType?: string;
  scenarioCode?: string;
  runId?: number;
  variable?: string;
  aggregation?: string;
  dateStart?: string;
  dateEnd?: string;
  tsId?: string;
};

function fmt(v: number | null) {
  return v === null ? "—" : v.toFixed(3);
}

function KpiCard({
  title,
  value,
  bg,
  icon,
}: {
  title: string;
  value: string;
  bg: "blue" | "green" | "red" | "purple";
  icon?: string;
}) {
  const bgMap: Record<string, string> = {
    blue: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
    green: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200",
    red: "bg-gradient-to-br from-red-50 to-orange-50 border-red-200",
    purple: "bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-200",
  };

  const textColors: Record<string, string> = {
    blue: "text-blue-700",
    green: "text-green-700",
    red: "text-red-700",
    purple: "text-purple-700",
  };

  return (
    <Card className={`relative overflow-hidden border p-4 shadow-sm transition-all hover:shadow-md ${bgMap[bg]}`}>
      {icon && <div className="absolute right-2 top-2 text-2xl opacity-20">{icon}</div>}
      <div className="relative">
        <div className={`text-xs font-semibold uppercase tracking-wider ${textColors[bg]}`}>{title}</div>
        <div className="mt-1 text-2xl font-bold text-gray-800">{value}</div>
      </div>
    </Card>
  );
}

function ActionButton({
  label,
  onClick,
  disabled = false,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label}
    </button>
  );
}

function OverlayModal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-6 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-200"
          >
            Fermer
          </button>
        </div>
        <div className="max-h-[calc(92vh-72px)] overflow-auto p-5">{children}</div>
      </div>
    </div>
  );
}

export default function ClimateDashboardContent() {
  const [selection, setSelection] = useState<Selection>({});
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [chartScale, setChartScale] = useState<"linear" | "log">("linear");
  const [expandedPanel, setExpandedPanel] = useState<"table" | "chart" | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);

  const values = series.map((r) => Number(r.value)).filter((v) => !Number.isNaN(v));
  const min = values.length ? Math.min(...values) : null;
  const max = values.length ? Math.max(...values) : null;
  const mean = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;

  const unit = selection.variable?.toLowerCase().includes("precip") ? "mm" : selection.variable?.toLowerCase().includes("temperature") ? "°C" : "";
  const varLabel =
    selection.variable?.toLowerCase().includes("temperature")
      ? "Température"
      : selection.variable?.toLowerCase().includes("precip")
      ? "Précipitation"
      : selection.variable || "Valeur";
  const varIcon = selection.variable?.toLowerCase().includes("temperature")
    ? "🌡️"
    : selection.variable?.toLowerCase().includes("precip")
    ? "☔"
    : "📊";

  const pasLabel =
    selection.aggregation === "daily"
      ? "Journalier"
      : selection.aggregation === "monthly"
      ? "Mensuel"
      : selection.aggregation === "annual"
      ? "Annuel"
      : selection.aggregation === "instantaneous"
      ? "Instantané"
      : "—";

  useEffect(() => {
    if (!selection.tsId || !selection.aggregation) {
      setSeries([]);
      return;
    }

    let cancelled = false;
    setSeries([]);
    setLoading(true);

    const load = async () => {
      try {
        const data = await getClimateTimeseries({
          ts_id: selection.tsId,
          time_step: selection.aggregation,
          date_start: selection.dateStart,
          date_end: selection.dateEnd,
        });
        if (!cancelled) setSeries(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) {
          console.error("Timeseries error:", err);
          setSeries([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [selection.tsId, selection.dateStart, selection.dateEnd, selection.aggregation]);

  const exportChartImage = async () => {
    const element = chartRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { backgroundColor: "#ffffff", scale: 2, logging: false });
    const link = document.createElement("a");
    link.download = "climat-graphe.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const exportChartPdf = async () => {
    const element = chartRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { backgroundColor: "#ffffff", scale: 2, logging: false });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;
    const ratio = Math.min(usableWidth / canvas.width, usableHeight / canvas.height);
    const renderWidth = canvas.width * ratio;
    const renderHeight = canvas.height * ratio;
    pdf.addImage(imgData, "PNG", (pageWidth - renderWidth) / 2, margin, renderWidth, renderHeight);
    pdf.save("climat-graphe.pdf");
  };

  const exportTableExcel = () => {
    if (!series.length) return;
    const rows = [...series].sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
    const html = `
      <table>
        <tr><th>Periode</th><th>Valeur</th></tr>
        ${rows.map((r) => `<tr><td>${r.datetime}</td><td>${Number(r.value).toFixed(3)}</td></tr>`).join("")}
      </table>
    `;
    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "climat-tableau.xls";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportTablePdf = () => {
    if (!series.length) return;
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.setFontSize(14);
    pdf.text("Tableau climat", 14, 15);
    pdf.setFontSize(10);
    let y = 24;
    pdf.text("Periode", 14, y);
    pdf.text("Valeur", 110, y);
    y += 6;
    [...series]
      .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
      .forEach((row) => {
        if (y > 285) {
          pdf.addPage();
          y = 15;
        }
        const period =
          selection.aggregation === "annual"
            ? String(new Date(row.datetime).getFullYear())
            : new Date(row.datetime).toLocaleDateString("fr-FR");
        pdf.text(period, 14, y);
        pdf.text(`${Number(row.value).toFixed(3)} ${unit}`, 110, y);
        y += 6;
      });
    pdf.save("climat-tableau.pdf");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="bg-gradient-to-r from-sky-600 to-blue-600 px-4 py-3">
              <h3 className="flex items-center gap-2 font-semibold text-white">
                <span>⚙️</span> Paramètres climatiques
              </h3>
            </div>
            <div className="p-4">
              <ClimateFilters onChange={setSelection} />
            </div>
          </div>
        </div>

        <div className="col-span-12 space-y-6 lg:col-span-9">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <KpiCard title="PAS DE TEMPS" value={pasLabel} bg="blue" icon="⏱️" />
            <KpiCard title="MINIMUM" value={`${fmt(min)} ${unit}`} bg="green" icon="⬇️" />
            <KpiCard title="MAXIMUM" value={`${fmt(max)} ${unit}`} bg="red" icon="⬆️" />
            <KpiCard title="MOYENNE" value={`${fmt(mean)} ${unit}`} bg="purple" icon="📊" />
          </div>

          {selection.dateStart && selection.dateEnd && (
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-blue-600">📅</span>
                <span className="text-sm text-gray-600">
                  Période d'analyse :
                  <span className="ml-1 font-semibold text-gray-800">
                    {selection.aggregation === "annual" ? new Date(selection.dateStart).getFullYear() : new Date(selection.dateStart).toLocaleDateString("fr-FR")}
                    {" - "}
                    {selection.aggregation === "annual" ? new Date(selection.dateEnd).getFullYear() : new Date(selection.dateEnd).toLocaleDateString("fr-FR")}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">{series.length} points</span>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  {varIcon} {varLabel}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3">
                <h3 className="flex items-center gap-2 font-semibold text-white">
                  <span>📋</span> Données {varLabel}
                </h3>
                <div className="flex items-center gap-2">
                  {unit && <span className="rounded-full bg-white/30 px-2 py-1 text-xs text-white">{unit}</span>}
                  <ActionButton label="⤢" onClick={() => setExpandedPanel("table")} disabled={!series.length} />
                  <ActionButton label="Excel" onClick={exportTableExcel} disabled={!series.length} />
                  <ActionButton label="PDF" onClick={exportTablePdf} disabled={!series.length} />
                </div>
              </div>
              <div className="p-0">
                <ClimateTable
                  tsId={selection.tsId}
                  unit={unit}
                  varLabel={varLabel}
                  dateStart={selection.dateStart}
                  dateEnd={selection.dateEnd}
                  aggregation={selection.aggregation}
                  loading={loading}
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="flex flex-col gap-3 bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-semibold text-white">
                    <span>📈</span> {varLabel} — Séries climatiques
                  </h3>
                  <div className="flex items-center gap-2">
                    <ActionButton label="⤢" onClick={() => setExpandedPanel("chart")} disabled={!series.length} />
                    <ActionButton label="PNG" onClick={exportChartImage} disabled={!series.length} />
                    <ActionButton label="PDF" onClick={exportChartPdf} disabled={!series.length} />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value as "line" | "bar")}
                    className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-white outline-none"
                  >
                    <option className="text-slate-900" value="line">Courbe</option>
                    <option className="text-slate-900" value="bar">Barres</option>
                  </select>
                  <select
                    value={chartScale}
                    onChange={(e) => setChartScale(e.target.value as "linear" | "log")}
                    className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-white outline-none"
                  >
                    <option className="text-slate-900" value="linear">Linéaire</option>
                    <option className="text-slate-900" value="log">Logarithmique</option>
                  </select>
                </div>
              </div>
              <div ref={chartRef} className="p-3">
                <ClimateChart
                  tsId={selection.tsId}
                  unit={unit}
                  varLabel={varLabel}
                  varIcon={varIcon}
                  dateStart={selection.dateStart}
                  dateEnd={selection.dateEnd}
                  aggregation={selection.aggregation}
                  chartType={chartType}
                  chartScale={chartScale}
                  loading={loading}
                />
              </div>
            </div>
          </div>

          {!selection.tsId && (
            <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 text-center">
              <div className="mb-4 text-7xl opacity-30">🌤️</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-700">Aucune donnée affichée</h3>
              <p className="mx-auto max-w-md text-gray-500">
                Sélectionnez une station, un type de série et une variable pour visualiser les données climatiques
              </p>
            </div>
          )}
        </div>
      </div>

      <OverlayModal open={expandedPanel === "table"} title="Tableau climat" onClose={() => setExpandedPanel(null)}>
        <ClimateTable
          tsId={selection.tsId}
          unit={unit}
          varLabel={varLabel}
          dateStart={selection.dateStart}
          dateEnd={selection.dateEnd}
          aggregation={selection.aggregation}
          loading={loading}
        />
      </OverlayModal>

      <OverlayModal open={expandedPanel === "chart"} title="Graphe climat" onClose={() => setExpandedPanel(null)}>
        <ClimateChart
          tsId={selection.tsId}
          unit={unit}
          varLabel={varLabel}
          varIcon={varIcon}
          dateStart={selection.dateStart}
          dateEnd={selection.dateEnd}
          aggregation={selection.aggregation}
          chartType={chartType}
          chartScale={chartScale}
          loading={loading}
        />
      </OverlayModal>
    </div>
  );
}
