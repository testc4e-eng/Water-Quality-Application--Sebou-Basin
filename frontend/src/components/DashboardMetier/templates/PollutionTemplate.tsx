import { Skull, Calendar } from "lucide-react";

import { parseLatestValues, type MapBusinessEntityProperties, type MapLatestValue } from "@/api/mapBusiness";

import { findLatestValue, formatDate, formatLatestValue, renderClassificationBadge } from "../metadataCardUtils";

const PARAMETERS = [
  { code: "DBO5", label: "DBO5" },
  { code: "DCO", label: "DCO" },
  { code: "NH4", label: "NH4" },
  { code: "NO3", label: "NO3" },
  { code: "MES", label: "MES" },
];

function KpiItem({ label, value, compact }: { label: string; value?: MapLatestValue; compact?: boolean }) {
  const badge = renderClassificationBadge(value?.classification);
  return (
    <div
      className={`flex items-center justify-between rounded border border-slate-100 bg-white px-2 text-xs ${compact ? "py-1" : "py-1.5"}`}
    >
      <div className="flex items-center gap-1.5">
        <Skull className="h-3 w-3 text-rose-500" />
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

function lastSampleDate(values: MapLatestValue[]): string | null {
  const dates = values.map((v) => v.sample_date).filter(Boolean) as string[];
  if (dates.length === 0) return null;
  return dates.sort().pop() || null;
}

export function PollutionTemplate({
  properties,
  compact,
}: {
  properties: MapBusinessEntityProperties;
  compact?: boolean;
}) {
  const values = parseLatestValues(properties.latest_values);

  if (compact) {
    const lastControl = lastSampleDate(values);
    return (
      <div className="space-y-1.5">
        {properties.source_type_label && (
          <div className="flex items-center justify-between rounded border border-slate-100 bg-white px-2 py-1 text-xs">
            <span className="font-medium text-slate-700">Type de source</span>
            <span className="font-semibold text-slate-900">{String(properties.source_type_label)}</span>
          </div>
        )}
        <div className="flex items-center justify-between rounded border border-slate-100 bg-white px-2 py-1 text-xs">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-slate-500" />
            <span className="font-medium text-slate-700">Dernier contrôle</span>
          </div>
          <span className="font-semibold text-slate-900">{formatDate(lastControl) || "—"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {properties.source_type_label && (
        <div className="text-xs text-slate-600">
          Type de source : <span className="font-medium text-slate-800">{String(properties.source_type_label)}</span>
        </div>
      )}
      {values.length === 0 ? (
        <div className="text-xs text-slate-500">Aucune donnée de pollution récente.</div>
      ) : (
        PARAMETERS.map(({ code, label }) => {
          const value = findLatestValue(values, code);
          if (!value) return null;
          return <KpiItem key={code} label={label} value={value} />;
        })
      )}
    </div>
  );
}
