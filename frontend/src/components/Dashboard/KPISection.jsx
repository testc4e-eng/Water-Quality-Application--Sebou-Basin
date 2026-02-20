//frontend/src/components/Dashboard/KPISection.jsx
import React from "react";

/* Icônes SVG inline */
const IconShield = (p) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M9 12l2 2 4-4"/></svg>);
const IconBell   = (p) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M6 8a6 6 0 1112 0c0 7 3 5 3 7H3c0-2 3 0 3-7"/><path d="M10 21a2 2 0 004 0"/></svg>);
const IconBadge  = (p) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M9 12l2 2 4-4"/><path d="M12 2l2 2 3 1 2 2 1 3v4l-1 3-2 2-3 1-2 2-2-2-3-1-2-2-1-3V10l1-3 2-2 3-1 2-2z"/></svg>);
const IconPulse  = (p) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M22 12h-4l-3 7-4-14-3 7H2"/></svg>);

function Tile({ title, value, sub, color, Icon }) {
  const colors = {
    emerald: "from-emerald-500 to-emerald-600",
    sky:     "from-sky-500 to-sky-600",
    amber:   "from-amber-500 to-amber-600",
    violet:  "from-violet-500 to-violet-600",
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

export default function KPISection() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Tile title="Qualité globale" value="8.2/10" sub="+0.3 vs mois dernier" color="emerald" Icon={IconShield}/>
      <Tile title="Alertes actives" value="2" color="sky" Icon={IconBell}/>
      <Tile title="Conformité DCE" value="94%" color="amber" Icon={IconBadge}/>
      <Tile title="Capteurs actifs" value="2/2 actifs" color="violet" Icon={IconPulse}/>
    </div>
  );
}
