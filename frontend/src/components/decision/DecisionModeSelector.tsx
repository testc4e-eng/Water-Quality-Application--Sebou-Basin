import { decisionViews, type DecisionViewId } from "@/config/decisionDashboardCatalog";

interface DecisionModeSelectorProps {
  value: DecisionViewId | null;
  onChange: (value: DecisionViewId) => void;
}

export default function DecisionModeSelector({ value, onChange }: DecisionModeSelectorProps) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="mb-3">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Vision métier</div>
        <h2 className="mt-1 font-serif text-2xl text-slate-900">Choisir une vision</h2>
        <p className="mt-1 text-sm text-slate-600">
          Le dashboard reste inactif tant qu&apos;une vision n&apos;est pas sélectionnée puis confirmée.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {decisionViews.map((view) => {
          const active = value === view.id;
          return (
            <button
              key={view.id}
              type="button"
              onClick={() => onChange(view.id)}
              className={`rounded-[20px] border p-4 text-left transition ${
                active
                  ? "border-emerald-500 bg-emerald-50 shadow-[0_10px_25px_-18px_rgba(5,150,105,0.9)]"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{view.audience}</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">{view.label}</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{view.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
