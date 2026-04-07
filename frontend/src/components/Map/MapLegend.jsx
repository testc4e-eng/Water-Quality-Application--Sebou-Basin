import React from "react";

/**
 * @param {{
 *  classes?: Array<{min:number,max:number,color:string,label?:string}>,
 *  min?: number | null,
 *  max?: number | null,
 *  unit?: string
 * }} props
 */
export default function MapLegend({ classes = [], min = null, max = null, unit = "" }) {
  if (!classes?.length && min == null && max == null) {
    return <div style={{ fontSize: 12, color: "#667085" }}>Aucune légende active</div>;
  }

  const gradient =
    classes?.length > 0
      ? `linear-gradient(90deg, ${classes.map((c) => c.color).join(",")})`
      : "linear-gradient(90deg,#dbeafe,#1e3a8a)";

  return (
    <div style={{ fontSize: 12, color: "#334155", minWidth: 180 }}>
      <div style={{ marginBottom: 6, fontWeight: 600 }}>Légende</div>
      <div style={{ height: 10, borderRadius: 999, background: gradient, marginBottom: 6 }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
        <span>{min != null ? String(min) : "-"}</span>
        <span>{max != null ? String(max) : "-"}</span>
      </div>
      {!!unit && <div style={{ marginTop: 4, fontSize: 11, color: "#64748b" }}>Unité: {unit}</div>}
    </div>
  );
}
