import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DataAdminPromotionAuditLogEntry } from "@/types/dataAdmin";

type PromotionAuditLogProps = {
  entries: DataAdminPromotionAuditLogEntry[];
};

export function PromotionAuditLog({ entries }: PromotionAuditLogProps) {
  return (
    <ScrollArea className="h-64 rounded-2xl border border-slate-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Acteur</TableHead>
            <TableHead>Cible</TableHead>
            <TableHead>Horodatage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-sm text-slate-500">
                Aucun log de promotion.
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => (
              <TableRow key={entry.audit_id}>
                <TableCell className="text-xs font-medium text-slate-700">{entry.action}</TableCell>
                <TableCell className="text-xs text-slate-600">{entry.actor}</TableCell>
                <TableCell className="max-w-[220px] text-xs text-slate-600">
                  {entry.target_schema && entry.target_table
                    ? `${entry.target_schema}.${entry.target_table}`
                    : "Workflow data_admin"}
                </TableCell>
                <TableCell className="text-xs text-slate-500">{new Date(entry.created_at).toLocaleString("fr-MA")}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
