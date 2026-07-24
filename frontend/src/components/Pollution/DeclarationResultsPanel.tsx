import { CheckCircle2, ShieldAlert } from "lucide-react";

import type { PollutionDeclarationEvaluationResponse } from "@/api/pollutionDeclarations";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeclarationTravelTimePanel from "./DeclarationTravelTimePanel";

interface DeclarationResultsPanelProps {
  evaluation: PollutionDeclarationEvaluationResponse;
}

function formatNumber(value: number | null | undefined, digits = 3) {
  return typeof value === "number" && Number.isFinite(value) ? value.toFixed(digits) : "n/a";
}

function stationBadge(status: string | undefined) {
  const isSufficient = status === "SUFFISANT";
  return (
    <Badge className={isSufficient ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-red-100 text-red-800 hover:bg-red-100"}>
      {status ?? "INCONNU"}
    </Badge>
  );
}

export default function DeclarationResultsPanel({ evaluation }: DeclarationResultsPanelProps) {
  const matrix = evaluation.matrix_result;
  const topology = evaluation.topology_result;
  const globalSufficient = matrix.statut_global === "SUFFISANT";
  const uniqueWarnings = Array.from(new Set(evaluation.warnings.filter(Boolean)));

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-base text-slate-950">Resultats NH4</CardTitle>
          <Badge className={globalSufficient ? "bg-green-600 hover:bg-green-600" : "bg-red-600 hover:bg-red-600"}>
            {globalSufficient ? "SUFFISANT" : "INSUFFISANT"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Point de controle</div>
                <div className="mt-1 font-semibold text-slate-950">P29 Sidi Allal Tazi</div>
              </div>
              {stationBadge(matrix.statut_sidi_allal_tazi)}
            </div>
            <div className="mt-4 text-2xl font-bold text-slate-950">
              {formatNumber(matrix.C_SidiAllalTazi_mg_L)} <span className="text-sm font-medium text-slate-500">mg/L</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Point de controle</div>
                <div className="mt-1 font-semibold text-slate-950">Amont Barrage de Garde</div>
              </div>
              {stationBadge(matrix.statut_bg_garde)}
            </div>
            <div className="mt-4 text-2xl font-bold text-slate-950">
              {formatNumber(matrix.C_BgGarde_mg_L)} <span className="text-sm font-medium text-slate-500">mg/L</span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <div className="font-semibold text-slate-950">Matrice</div>
            <div className="mt-1 text-slate-600">{matrix.matrix_id} v{matrix.matrix_version}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <div className="font-semibold text-slate-950">Scenario</div>
            <div className="mt-1 break-all text-slate-600">{matrix.scenario_id ?? "non renseigne"}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <div className="font-semibold text-slate-950">Methode</div>
            <div className="mt-1 text-slate-600">{matrix.method_used}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <div className="font-semibold text-slate-950">Ligne exacte</div>
            <div className="mt-1 text-slate-600">{matrix.exact_match ? "oui" : "non - plus proche scenario"}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <div className="font-semibold text-slate-950">Confiance</div>
            <div className="mt-1 text-slate-600">{matrix.confidence_level}</div>
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-950">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            Controle topologique
          </div>
          <div className="mt-2 grid gap-1 text-blue-900">
            <div>Longueur du parcours : {formatNumber(topology.longueur_km, 2)} km</div>
            <div>Amont Barrage de Garde atteint : {topology.barrage_garde_atteint ? "oui" : "non"}</div>
            <div>P29 detectee : {topology.sidi_allal_tazi_detectee ? "oui" : "non"}</div>
            <div>Distance de snap : {formatNumber(topology.snap_distance_m, 1)} m</div>
          </div>
        </div>

        <DeclarationTravelTimePanel travelTime={evaluation.travel_time_result} />

        {(matrix.out_of_domain || uniqueWarnings.length > 0) && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldAlert className="h-4 w-4" />
              Limites scientifiques
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {matrix.out_of_domain && <li>Les valeurs saisies sortent du domaine de la matrice NH4 v1.</li>}
              {uniqueWarnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
