// frontend/src/layers/config.ts
// Refacto: separation explicite GEO (couches geom) vs BUSINESS (variables metier)

export type GeoLayerType = "point" | "line" | "polygon";

export type GeoLayer = {
  key: string;
  label: string;
  group: "Bassin versant" | "Stations" | "Infrastructure" | "Administratif" | "Pollution";
  type: GeoLayerType;
  defaultVisible?: boolean;
  defaultFillMode?: "solid" | "outline";
};

export type BusinessLayer = {
  key: string;
  label: string;
  group: "Meteo & Climat" | "Hydrologie" | "Qualite" | "Pollution";
  apiEndpoint: string;
  dataEndpoint?: string;
  geoLayers: string[];
  paramKey: string;
  unit?: string;
  renderType: "graduated_point" | "graduated_line" | "graduated_polygon" | "cluster";
  valueRange?: [number, number];
};

// 1) Entites geographiques
export const GEO_LAYERS: GeoLayer[] = [
  { key: "bassin_sebou", label: "Bassin du Sebou", group: "Bassin versant", type: "polygon", defaultVisible: true, defaultFillMode: "solid" },
  { key: "sous_bassin_sebou", label: "Sous-bassins ABH", group: "Bassin versant", type: "polygon", defaultVisible: true, defaultFillMode: "solid" },
  { key: "sous_bassins_swat", label: "Sous-bassins SWAT", group: "Bassin versant", type: "polygon", defaultVisible: false, defaultFillMode: "outline" },
  { key: "reseau_hydro_abhs", label: "Reseau hydrographique", group: "Bassin versant", type: "line", defaultVisible: true },
  { key: "nappes", label: "Nappes", group: "Bassin versant", type: "polygon", defaultVisible: false, defaultFillMode: "solid" },
  { key: "sources", label: "Sources", group: "Bassin versant", type: "point", defaultVisible: false },

  { key: "stations_abhs", label: "Stations hydrologiques", group: "Stations", type: "point", defaultVisible: false },
  { key: "points_eau", label: "Points d'eau", group: "Stations", type: "point", defaultVisible: false },

  { key: "barrages_abhs", label: "Barrages", group: "Infrastructure", type: "point", defaultVisible: false },
  { key: "step_abhs", label: "STEP", group: "Infrastructure", type: "point", defaultVisible: false },
  { key: "step_industrielles", label: "STEP industrielles", group: "Infrastructure", type: "point", defaultVisible: false },
  { key: "stm", label: "STM", group: "Infrastructure", type: "point", defaultVisible: false },
  { key: "fosses_septiques_abhs", label: "Fosses septiques", group: "Infrastructure", type: "point", defaultVisible: false },

  { key: "adm_regions_abhs", label: "Regions", group: "Administratif", type: "polygon", defaultVisible: false, defaultFillMode: "solid" },
  { key: "adm_provinces_abhs", label: "Provinces", group: "Administratif", type: "polygon", defaultVisible: false, defaultFillMode: "solid" },
  { key: "adm_cercles_abhs", label: "Cercles", group: "Administratif", type: "polygon", defaultVisible: false, defaultFillMode: "solid" },
  { key: "adm_communes_abhs", label: "Communes", group: "Administratif", type: "polygon", defaultVisible: false, defaultFillMode: "solid" },
  { key: "adm_villes_abhs", label: "Villes", group: "Administratif", type: "point", defaultVisible: false },
  { key: "adm_douars_abhs", label: "Douars", group: "Administratif", type: "point", defaultVisible: false },

  { key: "decharges_abhs", label: "Decharges", group: "Pollution", type: "point", defaultVisible: false },
  { key: "huileries_abhs", label: "Huileries", group: "Pollution", type: "point", defaultVisible: false },
  { key: "mines_abhs", label: "Mines", group: "Pollution", type: "point", defaultVisible: false },
  { key: "rejets_industriels_abhs", label: "Rejets industriels", group: "Pollution", type: "point", defaultVisible: false },
  { key: "rejets_domestiques_abhs", label: "Rejets domestiques", group: "Pollution", type: "point", defaultVisible: false },
];

// 2) Variables metier dynamiques
export const BUSINESS_LAYERS: BusinessLayer[] = [
  {
    key: "precip_stations",
    label: "Precipitation",
    group: "Meteo & Climat",
    apiEndpoint: "/climate/stations",
    dataEndpoint: "/climate/timeseries",
    geoLayers: ["stations_abhs"],
    paramKey: "p_annuelle",
    unit: "mm",
    renderType: "graduated_point",
    valueRange: [0, 500],
  },
  {
    key: "temperature_stations",
    label: "Temperature",
    group: "Meteo & Climat",
    apiEndpoint: "/observatory/temperature/stations",
    dataEndpoint: "/observatory/temperature/timeseries",
    geoLayers: ["stations_abhs"],
    paramKey: "val_moy",
    unit: "°C",
    renderType: "graduated_point",
    valueRange: [-5, 50],
  },
  {
    key: "debit_stations",
    label: "Debit",
    group: "Hydrologie",
    apiEndpoint: "/hydro/stations",
    dataEndpoint: "/hydro/timeseries",
    geoLayers: ["stations_abhs"],
    paramKey: "debit",
    unit: "m3/s",
    renderType: "graduated_point",
    valueRange: [0, 500],
  },
  {
    key: "niveau_barrage",
    label: "Niveau barrage",
    group: "Hydrologie",
    apiEndpoint: "/observatory/barrage/stations",
    dataEndpoint: "/observatory/barrage/timeseries",
    geoLayers: ["barrages_abhs"],
    paramKey: "cote_m",
    unit: "m",
    renderType: "graduated_point",
  },
  {
    key: "volume_barrage",
    label: "Volume barrage",
    group: "Hydrologie",
    apiEndpoint: "/observatory/barrage/stations",
    dataEndpoint: "/observatory/barrage/timeseries",
    geoLayers: ["barrages_abhs"],
    paramKey: "volume_mm3",
    unit: "Mm3",
    renderType: "graduated_point",
  },
  {
    key: "lacher_barrage",
    label: "Lacher barrage",
    group: "Hydrologie",
    apiEndpoint: "/observatory/barrage/stations",
    dataEndpoint: "/observatory/barrage/timeseries",
    geoLayers: ["barrages_abhs"],
    paramKey: "lacher_m3s",
    unit: "m3/s",
    renderType: "graduated_point",
  },
  {
    key: "quality_ph",
    label: "pH",
    group: "Qualite",
    apiEndpoint: "/quality/stations",
    dataEndpoint: "/quality/timeseries",
    geoLayers: ["stations_abhs"],
    paramKey: "ph",
    unit: "pH",
    renderType: "graduated_point",
    valueRange: [4, 10],
  },
  {
    key: "pollution_inventaire",
    label: "Inventaire pollution",
    group: "Pollution",
    apiEndpoint: "/quality/inventory/rows",
    geoLayers: ["decharges_abhs", "huileries_abhs", "mines_abhs", "step_abhs", "stm"],
    paramKey: "inventaire",
    renderType: "cluster",
  },
];

// --- Compatibilite avec le code existant (Dashboard2/SidebarFilters) ---
export const LAYERS = GEO_LAYERS.map((layer) => ({ key: layer.key, label: layer.label }));

export const DEFAULT_TOGGLES: Record<string, boolean> = GEO_LAYERS.reduce(
  (acc, layer) => {
    acc[layer.key] = !!layer.defaultVisible;
    return acc;
  },
  {} as Record<string, boolean>
);

export const DEFAULT_FILL_MODES: Record<string, "solid" | "outline"> = GEO_LAYERS.filter(
  (layer) => layer.type === "polygon"
).reduce(
  (acc, layer) => {
    acc[layer.key] = layer.defaultFillMode ?? "solid";
    return acc;
  },
  {} as Record<string, "solid" | "outline">
);
