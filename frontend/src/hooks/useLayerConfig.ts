import { useCallback, useEffect, useState } from "react";

import { layerConfigApi } from "@/services/layerConfigApi";
import type { LayerConfig, LayerConfigUpdate } from "@/types/layerConfig";

export function useLayerConfig(layerName: string | null) {
  const [config, setConfig] = useState<LayerConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = useCallback(async () => {
    if (!layerName) {
      setConfig(null);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await layerConfigApi.get(layerName);
      setConfig(data);
      return data;
    } catch (err: any) {
      const detail = err?.response?.data?.detail || err?.message || "Erreur de chargement";
      setError(String(detail));
      setConfig(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [layerName]);

  useEffect(() => {
    void loadConfig();
  }, [loadConfig]);

  const updateConfig = useCallback(
    async (updates: LayerConfigUpdate) => {
      if (!layerName) {
        throw new Error("layerName is required");
      }
      const updated = await layerConfigApi.update(layerName, updates);
      setConfig(updated);
      return updated;
    },
    [layerName]
  );

  return { config, loading, error, updateConfig, reload: loadConfig };
}
