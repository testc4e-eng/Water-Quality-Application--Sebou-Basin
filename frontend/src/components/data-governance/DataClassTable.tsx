import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataHealthBadge } from "@/components/data-governance/DataHealthBadge";
import {
  getDataAdminClassDescription,
  getDataAdminClassHealth,
  type DataAdminClassSummary,
} from "@/types/dataAdmin";

type DataClassTableProps = {
  classes: DataAdminClassSummary[];
  countsByClassCode: Record<string, number | null>;
  selectedClassCode: string | null;
  searchTerm: string;
  onSelectClass: (classCode: string) => void;
};

export function DataClassTable({
  classes,
  countsByClassCode,
  selectedClassCode,
  searchTerm,
  onSelectClass,
}: DataClassTableProps) {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredClasses = classes.filter((dataClass) => {
    const haystack = [
      dataClass.domain,
      dataClass.class_code,
      dataClass.class_label,
      dataClass.target_schema,
      dataClass.target_table,
      dataClass.exposure_view_name ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalizedSearch);
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Domaine</TableHead>
          <TableHead>Classe</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Schema cible</TableHead>
          <TableHead>Table cible</TableHead>
          <TableHead>Vue d'exposition</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Nombre d'enregistrements</TableHead>
          <TableHead>Sante</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredClasses.map((dataClass) => {
          const count = countsByClassCode[dataClass.class_code];
          const health = getDataAdminClassHealth(dataClass, count);
          const isSelected = selectedClassCode === dataClass.class_code;

          return (
            <TableRow
              key={dataClass.class_code}
              className={isSelected ? "bg-blue-50/70" : undefined}
            >
              <TableCell className="font-medium text-slate-700">{dataClass.domain}</TableCell>
              <TableCell>
                <Button
                  type="button"
                  variant="link"
                  className="h-auto px-0 text-left font-semibold text-blue-700"
                  onClick={() => onSelectClass(dataClass.class_code)}
                >
                  {dataClass.class_code}
                </Button>
              </TableCell>
              <TableCell className="max-w-xs text-xs text-slate-500">
                {getDataAdminClassDescription(dataClass)}
              </TableCell>
              <TableCell className="text-xs text-slate-600">{dataClass.target_schema}</TableCell>
              <TableCell className="text-xs text-slate-600">{dataClass.target_table}</TableCell>
              <TableCell className="text-xs text-slate-600">
                {dataClass.exposure_view_name
                  ? `${dataClass.exposure_view_schema}.${dataClass.exposure_view_name}`
                  : "Aucune"}
              </TableCell>
              <TableCell>{dataClass.status}</TableCell>
              <TableCell>{count ?? "..."}</TableCell>
              <TableCell>
                <DataHealthBadge status={health.status} title={health.reason} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
