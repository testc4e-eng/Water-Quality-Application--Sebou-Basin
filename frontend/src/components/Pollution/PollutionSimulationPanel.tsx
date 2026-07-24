import { useState } from "react";
import { X } from "lucide-react";

import type { SimulatePropagationRequest } from "@/api/propagation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface PollutionSimulationPanelProps {
  lat: number;
  lon: number;
  onSimulate: (params: SimulatePropagationRequest) => void;
  onCancel: () => void;
}

const POLLUTANTS: { code: SimulatePropagationRequest["pollutant_type"]; label: string }[] = [
  { code: "Cd", label: "Cadmium" },
  { code: "Pb", label: "Plomb" },
  { code: "Hg", label: "Mercure" },
  { code: "Cr", label: "Chrome" },
  { code: "Hydrocarbures", label: "Hydrocarbures" },
  { code: "Autre", label: "Autre" },
];

export default function PollutionSimulationPanel({
  lat,
  lon,
  onSimulate,
  onCancel,
}: PollutionSimulationPanelProps) {
  const [pollutantType, setPollutantType] = useState<SimulatePropagationRequest["pollutant_type"]>("Cd");
  const [concentration, setConcentration] = useState<number>(5.0);
  const [vitesse, setVitesse] = useState<number[]>([10]);
  const [lambda, setLambda] = useState<number[]>([0.05]);
  const [duration, setDuration] = useState<number[]>([72]);

  const handleSimulate = () => {
    onSimulate({
      lat,
      lon,
      pollutant_type: pollutantType,
      initial_concentration_mg_l: concentration,
      timestamp: new Date().toISOString(),
      simulation_hours: duration[0],
      vitesse_reference_kmh: vitesse[0],
      lambda_1_per_h: lambda[0],
    });
  };

  return (
    <div className="absolute top-4 right-4 w-80 rounded-lg border border-slate-200 bg-white p-4 shadow-lg z-10">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Simulation de propagation</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-slate-500">Type de polluant</label>
          <Select value={pollutantType} onValueChange={(value) => setPollutantType(value as SimulatePropagationRequest["pollutant_type"])}>
            <SelectTrigger className="mt-1 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {POLLUTANTS.map((p) => (
                <SelectItem key={p.code} value={p.code}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-slate-500">Concentration initiale (mg/L)</label>
          <input
            type="number"
            min={0.001}
            step={0.1}
            value={concentration}
            onChange={(e) => setConcentration(parseFloat(e.target.value) || 0)}
            className="mt-1 w-full rounded-md border border-input px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs text-slate-500">Vitesse de référence</label>
            <span className="text-xs text-slate-400">{vitesse[0]} km/h</span>
          </div>
          <Slider
            min={1}
            max={50}
            step={1}
            value={vitesse}
            onValueChange={setVitesse}
            className="mt-2"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs text-slate-500">Atténuation λ (h⁻¹)</label>
            <span className="text-xs text-slate-400">{lambda[0].toFixed(2)} h⁻¹</span>
          </div>
          <Slider
            min={0}
            max={0.2}
            step={0.01}
            value={lambda}
            onValueChange={setLambda}
            className="mt-2"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs text-slate-500">Durée de simulation</label>
            <span className="text-xs text-slate-400">{duration[0]} h</span>
          </div>
          <Slider
            min={1}
            max={168}
            step={1}
            value={duration}
            onValueChange={setDuration}
            className="mt-2"
          />
        </div>

        <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-700">
          ⚠️ Modèle indicatif — ne remplace pas une étude hydrodynamique détaillée.
        </div>

        <Button onClick={handleSimulate} className="w-full">
          Lancer la simulation
        </Button>
      </div>
    </div>
  );
}
