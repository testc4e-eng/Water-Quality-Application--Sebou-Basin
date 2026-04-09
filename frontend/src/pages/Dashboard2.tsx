import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import maplibregl, {
  Map as MapLibreMap,
  GeoJSONSource,
  LayerSpecification,
  StyleSpecification,
} from "maplibre-gl";
import * as turf from "@turf/turf";
import { Layers3, PanelLeft, X } from "lucide-react";

import SidebarFilters, { LayersState } from "@/components/Filters/SidebarFilters";
import MapLegend from "@/components/Map/MapLegend";

import { api } from "@/api/client";
import { DEFAULT_TOGGLES, DEFAULT_FILL_MODES } from "@/layers/config";
import {
  buildBusinessLayer,
  buildHierarchyParameterLayer,
  type BusinessLegendClass,
  type HierarchyParameterSelection,
} from "@/layers/layerManager";
import {
  getHierarchyThemes,
  getHierarchySubmenus,
  getHierarchyParameters,
  type HierTheme,
  type HierSubmenu,
  type HierParameter,
} from "@/api/observatory";
import type { FeatureCollection } from "geojson";
import type { Feature, Geometry } from "geojson";

interface Station {
  id: number;
  name: string;
  river?: string | null;
  lat: number;
  lon: number;
}


function geomKind(fc: FeatureCollection): "point" | "line" | "polygon" {
  const f = fc.features?.[0];
  const t = (f?.geometry?.type || "").toLowerCase();
  if (t.includes("point")) return "point";
  if (t.includes("line")) return "line";
  return "polygon";
}

type CoverageResponse = {
  entity_count?: number;
  entity_ids?: string[];
};

type TimelineResponse = {
  dates?: string[];
  min_date?: string | null;
  max_date?: string | null;
  count?: number;
};

type EntityDetailsResponse = {
  properties?: Record<string, unknown>;
};

type EntitySeriesRow = {
  source_table: string;
  ts: string;
  parameter: string;
  value: number;
  unit?: string | null;
};

type EntitySeriesResponse = {
  rows?: EntitySeriesRow[];
  offset?: number;
  has_more?: boolean;
};

type HierarchyKpiResponse = {
  count?: number;
  min?: number | null;
  max?: number | null;
  avg?: number | null;
};

type PopupRulesResponse = {
  rules?: Record<
    string,
    {
      title?: string;
      name_fields?: string[];
      type_fields?: string[];
      class_fields?: string[];
      code_fields?: string[];
    }
  >;
};

function isValidFeatureForMap(feature: Feature<Geometry, any>): boolean {
  const g = feature?.geometry;
  if (!g) return false;
  const type = g.type;
  const coords: any = (g as any).coordinates;

  const validLonLat = (lon: number, lat: number) =>
    Number.isFinite(lon) &&
    Number.isFinite(lat) &&
    lon !== 0 &&
    lat !== 0 &&
    Math.abs(lon) <= 180 &&
    Math.abs(lat) <= 90;

  if (type === "Point" && Array.isArray(coords) && coords.length >= 2) {
    return validLonLat(Number(coords[0]), Number(coords[1]));
  }
  if (type === "MultiPoint" && Array.isArray(coords)) {
    return coords.some((p: any) => Array.isArray(p) && p.length >= 2 && validLonLat(Number(p[0]), Number(p[1])));
  }
  return true;
}

type PopupRule = {
  title: string;
  nameFields: string[];
  typeFields?: string[];
  classFields?: string[];
  codeFields?: string[];
};

const DEFAULT_POPUP_RULES: Record<string, PopupRule> = {
  bassin_sebou: {
    title: "Bassin versant",
    nameFields: ["nom", "bassin", "name", "label"],
    classFields: ["type_bassin", "classe"],
    codeFields: ["code_bassin", "bassin_code", "id"],
  },
  sous_bassin_sebou: {
    title: "Sous-bassin ABH",
    nameFields: ["nom_sous_bassin", "sous_bassin", "name", "label"],
    classFields: ["classe", "categorie"],
    codeFields: ["code_sous_bassin", "id"],
  },
  sous_bassins_swat: {
    title: "Sous-bassin SWAT",
    nameFields: ["name", "label", "subbasin_nom"],
    classFields: ["scenario", "bassin_nom"],
    codeFields: ["subbasin_uid", "subbasin_id", "id"],
  },
  reseau_hydro_abhs: {
    title: "Segment hydrographique",
    nameFields: ["nom_oued", "nom", "name", "label"],
    typeFields: ["type", "categorie", "class_hydro"],
    codeFields: ["reseau_id", "segment_local_id", "id_oued", "id"],
  },
  nappes: {
    title: "Nappe",
    nameFields: ["nom_nappe", "name", "label"],
    classFields: ["type_nappe", "classe"],
    codeFields: ["code_nappe", "code", "id"],
  },
  sources: {
    title: "Source d'eau",
    nameFields: ["nom_source", "name", "label"],
    typeFields: ["type_source", "source_type", "categorie"],
    codeFields: ["code_source", "code", "source_id", "id"],
  },
  stations_abhs: {
    title: "Station",
    nameFields: ["station_nom", "nom_station", "name", "label"],
    typeFields: ["type_station", "station_type", "categorie"],
    codeFields: ["code_station", "legacy_code_station", "station_id", "legacy_station_id", "id"],
  },
  points_eau: {
    title: "Point d'eau",
    nameFields: ["nom_pt_eau", "name", "label"],
    typeFields: ["type_point_eau", "type_source", "categorie"],
    codeFields: ["code_pt_eau", "point_eau_id", "id"],
  },
  barrages_abhs: {
    title: "Barrage",
    nameFields: ["nom_barrage", "name", "label"],
    typeFields: ["type_barrage", "categorie"],
    classFields: ["statut"],
    codeFields: ["ire", "barrage_id", "id"],
  },
  step_abhs: {
    title: "STEP",
    nameFields: ["nom_step", "name", "label", "code_step"],
    typeFields: ["type_step", "categorie"],
    codeFields: ["code_step", "step_id", "id"],
  },
  step_industrielles: {
    title: "STEP industrielle",
    nameFields: ["nom_step", "name", "label", "code_step"],
    typeFields: ["type_step", "categorie"],
    codeFields: ["code_step", "step_id", "id"],
  },
  stm: {
    title: "STM",
    nameFields: ["nom_stm", "name", "label", "code_stm"],
    typeFields: ["type_stm", "categorie"],
    codeFields: ["code_stm", "stm_id", "id"],
  },
  decharges_abhs: {
    title: "Décharge",
    nameFields: ["nom_decharge", "nom_site", "name", "label"],
    typeFields: ["type_decharge", "categorie"],
    codeFields: ["code_decharge", "decharge_id", "id"],
  },
  huileries_abhs: {
    title: "Huilerie",
    nameFields: ["nom_huilerie", "name", "label"],
    typeFields: ["type_huilerie", "categorie"],
    codeFields: ["code_huilerie", "huilerie_id", "id"],
  },
  mines_abhs: {
    title: "Mine",
    nameFields: ["nom_mine", "name", "label"],
    typeFields: ["type_mine", "categorie"],
    codeFields: ["code_mine", "mine_id", "id"],
  },
  adm_regions_abhs: {
    title: "Région",
    nameFields: ["region_fr", "name", "label"],
    codeFields: ["code_region", "id"],
  },
  adm_provinces_abhs: {
    title: "Province / Préfecture",
    nameFields: ["province_fr", "name", "label"],
    codeFields: ["code_province", "id"],
  },
  adm_cercles_abhs: {
    title: "Cercle",
    nameFields: ["cercle_fr", "name", "label"],
    codeFields: ["code_cercle", "id"],
  },
  adm_communes_abhs: {
    title: "Commune",
    nameFields: ["commune_fr", "name", "label"],
    codeFields: ["code_commune", "id"],
  },
  adm_villes_abhs: {
    title: "Ville",
    nameFields: ["ville_fr", "commune_fr", "name", "label"],
    codeFields: ["code_ville", "code_commune", "id"],
  },
  adm_douars_abhs: {
    title: "Douar",
    nameFields: ["douar_fr", "name", "label"],
    codeFields: ["code_douar", "id"],
  },
};

function pickFirstProp(props: Record<string, any>, fields: string[] = []): string | null {
  for (const f of fields) {
    const v = props?.[f];
    if (v === undefined || v === null) continue;
    const s = String(v).trim();
    if (!s) continue;
    return s;
  }
  return null;
}

function makeRasterStyle(
  id: string,
  tiles: string[],
  attribution: string,
  tileSize = 256
): StyleSpecification {
  return {
    version: 8,
    sources: {
      [id]: {
        type: "raster",
        tiles,
        tileSize,
        attribution,
      },
    },
    layers: [
      {
        id,
        type: "raster",
        source: id,
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  };
}

const BASEMAP_OPTIONS = [
  {
    id: "carto-light-nolabels",
    label: "Clair (sans libellés)",
    style: makeRasterStyle(
      "carto-light-nolabels",
      ["https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"],
      "© OpenStreetMap © CARTO"
    ),
  },
  {
    id: "carto-dark-nolabels",
    label: "Sombre (sans libellés)",
    style: makeRasterStyle(
      "carto-dark-nolabels",
      ["https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"],
      "© OpenStreetMap © CARTO"
    ),
  },
  {
    id: "topo",
    label: "Topographique",
    style: makeRasterStyle(
      "topo",
      ["https://tile.opentopomap.org/{z}/{x}/{y}.png"],
      "© OpenTopoMap © OpenStreetMap contributors"
    ),
  },
  {
    id: "satellite",
    label: "Satellite",
    style: makeRasterStyle(
      "satellite",
      ["https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
      "Tiles © Esri"
    ),
  },
];

async function loadStations(): Promise<Station[]> {
  try {
    const res = await api.get<Station[]>("/stations");
    return (res.data || []).map((s) => ({
      id: Number(s.id),
      name: String(s.name),
      river: s.river ?? null,
      lat: Number((s as Station).lat),
      lon: Number((s as Station).lon),
    }));
  } catch {
    return [];
  }
}

const PARAM_TO_BUSINESS_KEY: Record<string, string> = {
  TEMP_MOY: "temperature_stations",
  TEMP_MIN: "temperature_stations",
  TEMP_MAX: "temperature_stations",
  PRECIP: "precip_stations",
  DEBIT: "debit_stations",
  NIVEAU_BARRAGE: "niveau_barrage",
  VOLUME_BARRAGE: "volume_barrage",
  LACHER_BARRAGE: "lacher_barrage",
  PH: "quality_ph",
};

export default function Dashboard2() {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [range, setRange] = useState<{ from: string; to: string }>({
    from: "2024-01-01",
    to: todayStr,
  });

  const [layers, setLayers] = useState<LayersState>({
    toggles: { ...DEFAULT_TOGGLES },
    fill_modes: { ...DEFAULT_FILL_MODES },
    barrages_list: {},
    sous_bassins_list: {},
    stations_list: {},
    zones_admin_list: {},
  });

  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [basemapOpen, setBasemapOpen] = useState(false);
  const [layersPanelOpen, setLayersPanelOpen] = useState(false);
  const [basemapId, setBasemapId] = useState("satellite");
  const [styleRevision, setStyleRevision] = useState(0);
  const [activeFilterSelection, setActiveFilterSelection] = useState<{
    type: string;
    ids: string[];
  } | null>(null);
  const [viewportBbox, setViewportBbox] = useState<string | null>(null);
  const [debouncedViewportBbox, setDebouncedViewportBbox] = useState<string | null>(null);
  const [selectedBusinessKey, setSelectedBusinessKey] = useState<string>("");
  const [hierThemes, setHierThemes] = useState<HierTheme[]>([]);
  const [hierSubmenus, setHierSubmenus] = useState<HierSubmenu[]>([]);
  const [hierParameters, setHierParameters] = useState<HierParameter[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [selectedSubmenu, setSelectedSubmenu] = useState<string>("");
  const [selectedParamCode, setSelectedParamCode] = useState<string>("");
  const [selectedParamSourceTable, setSelectedParamSourceTable] = useState<string>("");
  const [businessLegend, setBusinessLegend] = useState<BusinessLegendClass[]>([]);
  const [businessLabel, setBusinessLabel] = useState<string>("");
  const [businessUnit, setBusinessUnit] = useState<string>("");
  const [businessLoading, setBusinessLoading] = useState(false);
  const [selectedEntityDetails, setSelectedEntityDetails] = useState<{
    layerKey: string;
    entityId: string;
    properties: Record<string, unknown>;
  } | null>(null);
  const [entityPanelOpen, setEntityPanelOpen] = useState(false);
  const [entityFilterQuery, setEntityFilterQuery] = useState("");
  const [entitySeriesRows, setEntitySeriesRows] = useState<EntitySeriesRow[]>([]);
  const [entitySeriesLoading, setEntitySeriesLoading] = useState(false);
  const [entitySortBy, setEntitySortBy] = useState<"ts" | "parameter" | "value" | "source_table">("ts");
  const [entitySortDir, setEntitySortDir] = useState<"asc" | "desc">("desc");
  const [entitySeriesOffset, setEntitySeriesOffset] = useState(0);
  const [entitySeriesHasMore, setEntitySeriesHasMore] = useState(false);
  const [onlyEntitiesWithValues, setOnlyEntitiesWithValues] = useState(false);
  const [coverageLoading, setCoverageLoading] = useState(false);
  const [coverageCount, setCoverageCount] = useState<number | null>(null);
  const [timelineDates, setTimelineDates] = useState<string[]>([]);
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [timelinePlaying, setTimelinePlaying] = useState(false);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineStep, setTimelineStep] = useState<"day" | "week" | "month">("day");
  const timelineCacheRef = useRef<Map<string, string[]>>(new Map());
  const [valueAggregation, setValueAggregation] = useState<"avg" | "sum" | "min" | "max" | "median">("avg");
  const [businessStats, setBusinessStats] = useState<{ min: number; max: number; avg: number; count: number } | null>(null);
  const [kpiLoading, setKpiLoading] = useState(false);
  const [popupMode, setPopupMode] = useState<"compact" | "expert">("compact");
  const [popupRules, setPopupRules] = useState<Record<string, PopupRule>>(DEFAULT_POPUP_RULES);

  const layerMaxFeatures = useMemo(
    () => ({
      adm_communes_abhs: 3000,
      adm_cercles_abhs: 1200,
      adm_provinces_abhs: 300,
      adm_regions_abhs: 100,
      reseau_hydro_abhs: 5000,
      stations_abhs: 2000,
      points_eau: 2000,
      sources: 2000,
      adm_villes_abhs: 500,
      adm_douars_abhs: 2000,
      fosses_septiques_abhs: 2000,
      sous_bassins_swat: 1500,
    } as Record<string, number>),
    []
  );

  const buildLayerUrl = useCallback(
    (key: string, extra?: string, useBbox = true) => {
      const max = layerMaxFeatures[key] ?? 5000;
      const bboxPart = useBbox && debouncedViewportBbox ? `&bbox=${encodeURIComponent(debouncedViewportBbox)}` : "";
      const qs = extra ? `${extra}&max_features=${max}${bboxPart}` : `?max_features=${max}${bboxPart}`;
      return `/layers/${key}${qs}`;
    },
    [layerMaxFeatures, debouncedViewportBbox]
  );

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedViewportBbox(viewportBbox), 250);
    return () => window.clearTimeout(t);
  }, [viewportBbox]);

  const mapEntityTypeToLayerKey = useCallback((entityType?: string | null): string | null => {
    if (!entityType) return null;
    if (entityType === "station") return "stations_abhs";
    if (entityType === "barrage") return "barrages_abhs";
    if (entityType === "sous_bassin_swat") return "sous_bassins_swat";
    if (entityType === "segment_reseau_hydro") return "reseau_hydro_abhs";
    if (entityType === "source_eau") return "sources";
    if (entityType === "nappe") return "nappes";
    if (entityType === "point_prelevement") return "points_eau";
    return null;
  }, []);

  const aggregateTimelineDates = useCallback(
    (dates: string[], step: "day" | "week" | "month") => {
      if (step === "day") return dates;
      const uniq = new Set<string>();
      for (const d of dates) {
        const dt = new Date(`${d}T00:00:00Z`);
        if (Number.isNaN(dt.getTime())) continue;
        if (step === "month") {
          const y = dt.getUTCFullYear();
          const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
          uniq.add(`${y}-${m}-01`);
          continue;
        }
        // week: Monday bucket
        const day = dt.getUTCDay(); // 0 Sunday ... 6 Saturday
        const diffToMonday = day === 0 ? -6 : 1 - day;
        dt.setUTCDate(dt.getUTCDate() + diffToMonday);
        uniq.add(dt.toISOString().slice(0, 10));
      }
      return Array.from(uniq).sort();
    },
    []
  );

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const togglesRef = useRef(layers.toggles);

  useEffect(() => {
    togglesRef.current = layers.toggles;
  }, [layers.toggles]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const selectedBasemap = BASEMAP_OPTIONS.find((item) => item.id === basemapId) ?? BASEMAP_OPTIONS[0];
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: selectedBasemap.style as any,
      center: [-5.55, 34.25],
      zoom: 7.15,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    const updateViewportBbox = () => {
      const b = map.getBounds();
      if (!b) return;
      const bbox = `${b.getWest().toFixed(6)},${b.getSouth().toFixed(6)},${b.getEast().toFixed(6)},${b.getNorth().toFixed(6)}`;
      setViewportBbox(bbox);
    };
    map.on("styledata", () => {
      if (map.isStyleLoaded()) {
        setStyleRevision((value) => value + 1);
      }
    });
    map.on("load", updateViewportBbox);
    map.on("moveend", updateViewportBbox);
    mapRef.current = map;

    return () => {
      try {
        map.off("load", updateViewportBbox);
        map.off("moveend", updateViewportBbox);
        map.remove();
      } catch {
        /* ignore */
      }
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const selectedBasemap = BASEMAP_OPTIONS.find((item) => item.id === basemapId) ?? BASEMAP_OPTIONS[0];
    map.setStyle(selectedBasemap.style as any);
  }, [basemapId]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setLoadError(null);

    Promise.all([loadStations()])
      .then(([st]) => {
        if (!alive) return;
        setStations(st);
        setSelectedId((prev) => prev ?? (st.length ? st[0].id : null));
      })
      .catch(() => setLoadError("Erreur de chargement"))
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    api
      .get<PopupRulesResponse>("/observatory/popup-rules")
      .then((res) => {
        if (!alive) return;
        const payload = (res.data || {}) as PopupRulesResponse;
        const merged: Record<string, PopupRule> = { ...DEFAULT_POPUP_RULES };
        Object.entries(payload.rules || {}).forEach(([k, v]) => {
          merged[k] = {
            title: v.title || DEFAULT_POPUP_RULES[k]?.title || k,
            nameFields: v.name_fields || DEFAULT_POPUP_RULES[k]?.nameFields || ["name", "label"],
            typeFields: v.type_fields || DEFAULT_POPUP_RULES[k]?.typeFields || [],
            classFields: v.class_fields || DEFAULT_POPUP_RULES[k]?.classFields || [],
            codeFields: v.code_fields || DEFAULT_POPUP_RULES[k]?.codeFields || [],
          };
        });
        setPopupRules(merged);
      })
      .catch(() => {
        if (alive) setPopupRules(DEFAULT_POPUP_RULES);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    getHierarchyThemes()
      .then((rows) => {
        if (!alive) return;
        setHierThemes(rows || []);
        const first = rows?.[0]?.theme || "";
        setSelectedTheme((prev) => prev || first);
      })
      .catch(() => {
        if (!alive) return;
        setHierThemes([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedTheme) {
      setHierSubmenus([]);
      setSelectedSubmenu("");
      return;
    }
    let alive = true;
    getHierarchySubmenus(selectedTheme)
      .then((rows) => {
        if (!alive) return;
        setHierSubmenus(rows || []);
        const first = rows?.[0]?.sous_menu || "";
        setSelectedSubmenu((prev) => prev || first);
      })
      .catch(() => {
        if (!alive) return;
        setHierSubmenus([]);
        setSelectedSubmenu("");
      });
    return () => {
      alive = false;
    };
  }, [selectedTheme]);

  useEffect(() => {
    if (!selectedTheme || !selectedSubmenu) {
      setHierParameters([]);
      setSelectedParamCode("");
      setSelectedParamSourceTable("");
      return;
    }
    let alive = true;
    getHierarchyParameters(selectedTheme, selectedSubmenu)
      .then((rows) => {
        if (!alive) return;
        setHierParameters(rows || []);
        const first = rows?.[0]?.param_code || "";
        setSelectedParamCode((prev) => prev || first);
        const firstSource = rows?.[0]?.source_table || "";
        setSelectedParamSourceTable((prev) => prev || firstSource);
      })
      .catch(() => {
        if (!alive) return;
        setHierParameters([]);
        setSelectedParamCode("");
        setSelectedParamSourceTable("");
      });
    return () => {
      alive = false;
    };
  }, [selectedTheme, selectedSubmenu]);

  useEffect(() => {
    if (!selectedParamCode) {
      setSelectedBusinessKey("");
      return;
    }
    const key = PARAM_TO_BUSINESS_KEY[selectedParamCode] || "";
    setSelectedBusinessKey(key);
  }, [selectedParamCode]);

  const selectedHierarchyParam = useMemo(() => {
    if (!selectedParamCode) return null;
    return (
      hierParameters.find(
        (row) =>
          row.param_code === selectedParamCode &&
          (!selectedParamSourceTable || row.source_table === selectedParamSourceTable)
      ) ||
      hierParameters.find((row) => row.param_code === selectedParamCode) ||
      null
    );
  }, [hierParameters, selectedParamCode, selectedParamSourceTable]);

  const visualKey = useMemo(
    () =>
      Object.entries(layers.toggles)
        .map(([k, v]) => `${k}:${v ? 1 : 0}`)
        .join("|") + 
      "-" +
      Object.entries(layers.fill_modes || {})
        .map(([k, v]) => `${k}:${v}`)
        .join("|"),
    [layers.toggles, layers.fill_modes]
  );

  const uniqueHierarchyParameters = useMemo(() => {
    const seen = new Set<string>();
    const out: HierParameter[] = [];
    for (const row of hierParameters) {
      const key = `${row.param_code}::${row.param_label}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(row);
    }
    return out;
  }, [hierParameters]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Styles visuels distincts par couche
    const LAYER_PAINT: Record<string, { type: "fill" | "line" | "circle"; paint: Record<string, unknown> }> = {
      bassin_sebou:        { type: "fill",   paint: { "fill-color": "#22c55e", "fill-opacity": 0.15, "fill-outline-color": "#16a34a" } },
      sous_bassin_sebou:   { type: "fill",   paint: { "fill-color": "#4ade80", "fill-opacity": 0.12, "fill-outline-color": "#22c55e" } },
      sous_bassins_swat:   { type: "fill",   paint: { "fill-color": "#f472b6", "fill-opacity": 0.12, "fill-outline-color": "#db2777" } },
      nappes:              { type: "fill",   paint: { "fill-color": "#3b82f6", "fill-opacity": 0.15, "fill-outline-color": "#2563eb" } },
      reseau_hydro_abhs:   { type: "line",   paint: { "line-color": "#2563eb", "line-width": 1.4 } },
      barrages_abhs:       { type: "circle", paint: { "circle-radius": 7, "circle-color": "#ef4444", "circle-stroke-color": "#fff", "circle-stroke-width": 1.5 } },
      stations_abhs:       { type: "circle", paint: { "circle-radius": 6, "circle-color": "#06b6d4", "circle-stroke-color": "#fff", "circle-stroke-width": 1.5 } },
      points_eau:          { type: "circle", paint: { "circle-radius": 5, "circle-color": "#3b82f6", "circle-stroke-color": "#fff", "circle-stroke-width": 1 } },
      sources:             { type: "circle", paint: { "circle-radius": 4, "circle-color": "#60a5fa", "circle-stroke-color": "#fff", "circle-stroke-width": 1 } },
      decharges_abhs:      { type: "circle", paint: { "circle-radius": 5, "circle-color": "#f59e0b", "circle-stroke-color": "#fff", "circle-stroke-width": 1.2 } },
      huileries_abhs:      { type: "circle", paint: { "circle-radius": 5, "circle-color": "#84cc16", "circle-stroke-color": "#fff", "circle-stroke-width": 1.2 } },
      mines_abhs:          { type: "circle", paint: { "circle-radius": 5, "circle-color": "#a16207", "circle-stroke-color": "#fff", "circle-stroke-width": 1.2 } },
      rejets_industriels_abhs:{ type: "circle", paint: { "circle-radius": 5, "circle-color": "#ef4444", "circle-stroke-color": "#fff", "circle-stroke-width": 1.2 } },
      rejets_domestiques_abhs:{ type: "circle", paint: { "circle-radius": 5, "circle-color": "#fb7185", "circle-stroke-color": "#fff", "circle-stroke-width": 1.2 } },
      step_abhs:           { type: "circle", paint: { "circle-radius": 6, "circle-color": "#22c55e", "circle-stroke-color": "#fff", "circle-stroke-width": 1.2 } },
      step_industrielles:  { type: "circle", paint: { "circle-radius": 6, "circle-color": "#f97316", "circle-stroke-color": "#fff", "circle-stroke-width": 1.5 } },
      stm:                 { type: "circle", paint: { "circle-radius": 5, "circle-color": "#a855f7", "circle-stroke-color": "#fff", "circle-stroke-width": 1 } },
      fosses_septiques_abhs:{ type: "circle", paint: { "circle-radius": 4.5, "circle-color": "#14b8a6", "circle-stroke-color": "#fff", "circle-stroke-width": 1 } },
      adm_regions_abhs:    { type: "fill",   paint: { "fill-color": "#f59e0b", "fill-opacity": 0.08, "fill-outline-color": "#d97706" } },
      adm_provinces_abhs:  { type: "fill",   paint: { "fill-color": "#fbbf24", "fill-opacity": 0.07, "fill-outline-color": "#f59e0b" } },
      adm_cercles_abhs:    { type: "fill",   paint: { "fill-color": "#fcd34d", "fill-opacity": 0.06, "fill-outline-color": "#fbbf24" } },
      adm_communes_abhs:   { type: "fill",   paint: { "fill-color": "#fde68a", "fill-opacity": 0.05, "fill-outline-color": "#fcd34d" } },
      adm_villes_abhs:     { type: "circle", paint: { "circle-radius": 5, "circle-color": "#f59e0b", "circle-stroke-color": "#fff", "circle-stroke-width": 1 } },
      adm_douars_abhs:     { type: "circle", paint: { "circle-radius": 3, "circle-color": "#fbbf24", "circle-stroke-color": "#fff", "circle-stroke-width": 0.5 } },
    };
    const CLUSTER_KEYS = new Set([
      "adm_douars_abhs",
      "adm_villes_abhs",
      "points_eau",
      "sources",
      "stations_abhs",
    ]);
    const MIN_ZOOM_BY_LAYER: Record<string, number> = {
      adm_douars_abhs: 9,
      adm_villes_abhs: 7,
    };

    const applyLayer = async (key: string) => {
      if (!map.isStyleLoaded()) {
        map.once("load", () => applyLayer(key));
        return;
      }

      const srcId = `base-src-${key}`;

      try {
        const minZoom = MIN_ZOOM_BY_LAYER[key];
        if (typeof minZoom === "number" && map.getZoom() < minZoom) {
          const layerId = `base-layer-${key}`;
          const strokeLayerId = `base-stroke-${key}`;
          const clusterLayerId = `base-layer-${key}-clusters`;
          const clusterCountLayerId = `base-layer-${key}-cluster-count`;
          const unclusteredLayerId = `base-layer-${key}-unclustered`;
          if (map.getLayer(layerId)) map.removeLayer(layerId);
          if (map.getLayer(strokeLayerId)) map.removeLayer(strokeLayerId);
          if (map.getLayer(clusterLayerId)) map.removeLayer(clusterLayerId);
          if (map.getLayer(clusterCountLayerId)) map.removeLayer(clusterCountLayerId);
          if (map.getLayer(unclusteredLayerId)) map.removeLayer(unclusteredLayerId);
          if (map.getSource(srcId)) map.removeSource(srcId);
          return;
        }
        const url = buildLayerUrl(key);
        let res;
        try {
          res = await api.get<FeatureCollection>(url);
        } catch {
          // Fallback safety: some sources can fail on bbox filter depending on SRID/view type.
          res = await api.get<FeatureCollection>(buildLayerUrl(key, undefined, false));
        }
        const data = res.data;
        if (!data || !data.features || data.features.length === 0) return;
        const validFeatures = (data.features || []).filter((f) => isValidFeatureForMap(f as any));
        if (!validFeatures.length) return;
        const filteredData: FeatureCollection = { ...data, features: validFeatures as any };

        if (!togglesRef.current[key]) {
          const existingLayerId = `base-layer-${key}`;
          const existingStrokeId = `base-stroke-${key}`;
          const existingClusterId = `base-layer-${key}-clusters`;
          const existingClusterCountId = `base-layer-${key}-cluster-count`;
          const existingUnclusteredId = `base-layer-${key}-unclustered`;
          if (map.getLayer(existingLayerId)) map.removeLayer(existingLayerId);
          if (map.getLayer(existingStrokeId)) map.removeLayer(existingStrokeId);
          if (map.getLayer(existingClusterId)) map.removeLayer(existingClusterId);
          if (map.getLayer(existingClusterCountId)) map.removeLayer(existingClusterCountId);
          if (map.getLayer(existingUnclusteredId)) map.removeLayer(existingUnclusteredId);
          if (map.getSource(srcId)) map.removeSource(srcId);
          return;
        }

        const fillMode = layers.fill_modes?.[key] || "solid";
        const style = LAYER_PAINT[key] ?? {
          type: geomKind(data) === "polygon" ? "fill" : geomKind(data) === "line" ? "line" : "circle",
          paint:
            geomKind(data) === "polygon"
              ? { "fill-color": "#4ade80", "fill-opacity": 0.2, "fill-outline-color": "#22c55e" }
              : geomKind(data) === "line"
                ? { "line-color": "#2563eb", "line-width": 1.4 }
                : { "circle-radius": 5, "circle-color": "#0ea5e9" },
        };

        const layerPaint = { ...style.paint };
        if (style.type === "fill" && fillMode === "outline") {
          layerPaint["fill-opacity"] = 0;
        }

        if (map.getSource(srcId)) {
          (map.getSource(srcId) as GeoJSONSource).setData(filteredData as any);
        } else {
          map.addSource(srcId, {
            type: "geojson",
            data: filteredData as any,
            cluster: style.type === "circle" && CLUSTER_KEYS.has(key),
            clusterRadius: 40,
            clusterMaxZoom: 11,
          } as any);
        }

        const layerId = `base-layer-${key}`;
        const strokeLayerId = `base-stroke-${key}`;
        const clusterLayerId = `base-layer-${key}-clusters`;
        const clusterCountLayerId = `base-layer-${key}-cluster-count`;
        const unclusteredLayerId = `base-layer-${key}-unclustered`;

        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getLayer(strokeLayerId)) map.removeLayer(strokeLayerId);
        if (map.getLayer(clusterLayerId)) map.removeLayer(clusterLayerId);
        if (map.getLayer(clusterCountLayerId)) map.removeLayer(clusterCountLayerId);
        if (map.getLayer(unclusteredLayerId)) map.removeLayer(unclusteredLayerId);

        if (style.type === "circle" && CLUSTER_KEYS.has(key)) {
          map.addLayer({
            id: clusterLayerId,
            type: "circle",
            source: srcId,
            filter: ["has", "point_count"],
            paint: {
              "circle-color": "#f59e0b",
              "circle-radius": ["step", ["get", "point_count"], 12, 20, 16, 50, 20, 150, 24],
              "circle-stroke-color": "#fff",
              "circle-stroke-width": 1.5,
            },
          } as LayerSpecification);
          map.addLayer({
            id: clusterCountLayerId,
            type: "symbol",
            source: srcId,
            filter: ["has", "point_count"],
            layout: {
              "text-field": ["get", "point_count_abbreviated"],
              "text-size": 11,
            },
            paint: {
              "text-color": "#111827",
            },
          } as LayerSpecification);
          map.addLayer({
            id: unclusteredLayerId,
            type: "circle",
            source: srcId,
            filter: ["!", ["has", "point_count"]],
            paint: layerPaint as any,
          } as LayerSpecification);
          return;
        }

        map.addLayer({
          id: layerId,
          type: style.type,
          source: srcId,
          paint: layerPaint,
        } as LayerSpecification);

        if (style.type === "fill") {
          map.addLayer({
            id: strokeLayerId,
            type: "line",
            source: srcId,
            paint: {
              "line-color": (style.paint as any)["fill-outline-color"] || "#000",
              "line-width": fillMode === "outline" ? 2.5 : 1.5,
            },
          });
        }
      } catch (e) {
        console.error(`Erreur chargement couche ${key}:`, e);
      }
    };

    Object.entries(layers.toggles).forEach(([key, on]) => {
      const srcId = `base-src-${key}`;
      const layerId = `base-layer-${key}`;
      const strokeLayerId = `base-stroke-${key}`;
      const clusterLayerId = `base-layer-${key}-clusters`;
      const clusterCountLayerId = `base-layer-${key}-cluster-count`;
      const unclusteredLayerId = `base-layer-${key}-unclustered`;
      
      if (on) void applyLayer(key);
      else {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getLayer(strokeLayerId)) map.removeLayer(strokeLayerId);
        if (map.getLayer(clusterLayerId)) map.removeLayer(clusterLayerId);
        if (map.getLayer(clusterCountLayerId)) map.removeLayer(clusterCountLayerId);
        if (map.getLayer(unclusteredLayerId)) map.removeLayer(unclusteredLayerId);
        if (map.getSource(srcId)) map.removeSource(srcId);
      }
    });
  }, [visualKey, stations, layers.toggles, layers.fill_modes, styleRevision, viewportBbox, buildLayerUrl]);

  const loadLayerForFilter = useCallback(async (layerKey: string, selectedIds?: string | string[]) => {
    const map = mapRef.current;
    if (!map) return;

    if (!map.isStyleLoaded()) {
      map.once("load", () => loadLayerForFilter(layerKey, selectedIds));
      return;
    }

    try {
      const idsArray = Array.isArray(selectedIds)
        ? selectedIds.filter(Boolean)
        : selectedIds
          ? [selectedIds]
          : [];

      const query = idsArray.length > 0 ? `?ids=${encodeURIComponent(idsArray.join(","))}` : "";
      let res;
      try {
        res = await api.get<FeatureCollection>(buildLayerUrl(layerKey, query));
      } catch {
        res = await api.get<FeatureCollection>(buildLayerUrl(layerKey, query, false));
      }
      const data = res.data;
      const validFeatures = (data.features || []).filter((f) => isValidFeatureForMap(f as any));
      if (!validFeatures.length) return;
      const filteredData: FeatureCollection = { ...data, features: validFeatures as any };

      const kind = geomKind(filteredData);
      const srcId = `sel-src-${layerKey}`;
      const layerId = `sel-layer-${layerKey}`;

      if (map.getSource(srcId)) (map.getSource(srcId) as GeoJSONSource).setData(filteredData as any);
      else map.addSource(srcId, { type: "geojson", data: filteredData as any });

      if (map.getLayer(layerId)) map.removeLayer(layerId);

      const paint =
        kind === "polygon"
          ? { "fill-color": "#f59e0b", "fill-opacity": 0.4 }
          : kind === "line"
            ? { "line-color": "#f59e0b", "line-width": 3 }
            : { "circle-radius": 6, "circle-color": "#ef4444" };

      map.addLayer({
        id: layerId,
        type: kind === "polygon" ? "fill" : kind === "line" ? "line" : "circle",
        source: srcId,
        paint,
      } as LayerSpecification);

      const bbox = turf.bbox(filteredData) as [number, number, number, number];
      map.fitBounds(bbox, { padding: 50, duration: 900 });
    } catch (err) {
      console.error("Erreur couche filtree:", err);
    }
  }, []);

  const clearSelectionLayers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const styleLayers = map.getStyle()?.layers || [];
    styleLayers
      .map((l) => l.id)
      .filter((id) => id.startsWith("sel-layer-"))
      .forEach((id) => {
        if (map.getLayer(id)) map.removeLayer(id);
      });
    const styleSources = Object.keys(map.getStyle()?.sources || {});
    styleSources
      .filter((id) => id.startsWith("sel-src-"))
      .forEach((id) => {
        if (map.getSource(id)) map.removeSource(id);
      });
  }, []);

  const zoomToLayerBounds = useCallback(
    async (layerKey: string) => {
      const map = mapRef.current;
      if (!map) return;

      if (!map.isStyleLoaded()) {
        map.once("load", () => {
          void zoomToLayerBounds(layerKey);
        });
        return;
      }

      try {
        const url = buildLayerUrl(layerKey);
        const res = await api.get<FeatureCollection>(url);
        const data = res.data;
        const validFeatures = (data?.features || []).filter((f) => isValidFeatureForMap(f as any));
        if (!validFeatures.length) return;
        const filteredData: FeatureCollection = { ...data, features: validFeatures as any };

        const bbox = turf.bbox(filteredData) as [number, number, number, number];
        map.fitBounds(bbox, { padding: 50, duration: 900 });
      } catch (err) {
        console.error(`Erreur zoom couche ${layerKey}:`, err);
      }
    },
    []
  );

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const popup = new maplibregl.Popup({
      closeButton: true,
      closeOnClick: true,
      maxWidth: "300px",
    });
    const hoverPopup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: "map-hover-popup",
      offset: 10,
    });

    const onClickFeature = (e: maplibregl.MapMouseEvent) => {
      // Rechercher dynamiquement tous les calques interactifs existants
      const styleLayers = map.getStyle()?.layers || [];
      const activeLayers = styleLayers
        .map((l) => l.id)
        .filter(
          (id) =>
            (id.startsWith("base-layer-") && !id.includes("-clusters") && !id.includes("-cluster-count")) ||
            id.startsWith("sel-layer-") ||
            id === "business-layer"
        );
        
      if (!activeLayers.length) return;

      const features = map.queryRenderedFeatures(e.point, { layers: activeLayers });
      const feature = features[0];
      if (!feature || !feature.properties) return;

      // ---- 1. Gérer la sélection si c'est une station
      if (feature.layer?.id.includes("stations_abhs")) {
        const stationId = Number(
          feature.properties.legacy_station_id ??
          feature.properties.station_id ??
          feature.properties.id_station ??
          feature.properties.id
        );
        if (!Number.isNaN(stationId)) {
          setSelectedId(stationId);
        }
      }

      // ---- 2. Afficher la Popup générique avec les métadonnées
      const rawLayerId = feature.layer?.id || "";
      const layerKey = rawLayerId.replace("sel-layer-", "").replace("base-layer-", "");
      const props = (feature.properties || {}) as Record<string, any>;
      const rule = popupRules[layerKey] || {
        title: layerKey.replace(/_/g, " "),
        nameFields: ["name", "label", "nom", "station_nom"],
        typeFields: ["type", "categorie", "classe"],
        codeFields: ["code", "id"],
      };
      const nameVal =
        pickFirstProp(props, rule.nameFields) ||
        pickFirstProp(props, rule.codeFields || []) ||
        String(props.id ?? "Entité");
      const typeVal = pickFirstProp(props, rule.typeFields || []);
      const classVal = pickFirstProp(props, rule.classFields || []);
      const codeVal = pickFirstProp(props, rule.codeFields || []);
      const valueVal = props.display_value;
      const unitVal = props.business_unit;

      const layerName = (feature.layer?.id || "")
        .replace("sel-layer-", "")
        .replace("base-layer-", "")
        .replace(/_/g, " ")
        .toUpperCase();

      let popupHtml = '<div class="flex flex-col gap-1.5 p-1 max-h-[300px] overflow-y-auto custom-scrollbar">';
      popupHtml += `<div class="font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1.5 mb-1">${rule.title || layerName}</div>`;
      popupHtml += `
        <div class="flex flex-col text-[11px] leading-tight mb-1">
          <span class="font-medium text-slate-400 uppercase tracking-wide text-[9px]">Nom</span>
          <span class="font-bold text-slate-700">${nameVal}</span>
        </div>
      `;
      if (popupMode === "expert" && typeVal) {
        popupHtml += `
          <div class="flex flex-col text-[11px] leading-tight mb-1">
            <span class="font-medium text-slate-400 uppercase tracking-wide text-[9px]">Type</span>
            <span class="font-bold text-slate-700">${typeVal}</span>
          </div>
        `;
      }
      if (popupMode === "expert" && classVal) {
        popupHtml += `
          <div class="flex flex-col text-[11px] leading-tight mb-1">
            <span class="font-medium text-slate-400 uppercase tracking-wide text-[9px]">Classe</span>
            <span class="font-bold text-slate-700">${classVal}</span>
          </div>
        `;
      }
      if (popupMode === "expert" && codeVal) {
        popupHtml += `
          <div class="flex flex-col text-[11px] leading-tight mb-1">
            <span class="font-medium text-slate-400 uppercase tracking-wide text-[9px]">Code</span>
            <span class="font-bold text-slate-700">${codeVal}</span>
          </div>
        `;
      }
      if (popupMode === "expert" && valueVal !== undefined && valueVal !== null && Number.isFinite(Number(valueVal))) {
        popupHtml += `
          <div class="flex flex-col text-[11px] leading-tight mb-1">
            <span class="font-medium text-slate-400 uppercase tracking-wide text-[9px]">Valeur</span>
            <span class="font-bold text-slate-700">${Number(valueVal).toFixed(3)}${unitVal ? ` ${unitVal}` : ""}</span>
          </div>
        `;
      }
      const entityId =
        props?.legacy_station_id ??
        props?.station_id ??
        props?.barrage_id ??
        props?.subbasin_uid ??
        props?.reseau_id ??
        props?.source_id ??
        props?.id;
      if (entityId != null && layerKey) {
        popupHtml += `
          <button id="open-entity-panel-btn" class="mt-2 rounded bg-slate-800 px-2 py-1 text-[11px] text-white">
            🔍 Ouvrir détail
          </button>
        `;
      }
      popupHtml += '</div>';

      popup.setLngLat(e.lngLat).setHTML(popupHtml).addTo(map);
      const btn = document.getElementById("open-entity-panel-btn");
      if (entityId != null && layerKey) {
        const openEntityPanel = async () => {
          try {
            setEntitySeriesLoading(true);
            const res = await api.get<EntityDetailsResponse>(`/layers/${layerKey}/entity/${encodeURIComponent(String(entityId))}`);
            const entityData = (res.data || {}) as EntityDetailsResponse;
            setSelectedEntityDetails({
              layerKey,
              entityId: String(entityId),
              properties: (entityData.properties || {}) as Record<string, unknown>,
            });
            const seriesRes = await api.get<EntitySeriesResponse>(`/entity/${encodeURIComponent(String(entityId))}/data`, {
              params: { layer_key: layerKey, date_start: range.from, date_end: range.to, limit: 500, offset: 0 },
            });
            const seriesData = (seriesRes.data || {}) as EntitySeriesResponse;
            setEntitySeriesRows(seriesData.rows || []);
            setEntitySeriesOffset(seriesData.offset || 0);
            setEntitySeriesHasMore(!!seriesData.has_more);
            setEntityFilterQuery("");
            setEntityPanelOpen(true);
          } catch {
            setSelectedEntityDetails({
              layerKey,
              entityId: String(entityId),
              properties: (feature.properties || {}) as Record<string, unknown>,
            });
            setEntitySeriesRows([]);
            setEntitySeriesOffset(0);
            setEntitySeriesHasMore(false);
            setEntityFilterQuery("");
            setEntityPanelOpen(true);
          } finally {
            setEntitySeriesLoading(false);
          }
        };
        if (btn) btn.onclick = openEntityPanel;
        void openEntityPanel();
      }
    };

    const onMouseMove = (e: maplibregl.MapMouseEvent) => {
      const styleLayers = map.getStyle()?.layers || [];
      const activeLayers = styleLayers
        .map((l) => l.id)
        .filter(
          (id) =>
            (id.startsWith("base-layer-") && !id.includes("-clusters") && !id.includes("-cluster-count")) ||
            id.startsWith("sel-layer-") ||
            id === "business-layer"
        );
        
      if (!activeLayers.length) {
        map.getCanvas().style.cursor = "";
        hoverPopup.remove();
        return;
      }
      const features = map.queryRenderedFeatures(e.point, { layers: activeLayers });
      map.getCanvas().style.cursor = features.length ? "pointer" : "";
      const feature = features[0];
      if (!feature || !feature.properties) {
        hoverPopup.remove();
        return;
      }
      const rawLayerId = feature.layer?.id || "";
      const layerKey = rawLayerId.replace("sel-layer-", "").replace("base-layer-", "");
      const rule = popupRules[layerKey] || {
        title: layerKey.replace(/_/g, " "),
        nameFields: ["name", "label", "nom", "station_nom"],
        typeFields: ["type", "categorie", "classe"],
        codeFields: ["code", "id"],
      };
      const props = (feature.properties || {}) as Record<string, any>;
      const layerName = rawLayerId
        .replace("sel-layer-", "")
        .replace("base-layer-", "")
        .replace(/_/g, " ");
      const name =
        pickFirstProp(props, rule.nameFields) ||
        pickFirstProp(props, rule.codeFields || []) ||
        "Entité";
      hoverPopup
        .setLngLat(e.lngLat)
        .setHTML(
          `<div style="font-size:11px;line-height:1.2"><b>${layerName}</b><br/>${String(name)}</div>`
        )
        .addTo(map);
    };

    map.on("click", onClickFeature);
    map.on("mousemove", onMouseMove);
    map.on("mouseleave", () => {
      map.getCanvas().style.cursor = "";
      hoverPopup.remove();
    });

    return () => {
      popup.remove();
      hoverPopup.remove();
      map.off("click", onClickFeature);
      map.off("mousemove", onMouseMove);
    };
  }, [stations, range.from, range.to, popupRules, popupMode]);

  const handleSelectFilter = useCallback(
    (type: string, ids: string | string[]) => {
      if (!ids) return;

      const idArray = Array.isArray(ids) ? ids : [ids];
      setActiveFilterSelection({ type, ids: idArray });

      if (type === "station") {
        loadLayerForFilter("stations_abhs", idArray);
        const firstId = idArray[0];
        const station = stations.find((s) => String(s.id) === String(firstId));
        if (station) {
          setSelectedId(station.id);
        }
      } else {
        loadLayerForFilter(type, idArray);
      }
    },
    [loadLayerForFilter, stations]
  );

  useEffect(() => {
    if (!activeFilterSelection) return;
    const { type, ids } = activeFilterSelection;

    if (type === "station") void loadLayerForFilter("stations_abhs", ids);
    else void loadLayerForFilter(type, ids);
  }, [activeFilterSelection, loadLayerForFilter, styleRevision]);

  useEffect(() => {
    if (!onlyEntitiesWithValues) {
      clearSelectionLayers();
      setCoverageLoading(false);
      setCoverageCount(null);
      return;
    }
    if (!selectedHierarchyParam) return;
    const layerKey = mapEntityTypeToLayerKey(selectedHierarchyParam.entity_type);
    if (!layerKey) return;
    let cancelled = false;
    setCoverageLoading(true);
    setCoverageCount(null);
    api
      .get<CoverageResponse>("/observatory/hierarchy/entities-with-values", {
        params: {
          theme: selectedTheme,
          sous_menu: selectedSubmenu,
          param_code: selectedHierarchyParam.param_code,
          source_table: selectedHierarchyParam.source_table || undefined,
          date_start: range.from,
          date_end: range.to,
          time_step: timelineStep,
          aggregation: valueAggregation,
        },
      })
      .then((res) => {
        if (cancelled) return;
        const payload = (res.data || {}) as CoverageResponse;
        const ids = (payload.entity_ids || []) as string[];
        setCoverageCount(Number(payload.entity_count ?? ids.length));
        if (!ids.length) {
          clearSelectionLayers();
          return;
        }
        setActiveFilterSelection({ type: layerKey, ids });
      })
      .catch(() => {
        if (!cancelled) {
          setCoverageCount(0);
          clearSelectionLayers();
          setCoverageLoading(false);
        }
      })
      .then(() => {
        if (!cancelled) setCoverageLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [
    onlyEntitiesWithValues,
    selectedHierarchyParam,
    selectedTheme,
    selectedSubmenu,
    range.from,
    range.to,
    timelineStep,
    valueAggregation,
    mapEntityTypeToLayerKey,
    clearSelectionLayers,
  ]);

  useEffect(() => {
    if (!selectedHierarchyParam) {
      setTimelineDates([]);
      setTimelineIndex(0);
      setTimelinePlaying(false);
      return;
    }
    let cancelled = false;
    setTimelineLoading(true);
    const cacheKey = [
      selectedTheme,
      selectedSubmenu,
      selectedHierarchyParam.param_code,
      selectedHierarchyParam.source_table || "",
      range.from,
      range.to,
    ].join("|");
    const cached = timelineCacheRef.current.get(cacheKey);
    if (cached) {
      const aggregated = aggregateTimelineDates(cached, timelineStep);
      setTimelineDates(aggregated);
      setTimelineIndex(0);
      setTimelinePlaying(false);
      setTimelineLoading(false);
      return () => {
        cancelled = true;
      };
    }
    api
      .get<TimelineResponse>("/observatory/hierarchy/timeline", {
        params: {
          theme: selectedTheme,
          sous_menu: selectedSubmenu,
          param_code: selectedHierarchyParam.param_code,
          source_table: selectedHierarchyParam.source_table || undefined,
          date_start: range.from,
          date_end: range.to,
          limit: 5000,
        },
      })
      .then((res) => {
        if (cancelled) return;
        const payload = (res.data || {}) as TimelineResponse;
        const dates = (payload.dates || []) as string[];
        timelineCacheRef.current.set(cacheKey, dates);
        const aggregated = aggregateTimelineDates(dates, timelineStep);
        setTimelineDates(aggregated);
        setTimelineIndex(0);
        setTimelinePlaying(false);
      })
      .catch(() => {
        if (!cancelled) {
          setTimelineDates([]);
          setTimelineIndex(0);
          setTimelinePlaying(false);
          setTimelineLoading(false);
        }
      })
      .then(() => {
        if (!cancelled) setTimelineLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedHierarchyParam, selectedTheme, selectedSubmenu, timelineStep, range.from, range.to, aggregateTimelineDates]);

  useEffect(() => {
    if (!timelinePlaying || timelineDates.length <= 1) return;
    const handle = window.setInterval(() => {
      setTimelineIndex((prev) => {
        const next = prev + 1;
        if (next >= timelineDates.length) return 0;
        return next;
      });
    }, 1200);
    return () => window.clearInterval(handle);
  }, [timelinePlaying, timelineDates]);

  useEffect(() => {
    if (!timelineDates.length) return;
    const current = timelineDates[Math.max(0, Math.min(timelineIndex, timelineDates.length - 1))];
    if (!current) return;
    if (timelineStep === "day") {
      setRange((prev) => ({ ...prev, from: current, to: current }));
      return;
    }
    if (timelineStep === "week") {
      const dt = new Date(`${current}T00:00:00Z`);
      const end = new Date(dt);
      end.setUTCDate(dt.getUTCDate() + 6);
      setRange((prev) => ({ ...prev, from: current, to: end.toISOString().slice(0, 10) }));
      return;
    }
    const monthStart = new Date(`${current}T00:00:00Z`);
    const monthEnd = new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 0));
    setRange((prev) => ({ ...prev, from: current, to: monthEnd.toISOString().slice(0, 10) }));
  }, [timelineDates, timelineIndex, setRange]);

  useEffect(() => {
    if (!entityPanelOpen || !selectedEntityDetails) return;
    let cancelled = false;
    setEntitySeriesLoading(true);
    api
      .get<EntitySeriesResponse>(`/entity/${encodeURIComponent(selectedEntityDetails.entityId)}/data`, {
        params: {
          layer_key: selectedEntityDetails.layerKey,
          date_start: range.from,
          date_end: range.to,
          limit: 500,
          offset: 0,
        },
      })
      .then((res) => {
        if (cancelled) return;
        const payload = (res.data || {}) as EntitySeriesResponse;
        setEntitySeriesRows(payload.rows || []);
        setEntitySeriesOffset(payload.offset || 0);
        setEntitySeriesHasMore(!!payload.has_more);
        setEntitySeriesLoading(false);
      })
      .catch(() => {
        if (!cancelled) setEntitySeriesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [entityPanelOpen, selectedEntityDetails, range.from, range.to]);

  useEffect(() => {
    if (!selectedHierarchyParam || !!selectedBusinessKey) return;
    let cancelled = false;
    setKpiLoading(true);
    api
      .get<HierarchyKpiResponse>("/observatory/hierarchy/kpi", {
        params: {
          theme: selectedTheme,
          sous_menu: selectedSubmenu,
          param_code: selectedHierarchyParam.param_code,
          source_table: selectedHierarchyParam.source_table || undefined,
          date_start: range.from,
          date_end: range.to,
          time_step: timelineStep,
          aggregation: valueAggregation,
        },
      })
      .then((res) => {
        if (cancelled) return;
        const payload = (res.data || {}) as HierarchyKpiResponse;
        if (!payload.count || payload.min == null || payload.max == null || payload.avg == null) {
          setBusinessStats(null);
        } else {
          setBusinessStats({
            count: Number(payload.count),
            min: Number(payload.min),
            max: Number(payload.max),
            avg: Number(payload.avg),
          });
        }
      })
      .catch(() => {
        if (!cancelled) setBusinessStats(null);
      })
      .then(() => {
        if (!cancelled) setKpiLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [
    selectedHierarchyParam,
    selectedBusinessKey,
    selectedTheme,
    selectedSubmenu,
    range.from,
    range.to,
    timelineStep,
    valueAggregation,
  ]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const sourceId = "business-src";
    const layerId = "business-layer";
    const removeBusiness = () => {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };

    const selectionForHierarchy: HierarchyParameterSelection | null =
      !selectedBusinessKey && selectedHierarchyParam
        ? {
            theme: selectedTheme,
            sousMenu: selectedSubmenu,
            paramCode: selectedHierarchyParam.param_code,
            paramLabel: selectedHierarchyParam.param_label,
            unit: selectedHierarchyParam.unite,
            entityType: selectedHierarchyParam.entity_type,
            sourceTable: selectedHierarchyParam.source_table || undefined,
            timeStep: timelineStep,
            aggregation: valueAggregation,
          }
        : null;

    if (!selectedBusinessKey && !selectionForHierarchy) {
      removeBusiness();
      setBusinessLegend([]);
      setBusinessLabel("");
      setBusinessUnit("");
      setBusinessStats(null);
      return;
    }
    if (!map.isStyleLoaded()) return;

    setBusinessLoading(true);
    const builder = selectedBusinessKey
      ? buildBusinessLayer(selectedBusinessKey, range)
      : buildHierarchyParameterLayer(selectionForHierarchy as HierarchyParameterSelection, range);

    builder
      .then((result) => {
        removeBusiness();
        if (!result) {
          setBusinessLegend([]);
          setBusinessLabel("");
          setBusinessUnit("");
          setBusinessStats(null);
          return;
        }

        setBusinessLegend(result.legend);
        setBusinessLabel(result.label);
        setBusinessUnit(result.unit || "");
        const validFeatures = (result.featureCollection.features || []).filter((f) => isValidFeatureForMap(f as any));
        if (!validFeatures.length) {
          setBusinessLegend([]);
          setBusinessLabel("");
          setBusinessUnit("");
          setBusinessStats(null);
          return;
        }
        const filteredBusinessFc: FeatureCollection = {
          ...result.featureCollection,
          features: validFeatures as any,
        };
        map.addSource(sourceId, { type: "geojson", data: filteredBusinessFc as any });
        const statValues = validFeatures
          .map((f: any) => Number(f?.properties?.display_value))
          .filter((v: number) => Number.isFinite(v));
        if (statValues.length) {
          const min = Math.min(...statValues);
          const max = Math.max(...statValues);
          const avg = statValues.reduce((a, b) => a + b, 0) / statValues.length;
          setBusinessStats({ min, max, avg, count: statValues.length });
        } else {
          setBusinessStats(null);
        }

        const colors = result.legend;
        const colorExpr: any[] = ["step", ["coalesce", ["get", "display_value"], 0], colors[0]?.color || "#3b82f6"];
        for (let i = 1; i < colors.length; i += 1) {
          colorExpr.push(colors[i].min, colors[i].color);
        }

        map.addLayer({
          id: layerId,
          type: "circle",
          source: sourceId,
          paint: {
            "circle-radius": 7,
            "circle-color": colorExpr as any,
            "circle-opacity": 0.9,
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 1.3,
          },
        } as LayerSpecification);
      })
      .catch(() => {
        setBusinessLegend([]);
        setBusinessStats(null);
        setBusinessLoading(false);
      })
      .then(() => setBusinessLoading(false));
  }, [
    selectedBusinessKey,
    selectedHierarchyParam,
    selectedTheme,
    selectedSubmenu,
    valueAggregation,
    timelineStep,
    range.from,
    range.to,
    styleRevision,
  ]);


  return (
    <div className="h-full bg-white">
      <div className="h-full px-4 py-0 lg:px-0">
        <main className="h-full min-w-0">
          <section className="relative h-[calc(100vh-77px)] min-h-[calc(100vh-77px)] overflow-hidden bg-white">
            <div className="relative h-full">
              <div
                className={[
                  "absolute left-4 top-4 z-10 flex flex-col items-start gap-1.5",
                  "xl:left-4",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => setBasemapOpen((value) => !value)}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-200/20 bg-[linear-gradient(135deg,rgba(7,59,76,0.96),rgba(15,118,110,0.92),rgba(31,41,55,0.96))] px-2.5 py-1.5 text-emerald-50 shadow-[0_18px_45px_-20px_rgba(8,15,30,0.9)] backdrop-blur-md transition hover:border-amber-200/30 hover:bg-[linear-gradient(135deg,rgba(12,74,110,0.95),rgba(13,148,136,0.92),rgba(180,83,9,0.88))]"
                  aria-label={basemapOpen ? "Masquer les cartes de base" : "Afficher les cartes de base"}
                >
                  <Layers3 className="h-3.5 w-3.5" />
                  <span className="whitespace-nowrap text-[11px] font-semibold">Carte de base</span>
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setLayersPanelOpen((value) => !value)}
                    className="flex items-center gap-1.5 rounded-xl border border-emerald-200/20 bg-[linear-gradient(135deg,rgba(7,59,76,0.96),rgba(15,118,110,0.92),rgba(31,41,55,0.96))] px-2.5 py-1.5 text-emerald-50 shadow-[0_18px_45px_-20px_rgba(8,15,30,0.9)] backdrop-blur-md transition hover:border-amber-200/30 hover:bg-[linear-gradient(135deg,rgba(12,74,110,0.95),rgba(13,148,136,0.92),rgba(180,83,9,0.88))]"
                    aria-label={layersPanelOpen ? "Masquer le panneau des couches" : "Afficher le panneau des couches"}
                  >
                    <PanelLeft className="h-3.5 w-3.5" />
                    <span className="whitespace-nowrap text-[11px] font-semibold">Couches d'observatoire</span>
                  </button>

                  {layersPanelOpen && (
                    <div className="mt-1.5 hidden w-[300px] max-w-[calc(100vw-7rem)] xl:block">
                      <SidebarFilters
                        range={range}
                        setRange={setRange}
                        layers={layers}
                        setLayers={setLayers}
                        onApply={() => {}}
                        onSelectFilter={handleSelectFilter}
                        onZoomLayer={(layerKey) => {
                          void zoomToLayerBounds(layerKey);
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="ml-1 mt-1 w-60 overflow-hidden rounded-[18px] border border-emerald-200/20 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_25%),linear-gradient(180deg,#0f172a_0%,#164e63_100%)] text-emerald-50 shadow-[0_18px_55px_-22px_rgba(8,15,30,0.9)] backdrop-blur-xl">
                  <div className="border-b border-emerald-100/10 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-emerald-50/90">
                    Variable metier
                  </div>
                  <div className="space-y-1 p-2">
                    <div className="space-y-1.5">
                      <select
                        value={selectedTheme}
                        onChange={(e) => {
                          setSelectedTheme(e.target.value);
                          setSelectedSubmenu("");
                          setSelectedParamCode("");
                          setSelectedParamSourceTable("");
                        }}
                        className="w-full rounded-md border border-emerald-100/15 bg-slate-900/70 px-2 py-1.5 text-[11px] text-emerald-50 outline-none"
                      >
                        <option value="">Theme...</option>
                        {hierThemes.map((item) => (
                          <option key={item.theme} value={item.theme}>
                            {item.theme}
                          </option>
                        ))}
                      </select>
                      <select
                        value={selectedSubmenu}
                        onChange={(e) => {
                          setSelectedSubmenu(e.target.value);
                          setSelectedParamCode("");
                          setSelectedParamSourceTable("");
                        }}
                        className="w-full rounded-md border border-emerald-100/15 bg-slate-900/70 px-2 py-1.5 text-[11px] text-emerald-50 outline-none"
                      >
                        <option value="">Sous-menu...</option>
                        {hierSubmenus.map((item) => (
                          <option key={item.sous_menu} value={item.sous_menu}>
                            {item.sous_menu}
                          </option>
                        ))}
                      </select>
                      <select
                        value={selectedParamCode}
                        onChange={(e) => {
                          const code = e.target.value;
                          setSelectedParamCode(code);
                          const first = hierParameters.find((p) => p.param_code === code);
                          setSelectedParamSourceTable(first?.source_table || "");
                        }}
                        className="w-full rounded-md border border-emerald-100/15 bg-slate-900/70 px-2 py-1.5 text-[11px] text-emerald-50 outline-none"
                      >
                        <option value="">Parametre...</option>
                        {uniqueHierarchyParameters.map((item) => (
                          <option
                            key={`${item.param_code}-${item.param_label}`}
                            value={item.param_code}
                          >
                            {item.param_label} ({item.param_code})
                          </option>
                        ))}
                      </select>
                      {!!selectedParamCode && !selectedBusinessKey && selectedHierarchyParam && (
                        <div className="text-[10px] text-emerald-100/90">
                          Source: {selectedHierarchyParam.source_schema}.{selectedHierarchyParam.source_table} | Entite: {selectedHierarchyParam.entity_type}
                        </div>
                      )}
                      {!!selectedHierarchyParam && (
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-emerald-100/90">Popup:</span>
                            {(["compact", "expert"] as const).map((mode) => (
                              <button
                                key={mode}
                                type="button"
                                className={`rounded border px-1.5 py-0.5 text-[10px] ${
                                  popupMode === mode
                                    ? "border-emerald-300/40 bg-emerald-400/20 text-emerald-100"
                                    : "border-emerald-200/20 bg-slate-900/25 text-emerald-100/80"
                                }`}
                                onClick={() => setPopupMode(mode)}
                              >
                                {mode}
                              </button>
                            ))}
                          </div>
                          <label className="flex cursor-pointer items-center gap-2 text-[10px] text-emerald-100/90">
                            <input
                              type="checkbox"
                              checked={onlyEntitiesWithValues}
                              onChange={(e) => setOnlyEntitiesWithValues(e.target.checked)}
                              className="h-3 w-3 accent-emerald-400"
                            />
                            Afficher uniquement les entités avec valeurs
                          </label>
                          {onlyEntitiesWithValues && (
                            <div className="inline-flex items-center gap-1 rounded border border-emerald-200/20 bg-emerald-400/10 px-1.5 py-0.5 text-[10px] text-emerald-100">
                              {coverageLoading ? "Calcul couverture..." : `Entités avec valeurs: ${coverageCount ?? 0}`}
                            </div>
                          )}
                          <div className="rounded border border-emerald-200/20 bg-slate-900/35 p-1.5">
                            <div className="mb-1 flex items-center justify-between text-[10px] text-emerald-100/90">
                              <span>Time-bar</span>
                              <span>
                                {timelineLoading
                                  ? "chargement..."
                                  : timelineDates.length
                                    ? timelineDates[Math.max(0, Math.min(timelineIndex, timelineDates.length - 1))]
                                    : "no data"}
                              </span>
                            </div>
                            <div className="mb-1 flex gap-1">
                              {(["day", "week", "month"] as const).map((step) => (
                                <button
                                  key={step}
                                  type="button"
                                  className={`rounded border px-1.5 py-0.5 text-[10px] ${
                                    timelineStep === step
                                      ? "border-emerald-300/40 bg-emerald-400/20 text-emerald-100"
                                      : "border-emerald-200/20 bg-slate-900/25 text-emerald-100/80"
                                  }`}
                                  onClick={() => setTimelineStep(step)}
                                >
                                  {step}
                                </button>
                              ))}
                            </div>
                            <div className="mb-1">
                              <select
                                value={valueAggregation}
                                onChange={(e) =>
                                  setValueAggregation(e.target.value as "avg" | "sum" | "min" | "max" | "median")
                                }
                                className="w-full rounded border border-emerald-200/20 bg-slate-900/55 px-1.5 py-1 text-[10px] text-emerald-100"
                              >
                                <option value="avg">Aggregation: avg</option>
                                <option value="sum">Aggregation: sum</option>
                                <option value="min">Aggregation: min</option>
                                <option value="max">Aggregation: max</option>
                                <option value="median">Aggregation: median</option>
                              </select>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={Math.max(0, timelineDates.length - 1)}
                              value={Math.max(0, Math.min(timelineIndex, Math.max(0, timelineDates.length - 1)))}
                              onChange={(e) => setTimelineIndex(Number(e.target.value))}
                              disabled={timelineLoading || timelineDates.length <= 1}
                              className="w-full accent-emerald-400"
                            />
                            <div className="mt-1 flex gap-1">
                              <button
                                type="button"
                                className="rounded border border-emerald-200/20 bg-emerald-400/10 px-1.5 py-0.5 text-[10px] text-emerald-100 disabled:opacity-50"
                                onClick={() => setTimelinePlaying((p) => !p)}
                                disabled={timelineLoading || timelineDates.length <= 1}
                              >
                                {timelinePlaying ? "Pause" : "Play"}
                              </button>
                              <button
                                type="button"
                                className="rounded border border-emerald-200/20 bg-emerald-400/10 px-1.5 py-0.5 text-[10px] text-emerald-100 disabled:opacity-50"
                                onClick={() => setTimelineIndex((i) => Math.max(0, i - 1))}
                                disabled={timelineLoading || timelineDates.length <= 1}
                              >
                                Prev
                              </button>
                              <button
                                type="button"
                                className="rounded border border-emerald-200/20 bg-emerald-400/10 px-1.5 py-0.5 text-[10px] text-emerald-100 disabled:opacity-50"
                                onClick={() => setTimelineIndex((i) => Math.min(timelineDates.length - 1, i + 1))}
                                disabled={timelineLoading || timelineDates.length <= 1}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {businessLoading && (
                      <div className="text-[10px] text-emerald-100/75">Chargement...</div>
                    )}
                    {!businessLoading && businessLegend.length > 0 && (
                      <div className="rounded-md border border-emerald-100/10 bg-slate-900/45 p-1.5">
                        <div className="mb-1 text-[10px] font-semibold text-emerald-100/90">{businessLabel}</div>
                        <MapLegend
                          classes={businessLegend as any}
                          min={(businessLegend[0]?.min ?? null) as any}
                          max={(businessLegend[businessLegend.length - 1]?.max ?? null) as any}
                          unit={businessUnit}
                        />
                        {kpiLoading && !businessStats && (
                          <div className="mt-2 text-[10px] text-emerald-100/80">Calcul KPI...</div>
                        )}
                        {businessStats && (
                          <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] text-emerald-100/90">
                            <div className="rounded border border-emerald-200/20 px-1 py-0.5">Min: {businessStats.min.toFixed(2)}</div>
                            <div className="rounded border border-emerald-200/20 px-1 py-0.5">Max: {businessStats.max.toFixed(2)}</div>
                            <div className="rounded border border-emerald-200/20 px-1 py-0.5">Moy: {businessStats.avg.toFixed(2)}</div>
                            <div className="rounded border border-emerald-200/20 px-1 py-0.5">N: {businessStats.count}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {basemapOpen && (
                  <div className="ml-1 mt-1 w-60 overflow-hidden rounded-[18px] border border-emerald-200/20 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.14),transparent_30%),linear-gradient(180deg,#083344_0%,#115e59_42%,#1f2937_100%)] text-emerald-50 shadow-[0_28px_80px_-28px_rgba(8,15,30,0.96)] backdrop-blur-xl">
                    <div className="flex items-center justify-between border-b border-emerald-100/10 bg-slate-950/20 px-2.5 py-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-emerald-50/95">
                        <Layers3 className="h-3 w-3" />
                        Carte de base
                      </div>
                      <button
                        type="button"
                        onClick={() => setBasemapOpen(false)}
                        className="rounded-lg p-1 text-emerald-50/70 transition hover:bg-white/10 hover:text-white"
                        aria-label="Fermer le panneau de cartes de base"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-0.5 p-2">
                      {BASEMAP_OPTIONS.map((option) => {
                        const isActive = basemapId === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setBasemapId(option.id)}
                            className={[
                              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] transition",
                              isActive
                                ? "border border-amber-200/30 bg-amber-300/15 text-white"
                                : "text-emerald-50/85 hover:bg-white/10 hover:text-white",
                            ].join(" ")}
                          >
                            <span
                              className={[
                                "h-2 w-2 rounded-full border",
                                isActive
                                  ? "border-amber-300 bg-amber-300"
                                  : "border-emerald-50/40 bg-transparent",
                              ].join(" ")}
                            />
                            <span>{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div ref={mapContainerRef} className="h-[calc(100vh-77px)] min-h-[calc(100vh-77px)] w-full" />
              {entityPanelOpen && selectedEntityDetails && (
                <div className="absolute right-4 top-4 z-20 w-[340px] max-h-[80vh] overflow-auto rounded-xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur">
                  <div className="mb-2 flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">Entité</div>
                      <div className="text-sm font-semibold text-slate-800">
                        {selectedEntityDetails.layerKey} | {selectedEntityDetails.entityId}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                      onClick={() => {
                        setEntityPanelOpen(false);
                        setSelectedEntityDetails(null);
                        setEntitySeriesRows([]);
                        setEntitySeriesOffset(0);
                        setEntitySeriesHasMore(false);
                      }}
                    >
                      Fermer
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Filtrer colonnes..."
                    className="mb-2 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    value={entityFilterQuery}
                    onChange={(e) => setEntityFilterQuery(e.target.value)}
                  />
                  <div className="space-y-1">
                    {Object.entries(selectedEntityDetails.properties || {})
                      .filter(([k, v]) => {
                        const q = entityFilterQuery.trim().toLowerCase();
                        if (!q) return true;
                        return k.toLowerCase().includes(q) || String(v ?? "").toLowerCase().includes(q);
                      })
                      .map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[120px_1fr] gap-2 border-b border-slate-100 py-1 text-xs">
                        <div className="font-semibold text-slate-500">{k}</div>
                        <div className="break-all text-slate-800">{String(v ?? "")}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 border-t border-slate-200 pt-2">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="text-xs font-semibold text-slate-700">Mesures liées</div>
                      <div className="flex gap-1">
                        {(["ts", "parameter", "value", "source_table"] as const).map((k) => (
                          <button
                            key={k}
                            type="button"
                            className={`rounded border px-1.5 py-0.5 text-[10px] ${
                              entitySortBy === k ? "border-blue-400 text-blue-700" : "border-slate-300 text-slate-600"
                            }`}
                            onClick={() => {
                              if (entitySortBy === k) setEntitySortDir((d) => (d === "asc" ? "desc" : "asc"));
                              else {
                                setEntitySortBy(k);
                                setEntitySortDir("desc");
                              }
                            }}
                          >
                            {k}
                          </button>
                        ))}
                      </div>
                    </div>
                    {entitySeriesLoading ? (
                      <div className="text-xs text-slate-500">Chargement des mesures...</div>
                    ) : (
                      <>
                      <div className="mb-2 flex items-center gap-2">
                        <button
                          type="button"
                          className="rounded border border-slate-300 px-2 py-1 text-[10px] text-slate-700"
                          onClick={() => {
                            if (!selectedEntityDetails) return;
                            const headers = ["ts", "parameter", "value", "unit", "source_table"];
                            const lines = [
                              headers.join(","),
                              ...entitySeriesRows.map((r) =>
                                [r.ts, r.parameter, r.value, r.unit || "", r.source_table]
                                  .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
                                  .join(",")
                              ),
                            ];
                            const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
                            const a = document.createElement("a");
                            a.href = URL.createObjectURL(blob);
                            a.download = `entity_${selectedEntityDetails.entityId}_series.csv`;
                            a.click();
                            URL.revokeObjectURL(a.href);
                          }}
                        >
                          Export CSV
                        </button>
                        <button
                          type="button"
                          className="rounded border border-slate-300 px-2 py-1 text-[10px] text-slate-700 disabled:opacity-50"
                          disabled={entitySeriesOffset === 0 || entitySeriesLoading || !selectedEntityDetails}
                          onClick={async () => {
                            if (!selectedEntityDetails) return;
                            setEntitySeriesLoading(true);
                            try {
                              const nextOffset = Math.max(0, entitySeriesOffset - 500);
                              const res = await api.get<EntitySeriesResponse>(`/entity/${encodeURIComponent(selectedEntityDetails.entityId)}/data`, {
                                params: {
                                  layer_key: selectedEntityDetails.layerKey,
                                  date_start: range.from,
                                  date_end: range.to,
                                  limit: 500,
                                  offset: nextOffset,
                                },
                              });
                              const payload = (res.data || {}) as EntitySeriesResponse;
                              setEntitySeriesRows(payload.rows || []);
                              setEntitySeriesOffset(payload.offset || 0);
                              setEntitySeriesHasMore(!!payload.has_more);
                            } finally {
                              setEntitySeriesLoading(false);
                            }
                          }}
                        >
                          Précédent
                        </button>
                        <button
                          type="button"
                          className="rounded border border-slate-300 px-2 py-1 text-[10px] text-slate-700 disabled:opacity-50"
                          disabled={!entitySeriesHasMore || entitySeriesLoading || !selectedEntityDetails}
                          onClick={async () => {
                            if (!selectedEntityDetails) return;
                            setEntitySeriesLoading(true);
                            try {
                              const nextOffset = entitySeriesOffset + 500;
                              const res = await api.get<EntitySeriesResponse>(`/entity/${encodeURIComponent(selectedEntityDetails.entityId)}/data`, {
                                params: {
                                  layer_key: selectedEntityDetails.layerKey,
                                  date_start: range.from,
                                  date_end: range.to,
                                  limit: 500,
                                  offset: nextOffset,
                                },
                              });
                              const payload = (res.data || {}) as EntitySeriesResponse;
                              setEntitySeriesRows(payload.rows || []);
                              setEntitySeriesOffset(payload.offset || nextOffset);
                              setEntitySeriesHasMore(!!payload.has_more);
                            } finally {
                              setEntitySeriesLoading(false);
                            }
                          }}
                        >
                          Suivant
                        </button>
                      </div>
                      <div className="max-h-[280px] overflow-auto rounded border border-slate-200">
                        <table className="w-full text-[11px]">
                          <thead className="sticky top-0 bg-slate-50 text-slate-600">
                            <tr>
                              <th className="px-2 py-1 text-left">Date</th>
                              <th className="px-2 py-1 text-left">Paramètre</th>
                              <th className="px-2 py-1 text-right">Valeur</th>
                              <th className="px-2 py-1 text-left">Source</th>
                            </tr>
                          </thead>
                          <tbody>
                            {entitySeriesRows
                              .filter((r) => {
                                const q = entityFilterQuery.trim().toLowerCase();
                                if (!q) return true;
                                return (
                                  String(r.parameter || "").toLowerCase().includes(q) ||
                                  String(r.source_table || "").toLowerCase().includes(q) ||
                                  String(r.ts || "").toLowerCase().includes(q) ||
                                  String(r.value ?? "").toLowerCase().includes(q)
                                );
                              })
                              .sort((a, b) => {
                                const dir = entitySortDir === "asc" ? 1 : -1;
                                if (entitySortBy === "value") return ((a.value ?? 0) - (b.value ?? 0)) * dir;
                                if (entitySortBy === "ts") return (new Date(a.ts).getTime() - new Date(b.ts).getTime()) * dir;
                                return String((a as any)[entitySortBy] ?? "").localeCompare(String((b as any)[entitySortBy] ?? "")) * dir;
                              })
                              .map((r, idx) => (
                                <tr key={`${r.source_table}-${r.ts}-${r.parameter}-${idx}`} className="border-t border-slate-100">
                                  <td className="px-2 py-1">{String(r.ts || "").slice(0, 10)}</td>
                                  <td className="px-2 py-1">{r.parameter}</td>
                                  <td className="px-2 py-1 text-right">
                                    {r.value == null ? "-" : `${Number(r.value).toFixed(3)}${r.unit ? ` ${r.unit}` : ""}`}
                                  </td>
                                  <td className="px-2 py-1">{r.source_table}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
