// src/services/api.js
import { useEffect, useState } from "react";
import { api } from "@/api/client";

/** Petit utilitaire pour rendre les réponses backend plus robustes */
function mapStation(row) {
  // Les stations peuvent arriver avec différents formats : coords, lat/lon, PostGIS...
  let coords = null;
  if (row?.coords && typeof row.coords.lat === "number") {
    coords = row.coords;
  } else if (typeof row?.lat === "number" && typeof row?.lon === "number") {
    coords = { lat: row.lat, lon: row.lon };
  } else if (row?.location?.coordinates?.length === 2) {
    // GeoJSON/POSTGIS: [lon, lat]
    coords = { lon: row.location.coordinates[0], lat: row.location.coordinates[1] };
  }
  return {
    id: row.id,
    name: row.name,
    river: row.river,
    coords,
  };
}

export function useStations() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setIsLoading(true);
    api.get("/stations")
      .then((res) => {
        const rows = Array.isArray(res.data?.stations) ? res.data.stations
                     : Array.isArray(res.data)             ? res.data
                     : [];
        const mapped = rows.map(mapStation);
        if (alive) setData(mapped);
      })
      .catch((err) => alive && setError(err?.response?.data || err.message))
      .finally(() => alive && setIsLoading(false));
    return () => { alive = false; };
  }, []);

  return { data, isLoading, error };
}

export function useAlerts() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setIsLoading(true);
    api.get("/alerts")
      .then((res) => {
        const rows = Array.isArray(res.data?.alerts) ? res.data.alerts
                     : Array.isArray(res.data)          ? res.data
                     : [];
        if (alive) setData(rows);
      })
      .catch((err) => alive && setError(err?.response?.data || err.message))
      .finally(() => alive && setIsLoading(false));
    return () => { alive = false; };
  }, []);

  return { data, isLoading, error };
}

export function useTimeseries(stationId, { dateFrom, dateTo } = {}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!stationId) return;
    let alive = true;
    setIsLoading(true);

    const params = {};
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo)   params.dateTo   = dateTo;

    api
      .get("/timeseries", { params: { station_id: stationId, ...params } })
      .then((res) => alive && setData(res.data))
      .catch((err) => alive && setError(err?.response?.data || err.message))
      .finally(() => alive && setIsLoading(false));

    return () => { alive = false; };
  }, [stationId, dateFrom, dateTo]);

  return { data, isLoading, error };
}
