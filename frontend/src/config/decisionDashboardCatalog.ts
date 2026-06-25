import type { QualiteFamilyId } from "@/api/qualite";

export type DecisionViewId = "decision" | "analysis" | "campaigns";
export type DecisionDisplayMode = "map" | "table" | "chart";
export type DecisionFreshnessClassId = "realtime" | "recent" | "midterm" | "historical" | "archive";
export type DecisionCampaignStatus = "active" | "comingSoon";

export interface DecisionFreshnessClass {
  id: DecisionFreshnessClassId;
  label: string;
  definition: string;
  usage: string;
}

export interface DecisionViewDefinition {
  id: DecisionViewId;
  label: string;
  audience: string;
  description: string;
}

export interface DecisionFamilyDefinition {
  id: QualiteFamilyId;
  label: string;
  endpoint: string;
  view: string;
  description: string;
  defaultParameter: string;
  parameters: Array<{ code: string; label: string }>;
}

export interface DecisionCampaignDefinition {
  id: string;
  label: string;
  description: string;
  recommendedDisplay: string;
  status: DecisionCampaignStatus;
  dataSource: "qualite" | "comingSoon";
  availableFamilies?: QualiteFamilyId[];
}

export const decisionViews: DecisionViewDefinition[] = [
  {
    id: "decision",
    label: "Vue décisionnelle",
    audience: "DG / cadres ABH",
    description: "État récent du bassin, anomalies et points critiques avec priorité aux données récentes.",
  },
  {
    id: "analysis",
    label: "Analyse métier",
    audience: "Ingénieurs / analystes",
    description: "Exploration par domaine, sous-domaine, paramètre, période, support spatial et mode d'affichage.",
  },
  {
    id: "campaigns",
    label: "Campagnes / archives",
    audience: "Équipe technique",
    description: "Consultation séparée des campagnes, historiques et sources sans surcharger la carte décisionnelle.",
  },
];

export const freshnessClasses: DecisionFreshnessClass[] = [
  { id: "realtime", label: "Temps réel", definition: "Capteurs futurs", usage: "Surveillance" },
  { id: "recent", label: "Récent", definition: "0-12 mois", usage: "Décision actuelle" },
  { id: "midterm", label: "Moyen terme", definition: "1-5 ans", usage: "Tendance" },
  { id: "historical", label: "Historique", definition: ">5 ans", usage: "Comparaison" },
  { id: "archive", label: "Archive / legacy", definition: "Données anciennes ou remplacées", usage: "Consultation" },
];

export const supportOptions = [
  { value: "", label: "Tous supports" },
  { value: "RIVIERE", label: "Rivière" },
  { value: "NAPPE", label: "Nappe" },
  { value: "BARRAGE", label: "Barrage" },
  { value: "SEBOU", label: "Sebou" },
];

export const decisionFamilies: DecisionFamilyDefinition[] = [
  {
    id: "metaux",
    label: "Métaux",
    endpoint: "/api/v1/qualite/metaux",
    view: "api.v_qualite_metaux",
    description: "Qualité récente par métaux dissous et traces.",
    defaultParameter: "Mo",
    parameters: [
      { code: "Ag", label: "Argent" },
      { code: "Al", label: "Aluminium" },
      { code: "As", label: "Arsenic" },
      { code: "Cd", label: "Cadmium" },
      { code: "Cu", label: "Cuivre" },
      { code: "Fe", label: "Fer" },
      { code: "Mn", label: "Manganèse" },
      { code: "Mo", label: "Molybdène" },
      { code: "Ni", label: "Nickel" },
      { code: "Pb", label: "Plomb" },
      { code: "Zn", label: "Zinc" },
    ],
  },
  {
    id: "pollution-organique",
    label: "Pollution organique",
    endpoint: "/api/v1/qualite/pollution-organique",
    view: "api.v_qualite_pollution_organique",
    description: "Lecture décisionnelle des matières organiques et charges associées.",
    defaultParameter: "MO",
    parameters: [
      { code: "MO", label: "Matières organiques" },
      { code: "DBO5", label: "DBO5" },
      { code: "DCO", label: "DCO" },
      { code: "MES", label: "Matières en suspension" },
      { code: "Phenol", label: "Phénols" },
    ],
  },
  {
    id: "chimie-minerale",
    label: "Chimie minérale",
    endpoint: "/api/v1/qualite/chimie-minerale",
    view: "api.v_qualite_chimie_minerale",
    description: "Concentrations majeures et lecture support par support.",
    defaultParameter: "Ca",
    parameters: [
      { code: "Ca", label: "Calcium" },
      { code: "Mg", label: "Magnésium" },
      { code: "Na", label: "Sodium" },
      { code: "K", label: "Potassium" },
      { code: "Cl-", label: "Chlorures" },
      { code: "SO4--", label: "Sulfates" },
      { code: "HCO3-", label: "Bicarbonates" },
    ],
  },
  {
    id: "physicochimie",
    label: "Physico-chimie",
    endpoint: "/api/v1/qualite/physicochimie",
    view: "api.v_qualite_physicochimie",
    description: "Signaux rapides d'état du milieu et qualité courante.",
    defaultParameter: "pH",
    parameters: [
      { code: "pH", label: "Potentiel hydrogène" },
      { code: "Cond", label: "Conductivité" },
      { code: "O2_dissous", label: "Oxygène dissous" },
      { code: "Turbidite", label: "Turbidité" },
    ],
  },
];

export const campaignDefinitions: DecisionCampaignDefinition[] = [
  {
    id: "qualite-historique",
    label: "Qualité historique",
    description: "Stations et séries de qualité pour analyse métier et comparaison temporelle.",
    recommendedDisplay: "Analyse métier",
    status: "active",
    dataSource: "qualite",
    availableFamilies: ["metaux", "pollution-organique", "chimie-minerale", "physicochimie"],
  },
  {
    id: "inventaire-pollution",
    label: "Inventaire pollution",
    description: "Constats et sources d'inventaire pollution.",
    recommendedDisplay: "Carte points",
    status: "comingSoon",
    dataSource: "comingSoon",
  },
  {
    id: "analyses-finales-pollution",
    label: "Analyses finales pollution",
    description: "Prélèvements et mesures laboratoire après inventaire.",
    recommendedDisplay: "Carte + tableau",
    status: "comingSoon",
    dataSource: "comingSoon",
  },
  {
    id: "bathymetrie",
    label: "Bathymétrie",
    description: "Barrages et profils bathymétriques.",
    recommendedDisplay: "Consultation",
    status: "comingSoon",
    dataSource: "comingSoon",
  },
  {
    id: "capteurs",
    label: "Capteurs",
    description: "Flux quasi temps réel pour surveillance.",
    recommendedDisplay: "Surveillance",
    status: "comingSoon",
    dataSource: "comingSoon",
  },
  {
    id: "swat-wasp",
    label: "SWAT / WASP",
    description: "Scénarios de modélisation prospective.",
    recommendedDisplay: "Modélisation",
    status: "comingSoon",
    dataSource: "comingSoon",
  },
];

export function findDecisionFamily(familyId?: string | null): DecisionFamilyDefinition | null {
  if (!familyId) return null;
  return decisionFamilies.find((family) => family.id === familyId) ?? null;
}

export function findCampaignDefinition(campaignId?: string | null): DecisionCampaignDefinition | null {
  if (!campaignId) return null;
  return campaignDefinitions.find((campaign) => campaign.id === campaignId) ?? null;
}

function shiftDate(years = 0, months = 0): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  date.setMonth(date.getMonth() - months);
  return date.toISOString().slice(0, 10);
}

export function getPeriodForFreshness(
  freshness: DecisionFreshnessClassId
): { dateStart?: string; dateEnd?: string } {
  const today = new Date().toISOString().slice(0, 10);

  switch (freshness) {
    case "realtime":
      return { dateStart: shiftDate(0, 1), dateEnd: today };
    case "recent":
      return { dateStart: shiftDate(0, 12), dateEnd: today };
    case "midterm":
      return { dateStart: shiftDate(5, 0), dateEnd: today };
    case "historical":
      return { dateStart: "2000-01-01", dateEnd: shiftDate(5, 0) };
    case "archive":
      return { dateStart: "1990-01-01", dateEnd: shiftDate(10, 0) };
    default:
      return { dateStart: shiftDate(0, 12), dateEnd: today };
  }
}
