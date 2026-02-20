// frontend/src/components/Charts/TimeSeriesLinked.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function toNum(v) {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function TimeSeriesLinked({ stationId, range }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Fetch ---
  useEffect(() => {
    if (!stationId) return;
    let alive = true;
    setLoading(true);
    setError(null);

    const params = {};
    if (range?.dateFrom) params.from = range.dateFrom;
    if (range?.dateTo) params.to = range.dateTo;

    api
      .get(`/stations/${stationId}/measurements`, { params })
      .then((res) => {
        if (!alive) return;
        const data = Array.isArray(res.data) ? res.data : [];
        setRows(data);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Erreur réseau");
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [stationId, range?.dateFrom, range?.dateTo]);

  const data = useMemo(() => {
    const arr = rows.map((r) => {
      const date = r.date || r.timestamp || r.ts;
      return {
        date,
        flow: toNum(r.flow ?? r.debit ?? r.q),
        temp: toNum(r.temp ?? r.temperature),
        no3: toNum(r.no3 ?? r.nitrates),
        p: toNum(r.p ?? r.phosphore),
      };
    });
    return arr.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [rows]);

  if (!stationId)
    return <div className="text-sm text-muted-foreground">Sélectionnez une station…</div>;
  if (loading)
    return <div className="text-sm text-muted-foreground">Chargement…</div>;
  if (error)
    return <div className="text-sm text-red-600">Erreur : {error}</div>;
  if (!data.length)
    return <div className="text-sm">Pas de données pour cette période.</div>;

  const dateFmt = (d) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });

  return (
    <div className="w-full" style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 18, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={dateFmt} minTickGap={16} />
          <YAxis yAxisId="left" domain={["auto", "auto"]} tickCount={6} />
          <YAxis yAxisId="right" orientation="right" domain={["auto", "auto"]} tickCount={6} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="flow" name="Débit (m³/s)" stroke="#2563eb" dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="temp" name="Temp (°C)" stroke="#f97316" dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="no3" name="NO₃ (mg/L)" stroke="#22c55e" dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="p" name="P (mg/L)" stroke="#9333ea" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
