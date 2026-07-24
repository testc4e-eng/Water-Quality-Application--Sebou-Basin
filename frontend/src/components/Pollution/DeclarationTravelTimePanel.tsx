import { Clock3, Info } from "lucide-react";

import type { TravelTimeResult, TravelTimeTargetResult } from "@/api/pollutionDeclarations";
import { Badge } from "@/components/ui/badge";

interface DeclarationTravelTimePanelProps {
  travelTime?: TravelTimeResult | null;
}

function formatHours(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "n/a";
  return `${value.toFixed(1)} h`;
}

function formatDistance(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "n/a";
  return `${value.toFixed(1)} km`;
}

function formatArrival(target: TravelTimeTargetResult) {
  const value = target.estimated_arrival_at_local ?? target.estimated_arrival_at;
  if (!value) return "n/a";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function targetLabel(target: TravelTimeTargetResult) {
  if (target.target_station_code === "1355/8") return "P29 Sidi Allal Tazi";
  if (target.target_station_code === "3738/8") return "Amont Barrage de Garde";
  return target.target_station_label ?? target.target_station_code;
}

function methodLabel(method?: string | null) {
  if (method === "TC_OBSERVED_DIRECT") return "Tc observe";
  if (method === "AVERAGE_VELOCITY_FALLBACK") return "Vitesse moyenne";
  return method ?? "non renseignee";
}

export default function DeclarationTravelTimePanel({ travelTime }: DeclarationTravelTimePanelProps) {
  if (!travelTime) {
    return null;
  }

  const targets = travelTime.targets ?? [];
  return (
    <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <Clock3 className="h-4 w-4" />
            Temps d'arrivee estime
          </div>
          <p className="mt-1 text-cyan-900">
            Reference : {travelTime.reference_time_local ?? travelTime.reference_time ?? "non renseignee"}.
          </p>
        </div>
        <Badge variant="outline" className="border-cyan-300 bg-white text-cyan-900">
          {travelTime.reference_id} v{travelTime.reference_version}
        </Badge>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {targets.map((target) => (
          <div key={target.target_station_code} className="rounded-lg border border-cyan-100 bg-white p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="font-semibold text-slate-950">{targetLabel(target)}</div>
                <div className="mt-1 text-xs text-slate-500">Code station : {target.target_station_code}</div>
              </div>
              <Badge variant="outline">{target.confidence_level ?? "confiance n/a"}</Badge>
            </div>
            <div className="mt-3 grid gap-1 text-slate-700">
              <div>Distance topologique : {formatDistance(target.topology_distance_km)}</div>
              <div>Temps de transfert : {formatHours(target.travel_time_h)}</div>
              <div>Arrivee estimee : {formatArrival(target)}</div>
              <div>Methode : {methodLabel(target.method_used)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-cyan-100 bg-white p-3 text-slate-700">
        <Info className="h-4 w-4 shrink-0 text-cyan-700" />
        <span>Estimation issue du referentiel Tc Stations v1. Les limites completes sont conservees dans le rapport.</span>
      </div>
    </div>
  );
}
