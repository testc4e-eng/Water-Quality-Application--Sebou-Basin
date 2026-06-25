import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { QualiteExposureRecord } from "@/types/qualite";

type SortKey = "date_mesure" | "code_parametre" | "valeur_num" | "support_nom" | "qa_status";
type SortDirection = "asc" | "desc";

interface MetauxTableProps {
  rows: QualiteExposureRecord[];
  loading?: boolean;
  limit: number;
  offset: number;
  totalCount: number;
  hasMore?: boolean;
  onPageChange: (offset: number) => void;
}

function formatDate(value: string | null): string {
  if (!value) return "-";
  return new Intl.DateTimeFormat("fr-MA").format(new Date(value));
}

function formatValue(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 4 }).format(value);
}

function qaVariant(status: string | null): "default" | "secondary" | "destructive" | "outline" {
  if (!status) return "outline";
  const normalized = status.toUpperCase();
  if (normalized.includes("OK") || normalized.includes("VALID")) return "default";
  if (normalized.includes("WARN") || normalized.includes("SOURCE_GAP")) return "secondary";
  if (normalized.includes("ERROR") || normalized.includes("INVALID")) return "destructive";
  return "outline";
}

export default function MetauxTable({
  rows,
  loading = false,
  limit,
  offset,
  totalCount,
  hasMore,
  onPageChange,
}: MetauxTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("date_mesure");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      const result = aValue > bValue ? 1 : -1;
      return sortDirection === "asc" ? result : -result;
    });
  }, [rows, sortDirection, sortKey]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection(key === "date_mesure" ? "desc" : "asc");
  };

  const canGoPrevious = offset > 0;
  const canGoNext = hasMore ?? offset + rows.length < totalCount;

  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <button className="font-medium" type="button" onClick={() => toggleSort("date_mesure")}>
                Date
              </button>
            </TableHead>
            <TableHead>
              <button className="font-medium" type="button" onClick={() => toggleSort("code_parametre")}>
                Paramètre
              </button>
            </TableHead>
            <TableHead className="text-right">
              <button className="font-medium" type="button" onClick={() => toggleSort("valeur_num")}>
                Valeur
              </button>
            </TableHead>
            <TableHead>Unité</TableHead>
            <TableHead>
              <button className="font-medium" type="button" onClick={() => toggleSort("support_nom")}>
                Support
              </button>
            </TableHead>
            <TableHead>
              <button className="font-medium" type="button" onClick={() => toggleSort("qa_status")}>
                QA
              </button>
            </TableHead>
            <TableHead>Source</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell className="py-10 text-center text-muted-foreground" colSpan={7}>
                Chargement des métaux...
              </TableCell>
            </TableRow>
          ) : sortedRows.length === 0 ? (
            <TableRow>
              <TableCell className="py-10 text-center text-muted-foreground" colSpan={7}>
                Aucune donnée métal pour les filtres sélectionnés.
              </TableCell>
            </TableRow>
          ) : (
            sortedRows.map((row, index) => (
              <TableRow key={`${row.source_table}-${row.source_row_id ?? index}-${row.code_parametre}`}>
                <TableCell className="whitespace-nowrap">{formatDate(row.date_mesure)}</TableCell>
                <TableCell>
                  <div className="font-medium">{row.code_parametre}</div>
                  <div className="text-xs text-muted-foreground">{row.libelle_parametre ?? "-"}</div>
                </TableCell>
                <TableCell className="text-right tabular-nums">{formatValue(row.valeur_num)}</TableCell>
                <TableCell>{row.unite_reference ?? "-"}</TableCell>
                <TableCell>
                  <div>{row.support_nom ?? row.support_id ?? "-"}</div>
                  <div className="text-xs text-muted-foreground">{row.support_type ?? "-"}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={qaVariant(row.qa_status)}>{row.qa_status ?? "NON_RENSEIGNE"}</Badge>
                </TableCell>
                <TableCell className="max-w-[220px] truncate text-xs text-muted-foreground">
                  {row.source_table}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          Lignes {totalCount === 0 ? 0 : offset + 1}-{offset + rows.length} sur {totalCount}
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canGoPrevious || loading}
            onClick={() => onPageChange(Math.max(0, offset - limit))}
          >
            Précédent
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canGoNext || loading}
            onClick={() => onPageChange(offset + limit)}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
