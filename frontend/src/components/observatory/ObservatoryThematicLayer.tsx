import type { QualiteExposureRecord } from "@/types/qualite";

export interface ObservatoryThematicLayerProps {
  rows: QualiteExposureRecord[];
  enabled: boolean;
}

export default function ObservatoryThematicLayer({ rows, enabled }: ObservatoryThematicLayerProps) {
  if (!enabled) return null;

  return (
    <div className="rounded-xl border border-amber-300/20 bg-amber-950/20 p-2 text-[11px] text-amber-100">
      Couche thématique V2 prête à brancher sur MapLibre. Données disponibles : {rows.length}.
      L'intégration carte reste volontairement différée pour éviter une régression du Dashboard2 legacy.
    </div>
  );
}
