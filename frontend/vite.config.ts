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
});
