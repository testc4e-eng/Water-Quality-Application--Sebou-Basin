//frontend/src/components/Charts/MultiCharts.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, Cell,
  PieChart, Pie,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";

const toNum = (v) => (v === null || v === undefined ? null : Number(v));
const COLORS = ["#60a5fa", "#34d399", "#f59e0b", "#a78bfa", "#f472b6", "#10b981"];

export default function MultiCharts({ stationId, range }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (!stationId) return;
    let alive = true;
    setLoading(true);
    setError(null);

    const qs = new URLSearchParams();
    if (range?.dateFrom) qs.set("from", range.dateFrom);
    if (range?.dateTo)   qs.set("to",   range.dateTo);

   fetch(`/stations/${stationId}/measurements?` + qs.toString())

      .then(r => r.ok ? r.json() : Promise.reject(new Error(r.statusText)))
      .then(data => { if (alive) setRows(Array.isArray(data) ? data : []); })
      .catch(e => alive && setError(e?.message || "Erreur réseau"))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [stationId, range?.dateFrom, range?.dateTo]);

  // mapping champs
  const data = useMemo(() => rows.map(r => ({
    date: r.date || r.timestamp || r.ts,
    flow: toNum(r.flow ?? r.discharge_m3s ?? r.debit ?? r.debit_m3s ?? r.q),
    temp: toNum(r.temp ?? r.temperature_c ?? r.temperature),
    no3:  toNum(r.no3  ?? r.nitrates_mgL   ?? r.nitrates),
    p:    toNum(r.p    ?? r.phosphore_mgL  ?? r.phosphore),
  })), [rows]);

  // moyennes
  const avg = (arr) => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0;
  const means = useMemo(() => ({
    flow: avg(data.map(d=>d.flow).filter(v=>v!=null)),
    temp: avg(data.map(d=>d.temp).filter(v=>v!=null)),
    no3 : avg(data.map(d=>d.no3 ).filter(v=>v!=null)),
    p   : avg(data.map(d=>d.p   ).filter(v=>v!=null)),
  }), [data]);

  // donut temp
  const pieTemps = useMemo(() => {
    let a=0,b=0,c=0;
    data.forEach(d => {
      if (d.temp==null) return;
      if (d.temp<15) a++; else if (d.temp<=20) b++; else c++;
    });
    return [{name:"< 15°C", value:a},{name:"15–20°C", value:b},{name:"> 20°C", value:c}];
  }, [data]);

  // radar qualité
  const radarData = [
    { name: "Débit",   A: means.flow || 0 },
    { name: "Temp",    A: means.temp || 0 },
    { name: "NO₃",     A: means.no3  || 0 },
    { name: "P",       A: means.p    || 0 },
  ];

  if (!stationId) return <div className="text-sm text-muted-foreground">Sélectionnez une station…</div>;
  if (loading)    return <div className="text-sm text-muted-foreground">Chargement…</div>;
  if (error)      return <div className="text-sm text-red-600">Erreur : {error}</div>;
  if (!data.length) return <div className="text-sm">Pas de données pour cette période.</div>;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* 1. Aire (Débit + Temp) */}
      <div className="rounded-xl border bg-white p-3">
        <div className="font-semibold mb-2">Débit & Température (aire + ligne)</div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 10, right: 18, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="flow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.45}/>
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(v)=>new Date(v).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit"})}/>
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right"/>
            <Tooltip />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="flow" name="Débit (m³/s)" stroke="#60a5fa" fill="url(#flow)" />
            <Line yAxisId="right" type="monotone" dataKey="temp" name="Temp (°C)" stroke="#f59e0b" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 2. Barres (moyennes NO3 / P / Temp / Débit) */}
      <div className="rounded-xl border bg-white p-3">
        <div className="font-semibold mb-2">Moyennes sur la période</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={[
            { name:"Débit (m³/s)", value: means.flow },
            { name:"NO₃ (mg/L)",  value: means.no3  },
            { name:"P (mg/L)",    value: means.p    },
            { name:"Temp (°C)",   value: means.temp },
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name"/>
            <YAxis/>
            <Tooltip/>
            <Bar dataKey="value" name="Valeur">
              {COLORS.map((c,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Donut Température */}
      <div className="rounded-xl border bg-white p-3">
        <div className="font-semibold mb-2">Répartition des températures</div>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={pieTemps} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="85%" paddingAngle={2}>
              {pieTemps.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
            </Pie>
            <Tooltip/>
            <Legend/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 4. Radar synthétique */}
      <div className="rounded-xl border bg-white p-3">
        <div className="font-semibold mb-2">Radar des indicateurs moyens</div>
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis />
            <Radar name="Indice" dataKey="A" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.35} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
