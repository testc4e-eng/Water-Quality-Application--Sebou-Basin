// ✅ frontend/src/layers/config.ts
// Configuration centralisée des couches affichables sur la carte

export const LAYERS = [
  { key: "bassin_sebou", label: "Bassin du Sebou" },
  { key: "sous_bassin_sebou", label: "Sous-bassins" },
  { key: "reseau_hydro_abhs", label: "Réseau hydrographique" },

  { key: "barrages_abhs", label: "Barrages" },
  { key: "stations_abhs", label: "Stations hydrologiques" },

  { key: "adm_regions_abhs", label: "Régions" },
  { key: "adm_provinces_abhs", label: "Provinces" },
  { key: "adm_cercles_abhs", label: "Cercles" },
  { key: "adm_communes_abhs", label: "Communes" },
  { key: "adm_villes_abhs", label: "Villes" },
  { key: "adm_douars_abhs", label: "Douars" },
];

export const DEFAULT_TOGGLES: Record<string, boolean> = {
  bassin_sebou: true,
  sous_bassin_sebou: true,
  reseau_hydro_abhs: true,

  barrages_abhs: false,
  stations_abhs: false,

  adm_regions_abhs: false,
  adm_provinces_abhs: false,
  adm_cercles_abhs: false,
  adm_communes_abhs: false,
  adm_villes_abhs: false,
  adm_douars_abhs: false,
};
