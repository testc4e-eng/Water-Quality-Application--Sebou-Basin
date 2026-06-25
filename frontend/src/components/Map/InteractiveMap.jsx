import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { LAYER_STYLES } from "@/config/mapStyles";

// ⚠️ Pense à importer la CSS une seule fois dans ton app :
// import "maplibre-gl/dist/maplibre-gl.css";

export default function InteractiveMap({
  stations = [],
  selectedId,
  onSelect,
  geoLayers = {},
}) {
  const ref = useRef(null);
  const mapRef = useRef(null);

  // Init carte (une seule fois)
  useEffect(() => {
    if (!ref.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: ref.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [-3, 32],
      zoom: 4,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }));
    mapRef.current = map;

    // Cleanup
    return () => {
      try {
        (map._markers || []).forEach((m) => m.remove());
        map.remove();
      } catch (err) {
        // On ignore proprement les erreurs de destruction (StrictMode double-invoke, etc.)
        console.debug("Map cleanup ignored:", err);
      }
      mapRef.current = null;
    };
  }, []);

  // Markers + fitBounds
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!map._markers) map._markers = [];
    map._markers.forEach((m) => m.remove());
    map._markers = [];

    const bounds = new maplibregl.LngLatBounds();
    let n = 0;

    stations.forEach((s) => {
      const lon = Number(s?.coords?.lon);
      const lat = Number(s?.coords?.lat);
      const isValidCoord =
        Number.isFinite(lon) &&
        Number.isFinite(lat) &&
        lon !== 0 &&
        lat !== 0 &&
        Math.abs(lon) <= 180 &&
        Math.abs(lat) <= 90;
      if (
        s?.coords &&
        isValidCoord
      ) {
        const ll = [lon, lat];

        const el = document.createElement("div");
        el.style.width = "10px";
        el.style.height = "10px";
        el.style.borderRadius = "50%";
        el.style.background = s.id === selectedId ? "#1d4ed8" : "#0ea5e9";
        el.style.border = "2px solid white";
        el.style.boxShadow = "0 1px 6px rgba(0,0,0,.25)";
        el.style.cursor = "pointer";
        el.addEventListener("click", () => onSelect?.(s.id));

        const mk = new maplibregl.Marker({ element: el })
          .setLngLat(ll)
          .setPopup(
            new maplibregl.Popup().setHTML(
              `<b>${s.name}</b><br>${s.river || ""}`
            )
          )
          .addTo(map);

        map._markers.push(mk);
        bounds.extend(ll);
        n++;
      }
    });

    if (n > 0) {
      map.fitBounds(bounds, { padding: 40, maxZoom: 12 });
    } else {
      map.setCenter([-7, 32]);
      map.setZoom(5);
    }
  }, [stations, selectedId, onSelect]);

  // GeoJSON layers with explicit visual hierarchy:
  // polygons (basin/subbasin) -> lines (hydro) -> points (pollution/station)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const ensureLayer = (sourceId, layerId, type, data, paint) => {
      if (!data) return;

      if (map.getSource(sourceId)) {
        map.getSource(sourceId).setData(data);
      } else {
        map.addSource(sourceId, { type: "geojson", data });
      }

      if (map.getLayer(layerId)) map.removeLayer(layerId);

      map.addLayer({
        id: layerId,
        type,
        source: sourceId,
        paint,
      });
    };

    const applyAll = () => {
      // 1) Polygons
      ensureLayer(
        "src-basin",
        "lyr-basin",
        "line",
        geoLayers.basin,
        {
          "line-color": LAYER_STYLES.basin.color,
          "line-width": LAYER_STYLES.basin.weight,
          "line-opacity": LAYER_STYLES.basin.opacity,
        }
      );

      ensureLayer(
        "src-subbasin-swat",
        "lyr-subbasin-swat",
        "line",
        geoLayers.subbasin_swat,
        {
          "line-color": LAYER_STYLES.subbasin_swat.color,
          "line-width": LAYER_STYLES.subbasin_swat.weight,
          "line-opacity": LAYER_STYLES.subbasin_swat.opacity,
        }
      );

      // 2) Lines
      ensureLayer(
        "src-hydro-network",
        "lyr-hydro-network",
        "line",
        geoLayers.hydro_network,
        {
          "line-color": LAYER_STYLES.hydro_network.color,
          "line-width": LAYER_STYLES.hydro_network.weight,
          "line-opacity": LAYER_STYLES.hydro_network.opacity,
        }
      );

      // 3) Points (always on top)
      ensureLayer(
        "src-pollution",
        "lyr-pollution",
        "circle",
        geoLayers.pollution,
        {
          "circle-color": LAYER_STYLES.pollution.color,
          "circle-radius": LAYER_STYLES.pollution.radius,
          "circle-opacity": 0.95,
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 1.5,
        }
      );

      if (geoLayers.station) {
        ensureLayer(
          "src-station",
          "lyr-station",
          "circle",
          geoLayers.station,
          {
            "circle-color": LAYER_STYLES.station.color,
            "circle-radius": LAYER_STYLES.station.radius,
            "circle-opacity": 0.95,
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 1.5,
          }
        );
      }
    };

    if (!map.isStyleLoaded()) {
      map.once("load", applyAll);
      return;
    }
    applyAll();
  }, [geoLayers]);

  return (
    <div
      ref={ref}
      style={{ width: "100%", height: "100%", minHeight: 360, background: "#eef2f7" }}
    />
  );
}
