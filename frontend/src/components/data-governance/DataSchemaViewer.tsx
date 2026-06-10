import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataHealthBadge } from "@/components/data-governance/DataHealthBadge";
import type { DataAdminFieldSchema } from "@/types/dataAdmin";

type DataSchemaViewerProps = {
  fields: DataAdminFieldSchema[];
};

export function DataSchemaViewer({ fields }: DataSchemaViewerProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Champ</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Requis</TableHead>
          <TableHead>Editable</TableHead>
          <TableHead>Ingestable</TableHead>
          <TableHead>Regle</TableHead>
          <TableHead>Reference</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fields.map((field) => (
          <TableRow key={field.field_name}>
            <TableCell className="font-medium text-slate-700">{field.field_name}</TableCell>
            <TableCell className="text-xs text-slate-600">{field.data_type}</TableCell>
            <TableCell>{field.required ? <DataHealthBadge status="HEALTHY" /> : "Non"}</TableCell>
            <TableCell>{field.editable ? "Oui" : "Non"}</TableCell>
            <TableCell>{field.ingestable ? "Oui" : "Non"}</TableCell>
            <TableCell className="text-xs text-slate-500">{field.validation_rule ?? "-"}</TableCell>
            <TableCell className="text-xs text-slate-500">{field.reference_source ?? "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
