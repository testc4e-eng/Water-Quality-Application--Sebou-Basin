import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataHealthBadge } from "@/components/data-governance/DataHealthBadge";
import type { DataAdminValidationRule } from "@/types/dataAdmin";

type ValidationRulesPanelProps = {
  rules: DataAdminValidationRule[];
};

function getRuleSeverityBadge(severity: string) {
  return severity === "WARNING" || severity === "INFO" ? "WARNING" : "CRITICAL";
}

export function ValidationRulesPanel({ rules }: ValidationRulesPanelProps) {
  return (
    <ScrollArea className="h-72 rounded-2xl border border-slate-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Champ</TableHead>
            <TableHead>Règle</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Sévérité</TableHead>
            <TableHead>Référence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-slate-500">
                Aucune regle dynamique declaree pour cette classe.
              </TableCell>
            </TableRow>
          ) : (
            rules.map((rule) => (
              <TableRow key={rule.rule_id}>
                <TableCell className="text-xs text-slate-600">{rule.field_name ?? "-"}</TableCell>
                <TableCell className="text-xs text-slate-700">
                  <div className="font-medium">{rule.rule_label}</div>
                  <div className="mt-1 text-slate-500">{rule.description ?? rule.rule_code}</div>
                </TableCell>
                <TableCell className="text-xs text-slate-600">{rule.rule_type}</TableCell>
                <TableCell>
                  <DataHealthBadge status={getRuleSeverityBadge(rule.severity)} title={rule.severity} />
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {rule.reference_schema && rule.reference_table
                    ? `${rule.reference_schema}.${rule.reference_table}${rule.reference_column ? `.${rule.reference_column}` : ""}`
                    : "-"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
