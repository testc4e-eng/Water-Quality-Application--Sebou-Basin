// frontend/src/services/ingestionService.ts
import { api } from "@/api/client";

export interface IngestedScenario {
  id: number;
  name: string;
  description: string;
}

export interface IngestionScenariosResponse {
  swat: IngestedScenario[];
  wasp: IngestedScenario[];
}

export interface Anomaly {
  subbasin?: number;
  segment_id?: number;
  date: string;
  variable?: string;
  value: number;
  orgn?: number;
  solp?: number;
}

export interface AnomaliesResponse {
  scenario_id: number;
  model: string;
  anomalies_count: number;
  alerts: Anomaly[];
}

export const getScenarios = async (): Promise<IngestionScenariosResponse> => {
  const { data } = await api.get("/ingestion/scenarios");
  return data;
};

export const getAnomalies = async (
  scenarioId: number,
  model: "swat" | "wasp"
): Promise<AnomaliesResponse> => {
  const { data } = await api.get(`/ingestion/validation/anomalies?scenario_id=${scenarioId}&model=${model}`);
  return data;
};

export const uploadFiles = async (files: File[]): Promise<any> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const { data } = await api.post("/ingestion/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};
