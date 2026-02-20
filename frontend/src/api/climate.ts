// // frontend/src/api/climate.ts
// // ⚠️ MODE MOCK – AUCUNE CONNEXION BD

// function delay(ms = 300) {
//   return new Promise((r) => setTimeout(r, ms));
// }

// /* =====================================================
//    MOCK STATIONS
// ===================================================== */
// export const listClimateStations = async () => {
//   await delay();
//   return [
//     { station_id: 1, station_code: "MY01", station_name: "Moulay Youssef" },
//     { station_id: 2, station_code: "SB02", station_name: "Sebou Amont" },
//   ];
// };

// /* =====================================================
//    MOCK STATION STATS
// ===================================================== */
// export const getClimateStationStats = async (stationId: number) => {
//   await delay();
//   return [
//     {
//       station_id: stationId,
//       source_type: "observed",
//       scenario_code: "OBS",
//       scenario_name: "scénario observed",
//       run_id: 1,
//       property_name: "temperature",
//       time_step: "Daily",
//       ts_id: 101,
//       date_start: "2000-01-01",
//       date_end: "2000-12-31",
//     },
//     {
//       station_id: stationId,
//       source_type: "observed",
//       scenario_code: "OBS",
//       scenario_name: "scénario observed",
//       run_id: 1,
//       property_name: "precipitation",
//       time_step: "Daily",
//       ts_id: 102,
//       date_start: "2000-01-01",
//       date_end: "2000-12-31",
//     },
//   ];
// };

// /* =====================================================
//    MOCK TIMESERIES
// ===================================================== */
// export const getClimateTimeseries = async (params: {
//   ts_id: number;
//   date_start?: string;
//   date_end?: string;
// }) => {
//   await delay();

//   const base =
//     params.ts_id === 101
//       ? 20 // température
//       : 5; // précipitation

//   return Array.from({ length: 30 }).map((_, i) => ({
//     datetime: `2000-01-${String(i + 1).padStart(2, "0")}`,
//     value: Number(
//       (base + Math.random() * (params.ts_id === 101 ? 10 : 20)).toFixed(2)
//     ),
//   }));
// };

// /* =====================================================
//    MOCK KPIs
// ===================================================== */
// export const getClimateKPIs = async (ts_id: number) => {
//   await delay();
//   return {
//     min: 12.3,
//     max: 35.7,
//     mean: 22.8,
//   };
// };



// frontend/src/api/climate.ts

const API_BASE = "http://localhost:8000/api/v1/climate";

/* =====================================================
   STATIONS
===================================================== */
export const listClimateStations = async () => {
  const res = await fetch(`${API_BASE}/stations`);
  if (!res.ok) throw new Error("Erreur stations");
  return res.json();
};

/* =====================================================
   STATION STATS
===================================================== */
export const getClimateStationStats = async (stationId: number) => {
  const res = await fetch(
    `${API_BASE}/station-stats?station_id=${stationId}`
  );
  if (!res.ok) throw new Error("Erreur station stats");
  return res.json();
};

/* =====================================================
   TIMESERIES
===================================================== */
export const getClimateTimeseries = async (params: {
  ts_id: number;
  time_step: string;
  date_start?: string;
  date_end?: string;
}) => {
  const query = new URLSearchParams({
    ts_id: String(params.ts_id),
    time_step: params.time_step,
  });

  if (params.date_start) query.append("date_start", params.date_start);
  if (params.date_end) query.append("date_end", params.date_end);

  const res = await fetch(`${API_BASE}/timeseries?${query}`);
  if (!res.ok) throw new Error("Erreur timeseries");
  return res.json();
};


/* =====================================================
   KPIs
===================================================== */
export const getClimateKPIs = async (ts_id: number) => {
  const res = await fetch(`${API_BASE}/kpis?ts_id=${ts_id}`);
  if (!res.ok) throw new Error("Erreur KPIs");
  return res.json();
};
