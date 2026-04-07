import type { Feature, FeatureCollection, Geometry } from "geojson";
import { api } from "@/api/client";
import { BUSINESS_LAYERS } from "@/layers/config";

type Range = { from?: string; to?: string };

export type BusinessLegendClass = {
  min: number;
  max: number;
  color: string;
  label: string;
};

export type BusinessLayerResult = {
  featureCollection: FeatureCollection;
  legend: BusinessLegendClass[];
  unit?: string;
  label: string;
};

export type HierarchyParameterSelection = {
  theme: string;
  sousMenu: string;
  paramCode: string;
  paramLabel: string;
  unit?: string | null;
  entityType: string;
  sourceTable?: string;
  timeStep?: "day" | "week" | "month";
  aggregation?: "avg" | "sum" | "min" | "max" | "median";
};

const DEFAULT_COLORS = ["#dbeafe", "#93c5fd", "#3b82f6", "#1e3a8a"];

function computeLegend(min: number, max: number): BusinessLegendClass[] {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
    const v = Number.isFinite(min) ? min : 0;
    return [{ min: v, max: v, color: DEFAULT_COLORS[2], label: `${v.toFixed(1)}` }];
  }
  const step = (max - min) / 4;
  return [
    { min, max: min + step, color: DEFAULT_COLORS[0], label: `${min.toFixed(1)} - ${(min + step).toFixed(1)}` },
    { min: min + step, max: min + 2 * step, color: DEFAULT_COLORS[1], label: `${(min + step).toFixed(1)} - ${(min + 2 * step).toFixed(1)}` },
    { min: min + 2 * step, max: min + 3 * step, color: DEFAULT_COLORS[2], label: `${(min + 2 * step).toFixed(1)} - ${(min + 3 * step).toFixed(1)}` },
    { min: min + 3 * step, max, color: DEFAULT_COLORS[3], label: `${(min + 3 * step).toFixed(1)} - ${max.toFixed(1)}` },
  ];
}

function getEntityId(feature: Feature): string | null {
  const p = feature.properties || {};
  const candidates = [
    p.station_id,
    p.legacy_station_id,
    p.code_station,
    p.legacy_code_station,
    p.barrage_id,
    p.subbasin_uid,
    p.subbasin_id,
    p.reseau_id,
    p.segment_local_id,
    p.source_id,
    p.id,
  ];
  for (const value of candidates) {
    if (value !== undefined && value !== null) return String(value);
  }
  return null;
}

function getGeoLayerForEntityType(entityType: string): string | null {
  if (entityType === "station") return "stations_abhs";
  if (entityType === "barrage") return "barrages_abhs";
  if (entityType === "sous_bassin_swat") return "sous_bassins_swat";
  if (entityType === "segment_reseau_hydro") return "reseau_hydro_abhs";
  if (entityType === "source_eau") return "sources";
  if (entityType === "nappe") return "nappes";
  if (entityType === "point_prelevement") return "points_eau";
  return null;
}

function getBusinessConfig(key: string) {
  return BUSINESS_LAYERS.find((x) => x.key === key) || null;
}

export async function buildBusinessLayer(
  businessKey: string,
  range?: Range
): Promise<BusinessLayerResult | null> {
  const cfg = getBusinessConfig(businessKey);
  if (!cfg || !cfg.geoLayers.length) return null;

  // Current implementation: business layers backed by aggregated "latest" endpoints
  let latestEndpoint = "";
  let params: Record<string, string> = {};

  if (businessKey === "temperature_stations") latestEndpoint = "/observatory/temperature/latest";
  if (businessKey === "niveau_barrage") latestEndpoint = "/observatory/barrage/latest";
  if (businessKey === "volume_barrage") {
    latestEndpoint = "/observatory/barrage/latest";
    params.metric = "volume_mm3";
  }
  if (businessKey === "lacher_barrage") {
    latestEndpoint = "/observatory/barrage/latest";
    params.metric = "lacher_m3s";
  }
  if (businessKey === "debit_stations") {
    latestEndpoint = "/hydro/latest";
    params.aggregation = "monthly";
  }
  if (businessKey === "precip_stations") {
    latestEndpoint = "/climate/latest";
    params.metric = "p_annuelle";
  }
  if (businessKey === "quality_ph") {
    latestEndpoint = "/quality/latest";
    params.parameter = "ph";
  }
  if (!latestEndpoint) return null;

  const geoLayerKey = cfg.geoLayers[0];
  const [geoRes, valRes] = await Promise.all([
    api.get<FeatureCollection>(`/layers/${geoLayerKey}?max_features=10000`),
    api.get<Array<{ entity_id: string; value: number }>>(latestEndpoint, {
      params: { ...params, date_start: range?.from, date_end: range?.to },
    }),
  ]);

  const byId = new Map<string, number>();
  for (const row of valRes.data || []) {
    if (!row || row.entity_id == null || row.value == null) continue;
    byId.set(String(row.entity_id), Number(row.value));
  }

  const features: Feature<Geometry, Record<string, unknown>>[] = [];
  const values: number[] = [];

  for (const f of geoRes.data.features || []) {
    const id = getEntityId(f as Feature);
    if (!id || !byId.has(id)) continue;
    const value = byId.get(id)!;
    values.push(value);
    features.push({
      ...(f as Feature<Geometry, Record<string, unknown>>),
      properties: {
        ...((f as Feature).properties || {}),
        display_value: value,
        business_key: businessKey,
        business_label: cfg.label,
        business_unit: cfg.unit || null,
      },
    });
  }

  if (!features.length) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const legend = computeLegend(min, max);

  return {
    featureCollection: { type: "FeatureCollection", features },
    legend,
    unit: cfg.unit,
    label: cfg.label,
  };
}

export async function buildHierarchyParameterLayer(
  selection: HierarchyParameterSelection,
  range?: Range
): Promise<BusinessLayerResult | null> {
  const geoLayerKey = getGeoLayerForEntityType(selection.entityType);
  if (!geoLayerKey) return null;

  const [geoRes, valRes] = await Promise.all([
    api.get<FeatureCollection>(`/layers/${geoLayerKey}?max_features=10000`),
    api.get<Array<{ entity_id: string; value: number }>>("/observatory/parameter/latest", {
      params: {
        theme: selection.theme,
        sous_menu: selection.sousMenu,
        param_code: selection.paramCode,
        source_table: selection.sourceTable,
        date_start: range?.from,
        date_end: range?.to,
        time_step: selection.timeStep || "day",
        aggregation: selection.aggregation || "avg",
      },
    }),
  ]);

  const byId = new Map<string, number>();
  for (const row of valRes.data || []) {
    if (!row || row.entity_id == null || row.value == null) continue;
    byId.set(String(row.entity_id), Number(row.value));
  }

  const features: Feature<Geometry, Record<string, unknown>>[] = [];
  const values: number[] = [];
  for (const f of geoRes.data.features || []) {
    const id = getEntityId(f as Feature);
    if (!id || !byId.has(id)) continue;
    const value = byId.get(id)!;
    values.push(value);
    features.push({
      ...(f as Feature<Geometry, Record<string, unknown>>),
      properties: {
        ...((f as Feature).properties || {}),
        display_value: value,
        business_key: selection.paramCode,
        business_label: selection.paramLabel,
        business_unit: selection.unit || null,
      },
    });
  }

  if (!features.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const legend = computeLegend(min, max);
  return {
    featureCollection: { type: "FeatureCollection", features },
    legend,
    unit: selection.unit || undefined,
    label: selection.paramLabel,
  };
}
