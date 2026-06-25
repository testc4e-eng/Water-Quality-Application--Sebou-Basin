import { Badge } from "@/components/ui/badge";

export const QUALITY_CLASS_COLORS: Record<string, string> = {
  excellente: "#2563eb",
  bonne: "#16a34a",
  moyenne: "#f59e0b",
  mauvaise: "#dc2626",
  tres_mauvaise: "#7c3aed",
};

const QUALITY_LEGEND = [
  { code: "excellente", label: "Excellente", color: QUALITY_CLASS_COLORS.excellente },
  { code: "bonne", label: "Bonne", color: QUALITY_CLASS_COLORS.bonne },
  { code: "moyenne", label: "Moyenne", color: QUALITY_CLASS_COLORS.moyenne },
  { code: "mauvaise", label: "Mauvaise", color: QUALITY_CLASS_COLORS.mauvaise },
  { code: "tres_mauvaise", label: "Tres mauvaise", color: QUALITY_CLASS_COLORS.tres_mauvaise },
];

interface BusinessLegendProps {
  mode: "classification" | "metadata";
}

export function BusinessLegend({ mode }: BusinessLegendProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/95 p-3 text-xs shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-semibold text-slate-900">Legende</span>
        <Badge variant="outline" className="text-[10px]">
          {mode === "classification" ? "reglementaire" : "metadata"}
        </Badge>
      </div>

      {mode === "classification" ? (
        <div className="space-y-1.5">
          {QUALITY_LEGEND.map((item) => (
            <div key={item.code} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: item.color }} />
              <span className="text-slate-700">{item.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-slate-500" />
            <span className="text-slate-700">Non classifiable / absent</span>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-sky-600" />
            <span className="text-slate-700">Support metier</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-slate-700">A valider</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-slate-500" />
            <span className="text-slate-700">Donnee partielle</span>
          </div>
        </div>
      )}
    </div>
  );
}
