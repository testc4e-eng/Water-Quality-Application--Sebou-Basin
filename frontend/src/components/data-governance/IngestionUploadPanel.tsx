import { useMemo, useState } from "react";
import { Database, Upload } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getDataAdminClassValidationRules,
  getDataAdminIngestionErrors,
  getDataAdminIngestionRun,
  getDataAdminIngestionRuns,
  getDataAdminIngestionStagingPreview,
  uploadDataAdminIngestionFile,
} from "@/api/dataAdminIngestion";
import { ChangeRequestPanel } from "@/components/data-governance/ChangeRequestPanel";
import { IngestionErrorTable } from "@/components/data-governance/IngestionErrorTable";
import { IngestionRunSummary } from "@/components/data-governance/IngestionRunSummary";
import { ValidationRulesPanel } from "@/components/data-governance/ValidationRulesPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAuthSession, hasPermission } from "@/lib/authz";
import { toast } from "@/components/ui/sonner";
import type { DataAdminClassSummary } from "@/types/dataAdmin";

const PILOT_CLASS_CODES = [
  "HYDRO_DEBIT",
  "METEO_PRECIPITATION",
  "QUALITE_RIVIERE",
  "INFRA_STATION",
  "POLLUTION_SITE",
];

const GEOSPATIAL_CLASS_HINTS: Record<string, string> = {
  INFRA_STATION: "GEOSPATIAL_VALIDATION · SRID autorise: 4326 ou 26191",
  POLLUTION_SITE: "GEOSPATIAL_VALIDATION · SRID autorise: 4326 ou 26191 · garde IDP active",
};

type IngestionUploadPanelProps = {
  classes: DataAdminClassSummary[];
  selectedClassCode: string | null;
  onSelectClassCode: (classCode: string) => void;
};

export function IngestionUploadPanel({
  classes,
  selectedClassCode,
  onSelectClassCode,
}: IngestionUploadPanelProps) {
  const queryClient = useQueryClient();
  const auth = getAuthSession();
  const canUpload = hasPermission("data_admin.upload", auth.permissions);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  const pilotClasses = useMemo(
    () => classes.filter((item) => PILOT_CLASS_CODES.includes(item.class_code)),
    [classes],
  );
  const effectiveClassCode = useMemo(
    () => selectedClassCode && PILOT_CLASS_CODES.includes(selectedClassCode)
      ? selectedClassCode
      : pilotClasses[0]?.class_code ?? null,
    [pilotClasses, selectedClassCode],
  );

  const runsQuery = useQuery({
    queryKey: ["data-admin", "ingestion-runs"],
    queryFn: getDataAdminIngestionRuns,
  });

  const rulesQuery = useQuery({
    queryKey: ["data-admin", "validation-rules", effectiveClassCode],
    queryFn: () => getDataAdminClassValidationRules(effectiveClassCode!),
    enabled: Boolean(effectiveClassCode),
  });

  const runDetailQuery = useQuery({
    queryKey: ["data-admin", "ingestion-run", selectedRunId],
    queryFn: () => getDataAdminIngestionRun(selectedRunId!),
    enabled: Boolean(selectedRunId),
  });

  const errorsQuery = useQuery({
    queryKey: ["data-admin", "ingestion-errors", selectedRunId],
    queryFn: () => getDataAdminIngestionErrors(selectedRunId!),
    enabled: Boolean(selectedRunId),
  });

  const stagingPreviewQuery = useQuery({
    queryKey: ["data-admin", "ingestion-staging-preview", selectedRunId],
    queryFn: () => getDataAdminIngestionStagingPreview(selectedRunId!),
    enabled: Boolean(selectedRunId),
  });

  const uploadMutation = useMutation({
    mutationFn: ({ classCode, file }: { classCode: string; file: File }) =>
      uploadDataAdminIngestionFile(classCode, file),
    onSuccess: (payload) => {
      toast.success(`Run ${payload.run.run_status} cree pour ${payload.run.class_code}.`);
      setSelectedRunId(payload.run.run_id);
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["data-admin", "ingestion-runs"] });
      queryClient.invalidateQueries({ queryKey: ["data-admin", "ingestion-run", payload.run.run_id] });
      queryClient.invalidateQueries({ queryKey: ["data-admin", "ingestion-errors", payload.run.run_id] });
      queryClient.invalidateQueries({ queryKey: ["data-admin", "ingestion-staging-preview", payload.run.run_id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail ?? "Upload impossible.");
    },
  });

  const handleUpload = () => {
    if (!effectiveClassCode || !selectedFile) return;
    uploadMutation.mutate({ classCode: effectiveClassCode, file: selectedFile });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.42fr_0.58fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              Upload et validation
            </CardTitle>
            <CardDescription>
              Upload limite aux classes pilotes, validation structurelle et metier, staging sans promotion.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Classe pilote</label>
              <Select value={effectiveClassCode ?? undefined} onValueChange={onSelectClassCode}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une classe pilote..." />
                </SelectTrigger>
                <SelectContent>
                  {pilotClasses.map((dataClass) => (
                    <SelectItem key={dataClass.class_code} value={dataClass.class_code}>
                      {dataClass.class_code} · {dataClass.class_label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {effectiveClassCode && GEOSPATIAL_CLASS_HINTS[effectiveClassCode] ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
                {GEOSPATIAL_CLASS_HINTS[effectiveClassCode]}
              </div>
            ) : null}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Fichier source (.csv ou .xlsx)</label>
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
              />
            </div>

            <Button onClick={handleUpload} disabled={!selectedFile || !effectiveClassCode || uploadMutation.isPending || !canUpload}>
              <Upload className="mr-2 h-4 w-4" />
              {uploadMutation.isPending ? "Validation en cours..." : "Uploader vers staging"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Historique des runs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72 rounded-2xl border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Classe</TableHead>
                    <TableHead>Fichier</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Lignes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(runsQuery.data?.data ?? []).map((run) => (
                    <TableRow
                      key={run.run_id}
                      className={selectedRunId === run.run_id ? "bg-blue-50/70" : undefined}
                      onClick={() => setSelectedRunId(run.run_id)}
                    >
                      <TableCell className="text-xs font-medium text-slate-700">{run.class_code}</TableCell>
                      <TableCell className="text-xs text-slate-600">{run.file_name}</TableCell>
                      <TableCell className="text-xs text-slate-600">{run.run_status}</TableCell>
                      <TableCell className="text-xs text-slate-600">{run.row_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <IngestionRunSummary run={runDetailQuery.data?.run ?? null} />

        <Card>
          <CardHeader>
            <CardTitle>Regles appliquees</CardTitle>
            <CardDescription>
              Regles dynamiques declarees dans `data_admin.validation_rule_registry` pour la classe pilote selectionnee.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ValidationRulesPanel rules={rulesQuery.data?.data ?? []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Erreurs de validation</CardTitle>
          </CardHeader>
          <CardContent>
            <IngestionErrorTable errors={errorsQuery.data?.data ?? []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Apercu staging</CardTitle>
            <CardDescription>
              Lignes stockees dans `data_admin.ingestion_staging_row` pour les runs sans erreur bloquante.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72 rounded-2xl border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ligne</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Payload normalise</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(stagingPreviewQuery.data?.data ?? []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-sm text-slate-500">
                        Aucun apercu staging disponible.
                      </TableCell>
                    </TableRow>
                  ) : (
                    (stagingPreviewQuery.data?.data ?? []).map((row) => (
                      <TableRow key={row.staging_row_id}>
                        <TableCell className="text-xs text-slate-600">{row.row_number}</TableCell>
                        <TableCell className="text-xs text-slate-600">{row.row_status}</TableCell>
                        <TableCell className="max-w-[420px] text-xs text-slate-500">
                          <pre className="whitespace-pre-wrap break-words">{JSON.stringify(row.normalized_payload, null, 2)}</pre>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <ChangeRequestPanel selectedRun={runDetailQuery.data?.run ?? null} />
      </div>
    </div>
  );
}
