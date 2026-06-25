import type { QualiteExposureResponse } from "@/types/qualite";
import type { DecisionDisplayMode } from "@/config/decisionDashboardCatalog";

function formatValue(value: number | null, raw: string | number | null, unit?: string | null) {
  if (typeof value === "number" && Number.isFinite(value)) {
    const formatted = new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 3 }).format(value);
    return unit ? `${formatted} ${unit}` : formatted;
  }

  return String(raw ?? "-");
}

function buildSeries(response?: QualiteExposureResponse) {
  const bucket = new Map<string, { label: string; sum: number; count: number }>();

  for (const row of response?.data ?? []) {
    const key = (row.date_mesure ?? "").slice(0, 7) || "n/a";
    if (!bucket.has(key)) bucket.set(key, { label: key, sum: 0, count: 0 });
    if (typeof row.valeur_num === "number" && Number.isFinite(row.valeur_num)) {
      const current = bucket.get(key)!;
      current.sum += row.valeur_num;
      current.count += 1;
    }
  }

  return Array.from(bucket.values())
    .filter((item) => item.count > 0)
    .map((item) => ({ label: item.label, avg: item.sum / item.count }))
    .sort((a, b) => a.label.localeCompare(b.label))
    .slice(-8);
}

export default function DecisionDataPanel({
  response,
  loading,
  error,
  displayMode,
  submitted,
  comingSoonMessage,
}: {
  response?: QualiteExposureResponse;
  loading: boolean;
  error?: unknown;
  displayMode: DecisionDisplayMode;
  submitted: boolean;
  comingSoonMessage?: string | null;
}) {
  if (comingSoonMessage) {
    return (
      <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">État de disponibilité</div>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          {comingSoonMessage}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-[24px] border border-red-200 bg-white p-4 shadow-sm">
        <div className="text-sm text-red-700">Service indisponible pour cette sélection.</div>
      </section>
    );
  }

  if (!submitted) {
    return (
      <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">État initial</div>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          Choisir une vision, régler les filtres, puis cliquer sur Afficher.
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-sm text-slate-700">Chargement différé en cours...</div>
      </section>
    );
  }

  const rows = response?.data ?? [];

  if (!rows.length) {
    return (
      <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-sm text-slate-700">Aucune donnée retournée pour ces filtres.</div>
      </section>
    );
  }

  if (displayMode === "chart") {
    const series = buildSeries(response);
    const max = Math.max(...series.map((item) => item.avg), 1);

    return (
      <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Graphique</div>
            <div className="mt-1 text-sm text-slate-600">Moyenne par période sur la page chargée.</div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {series.map((point) => (
            <div key={point.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">{point.label}</div>
              <div className="mt-3 h-28 rounded-xl bg-slate-200/70 p-2">
                <div
                  className="w-full rounded-lg bg-gradient-to-t from-emerald-600 to-emerald-400"
                  style={{ height: `${Math.max(12, (point.avg / max) * 100)}%`, marginTop: "auto" }}
                />
              </div>
              <div className="mt-2 text-sm font-medium text-slate-900">
                {new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 3 }).format(point.avg)}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {displayMode === "table" ? "Tableau" : "Détail"}
        </div>
        <div className="mt-1 text-sm text-slate-600">
          {displayMode === "table"
            ? "Vue détaillée pour validation métier et lecture source."
            : "Résumé tabulaire complémentaire à la carte."}
        </div>
      </div>

      <div className="overflow-auto rounded-2xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Date</th>
              <th className="px-3 py-2 text-left font-medium">Support</th>
              <th className="px-3 py-2 text-left font-medium">Paramètre</th>
              <th className="px-3 py-2 text-right font-medium">Valeur</th>
              <th className="px-3 py-2 text-left font-medium">QA</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.source_row_id ?? index}-${row.code_parametre}`} className="border-t border-slate-200">
                <td className="px-3 py-2 text-slate-700">{(row.date_mesure ?? "-").slice(0, 10)}</td>
                <td className="px-3 py-2 text-slate-700">{row.support_nom ?? row.support_type ?? "-"}</td>
                <td className="px-3 py-2 text-slate-900">{row.code_parametre}</td>
                <td className="px-3 py-2 text-right text-slate-900">
                  {formatValue(row.valeur_num, row.valeur_raw, row.unite_reference)}
                </td>
                <td className="px-3 py-2 text-slate-700">{row.qa_status ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
