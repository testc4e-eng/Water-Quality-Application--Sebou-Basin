import { parseLatestValues, type MapBusinessEntityProperties } from "@/api/mapBusiness";

import { formatDate, formatLatestValue, renderClassificationBadge } from "../metadataCardUtils";

export function GenericTemplate({
  properties,
  compact,
}: {
  properties: MapBusinessEntityProperties;
  compact?: boolean;
}) {
  const values = parseLatestValues(properties.latest_values).slice(0, compact ? 3 : 6);

  if (values.length === 0) {
    return <div className="text-xs text-slate-500">Aucun KPI exposé pour ce type d'entité.</div>;
  }

  return (
    <div className="space-y-1.5">
      {values.map((value, index) => {
        const badge = renderClassificationBadge(value.classification);
        return (
          <div
            key={`${value.parameter_code ?? "?"}-${index}`}
            className="flex items-center justify-between rounded border border-slate-100 bg-white px-2 py-1.5 text-xs"
          >
            <div className="min-w-0 flex-1 truncate">
              <span className="font-medium text-slate-800">
                {value.parameter_label || value.parameter_code || "Paramètre"}
              </span>
              {value.sample_date && (
                <span className="ml-1 text-[10px] text-slate-400">{formatDate(value.sample_date)}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">{formatLatestValue(value)}</span>
              <span
                className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white"
                style={{ backgroundColor: badge.color }}
              >
                {badge.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
