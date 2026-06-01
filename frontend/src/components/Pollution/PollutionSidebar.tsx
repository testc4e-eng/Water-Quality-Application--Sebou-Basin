import { useState } from 'react';
import { POLLUTION_CATEGORIES, StationInfo } from '../../mocks/pollutionSimulationData';
import { Clock, AlertOctagon, Activity, Droplets, ArrowRightCircle, CheckCircle2, RotateCcw } from 'lucide-react';

interface SimulationResult {
  station: StationInfo;
  distanceFromPollution: number;
  hoursToReach: number;
  estimatedArrivalTime: Date;
}

interface PollutionSidebarProps {
  selectedLocation: [number, number] | null;
  onSimulate: (categoryId: string, declarationTime: Date) => void;
  simulationResults: any | null;
  onReset: () => void;
  qaMode: boolean;
  setQaMode: (v: boolean) => void;
}

export default function PollutionSidebar({ selectedLocation, onSimulate, simulationResults, onReset, qaMode, setQaMode }: PollutionSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState(POLLUTION_CATEGORIES[0].id);
  const [declarationDate, setDeclarationDate] = useState(new Date().toISOString().slice(0, 16));

  const handleSimulate = () => {
    if (!selectedLocation) return;
    onSimulate(selectedCategory, new Date(declarationDate));
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 w-full overflow-y-auto">
      <div className="p-6 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <AlertOctagon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Gestion des Pollutions</h2>
              <p className="text-sm text-slate-500">Déclaration et propagation</p>
            </div>
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={qaMode} onChange={(e) => setQaMode(e.target.checked)} />
              <div className={`block w-10 h-6 rounded-full transition ${qaMode ? 'bg-purple-500' : 'bg-slate-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${qaMode ? 'translate-x-4' : ''}`}></div>
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">QA Mode</span>
          </label>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-8">
        {/* Formulaire de déclaration */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">1. Déclaration de l'incident</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Localisation</label>
              <div className={`p-3 rounded-xl border ${selectedLocation ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-500'} flex items-center gap-2 text-sm`}>
                {selectedLocation ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Point défini ({selectedLocation[0].toFixed(3)}, {selectedLocation[1].toFixed(3)})</span>
                  </>
                ) : (
                  <>
                    <Activity size={16} />
                    <span>En attente de sélection sur la carte...</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nature du polluant</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none"
              >
                {POLLUTION_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date et heure du constat</label>
              <div className="relative">
                <input 
                  type="datetime-local" 
                  value={declarationDate}
                  onChange={(e) => setDeclarationDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none"
                />
                <Clock className="absolute left-3 top-2.5 text-slate-400" size={16} />
              </div>
            </div>

            <button
              onClick={handleSimulate}
              disabled={!selectedLocation || simulationResults !== null}
              className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
                !selectedLocation || simulationResults !== null
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
              }`}
            >
              Lancer la simulation
              <ArrowRightCircle size={18} />
            </button>
          </div>
        </section>

        {/* Résultats API */}
        {simulationResults && (
          <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {(simulationResults.status === "partial" || simulationResults.status === "partial_direction_issue") && (
              <div className="bg-orange-50 border border-orange-200 text-orange-800 text-xs p-3 rounded-xl flex flex-col gap-1 shadow-sm">
                <span className="font-bold uppercase tracking-wider flex items-center gap-1"><AlertOctagon size={14}/> Attention Topologique</span>
                <span>{simulationResults.message}</span>
              </div>
            )}
            
            {/* Badge Démonstration */}
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl flex flex-col gap-1 shadow-sm">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1"><AlertOctagon size={14}/> Mode Démonstration</span>
              <span>Routage topologique visuel vers barrage. Données de temps fictives. Longueur : <b>{simulationResults.path_length_km || 0} km</b>.</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 text-slate-700 text-xs p-3 rounded-xl flex flex-col gap-2 shadow-sm">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1"><Activity size={14}/> Contrat runtime</span>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-100 text-blue-700 px-2 py-1 font-semibold">Routage topologique visuel</span>
                {simulationResults.direction_validated === false && (
                  <span className="rounded-full bg-orange-100 text-orange-700 px-2 py-1 font-semibold">Direction hydraulique non validée</span>
                )}
                {simulationResults.used_fallback && (
                  <span className="rounded-full bg-red-100 text-red-700 px-2 py-1 font-semibold">Fallback non orienté utilisé</span>
                )}
              </div>
              {simulationResults.topology_status && (
                <span className="text-slate-500">{simulationResults.topology_status}</span>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">2. Synthèse & Impacts</h3>
              <button onClick={onReset} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium">
                <RotateCcw size={12} />
                Reset
              </button>
            </div>

            {/* Metrics Mockées */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500 mb-1">ETA Moyen</div>
                <div className="font-bold text-slate-800">{simulationResults.mock_metrics?.eta_hours || "N/A"}</div>
              </div>
              <div className="bg-red-50 p-3 rounded-xl border border-red-200">
                <div className="text-xs text-red-600 mb-1">Score de Risque</div>
                <div className="font-bold text-red-700">{simulationResults.mock_metrics?.risk_score || "N/A"}</div>
              </div>
            </div>

            {!simulationResults.enrichedStations || simulationResults.enrichedStations.length === 0 ? (
              <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm border border-emerald-100">
                Fin de calcul sans impact localisé précis.
              </div>
            ) : (
              <div className="space-y-3">
                {simulationResults.enrichedStations.map((station: any, idx: number) => (
                  <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      station.type === 'hydro' ? 'bg-blue-500' :
                      station.type === 'dam' ? 'bg-slate-700' : 'bg-red-500'
                    }`} />
                    
                    <div className="flex justify-between items-start mb-2 pl-2">
                      <div className="font-semibold text-slate-900 text-sm">{station.name}</div>
                      <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Impacté
                      </div>
                    </div>
                    
                    <div className="pl-2 flex items-center gap-2 text-sm text-slate-600 mb-3">
                      <Clock size={14} className="text-orange-500" />
                      <span>ETA approximatif : <strong className="text-slate-900">{simulationResults.mock_metrics?.eta_hours}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
