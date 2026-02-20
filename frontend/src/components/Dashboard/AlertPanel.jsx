/* frontend/src/components/Dashboard/AlertPanel.jsx */
import React, { useEffect, useState } from "react";
import { api } from "@/api/client"; // ✅ bon import (export nommé), baseURL = /api/v1

export default function AlertPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // baseURL = http://127.0.0.1:8000/api/v1 => on appelle juste "/alerts"
        const res = await api.get("/alerts");
        if (!alive) return;
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (!alive) return;
        // message réseau + 404/500
        const msg = e?.response?.data?.detail || e?.message || "Erreur réseau";
        setError(msg);
      } finally {
        alive && setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <div className="card p-3">Chargement des alertes…</div>;
  if (error)
    return <div className="card p-3 text-red-600">Erreur : {error}</div>;
  if (!items.length) return <div className="card p-3">Aucune alerte</div>;

  return (
    <div className="card p-3 space-y-3">
      {items.map((a) => (
        <div key={a.id} className="rounded-md border p-3">
          <div className="font-semibold">
            {(a.stationName || a.station || a.station_id) + ""} — {a.type}
          </div>
          <div className="text-xs text-muted-foreground">
            {a.date ? new Date(a.date).toLocaleString() : "—"}
          </div>
          <div className="text-sm">{a.message || "—"}</div>
        </div>
      ))}
    </div>
  );
}
