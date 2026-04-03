// frontend/src/layers/config.ts
// Configuration centralisee des couches affichables sur la carte

export const LAYERS = [
  { key: "stms", label: "Stations de mesure (STMS)" },
  { key: "steps", label: "Stations d'epuration (STEP)" },
  { key: "steps_industrielles", label: "STEP industrielles" },
  { key: "decharges", label: "Decharges" },
  { key: "decharges_abandonnees", label: "Decharges abandonnees" },
  { key: "rejets_brutes", label: "Rejets brutes" },
  { key: "rejet_abattoir", label: "Rejets abattoirs" },
  { key: "huileries", label: "Huileries" },
  { key: "mines", label: "Mines" },
];

export const DEFAULT_TOGGLES: Record<string, boolean> = {
  stms: true,
  steps: false,
  steps_industrielles: false,
  decharges: false,
  decharges_abandonnees: false,
  rejets_brutes: false,
  rejet_abattoir: false,
  huileries: false,
  mines: false,
};
