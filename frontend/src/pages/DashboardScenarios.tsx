import { AlertTriangle, BarChart3, FlaskConical, Waves } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";

const scenarioCards = [
  {
    title: "SWAT",
    subtitle: "Validation scientifique externe requise",
    description:
      "Module maintenu en statut 'en construction'. Les scénarios et résultats ne doivent pas être présentés comme décisionnels avant validation métier.",
    icon: Waves,
    accent: "from-sky-500 to-blue-700",
  },
  {
    title: "WASP",
    subtitle: "Sandbox legacy à contractualiser",
    description:
      "Les résultats WASP restent hors restitution officielle tant que la validation scientifique et le contrat d'intégration ne sont pas stabilisés.",
    icon: FlaskConical,
    accent: "from-emerald-500 to-teal-700",
  },
  {
    title: "Prédiction pollution",
    subtitle: "Modèle à venir",
    description:
      "Le moteur prédictif dépend encore de la qualité des données, des arbitrages pollution et des contrats SWAT/WASP.",
    icon: BarChart3,
    accent: "from-amber-500 to-orange-700",
  },
  {
    title: "Recommandations autonomes",
    subtitle: "Non exposé comme module autonome",
    description:
      "Les recommandations restent intégrées aux dashboards opérationnels et ne doivent pas être présentées comme moteur autonome finalisé.",
    icon: AlertTriangle,
    accent: "from-red-500 to-rose-700",
  },
];

export default function DashboardScenarios() {
  return (
    <div className="min-h-[calc(100vh-140px)] bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef6ff_45%,#ecfdf5_100%)] px-5 py-6 lg:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/85 shadow-[0_30px_90px_-36px_rgba(15,23,42,0.35)] backdrop-blur-xl">
          <div className="bg-[linear-gradient(135deg,#0f766e_0%,#0f172a_52%,#1d4ed8_100%)] px-8 py-10 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/70">
              Modèles décisionnels
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Scénarios SWAT / WASP</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">
              Les modules modèles restent volontairement hors restitution opérationnelle. Cet écran sert uniquement
              de panneau de statut pour éviter toute interprétation de résultats non validés.
            </p>
          </div>

          <div className="border-b border-slate-200 bg-amber-50 px-6 py-4 text-sm text-amber-950">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status="EN_CONSTRUCTION" />
              <StatusBadge status="PARTIEL" />
            </div>
            <div className="mt-2">
              Les modules SWAT, WASP, Prédiction pollution et Recommandations autonomes restent absents ou en construction
              tant que les validations métier et scientifiques ne sont pas obtenues.
            </div>
          </div>

          <div className="grid gap-4 p-6 lg:grid-cols-2">
            {scenarioCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <div className={`h-2 bg-gradient-to-r ${card.accent}`} />
                  <div className="p-5">
                    <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-white shadow-lg`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{card.subtitle}</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">{card.title}</h2>
                    <p className="mt-3 min-h-[88px] text-sm leading-6 text-slate-600">{card.description}</p>
                    <div className="mt-5">
                      <StatusBadge status="EN_CONSTRUCTION" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
