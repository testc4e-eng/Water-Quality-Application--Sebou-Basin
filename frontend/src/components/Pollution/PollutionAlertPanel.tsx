import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { PollutionAlert } from "@/api/pollutionCampagnes";

interface PollutionAlertPanelProps {
  alerts: PollutionAlert[];
  loading?: boolean;
  onSelect?: (prelevementId: string) => void;
}

export default function PollutionAlertPanel({ alerts, loading, onSelect }: PollutionAlertPanelProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-400">
        Chargement des alertes...
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <h3 className="text-sm font-semibold text-slate-900">Alertes pollution</h3>
        <Badge variant="outline" className="ml-auto text-[10px]">
          {alerts.length}
        </Badge>
      </div>

      <div className="max-h-56 overflow-auto p-2">
        {alerts.length === 0 ? (
          <p className="px-2 py-3 text-xs text-slate-400">Aucune alerte active.</p>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <button
                key={`${alert.prelevement_id}-${alert.parametre}`}
                type="button"
                onClick={() => onSelect?.(alert.prelevement_id)}
                className="w-full rounded-md border p-2 text-left text-xs transition-colors hover:bg-slate-50"
                style={{
                  borderColor: alert.alert_level === "CRITICAL" ? "#fecaca" : "#fde68a",
                  backgroundColor: alert.alert_level === "CRITICAL" ? "#fef2f2" : "#fffbeb",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{alert.parametre}</span>
                  <Badge
                    variant={alert.alert_level === "CRITICAL" ? "destructive" : "default"}
                    className="text-[10px]"
                  >
                    {alert.alert_level}
                  </Badge>
                </div>
                <div className="mt-1 text-slate-600">
                  {alert.valeur.toFixed(3)} {alert.unite || "mg/L"} {" > "} {alert.seuil} {alert.unite || "mg/L"}
                </div>
                <div className="mt-0.5 truncate text-slate-400">
                  {alert.station_nom} — {new Date(alert.date_prelevement).toLocaleDateString("fr-MA")}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
