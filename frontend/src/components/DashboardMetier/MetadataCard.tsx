import { Activity, ArrowRight, Calendar, Database, Gauge, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getMapErrorLabel, type MapBusinessEntityProperties } from "@/api/mapBusiness";

import { selectTemplate } from "./metadataCardRegistry";
import {
  formatDate,
  formatMeasureCount,
  formatParameterCount,
  freshnessLabel,
  freshnessTone,
  getEntityCode,
  getEntityTypeLabel,
  getPeriodLabel,
  labelForStatus,
  renderLocation,
  toneForStatus,
} from "./metadataCardUtils";

export type MetadataCardVariant = "compact" | "full";

export interface MetadataCardProps {
  properties?: MapBusinessEntityProperties | null;
  loading?: boolean;
  error?: unknown | null;
  variant?: MetadataCardVariant;
  actions?: React.ReactNode;
}

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </div>
  );
}

function FreshnessPill({ dateString }: { dateString?: string | null }) {
  const tone = freshnessTone(dateString);
  const toneClass =
    tone === "ok"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : tone === "warning"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-red-50 text-red-700 border-red-200";
  return (
    <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${toneClass}`}>
      {freshnessLabel(dateString)}
    </span>
  );
}

export function MetadataCard({ properties, loading, error, variant = "full", actions }: MetadataCardProps) {
  const isCompact = variant === "compact";
  const title = properties?.label || properties?.station_name || properties?.display_label || "Entité métier";
  const typeLabel = getEntityTypeLabel(properties ?? {});
  const code = properties ? getEntityCode(properties) : null;
  const dataStatus = properties?.data_status_label ?? properties?.data_status;
  const Template = selectTemplate(properties ?? null);

  if (loading) {
    return (
      <div className={`space-y-3 p-3 ${isCompact ? "w-[300px]" : "w-[380px]"}`}>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 text-sm text-red-700 ${isCompact ? "w-[300px]" : "w-[380px]"}`}>
        <div className="font-medium">Impossible de charger la fiche</div>
        <div className="mt-1 text-xs text-red-600">{getMapErrorLabel(error)}</div>
      </div>
    );
  }

  if (!properties) {
    return (
      <div className={`p-4 text-sm text-slate-500 ${isCompact ? "w-[300px]" : "w-[380px]"}`}>
        Aucune entité sélectionnée.
      </div>
    );
  }

  if (isCompact) {
    return (
      <div className="flex w-[320px] max-w-[320px] flex-col overflow-hidden bg-white text-xs">
        <div className="border-b border-slate-100 p-3 pb-2">
          <h3 className="truncate text-sm font-semibold leading-tight text-slate-950">{title}</h3>
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{renderLocation(properties)}</span>
          </div>
          <div className="mt-1.5 text-[11px] text-slate-600">
            {typeLabel}
            {code ? ` · Code ${code}` : ""}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {dataStatus ? (
              <span
                className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${toneForStatus(dataStatus)}`}
              >
                {labelForStatus(dataStatus)}
              </span>
            ) : null}
            <FreshnessPill dateString={properties.last_measure_date || properties.date_max} />
          </div>
          <div className="mt-1.5 text-[11px] text-slate-600">
            Dernière mesure : {formatDate(properties.last_measure_date || properties.date_max) || "N/D"}
          </div>
        </div>

        <div className="p-3">
          <Template properties={properties} compact />
        </div>

        <div className="border-t border-slate-100 p-2.5">
          {properties.detail_route ? (
            <Button
              asChild
              variant="ghost"
              className="h-7 w-full justify-between px-2 text-[11px] font-medium text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <Link to={String(properties.detail_route)}>
                Voir la fiche complète
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          ) : (
            <Button
              disabled
              variant="ghost"
              className="h-7 w-full justify-between px-2 text-[11px] font-medium text-slate-400"
            >
              Voir la fiche complète
              <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-[380px] max-w-[380px] flex-col overflow-hidden bg-white text-sm">
      <div className="border-b border-slate-100 p-3 pb-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold leading-tight text-slate-950">{title}</h3>
            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{renderLocation(properties)}</span>
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="text-[10px] font-medium">
            {typeLabel}
          </Badge>
          {code ? (
            <Badge variant="outline" className="text-[10px] font-normal">
              Code {code}
            </Badge>
          ) : null}
          {dataStatus ? (
            <span
              className={`rounded border px-1.5 py-0 text-[10px] font-semibold ${toneForStatus(dataStatus)}`}
            >
              {labelForStatus(dataStatus)}
            </span>
          ) : null}
        </div>
      </div>

      <div className="custom-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto p-3 pt-2.5">
        <section>
          <SectionTitle icon={Activity}>État</SectionTitle>
          <div className="flex flex-wrap items-center gap-2">
            {dataStatus ? (
              <span
                className={`rounded border px-2 py-0.5 text-[11px] font-semibold ${toneForStatus(dataStatus)}`}
              >
                {labelForStatus(dataStatus)}
              </span>
            ) : null}
            <FreshnessPill dateString={properties.last_measure_date || properties.date_max} />
            {properties.validation_status ? (
              <Badge variant="outline" className="text-[10px]">
                Validation : {properties.validation_status}
              </Badge>
            ) : null}
          </div>
        </section>

        <section className="rounded-lg border border-slate-100 bg-slate-50/60 p-2.5">
          <SectionTitle icon={Gauge}>KPI instantanés</SectionTitle>
          <Template properties={properties} />
        </section>

        {(properties.measure_count !== undefined || properties.parameter_count !== undefined || properties.last_measure_date || properties.date_max || properties.date_min) && (
          <section>
            <SectionTitle icon={Database}>Qualité des données</SectionTitle>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {properties.measure_count !== undefined && (
                <div className="rounded border border-slate-100 bg-white p-2">
                  <div className="text-[10px] uppercase text-slate-400">Mesures</div>
                  <div className="font-medium text-slate-800">{formatMeasureCount(properties.measure_count)}</div>
                </div>
              )}
              {properties.parameter_count !== undefined && (
                <div className="rounded border border-slate-100 bg-white p-2">
                  <div className="text-[10px] uppercase text-slate-400">Paramètres</div>
                  <div className="font-medium text-slate-800">{formatParameterCount(properties.parameter_count)}</div>
                </div>
              )}
              {(properties.last_measure_date || properties.date_max) && (
                <div className="rounded border border-slate-100 bg-white p-2">
                  <div className="text-[10px] uppercase text-slate-400">Dernière mesure</div>
                  <div className="font-medium text-slate-800">
                    {formatDate(properties.last_measure_date || properties.date_max) || "—"}
                  </div>
                </div>
              )}
              {(properties.date_min || properties.date_max) && (
                <div className="rounded border border-slate-100 bg-white p-2">
                  <div className="text-[10px] uppercase text-slate-400">Période</div>
                  <div className="font-medium text-slate-800">{getPeriodLabel(properties) || "—"}</div>
                </div>
              )}
            </div>
          </section>
        )}

        {(properties.date_min || properties.date_max) && (
          <section>
            <SectionTitle icon={Calendar}>Calendrier</SectionTitle>
            <div className="text-xs text-slate-600">
              Données du {formatDate(properties.date_min) || "n/a"} au {formatDate(properties.date_max) || "n/a"}
            </div>
          </section>
        )}
      </div>

      {(properties.detail_route || actions) && (
        <div className="border-t border-slate-100 p-2.5 pt-2 space-y-2">
          {actions}
          {properties.detail_route ? (
            <Button
              asChild
              variant="ghost"
              className="h-8 w-full justify-between px-2.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <Link to={String(properties.detail_route)}>
                Voir la fiche complète
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
