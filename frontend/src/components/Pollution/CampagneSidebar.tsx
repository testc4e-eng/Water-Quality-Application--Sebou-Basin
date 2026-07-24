import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCampagnes } from "@/hooks/usePollutionCampagnes";

export interface CampagneFilters {
  campagne: string;
  date_from: string;
  date_to: string;
  site: string;
  parametre: string;
}

interface CampagneSidebarProps {
  filters: CampagneFilters;
  onChange: (filters: CampagneFilters) => void;
}

const PARAMETRE_OPTIONS = [
  { value: "", label: "Tous" },
  { value: "Cd", label: "Cadmium (Cd)" },
  { value: "Pb", label: "Plomb (Pb)" },
  { value: "Hg", label: "Mercure (Hg)" },
  { value: "CrT", label: "Chrome total (CrT)" },
  { value: "As_", label: "Arsenic (As)" },
  { value: "Cu", label: "Cuivre (Cu)" },
  { value: "Ni", label: "Nickel (Ni)" },
  { value: "Zn", label: "Zinc (Zn)" },
  { value: "DBO5", label: "DBO5" },
  { value: "DCO", label: "DCO" },
  { value: "MES", label: "MES" },
  { value: "NH4_", label: "NH4" },
  { value: "NO3_", label: "NO3" },
  { value: "PT", label: "Phosphore total" },
  { value: "PO43_", label: "PO4" },
  { value: "NTK", label: "Azote Kjeldahl" },
  { value: "pH", label: "pH" },
  { value: "Conduc", label: "Conductivité" },
  { value: "O2_Diss", label: "O2 dissous" },
  { value: "T_eau", label: "Température eau" },
  { value: "Turbidité", label: "Turbidité" },
];

export default function CampagneSidebar({ filters, onChange }: CampagneSidebarProps) {
  const campagnesQuery = useCampagnes();
  const campagnes = campagnesQuery.data ?? [];

  const update = (patch: Partial<CampagneFilters>) => {
    onChange({ ...filters, ...patch });
  };

  const reset = () => {
    onChange({ campagne: "", date_from: "", date_to: "", site: "", parametre: "" });
  };

  return (
    <div className="flex h-full w-64 flex-col gap-4 border-r border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Filtres</h3>
        <Button variant="ghost" size="sm" onClick={reset} className="h-7 gap-1 px-2 text-xs">
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-500">Campagne</label>
        <select
          value={filters.campagne}
          onChange={(e) => update({ campagne: e.target.value })}
          className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">Toutes</option>
          {campagnes.map((c) => (
            <option key={c.campagne_id} value={c.campagne_id}>
              {c.campagne_id}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-500">Date début</label>
        <input
          type="date"
          value={filters.date_from}
          onChange={(e) => update({ date_from: e.target.value })}
          className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-500">Date fin</label>
        <input
          type="date"
          value={filters.date_to}
          onChange={(e) => update({ date_to: e.target.value })}
          className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-500">Site / point</label>
        <input
          type="text"
          placeholder="Rechercher..."
          value={filters.site}
          onChange={(e) => update({ site: e.target.value })}
          className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-500">Paramètre</label>
        <select
          value={filters.parametre}
          onChange={(e) => update({ parametre: e.target.value })}
          className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        >
          {PARAMETRE_OPTIONS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-auto rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
        <p className="font-medium">Données provisoires</p>
        <p className="mt-1 text-amber-700/80">
          Seuils métaux lourds à valider par le service qualité ABH Sebou.
        </p>
      </div>
    </div>
  );
}
