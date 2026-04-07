/* frontend/src/components/Filters/GeographicFilter.jsx */
import React from "react";
export default function GeographicFilter() {
  return (
    <div style={{ display: "grid", gap: 6, fontSize: 14 }}>
      <label>
        <input type="checkbox" defaultChecked /> Bassin Sebou
      </label>
    </div>
  );
}
