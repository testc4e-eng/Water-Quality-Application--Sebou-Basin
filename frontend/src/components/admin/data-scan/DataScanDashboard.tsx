import SummaryCards from "./SummaryCards";
import AvailableTags from "./AvailableTags";
import VariableCoverageTable from "./VariableCoverageTable";
import StationsByTypeTable from "./StationsByTypeTable";
import EntityAccordion from "./EntityAccordion";
import EntityTable from "./EntityTable";
import { DataScanResponse } from "@/services/dataScanService";
import { useMemo, useState } from "react";

type Props = {
  data: DataScanResponse;
};

type SectionKey =
  | "variables"
  | "sources"
  | "coverage"
  | "stationsByType"
  | "basinsFull"
  | "barragesFull"
  | "stationDetails"
  | "basinDetails";

const DataScanDashboard = ({ data }: Props) => {
  const stationEntities = data.station_entities ?? [];
  const basinEntities =
    data.basin_entities && data.basin_entities.length > 0
      ? data.basin_entities
      : (data.basins_full ?? []).map((row: Record<string, unknown>) => {
          const basinId =
            (row as any).basin_id ?? (row as any).id ?? (row as any).gid ?? "n/a";
          const basinName =
            (row as any).basin_name ??
            (row as any).name ??
            (row as any).nom ??
            "Bassin";
          return {
            basin_id: basinId,
            basin_name: String(basinName),
            basin_group: (row as any).basin_group ?? null,
            total_records: 0,
            variable_count: 0,
            source_count: 0,
            first_record: null,
            last_record: null,
            variables: [],
          };
        });

  const sections = useMemo(
    () => [
      { key: "variables", label: "Variables disponibles" },
      { key: "sources", label: "Sources disponibles" },
      { key: "coverage", label: "Couverture temporelle par variable" },
      { key: "stationsByType", label: "Stations par type" },
      { key: "basinsFull", label: "Bassins (détails base)" },
      { key: "barragesFull", label: "Barrages (détails base)" },
      { key: "stationDetails", label: "Détails par station" },
      { key: "basinDetails", label: "Détails par bassin" },
    ],
    []
  );

  const [activeSection, setActiveSection] = useState<SectionKey>("sources");
  const [lotBySection, setLotBySection] = useState<Record<SectionKey, number>>({
    variables: 20,
    sources: 20,
    coverage: 20,
    stationsByType: 20,
    basinsFull: 20,
    barragesFull: 20,
    stationDetails: 20,
    basinDetails: 20,
  });

  const updateLot = (key: SectionKey, value: number) => {
    setLotBySection((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-10">
      <SummaryCards summary={data.summary} />

      <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key as SectionKey)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeSection === section.key
                  ? "bg-blue-600 text-white shadow"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-700">
          {sections.find((s) => s.key === activeSection)?.label}
        </h3>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>LOT</span>
          <select
            value={lotBySection[activeSection]}
            onChange={(e) => updateLot(activeSection, Number(e.target.value))}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
          >
            {[10, 20, 50, 100].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeSection === "variables" && (
        <AvailableTags
          title="Variables disponibles"
          description="Variables détectées dans les mesures stations et bassins."
          items={data.summary.available_variables}
          accent="blue"
          displayLimit={lotBySection.variables}
        />
      )}

      {activeSection === "sources" && (
        <AvailableTags
          title="Sources disponibles"
          description="Sources détectées dans les mesures stations et bassins."
          items={data.summary.available_sources}
          accent="emerald"
          displayLimit={lotBySection.sources}
        />
      )}

      {activeSection === "coverage" && (
        <VariableCoverageTable
          stats={data.summary.variable_time_stats ?? []}
          displayLimit={lotBySection.coverage}
        />
      )}

      {activeSection === "stationsByType" && (
        <StationsByTypeTable
          rows={data.stations ?? []}
          displayLimit={lotBySection.stationsByType}
        />
      )}

      {activeSection === "basinsFull" && (
        <EntityTable
          title="Bassins (détails base)"
          description="Toutes les colonnes disponibles dans public.bassin_sebou."
          rows={data.basins_full ?? []}
          displayLimit={lotBySection.basinsFull}
        />
      )}

      {activeSection === "barragesFull" && (
        <EntityTable
          title="Barrages (détails base)"
          description="Toutes les colonnes disponibles dans public.barrages_abhs."
          rows={data.barrages_full ?? []}
          maxHeight="420px"
          displayLimit={lotBySection.barragesFull}
        />
      )}

      {activeSection === "stationDetails" && (
        <EntityAccordion
          title="Détails par station"
          entities={stationEntities}
          entityLabel="station"
          typeLabel="Type de station"
          displayLimit={lotBySection.stationDetails}
        />
      )}

      {activeSection === "basinDetails" && (
        <EntityAccordion
          title="Détails par bassin"
          entities={basinEntities}
          entityLabel="bassin"
          typeLabel="Groupe de bassin"
          typeKey="basin_group"
          displayLimit={lotBySection.basinDetails}
        />
      )}
    </div>
  );
};

export default DataScanDashboard;
