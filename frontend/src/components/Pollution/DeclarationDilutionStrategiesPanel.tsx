import { Droplets, Star } from "lucide-react";

import type { PollutionDeclarationEvaluationResponse, RecommendationResult } from "@/api/pollutionDeclarations";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DeclarationDilutionStrategiesPanelProps {
  evaluation: PollutionDeclarationEvaluationResponse;
}

const AXIS_LABELS: Record<string, { label: string; field: string }> = {
  SEBOU: { label: "Sebou", field: "QSebou_m3_s" },
  INNAOUEN: { label: "Innaouen", field: "QInnaouen_m3_s" },
  OUERGHA: { label: "Ouergha", field: "QOuergha_m3_s" },
};

function formatNumber(value: number | null | undefined, digits = 3) {
  return typeof value === "number" && Number.isFinite(value) ? value.toFixed(digits) : "n/a";
}

function getAxisDelta(recommendation: RecommendationResult) {
  return Object.values(recommendation.delta_values ?? {}).reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0);
}

function sortRecommendations(recommendations: RecommendationResult[]) {
  return [...recommendations].sort((left, right) => getAxisDelta(left) - getAxisDelta(right) || left.priority - right.priority);
}

export default function DeclarationDilutionStrategiesPanel({ evaluation }: DeclarationDilutionStrategiesPanelProps) {
  const highRisk = evaluation.risk_result.risk_level === "HIGH";
  const recommendations = sortRecommendations(evaluation.recommendations).filter((item) => AXIS_LABELS[item.axis]);

  if (!highRisk) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="text-base text-slate-950">Strategies de dilution</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-green-950">
          Aucune recommandation obligatoire : le scenario est suffisant dans la matrice NH4 v1.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-base text-slate-950">Strategies de dilution</CardTitle>
        <p className="text-sm text-slate-600">Strategies mono-axe retournees par le backend. Aucune action n'est appliquee automatiquement.</p>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            Aucune solution de dilution realiste n'a ete trouvee dans le domaine actuel de la matrice.
          </div>
        ) : (
          <div className="grid gap-3 xl:grid-cols-3">
            {recommendations.slice(0, 3).map((recommendation, index) => {
              const axis = AXIS_LABELS[recommendation.axis];
              const field = axis.field;
              const current = recommendation.current_values?.[field];
              const proposed = recommendation.proposed_values?.[field];
              const delta = recommendation.delta_values?.[field] ?? getAxisDelta(recommendation);
              const expected = recommendation.expected_matrix_result;
              const optimal = index === 0;

              return (
                <div
                  key={recommendation.recommendation_id}
                  className={[
                    "rounded-2xl border p-4",
                    optimal ? "border-blue-300 bg-blue-50 shadow-sm" : "border-slate-200 bg-white",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-700" />
                        <div className="font-bold text-slate-950">{axis.label}</div>
                      </div>
                      <div className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">Strategie mono-axe</div>
                    </div>
                    {optimal && (
                      <Badge className="bg-blue-700 hover:bg-blue-700">
                        <Star className="mr-1 h-3 w-3" />
                        Optimale
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4 grid gap-2 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Debit actuel</span>
                      <span className="font-semibold text-slate-950">{formatNumber(current)} m3/s</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Debit propose</span>
                      <span className="font-semibold text-slate-950">{formatNumber(proposed)} m3/s</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">Delta minimum</span>
                      <span className="font-semibold text-slate-950">+{formatNumber(delta)} m3/s</span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500">P29</span>
                      <span className="font-semibold text-slate-950">{formatNumber(expected?.C_SidiAllalTazi_mg_L)} mg/L</span>
                    </div>
                    <div className="mt-1 flex justify-between gap-3">
                      <span className="text-slate-500">Amont Garde</span>
                      <span className="font-semibold text-slate-950">{formatNumber(expected?.C_BgGarde_mg_L)} mg/L</span>
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline">{expected?.statut_global ?? "INCONNU"}</Badge>
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-5 text-slate-600">{recommendation.justification}</p>
                  <div className="mt-3 space-y-1 text-xs text-slate-500">
                    <div>Confiance : {recommendation.confidence}</div>
                    {recommendation.source_scenario_id && <div>Scenario source : {recommendation.source_scenario_id}</div>}
                    {recommendation.target_scenario_id && <div>Scenario cible : {recommendation.target_scenario_id}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
