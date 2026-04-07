type Mode = "simple" | "multi";

export default function HydroModeBar({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-1 shadow-sm">
        <button
          onClick={() => onChange("simple")}
          className={`
            flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300
            ${
              mode === "simple"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            }
          `}
        >
          <span className="text-base">{mode === "simple" ? "📈" : "📊"}</span>
          MODE SIMPLE
          {mode === "simple" && (
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => onChange("multi")}
          className={`
            flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300
            ${
              mode === "multi"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
            }
          `}
        >
          <span className="text-base">{mode === "multi" ? "⚡" : "🔄"}</span>
          MODE MULTIPLE
          {mode === "multi" && (
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
          )}
        </button>
      </div>
    </div>
  );
}
