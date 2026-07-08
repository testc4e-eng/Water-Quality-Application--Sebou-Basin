import { Waves, Thermometer } from "lucide-react";

import { parseLatestValues, type MapBusinessEntityProperties, type MapLatestValue } from "@/api/mapBusiness";

import { findLatestValue, formatDate, formatLatestValue, renderClassificationBadge } from "../metadataCardUtils";

function KpiItem({
  icon: Icon,
  label,
  value,
  colorClass,
  compact,
}: {
  icon: React.ElementType;
  label: string;
  value?: MapLatestValue;
  colorClass: string;
  compact?: boolean;
}) {
  const badge = renderClassificationBadge(value?.classification);
  return (
    <div
      className={`flex items-center justify-between rounded border border-slate-100 bg-white px-2 text-xs ${compact ? "py-1" : "py-1.5"}`}
    >
      <div className="flex items-center gap-1.5">
        <Icon className={`h-3.5 w-3.5 ${colorClass}`} />
        <span className="font-medium text-slate-700">{label}</span>
        {value?.sample_date && !compact && (
          <span className="text-[10px] text-slate-400">{formatDate(value.sample_date)}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-900">{formatLatestValue(value)}</span>
        {value?.classification && (
          <span
            className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white"
            style={{ backgroundColor: badge.color }}
          >
            {badge.label}
          </span>
        )}
      </div>
    </div>
  );
}

export function StationHydroTemplate({
  properties,
  compact,
}: {
  properties: MapBusinessEntityProperties;
  compact?: boolean;
}) {
  const values = parseLatestValues(properties.latest_values);
  const flow = findLatestValue(values, "DEBIT") || findLatestValue(values, "Q") || values[0];
  const temperature = findLatestValue(values, "TEMPERATURE_AIR") || findLatestValue(values, "T_AIR");

  if (values.length === 0) {
    return <div className="text-xs text-slate-500">Aucune donnée hydrométrique récente.</div>;
  }

  return (
    <div className="space-y-1.5">
      <KpiItem icon={Waves} label="Débit" value={flow} colorClass="text-blue-600" compact={compact} />
      {!compact && temperature && (
        <KpiItem icon={Thermometer} label="Température air" value={temperature} colorClass="text-orange-500" />
      )}
    </div>
  );
}
