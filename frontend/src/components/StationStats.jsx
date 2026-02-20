import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function StationStats({ stationId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stationId) return;
    setLoading(true);

    fetch(`/stations/${stationId}/measurements?days=30`)

      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [stationId]);

  if (!stationId)
    return (
      <div style={{ padding: 12, color: "#667085" }}>
        Cliquez sur une station pour afficher ses statistiques.
      </div>
    );

  if (loading)
    return (
      <div style={{ padding: 12, color: "#0ea5e9" }}>
        Chargement des données de la station...
      </div>
    );

  if (data.length === 0)
    return (
      <div style={{ padding: 12, color: "crimson" }}>
        Aucune donnée trouvée pour cette station.
      </div>
    );

  return (
    <div style={{ padding: 12 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
        Statistiques de la station #{stationId}
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="flow" stroke="#1d4ed8" name="Débit (m³/s)" />
          <Line type="monotone" dataKey="temp" stroke="#f97316" name="Température (°C)" />
          <Line type="monotone" dataKey="no3" stroke="#22c55e" name="Nitrates (mg/L)" />
          <Line type="monotone" dataKey="p" stroke="#dc2626" name="Phosphore (mg/L)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
