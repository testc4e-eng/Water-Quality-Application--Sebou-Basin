import type { Map as MapLibreMap } from "maplibre-gl";

import type { LayerConfig, PopupConfig } from "@/types/layerConfig";

function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatValue(value: unknown, format: "date" | "number" | null, options?: Record<string, unknown> | null): string {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (format === "number") {
    const decimals = Number(options?.decimals ?? 2);
    const unit = String(options?.unit ?? "").trim();
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return `${parsed.toFixed(decimals)} ${unit}`.trim();
    }
  }

  if (format === "date") {
    const date = new Date(String(value));
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("fr-FR");
    }
  }

  return String(value);
}

export function applyLayerStyle(map: MapLibreMap, layerId: string, config: LayerConfig): void {
  if (!map.getLayer(layerId)) return;

  const geometryType = config.geometry_type;
  const styleByType = {
    point: config.style_config.point,
    line: config.style_config.line,
    polygon: config.style_config.polygon,
  };
  const style = styleByType[geometryType];
  if (!style) return;

  if (geometryType === "point") {
    map.setPaintProperty(layerId, "circle-color", style.color);
    map.setPaintProperty(layerId, "circle-radius", style.radius);
    map.setPaintProperty(layerId, "circle-opacity", style.opacity);
    map.setPaintProperty(layerId, "circle-stroke-color", style.strokeColor);
    map.setPaintProperty(layerId, "circle-stroke-width", style.strokeWidth);
    return;
  }

  if (geometryType === "line") {
    map.setPaintProperty(layerId, "line-color", style.color);
    map.setPaintProperty(layerId, "line-width", style.width);
    map.setPaintProperty(layerId, "line-opacity", style.opacity);
    return;
  }

  map.setPaintProperty(layerId, "fill-color", style.fillColor);
  map.setPaintProperty(layerId, "fill-opacity", style.fillOpacity);
  map.setPaintProperty(layerId, "fill-outline-color", style.strokeColor);
}

export function generatePopupHTML(properties: Record<string, unknown>, popupConfig: PopupConfig): string {
  const fields = (popupConfig.fields || [])
    .filter((field) => field.visible)
    .sort((a, b) => a.order - b.order);

  const rows = fields
    .map((field) => {
      const raw = properties[field.name];
      const value = formatValue(raw, field.format, field.formatOptions || null);
      return `
        <div class="popup-row">
          <span class="popup-label">${escapeHtml(field.alias)}:</span>
          <span class="popup-value">${escapeHtml(value)}</span>
        </div>
      `;
    })
    .join("");

  return `<div class="popup-content">${rows}</div>`;
}
