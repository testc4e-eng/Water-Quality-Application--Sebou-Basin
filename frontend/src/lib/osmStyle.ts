// frontend/src/lib/osmStyle.ts
import type { StyleSpecification } from "maplibre-gl";

/**
 * Style raster OpenStreetMap – aucune clé nécessaire.
 * À utiliser comme fallback si VITE_MAP_STYLE_URL n'est pas défini.
 */
const osmStyle: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export default osmStyle;
