// frontend/src/api/quality.ts
// ============================================================
// Toutes les fonctions pointent sur l'API backend réelle.
// Plus aucun mock ni données générées côté client.
// ============================================================
import { api } from "@/api/client";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

export type PollutionInventoryRow = {
  source: string;
  sourceType: string;
  parameter: string;
  sourceName: string;
  location: string;
  period: string;
  measuredValue: number;
  unit: string;
};

export type QualityStation = {
  station_id: string;
  station_name: string;
  dt_min: string | null;
  dt_max: string | null;
  n_mesures: number;
};

export type QualityParameter = {
  parameter: string;
  n_mesures: number;
};

export type QualityMeasureRow = {
  date: string;
  no3: number | null;
  ph: number | null;
  dbo5: number | null;
  dco: number | null;
  o2: number | null;
  mes: number | null;
};

export type QualityKPIs = {
  no3: number;
  ph: number;
  dbo5: number;
  dco: number;
  o2: number;
};

/* ─────────────────────────────────────────────
   INVENTAIRE POLLUTION (Points d'eau / STEP / STM)
   → GET /quality/inventory/rows
───────────────────────────────────────────── */
export const fetchPollutionInventoryRows = async (): Promise<PollutionInventoryRow[]> => {
  const { data } = await api.get<PollutionInventoryRow[]>("/quality/inventory/rows");
  return Array.isArray(data) ? data : [];
};

/* ─────────────────────────────────────────────
   STATIONS QUALITÉ RIVIÈRES
   → GET /quality/stations
───────────────────────────────────────────── */
export const fetchQualityStations = async (): Promise<QualityStation[]> => {
  const { data } = await api.get<QualityStation[]>("/quality/stations");
  return Array.isArray(data) ? data : [];
};

/* ─────────────────────────────────────────────
   PARAMÈTRES DISPONIBLES (optionnellement par station)
   → GET /quality/parameters?station_id=...
───────────────────────────────────────────── */
export const fetchQualityParameters = async (
  station_id?: string
): Promise<QualityParameter[]> => {
  const { data } = await api.get<QualityParameter[]>("/quality/parameters", {
    params: station_id ? { station_id } : undefined,
  });
  return Array.isArray(data) ? data : [];
};

/* ─────────────────────────────────────────────
   SÉRIE TEMPORELLE QUALITÉ
   → GET /quality/timeseries?station_id=&date_start=&date_end=
───────────────────────────────────────────── */
export const fetchQualityTimeseries = async (params: {
  station_id: string;
  date_start?: string;
  date_end?: string;
}): Promise<QualityMeasureRow[]> => {
  const { data } = await api.get<QualityMeasureRow[]>("/quality/timeseries", {
    params: {
      station_id: params.station_id,
      date_start: params.date_start ?? undefined,
      date_end: params.date_end ?? undefined,
    },
  });
  return Array.isArray(data) ? data : [];
};

/* ─────────────────────────────────────────────
   KPIs calculés côté client depuis la série temporelle
───────────────────────────────────────────── */
export const fetchQualityKPIs = async (params: {
  station_id: string;
  date_start?: string;
  date_end?: string;
}): Promise<QualityKPIs> => {
  const rows = await fetchQualityTimeseries(params);

  const mean = (key: keyof QualityMeasureRow) => {
    const values = rows
      .map((r) => r[key])
      .filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
    if (!values.length) return 0;
    return values.reduce((s, v) => s + v, 0) / values.length;
  };

  return {
    no3: mean("no3"),
    ph: mean("ph"),
    dbo5: mean("dbo5"),
    dco: mean("dco"),
    o2: mean("o2"),
  };
};

/* ─────────────────────────────────────────────
   COMPAT — anciennes signatures utilisées dans d'autres composants
   (redirigent vers les nouvelles fonctions)
───────────────────────────────────────────── */
export const fetchQualityTable = fetchQualityTimeseries;
export const fetchQualityChart = fetchQualityTimeseries;
