type Mode = "simple" | "multi" | "fdc";

export default function HydroModeBar({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 p-1 bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Simple */}
        <button
          onClick={() => onChange("simple")}
          className={`
            flex-1 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300
            flex items-center justify-center gap-2
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
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
          )}
        </button>

        {/* Multi */}
        <button
          onClick={() => onChange("multi")}
          className={`
            flex-1 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300
            flex items-center justify-center gap-2
            ${
              mode === "multi"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
            }
          `}
        >
          <span className="text-base">{mode === "multi" ? "⚡" : "🔄"}</span>
          MODE MULTISCÉNARIO
          {mode === "multi" && (
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
          )}
        </button>

        {/* FDC */}
        <button
          onClick={() => onChange("fdc")}
          className={`
            flex-1 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300
            flex items-center justify-center gap-2
            ${
              mode === "fdc"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                : "text-gray-600 hover:bg-amber-50 hover:text-amber-600"
            }
          `}
        >
          <span className="text-base">{mode === "fdc" ? "📊" : "📉"}</span>
          MODE FDC
          {mode === "fdc" && (
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
          )}
        </button>
      </div>
    </div>
  );
}