import { Building2, Waves, Gauge } from "lucide-react";

import { type MapBusinessEntityProperties } from "@/api/mapBusiness";

function Field({
  icon: Icon,
  label,
  value,
  colorClass = "text-slate-500",
  compact,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
  colorClass?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded border border-slate-100 bg-white px-2 text-xs ${compact ? "py-1" : "py-1.5"}`}
    >
      <div className="flex items-center gap-1.5">
        <Icon className={`h-3.5 w-3.5 ${colorClass}`} />
        <span className="font-medium text-slate-700">{label}</span>
      </div>
      <span className="font-semibold text-slate-900">{value || "—"}</span>
    </div>
  );
}

export function BarrageTemplate({
  properties,
  compact,
}: {
  properties: MapBusinessEntityProperties;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="space-y-1.5">
        <Field
          icon={Waves}
          label="Oued"
          value={(properties.nom_oued as string | undefined) || (properties.oued as string | undefined)}
          colorClass="text-blue-500"
          compact
        />
        <Field
          icon={Gauge}
          label="Statut"
          value={properties.statut as string | undefined}
          colorClass="text-slate-600"
          compact
        />
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <Field
        icon={Building2}
        label="Type de barrage"
        value={properties.type_barrage as string | undefined}
        colorClass="text-amber-600"
      />
      <Field
        icon={Gauge}
        label="Statut"
        value={properties.statut as string | undefined}
        colorClass="text-slate-600"
      />
      <Field
        icon={Waves}
        label="Oued"
        value={(properties.nom_oued as string | undefined) || (properties.oued as string | undefined)}
        colorClass="text-blue-500"
      />
    </div>
  );
}
