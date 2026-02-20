import React, { useState } from "react";
import InteractiveMap from "./InteractiveMap.jsx";
import { useStations } from "../../services/api.js";
import StationStats from "./StationStats.jsx"; // ✅ nouveau composant

export default function StationMapPanel() {
  const { data: stations, isLoading, error } = useStations();
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="card" style={{ padding: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <div style={{ fontWeight: 700 }}>Carte des stations</div>
        <div style={{ fontSize: 12, color: "#667085" }}>
          Sélection : <b>{selectedId ?? "—"}</b>
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#667085" }}>
  Sélection : <b>{selectedId ?? "—"}</b><br/>
  <span style={{ fontSize: 11 }}>
    Code IRE : {stations?.find(s => s.id === selectedId)?.ire_station ?? "—"}
  </span>
</div>

      <div style={{ height: 420, borderRadius: 12, overflow: "hidden" }}>
        {isLoading && <div style={{ padding: 12 }}>Chargement…</div>}
        {error && <div style={{ padding: 12, color: "crimson" }}>Erreur: {String(error)}</div>}
        {!isLoading && !error && (
          <InteractiveMap
            stations={stations || []}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}
      </div>

      {/* ✅ Statistiques de la station sélectionnée */}
      <StationStats stationId={selectedId} />
    </div>
  );
}
