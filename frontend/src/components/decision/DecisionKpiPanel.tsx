import type { QualiteExposureResponse } from "@/types/qualite";

function formatNumber(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 3 }).format(value);
}

export default function DecisionKpiPanel({
  response,
  title,
}: {
  response?: QualiteExposureResponse;
  title: string;
}) {
  const rows = response?.data ?? [];
  const numeric = rows
    .map((item) => item.valeur_num)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  const supports = new Set(rows.map((item) => item.support_type).filter(Boolean));
  const min = numeric.length ? Math.min(...numeric) : null;
  const max = numeric.length ? Math.max(...numeric) : null;
  const avg = numeric.length ? numeric.reduce((sum, value) => sum + value, 0) / numeric.length : null;

  const metrics = [
    { label: "Lignes chargées", value: String(rows.length) },
    { label: "Supports couverts", value: String(supports.size) },
    { label: "Min", value: formatNumber(min) },
    { label: "Moyenne", value: formatNumber(avg) },
    { label: "Max", value: formatNumber(max) },
    { label: "Vue source", value: String(response?.metadata?.source_view ?? "aucune") },
  ];

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">KPIs</div>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{title}</h3>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-wide text-slate-600">
          {response ? response.status : "idle"}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">{metric.label}</div>
            <div className="mt-2 break-words text-lg font-semibold text-slate-900">{metric.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
