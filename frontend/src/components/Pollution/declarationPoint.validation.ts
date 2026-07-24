import type { DeclarationPoint } from "./declarationPoint.types";

export interface DeclarationPointValidationResult {
  point: DeclarationPoint | null;
  errors: {
    longitude?: string;
    latitude?: string;
  };
}

export const DECLARATION_POINT_MESSAGES = {
  longitudeRequired: "La longitude doit etre renseignee.",
  latitudeRequired: "La latitude doit etre renseignee.",
  longitudeRange: "La longitude doit etre comprise entre -180 et 180.",
  latitudeRange: "La latitude doit etre comprise entre -90 et 90.",
} as const;

export function validateDeclarationPointCoordinates(
  longitudeValue: string,
  latitudeValue: string,
  source: DeclarationPoint["source"] = "manual"
): DeclarationPointValidationResult {
  const errors: DeclarationPointValidationResult["errors"] = {};
  const longitude = Number(longitudeValue);
  const latitude = Number(latitudeValue);

  if (longitudeValue.trim() === "" || Number.isNaN(longitude)) {
    errors.longitude = DECLARATION_POINT_MESSAGES.longitudeRequired;
  } else if (longitude < -180 || longitude > 180) {
    errors.longitude = DECLARATION_POINT_MESSAGES.longitudeRange;
  }

  if (latitudeValue.trim() === "" || Number.isNaN(latitude)) {
    errors.latitude = DECLARATION_POINT_MESSAGES.latitudeRequired;
  } else if (latitude < -90 || latitude > 90) {
    errors.latitude = DECLARATION_POINT_MESSAGES.latitudeRange;
  }

  if (errors.longitude || errors.latitude) {
    return { point: null, errors };
  }

  return {
    point: {
      longitude,
      latitude,
      source,
    },
    errors,
  };
}
