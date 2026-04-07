import { useState } from "react";
import UnifiedSimpleDashboard from "@/components/Climate/UnifiedSimpleDashboard";
import UnifiedMultiDashboard from "@/components/Climate/UnifiedMultiDashboard";

type Mode = "simple" | "multi";

export default function UnifiedDashboardView({ theme }: { theme: string }) {
  const [mode, setMode] = useState<Mode>("simple");

  return (
    <div className="space-y-6">
      <div className="flex w-full items-center justify-center p-1">
        <div className="inline-flex rounded-2xl border border-gray-100 bg-white/50 p-1.5 shadow-sm backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setMode("simple")}
            className={`
              relative flex min-w-[160px] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300
              ${mode === "simple" ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-blue-500/20" : "text-gray-500 hover:bg-gray-100/50 hover:text-gray-800"}
            `}
          >
            {mode === "simple" && <div className="absolute inset-0 rounded-xl bg-white/20 blur-sm" />}
            <span className="relative z-10 flex items-center gap-2"><span>📈</span> Mode Simple</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("multi")}
            className={`
              relative flex min-w-[160px] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300
              ${mode === "multi" ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-purple-500/20" : "text-gray-500 hover:bg-gray-100/50 hover:text-gray-800"}
            `}
          >
            {mode === "multi" && <div className="absolute inset-0 rounded-xl bg-white/20 blur-sm" />}
            <span className="relative z-10 flex items-center gap-2"><span>📊</span> Mode Multiple</span>
          </button>
        </div>
      </div>

      {mode === "simple" && <UnifiedSimpleDashboard theme={theme} />}
      {mode === "multi" && <UnifiedMultiDashboard theme={theme} />}
    </div>
  );
}
