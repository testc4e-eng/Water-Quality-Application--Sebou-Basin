export interface DeclarationPoint {
  longitude: number;
  latitude: number;
  source: "manual" | "map" | "preset";
}

export function formatDeclarationPointSource(source: DeclarationPoint["source"]) {
  if (source === "manual") return "Saisie manuelle";
  if (source === "map") return "Carte";
  return "Preset";
}

