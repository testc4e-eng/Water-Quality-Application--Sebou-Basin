import { Checkbox } from "@/components/ui/checkbox";

interface LayerTogglePanelProps {
  entitiesVisible: boolean;
  onEntitiesVisibleChange: (visible: boolean) => void;
}

export function LayerTogglePanel({ entitiesVisible, onEntitiesVisibleChange }: LayerTogglePanelProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
      <div className="mb-2 font-semibold text-slate-900">Couches</div>
      <label className="flex items-center gap-2 text-slate-700">
        <Checkbox checked={entitiesVisible} onCheckedChange={(checked) => onEntitiesVisibleChange(Boolean(checked))} />
        Entites metier
      </label>
      <div className="mt-2 space-y-1 text-xs text-slate-500">
        <div>Contexte bassin : P1</div>
        <div>Reseau hydro : P1</div>
      </div>
    </div>
  );
}
