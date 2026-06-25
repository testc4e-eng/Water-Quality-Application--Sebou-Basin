import {
  freshnessClasses,
  type DecisionFreshnessClassId,
} from "@/config/decisionDashboardCatalog";

interface FreshnessFilterProps {
  value: DecisionFreshnessClassId;
  onChange: (value: DecisionFreshnessClassId) => void;
}

export default function FreshnessFilter({ value, onChange }: FreshnessFilterProps) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Fraîcheur</div>
        <p className="mt-1 text-sm text-slate-600">
          La période pilote privilégie le récent par défaut et sépare explicitement les archives.
        </p>
      </div>
      <div className="grid gap-2">
        {freshnessClasses.map((item) => {
          const active = item.id === value;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`rounded-2xl border px-3 py-3 text-left transition ${
                active ? "border-amber-500 bg-amber-50" : "border-slate-200 bg-slate-50 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-slate-900">{item.label}</span>
                <span className="text-xs uppercase tracking-wide text-slate-500">{item.usage}</span>
              </div>
              <div className="mt-1 text-sm text-slate-600">{item.definition}</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
