import { describe, expect, it } from "vitest";

import {
  DECLARATION_POINT_MESSAGES,
  validateDeclarationPointCoordinates,
} from "./declarationPoint.validation";

describe("validateDeclarationPointCoordinates", () => {
  it("rejects empty coordinates", () => {
    const result = validateDeclarationPointCoordinates("", "");

    expect(result.point).toBeNull();
    expect(result.errors.longitude).toBe(DECLARATION_POINT_MESSAGES.longitudeRequired);
    expect(result.errors.latitude).toBe(DECLARATION_POINT_MESSAGES.latitudeRequired);
  });

  it("rejects an invalid longitude range", () => {
    const result = validateDeclarationPointCoordinates("181", "34.5");

    expect(result.point).toBeNull();
    expect(result.errors.longitude).toBe(DECLARATION_POINT_MESSAGES.longitudeRange);
  });

  it("rejects an invalid latitude range", () => {
    const result = validateDeclarationPointCoordinates("-6.3", "91");

    expect(result.point).toBeNull();
    expect(result.errors.latitude).toBe(DECLARATION_POINT_MESSAGES.latitudeRange);
  });

  it("returns a valid manual declaration point", () => {
    const result = validateDeclarationPointCoordinates("-4.908418523493339", "34.16528818110318", "manual");

    expect(result.errors).toEqual({});
    expect(result.point).toEqual({
      longitude: -4.908418523493339,
      latitude: 34.16528818110318,
      source: "manual",
    });
  });
});
