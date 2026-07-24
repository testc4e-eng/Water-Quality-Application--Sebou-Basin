import { useEffect, useState } from "react";
import { Crosshair, Eraser, MapPin, TestTube2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DeclarationPoint } from "./declarationPoint.types";
import { formatDeclarationPointSource } from "./declarationPoint.types";
import { validateDeclarationPointCoordinates } from "./declarationPoint.validation";
import { NH4_MATRIX_DEMO_SCENARIOS } from "./declarationDemoScenarios";

interface DeclarationPointSelectorProps {
  declarationPoint: DeclarationPoint | null;
  onDeclarationPointChange: (point: DeclarationPoint | null) => void;
  isMapPickingActive: boolean;
  onStartMapPicking: () => void;
  onCancelMapPicking: () => void;
}


function toInputValue(value: number | null | undefined) {
  return typeof value === "number" ? String(value) : "";
}

export default function DeclarationPointSelector({
  declarationPoint,
  onDeclarationPointChange,
  isMapPickingActive,
  onStartMapPicking,
  onCancelMapPicking,
}: DeclarationPointSelectorProps) {
  const [longitude, setLongitude] = useState(toInputValue(declarationPoint?.longitude));
  const [latitude, setLatitude] = useState(toInputValue(declarationPoint?.latitude));
  const [errors, setErrors] = useState<{ longitude?: string; latitude?: string; general?: string }>({});

  useEffect(() => {
    setLongitude(toInputValue(declarationPoint?.longitude));
    setLatitude(toInputValue(declarationPoint?.latitude));
    setErrors({});
  }, [declarationPoint]);

  const handleValidateManualPoint = () => {
    const result = validateDeclarationPointCoordinates(longitude, latitude, "manual");
    setErrors({
      ...result.errors,
      general: !result.point && !result.errors.longitude && !result.errors.latitude
        ? "Selectionnez un point sur la carte ou renseignez ses coordonnees."
        : undefined,
    });
    if (!result.point) return;
    onDeclarationPointChange(result.point);
  };

  const handleClear = () => {
    setLongitude("");
    setLatitude("");
    setErrors({});
    onCancelMapPicking();
    onDeclarationPointChange(null);
  };

  const handlePreset = () => {
    onCancelMapPicking();
    onDeclarationPointChange(NH4_MATRIX_DEMO_SCENARIOS.sufficient.point);
  };

  const handleToggleMapPicking = () => {
    if (isMapPickingActive) {
      onCancelMapPicking();
      return;
    }
    onStartMapPicking();
  };

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
          <MapPin className="h-4 w-4 text-blue-700" />
          Point de detection
        </div>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Definissez le point observe. Le snapping et la validation topologique seront effectues plus tard par le backend.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="declaration-longitude">Longitude</Label>
          <Input
            id="declaration-longitude"
            inputMode="decimal"
            value={longitude}
            aria-invalid={Boolean(errors.longitude)}
            aria-describedby={errors.longitude ? "declaration-longitude-error" : undefined}
            onChange={(event) => setLongitude(event.target.value)}
            placeholder="-4.908418523493339"
          />
          {errors.longitude && (
            <p id="declaration-longitude-error" className="text-xs text-red-700">
              {errors.longitude}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="declaration-latitude">Latitude</Label>
          <Input
            id="declaration-latitude"
            inputMode="decimal"
            value={latitude}
            aria-invalid={Boolean(errors.latitude)}
            aria-describedby={errors.latitude ? "declaration-latitude-error" : undefined}
            onChange={(event) => setLatitude(event.target.value)}
            placeholder="34.16528818110318"
          />
          {errors.latitude && (
            <p id="declaration-latitude-error" className="text-xs text-red-700">
              {errors.latitude}
            </p>
          )}
        </div>
      </div>

      {errors.general && <p className="text-sm text-red-700">{errors.general}</p>}

      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={handleValidateManualPoint}>
          Valider le point
        </Button>
        <Button
          type="button"
          size="sm"
          variant={isMapPickingActive ? "default" : "outline"}
          aria-pressed={isMapPickingActive}
          onClick={handleToggleMapPicking}
        >
          <Crosshair className="mr-2 h-4 w-4" />
          {isMapPickingActive ? "Cliquez maintenant sur la carte" : "Pointer sur la carte"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={handlePreset}>
          <TestTube2 className="mr-2 h-4 w-4" />
          Charger le point source matrice
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={handleClear}>
          <Eraser className="mr-2 h-4 w-4" />
          Effacer
        </Button>
      </div>

      <div className="rounded-lg border border-sky-200 bg-sky-50 p-3 text-xs leading-5 text-sky-900">
        Point source matrice NH4 : point de depart de la pollution avant la station Dar El Arsa.
      </div>

      {declarationPoint ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          <div className="font-semibold text-slate-950">Point declare</div>
          <div className="mt-2 grid gap-1">
            <div>Longitude : {declarationPoint.longitude.toFixed(8)}</div>
            <div>Latitude : {declarationPoint.latitude.toFixed(8)}</div>
            <div>Origine : {formatDeclarationPointSource(declarationPoint.source)}</div>
            <div>Statut topologique : Non encore analyse</div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-500">
          Aucun point declare pour le moment.
        </div>
      )}
    </div>
  );
}




