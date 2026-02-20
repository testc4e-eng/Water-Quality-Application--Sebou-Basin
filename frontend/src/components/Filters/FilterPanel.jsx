/* frontend/src/components/Filters/FilterPanel.jsx */
import React from "react";
import DateRangePicker from "./DateRangePicker.jsx";
import GeographicFilter from "./GeographicFilter.jsx";
import ParameterFilter from "./ParameterFilter.jsx";
import ScenarioSelector from "./ScenarioSelector.jsx";

export default function FilterPanel() {
  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Période Temporelle</div>
      <DateRangePicker />
      <div style={{ height: 12 }} />
      <div style={{ fontWeight: 700, marginBottom: 8 }}>
        Zones Géographiques
      </div>
      <GeographicFilter />
      <div style={{ height: 12 }} />
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Paramètres Qualité</div>
      <ParameterFilter />
      <div style={{ height: 12 }} />
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Scénarios</div>
      <ScenarioSelector />
    </div>
  );
}
