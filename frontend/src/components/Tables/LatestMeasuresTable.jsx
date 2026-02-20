// src/components/Tables/LatestMeasuresTable.jsx
import React, { useEffect, useState } from "react";
import api from "@/lib/api"; // ✅ utilise la même base Axios que TimeSeriesLinked.jsx

const toNum = (v) => (v === null || v === undefined ? null : Number(v));

export default function LatestMeasuresTable({ stationId, range }) {
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

    // ✅ Appel via Axios (baseURL = http://127.0.0.1:8000/api/v1)
    api
      .get(`/stations/${stationId}/measurements`, { params })
      .then((res) => {
        if (!alive) return;
        const data = Array.isArray(res.data) ? res.data : [];
        const last = data
          .slice(-10)
          .reverse()
          .map((r) => ({
            date: r.date || r.timestamp || r.ts,
            flow: toNum(r.flow ?? r.debit ?? r.q),
            no3: toNum(r.no3 ?? r.nitrates),
            p: toNum(r.p ?? r.phosphore),
            temp: toNum(r.temp ?? r.temperature),
          }));
        setRows(last);
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

  // --- UI ---
  if (!stationId)
    return (
      <div className="rounded-2xl border bg-white shadow-sm p-3 text-sm text-muted-foreground">
        Sélectionnez une station…
      </div>
    );
  if (loading)
    return (
      <div className="rounded-2xl border bg-white shadow-sm p-3 text-sm text-muted-foreground">
        Chargement…
      </div>
    );
  if (error)
    return (
      <div className="rounded-2xl border bg-white shadow-sm p-3 text-sm text-red-600">
        Erreur : {error}
      </div>
    );
  if (!rows.length)
    return (
      <div className="rounded-2xl border bg-white shadow-sm p-3 text-sm">
        Pas de données.
      </div>
    );

  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      <div className="bg-emerald-600 px-4 py-2 text-white">
        <div className="font-semibold">Dernières mesures</div>
        <div className="text-xs opacity-80">
          {new Date(rows.at(-1).date).toLocaleDateString("fr-FR")} —{" "}
          {new Date(rows[0].date).toLocaleDateString("fr-FR")}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-emerald-50 text-emerald-900">
              <th className="whitespace-nowrap px-3 py-2 text-left font-semibold">
                Date
              </th>
              <th className="whitespace-nowrap px-3 py-2 text-right font-semibold">
                Débit (m³/s)
              </th>
              <th className="whitespace-nowrap px-3 py-2 text-right font-semibold">
                NO₃ (mg/L)
              </th>
              <th className="whitespace-nowrap px-3 py-2 text-right font-semibold">
                P (mg/L)
              </th>
              <th className="whitespace-nowrap px-3 py-2 text-right font-semibold">
                Temp (°C)
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className={`${
                  i % 2 ? "bg-white" : "bg-emerald-50/40"
                } border-b last:border-b-0 hover:bg-emerald-50`}
              >
                <td className="px-3 py-2">
                  {new Date(r.date).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-3 py-2 text-right">{r.flow ?? "-"}</td>
                <td className="px-3 py-2 text-right">{r.no3 ?? "-"}</td>
                <td className="px-3 py-2 text-right">{r.p ?? "-"}</td>
                <td className="px-3 py-2 text-right">{r.temp ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
