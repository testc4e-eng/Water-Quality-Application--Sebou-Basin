type Mode = "simple" | "multi";

export default function ClimateModeBar({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
}) {
  const items: Array<{ key: Mode; label: string; icon: string; activeIcon: string; description: string }> = [
    { key: "simple", label: "Mode simple", icon: "📘", activeIcon: "📈", description: "Vue climat classique" },
    { key: "multi", label: "Mode multiple", icon: "🔀", activeIcon: "📊", description: "Comparer plusieurs stations" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {items.map((item) => {
          const active = mode === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={[
                "flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all",
                active
                  ? "bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white shadow-md"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{active ? item.activeIcon : item.icon}</span>
                <div>
                  <div className="text-sm font-semibold">{item.label}</div>
                  <div className={`text-xs ${active ? "text-white/80" : "text-slate-500"}`}>{item.description}</div>
                </div>
              </div>
              {active && <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">Actif</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
