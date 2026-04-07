// src/hooks/useKPIData.js
import { useAlerts, useStations } from "@/services/api.js";

export default function useKPIData() {
  const { data: alerts } = useAlerts();
  const { data: stations } = useStations();

  // Valeurs simples pour démarrer (tu pourras les calculer depuis l'API plus tard)
  const kpis = {
    score: 8.2,                      // Score global fictif
    delta: "+0.3 vs mois dernier",   // Variation
    alerts: alerts?.length || 0,     // Nombre d'alertes
    compliance: 94,                  // % DCE
    sensors: `${stations?.length || 0}/${stations?.length || 0} actifs`, // capteurs
  };

  return { kpis };
}
