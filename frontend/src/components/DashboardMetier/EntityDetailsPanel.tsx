import { Clock, Database, MapPin } from "lucide-react";

import {
  latestValueLabel,
  parseLatestValues,
  type MapBusinessFeature,
  type MapLatestValue,
} from "@/api/mapBusiness";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

function valueClass(value: MapLatestValue) {
  const classification = value.classification;
  if (!classification?.class_code) return <Badge variant="outline">non classifiable</Badge>;
  return (
    <span
      className="rounded px-2 py-0.5 text-[11px] font-semibold uppercase text-white"
      style={{ backgroundColor: classification.color || "#64748b" }}
    >
      {classification.class_label || classification.class_code}
    </span>
  );
}

interface EntityDetailsPanelProps {
  feature?: MapBusinessFeature | null;
}

export function EntityDetailsPanel({ feature }: EntityDetailsPanelProps) {
  if (!feature) {
    return (
      <aside className="flex h-full min-h-0 w-full flex-col border-l border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold text-slate-900">Details entite</div>
        <div className="mt-3 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
          Cliquer sur un point pour afficher ses metadonnees et resultats.
        </div>
      </aside>
    );
  }

  const properties = feature.properties;
  const latestValues = parseLatestValues(properties.latest_values);
  const metadataRows = Object.entries(properties)
    .filter(([key, value]) => !["latest_values", "map_color", "map_class_code"].includes(key) && value !== null && value !== undefined)
    .slice(0, 24);

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-l border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-950">{properties.label || "Entite metier"}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-600">
              <MapPin className="h-3.5 w-3.5" />
              {[properties.commune, properties.province].filter(Boolean).join(" - ") || "Localisation non renseignee"}
            </div>
          </div>
          <Badge variant="outline">{properties.support_type || properties.support || "support"}</Badge>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 p-4">
          <section>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Database className="h-4 w-4" />
              Metadonnees
            </div>
            <div className="space-y-1 rounded-lg border border-slate-200">
              {metadataRows.map(([key, value]) => (
                <div key={key} className="grid grid-cols-[120px_1fr] gap-2 border-b border-slate-100 px-3 py-2 text-xs last:border-b-0">
                  <span className="truncate font-medium text-slate-500">{key}</span>
                  <span className="break-words text-slate-800">{String(value)}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-2 text-sm font-semibold text-slate-900">Parametres et latest values</div>
            <div className="space-y-2">
              {latestValues.length > 0 ? (
                latestValues.map((value, index) => (
                  <div key={`${value.parameter_code}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium text-slate-900">{latestValueLabel(value)}</div>
                        <div className="mt-1 text-xs text-slate-500">{value.parameter_label || value.parameter_code || "parametre"}</div>
                      </div>
                      {valueClass(value)}
                    </div>
                    {value.sample_date && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        {value.sample_date}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-500">
                  Aucun parametre expose sur cette entite P0.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-sm font-semibold text-slate-900">Series temporelles</div>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Historique parametre, zoom temporel et evolution des classes reglementaires sont reserves au lot P1.
            </p>
          </section>
        </div>
      </ScrollArea>
    </aside>
  );
}
