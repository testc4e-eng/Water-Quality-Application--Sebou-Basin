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



const API = "http://localhost:8000/api/v1/hydro";

/* =====================================================
   STATIONS
===================================================== */
export const fetchHydroStations = async () => {
  const res = await fetch(`${API}/stations`);
  if (!res.ok) throw new Error("Erreur stations hydro");
  return res.json();
};

/* =====================================================
   STATS
===================================================== */
export const fetchHydroStats = async (station_id: number) => {
  const res = await fetch(`${API}/stats?station_id=${station_id}`);
  if (!res.ok) throw new Error("Erreur stats hydro");
  return res.json();
};

/* =====================================================
   TIME SERIES
===================================================== */
export const fetchHydroTimeseries = async (p: {
  ts_id: number;
  aggregation: string;
  date_start: string;
  date_end: string;
}) => {
  const params = new URLSearchParams({
    ts_id: String(p.ts_id),
    aggregation: p.aggregation,
    date_start: p.date_start,
    date_end: p.date_end,
  });

  const res = await fetch(`${API}/timeseries?${params.toString()}`);
  if (!res.ok) throw new Error("Erreur timeseries hydro");
  return res.json();
};

/* =====================================================
   KPIS
===================================================== */
export const fetchHydroKPIs = async (p: {
  ts_id: number;
  aggregation: string;
  date_start: string;
  date_end: string;
}) => {
  const params = new URLSearchParams({
    ts_id: String(p.ts_id),
    aggregation: p.aggregation,
    date_start: p.date_start,
    date_end: p.date_end,
  });

  const res = await fetch(`${API}/kpis?${params.toString()}`);
  if (!res.ok) throw new Error("Erreur kpis hydro");
  return res.json();
};
