import { Button } from "@/components/ui/button";
import ObservatoryParameterSummary from "@/components/observatory/ObservatoryParameterSummary";
import type { QualiteExposureRecord, QualiteExposureResponse } from "@/types/qualite";

interface ObservatoryDataPanelProps {
  response?: QualiteExposureResponse;
  loading: boolean;
  error?: unknown;
  onLoadMore: () => void;
}

function formatDate(value: string | null): string {
  if (!value) return "-";
  return value.slice(0, 10);
}

function formatValue(row: QualiteExposureRecord): string {
  if (row.valeur_num === null || Number.isNaN(row.valeur_num)) return String(row.valeur_raw ?? "-");
  const value = new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 4 }).format(row.valeur_num);
  return `${value}${row.unite_reference ? ` ${row.unite_reference}` : ""}`;
}

export default function ObservatoryDataPanel({
  response,
  loading,
  error,
  onLoadMore,
}: ObservatoryDataPanelProps) {
  const rows = response?.data ?? [];

  if (error) {
    return (
      <div className="rounded-xl border border-red-300/30 bg-red-950/30 p-3 text-xs text-red-100">
        Service temporairement indisponible.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-emerald-200/15 bg-slate-950/25 p-3 text-xs text-emerald-100/80">
        Chargement des valeurs filtrées...
      </div>
    );
  }

  if (!response) {
    return (
      <div className="rounded-xl border border-emerald-200/15 bg-slate-950/25 p-3 text-xs text-emerald-100/80">
        Sélectionnez un paramètre puis cliquez sur Afficher. Aucune valeur n'est chargée à l'ouverture du menu.
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="rounded-xl border border-emerald-200/15 bg-slate-950/25 p-3 text-xs text-emerald-100/80">
        Aucune donnée pour ces filtres.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <ObservatoryParameterSummary rows={rows} />
      {(response.count ?? 0) > rows.length && (
        <div className="rounded-lg border border-amber-300/20 bg-amber-950/20 p-2 text-[11px] text-amber-100">
          Volume total supérieur à la page affichée. Utilisez Charger plus ou resserrez les filtres.
        </div>
      )}
      <div className="max-h-64 overflow-auto rounded-xl border border-emerald-200/15">
        <table className="w-full text-[11px] text-emerald-50">
          <thead className="sticky top-0 bg-slate-950 text-emerald-100">
            <tr>
              <th className="px-2 py-1 text-left">Date</th>
              <th className="px-2 py-1 text-left">Paramètre</th>
              <th className="px-2 py-1 text-right">Valeur</th>
              <th className="px-2 py-1 text-left">Support</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.source_table}-${row.source_row_id ?? index}-${row.code_parametre}`} className="border-t border-emerald-200/10">
                <td className="px-2 py-1">{formatDate(row.date_mesure)}</td>
                <td className="px-2 py-1">{row.code_parametre}</td>
                <td className="px-2 py-1 text-right">{formatValue(row)}</td>
                <td className="px-2 py-1">{row.support_nom ?? row.support_type ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="w-full border-emerald-200/20 bg-slate-950/30 text-emerald-50 hover:bg-emerald-900/40"
        disabled={!response.metadata?.has_more}
        onClick={onLoadMore}
      >
        Charger plus
      </Button>
    </div>
  );
}
