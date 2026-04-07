import SummaryCards from "./SummaryCards";
import AvailableTags from "./AvailableTags";
import VariableCoverageTable from "./VariableCoverageTable";
import StationsByTypeTable from "./StationsByTypeTable";
import EntityAccordion from "./EntityAccordion";
import EntityTable from "./EntityTable";
import { DataScanResponse } from "@/services/dataScanService";

type Props = {
  data: DataScanResponse;
};

const DataScanDashboard = ({ data }: Props) => {
  const stationEntities = data.station_entities ?? [];
  const basinEntities = data.basin_entities ?? [];

  return (
    <div className="space-y-10">
      <SummaryCards summary={data.summary} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AvailableTags
          title="Variables disponibles"
          description="Variables détectées dans les mesures stations et bassins."
          items={data.summary.available_variables}
          accent="blue"
        />
        <AvailableTags
          title="Sources disponibles"
          description="Sources détectées dans les mesures stations et bassins."
          items={data.summary.available_sources}
          accent="emerald"
        />
      </div>

      <VariableCoverageTable stats={data.summary.variable_time_stats ?? []} />

      <StationsByTypeTable rows={data.stations ?? []} />

      <EntityTable
        title="Bassins (détails base)"
        description="Toutes les colonnes disponibles dans public.bassin_sebou."
        rows={data.basins_full ?? []}
      />

      <EntityTable
        title="Barrages (détails base)"
        description="Toutes les colonnes disponibles dans public.barrages_abhs."
        rows={data.barrages_full ?? []}
        maxHeight="420px"
      />

      <EntityAccordion
        title="Détails par station"
        entities={stationEntities}
        entityLabel="station"
        typeLabel="Type de station"
      />

      <EntityAccordion
        title="Détails par bassin"
        entities={basinEntities}
        entityLabel="bassin"
        typeLabel="Groupe de bassin"
        typeKey="basin_group"
      />
    </div>
  );
};

export default DataScanDashboard;
