import axios from "axios";
import type { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

/* ================================
   1) CONFIG AXIOS (base unique)
   ================================ */

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

export const api = axios.create({
  baseURL: BASE_URL, // <- pointe déjà sur /api/v1
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
  validateStatus: (s) => s >= 200 && s < 300,
});

// Helper simple : path relatif (ex: "/geojson/_ping")
export async function getJSON<T>(path: string): Promise<T> {
  const { data } = await api.get<T>(path);
  return data;
}

/* ================================
   2) TYPES PARTAGÉS FRONT <-> API
   ================================ */

export interface Station {
  id: string;
  name: string;
  region: string;
  river?: string | null;
  coords: { lat: number; lon: number };
}

export interface Barrage {
  id: number;
  nom_barrage: string;
  nom_oued: string | null;
  statut: string | null;
  type_barrage: string | null;
  hauteur: number | null;
  apports_hm: number | null;
  mise_en_se: string | null;
  coord_x: number;
  coord_y: number;
}

export interface Alert {
  id: string;
  type: string;
  station: string;
  date: string;
  message: string;
}

export interface TimeseriesApiResponse {
  dates: string[];
  discharge_m3s: number[];
  temperature_c: number[];
  precipitation_mm?: number[];
  nitrates_mgL: number[];
  phosphore_mgL: number[];
}

// --- DTO renvoyés par le backend (formes "brutes") ---
interface StationDto {
  id: string | number;
  name: string;
  river?: string | null;
  lat: number;
  lon: number;
}

interface BarrageDto {
  id: string | number;
  nom_barrage: string;
  nom_oued?: string | null;
  statut?: string | null;
  type_barrage?: string | null;
  hauteur?: number | null;
  apports_hm?: number | null;
  mise_en_se?: string | null;
  coord_x: number | string;
  coord_y: number | string;
}

interface AlertDto {
  id: string | number;
  station_id: string | number;
  date: string;
  type: string;
  message: string;
}

// Option pour measurements
export interface MeasurementPoint {
  date: string;
  debit_m3s?: number | null;
  no3_mgl?: number | null;
  p_mgl?: number | null;
  temp_c?: number | null;
}

/* ================================
   3) ADAPTATEURS DTO -> UI
   ================================ */

function normalizeStation(s: StationDto): Station {
  return {
    id: String(s.id),
    name: s.name,
    region: "",
    river: s.river ?? null,
    coords: { lat: Number(s.lat), lon: Number(s.lon) },
  };
}

function normalizeBarrage(b: BarrageDto): Barrage {
  return {
    id: Number(b.id),
    nom_barrage: b.nom_barrage,
    nom_oued: b.nom_oued ?? null,
    statut: b.statut ?? null,
    type_barrage: b.type_barrage ?? null,
    hauteur: b.hauteur ? Number(b.hauteur) : null,
    apports_hm: b.apports_hm ? Number(b.apports_hm) : null,
    mise_en_se: b.mise_en_se ?? null,
    coord_x: Number(b.coord_x),
    coord_y: Number(b.coord_y),
  };
}

function normalizeAlert(a: AlertDto): Alert {
  return {
    id: String(a.id),
    type: a.type,
    station: String(a.station_id),
    date: a.date,
    message: a.message,
  };
}

/* ================================
   4) ENDPOINTS TYPÉS (standard)
   ================================ */

export async function getStations(): Promise<Station[]> {
  const data = await getJSON<StationDto[]>("/stations");
  return Array.isArray(data) ? data.map(normalizeStation) : [];
}

export async function getBarrages(): Promise<Barrage[]> {
  const data = await getJSON<BarrageDto[]>("/barrages");
  return Array.isArray(data) ? data.map(normalizeBarrage) : [];
}

export async function getAlerts(): Promise<Alert[]> {
  const data = await getJSON<AlertDto[]>("/alerts");
  return Array.isArray(data) ? data.map(normalizeAlert) : [];
}

export async function getTimeseries(
  stationId: string | number,
  p?: { from?: string; to?: string }
): Promise<MeasurementPoint[]> {
  const { data } = await api.get<MeasurementPoint[]>(
    `/stations/${encodeURIComponent(String(stationId))}/measurements`,
    { params: { from: p?.from, to: p?.to } }
  );
  return data ?? [];
}

/* ================================
   5) GEOJSON
   ================================ */

export async function getSousBassinsGeoJSON(): Promise<FeatureCollection> {
  return await getJSON<FeatureCollection>("/geojson/sous_bassin");
}

export async function getGeoJSON(
  layerKey: string,
  params?: Record<string, string | number | boolean>
): Promise<FeatureCollection<Geometry, GeoJsonProperties>> {
  const { data } = await api.get<
    FeatureCollection<Geometry, GeoJsonProperties>
  >(`/geojson/${encodeURIComponent(layerKey)}`, { params });
  return data;
}

/* ================================
   6) AUTHENTIFICATION
   ================================ */

export async function postLoginForm(
  username: string,
  password: string
): Promise<{ access_token: string; token_type: string }> {
  const form = new URLSearchParams({ username, password });
  const { data } = await api.post<{ access_token: string; token_type: string }>(
    "/auth/login",
    form,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return data;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export async function postRegister(
  payload: RegisterPayload
): Promise<{ id: string; email: string }> {
  const { data } = await api.post<{ id: string; email: string }>(
    "/auth/register",
    payload
  );
  return data;
}

/* ================================
   7) RAW DATA (données brutes)
   ================================ */

// 🔹 1. Liste des tables disponibles
export async function listRawTables(): Promise<{ schema: string; table: string }[]> {
  const data = await getJSON<{ schema: string; table: string }[]>("/raw/tables");
  return Array.isArray(data) ? data : [];
}

// 🔹 2. Lecture du contenu d’une table
export async function getRawData(
  schema: string,
  table: string,
  limit: number = 500
): Promise<Record<string, unknown>[]> {
  const data = await getJSON<Record<string, unknown>[]>(
    `/raw/data/${encodeURIComponent(schema)}/${encodeURIComponent(table)}?limit=${limit}`
  );
  return Array.isArray(data) ? data : [];
}

// 🔹 3. Génération des liens d’export
export function getRawExportUrl(
  schema: string,
  table: string,
  fmt: "csv" | "xlsx" = "csv"
): string {
  return `${BASE_URL}/raw/export/${encodeURIComponent(schema)}/${encodeURIComponent(
    table
  )}?fmt=${fmt}`;
}












/* ================================
   8) LISTES / NOMENCLATURES
   ================================ */

export type NameItem = { id: string; label: string };

export async function getNames(path: string): Promise<NameItem[]> {
  const { data } = await api.get<NameItem[]>(path);
  return Array.isArray(data) ? data : [];
}

// === Lists for filters ===
export const fetchBarragesNames = () => getNames("/names/barrages");
export const fetchStationsNames = () => getNames("/names/stations");
export const fetchSousBassinNames = () => getNames("/names/sous-bassins");

export const fetchAdminNames = {
  regions: () => getNames("/names/regions"),
  provinces: () => getNames("/names/provinces"),
  cercles: () => getNames("/names/cercles"),
  communes: () => getNames("/names/communes"),
  villes: () => getNames("/names/villes"),
  douars: () => getNames("/names/douars"),
};

// --- Ajout CRUD dynamique --- //

export async function updateRawRow(
  schema: string,
  table: string,
  id: string | number,
  data: Record<string, unknown>
) {
  const { data: res } = await api.put(`/raw/${schema}/${table}/${id}`, data);
  return res;
}

export async function deleteRawRow(
  schema: string,
  table: string,
  id: string | number
) {
  const { data: res } = await api.delete(`/raw/${schema}/${table}/${id}`);
  return res;
}


// --- Création dynamique d'une ligne ---
export async function createRawRow(
  schema: string,
  table: string,
  data: Record<string, unknown>
) {
  const { data: res } = await api.post(`/raw/${schema}/${table}`, data);
  
  return res;
}
export async function getSWATResults(
  type: "subbasins" | "reaches",
  scenarioId: number,
  param: string
) {
  const { data } = await api.get(`/swat/${type}`, {
    params: { scenario_id: scenarioId, param },
  });
  return data;
}


// ==============================
// 🌊 SWAT API
// ==============================

// Liste des scénarios
export async function listSWATScenarios() {
  const { data } = await api.get("/swat/scenarios");
  return data; // [{id, name, ...}]
}

// Résultats agrégés par sous-bassin pour une variable (carte)
export async function getSWATSubbasinResults(
  scenarioId: number,
  variable: string
) {
  const { data } = await api.get("/swat/subbasins", {
    params: { scenario_id: scenarioId, param: variable },
  });
  // attendu: [{ subbasin: number, value: number }]
  return data;
}

// Série temporelle d’un sous-bassin (graph)
export async function getSWATSubbasinTimeseries(
  subbasinId: number,
  scenarioId: number
) {
  const { data } = await api.get(`/swat/subbasins/${subbasinId}`, {
    params: { scenario_id: scenarioId },
  });
  // attendu: [{ date: "YYYY-MM-DD", precip, surq, gw_q, wyld, sedp, orgn, solp }]
  return data;
}

// ==============================
// 🔬 SWAT Analysis API
// ==============================
export async function compareSWATvsObserved(reachId: number, scenarioId: number) {
  const { data } = await api.get("/swat/analysis/compare", {
    params: { reach_id: reachId, scenario_id: scenarioId },
  });
  return data;
}
