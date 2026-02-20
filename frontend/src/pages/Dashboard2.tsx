/* frontend/src/pages/Dashboard2.tsx */
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import maplibregl, {
  Map as MapLibreMap,
  GeoJSONSource,
  LayerSpecification,
} from "maplibre-gl";
import proj4 from "proj4";
import * as turf from "@turf/turf";

import KPISection from "@/components/Dashboard/KPISection.jsx";
import SidebarFilters, { LayersState } from "@/components/Filters/SidebarFilters";
import AlertPanel from "@/components/Dashboard/AlertPanel.jsx";
import TimeSeriesLinked from "@/components/Charts/TimeSeriesLinked.jsx";
import LatestMeasuresTable from "@/components/Tables/LatestMeasuresTable.jsx";
import ExtraCharts from "@/components/Charts/ExtraCharts.jsx";

import { api } from "@/api/client";
import { DEFAULT_TOGGLES } from "@/layers/config";
import type { FeatureCollection } from "geojson";
import osmStyle from "@/lib/osmStyle";

/* =================== Types =================== */
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

/* =================== Projection =================== */
const LAMBERT =
  "+proj=lcc +lat_1=33.3 +lat_2=35.9 +lat_0=32.1 +lon_0=-5.4 +x_0=500000 +y_0=300000 +ellps=clrk80 +units=m +no_defs";

function convertXYtoLonLat(x: number, y: number): [number, number] {
  return proj4(LAMBERT, "EPSG:4326", [x, y]) as [number, number];
}
function fmt(n: number | null | undefined, d = 5): string {
  if (n == null || Number.isNaN(Number(n))) return "-";
  return Number(n).toFixed(d);
}

/* =================== API Loaders =================== */
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









/* =================== Helpers =================== */
function geomKind(fc: FeatureCollection): "point" | "line" | "polygon" {
  const f = fc.features?.[0];
  const t = (f?.geometry?.type || "").toLowerCase();
  if (t.includes("point")) return "point";
  if (t.includes("line")) return "line";
  return "polygon";
}

/* =====================================================
   COMPONENT PRINCIPAL
===================================================== */
export default function Dashboard2() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedSousBassinId, setSelectedSousBassinId] = useState<string | null>(null);
  const [selectedBarrageId, setSelectedBarrageId] = useState<number | null>(null);

  const [range, setRange] = useState<{ from: string; to: string }>({
    from: "2025-08-01",
    to: "2025-09-01",
  });

  const [layers, setLayers] = useState<LayersState>({
    toggles: DEFAULT_TOGGLES,
    barrages_list: {},
    sous_bassins_list: {},
    stations_list: {},
    zones_admin_list: {},
  });

  const [stations, setStations] = useState<Station[]>([]);
  const [barrages, setBarrages] = useState<Barrage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  /* ---------- Initialisation carte ---------- */
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const styleSpec = import.meta.env.VITE_MAP_STYLE_URL || osmStyle;
    const map = new maplibregl.Map({
      container: mapContainerRef.current!,
      style: styleSpec as any,
      center: [-5.4, 34.0],
      zoom: 7,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
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


  /* ---------- Interaction : clic sur station ---------- */
useEffect(() => {
  const map = mapRef.current;
  if (!map) return;

  const onClickStation = (e: maplibregl.MapMouseEvent) => {
    const feature = e.features?.[0];
    if (!feature || !feature.properties) return;

    const stationId = Number(feature.properties.id_station);
    if (Number.isNaN(stationId)) return;

    // ✅ MAJ centrale
    setSelectedId(stationId);
    setSelectedSousBassinId(null);
    setSelectedBarrageId(null);

    console.log("📍 Station sélectionnée :", stationId);
  };

  // 🔹 Activer clic sur la couche stations
  map.on("click", "base-layer-stations_abhs", onClickStation);

  // 🔹 Curseur pointer
  map.on("mouseenter", "base-layer-stations_abhs", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "base-layer-stations_abhs", () => {
    map.getCanvas().style.cursor = "";
  });

  return () => {
    map.off("click", "base-layer-stations_abhs", onClickStation);
  };
}, []);

  /* ---------- Charger données principales ---------- */
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setLoadError(null);
    Promise.all([loadStations(), loadBarrages()])
      .then(([st, br]) => {
        if (!alive) return;
        setStations(st);
        setBarrages(br);
        if (st.length && selectedId == null) setSelectedId(st[0].id);
      })
      .catch(() => setLoadError("Erreur de chargement"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [selectedId]);

  /* ==========================================================
     A. Chargement des couches de base (checkbox)
  ========================================================== */
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
        const res = await fetch(`http://127.0.0.1:8000/api/v1/layers/${key}`);
        if (!res.ok) {
          console.warn(`⚠️ Couche ${key} introuvable (${res.status})`);
          return;
        }

        const data: FeatureCollection = await res.json();
        if (!data || !data.features || data.features.length === 0) {
          console.info(`ℹ️ Couche ${key} vide`);
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

        console.log(`✅ Couche ${key} chargée (${data.features.length} entités)`);
      } catch (e) {
        console.error(`❌ Erreur chargement couche ${key}:`, e);
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
  }, [togglesKey]);

  /* ==========================================================
     B. Chargement d’une sélection filtrée (sous-bassin, barrage…)
  ========================================================== */
  const loadLayerForFilter = useCallback(
  async (layerKey: string, selectedIds?: string | string[]) => {
    const map = mapRef.current;
    if (!map) return;

    if (!map.isStyleLoaded()) {
      map.once("load", () => loadLayerForFilter(layerKey, selectedIds));
      return;
    }

    try {
      // 🔹 Convertir sélection en liste
      const idsArray = Array.isArray(selectedIds)
        ? selectedIds.filter(Boolean)
        : selectedIds
        ? [selectedIds]
        : [];

      // 🔹 Construire query paramètre
      const query =
        idsArray.length > 0
          ? `?ids=${encodeURIComponent(idsArray.join(","))}`
          : "";

      const res = await fetch(`http://127.0.0.1:8000/api/v1/layers/${layerKey}${query}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: FeatureCollection = await res.json();
      if (!data.features || data.features.length === 0) {
        console.warn(`⚠️ Couche ${layerKey} vide`);
        return;
      }

      const kind = geomKind(data);
      const srcId = `sel-src-${layerKey}`;
      const layerId = `sel-layer-${layerKey}`;

      // 🔹 Injecter ou mettre à jour la source
      if (map.getSource(srcId)) (map.getSource(srcId) as GeoJSONSource).setData(data);
      else map.addSource(srcId, { type: "geojson", data });

      // 🔹 Supprimer ancienne couche avant d’en recréer une
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

      // 🔹 Calculer le bounding box global
      const bbox = turf.bbox(data) as [number, number, number, number];
      map.fitBounds(bbox, { padding: 50, duration: 900 });

      console.log(`✅ Couche ${layerKey} affichée (${data.features.length} entités)`);
    } catch (err) {
      console.error("Erreur couche filtrée:", err);
    }
  },
  []
);


/* ---------- Interaction : clic sur station ---------- */
useEffect(() => {
  const map = mapRef.current;
  if (!map) return;

  const layerId = "base-layer-stations_abhs";

  const onClickStation = (e: maplibregl.MapMouseEvent) => {
    const feature = e.features?.[0];
    if (!feature || !feature.properties) return;

    const stationId = Number(feature.properties.id);   
    if (Number.isNaN(stationId)) return;

    setSelectedId(stationId);
    setSelectedSousBassinId(null);
    setSelectedBarrageId(null);

    console.log("📍 Station sélectionnée :", stationId);
  };

  map.on("click", layerId, onClickStation);
  map.on("mouseenter", layerId, () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", layerId, () => {
    map.getCanvas().style.cursor = "";
  });

  return () => {
    map.off("click", layerId, onClickStation);
  };
}, []);





  /* ---------- Sélection d’un filtre depuis la sidebar ---------- */


  // const handleSelectFilter = useCallback(
  //   (type: string, id: string) => {
  //     if (!id) return;
  //     if (type === "sous-bassin") loadLayerForFilter("sous_bassin_sebou", id);
  //     if (type === "barrage") loadLayerForFilter("barrages_abhs", id);
  //     if (type === "station") loadLayerForFilter("stations_abhs", id);
  //     if (type === "region") loadLayerForFilter("adm_regions_abhs", id);
  //   },
  //   [loadLayerForFilter]
  // );
  const handleSelectFilter = useCallback(
  (type: string, ids: string | string[]) => {
    if (!ids) return;

    const idArray = Array.isArray(ids) ? ids : [ids];
 // --- Hydrologie ---
    if (type === "sous-bassin") loadLayerForFilter("sous_bassin_sebou", idArray);
    if (type === "barrage") loadLayerForFilter("barrages_abhs", idArray);

    if (type === "station") {
  loadLayerForFilter("stations_abhs", idArray);

  const ire = idArray[0];
  const st = stations.find(s => String(s.id) === String(ire));
  if (st) {
    setSelectedId(st.id);
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
  [loadLayerForFilter]
);


  /* ---------- UI ---------- */
  const selectedLabel = useMemo(() => {
    if (selectedId) return `Station ${selectedId}`;
    if (selectedSousBassinId) return `Sous-bassin ${selectedSousBassinId}`;
    if (selectedBarrageId) return `Barrage ${selectedBarrageId}`;
    return "—";
  }, [selectedId, selectedSousBassinId, selectedBarrageId]);

  const selectedName = useMemo(() => {
    if (selectedId)
      return stations.find((s) => s.id === selectedId)?.name ?? "—";
    if (selectedBarrageId)
      return barrages.find((b) => b.id === selectedBarrageId)?.nom_barrage ?? "—";
    if (selectedSousBassinId) return `ID ${selectedSousBassinId}`;
    return "—";
  }, [stations, barrages, selectedId, selectedSousBassinId, selectedBarrageId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-6 grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="hidden xl:block">
          <div className="sticky top-20 rounded-2xl border shadow-sm p-4 bg-white">
            <SidebarFilters
              range={range}
              setRange={setRange}
              layers={layers}
              setLayers={setLayers}
              onApply={() => {}}
              onSelectFilter={handleSelectFilter}
            />
          </div>
        </aside>

        <main className="space-y-6 min-w-0">
          <KPISection />
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-2xl border bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <div className="font-semibold">Carte</div>
                <div className="text-sm text-muted-foreground">
                  Sélection : {selectedLabel} • {selectedName}
                </div>
              </div>
              {loading && <div className="p-4 text-sm">Chargement…</div>}
              {loadError && !loading && (
                <div className="p-4 text-sm text-red-600">Erreur : {loadError}</div>
              )}
              <div ref={mapContainerRef} className="h-[590px] w-full" />
            </div>

            <div className="rounded-2xl border bg-white shadow-sm">
              <div className="px-4 py-2 border-b font-semibold">
                Alertes Actives
              </div>
              <div className="p-3"><AlertPanel /></div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border bg-white shadow-sm p-3">
              <div className="font-bold mb-2">Évolution (sélection)</div>
              <TimeSeriesLinked
                stationId={selectedId}
                sousBassinId={selectedSousBassinId}
                barrageId={selectedBarrageId}
                range={{ dateFrom: range.from, dateTo: range.to }}
              />
            </div>
            <LatestMeasuresTable
              stationId={selectedId}
              sousBassinId={selectedSousBassinId}
              barrageId={selectedBarrageId}
              range={{ dateFrom: range.from, dateTo: range.to }}
            />
          </section>

          <section className="rounded-2xl border bg-white shadow-sm p-3">
            <div className="font-bold mb-3">Analyses complémentaires</div>
            <ExtraCharts
              stationId={selectedId}
              sousBassinId={selectedSousBassinId}
              barrageId={selectedBarrageId}
              range={{ dateFrom: range.from, dateTo: range.to }}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
