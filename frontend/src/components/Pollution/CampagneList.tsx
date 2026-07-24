import { FlaskConical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { PrelevementListItem } from "@/api/pollutionCampagnes";

interface CampagneListProps {
  prelevements: PrelevementListItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading?: boolean;
}

export default function CampagneList({ prelevements, selectedId, onSelect, loading }: CampagneListProps) {
  if (loading) {
    return <div className="p-4 text-sm text-slate-400">Chargement des prélèvements...</div>;
  }

  if (prelevements.length === 0) {
    return (
      <div className="p-4 text-sm text-slate-400">
        Aucun prélèvement ne correspond aux filtres.
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {prelevements.map((p) => (
        <button
          key={p.id_prelevement}
          type="button"
          onClick={() => onSelect(p.id_prelevement)}
          className={`w-full px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
            selectedId === p.id_prelevement ? "bg-indigo-50" : ""
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-slate-900">
                {p.point_prelevement || "Point sans nom"}
              </div>
              <div className="mt-0.5 text-xs text-slate-500">
                {new Date(p.date_prelevement).toLocaleDateString("fr-MA")} — {p.campagne_id}
              </div>
            </div>
            {p.nb_alertes > 0 && (
              <Badge variant="destructive" className="shrink-0 text-[10px]">
                {p.nb_alertes}
              </Badge>
            )}
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <FlaskConical className="h-3 w-3" />
              {p.nb_mesures} mesures
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
