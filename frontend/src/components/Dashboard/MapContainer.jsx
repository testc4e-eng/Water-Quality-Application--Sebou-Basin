/* frontend/src/components/Dashboard/MapContainer.jsx */
import React from "react";
import InteractiveMap from "../Map/InteractiveMap.jsx";
import { useStations } from "../../services/api.js";

export default function MapContainer() {
  const { data: stations, isLoading, error } = useStations();

  return (
    <div className="card" style={{ padding: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>
        Carte Interactive Bassin Versant
      </div>
      <div style={{ height: 420, borderRadius: 12, overflow: "hidden" }}>
        <InteractiveMap
          stations={stations || []}
          isLoading={isLoading}
          error={error}
        />
      </div>
      <div style={{ fontSize: 12, color: "#667085", marginTop: 6 }}>
        MapLibre
      </div>
    </div>
  );
}
