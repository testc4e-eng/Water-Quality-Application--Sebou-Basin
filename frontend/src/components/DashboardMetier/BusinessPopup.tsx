import { Badge } from "@/components/ui/badge";
import {
  latestValueLabel,
  parseLatestValues,
  type MapBusinessEntityProperties,
  type MapLatestValue,
} from "@/api/mapBusiness";

function classBadge(value: MapLatestValue) {
  const classification = value.classification;
  if (!classification?.class_code) {
    const reason = classification?.non_classifiable_reason || classification?.reason || classification?.message;
    return (
      <Badge variant="outline" className="border-slate-300 text-[10px] text-slate-600">
        {reason ? "Non classifiable" : "Sans classe"}
      </Badge>
    );
  }
  return (
    <span
      className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white"
      style={{ backgroundColor: classification.color || "#64748b" }}
    >
      {classification.class_label || classification.class_code}
    </span>
  );
}

interface BusinessPopupProps {
  properties: MapBusinessEntityProperties;
}

export function BusinessPopup({ properties }: BusinessPopupProps) {
  const latestValues = parseLatestValues(properties.latest_values);

  return (
    <div className="w-[320px] space-y-3 text-sm">
      <div>
        <div className="font-semibold leading-tight text-slate-950">{properties.label || "Entite metier"}</div>
        <div className="mt-1 text-xs text-slate-600">
          {[properties.commune, properties.province].filter(Boolean).join(" - ") || "Localisation non renseignee"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">
        <div>
          <div className="text-[10px] uppercase text-slate-500">Support</div>
          <div className="font-medium">{properties.display_label || properties.support_type || "n/a"}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500">Statut</div>
          <div className="font-medium">{properties.validation_status || properties.data_status || "n/a"}</div>
        </div>
        <div className="col-span-2">
          <div className="text-[10px] uppercase text-slate-500">Source backend</div>
          <div className="truncate font-medium">{properties.source_backend || "n/a"}</div>
        </div>
      </div>

      <div>
        <div className="mb-1 text-xs font-medium uppercase text-slate-500">Dernieres valeurs</div>
        <div className="max-h-44 space-y-1 overflow-auto pr-1">
          {latestValues.length > 0 ? (
            latestValues.map((value, index) => {
              const nonClassifiable =
                value.classification?.non_classifiable_reason || value.classification?.reason || value.classification?.message;
              return (
                <div key={`${value.parameter_code}-${index}`} className="rounded border border-slate-100 bg-white px-2 py-1.5 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-slate-800">{latestValueLabel(value)}</span>
                    {classBadge(value)}
                  </div>
                  {value.sample_date && <div className="mt-0.5 text-[11px] text-slate-500">Date : {value.sample_date}</div>}
                  {nonClassifiable && <div className="mt-0.5 text-[11px] text-slate-500">{nonClassifiable}</div>}
                </div>
              );
            })
          ) : (
            <div className="rounded border border-slate-100 bg-white px-2 py-2 text-xs text-slate-500">
              Aucun resultat rattache au support selectionne.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
