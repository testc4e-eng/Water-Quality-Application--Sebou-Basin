import { Badge } from "@/components/ui/badge";
import {
  latestValueLabel,
  parseLatestValues,
  type MapBusinessEntityProperties,
  type MapLatestValue,
} from "@/api/mapBusiness";

function classBadge(value: MapLatestValue) {
  const classification = value.classification;
  if (!classification?.class_code) return null;
  return (
    <span
      className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white"
      style={{ backgroundColor: classification.color || "#64748b" }}
    >
      {classification.class_label || classification.class_code}
    </span>
  );
}

function dataStatusTone(status: string | null | undefined) {
  switch (status) {
    case "ACTIF":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "SANS_MESURE_RECENTE":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "A_VALIDER":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function renderLocation(properties: MapBusinessEntityProperties) {
  const locality = [properties.commune, properties.province].filter(Boolean).join(" - ");
  const coordinates =
    typeof properties.latitude === "number" && typeof properties.longitude === "number"
      ? `${properties.latitude.toFixed(5)}, ${properties.longitude.toFixed(5)}`
      : null;
  return [locality, coordinates].filter(Boolean).join(" | ") || "Coordonnées indisponibles";
}

interface BusinessPopupProps {
  properties: MapBusinessEntityProperties;
}

export function BusinessPopup({ properties }: BusinessPopupProps) {
  const latestValues = parseLatestValues(properties.latest_values).slice(0, 8);
  const title =
    properties.label ||
    (typeof properties.station_name === "string" ? properties.station_name : null) ||
    properties.display_label ||
    "Entité métier";
  const typeLabel =
    (typeof properties.entity_kind === "string" ? properties.entity_kind : null) ||
    properties.display_label ||
    properties.support_type ||
    "Support";
  const dataStatus = typeof properties.data_status_label === "string" ? properties.data_status_label : properties.data_status;

  return (
    <div className="w-[360px] space-y-3 text-sm">
      <div>
        <div className="font-semibold leading-tight text-slate-950">{title}</div>
        <div className="mt-1 text-xs text-slate-600">{renderLocation(properties)}</div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">{typeLabel}</Badge>
        {dataStatus ? <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${dataStatusTone(dataStatus)}`}>{dataStatus}</span> : null}
        {properties.station_code ? <Badge variant="outline">Code {String(properties.station_code)}</Badge> : null}
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">
        <div>
          <div className="text-[10px] uppercase text-slate-500">Bassin</div>
          <div className="font-medium">{String(properties.bassin || properties.sous_bassin_nom || "n/a")}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500">Sous-bassin</div>
          <div className="font-medium">{String(properties.sous_bassin || properties.sous_bassin_nom || "n/a")}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500">Dernière mesure</div>
          <div className="font-medium">{String(properties.last_measure_date || properties.date_max || "n/a")}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500">Période couverte</div>
          <div className="font-medium">
            {properties.date_min || properties.date_max
              ? `${String(properties.date_min || "n/a")} -> ${String(properties.date_max || "n/a")}`
              : "n/a"}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500">Mesures</div>
          <div className="font-medium">{String(properties.measure_count || "0")}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500">Paramètres</div>
          <div className="font-medium">{String(properties.parameter_count || latestValues.length || "0")}</div>
        </div>
      </div>

      <div>
        <div className="mb-1 text-xs font-medium uppercase text-slate-500">Dernières valeurs</div>
        <div className="max-h-52 space-y-1 overflow-auto pr-1">
          {latestValues.length > 0 ? (
            latestValues.map((value, index) => (
              <div key={`${value.parameter_code}-${index}`} className="rounded border border-slate-100 bg-white px-2 py-1.5 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-slate-800">{latestValueLabel(value)}</span>
                  {classBadge(value)}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-500">
                  {value.parameter_label || value.parameter_code || "Paramètre"}
                  {value.sample_date ? ` • ${value.sample_date}` : ""}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded border border-slate-100 bg-white px-2 py-2 text-xs text-slate-500">
              Aucune mesure exploitable n’a été retrouvée pour cette entité.
            </div>
          )}
        </div>
      </div>

      {properties.detail_route ? (
        <div className="text-[11px] text-slate-500">Voir détails : {String(properties.detail_route)}</div>
      ) : null}
    </div>
  );
}
