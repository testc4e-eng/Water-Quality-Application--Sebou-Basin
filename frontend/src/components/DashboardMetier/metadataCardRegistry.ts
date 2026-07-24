import type { MapBusinessEntityProperties } from "@/api/mapBusiness";

import { BarrageTemplate } from "./templates/BarrageTemplate";
import { GenericTemplate } from "./templates/GenericTemplate";
import { PollutionTemplate } from "./templates/PollutionTemplate";
import { StationHydroTemplate } from "./templates/StationHydroTemplate";
import { StationPluvioTemplate } from "./templates/StationPluvioTemplate";
import { StationQualiteTemplate } from "./templates/StationQualiteTemplate";

export type MetadataTemplateComponent = React.FC<{
  properties: MapBusinessEntityProperties;
  compact?: boolean;
}>;

export function selectTemplate(properties: MapBusinessEntityProperties | null): MetadataTemplateComponent {
  if (!properties) return GenericTemplate;

  const entityType = properties.entity_type;
  const supportType = properties.support_type;
  const support = properties.support;

  if (entityType === "station_qualite" || support === "stations_qualite") {
    return StationQualiteTemplate;
  }

  if (entityType === "station_hydro" || supportType === "hydro") {
    return StationHydroTemplate;
  }

  if (entityType === "station_pluvio" || entityType === "station_meteo" || supportType === "pluvio" || supportType === "station_meteo") {
    return StationPluvioTemplate;
  }

  if (
    entityType === "barrage" ||
    supportType === "barrage" ||
    support === "barrages"
  ) {
    return BarrageTemplate;
  }

  if (
    entityType?.includes("pollution") ||
    entityType === "rejet_industriel" ||
    entityType === "rejet_domestique" ||
    support === "idp_pollution" ||
    supportType === "point_mesures" ||
    supportType === "point_prelevement"
  ) {
    return PollutionTemplate;
  }

  return GenericTemplate;
}
