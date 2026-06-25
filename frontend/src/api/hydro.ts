// // frontend/src/api/hydro.ts
// // ================= MOCK HYDRO API =================
// // Aucune connexion backend / BD

// function delay(ms = 300) {
//   return new Promise((r) => setTimeout(r, ms));
// }

// /* =====================================================
//    STATIONS
// ===================================================== */
// export const fetchHydroStations = async () => {
//   await delay();
//   return [
//     {
//       station_id: 1,
//       station_code: "MY01",
//       station_name: "Moulay Youssef",
//     },
//     {
//       station_id: 2,
//       station_code: "SB02",
//       station_name: "Sebou Amont",
//     },
//   ];
// };

// /* =====================================================
//    STATS (scénarios / séries)
// ===================================================== */
// export const fetchHydroStats = async (station_id: number) => {
//   await delay();

//   return [
//     {
//       station_id,
//       ts_id: 201,
//       source_type: "observed",
//       scenario_name: "Observations",
//       time_step: "daily",
//       dt_min: "2000-01-01",
//       dt_max: "2000-01-31",
//     },
//     {
//       station_id,
//       ts_id: 202,
//       source_type: "simulated",
//       scenario_name: "Simulation SWAT",
//       time_step: "monthly",
//       dt_min: "2000-01-01",
//       dt_max: "2000-12-31",
//     },
//   ];
// };

// /* =====================================================
//    TIME SERIES (débit)
// ===================================================== */
// export const fetchHydroTimeseries = async (p: {
//   ts_id: number;
//   aggregation: string;
//   date_start: string;
//   date_end: string;
// }) => {
//   await delay();

//   const base =
//     p.aggregation === "daily"
//       ? 20
//       : p.aggregation === "monthly"
//       ? 50
//       : 100;

//   const count =
//     p.aggregation === "daily"
//       ? 30
//       : p.aggregation === "monthly"
//       ? 12
//       : 10;

//   return Array.from({ length: count }).map((_, i) => ({
//     datetime:
//       p.aggregation === "daily"
//         ? `2000-01-${String(i + 1).padStart(2, "0")}`
//         : `2000-${String(i + 1).padStart(2, "0")}-01`,
//     value: Number(
//       (base + Math.random() * base).toFixed(3)
//     ),
//   }));
// };

// /* =====================================================
//    KPIs
// ===================================================== */
// export const fetchHydroKPIs = async (p: {
//   ts_id: number;
//   aggregation: string;
//   date_start: string;
//   date_end: string;
// }) => {
//   await delay();

//   return {
//     min: 5.123,
//     max: 180.456,
//     mean: 62.789,
//   };
// };
import { api } from "@/api/client";

export type HydroIdentifier = string | number;

/* =====================================================
   STATIONS
===================================================== */
export const fetchHydroStations = async () => {
  const { data } = await api.get("/hydro/stations");
  return data ?? [];
};

export const fetchPointWaterOptions = async () => {
  const { data } = await api.get("/hydro/points-eau");
  return data ?? [];
};

export const fetchPointWaterDetails = async (point_id: string) => {
  const { data } = await api.get("/hydro/points-eau/details", { params: { point_id } });
  return data ?? [];
};

/* =====================================================
   STATS
===================================================== */
export const fetchHydroStats = async (station_id: HydroIdentifier) => {
  const { data } = await api.get("/hydro/stats", { params: { station_id } });
  return data ?? [];
};

/* =====================================================
   TIME SERIES
===================================================== */
export const fetchHydroTimeseries = async (p: {
  ts_id: HydroIdentifier;
  aggregation: string;
  date_start: string;
  date_end: string;
}) => {
  const { data } = await api.get("/hydro/timeseries", {
    params: {
      ts_id: String(p.ts_id),
      aggregation: p.aggregation,
      date_start: p.date_start,
      date_end: p.date_end,
    },
  });
  return data ?? [];
};

export const fetchBarrageQualityParameters = async (barrageId: number) => {
  const { data } = await api.get(`/barrages/${barrageId}/quality-parameters`);
  return data ?? [];
};

export const fetchBarrageQualitySeries = async (p: {
  barrage_id: number;
  aggregation: string;
  date_start: string;
  date_end: string;
  parameter: string;
  parameter_secondary?: string;
}) => {
  const { data } = await api.get(`/barrages/${p.barrage_id}/quality-series`, {
    params: {
      aggregation: p.aggregation,
      date_start: p.date_start,
      date_end: p.date_end,
      parameter: p.parameter,
      parameter_secondary: p.parameter_secondary || undefined,
    },
  });
  return data ?? [];
};

/* =====================================================
   KPIS
===================================================== */
export const fetchHydroKPIs = async (p: {
  ts_id: HydroIdentifier;
  aggregation: string;
  date_start: string;
  date_end: string;
}) => {
  const { data } = await api.get("/hydro/kpis", {
    params: {
      ts_id: String(p.ts_id),
      aggregation: p.aggregation,
      date_start: p.date_start,
      date_end: p.date_end,
    },
  });
  return data ?? null;
};
