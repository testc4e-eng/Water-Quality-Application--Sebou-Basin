export default function DecisionLegend() {
  const freshnessLegend = [
    { label: "Récent prioritaire", color: "bg-emerald-500" },
    { label: "Moyen terme", color: "bg-amber-500" },
    { label: "Historique / archive", color: "bg-slate-500" },
  ];

  const supportLegend = [
    { label: "Rivière", color: "bg-sky-500" },
    { label: "Nappe", color: "bg-indigo-500" },
    { label: "Barrage", color: "bg-cyan-700" },
    { label: "Sebou", color: "bg-teal-700" },
  ];

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Légende de lecture</div>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2 text-sm font-medium text-slate-900">Fraîcheur</div>
          <div className="grid gap-2">
            {freshnessLegend.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-slate-600">
                <span className={`h-3 w-3 rounded-full ${item.color}`} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-sm font-medium text-slate-900">Supports spatiaux</div>
          <div className="grid gap-2">
            {supportLegend.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-slate-600">
                <span className={`h-3 w-3 rounded-full ${item.color}`} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
