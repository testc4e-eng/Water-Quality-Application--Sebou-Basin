import { AlertTriangle, ArrowRight, MapPin, RadioTower, ShieldCheck, TrendingUp, Waves } from "lucide-react";
import { NavLink } from "react-router-dom";

import {
  parseLatestValues,
  strongestClassification,
  type MapBusinessFeature,
} from "@/api/mapBusiness";
import { useDecisionAlerts, useDecisionRecommendations } from "@/hooks/useDecisionIntelligence";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PanneauActionMetierProps {
  feature?: MapBusinessFeature | null;
  viewMode: "bassin" | "sous-bassin" | "station";
}

function riskLabel(severity?: number | null) {
  if ((severity ?? 0) >= 4) return "Critique";
  if ((severity ?? 0) >= 2) return "Surveillance";
  return "Stable";
}

function riskClass(label: string) {
  if (label === "Critique") return "bg-red-100 text-red-700";
  if (label === "Surveillance") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

export function PanneauActionMetier({ feature, viewMode }: PanneauActionMetierProps) {
  if (!feature) {
    return (
      <aside className="flex h-full min-h-0 w-full flex-col border-l border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold text-slate-900">Panneau d'action métier</div>
        <div className="mt-3 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
          Sélectionnez une entité sur la carte pour afficher son état, ses alertes et les actions recommandées.
        </div>
      </aside>
    );
  }

  const properties = feature.properties;
  const alertsQuery = useDecisionAlerts({ entity_name: String(properties.label || ""), limit: 3 });
  const recommendationsQuery = useDecisionRecommendations({
    entity_name: String(properties.label || ""),
    domain: properties.support_group?.includes("pollution") ? "pollution" : "quality",
    limit: 3,
  });
  const latestValues = parseLatestValues(properties.latest_values);
  const strongest = strongestClassification(latestValues);
  const risk = riskLabel(strongest?.severity_order);
  const actions = [
    {
      label: "Ouvrir la qualité des eaux",
      to: "/dashboard-qualite-reglementaire",
      show: properties.support_group === "stations" || properties.support === "stations_qualite",
    },
    {
      label: "Ouvrir la pollution",
      to: "/dashboard-pollution",
      show: properties.support_group?.includes("pollution") || properties.support?.includes("pollution"),
    },
    {
      label: "Rester sur la carte métier",
      to: "/dashboard-carto-metier",
      show: true,
    },
  ].filter((action) => action.show);

  const recommendedActions = recommendationsQuery.data?.length
    ? recommendationsQuery.data.map((item) => item.action)
    : risk === "Critique"
      ? [
          "Déclencher une revue métier immédiate.",
          "Vérifier la dernière mesure et les actifs sensibles à l'aval.",
        ]
      : risk === "Surveillance"
        ? [
            "Maintenir la surveillance rapprochée.",
            "Comparer avec les stations voisines et les dernières tendances.",
          ]
        : [
            "Conserver la surveillance courante.",
            "Utiliser cette entité comme point de contexte métier.",
          ];

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-l border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Vue {viewMode}</div>
        <div className="mt-2 text-lg font-semibold text-slate-950">{properties.label || "Entité métier"}</div>
        <div className="mt-1 flex items-center gap-1 text-xs text-slate-600">
          <MapPin className="h-3.5 w-3.5" />
          {[properties.commune, properties.province].filter(Boolean).join(" · ") || "Localisation non renseignée"}
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 p-4">
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-slate-950">
                <ShieldCheck className="h-4 w-4 text-blue-700" />
                État
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${riskClass(risk)}`}>{risk}</span>
            </div>
            <div className="grid gap-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Support métier</span>
                <span className="font-medium text-slate-900">{properties.support_type || properties.support || "n/a"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tendance</span>
                <span className="flex items-center gap-1 font-medium text-slate-900">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  {strongest?.class_label || "À préciser via historique"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Alertes</span>
                <span className="font-medium text-slate-900">{alertsQuery.data?.length ? `${alertsQuery.data.length} active(s)` : risk === "Critique" ? "Action requise" : risk === "Surveillance" ? "Surveillance" : "RAS"}</span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Pollutions associées
            </div>
            <div className="space-y-2">
              {alertsQuery.data?.filter((alert) => alert.type === "POLLUTION").length ? (
                alertsQuery.data
                  ?.filter((alert) => alert.type === "POLLUTION")
                  .map((alert) => (
                    <div key={alert.title} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      {alert.title}
                    </div>
                  ))
              ) : (
                <p className="text-sm leading-6 text-slate-600">
                  Les liens explicites entre entité et sources pollution seront consolidés via la navigation `Pollution`. Ce panneau reste centré sur la décision locale.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
              <Waves className="h-4 w-4 text-blue-700" />
              Dernières valeurs utiles
            </div>
            <div className="space-y-2 text-sm">
              {latestValues.length > 0 ? (
                latestValues.slice(0, 4).map((value, index) => (
                  <div key={`${value.parameter_code}-${index}`} className="rounded-xl bg-slate-50 px-3 py-2 text-slate-700">
                    <div className="font-medium text-slate-900">{value.parameter_label || value.parameter_code || "Paramètre"}</div>
                    <div className="mt-1">
                      {value.value_numeric ?? value.value_text ?? "N/D"} {value.unit ?? ""}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl bg-slate-50 px-3 py-2 text-slate-600">Aucune valeur récente exposée sur cette entité.</div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
              <RadioTower className="h-4 w-4 text-slate-700" />
              Actions recommandées
            </div>
            <div className="space-y-2">
              {recommendedActions.map((action) => (
                <div key={action} className="rounded-xl bg-white px-3 py-2 text-sm text-slate-700">
                  {action}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            {actions.map((action) => (
              <Button key={action.to} asChild variant="outline" className="w-full justify-between">
                <NavLink to={action.to}>
                  {action.label}
                  <ArrowRight className="h-4 w-4" />
                </NavLink>
              </Button>
            ))}
          </section>
        </div>
      </ScrollArea>
    </aside>
  );
}
