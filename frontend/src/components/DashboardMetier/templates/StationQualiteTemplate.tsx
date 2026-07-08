import { Droplets } from "lucide-react";

import { parseLatestValues, type MapBusinessEntityProperties, type MapLatestValue } from "@/api/mapBusiness";

import { findLatestValue, formatLatestValue, renderClassificationBadge } from "../metadataCardUtils";

const FULL_PARAMETERS = [
  { code: "DBO5", label: "DBO5" },
  { code: "DCO", label: "DCO" },
  { code: "NH4", label: "NH4" },
  { code: "NO3", label: "NO3" },
  { code: "NO3-", label: "NO3" },
  { code: "O2_DISS", label: "O2 dissous" },
  { code: "pH", label: "pH" },
  { code: "Cond", label: "Conductivité" },
];

const COMPACT_PARAMETERS = [
  { code: "pH", label: "pH" },
  { code: "DBO5", label: "DBO5" },
  { code: "O2_DISS", label: "O2" },
];

function KpiItem({ label, value, compact }: { label: string; value?: MapLatestValue; compact?: boolean }) {
  const badge = renderClassificationBadge(value?.classification);
  return (
    <div
      className={`flex items-center justify-between rounded border border-slate-100 bg-white px-2 text-xs ${compact ? "py-1" : "py-1.5"}`}
    >
      <div className="flex items-center gap-1.5">
        <Droplets className="h-3 w-3 text-blue-500" />
        <span className="font-medium text-slate-700">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-900">{formatLatestValue(value)}</span>
        {value && (
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

export function StationQualiteTemplate({
  properties,
  compact,
}: {
  properties: MapBusinessEntityProperties;
  compact?: boolean;
}) {
  const values = parseLatestValues(properties.latest_values);
  const parameters = compact ? COMPACT_PARAMETERS : FULL_PARAMETERS;

  if (values.length === 0) {
    return <div className="text-xs text-slate-500">Aucune mesure qualité récente disponible.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-1.5">
      {parameters.map(({ code, label }) => {
        const value = findLatestValue(values, code);
        if (!value) return null;
        return <KpiItem key={code} label={label} value={value} compact={compact} />;
      })}
    </div>
  );
}
