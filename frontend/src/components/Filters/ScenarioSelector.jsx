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
        backgroundColor: "white",
        fontSize: "14px"
      }}
      defaultValue="actuel"
    >
      <option value="actuel">Actuel</option>
      {/* 
        Note: Structure remains extensible for future scenarios.
        Other scenarios (like climate projections) will be added here in the future.
      */}
    </select>
  );
}
