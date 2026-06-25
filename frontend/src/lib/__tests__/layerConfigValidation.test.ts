import { describe, expect, it } from "vitest";

import { validateLayerConfigDraft } from "@/lib/layerConfigValidation";

describe("layerConfigValidation", () => {
  it("rejects invalid hex color", () => {
    const errors = validateLayerConfigDraft({
      geometry_type: "point",
      style_config: {
        type: "simple",
        point: {
          color: "blue",
          radius: 6,
          opacity: 0.8,
          strokeColor: "#ffffff",
          strokeWidth: 1,
        },
      },
      popup_fields: [],
    });

    expect(errors).toContain("Couleur point invalide");
  });

  it("rejects duplicate popup order", () => {
    const errors = validateLayerConfigDraft({
      geometry_type: "point",
      style_config: {
        type: "simple",
        point: {
          color: "#3498db",
          radius: 6,
          opacity: 0.8,
          strokeColor: "#ffffff",
          strokeWidth: 1,
        },
      },
      popup_fields: [
        { name: "nom_station", alias: "Station", order: 1, visible: true, format: null },
        { name: "value", alias: "Valeur", order: 1, visible: true, format: "number" },
      ],
    });

    expect(errors).toContain("Ordre popup duplique");
  });
});
