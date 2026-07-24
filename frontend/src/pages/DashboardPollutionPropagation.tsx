import { useState } from "react";

import type { SimulatePropagationRequest, SimulatePropagationResponse } from "@/api/propagation";
import { simulatePropagation } from "@/api/propagation";
import PageHeader from "@/components/Layout/PageHeader";
import PollutionPropagationResults from "@/components/Pollution/PollutionPropagationResults";
import PollutionSignalMap from "@/components/Pollution/PollutionSignalMap";
import PollutionSimulationPanel from "@/components/Pollution/PollutionSimulationPanel";

export default function DashboardPollutionPropagation() {
  const [signalPoint, setSignalPoint] = useState<{ lat: number; lon: number } | null>(null);
  const [results, setResults] = useState<SimulatePropagationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignal = (lat: number, lon: number) => {
    setSignalPoint({ lat, lon });
    setResults(null);
    setError(null);
  };

  const handleSimulate = async (params: SimulatePropagationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const data = await simulatePropagation(params);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la simulation");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResults(null);
    setSignalPoint(null);
    setError(null);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      <PageHeader
        title="Simulation de propagation de pollution"
        subtitle="Signalisation interactive et propagation topologique simplifiée"
      />
      <div className="relative flex flex-1 overflow-hidden p-4">
        <PollutionSignalMap
          onSignal={handleSignal}
          signalPoint={signalPoint}
          propagationPath={results?.path}
        />

        {signalPoint && !results && (
          <PollutionSimulationPanel
            lat={signalPoint.lat}
            lon={signalPoint.lon}
            onSimulate={handleSimulate}
            onCancel={() => {
              setSignalPoint(null);
              setError(null);
            }}
          />
        )}

        {results && <PollutionPropagationResults results={results} onClose={handleClose} />}

        {loading && (
          <div className="absolute inset-0 z-20 grid place-items-center bg-white/60">
            <div className="rounded-lg bg-white px-4 py-3 text-sm font-medium shadow">
              Simulation en cours...
            </div>
          </div>
        )}

        {error && (
          <div className="absolute bottom-6 left-6 right-6 z-20 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
