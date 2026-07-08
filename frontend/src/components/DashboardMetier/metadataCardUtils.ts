import type {
  MapBusinessEntityProperties,
  MapClassificationResult,
  MapLatestValue,
} from "@/api/mapBusiness";

const STATUS_TONES: Record<string, string> = {
  ACTIF: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SANS_MESURE_RECENTE: "bg-amber-50 text-amber-700 border-amber-200",
  A_VALIDER: "bg-slate-100 text-slate-700 border-slate-200",
};

const STATUS_LABELS: Record<string, string> = {
  ACTIF: "Actif",
  SANS_MESURE_RECENTE: "Sans mesure récente",
  A_VALIDER: "À valider",
};

export function toneForStatus(status: string | null | undefined): string {
  return STATUS_TONES[status || ""] || "bg-slate-100 text-slate-700 border-slate-200";
}

export function labelForStatus(status: string | null | undefined): string {
  return STATUS_LABELS[status || ""] || status || "Non renseigné";
}

export function renderLocation(properties: MapBusinessEntityProperties): string {
  const locality = [properties.commune, properties.province].filter(Boolean).join(" - ");
  const coordinates =
    typeof properties.latitude === "number" && typeof properties.longitude === "number"
      ? `${properties.latitude.toFixed(5)}, ${properties.longitude.toFixed(5)}`
      : null;
  return [locality, coordinates].filter(Boolean).join(" | ") || "Coordonnées indisponibles";
}

export function renderShortLocation(properties: MapBusinessEntityProperties): string {
  return [properties.commune, properties.province].filter(Boolean).join(" - ") || "Localisation non renseignée";
}

export function formatDate(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-MA", { year: "numeric", month: "short", day: "numeric" });
}

export function formatNumber(value: number | null | undefined, digits = 2): string | null {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  return value.toLocaleString("fr-MA", { minimumFractionDigits: 0, maximumFractionDigits: digits });
}

export function ageInDays(value: string | Date | null | undefined): number | null {
  if (!value) return null;
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return null;
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function freshnessLabel(dateString: string | Date | null | undefined): string {
  const age = ageInDays(dateString);
  if (age === null) return "Aucune mesure";
  if (age === 0) return "Aujourd'hui";
  if (age === 1) return "Il y a 1 jour";
  if (age < 30) return `Il y a ${age} jours`;
  if (age < 90) return `Il y a ${Math.floor(age / 30)} mois`;
  return `Il y a ${age} jours`;
}

export function freshnessTone(dateString: string | Date | null | undefined): "ok" | "warning" | "critical" {
  const age = ageInDays(dateString);
  if (age === null) return "critical";
  if (age > 90) return "critical";
  if (age > 30) return "warning";
  return "ok";
}

export function renderClassificationBadge(classification: MapClassificationResult | null | undefined): {
  label: string;
  color: string;
} {
  if (!classification?.class_code) {
    return { label: "Non classifiable", color: "#64748b" };
  }
  return {
    label: classification.class_label || classification.class_code,
    color: classification.color || "#64748b",
  };
}

export function getEntityTypeLabel(properties: Partial<MapBusinessEntityProperties>): string {
  return (
    properties.entity_kind ||
    properties.display_label ||
    (typeof properties.entity_type === "string" ? properties.entity_type : null) ||
    properties.support_type ||
    properties.support ||
    "Entité"
  );
}

export function getEntityCode(properties: MapBusinessEntityProperties): string | null {
  if (properties.station_code) return String(properties.station_code);
  if (properties.code_station) return String(properties.code_station);
  if (properties.barrage_id) return String(properties.barrage_id);
  return null;
}

export function getPeriodLabel(properties: MapBusinessEntityProperties): string | null {
  const min = formatDate(properties.date_min);
  const max = formatDate(properties.date_max);
  if (!min && !max) return null;
  return `${min || "n/a"} → ${max || "n/a"}`;
}

export function findLatestValue(
  values: MapLatestValue[],
  parameterCode: string
): MapLatestValue | undefined {
  return values.find((v) => v.parameter_code?.toUpperCase() === parameterCode.toUpperCase());
}

export function formatLatestValue(value: MapLatestValue | undefined): string {
  if (!value) return "—";
  const measured = value.value_numeric ?? value.value_text;
  if (measured === null || measured === undefined) return "—";
  const formatted = typeof measured === "number" ? formatNumber(measured) : String(measured);
  return `${formatted}${value.unit ? ` ${value.unit}` : ""}`;
}

export function formatMeasureCount(count: number | null | undefined): string {
  const n = count ?? 0;
  return `${n.toLocaleString("fr-MA")} mesure${n > 1 ? "s" : ""}`;
}

export function formatParameterCount(count: number | null | undefined): string {
  const n = count ?? 0;
  return `${n} paramètre${n > 1 ? "s" : ""}`;
}
