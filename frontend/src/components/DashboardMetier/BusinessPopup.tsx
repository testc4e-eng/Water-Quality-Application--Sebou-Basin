import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
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
    <div className="w-[320px] max-h-[300px] flex flex-col space-y-2.5 text-sm overflow-hidden bg-white">
      <div>
        <div className="font-semibold leading-tight text-slate-950 truncate">{title}</div>
        <div className="mt-0.5 text-[11px] text-slate-600 truncate">{renderLocation(properties)}</div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{typeLabel}</Badge>
        {dataStatus ? <span className={`rounded border px-1.5 py-0 text-[10px] font-semibold ${dataStatusTone(dataStatus)}`}>{dataStatus}</span> : null}
        {properties.station_code ? <Badge variant="outline" className="text-[10px] px-1.5 py-0">Code {String(properties.station_code)}</Badge> : null}
      </div>

      <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-[11px]">
        <div className="text-slate-500 uppercase tracking-wide text-[9px]">Dernière mesure</div>
        <div className="font-semibold text-slate-900">{String(properties.last_measure_date || properties.date_max || "N/D")}</div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar pr-1">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border-b-0">
            <AccordionTrigger className="py-1 text-[11px] font-medium text-slate-700 hover:no-underline">
              Informations détaillées
            </AccordionTrigger>
            <AccordionContent className="pb-1 pt-1.5 space-y-2.5">
              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px] text-slate-600">
                <div>
                  <div className="uppercase text-slate-400 text-[9px]">Bassin</div>
                  <div className="font-medium text-slate-800 truncate">{String(properties.bassin || properties.sous_bassin_nom || "n/a")}</div>
                </div>
                <div>
                  <div className="uppercase text-slate-400 text-[9px]">Sous-bassin</div>
                  <div className="font-medium text-slate-800 truncate">{String(properties.sous_bassin || properties.sous_bassin_nom || "n/a")}</div>
                </div>
                <div>
                  <div className="uppercase text-slate-400 text-[9px]">Période</div>
                  <div className="font-medium text-slate-800">
                    {properties.date_min || properties.date_max
                      ? `${String(properties.date_min || "n/a")} -> ${String(properties.date_max || "n/a")}`
                      : "n/a"}
                  </div>
                </div>
                <div>
                  <div className="uppercase text-slate-400 text-[9px]">Paramètres</div>
                  <div className="font-medium text-slate-800">{String(properties.parameter_count || latestValues.length || "0")} ({String(properties.measure_count || "0")} mesures)</div>
                </div>
              </div>

              <div>
                <div className="mb-1 text-[10px] font-medium uppercase text-slate-400">Dernières valeurs</div>
                <div className="space-y-1">
                  {latestValues.length > 0 ? (
                    latestValues.map((value, index) => (
                      <div key={`${value.parameter_code}-${index}`} className="flex items-center justify-between rounded border border-slate-100 bg-white px-2 py-1 text-[10px]">
                        <div className="truncate pr-2">
                          <span className="font-medium text-slate-800">{latestValueLabel(value)}</span>
                          <span className="ml-1 text-slate-400">({value.parameter_label || value.parameter_code})</span>
                        </div>
                        {classBadge(value)}
                      </div>
                    ))
                  ) : (
                    <div className="rounded border border-slate-100 bg-white px-2 py-1 text-[10px] text-slate-500">
                      Aucune mesure disponible.
                    </div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {properties.detail_route ? (
        <div className="pt-2 border-t border-slate-100">
          <Button asChild variant="ghost" className="w-full h-7 text-[11px] justify-between px-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
            <Link to={String(properties.detail_route)}>
              Voir détails complets
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
