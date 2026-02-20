import React, { useEffect, useRef } from "react";
//import maplibregl from "maplibre-gl";

// ⚠️ Pense à importer la CSS une seule fois dans ton app :
// import "maplibre-gl/dist/maplibre-gl.css";

export default function InteractiveMap({ stations = [], selectedId, onSelect }) {
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
      if (
        s?.coords &&
        typeof s.coords.lon === "number" &&
        typeof s.coords.lat === "number"
      ) {
        const ll = [s.coords.lon, s.coords.lat];

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

  return (
    <div
      ref={ref}
      style={{ width: "100%", height: "100%", minHeight: 360, background: "#eef2f7" }}
    />
  );
}
