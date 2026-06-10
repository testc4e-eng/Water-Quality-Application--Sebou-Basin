import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, Database, FileSearch, Layers3, ShieldCheck } from "lucide-react";

import { DataClassCard } from "@/components/data-governance/DataClassCard";
import { DataClassTable } from "@/components/data-governance/DataClassTable";
import { DataHealthBadge } from "@/components/data-governance/DataHealthBadge";
import { DataRecordGrid } from "@/components/data-governance/DataRecordGrid";
import { DataSchemaViewer } from "@/components/data-governance/DataSchemaViewer";
import { IngestionUploadPanel } from "@/components/data-governance/IngestionUploadPanel";
import { TemplateGeneratorPanel } from "@/components/data-governance/TemplateGeneratorPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuthSession, getRoleDisplayName } from "@/lib/authz";
import {
  useDataAdminClass,
  useDataAdminClassCount,
  useDataAdminClassCounts,
  useDataAdminClassRecords,
  useDataAdminClassSchema,
  useDataAdminClasses,
} from "@/hooks/useDataAdmin";
import {
  getDataAdminClassDescription,
  getDataAdminClassHealth,
  type DataAdminClassSummary,
} from "@/types/dataAdmin";

const PAGE_SIZE = 20;
const DEFAULT_CLASS_CODE = "INFRA_STATION";
const DOMAIN_ORDER = ["INFRA", "HYDRO", "METEO", "QUALITE", "POLLUTION"];

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "...";
  return new Intl.NumberFormat("fr-MA").format(value);
}

function resolveSelectedClass(classes: DataAdminClassSummary[], selectedClassCode: string | null) {
  if (selectedClassCode && classes.some((item) => item.class_code === selectedClassCode)) {
    return selectedClassCode;
  }
  if (classes.some((item) => item.class_code === DEFAULT_CLASS_CODE)) {
    return DEFAULT_CLASS_CODE;
  }
  return classes[0]?.class_code ?? null;
}

const DataGovernanceAuditPage = () => {
  const [selectedClassCode, setSelectedClassCode] = useState<string | null>(DEFAULT_CLASS_CODE);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [recordsPage, setRecordsPage] = useState(0);
  const auth = getAuthSession();

  const classesQuery = useDataAdminClasses();
  const classes = classesQuery.data?.data ?? [];
  const resolvedSelectedClassCode = resolveSelectedClass(classes, selectedClassCode);

  useEffect(() => {
    if (resolvedSelectedClassCode !== selectedClassCode) {
      setSelectedClassCode(resolvedSelectedClassCode);
    }
  }, [resolvedSelectedClassCode, selectedClassCode]);

  useEffect(() => {
    setRecordsPage(0);
  }, [resolvedSelectedClassCode]);

  const countsQuery = useDataAdminClassCounts(classes);
  const classDetailQuery = useDataAdminClass(resolvedSelectedClassCode);
  const classSchemaQuery = useDataAdminClassSchema(resolvedSelectedClassCode);
  const classCountQuery = useDataAdminClassCount(resolvedSelectedClassCode);
  const classRecordsQuery = useDataAdminClassRecords(resolvedSelectedClassCode, recordsPage, PAGE_SIZE);

  const selectedClass = classDetailQuery.data?.data ?? classes.find((item) => item.class_code === resolvedSelectedClassCode) ?? null;
  const selectedClassHealth = selectedClass
    ? getDataAdminClassHealth(selectedClass, classCountQuery.data?.count ?? null)
    : null;

  const governanceSummary = useMemo(() => {
    const counts = classes.map((dataClass) => countsQuery.countsByClassCode[dataClass.class_code]).filter((value): value is number => typeof value === "number");
    const totalRecords = counts.reduce((sum, value) => sum + value, 0);
    const activeClasses = classes.filter((dataClass) => getDataAdminClassHealth(dataClass, countsQuery.countsByClassCode[dataClass.class_code]).status === "ACTIVE").length;
    const emptyClasses = classes.filter((dataClass) => getDataAdminClassHealth(dataClass, countsQuery.countsByClassCode[dataClass.class_code]).status === "EMPTY").length;
    const warningClasses = classes.filter((dataClass) => {
      const status = getDataAdminClassHealth(dataClass, countsQuery.countsByClassCode[dataClass.class_code]).status;
      return status === "WARNING" || status === "MISSING";
    }).length;

    return {
      totalClasses: classes.length,
      activeClasses,
      totalRecords,
      emptyClasses,
      warningClasses,
    };
  }, [classes, countsQuery.countsByClassCode]);

  const domainCards = useMemo(
    () =>
      DOMAIN_ORDER.map((domain) => {
        const classesForDomain = classes.filter((item) => item.domain === domain);
        const total = classesForDomain.reduce(
          (sum, item) => sum + (countsQuery.countsByClassCode[item.class_code] ?? 0),
          0,
        );

        return {
          domain,
          classCount: classesForDomain.length,
          total,
        };
      }).filter((item) => item.classCount > 0),
    [classes, countsQuery.countsByClassCode],
  );

  const healthRows = useMemo(
    () =>
      classes.map((dataClass) => {
        const count = countsQuery.countsByClassCode[dataClass.class_code];
        const health = getDataAdminClassHealth(dataClass, count);
        return {
          classCode: dataClass.class_code,
          domain: dataClass.domain,
          count,
          source: dataClass.exposure_view_name
            ? `${dataClass.exposure_view_schema}.${dataClass.exposure_view_name}`
            : `${dataClass.target_schema}.${dataClass.target_table}`,
          health,
        };
      }),
    [classes, countsQuery.countsByClassCode],
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <ShieldCheck className="h-4 w-4" /> Module 114 · Gouvernance des donnees
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                Portail d'audit et de gouvernance des donnees
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-500">
                Vue metier en lecture seule sur le registre officiel des classes, les volumes exposes par l'API
                et l'etat de sante des donnees SAD sans acces direct a PostgreSQL.
              </p>
            </div>

            <Card className="border-blue-100 bg-blue-50/70 xl:max-w-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-blue-900">Module 114 actif</CardTitle>
                <CardDescription className="text-blue-700">
                  L'audit, les canevas, l'ingestion, la validation et la promotion controlee reutilisent ce socle.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {["Canevas", "Upload", "Validation", "Staging", "Promotion", "Change Request"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-medium text-blue-700 opacity-70"
                  >
                    {item}
                  </span>
                ))}
              </CardContent>
            </Card>

            <Card className="border-slate-200 xl:max-w-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-900">Rôle connecté</CardTitle>
                <CardDescription className="text-slate-600">
                  {getRoleDisplayName(auth)} · {auth.rbacStatus}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {auth.permissions.length === 0 ? (
                  <span className="text-xs text-slate-500">Aucune permission active détectée.</span>
                ) : (
                  auth.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {permission}
                    </span>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="container mx-auto space-y-8 px-6 py-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <DataClassCard
            title="Classes enregistrees"
            value={formatNumber(governanceSummary.totalClasses)}
            subtitle="Registre data_admin actif"
          />
          <DataClassCard
            title="Classes actives"
            value={formatNumber(governanceSummary.activeClasses)}
            subtitle="Exposition exploitable au runtime"
            accent="emerald"
          />
          <DataClassCard
            title="Enregistrements"
            value={formatNumber(governanceSummary.totalRecords)}
            subtitle="Somme des compteurs exposes"
          />
          <DataClassCard
            title="Classes vides"
            value={formatNumber(governanceSummary.emptyClasses)}
            subtitle="Registre actif sans donnees"
            accent="amber"
          />
          <DataClassCard
            title="Classes en erreur"
            value={formatNumber(governanceSummary.warningClasses)}
            subtitle="Warning ou source manquante"
            accent="slate"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {domainCards.map((card) => (
            <DataClassCard
              key={card.domain}
              title={card.domain}
              value={formatNumber(card.total)}
              subtitle={`${card.classCount} classe(s) rattachee(s)`}
              accent={card.domain === "INFRA" ? "blue" : card.domain === "HYDRO" ? "emerald" : card.domain === "METEO" ? "amber" : "slate"}
            />
          ))}
        </div>

        <Tabs defaultValue="catalogue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 gap-2 bg-transparent md:grid-cols-5">
            <TabsTrigger value="catalogue">Catalogue des classes</TabsTrigger>
            <TabsTrigger value="detail">Audit detaille</TabsTrigger>
            <TabsTrigger value="health">Sante des donnees</TabsTrigger>
            <TabsTrigger value="templates">Canevas</TabsTrigger>
            <TabsTrigger value="ingestion">Ingestion</TabsTrigger>
          </TabsList>

          <TabsContent value="catalogue" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <CardTitle>Catalogue des classes metier</CardTitle>
                  <CardDescription>
                    Huit classes sont actuellement enregistrees dans `data_admin.data_class_registry`.
                  </CardDescription>
                </div>
                <div className="w-full max-w-sm">
                  <Input
                    value={catalogSearch}
                    onChange={(event) => setCatalogSearch(event.target.value)}
                    placeholder="Filtrer par domaine, classe ou vue..."
                  />
                </div>
              </CardHeader>
              <CardContent>
                {classesQuery.isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <DataClassTable
                    classes={classes}
                    countsByClassCode={countsQuery.countsByClassCode}
                    selectedClassCode={resolvedSelectedClassCode}
                    searchTerm={catalogSearch}
                    onSelectClass={setSelectedClassCode}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detail" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers3 className="h-5 w-5 text-blue-600" />
                    Audit detaille de classe
                  </CardTitle>
                  <CardDescription>
                    Metadonnees, structure et extrait de donnees pour {resolvedSelectedClassCode ?? "la classe selectionnee"}.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedClass ? (
                    <>
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Classe</div>
                          <div className="mt-2 text-lg font-bold text-slate-950">{selectedClass.class_code}</div>
                          <p className="mt-1 text-sm text-slate-500">{selectedClass.class_label}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Exposition</div>
                          <div className="mt-2 text-sm font-semibold text-slate-950">
                            {selectedClass.exposure_view_name
                              ? `${selectedClass.exposure_view_schema}.${selectedClass.exposure_view_name}`
                              : `${selectedClass.target_schema}.${selectedClass.target_table}`}
                          </div>
                          <p className="mt-1 text-xs text-slate-500">{getDataAdminClassDescription(selectedClass)}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Sante</div>
                          <div className="mt-2">
                            {selectedClassHealth ? (
                              <DataHealthBadge status={selectedClassHealth.severity} title={selectedClassHealth.reason} />
                            ) : null}
                          </div>
                          <p className="mt-1 text-xs text-slate-500">Derniere mise a jour non exposee par l'API MVP1.</p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <DataClassCard
                          title="Enregistrements"
                          value={formatNumber(classCountQuery.data?.count)}
                          subtitle="Compteur reel de la source"
                        />
                        <DataClassCard
                          title="Champs exposes"
                          value={formatNumber(classSchemaQuery.data?.count)}
                          subtitle="Structure retournee par /schema"
                          accent="emerald"
                        />
                        <DataClassCard
                          title="Validation"
                          value={selectedClass.validation_level}
                          subtitle={`Role proprietaire: ${selectedClass.owner_role}`}
                          accent="amber"
                        />
                        <DataClassCard
                          title="Capacites"
                          value={selectedClass.realtime_capable ? "RT" : "Batch"}
                          subtitle={`${selectedClass.ingestable ? "Ingestable" : "Lecture seule"} · ${selectedClass.geometry_required ? "Geometrie requise" : "Sans geometrie"}`}
                          accent="slate"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                          <FileSearch className="h-4 w-4 text-blue-600" />
                          Schema des champs
                        </div>
                        <DataSchemaViewer fields={classSchemaQuery.data?.data ?? []} />
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500">
                      Aucune classe selectionnee.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    Extrait des enregistrements
                  </CardTitle>
                  <CardDescription>
                    20 premiers enregistrements pagines via `GET /api/v1/data-admin/classes/{`{class_code}`}/records`.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {classRecordsQuery.isLoading && !classRecordsQuery.data ? (
                    <div className="space-y-3">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <DataRecordGrid
                      records={classRecordsQuery.data?.data ?? []}
                      fields={classSchemaQuery.data?.data ?? []}
                      page={recordsPage}
                      pageSize={PAGE_SIZE}
                      totalCount={classRecordsQuery.data?.metadata.total_count ?? classCountQuery.data?.count ?? 0}
                      isFetching={classRecordsQuery.isFetching}
                      onPageChange={setRecordsPage}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Sante des donnees
                </CardTitle>
                <CardDescription>
                  Evaluation basee sur l'etat du registre, la presence d'une vue d'exposition et les compteurs retournes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 lg:grid-cols-2">
                  {healthRows.map((row) => (
                    <div key={row.classCode} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-950">{row.classCode}</div>
                          <div className="text-xs text-slate-500">{row.domain}</div>
                        </div>
                        <DataHealthBadge status={row.health.severity} title={row.health.reason} />
                      </div>
                      <div className="mt-4 grid gap-2 text-sm text-slate-600">
                        <div className="flex items-center justify-between gap-3">
                          <span>Source</span>
                          <span className="font-medium text-slate-900">{row.source}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span>Lignes</span>
                          <span className="font-medium text-slate-900">{formatNumber(row.count)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span>Derniere mise a jour</span>
                          <span className="text-xs text-slate-500">Non exposee</span>
                        </div>
                      </div>
                      <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">{row.health.reason}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-900">
                  <AlertTriangle className="h-5 w-5" />
                  Limites connues MVP1-B
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-amber-900/90">
                <p>La recherche et le tri des enregistrements s'appliquent a la page courante exposee par l'API `/records`.</p>
                <p>La date de derniere mise a jour n'est pas encore retournee par les endpoints `data-admin` et reste donc non affichee.</p>
                <p>La promotion est active en `INSERT_ONLY` sur les classes pilotes, mais le RBAC complet, le rollback logique et les modes `UPSERT/UPDATE` restent hors perimetre.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <TemplateGeneratorPanel
              classes={classes}
              selectedClassCode={resolvedSelectedClassCode}
              onSelectClassCode={setSelectedClassCode}
            />
          </TabsContent>

          <TabsContent value="ingestion" className="space-y-6">
            <IngestionUploadPanel
              classes={classes}
              selectedClassCode={resolvedSelectedClassCode}
              onSelectClassCode={setSelectedClassCode}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DataGovernanceAuditPage;
