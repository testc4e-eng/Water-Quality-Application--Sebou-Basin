/* frontend/src/components/Filters/DateRangePicker.jsx */
import React from "react";
export default function DateRangePicker() {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <input type="date" defaultValue="2025-07-15" />
      <input type="date" defaultValue="2025-08-15" />
      <label style={{ fontSize: 12, color: "#667085" }}>
        <input type="checkbox" defaultChecked /> Dernier mois
      </label>
    </div>
  );
}
