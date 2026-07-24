import React, { useState } from "react";
import { QualityGlobalFilters } from "@/components/quality-dashboard/QualityGlobalFilters";
import { QualityOverviewTab } from "@/components/quality-dashboard/QualityOverviewTab";
import { QualityRealtimeTab } from "@/components/quality-dashboard/QualityRealtimeTab";
import { QualityHistoriqueTab } from "@/components/quality-dashboard/QualityHistoriqueTab";
import { QualityDamsTab } from "@/components/quality-dashboard/QualityDamsTab";
import { QualityAlertsQATab } from "@/components/quality-dashboard/QualityAlertsQATab";
import { QualityParametersTab } from "@/components/quality-dashboard/QualityParametersTab";
import { DEFAULT_QUALITY_FILTERS, getQualityDateRange, type QualityDashboardFilters } from "@/components/quality-dashboard/types";
import { Calendar, Download } from "lucide-react";

export default function DashboardQualiteReglementaire() {
  const [activeTab, setActiveTab] = useState("VUE_DENSEMBLE");
  const [filters, setFilters] = useState<QualityDashboardFilters>(DEFAULT_QUALITY_FILTERS);
  const dateRange = getQualityDateRange(filters.period);

  const tabs = [
    { id: "VUE_DENSEMBLE", label: "Vue d'ensemble" },
    { id: "TEMPS_REEL", label: "Temps réel (Sentinelles)" },
    { id: "HISTORIQUE_RIVIERES", label: "Historique Rivières" },
    { id: "BARRAGES", label: "Barrages et lacs" },
    { id: "ALERTES_QA", label: "Alertes & QA" },
    { id: "PARAMETRES", label: "Paramètres" },
  ];

  return (
    <main className="h-screen flex flex-col bg-[#F8FAFC] text-slate-950 overflow-hidden">
      {/* Header global */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900">Qualité des Eaux</h1>
          <p className="text-sm text-slate-500">Piloter aujourd'hui, préserver demain</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-700 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            {dateRange.label}
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 flex gap-1 overflow-x-auto shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {activeTab === "VUE_DENSEMBLE" ? (
          <div className="shrink-0">
            <QualityGlobalFilters
              value={filters}
              onApply={setFilters}
              onReset={() => setFilters(DEFAULT_QUALITY_FILTERS)}
            />
          </div>
        ) : null}
        
        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "VUE_DENSEMBLE" && <QualityOverviewTab filters={filters} />}
          {activeTab === "TEMPS_REEL" && <QualityRealtimeTab filters={filters} />}
          {activeTab === "HISTORIQUE_RIVIERES" && <QualityHistoriqueTab filters={filters} />}
          {activeTab === "BARRAGES" && <QualityDamsTab filters={filters} />}
          {activeTab === "ALERTES_QA" && <QualityAlertsQATab filters={filters} />}
          {activeTab === "PARAMETRES" && <QualityParametersTab filters={filters} />}
        </div>
      </div>
    </main>
  );
}
