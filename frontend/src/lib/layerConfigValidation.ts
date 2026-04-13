import type { LayerConfigCreate, PopupField, StyleConfig } from "@/types/layerConfig";

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

function hasDuplicateOrders(fields: PopupField[]): boolean {
  const orders = fields.map((f) => f.order);
  return new Set(orders).size !== orders.length;
}

function validateStyle(style: StyleConfig, geometryType: LayerConfigCreate["geometry_type"]): string[] {
  const errors: string[] = [];

  if (geometryType === "point" && style.point && !HEX_COLOR.test(style.point.color)) {
    errors.push("Couleur point invalide");
  }
  if (geometryType === "line" && style.line && !HEX_COLOR.test(style.line.color)) {
    errors.push("Couleur ligne invalide");
  }
  if (geometryType === "polygon" && style.polygon) {
    if (!HEX_COLOR.test(style.polygon.fillColor)) errors.push("Couleur remplissage invalide");
    if (!HEX_COLOR.test(style.polygon.strokeColor)) errors.push("Couleur contour invalide");
  }

  return errors;
}

export function validateLayerConfigDraft(payload: {
  geometry_type: LayerConfigCreate["geometry_type"];
  style_config: StyleConfig;
  popup_fields: PopupField[];
}): string[] {
  const errors: string[] = [];

  errors.push(...validateStyle(payload.style_config, payload.geometry_type));

  if (hasDuplicateOrders(payload.popup_fields)) {
    errors.push("Ordre popup duplique");
  }

  return errors;
}
