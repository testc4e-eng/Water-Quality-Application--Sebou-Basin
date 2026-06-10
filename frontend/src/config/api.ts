const DEFAULT_API_BASE_URL = "http://127.0.0.1:8010/api/v1";

function normalizeApiBaseUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

export const API_BASE_URL =
  normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL);

export const API_BASE_URL_SOURCE_OF_TRUTH = "VITE_API_BASE_URL";
