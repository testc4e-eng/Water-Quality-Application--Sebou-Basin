/* frontend/src/pages/Dashboard2.tsx */
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import maplibregl from "maplibre-gl";

import KPISection from "@/components/Dashboard/KPISection.jsx";
import SidebarFilters from "@/components/Filters/SidebarFilters.jsx";
import AlertPanel from "@/components/Dashboard/AlertPanel.jsx";
import TimeSeriesLinked from "@/components/Charts/TimeSeriesLinked.jsx";
import LatestMeasuresTable from "@/components/Tables/LatestMeasuresTable.jsx";
import ExtraCharts from "@/components/Charts/ExtraCharts.jsx";
import { api, getGeoJSON } from "@/api/client";
import { listRawTables, getRawRows } from "@/api/client";
import { getSousBassinsGeoJSON, GeoJSON } from "@/api/client";


/* -------------------------------------------------
   Types locaux
------------------------------------------------- */
type Station = {
  id: number;
  name: string;
  river?: string | null;
  lat: number; // EPSG:4326
  lon: number; // EPSG:4326
};

// GeoJSON minimal pour nos besoins (évite any)
type GeoData = GeoJSON.FeatureCollection | GeoJSON.Feature | string;

/* -------------------------------------------------
   API
------------------------------------------------- */
async function loadStations(): Promise<Station[]> {
  const res = await api.get<Station[]>("/stations");
  return (res.data || []).map((s) => ({
    id: Number(s.id),
    name: String(s.name),
    river: s.river ?? null,
    lat: Number(s.lat),
    lon: Number(s.lon),
  }));
}

/* -------------------------------------------------
   Helpers popup
------------------------------------------------- */
function fmt(n: number | null | undefined, d = 5) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "-";
  return Number(n).toFixed(d);
}
function createStationPopupEl(s: Station) {
  const wrap = document.createElement("div");
  wrap.className = "popup-station";
  wrap.innerHTML = `
    <header>${s.name}</header>
    <table>
      <thead><tr><th>Champ</th><th>Valeur</th></tr></thead>
      <tbody>
        <tr><td>Code</td><td>${s.id}</td></tr>
        <tr><td>Nom</td><td>${s.name}</td></tr>
        <tr><td>Rivière</td><td>${s.river ?? "-"}</td></tr>
        <tr><td>Latitude</td><td>${fmt(s.lat)}</td></tr>
        <tr><td>Longitude</td><td>${fmt(s.lon)}</td></tr>
      </tbody>
    </table>
  `;
  return wrap;
}

/* -------------------------------------------------
   Composant
------------------------------------------------- */
export default function Dashboard2() {
  // -------------------- ÉTATS --------------------
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [range, setRange] = useState({ from: "2025-08-01", to: "2025-09-01" });
  const [sources, setSources] = useState({ swat: true, wasp: true, iot: true });

  // couches carte (clé = endpoint /api/v1/geojson/<clé>)
  const [layers, setLayers] = useState({
    bassin: true,
    sous_bassin: false,
    reseau: true,
    stations: true,
    barrages: false,
    points_eau: false,
    mines: false,
    capteurs: false,
  });

  // Données carte
  const [stations, setStations] = useState<Station[]>([]);
  const [loadingStations, setLoadingStations] = useState(false);
  const [errorStations, setErrorStations] = useState<string | null>(null);
  const [showSousBassins, setShowSousBassins] = useState<boolean>(false);
  const [sousBassins, setSousBassins] = useState<GeoJSON.FeatureCollection | null>(null);

  // MapLibre refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const openedPopupRef = useRef<maplibregl.Popup | null>(null);

  // -------------------- EFFETS --------------------
  useEffect(() => {
    setLoadingStations(true);
    setErrorStations(null);
    loadStations()
      .then((st) => {
        setStations(st);
        if (st.length && selectedId == null) setSelectedId(st[0].id);
      })
      .catch((e: unknown) => {
        const message =
          e && typeof e === "object" && "toString" in e
            ? (e as { toString: () => string }).toString()
            : "Network Error";
        console.error(e);
        setErrorStations(message);
      })
      .finally(() => setLoadingStations(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Pré-charger pour éviter le délai à la 1ère activation
    getSousBassinsGeoJSON()
      .then(setSousBassins)
      .catch((e) => console.error("Sous-bassins fetch error:", e));
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [-5.0, 34.0], // approx Sebou
      zoom: 6,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (openedPopupRef.current) openedPopupRef.current.remove();
      openedPopupRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Nettoyage marqueurs/popup
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    if (openedPopupRef.current) {
      openedPopupRef.current.remove();
      openedPopupRef.current = null;
    }

    if (!stations.length) return;

    stations.forEach((s) => {
      if (Number.isNaN(s.lon) || Number.isNaN(s.lat)) return;

      const el = document.createElement("div");
      el.style.width = "12px";
      el.style.height = "12px";
      el.style.borderRadius = "50%";
      el.style.background = s.id === selectedId ? "#1f6feb" : "#22c55e";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 0 0 1px rgba(0,0,0,.2)";
      el.style.cursor = "pointer";

      const popup = new maplibregl.Popup({
        className: "station-popup",
        closeButton: false,
        offset: 18,
        anchor: "top",
      }).setDOMContent(createStationPopupEl(s));

      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([s.lon, s.lat])
        .addTo(map);

      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        setSelectedId(s.id);
        if (openedPopupRef.current) openedPopupRef.current.remove();
        popup.setLngLat([s.lon, s.lat]).addTo(map);
        openedPopupRef.current = popup;
        map.easeTo({ center: [s.lon, s.lat], zoom: Math.max(map.getZoom(), 8), duration: 400 });
      });

      markersRef.current.push(marker);
    });

    if (stations.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      stations.forEach((s) => bounds.extend([s.lon, s.lat]));
      map.fitBounds(bounds, { padding: 40, maxZoom: 11, duration: 0 });
    }
  }, [stations, selectedId]);

  /* -------- Couches GeoJSON (ON/OFF) -------- */
  async function fetchLayerGeo(layerKey: string): Promise<GeoData> {
    // getGeoJSON renvoie typiquement un GeoJSON (ou string URL).
    return getGeoJSON(layerKey) as Promise<GeoData>;
  }

  // Ajoute/MAJ une source GeoJSON sans any
  function ensureSource(map: maplibregl.Map, id: string, data: GeoData) {
    const existing = map.getSource(id);
    if (existing && "setData" in (existing as object)) {
      const src = existing as maplibregl.GeoJSONSource;
      if (typeof data === "string") {
        src.setData(data);
      } else if ("type" in data) {
        // Feature ou FeatureCollection
        src.setData(data as GeoJSON.Feature | GeoJSON.FeatureCollection);
      }
      return;
    }

    if (!existing) {
      const source = { type: "geojson", data } as unknown; // éviter any
      // on passe par une signature non typée pour ne pas utiliser 'any'
      (map as unknown as { addSource: (sid: string, src: unknown) => void }).addSource(id, source);
    }
  }

  // Ajoute la couche en fonction de son type (sans any)
  function ensureLayer(map: maplibregl.Map, id: string, type: "fill" | "line" | "circle") {
    if (map.getLayer(id)) return;

    const paint: Record<string, string | number> = {};
    const layout: Record<string, string | number> = { visibility: "visible" };

    if (type === "fill") {
      paint["fill-color"] = id.includes("bassin") ? "#22c55e" : "#86efac";
      paint["fill-opacity"] = 0.25;
      paint["fill-outline-color"] = "#16a34a";
    }
    if (type === "line") {
      paint["line-color"] = "#2563eb";
      paint["line-width"] = 1.2;
    }
    if (type === "circle") {
      paint["circle-radius"] = 4;
      paint["circle-color"] = "#0ea5e9";
      paint["circle-stroke-color"] = "#fff";
      paint["circle-stroke-width"] = 1;
    }

    const layerDef = {
      id,
      type,
      source: id,
      paint,
      layout,
    } as const;

    // idem : on appelle via une signature permissive pour éviter 'any'
    (map as unknown as { addLayer: (layer: unknown) => void }).addLayer(layerDef);
  }

  function setVisible(map: maplibregl.Map, id: string, visible: boolean) {
    if (!map.getLayer(id)) return;
    map.setLayoutProperty(id, "visibility", visible ? "visible" : "none");
  }

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const list: Array<{ key: keyof typeof layers; type: "fill" | "line" | "circle" }> = [
      { key: "bassin", type: "fill" },
      { key: "sous_bassin", type: "fill" },
      { key: "reseau", type: "line" },
      { key: "stations", type: "circle" },
      { key: "barrages", type: "circle" },
      { key: "points_eau", type: "circle" },
      { key: "mines", type: "circle" },
      { key: "capteurs", type: "circle" },
    ];

    list.forEach(async ({ key, type }) => {
      const id = `layer_${key}`;
      const visible = layers[key];

      if (!map.getSource(id) && visible) {
        try {
          const data = await fetchLayerGeo(String(key));
          ensureSource(map, id, data);
          ensureLayer(map, id, type);
        } catch (e) {
          console.error("GeoJSON", key, e);
        }
      } else if (map.getSource(id)) {
        setVisible(map, id, visible);
      }
    });
  }, [layers]);

  // -------------------- ACTIONS --------------------
  const applyFilters = useCallback(() => {
    console.log("Filtres appliqués :", range, sources);
  }, [range, sources]);

  const selectedLabel = useMemo(() => (selectedId != null ? String(selectedId) : "—"), [selectedId]);
  const selectedName = useMemo(
    () => stations.find((s) => s.id === selectedId)?.name ?? "—",
    [stations, selectedId]
  );

  // -------------------- RENDER --------------------
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-6 grid gap-6 xl:grid-cols-[320px_1fr]">
        {/* COLONNE GAUCHE : SIDEBAR (stylé + sticky) */}
        <aside className="hidden xl:block">
          <div className="sticky top-20 rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white shadow-sm p-4">
            <SidebarFilters
              range={range}
              setRange={setRange}
              sources={sources}
              setSources={setSources}
              onApply={applyFilters}
              layers={layers}
              setLayers={setLayers}
            />
          </div>
        </aside>

        {/* COLONNE DROITE : CONTENU */}
        <main className="space-y-6">
          <KPISection />

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-2xl border bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <div className="font-semibold">Carte des stations</div>
                <div className="text-sm text-muted-foreground">
                  Sélection : {selectedLabel} &nbsp;•&nbsp; {selectedName}
                </div>
              </div>
              {loadingStations && (
                <div className="p-4 text-sm text-muted-foreground">Chargement des stations…</div>
              )}
              {!loadingStations && !errorStations && stations.length === 0 && (
                <div className="p-4 text-sm">Aucune station trouvée.</div>
              )}
              {errorStations && !loadingStations && (
                <div className="p-4 text-sm text-red-600">Erreur : {errorStations}</div>
              )}
              {/* Remplacement du style inline par Tailwind */}
              <div ref={mapContainerRef} className="h-[390px] w-full" />
            </div>

            <div className="rounded-2xl border bg-white shadow-sm">
              <div className="px-4 py-2 border-b font-semibold">Alertes Actives</div>
              <div className="p-3">
                <AlertPanel />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border bg-white shadow-sm p-3">
              <div className="font-bold mb-2">Évolution (station sélectionnée)</div>
              <TimeSeriesLinked
                stationId={selectedId || undefined}
                range={{ dateFrom: range.from, dateTo: range.to }}
                /* showSWAT / showWASP retirés : le composant ne les accepte pas côté typings */
              />
            </div>

            <LatestMeasuresTable
              stationId={selectedId || undefined}
              range={{ dateFrom: range.from, dateTo: range.to }}
            />
          </section>

          <section className="rounded-2xl border bg-white shadow-sm p-3">
            <div className="font-bold mb-3">Analyses complémentaires</div>
            <ExtraCharts
              stationId={selectedId || undefined}
              range={{ dateFrom: range.from, dateTo: range.to }}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
