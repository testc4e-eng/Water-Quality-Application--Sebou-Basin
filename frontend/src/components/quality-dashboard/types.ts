export type QualitySupportFilter = "" | "SENTINELLE" | "RIVIERE" | "BARRAGE" | "NAPPE";

export interface QualityDashboardFilters {
  period: "12m" | "all";
  supportType: QualitySupportFilter;
  bassin: string;
  sousBassin: string;
  stationSearch: string;
  parameter: string;
}

export const DEFAULT_QUALITY_FILTERS: QualityDashboardFilters = {
  period: "all",
  supportType: "",
  bassin: "Sebou",
  sousBassin: "",
  stationSearch: "",
  parameter: "",
};

export function getQualityDateRange(period: QualityDashboardFilters["period"]) {
  if (period === "all") {
    return { dateStart: undefined, dateEnd: undefined, label: "Toutes les données" };
  }

  const dateEnd = new Date();
  const dateStart = new Date(dateEnd);
  dateStart.setFullYear(dateStart.getFullYear() - 1);

  return {
    dateStart: dateStart.toISOString().slice(0, 10),
    dateEnd: dateEnd.toISOString().slice(0, 10),
    label: "Derniers 12 mois",
  };
}
