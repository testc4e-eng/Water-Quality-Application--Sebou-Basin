import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StationTypeSummary } from "@/services/dataScanService";

type Props = {
  rows: StationTypeSummary[];
};

const formatNumber = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "-";
  return Number(value).toLocaleString();
};

const StationsByTypeTable = ({ rows }: Props) => {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-700">
          Stations par type
        </CardTitle>
        <p className="text-sm text-slate-500">
          Agrégation globale par type de station.
        </p>
      </CardHeader>
      <CardContent>
        {rows?.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Stations</TableHead>
                  <TableHead>Variables</TableHead>
                  <TableHead>Sources</TableHead>
                  <TableHead>Enregistrements</TableHead>
                  <TableHead>Premier</TableHead>
                  <TableHead>Dernier</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.station_type}>
                    <TableCell>{row.station_type ?? "Inconnu"}</TableCell>
                    <TableCell>{formatNumber(row.station_count)}</TableCell>
                    <TableCell>{formatNumber(row.variable_count)}</TableCell>
                    <TableCell>{formatNumber(row.source_count)}</TableCell>
                    <TableCell>{formatNumber(row.record_count)}</TableCell>
                    <TableCell>{row.first_record ?? "-"}</TableCell>
                    <TableCell>{row.last_record ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Aucune donnée disponible.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StationsByTypeTable;
