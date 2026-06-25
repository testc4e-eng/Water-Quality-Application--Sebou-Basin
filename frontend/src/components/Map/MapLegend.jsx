import React from "react";

/**
 * @param {{
 *  classes?: Array<{min:number,max:number,color:string,label?:string}>,
 *  min?: number | null,
 *  max?: number | null,
 *  unit?: string,
 *  dataSource?: string,
 *  dateLabel?: string,
 *  thresholds?: Array<{label:string,color?:string}>
 * }} props
 */
export default function MapLegend({
  classes = [],
  min = null,
  max = null,
  unit = "",
  dataSource = "",
  dateLabel = "",
  thresholds = [],
}) {
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
      {(dataSource || dateLabel) && (
        <div style={{ display: "grid", gap: 3, marginBottom: 8, fontSize: 10, color: "#64748b" }}>
          {!!dataSource && <div><strong>Source:</strong> {dataSource}</div>}
          {!!dateLabel && <div><strong>Date:</strong> {dateLabel}</div>}
        </div>
      )}
      <div style={{ height: 10, borderRadius: 999, background: gradient, marginBottom: 6 }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
        <span>{min != null ? String(min) : "-"}</span>
        <span>{max != null ? String(max) : "-"}</span>
      </div>
      {!!unit && <div style={{ marginTop: 4, fontSize: 11, color: "#64748b" }}>Unité: {unit}</div>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
        {[
          ["VALID", "#ecfdf5", "#047857", "#a7f3d0"],
          ["FLAGGED", "#fffbeb", "#b45309", "#fde68a"],
          ["OUTLIER", "#fff1f2", "#be123c", "#fecdd3"],
          ["MISSING", "#f1f5f9", "#475569", "#cbd5e1"],
        ].map(([label, bg, color, border]) => (
          <span key={label} style={{ border: `1px solid ${border}`, background: bg, color, borderRadius: 999, padding: "2px 6px", fontSize: 9, fontWeight: 700 }}>
            {label}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 8 }}>
        <div style={{ marginBottom: 4, fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", color: "#64748b", textTransform: "uppercase" }}>
          Seuils
        </div>
        <div style={{ display: "grid", gap: 4 }}>
          {(thresholds.length ? thresholds : classes.slice(0, 5).map((c) => ({
            label: c.label || `${c.min ?? "-"} - ${c.max ?? "-"}`,
            color: c.color,
          }))).map((item, index) => (
            <div key={`${item.label}-${index}`} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#475569" }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: item.color || "#94a3b8", display: "inline-block" }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
