import { useMemo, useState } from "react";
import { Download, FileSpreadsheet, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { generateDataAdminTemplate, getDataAdminTemplateSpec } from "@/api/dataAdminTemplates";
import { DataHealthBadge } from "@/components/data-governance/DataHealthBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAuthSession, hasPermission } from "@/lib/authz";
import { toast } from "@/components/ui/sonner";
import type { DataAdminClassSummary } from "@/types/dataAdmin";

type TemplateGeneratorPanelProps = {
  classes: DataAdminClassSummary[];
  selectedClassCode: string | null;
  onSelectClassCode: (classCode: string) => void;
};

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

export function TemplateGeneratorPanel({
  classes,
  selectedClassCode,
  onSelectClassCode,
}: TemplateGeneratorPanelProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const auth = getAuthSession();
  const canGenerateTemplate = hasPermission("data_admin.template.generate", auth.permissions);

  const effectiveClassCode = useMemo(
    () => selectedClassCode ?? classes[0]?.class_code ?? null,
    [classes, selectedClassCode],
  );

  const specQuery = useQuery({
    queryKey: ["data-admin", "template-spec", effectiveClassCode],
    queryFn: () => getDataAdminTemplateSpec(effectiveClassCode!),
    enabled: Boolean(effectiveClassCode),
  });

  const handleDownload = async (format: "xlsx" | "csv") => {
    if (!effectiveClassCode) return;
    setIsDownloading(true);
    try {
      const { blob, filename } = await generateDataAdminTemplate(effectiveClassCode, { format });
      downloadBlob(blob, filename);
      toast.success(`Canevas ${format.toUpperCase()} genere pour ${effectiveClassCode}.`);
    } catch (error) {
      toast.error("Generation du canevas impossible.");
    } finally {
      setIsDownloading(false);
    }
  };

  const templateSpec = specQuery.data?.data;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.42fr_0.58fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            Generation intelligente de canevas
          </CardTitle>
          <CardDescription>
            Preparation de fichiers `.xlsx` et `.csv` sans ecriture metier, basee sur le registre `data_admin`.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Classe de donnees</label>
            <Select value={effectiveClassCode ?? undefined} onValueChange={onSelectClassCode}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une classe..." />
              </SelectTrigger>
              <SelectContent>
                {classes.map((dataClass) => (
                  <SelectItem key={dataClass.class_code} value={dataClass.class_code}>
                    {dataClass.class_code} · {dataClass.class_label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {templateSpec ? (
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-950">{templateSpec.class_label}</div>
                  <div className="text-xs text-slate-500">
                    {templateSpec.class_code} · {templateSpec.domain}
                  </div>
                </div>
                <DataHealthBadge
                  status={templateSpec.field_registry_incomplete ? "WARNING" : "HEALTHY"}
                  title={templateSpec.field_registry_incomplete ? "FIELD_REGISTRY_INCOMPLETE" : "Spec pilotee par le registre."}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl bg-white px-3 py-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Source champs</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">{templateSpec.field_source}</div>
                </div>
                <div className="rounded-xl bg-white px-3 py-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Version</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">{templateSpec.template_version}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={() => handleDownload("xlsx")} disabled={isDownloading || !canGenerateTemplate}>
                  <Download className="mr-2 h-4 w-4" />
                  {isDownloading ? "Generation..." : "Telecharger .xlsx"}
                </Button>
                <Button variant="outline" onClick={() => handleDownload("csv")} disabled={isDownloading || !canGenerateTemplate}>
                  <Download className="mr-2 h-4 w-4" />
                  Telecharger .csv
                </Button>
              </div>

              {templateSpec.warnings.length > 0 ? (
                <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900">
                  {templateSpec.warnings.map((warning) => (
                    <div key={warning}>{warning}</div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Specification du canevas
          </CardTitle>
          <CardDescription>
            Apercu des feuilles, des champs et des instructions qui seront livres au metier.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!templateSpec ? (
            <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500">
              Selectionnez une classe pour charger la specification.
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                {templateSpec.sheets.map((sheet) => (
                  <div key={sheet.sheet_name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-semibold text-slate-950">{sheet.sheet_name}</div>
                    <div className="mt-1 text-xs text-slate-500">{sheet.purpose}</div>
                    <div className="mt-3 text-xs text-slate-600">{sheet.columns.length} colonnes de reference</div>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 xl:grid-cols-[0.45fr_0.55fr]">
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-slate-800">Instructions</div>
                  <ScrollArea className="h-64 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <ul className="space-y-3 text-sm text-slate-600">
                      {templateSpec.instructions.map((instruction) => (
                        <li key={instruction}>• {instruction}</li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-semibold text-slate-800">Dictionnaire des champs</div>
                  <ScrollArea className="h-64 rounded-2xl border border-slate-200">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Champ</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Exemple</TableHead>
                          <TableHead>Regle</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {templateSpec.fields.map((field) => (
                          <TableRow key={field.field_name}>
                            <TableCell className="text-xs font-medium text-slate-700">{field.field_name}</TableCell>
                            <TableCell className="text-xs text-slate-600">{field.data_type}</TableCell>
                            <TableCell className="text-xs text-slate-600">{field.example_value ?? "-"}</TableCell>
                            <TableCell className="max-w-[220px] text-xs text-slate-500">{field.validation_rule ?? "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
