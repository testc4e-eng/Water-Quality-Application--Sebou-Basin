// frontend/src/lib/api.ts
import axios from "axios";

// ✅ Base : inclut déjà /api/v1 (pas besoin d'en rajouter dans le code)
const base =
  import.meta.env.VITE_API_BASE?.trim().replace(/\/+$/, "") ||
  "http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL: base,
  withCredentials: false,
});

export default api;
