/* frontend/src/api/hydroqual.js */
import { api } from "./http";

export async function fetchStations() {
  const { data } = await api.get("/api/v1/stations");
  return data;
}
export async function fetchAlerts() {
  const { data } = await api.get("/api/v1/alerts");
  return data;
}
export async function fetchMeasurements(stationId, from, to) {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;
  const { data } = await api.get(`/api/v1/stations/${stationId}/measurements`, {
    params,
  });
  return data;
}
