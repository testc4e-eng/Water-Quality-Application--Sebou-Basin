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
import ColumnSelector, { ColumnOption } from "./ColumnSelector";
import { useEffect, useState } from "react";

type Props = {
  rows: StationTypeSummary[];
  displayLimit?: number;
};

const formatNumber = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "-";
  return Number(value).toLocaleString();
};

const columns: ColumnOption[] = [
  { key: "type", label: "Type", required: true },
  { key: "stations", label: "Stations" },
  { key: "variables", label: "Variables" },
  { key: "sources", label: "Sources" },
  { key: "records", label: "Enregistrements" },
  { key: "first", label: "Premier" },
  { key: "last", label: "Dernier" },
];

const StationsByTypeTable = ({ rows, displayLimit }: Props) => {
  const visibleRows =
    displayLimit && rows?.length ? rows.slice(0, displayLimit) : rows;
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "type",
    "stations",
    "variables",
    "records",
  ]);

  useEffect(() => {
    const required = columns.filter((c) => c.required).map((c) => c.key);
    setVisibleColumns((prev) => {
      const next = prev.filter((k) => columns.some((c) => c.key === k));
      const merged = [...new Set([...required, ...(next.length ? next : ["stations", "variables", "records"])])];
      return merged;
    });
  }, []);

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base font-semibold text-slate-700">
            Stations par type
          </CardTitle>
          <ColumnSelector
            options={columns}
            selectedKeys={visibleColumns}
            onChange={setVisibleColumns}
          />
        </div>
        <p className="text-sm text-slate-500">
          Agr?gation globale par type de station.
        </p>
      </CardHeader>
      <CardContent>
        {visibleRows?.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.includes("type") && <TableHead>Type</TableHead>}
                  {visibleColumns.includes("stations") && <TableHead>Stations</TableHead>}
                  {visibleColumns.includes("variables") && <TableHead>Variables</TableHead>}
                  {visibleColumns.includes("sources") && <TableHead>Sources</TableHead>}
                  {visibleColumns.includes("records") && <TableHead>Enregistrements</TableHead>}
                  {visibleColumns.includes("first") && <TableHead>Premier</TableHead>}
                  {visibleColumns.includes("last") && <TableHead>Dernier</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleRows.map((row) => (
                  <TableRow key={row.station_type}>
                    {visibleColumns.includes("type") && (
                      <TableCell>{row.station_type ?? "Inconnu"}</TableCell>
                    )}
                    {visibleColumns.includes("stations") && (
                      <TableCell>{formatNumber(row.station_count)}</TableCell>
                    )}
                    {visibleColumns.includes("variables") && (
                      <TableCell>{formatNumber(row.variable_count)}</TableCell>
                    )}
                    {visibleColumns.includes("sources") && (
                      <TableCell>{formatNumber(row.source_count)}</TableCell>
                    )}
                    {visibleColumns.includes("records") && (
                      <TableCell>{formatNumber(row.record_count)}</TableCell>
                    )}
                    {visibleColumns.includes("first") && (
                      <TableCell>{row.first_record ?? "-"}</TableCell>
                    )}
                    {visibleColumns.includes("last") && (
                      <TableCell>{row.last_record ?? "-"}</TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Aucune donn?e disponible.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StationsByTypeTable;
