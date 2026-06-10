import { DataHealthBadge } from "@/components/data-governance/DataHealthBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DataAdminIngestionError } from "@/types/dataAdmin";

type IngestionErrorTableProps = {
  errors: DataAdminIngestionError[];
};

export function IngestionErrorTable({ errors }: IngestionErrorTableProps) {
  return (
    <ScrollArea className="h-72 rounded-2xl border border-slate-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ligne</TableHead>
            <TableHead>Champ</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Severite</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Regle attendue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {errors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-sm text-slate-500">
                Aucune erreur de validation.
              </TableCell>
            </TableRow>
          ) : (
            errors.map((error) => (
              <TableRow key={error.error_id}>
                <TableCell className="text-xs text-slate-600">{error.row_number ?? "-"}</TableCell>
                <TableCell className="text-xs text-slate-600">{error.field_name ?? "-"}</TableCell>
                <TableCell className="text-xs text-slate-600">{error.error_scope}</TableCell>
                <TableCell>
                  <DataHealthBadge
                    status={error.severity === "WARNING" || error.severity === "INFO" ? "WARNING" : "CRITICAL"}
                    title={error.severity}
                  />
                </TableCell>
                <TableCell className="text-xs font-medium text-slate-700">{error.error_code}</TableCell>
                <TableCell className="text-xs text-slate-600">{error.error_message}</TableCell>
                <TableCell className="text-xs text-slate-500">{error.expected_rule ?? "-"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
