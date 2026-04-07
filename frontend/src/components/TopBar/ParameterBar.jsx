import React from "react";

export default function ParameterBar({range, setRange, sources, setSources, onApply}){
  return (
    <div className="card" style={{padding:10, display:"grid", gridTemplateColumns:"220px 220px 1fr auto", gap:10, alignItems:"center"}}>
      <div>
        <div style={{fontSize:12,color:"#667085"}}>Du</div>
        <input type="date" value={range.from} onChange={e=>setRange(r=>({...r, from:e.target.value}))} style={{width:"100%"}}/>
      </div>
      <div>
        <div style={{fontSize:12,color:"#667085"}}>Au</div>
        <input type="date" value={range.to} onChange={e=>setRange(r=>({...r, to:e.target.value}))} style={{width:"100%"}}/>
      </div>
      <div style={{display:"flex", gap:14, alignItems:"center"}}>
        <label style={{fontSize:14}}><input type="checkbox" checked={sources.swat} onChange={e=>setSources(s=>({...s, swat:e.target.checked}))}/> SWAT (Hydro)</label>
        <label style={{fontSize:14}}><input type="checkbox" checked={sources.wasp} onChange={e=>setSources(s=>({...s, wasp:e.target.checked}))}/> WASP (Qualité)</label>
        <label style={{fontSize:14}}><input type="checkbox" checked={sources.iot}  onChange={e=>setSources(s=>({...s, iot:e.target.checked}))}/> IoT (Temps réel)</label>
      </div>
      <button onClick={onApply} style={{padding:"8px 12px",border:"1px solid #e5e7eb",borderRadius:8}}>Appliquer filtres</button>
    </div>
  );
}
