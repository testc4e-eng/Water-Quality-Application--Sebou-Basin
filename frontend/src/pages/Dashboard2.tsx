import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import maplibregl, {
  Map as MapLibreMap,
  GeoJSONSource,
  LayerSpecification,
  StyleSpecification,
} from "maplibre-gl";
import proj4 from "proj4";
import * as turf from "@turf/turf";
import { Layers3, PanelLeft, X } from "lucide-react";

import SidebarFilters, { LayersState } from "@/components/Filters/SidebarFilters";

import { api } from "@/api/client";
import { DEFAULT_TOGGLES } from "@/layers/config";
import type { FeatureCollection } from "geojson";
import osmStyle from "@/lib/osmStyle";

interface Station {
  id: number;
  name: string;
  river?: string | null;
  lat: number;
  lon: number;
}

interface BarrageDto {
  id: number;
  nom_barrage: string;
  nom_oued?: string | null;
  statut?: string | null;
  type_barrage?: string | null;
  hauteur?: number | null;
  apports_hm?: number | null;
  capacite?: number | null;
  mise_en_se?: string | null;
  coord_x: number | null;
  coord_y: number | null;
}

interface Barrage extends BarrageDto {
  lon: number;
  lat: number;
}

const LAMBERT =
  "+proj=lcc +lat_1=33.3 +lat_2=35.9 +lat_0=32.1 +lon_0=-5.4 +x_0=500000 +y_0=300000 +ellps=clrk80 +units=m +no_defs";

function convertXYtoLonLat(x: number, y: number): [number, number] {
  return proj4(LAMBERT, "EPSG:4326", [x, y]) as [number, number];
}

function geomKind(fc: FeatureCollection): "point" | "line" | "polygon" {
  const f = fc.features?.[0];
  const t = (f?.geometry?.type || "").toLowerCase();
  if (t.includes("point")) return "point";
  if (t.includes("line")) return "line";
  return "polygon";
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
    id: "osm",
    label: "Plan des rues",
    style: osmStyle,
  },
  {
    id: "carto-light",
    label: "Toile gris clair",
    style: makeRasterStyle(
      "carto-light",
      ["https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"],
      "© OpenStreetMap © CARTO"
    ),
  },
  {
    id: "carto-dark",
    label: "Toile gris foncé",
    style: makeRasterStyle(
      "carto-dark",
      ["https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"],
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

async function loadBarrages(): Promise<Barrage[]> {
  try {
    const res = await api.get<any>("/layers/barrages_abhs");
    const features = res.data?.features || [];

    return features.map((f: any) => {
      const props = f.properties;
      const cx = props.coord_x ?? NaN;
      const cy = props.coord_y ?? NaN;

      let lon = NaN;
      let lat = NaN;

      if (!Number.isNaN(cx) && !Number.isNaN(cy)) {
        [lon, lat] = convertXYtoLonLat(cx, cy);
      }

      return {
        ...props,
        lon,
        lat,
      };
    });
  } catch {
    return [];
  }
}

export default function Dashboard2() {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedSousBassinId, setSelectedSousBassinId] = useState<string | null>(null);
  const [selectedBarrageId, setSelectedBarrageId] = useState<number | null>(null);

  const [range, setRange] = useState<{ from: string; to: string }>({
    from: "2024-01-01",
    to: todayStr,
  });

  const [layers, setLayers] = useState<LayersState>({
    toggles: { ...DEFAULT_TOGGLES },
    barrages_list: {},
    sous_bassins_list: {},
    stations_list: {},
    zones_admin_list: {},
  });

  const [stations, setStations] = useState<Station[]>([]);
  const [barrages, setBarrages] = useState<Barrage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [basemapOpen, setBasemapOpen] = useState(false);
  const [layersPanelOpen, setLayersPanelOpen] = useState(false);
  const [basemapId, setBasemapId] = useState("osm");
  const [styleRevision, setStyleRevision] = useState(0);
  const [activeFilterSelection, setActiveFilterSelection] = useState<{
    type: string;
    ids: string[];
  } | null>(null);

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
    map.on("styledata", () => {
      if (map.isStyleLoaded()) {
        setStyleRevision((value) => value + 1);
      }
    });
    mapRef.current = map;

    return () => {
      try {
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

    Promise.all([loadStations(), loadBarrages()])
      .then(([st, br]) => {
        if (!alive) return;
        setStations(st);
        setBarrages(br);
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

  const togglesKey = useMemo(
    () =>
      Object.entries(layers.toggles)
        .map(([k, v]) => `${k}:${v ? 1 : 0}`)
        .join("|"),
    [layers.toggles]
  );

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyLayer = async (key: string) => {
      if (!map.isStyleLoaded()) {
        map.once("load", () => applyLayer(key));
        return;
      }

      const srcId = `base-src-${key}`;

      try {
        let url = `/layers/${key}`;
        if (key === "stations_abhs") {
          const stationIds = stations.map((s) => s.id).filter((id) => Number.isFinite(id));
          if (!stationIds.length) return;
          url += `?ids=${encodeURIComponent(stationIds.join(","))}`;
        }

        const res = await api.get<FeatureCollection>(url);
        const data = res.data;
        if (!data || !data.features || data.features.length === 0) return;

        if (!togglesRef.current[key]) {
          const existingLayerId = `base-layer-${key}`;
          if (map.getLayer(existingLayerId)) map.removeLayer(existingLayerId);
          if (map.getSource(srcId)) map.removeSource(srcId);
          return;
        }

        const kind = geomKind(data);
        if (map.getSource(srcId)) {
          (map.getSource(srcId) as GeoJSONSource).setData(data);
        } else {
          map.addSource(srcId, { type: "geojson", data });
        }

        const layerId = `base-layer-${key}`;
        if (map.getLayer(layerId)) map.removeLayer(layerId);

        map.addLayer({
          id: layerId,
          type: kind === "polygon" ? "fill" : kind === "line" ? "line" : "circle",
          source: srcId,
          paint:
            kind === "polygon"
              ? { "fill-color": "#4ade80", "fill-opacity": 0.25 }
              : kind === "line"
                ? { "line-color": "#2563eb", "line-width": 1.6 }
                : { "circle-radius": 4, "circle-color": "#0ea5e9" },
        } as LayerSpecification);
      } catch (e) {
        console.error(`Erreur chargement couche ${key}:`, e);
      }
    };

    Object.entries(layers.toggles).forEach(([key, on]) => {
      const srcId = `base-src-${key}`;
      const layerId = `base-layer-${key}`;
      if (on) void applyLayer(key);
      else {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(srcId)) map.removeSource(srcId);
      }
    });
  }, [togglesKey, stations, layers.toggles, styleRevision]);

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
      const res = await api.get<FeatureCollection>(`/layers/${layerKey}${query}`);
      const data = res.data;
      if (!data.features || data.features.length === 0) return;

      const kind = geomKind(data);
      const srcId = `sel-src-${layerKey}`;
      const layerId = `sel-layer-${layerKey}`;

      if (map.getSource(srcId)) (map.getSource(srcId) as GeoJSONSource).setData(data);
      else map.addSource(srcId, { type: "geojson", data });

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

      const bbox = turf.bbox(data) as [number, number, number, number];
      map.fitBounds(bbox, { padding: 50, duration: 900 });
    } catch (err) {
      console.error("Erreur couche filtree:", err);
    }
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
        let url = `/layers/${layerKey}`;
        if (layerKey === "stations_abhs") {
          const stationIds = stations.map((s) => s.id).filter((id) => Number.isFinite(id));
          if (!stationIds.length) return;
          url += `?ids=${encodeURIComponent(stationIds.join(","))}`;
        }

        const res = await api.get<FeatureCollection>(url);
        const data = res.data;
        if (!data?.features?.length) return;

        const bbox = turf.bbox(data) as [number, number, number, number];
        map.fitBounds(bbox, { padding: 50, duration: 900 });
      } catch (err) {
        console.error(`Erreur zoom couche ${layerKey}:`, err);
      }
    },
    [stations]
  );

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const onClickStation = (e: maplibregl.MapMouseEvent) => {
      const stationLayers = ["base-layer-stations_abhs", "sel-layer-stations_abhs"].filter(
        (id) => !!map.getLayer(id)
      );
      if (!stationLayers.length) return;

      const features = map.queryRenderedFeatures(e.point, { layers: stationLayers });
      const feature = features[0];
      if (!feature || !feature.properties) return;

      const stationId = Number(
        feature.properties.id ?? feature.properties.id_station ?? feature.properties.station_id
      );
      if (Number.isNaN(stationId)) return;
      if (!stations.some((s) => s.id === stationId)) return;

      setSelectedId(stationId);
      setSelectedSousBassinId(null);
      setSelectedBarrageId(null);
    };

    const onMouseMove = (e: maplibregl.MapMouseEvent) => {
      const stationLayers = ["base-layer-stations_abhs", "sel-layer-stations_abhs"].filter(
        (id) => !!map.getLayer(id)
      );
      if (!stationLayers.length) {
        map.getCanvas().style.cursor = "";
        return;
      }
      const features = map.queryRenderedFeatures(e.point, { layers: stationLayers });
      map.getCanvas().style.cursor = features.length ? "pointer" : "";
    };

    map.on("click", onClickStation);
    map.on("mousemove", onMouseMove);
    map.on("mouseleave", () => {
      map.getCanvas().style.cursor = "";
    });

    return () => {
      map.off("click", onClickStation);
      map.off("mousemove", onMouseMove);
    };
  }, [stations]);

  const handleSelectFilter = useCallback(
    (type: string, ids: string | string[]) => {
      if (!ids) return;

      const idArray = Array.isArray(ids) ? ids : [ids];
      setActiveFilterSelection({ type, ids: idArray });

      if (type === "sous-bassin") loadLayerForFilter("sous_bassin_sebou", idArray);
      if (type === "barrage") loadLayerForFilter("barrages_abhs", idArray);

      if (type === "station") {
        loadLayerForFilter("stations_abhs", idArray);
        const firstId = idArray[0];
        const station = stations.find((s) => String(s.id) === String(firstId));
        if (station) {
          setSelectedId(station.id);
          setSelectedSousBassinId(null);
          setSelectedBarrageId(null);
        }
      }

      if (type === "region") loadLayerForFilter("adm_regions_abhs", idArray);
      if (type === "province") loadLayerForFilter("adm_provinces_abhs", idArray);
      if (type === "cercle") loadLayerForFilter("adm_cercles_abhs", idArray);
      if (type === "commune") loadLayerForFilter("adm_communes_abhs", idArray);
      if (type === "ville") loadLayerForFilter("adm_villes_abhs", idArray);
      if (type === "douar") loadLayerForFilter("adm_douars_abhs", idArray);
    },
    [loadLayerForFilter, stations]
  );

  useEffect(() => {
    if (!activeFilterSelection) return;
    const { type, ids } = activeFilterSelection;
    const idArray = ids;

    if (type === "sous-bassin") void loadLayerForFilter("sous_bassin_sebou", idArray);
    if (type === "barrage") void loadLayerForFilter("barrages_abhs", idArray);
    if (type === "station") void loadLayerForFilter("stations_abhs", idArray);
    if (type === "region") void loadLayerForFilter("adm_regions_abhs", idArray);
    if (type === "province") void loadLayerForFilter("adm_provinces_abhs", idArray);
    if (type === "cercle") void loadLayerForFilter("adm_cercles_abhs", idArray);
    if (type === "commune") void loadLayerForFilter("adm_communes_abhs", idArray);
    if (type === "ville") void loadLayerForFilter("adm_villes_abhs", idArray);
    if (type === "douar") void loadLayerForFilter("adm_douars_abhs", idArray);
  }, [activeFilterSelection, loadLayerForFilter, styleRevision]);

  const selectedLabel = useMemo(() => {
    if (selectedId) return `Station ${selectedId}`;
    if (selectedSousBassinId) return `Sous-bassin ${selectedSousBassinId}`;
    if (selectedBarrageId) return `Barrage ${selectedBarrageId}`;
    return "—";
  }, [selectedId, selectedSousBassinId, selectedBarrageId]);

  const selectedName = useMemo(() => {
    if (selectedId) return stations.find((s) => s.id === selectedId)?.name ?? "—";
    if (selectedBarrageId) return barrages.find((b) => b.id === selectedBarrageId)?.nom_barrage ?? "—";
    if (selectedSousBassinId) return `ID ${selectedSousBassinId}`;
    return "—";
  }, [stations, barrages, selectedId, selectedSousBassinId, selectedBarrageId]);

  return (
    <div className="h-full bg-white">
      <div className="h-full px-4 py-0 lg:px-0">
        <main className="h-full min-w-0">
          <section className="relative h-[calc(100vh-77px)] min-h-[calc(100vh-77px)] overflow-hidden bg-white">
            <div className="relative h-full">
              <div
                className={[
                  "absolute left-4 top-4 z-10 flex flex-col items-start gap-3",
                  "xl:left-4",
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => setBasemapOpen((value) => !value)}
                  className="flex items-center gap-3 rounded-2xl border border-emerald-200/20 bg-[linear-gradient(135deg,rgba(7,59,76,0.96),rgba(15,118,110,0.92),rgba(31,41,55,0.96))] px-4 py-3 text-emerald-50 shadow-[0_18px_45px_-20px_rgba(8,15,30,0.9)] backdrop-blur-md transition hover:border-amber-200/30 hover:bg-[linear-gradient(135deg,rgba(12,74,110,0.95),rgba(13,148,136,0.92),rgba(180,83,9,0.88))]"
                  aria-label={basemapOpen ? "Masquer les cartes de base" : "Afficher les cartes de base"}
                >
                  <Layers3 className="h-5 w-5" />
                  <span className="whitespace-nowrap text-sm font-semibold">Carte de base</span>
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setLayersPanelOpen((value) => !value)}
                    className="flex items-center gap-3 rounded-2xl border border-emerald-200/20 bg-[linear-gradient(135deg,rgba(7,59,76,0.96),rgba(15,118,110,0.92),rgba(31,41,55,0.96))] px-4 py-3 text-emerald-50 shadow-[0_18px_45px_-20px_rgba(8,15,30,0.9)] backdrop-blur-md transition hover:border-amber-200/30 hover:bg-[linear-gradient(135deg,rgba(12,74,110,0.95),rgba(13,148,136,0.92),rgba(180,83,9,0.88))]"
                    aria-label={layersPanelOpen ? "Masquer le panneau des couches" : "Afficher le panneau des couches"}
                  >
                    <PanelLeft className="h-5 w-5" />
                    <span className="whitespace-nowrap text-sm font-semibold">Couches d'observatoire</span>
                  </button>

                  {layersPanelOpen && (
                    <div className="mt-3 hidden w-[340px] max-w-[calc(100vw-7rem)] xl:block">
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

                {basemapOpen && (
                  <div className="ml-1 mt-1 w-72 overflow-hidden rounded-[26px] border border-emerald-200/20 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.14),transparent_30%),linear-gradient(180deg,#083344_0%,#115e59_42%,#1f2937_100%)] text-emerald-50 shadow-[0_28px_80px_-28px_rgba(8,15,30,0.96)] backdrop-blur-xl">
                    <div className="flex items-center justify-between border-b border-emerald-100/10 bg-slate-950/20 px-4 py-3">
                      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-emerald-50/95">
                        <Layers3 className="h-4 w-4" />
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

                    <div className="space-y-1 p-3">
                      {BASEMAP_OPTIONS.map((option) => {
                        const isActive = basemapId === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setBasemapId(option.id)}
                            className={[
                              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition",
                              isActive
                                ? "border border-amber-200/30 bg-amber-300/15 text-white"
                                : "text-emerald-50/85 hover:bg-white/10 hover:text-white",
                            ].join(" ")}
                          >
                            <span
                              className={[
                                "h-3 w-3 rounded-full border",
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
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
