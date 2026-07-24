import { AlertTriangle, CheckCircle2, UserCheck } from "lucide-react";

import type { PollutionDeclarationEvaluationResponse } from "@/api/pollutionDeclarations";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DeclarationDecisionPanelProps {
  evaluation: PollutionDeclarationEvaluationResponse;
}

export default function DeclarationDecisionPanel({ evaluation }: DeclarationDecisionPanelProps) {
  const highRisk = evaluation.risk_result.risk_level === "HIGH";
  const reasoning = evaluation.decision_reasoning;
  const reasons = reasoning?.reasons?.length ? reasoning.reasons : reasoning?.summary ? [reasoning.summary] : [];

  return (
    <Card className={highRisk ? "border-red-200 bg-red-50/50" : "border-green-200 bg-green-50/50"}>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base text-slate-950">
            {highRisk ? <AlertTriangle className="h-5 w-5 text-red-700" /> : <CheckCircle2 className="h-5 w-5 text-green-700" />}
            Decision
          </CardTitle>
          <Badge className={highRisk ? "bg-red-600 hover:bg-red-600" : "bg-green-600 hover:bg-green-600"}>
            {highRisk ? "Risque eleve" : "Risque faible"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="rounded-xl border border-white/70 bg-white p-4">
          <div className="text-lg font-bold text-slate-950">
            {highRisk ? "Situation insuffisante" : "Situation acceptable"}
          </div>
          <p className="mt-2 leading-6 text-slate-700">
            {highRisk
              ? "Au moins un point de controle depasse le seuil provisoire NH4 dans le scenario analyse."
              : "Le scenario reste dans le statut suffisant de la matrice NH4 v1."}
          </p>
        </div>

        {reasons.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="font-semibold text-slate-950">Pourquoi ?</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 leading-6 text-slate-700">
              {reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
          <div className="flex items-center gap-2 font-semibold">
            <UserCheck className="h-4 w-4" />
            Validation humaine obligatoire
          </div>
          <p className="mt-2 leading-6">
            Les resultats reposent sur la matrice NH4 v1 et des debits manuels. Le systeme assiste la decision,
            il ne remplace pas l'expert metier.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
