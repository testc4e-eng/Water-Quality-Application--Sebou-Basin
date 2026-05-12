import React from "react";
export default function MapTooltip({station}){
  if(!station) return null;

  const qaRaw = String(station.qa_status || station.qaStatus || station.qa_flag || station.qaFlag || "VALID").toUpperCase();
  const qaStatus = qaRaw.includes("OUTLIER")
    ? "OUTLIER"
    : qaRaw.includes("FLAG") || qaRaw.includes("WARN")
    ? "FLAGGED"
    : qaRaw.includes("MISS") || qaRaw.includes("NULL") || qaRaw.includes("NODATA")
    ? "MISSING"
    : "VALID";
  const qaClass = {
    VALID: "bg-emerald-50 text-emerald-700 border-emerald-200",
    FLAGGED: "bg-amber-50 text-amber-700 border-amber-200",
    OUTLIER: "bg-rose-50 text-rose-700 border-rose-200",
    MISSING: "bg-slate-100 text-slate-600 border-slate-200",
  }[qaStatus];
  const name = station.name || station.nom || station.station_name || station.label || "Entité sans nom";
  const type = station.type || station.layerType || station.station_type || station.category || "Observation";
  const code = station.code || station.station_code || station.ire_station || station.id || "—";
  const latestValue = station.latest_value ?? station.value ?? station.last_value ?? null;
  const unit = station.unit || station.unite || "";

  return (
    <div className="min-w-[220px] rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 shadow-xl">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{type}</div>
          <div className="text-sm font-bold text-slate-900">{name}</div>
        </div>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${qaClass}`}>
          {qaStatus}
        </span>
      </div>
      <div className="grid gap-1.5">
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">Code</span>
          <span className="font-semibold text-slate-800">{code}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-slate-500">Dernière valeur</span>
          <span className="font-semibold text-slate-800">
            {latestValue == null ? "—" : `${latestValue}${unit ? ` ${unit}` : ""}`}
          </span>
        </div>
        {station.river && (
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">Oued</span>
            <span className="font-semibold text-slate-800">{station.river}</span>
          </div>
        )}
        {station.coords && (
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">Coordonnées</span>
            <span className="font-mono text-[11px] text-slate-700">
              {station.coords.lat.toFixed(3)}, {station.coords.lon.toFixed(3)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
