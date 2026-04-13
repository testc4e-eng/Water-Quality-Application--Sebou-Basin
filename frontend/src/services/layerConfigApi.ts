import { api } from "@/api/client";
import type { LayerConfig, LayerConfigCreate, LayerConfigUpdate } from "@/types/layerConfig";

export const layerConfigApi = {
  async list(activeOnly = true): Promise<LayerConfig[]> {
    const { data } = await api.get<LayerConfig[]>("/layers/configs", {
      params: { active_only: activeOnly },
    });
    return data ?? [];
  },

  async get(layerName: string): Promise<LayerConfig> {
    const { data } = await api.get<LayerConfig>(`/layers/configs/${encodeURIComponent(layerName)}`);
    return data;
  },

  async create(payload: LayerConfigCreate): Promise<LayerConfig> {
    const { data } = await api.post<LayerConfig>("/layers/configs", payload);
    return data;
  },

  async update(layerName: string, payload: LayerConfigUpdate): Promise<LayerConfig> {
    const { data } = await api.put<LayerConfig>(`/layers/configs/${encodeURIComponent(layerName)}`, payload);
    return data;
  },

  async remove(layerName: string): Promise<void> {
    await api.delete(`/layers/configs/${encodeURIComponent(layerName)}`);
  },
};
