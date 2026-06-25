import type { QualiteFamilyId } from "@/api/qualite";

export type ObservatoryDomainId = "meteo" | "hydrologie" | "qualite" | "pollution-idp" | "modelisation";
export type ObservatoryDisplayMode = "map" | "table" | "chart";
export type ObservatoryFamilyStatus = "active" | "comingSoon" | "disabled";

export interface ObservatoryParameter {
  code: string;
  label: string;
}

export interface ObservatoryFamily {
  id: string;
  label: string;
  endpoint?: string;
  view?: string;
  apiFamily?: QualiteFamilyId;
  parameters: ObservatoryParameter[];
  defaultParameter?: string;
  displayModes: ObservatoryDisplayMode[];
  rules: string[];
  status: ObservatoryFamilyStatus;
}

export interface ObservatoryDomain {
  id: ObservatoryDomainId;
  label: string;
  icon: string;
  families: ObservatoryFamily[];
}

const disabledFamilies = {
  parameters: [],
  displayModes: [],
  rules: ["Module à venir"],
  status: "comingSoon" as const,
};

export const observatoryCatalog: ObservatoryDomain[] = [
  {
    id: "meteo",
    label: "Météo",
    icon: "cloud-sun",
    families: [
      { id: "temperature", label: "Température", ...disabledFamilies },
      { id: "precipitation", label: "Précipitation", ...disabledFamilies },
      { id: "evaporation", label: "Évaporation", ...disabledFamilies },
    ],
  },
  {
    id: "hydrologie",
    label: "Hydrologie",
    icon: "waves",
    families: [
      { id: "debit", label: "Débit", ...disabledFamilies },
      { id: "barrages", label: "Barrages", ...disabledFamilies },
    ],
  },
  {
    id: "qualite",
    label: "Qualité de l’eau",
    icon: "flask",
    families: [
      {
        id: "metaux",
        label: "Métaux",
        endpoint: "/api/v1/qualite/metaux",
        view: "api.v_qualite_metaux",
        apiFamily: "metaux",
        parameters: [
          { code: "Ag", label: "Argent" },
          { code: "Al", label: "Aluminium" },
          { code: "As", label: "Arsenic" },
          { code: "Ba", label: "Baryum" },
          { code: "Cd", label: "Cadmium" },
          { code: "Cu", label: "Cuivre" },
          { code: "Fe", label: "Fer" },
          { code: "Mn", label: "Manganèse" },
          { code: "Mo", label: "Molybdène" },
          { code: "Ni", label: "Nickel" },
          { code: "Pb", label: "Plomb" },
          { code: "Zn", label: "Zinc" },
        ],
        defaultParameter: "Mo",
        displayModes: ["table", "chart"],
        rules: ["MO != Mo", "Paramètres hors périmètre exclus de l'exposition"],
        status: "active",
      },
      {
        id: "chimie-minerale",
        label: "Chimie minérale",
        endpoint: "/api/v1/qualite/chimie-minerale",
        view: "api.v_qualite_chimie_minerale",
        apiFamily: "chimie-minerale",
        parameters: [
          { code: "Ca", label: "Calcium" },
          { code: "Mg", label: "Magnésium" },
          { code: "Na", label: "Sodium" },
          { code: "K", label: "Potassium" },
          { code: "Cl-", label: "Chlorures" },
          { code: "SO4--", label: "Sulfates" },
          { code: "HCO3-", label: "Bicarbonates" },
        ],
        defaultParameter: "Ca",
        displayModes: ["table", "chart"],
        rules: ["Endpoint spécialisé P0", "Paramètre obligatoire avant chargement"],
        status: "active",
      },
      {
        id: "physicochimie",
        label: "Physico-chimie",
        endpoint: "/api/v1/qualite/physicochimie",
        view: "api.v_qualite_physicochimie",
        apiFamily: "physicochimie",
        parameters: [
          { code: "pH", label: "Potentiel hydrogène" },
          { code: "Cond", label: "Conductivité" },
          { code: "O2_dissous", label: "Oxygène dissous" },
          { code: "Turbidite", label: "Turbidité" },
        ],
        defaultParameter: "pH",
        displayModes: ["table", "chart"],
        rules: ["Endpoint spécialisé P0", "COULEUR hors analytics"],
        status: "active",
      },
      {
        id: "pollution-organique",
        label: "Pollution organique",
        endpoint: "/api/v1/qualite/pollution-organique",
        view: "api.v_qualite_pollution_organique",
        apiFamily: "pollution-organique",
        parameters: [
          { code: "MO", label: "Matières organiques" },
          { code: "DBO5", label: "DBO5" },
          { code: "DCO", label: "DCO" },
          { code: "MES", label: "Matières en suspension" },
          { code: "Phenol", label: "Phénols" },
        ],
        defaultParameter: "MO",
        displayModes: ["table", "chart"],
        rules: ["MO = matières organiques", "Mo reste réservé aux métaux"],
        status: "active",
      },
      { id: "microbiologie", label: "Microbiologie", ...disabledFamilies },
      { id: "biologique", label: "Biologique", ...disabledFamilies },
      { id: "terrain", label: "Terrain", ...disabledFamilies },
      { id: "organoleptique", label: "Organoleptique", ...disabledFamilies },
    ],
  },
  {
    id: "pollution-idp",
    label: "Pollution / IDP",
    icon: "factory",
    families: [
      { id: "inventaire", label: "Inventaire pollution", ...disabledFamilies },
      { id: "points", label: "Points IDP", ...disabledFamilies },
    ],
  },
  {
    id: "modelisation",
    label: "Modélisation",
    icon: "network",
    families: [
      { id: "swat", label: "SWAT", ...disabledFamilies },
      { id: "wasp", label: "WASP", ...disabledFamilies },
    ],
  },
];

export function findObservatoryFamily(domainId?: string, familyId?: string): ObservatoryFamily | null {
  const domain = observatoryCatalog.find((item) => item.id === domainId);
  return domain?.families.find((family) => family.id === familyId) ?? null;
}
