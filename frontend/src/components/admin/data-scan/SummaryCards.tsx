import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataScanSummary } from "@/services/dataScanService";
import {
  Database,
  Droplets,
  Layers,
  LineChart,
  MapPinned,
  Rss,
  Server,
} from "lucide-react";

type Props = {
  summary: DataScanSummary;
};

type SummaryMetricKey =
  | "total_stations"
  | "total_basins"
  | "total_variables"
  | "total_sources"
  | "total_records"
  | "stations_with_data"
  | "basins_with_data";

const summaryItems: Array<{
  key: SummaryMetricKey;
  label: string;
  icon: typeof MapPinned;
}> = [
  { key: "total_stations", label: "Stations", icon: MapPinned },
  { key: "total_basins", label: "Bassins", icon: Layers },
  { key: "total_variables", label: "Variables", icon: LineChart },
  { key: "total_sources", label: "Sources", icon: Rss },
  { key: "total_records", label: "Enregistrements", icon: Database },
  { key: "stations_with_data", label: "Stations avec données", icon: Droplets },
  { key: "basins_with_data", label: "Bassins avec données", icon: Server },
];

const SummaryCards = ({ summary }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {summaryItems.map(({ key, label, icon: Icon }) => (
        <Card key={key} className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-600">
              {label}
            </CardTitle>
            <Icon className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {summary[key] ?? 0}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;
