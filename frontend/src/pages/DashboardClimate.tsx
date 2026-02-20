import React, { useState } from "react";
import ClimateDashboardContent from "@/components/Climate/ClimateDashboardContent";
import HydroDashboardContent from "@/components/Climate/HydroDashboardContent";
import QualityDashboardContent from "@/components/quality/QualityDashboardContent";

export default function DashboardClimate() {
  const [tab, setTab] = useState<"climat" | "hydrologie" | "qualite">("climat");

  return (
    <div className="p-6 space-y-4">
      {/* ==================================================== */}
      {/* ONGLETS STYLE "CARTES FLOTTANTES" */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-1">
        {/* CLIMAT */}
        <button
          onClick={() => setTab("climat")}
          className={`
            relative overflow-hidden rounded-2xl p-4 transition-all duration-300
            ${tab === "climat"
              ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-xl shadow-blue-500/30 scale-[1.02]"
              : "bg-white border-2 border-gray-100 text-gray-700 hover:border-sky-200 hover:shadow-lg"
            }
          `}
        >
          {tab === "climat" && (
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
          )}
          
          <div className="relative flex items-center gap-4">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center text-2xl
              ${tab === "climat" 
                ? "bg-white/20 backdrop-blur" 
                : "bg-gradient-to-br from-sky-100 to-blue-100 text-sky-600"
              }
            `}>
              {tab === "climat" ? "☀️" : "🌤️"}
            </div>
            
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">Climat</span>
                {tab === "climat" && (
                  <span className="bg-white/30 backdrop-blur px-2 py-0.5 rounded-full text-xs">
                    Actif
                  </span>
                )}
              </div>
              <p className={`text-sm mt-0.5 ${tab === "climat" ? "text-white/80" : "text-gray-500"}`}>
                Température • Préci.
              </p>
            </div>
          </div>
        </button>

        {/* HYDROLOGIE */}
        <button
          onClick={() => setTab("hydrologie")}
          className={`
            relative overflow-hidden rounded-2xl p-4 transition-all duration-300
            ${tab === "hydrologie"
              ? "bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-xl shadow-teal-500/30 scale-[1.02]"
              : "bg-white border-2 border-gray-100 text-gray-700 hover:border-cyan-200 hover:shadow-lg"
            }
          `}
        >
          {tab === "hydrologie" && (
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
          )}
          
          <div className="relative flex items-center gap-4">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center text-2xl
              ${tab === "hydrologie" 
                ? "bg-white/20 backdrop-blur" 
                : "bg-gradient-to-br from-cyan-100 to-teal-100 text-cyan-600"
              }
            `}>
              {tab === "hydrologie" ? "🌊" : "💧"}
            </div>
            
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">Hydrologie</span>
                {tab === "hydrologie" && (
                  <span className="bg-white/30 backdrop-blur px-2 py-0.5 rounded-full text-xs">
                    Actif
                  </span>
                )}
              </div>
              <p className={`text-sm mt-0.5 ${tab === "hydrologie" ? "text-white/80" : "text-gray-500"}`}>
                Débit • Niveau
              </p>
            </div>
          </div>
        </button>

        {/* QUALITÉ */}
        <button
          onClick={() => setTab("qualite")}
          className={`
            relative overflow-hidden rounded-2xl p-4 transition-all duration-300
            ${tab === "qualite"
              ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-xl shadow-green-500/30 scale-[1.02]"
              : "bg-white border-2 border-gray-100 text-gray-700 hover:border-emerald-200 hover:shadow-lg"
            }
          `}
        >
          {tab === "qualite" && (
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
          )}
          
          <div className="relative flex items-center gap-4">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center text-2xl
              ${tab === "qualite" 
                ? "bg-white/20 backdrop-blur" 
                : "bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600"
              }
            `}>
              {tab === "qualite" ? "🔬" : "🧪"}
            </div>
            
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">Qualité</span>
                {tab === "qualite" && (
                  <span className="bg-white/30 backdrop-blur px-2 py-0.5 rounded-full text-xs">
                    Actif
                  </span>
                )}
              </div>
              <p className={`text-sm mt-0.5 ${tab === "qualite" ? "text-white/80" : "text-gray-500"}`}>
                N • O • P
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* CONTENU (inchangé) */}
      {tab === "climat" && <ClimateDashboardContent />}
      {tab === "hydrologie" && <HydroDashboardContent />}
      {tab === "qualite" && <QualityDashboardContent />}
    </div>
  );
}