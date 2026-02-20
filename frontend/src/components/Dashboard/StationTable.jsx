/* frontend/src/components/Dashboard/StationTable.jsx */
import React, { useMemo } from "react";
import { useStations } from "../../services/api.js";
import { useSelection } from "../../context/SelectionContext.jsx";

export default function StationTable() {
  const { data: stations, isLoading, error } = useStations();
  const { selectedStation, setSelectedStation } = useSelection();

  const rows = useMemo(() => stations || [], [stations]);

  return (
    <div
      className="card"
      style={{ padding: 12, height: 100 + 420 + 16, overflow: "auto" }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>
        Stations ({rows.length})
      </div>
      {isLoading && <div>Chargement…</div>}
      {error && <div style={{ color: "crimson" }}>Erreur: {String(error)}</div>}
      {!isLoading && !error && rows.length === 0 && (
        <div style={{ color: "#667085" }}>Aucune station.</div>
      )}

      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
      >
        <thead>
          <tr style={{ textAlign: "left", color: "#667085" }}>
            <th style={{ padding: "6px 4px" }}>#</th>
            <th style={{ padding: "6px 4px" }}>Nom</th>
            <th style={{ padding: "6px 4px" }}>Rivière</th>
            <th style={{ padding: "6px 4px" }}>Coord.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => {
            const isSel = s.id === selectedStation?.id;
            return (
              <tr
                key={s.id}
                onClick={() => setSelectedStation(s)}
                style={{
                  cursor: "pointer",
                  background: isSel ? "#eef2ff" : "transparent",
                }}
              >
                <td style={{ padding: "6px 4px" }}>{s.id}</td>
                <td style={{ padding: "6px 4px", fontWeight: 600 }}>
                  {s.name}
                </td>
                <td style={{ padding: "6px 4px" }}>{s.river || "—"}</td>
                <td style={{ padding: "6px 4px", color: "#667085" }}>
                  {s.coords
                    ? `${s.coords.lat.toFixed(3)}, ${s.coords.lon.toFixed(3)}`
                    : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
