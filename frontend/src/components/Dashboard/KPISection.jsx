import React, { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

const IconShield = (p) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M9 12l2 2 4-4"/></svg>);
const IconBell = (p) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M6 8a6 6 0 1112 0c0 7 3 5 3 7H3c0-2 3 0 3-7"/><path d="M10 21a2 2 0 004 0"/></svg>);
const IconBadge = (p) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M9 12l2 2 4-4"/><path d="M12 2l2 2 3 1 2 2 1 3v4l-1 3-2 2-3 1-2 2-2-2-3-1-2-2-1-3V10l1-3 2-2 3-1 2-2z"/></svg>);
const IconPulse = (p) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M22 12h-4l-3 7-4-14-3 7H2"/></svg>);

function toNum(v) {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function normalizeRows(rows) {
  return (Array.isArray(rows) ? rows : [])
    .map((r) => ({
      date: r.date || r.ts || r.timestamp || null,
      flow: toNum(r.flow ?? r.debit ?? r.debit_m3s ?? r.q ?? r.debit_jr),
      temp: toNum(r.temp ?? r.temperature ?? r.temp_c ?? r.temperature_jr),
      no3: toNum(r.no3 ?? r.nitrates ?? r.no3_mgl),
      p: toNum(r.p ?? r.phosphore ?? r.p_mgl),
    }))
    .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
}

function Tile({ title, value, sub, color, Icon }) {
  const colors = {
    emerald: "from-emerald-500 to-emerald-600",
    sky: "from-sky-500 to-sky-600",
    amber: "from-amber-500 to-amber-600",
    violet: "from-violet-500 to-violet-600",
  }[color];
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${colors}`} />
      <div className="flex items-start gap-3 p-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${colors} text-white shadow`}>
          <Icon />
        </div>
        <div className="flex-1">
          <div className="text-sm text-slate-500">{title}</div>
          <div className="text-2xl font-semibold text-slate-900">{value}</div>
          {sub ? <div className="text-xs text-slate-500">{sub}</div> : null}
        </div>
      </div>
    </div>
  );
}

export default function KPISection({ stationId, range }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stationId) {
      setRows([]);
      return;
    }

    let alive = true;
    setLoading(true);
    const params = {};
    if (range?.dateFrom) params.from = range.dateFrom;
    if (range?.dateTo) params.to = range.dateTo;

    api
      .get(`/stations/${stationId}/measurements`, { params })
      .then((res) => {
        if (!alive) return;
        setRows(normalizeRows(res.data));
      })
      .catch(() => {
        if (!alive) return;
        setRows([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [stationId, range?.dateFrom, range?.dateTo]);

  const kpis = useMemo(() => {
    const valid = normalizeRows(rows);
    const latest = valid[valid.length - 1] || null;

    const indicators = [
      valid.some((r) => r.flow != null),
      valid.some((r) => r.temp != null),
      valid.some((r) => r.no3 != null),
      valid.some((r) => r.p != null),
    ];
    const activeSensors = indicators.filter(Boolean).length;

    const statusPerRow = valid.map((r) => {
      const checks = [];
      if (r.no3 != null) checks.push(r.no3 <= 50);
      if (r.p != null) checks.push(r.p <= 0.5);
      if (r.temp != null) checks.push(r.temp >= 5 && r.temp <= 30);
      if (checks.length === 0) return null;
      return checks.every(Boolean);
    }).filter((x) => x !== null);

    const compliance = statusPerRow.length
      ? Math.round((statusPerRow.filter(Boolean).length / statusPerRow.length) * 100)
      : 0;

    const quality10 = (compliance / 10).toFixed(1);

    const activeAlerts = latest
      ? [
          latest.no3 != null && latest.no3 > 50,
          latest.p != null && latest.p > 0.5,
          latest.temp != null && (latest.temp > 30 || latest.temp < 5),
        ].filter(Boolean).length
      : 0;

    return {
      quality: `${quality10}/10`,
      qualitySub: loading ? "Mise à jour..." : (latest?.date ? `Dernière mesure: ${new Date(latest.date).toLocaleDateString("fr-FR")}` : "Aucune donnée"),
      alerts: String(activeAlerts),
      compliance: `${compliance}%`,
      sensors: `${activeSensors}/4 actifs`,
    };
  }, [rows, loading]);

  if (!stationId) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile title="Qualité globale" value="—" sub="Sélectionnez une station" color="emerald" Icon={IconShield} />
        <Tile title="Alertes actives" value="—" color="sky" Icon={IconBell} />
        <Tile title="Conformité DCE" value="—" color="amber" Icon={IconBadge} />
        <Tile title="Capteurs actifs" value="—" color="violet" Icon={IconPulse} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Tile title="Qualité globale" value={kpis.quality} sub={kpis.qualitySub} color="emerald" Icon={IconShield} />
      <Tile title="Alertes actives" value={kpis.alerts} color="sky" Icon={IconBell} />
      <Tile title="Conformité DCE" value={kpis.compliance} color="amber" Icon={IconBadge} />
      <Tile title="Capteurs actifs" value={kpis.sensors} color="violet" Icon={IconPulse} />
    </div>
  );
}
