import React, { useState } from "react";
import ClimateModesDashboard from "@/components/Climate/ClimateModesDashboard";
import HydroDashboardContent from "@/components/Climate/HydroDashboardContent";
import QualityDashboardContent from "@/components/quality/QualityDashboardContent";

export default function DashboardClimate() {
  const [tab, setTab] = useState<"climat" | "hydrologie" | "qualite">("climat");

  return (
    <div className="space-y-4 p-6">
      <div className="grid grid-cols-1 gap-3 p-1 md:grid-cols-3">
        <button
          onClick={() => setTab("climat")}
          className={`
            relative overflow-hidden rounded-2xl p-3 transition-all duration-300
            ${
              tab === "climat"
                ? "scale-[1.02] bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-xl shadow-blue-500/30"
                : "border-2 border-gray-100 bg-white text-gray-700 hover:border-sky-200 hover:shadow-lg"
            }
          `}
        >
          {tab === "climat" && (
            <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-white/10 blur-2xl" />
          )}

          <div className="relative flex items-center gap-3">
            <div
              className={`
                flex h-10 w-10 items-center justify-center rounded-xl text-xl
                ${tab === "climat" ? "bg-white/20 backdrop-blur" : "bg-gradient-to-br from-sky-100 to-blue-100 text-sky-600"}
              `}
            >
              {tab === "climat" ? "☀️" : "🌤️"}
            </div>

            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold">Climat</span>
                {tab === "climat" && (
                  <span className="rounded-full bg-white/30 px-2 py-0.5 text-xs backdrop-blur">
                    Actif
                  </span>
                )}
              </div>
              <p className={`mt-0.5 text-xs ${tab === "climat" ? "text-white/80" : "text-gray-500"}`}>
                Température • Précipitations
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setTab("hydrologie")}
          className={`
            relative overflow-hidden rounded-2xl p-3 transition-all duration-300
            ${
              tab === "hydrologie"
                ? "scale-[1.02] bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-xl shadow-teal-500/30"
                : "border-2 border-gray-100 bg-white text-gray-700 hover:border-cyan-200 hover:shadow-lg"
            }
          `}
        >
          {tab === "hydrologie" && (
            <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-white/10 blur-2xl" />
          )}

          <div className="relative flex items-center gap-3">
            <div
              className={`
                flex h-10 w-10 items-center justify-center rounded-xl text-xl
                ${tab === "hydrologie" ? "bg-white/20 backdrop-blur" : "bg-gradient-to-br from-cyan-100 to-teal-100 text-cyan-600"}
              `}
            >
              {tab === "hydrologie" ? "🌊" : "💧"}
            </div>

            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold">Hydrologie & Qualité</span>
                {tab === "hydrologie" && (
                  <span className="rounded-full bg-white/30 px-2 py-0.5 text-xs backdrop-blur">
                    Actif
                  </span>
                )}
              </div>
              <p className={`mt-0.5 text-xs ${tab === "hydrologie" ? "text-white/80" : "text-gray-500"}`}>
                Débit • Niveau • Qualité
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setTab("qualite")}
          className={`
            relative overflow-hidden rounded-2xl p-3 transition-all duration-300
            ${
              tab === "qualite"
                ? "scale-[1.02] bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-xl shadow-green-500/30"
                : "border-2 border-gray-100 bg-white text-gray-700 hover:border-emerald-200 hover:shadow-lg"
            }
          `}
        >
          {tab === "qualite" && (
            <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-white/10 blur-2xl" />
          )}

          <div className="relative flex items-center gap-3">
            <div
              className={`
                flex h-10 w-10 items-center justify-center rounded-xl text-xl
                ${tab === "qualite" ? "bg-white/20 backdrop-blur" : "bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600"}
              `}
            >
              {tab === "qualite" ? "🧪" : "🧫"}
            </div>

            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold">Pollution</span>
                {tab === "qualite" && (
                  <span className="rounded-full bg-white/30 px-2 py-0.5 text-xs backdrop-blur">
                    Actif
                  </span>
                )}
              </div>
              <p className={`mt-0.5 text-xs ${tab === "qualite" ? "text-white/80" : "text-gray-500"}`}>
                Inventaire � Ponctuelle � Diffuse
              </p>
            </div>
          </div>
        </button>
      </div>

      {tab === "climat" && <ClimateModesDashboard />}
      {tab === "hydrologie" && <HydroDashboardContent />}
      {tab === "qualite" && <QualityDashboardContent />}
    </div>
  );
}
