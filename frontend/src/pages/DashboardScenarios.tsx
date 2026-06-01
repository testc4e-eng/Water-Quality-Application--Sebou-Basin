import { ArrowRight, BarChart3, FlaskConical, Waves, AlertTriangle } from "lucide-react";
import { NavLink } from "react-router-dom";

const scenarioCards = [
  {
    title: "SWAT",
    subtitle: "Hydrologie et débits simulés",
    description: "Consulter les scénarios hydrologiques, les sous-bassins et les sorties débit.",
    icon: Waves,
    accent: "from-sky-500 to-blue-700",
    cta: "Explorer SWAT",
    to: "/dashboard-cartographique",
  },
  {
    title: "WASP",
    subtitle: "Qualité des eaux et polluants",
    description: "Préparer l'analyse qualité et la lecture des scénarios liés aux paramètres physico-chimiques.",
    icon: FlaskConical,
    accent: "from-emerald-500 to-teal-700",
    cta: "Préparer WASP",
    to: "/dashboard-analytique",
  },
  {
    title: "Comparaison",
    subtitle: "Réel vs scénario",
    description: "Comparer les chroniques observées et simulées pour appuyer la décision métier.",
    icon: BarChart3,
    accent: "from-amber-500 to-orange-700",
    cta: "Comparer",
    to: "/dashboard-analytique",
  },
  {
    title: "Pollutions",
    subtitle: "Gestion & Déclaration",
    description: "Déclarer une pollution accidentelle et simuler sa propagation vers l'aval (prototype).",
    icon: AlertTriangle,
    accent: "from-red-500 to-rose-700",
    cta: "Simuler",
    to: "/dashboard-pollution",
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
              Point d'entrée métier pour orienter l'analyse des scénarios, sans modifier les flux existants.
              Les cartes ci-dessous réutilisent les dashboards opérationnels déjà connectés.
            </p>
          </div>

          <div className="grid gap-4 p-6 lg:grid-cols-3">
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
                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">{card.description}</p>
                    <NavLink
                      to={card.to}
                      className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-slate-800"
                    >
                      {card.cta}
                      <ArrowRight className="h-4 w-4" />
                    </NavLink>
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
