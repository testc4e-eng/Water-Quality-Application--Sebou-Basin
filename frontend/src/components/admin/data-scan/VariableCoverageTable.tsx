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
import ColumnSelector, { ColumnOption } from "./ColumnSelector";
import { useEffect, useState } from "react";

type Props = {
  stats: VariableTimeStat[];
  displayLimit?: number;
};

const formatNumber = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "-";
  return Number(value).toLocaleString();
};

const formatDate = (value: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const formatStep = (value: number | null | undefined) => {
  if (!value || value === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
        -
      </span>
    );
  }
  const seconds = Number(value);
  if (seconds === 86400) return "1 jour";
  if (seconds > 86400) {
    const days = Math.round(seconds / 86400);
    return `${days.toLocaleString()} j`;
  }
  return seconds.toLocaleString();
};

const getVariableBadgeClass = (name: string) => {
  const key = name.toLowerCase();
  if (
    key.includes("ph") ||
    key.includes("conduct") ||
    key.includes("salin") ||
    key.includes("nitr") ||
    key.includes("chlor")
  ) {
    return "bg-[#EEEDFE] text-[#3C3489] border-[#AFA9EC]";
  }
  if (
    key.includes("temp") ||
    key.includes("debit") ||
    key.includes("niveau") ||
    key.includes("precip") ||
    key.includes("flow")
  ) {
    return "bg-teal-50 text-teal-700 border-teal-200";
  }
  return "text-slate-700 font-medium";
};

const columns: ColumnOption[] = [
  { key: "variable", label: "Variable", required: true },
  { key: "records", label: "Enregistrements" },
  { key: "entities", label: "Entit?s" },
  { key: "first", label: "Premier" },
  { key: "last", label: "Dernier" },
  { key: "minStep", label: "Pas min (s)" },
  { key: "medianStep", label: "Pas m?dian (s)" },
  { key: "maxStep", label: "Pas max (s)" },
];

const VariableCoverageTable = ({ stats, displayLimit }: Props) => {
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "variable",
    "records",
    "entities",
    "first",
    "last",
  ]);

  useEffect(() => {
    const required = columns.filter((c) => c.required).map((c) => c.key);
    setVisibleColumns((prev) => {
      const next = prev.filter((k) => columns.some((c) => c.key === k));
      const merged = [...new Set([...required, ...(next.length ? next : ["records", "entities", "first", "last"])])];
      return merged;
    });
  }, []);

  const visibleStats =
    displayLimit && stats?.length ? stats.slice(0, displayLimit) : stats;

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base font-semibold text-slate-700">
            Couverture temporelle par variable
          </CardTitle>
          <ColumnSelector
            options={columns}
            selectedKeys={visibleColumns}
            onChange={setVisibleColumns}
          />
        </div>
        <p className="text-sm text-slate-500">
          Disponible uniquement si l'option temporelle est activ?e.
        </p>
      </CardHeader>
      <CardContent>
        {visibleStats?.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[var(--color-background-secondary)]">
                  {visibleColumns.includes("variable") && (
                    <TableHead className="text-[11px] font-medium text-[var(--color-text-secondary)] lowercase">
                      variable
                    </TableHead>
                  )}
                  {visibleColumns.includes("records") && (
                    <TableHead className="text-[11px] font-medium text-[var(--color-text-secondary)] lowercase">
                      enregistrements
                    </TableHead>
                  )}
                  {visibleColumns.includes("entities") && (
                    <TableHead className="text-[11px] font-medium text-[var(--color-text-secondary)] lowercase">
                      entit?s
                    </TableHead>
                  )}
                  {visibleColumns.includes("first") && (
                    <TableHead className="text-[11px] font-medium text-[var(--color-text-secondary)] lowercase">
                      premier
                    </TableHead>
                  )}
                  {visibleColumns.includes("last") && (
                    <TableHead className="text-[11px] font-medium text-[var(--color-text-secondary)] lowercase">
                      dernier
                    </TableHead>
                  )}
                  {visibleColumns.includes("minStep") && (
                    <TableHead className="text-[11px] font-medium text-[var(--color-text-secondary)] lowercase">
                      pas min (s)
                    </TableHead>
                  )}
                  {visibleColumns.includes("medianStep") && (
                    <TableHead className="text-[11px] font-medium text-[var(--color-text-secondary)] lowercase">
                      pas m?dian (s)
                    </TableHead>
                  )}
                  {visibleColumns.includes("maxStep") && (
                    <TableHead className="text-[11px] font-medium text-[var(--color-text-secondary)] lowercase">
                      pas max (s)
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleStats.map((row, idx) => (
                  <TableRow
                    key={`${row.variable_id ?? row.variable_name}`}
                    className={idx % 2 === 1 ? "bg-[var(--color-background-secondary)]" : ""}
                  >
                    {visibleColumns.includes("variable") && (
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[12px] ${getVariableBadgeClass(
                            String(row.variable_name ?? row.variable_id ?? "")
                          )}`}
                        >
                          {row.variable_name ?? row.variable_id ?? "-"}
                        </span>
                      </TableCell>
                    )}
                    {visibleColumns.includes("records") && (
                      <TableCell>{formatNumber(row.record_count)}</TableCell>
                    )}
                    {visibleColumns.includes("entities") && (
                      <TableCell>{formatNumber(row.entity_count)}</TableCell>
                    )}
                    {visibleColumns.includes("first") && (
                      <TableCell>{formatDate(row.first_record)}</TableCell>
                    )}
                    {visibleColumns.includes("last") && (
                      <TableCell>{formatDate(row.last_record)}</TableCell>
                    )}
                    {visibleColumns.includes("minStep") && (
                      <TableCell>{formatStep(row.min_step_seconds)}</TableCell>
                    )}
                    {visibleColumns.includes("medianStep") && (
                      <TableCell>{formatStep(row.median_step_seconds)}</TableCell>
                    )}
                    {visibleColumns.includes("maxStep") && (
                      <TableCell>{formatStep(row.max_step_seconds)}</TableCell>
                    )}
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
