import { api } from "./client";

export type HierTheme = { theme: string; n_items: number };
export type HierSubmenu = { sous_menu: string; n_items: number };
export type HierParameter = {
  param_code: string;
  param_label: string;
  unite: string | null;
  entity_type: string;
  source_schema: string;
  source_table: string;
  source_column: string;
  is_modeled: boolean;
};

export async function getTemperatureStations() {
  const { data } = await api.get("/observatory/temperature/stations");
  return data;
}

export async function getTemperatureTimeseries(stationId: string, dateStart?: string, dateEnd?: string) {
  const { data } = await api.get("/observatory/temperature/timeseries", {
    params: { station_id: stationId, date_start: dateStart, date_end: dateEnd },
  });
  return data;
}

export async function getBarrageStations() {
  const { data } = await api.get("/observatory/barrage/stations");
  return data;
}

export async function getBarrageTimeseries(
  barrageId: string,
  metric: "niveau_barrage" | "volume_barrage" | "lacher_barrage" | "apport" | "apports_hm3" | "transfert" = "niveau_barrage",
  dateStart?: string,
  dateEnd?: string
) {
  const { data } = await api.get("/observatory/barrage/timeseries", {
    params: { barrage_id: barrageId, metric, date_start: dateStart, date_end: dateEnd },
  });
  return data;
}

export async function getHierarchyThemes(): Promise<HierTheme[]> {
  const { data } = await api.get("/observatory/hierarchy/themes");
  return data;
}

export async function getHierarchySubmenus(theme: string): Promise<HierSubmenu[]> {
  const { data } = await api.get("/observatory/hierarchy/submenus", { params: { theme } });
  return data;
}

export async function getHierarchyParameters(theme: string, sousMenu: string): Promise<HierParameter[]> {
  const { data } = await api.get("/observatory/hierarchy/parameters", {
    params: { theme, sous_menu: sousMenu },
  });
  return data;
}

export async function getParameterTimeseries(params: {
  theme: string;
  sous_menu: string;
  param_code: string;
  entity_id: string;
  date_start?: string;
  date_end?: string;
}) {
  const { data } = await api.get("/observatory/parameter/timeseries", { params });
  return data;
}

export async function getParameterEntities(params: {
  theme: string;
  sous_menu: string;
  param_code: string;
}) {
  const { data } = await api.get("/observatory/parameter/entities", { params });
  return data;
}
