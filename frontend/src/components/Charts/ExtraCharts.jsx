// src/components/Charts/ExtraCharts.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "@/lib/api"; // ✅ utilisation unifiée de l'instance Axios
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const toNum = (v) => (v === null || v === undefined ? null : Number(v));
const COLORS = ["#60a5fa", "#34d399", "#f59e0b", "#a78bfa", "#f472b6", "#10b981"];

export default function ExtraCharts({ stationId, range }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!stationId) return;
    let alive = true;
    setLoading(true);
    setError(null);

    const params = {};
    if (range?.dateFrom) params.from = range.dateFrom;
    if (range?.dateTo) params.to = range.dateTo;

    // ✅ même base API
    api
      .get(`/stations/${stationId}/measurements`, { params })
      .then((res) => {
        if (!alive) return;
        setRows(Array.isArray(res.data) ? res.data : []);
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

  const dataset = useMemo(
    () =>
      rows.map((r) => ({
        date: r.date,
        flow: toNum(r.flow),
        temp: toNum(r.temp),
        no3: toNum(r.no3),
        p: toNum(r.p),
      })),
    [rows]
  );

  const avg = (arr) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const means = {
    flow: avg(dataset.map((r) => r.flow).filter((v) => v != null)),
    temp: avg(dataset.map((r) => r.temp).filter((v) => v != null)),
    no3: avg(dataset.map((r) => r.no3).filter((v) => v != null)),
    p: avg(dataset.map((r) => r.p).filter((v) => v != null)),
  };

  const pieTemps = [
    { name: "< 15°C", value: dataset.filter((d) => d.temp < 15).length },
    { name: "15–20°C", value: dataset.filter((d) => d.temp >= 15 && d.temp <= 20).length },
    { name: "> 20°C", value: dataset.filter((d) => d.temp > 20).length },
  ];

  if (!stationId)
    return <div className="text-sm text-muted-foreground">Sélectionnez une station…</div>;
  if (loading) return <div className="text-sm text-muted-foreground">Chargement…</div>;
  if (error) return <div className="text-sm text-red-600">Erreur : {error}</div>;
  if (!rows.length) return <div className="text-sm">Pas de données pour cette période.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="card p-3">
        <div className="font-semibold mb-2">Répartition des températures</div>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={pieTemps}
              dataKey="value"
              nameKey="name"
              innerRadius="55%"
              outerRadius="80%"
            >
              {pieTemps.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 🔹 Exemple d’analyse complémentaire : Moyennes */}
      <div className="card p-3">
        <div className="font-semibold mb-2">Moyennes des paramètres</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={[means]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="flow" name="Débit (m³/s)" fill="#60a5fa" />
            <Bar dataKey="temp" name="Température (°C)" fill="#f59e0b" />
            <Bar dataKey="no3" name="NO₃ (mg/L)" fill="#34d399" />
            <Bar dataKey="p" name="P (mg/L)" fill="#a78bfa" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
