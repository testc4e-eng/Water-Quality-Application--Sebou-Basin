import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Fallback aligné sur la stack SAD Docker locale publiée sur 8010.
const API_TARGET = process.env.VITE_API_PROXY ?? "http://127.0.0.1:8010";

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    'global': 'window',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },
  build: {
    // Seuil d'alerte relevé à 1 Mo : après découpage, les chunks vendor lourds
    // (maplibre, export PDF, socle React+UI) restent au-dessus de 500 kB par
    // nature. Toute régression au-delà de 1 Mo reste signalée.
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Isole uniquement les dépendances « feuilles » lourdes (que le reste
        // du code importe sans qu'elles ré-importent l'app) en chunks vendor
        // dédiés, pour casser le bundle monolithique (~3,5 Mo) et améliorer la
        // mise en cache. React / Radix / router restent dans un vendor commun
        // pour éviter les dépendances de chunks circulaires.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("maplibre-gl") || id.includes("react-map-gl")) return "vendor-maplibre";
          if (id.includes("leaflet")) return "vendor-leaflet";
          if (id.includes("/xlsx")) return "vendor-xlsx";
          if (id.includes("jspdf") || id.includes("html2canvas") || id.includes("file-saver")) return "vendor-export";
          if (id.includes("@turf") || id.includes("proj4")) return "vendor-geo";
          if (id.includes("chart.js") || id.includes("react-chartjs-2") || id.includes("recharts")) return "vendor-charts";
          return "vendor";
        },
      },
    },
  },
});
