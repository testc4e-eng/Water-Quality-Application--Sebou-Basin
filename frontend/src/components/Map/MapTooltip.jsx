import React from "react";
export default function MapTooltip({station}){
  if(!station) return null;
  return (
    <div>
      <b>{station.name}</b><br/>
      {station.river || ""}<br/>
      {station.coords ? `${station.coords.lat.toFixed(3)}, ${station.coords.lon.toFixed(3)}` : "—"}
    </div>
  );
}
