import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataScanSummary } from "@/services/dataScanService";
import {
  Database,
  Droplets,
  Layers,
  LineChart,
  MapPinned,
  Rss,
  Shapes,
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
  | "sub_basins";

const summaryItems: Array<{
  key: SummaryMetricKey;
  label: string;
  icon: typeof MapPinned;
}> = [
  { key: "total_stations", label: "Stations", icon: MapPinned },
  { key: "total_basins", label: "Bassins", icon: Layers },
  { key: "sub_basins", label: "Sous-bassins", icon: Shapes },
  { key: "total_variables", label: "Variables", icon: LineChart },
  { key: "total_sources", label: "Sources", icon: Rss },
  { key: "total_records", label: "Enregistrements", icon: Database },
  { key: "stations_with_data", label: "Stations avec données", icon: Droplets },
];

const SummaryCards = ({ summary }: Props) => {
  const summaryWithSubBasins = {
    ...summary,
    sub_basins: 15,
  } as DataScanSummary & { sub_basins: number };

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3 min-w-max xl:min-w-0 xl:flex-nowrap">
      {summaryItems.map(({ key, label, icon: Icon }) => (
        <Card
          key={key}
          className="border-slate-200 shadow-sm h-[80px] min-w-[170px] flex-1"
        >
          <CardContent className="h-full p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[20px] leading-tight font-bold text-slate-900">
                {(summaryWithSubBasins[key] ?? 0).toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {label}
              </span>
            </div>
            <Icon className="h-5 w-5 text-slate-400" />
          </CardContent>
        </Card>
      ))}
      </div>
    </div>
  );
};

export default SummaryCards;
