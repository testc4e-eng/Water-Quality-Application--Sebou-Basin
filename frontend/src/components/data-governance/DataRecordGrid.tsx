import { useMemo, useState } from "react";
import { ArrowDownAZ, ArrowUpAZ, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DataAdminFieldSchema, DataAdminRecord } from "@/types/dataAdmin";

type DataRecordGridProps = {
  records: DataAdminRecord[];
  fields: DataAdminFieldSchema[];
  page: number;
  pageSize: number;
  totalCount: number;
  isFetching: boolean;
  onPageChange: (page: number) => void;
};

function serializeValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function DataRecordGrid({
  records,
  fields,
  page,
  pageSize,
  totalCount,
  isFetching,
  onPageChange,
}: DataRecordGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const visibleColumns = useMemo(() => {
    if (fields.length > 0) {
      return fields.slice(0, 8).map((field) => field.field_name);
    }
    return Object.keys(records[0] ?? {}).slice(0, 8);
  }, [fields, records]);

  const filteredRecords = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const base = normalizedSearch
      ? records.filter((record) =>
          Object.values(record).some((value) => serializeValue(value).toLowerCase().includes(normalizedSearch)),
        )
      : records;

    if (!sortField) return base;

    return [...base].sort((left, right) => {
      const leftValue = serializeValue(left[sortField]).toLowerCase();
      const rightValue = serializeValue(right[sortField]).toLowerCase();
      const comparison = leftValue.localeCompare(rightValue, "fr", { numeric: true, sensitivity: "base" });
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [records, searchTerm, sortDirection, sortField]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = page * pageSize + 1;
  const endIndex = Math.min(totalCount, page * pageSize + records.length);

  const handleSort = (fieldName: string) => {
    if (sortField === fieldName) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortField(fieldName);
    setSortDirection("asc");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Rechercher dans la page courante..."
            className="pl-9"
          />
        </div>
        <div className="text-xs text-slate-500">
          {isFetching ? "Rafraichissement..." : `Lignes ${startIndex} a ${endIndex} sur ${totalCount}`}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.map((column) => (
              <TableHead key={column}>
                <button
                  type="button"
                  onClick={() => handleSort(column)}
                  className="inline-flex items-center gap-2 text-left font-medium text-slate-600"
                >
                  {column}
                  {sortField === column ? (
                    sortDirection === "asc" ? <ArrowUpAZ className="h-3.5 w-3.5" /> : <ArrowDownAZ className="h-3.5 w-3.5" />
                  ) : null}
                </button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRecords.length === 0 ? (
            <TableRow>
              <TableCell colSpan={visibleColumns.length || 1} className="text-center text-sm text-slate-500">
                Aucun enregistrement visible pour ce filtre.
              </TableCell>
            </TableRow>
          ) : (
            filteredRecords.map((record, rowIndex) => (
              <TableRow key={`${page}-${rowIndex}`}>
                {visibleColumns.map((column) => (
                  <TableCell key={column} className="max-w-[220px] truncate text-xs text-slate-600">
                    {serializeValue(record[column]) || "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Pagination className="justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(event) => {
                event.preventDefault();
                if (page > 0) onPageChange(page - 1);
              }}
              className={page === 0 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          <PaginationItem>
            <Button variant="outline" size="sm" className="pointer-events-none">
              Page {page + 1} / {totalPages}
            </Button>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(event) => {
                event.preventDefault();
                if (page + 1 < totalPages) onPageChange(page + 1);
              }}
              className={page + 1 >= totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
