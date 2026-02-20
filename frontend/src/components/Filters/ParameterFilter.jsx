/* frontend/src/components/Filters/ParameterFilter.jsx */
import React from "react";
export default function ParameterFilter() {
  return (
    <div style={{ display: "grid", gap: 6, fontSize: 14 }}>
      <label>
        <input type="checkbox" defaultChecked /> Débit (Q)
      </label>
      <label>
        <input type="checkbox" defaultChecked /> Nitrates (NO₃)
      </label>
      <label>
        <input type="checkbox" defaultChecked /> Phosphore (P)
      </label>
      <label>
        <input type="checkbox" defaultChecked /> Température
      </label>
    </div>
  );
}
