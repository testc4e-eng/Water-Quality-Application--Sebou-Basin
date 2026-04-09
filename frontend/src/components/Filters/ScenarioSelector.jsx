/* frontend/src/components/Filters/ScenarioSelector.jsx */
import React from "react";
export default function ScenarioSelector() {
  return (
    <select
      style={{
        width: "100%",
        padding: 8,
        borderRadius: 8,
        border: "1px solid #e5e7eb",
      }}
    >
      <option>Situation actuelle</option>
      <option>Crue modérée</option>
      <option>Pollution nitrates</option>
    </select>
  );
}
