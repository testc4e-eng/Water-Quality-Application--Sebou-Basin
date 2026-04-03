import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VariableTimeStat } from "@/services/dataScanService";

type Props = {
  stats: VariableTimeStat[];
};

const formatNumber = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "-";
  return Number(value).toLocaleString();
};

const VariableCoverageTable = ({ stats }: Props) => {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-700">
          Couverture temporelle par variable
        </CardTitle>
        <p className="text-sm text-slate-500">
          Disponible uniquement si l'option temporelle est activée.
        </p>
      </CardHeader>
      <CardContent>
        {stats?.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variable</TableHead>
                  <TableHead>Enregistrements</TableHead>
                  <TableHead>Entités</TableHead>
                  <TableHead>Premier</TableHead>
                  <TableHead>Dernier</TableHead>
                  <TableHead>Pas min (s)</TableHead>
                  <TableHead>Pas médian (s)</TableHead>
                  <TableHead>Pas max (s)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((row) => (
                  <TableRow key={`${row.variable_id ?? row.variable_name}`}>
                    <TableCell>{row.variable_name ?? row.variable_id ?? "-"}</TableCell>
                    <TableCell>{formatNumber(row.record_count)}</TableCell>
                    <TableCell>{formatNumber(row.entity_count)}</TableCell>
                    <TableCell>{row.first_record ?? "-"}</TableCell>
                    <TableCell>{row.last_record ?? "-"}</TableCell>
                    <TableCell>{formatNumber(row.min_step_seconds)}</TableCell>
                    <TableCell>{formatNumber(row.median_step_seconds)}</TableCell>
                    <TableCell>{formatNumber(row.max_step_seconds)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Aucune statistique temporelle disponible.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default VariableCoverageTable;
