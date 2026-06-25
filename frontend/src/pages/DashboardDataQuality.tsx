import { AlertTriangle, CheckCircle2, Database, FileWarning, Link as LinkIcon, ShieldAlert } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQueries, useQuery } from "@tanstack/react-query";

import { getDataAdminClasses, getDataAdminClassCount } from "@/api/dataAdmin";
import { getDataAdminValidationRules } from "@/api/dataAdminIngestion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { runDataScan } from "@/services/dataScanService";
function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return "N/D";
  return new Intl.NumberFormat("fr-MA").format(value);
}

export default function DashboardDataQuality() {
  const classesQuery = useQuery({
    queryKey: ["dashboard-data-quality", "classes"],
    queryFn: getDataAdminClasses,
  });

  const rulesQuery = useQuery({
    queryKey: ["dashboard-data-quality", "validation-rules"],
    queryFn: getDataAdminValidationRules,
  });

  const scanQuery = useQuery({
    queryKey: ["dashboard-data-quality", "data-availability"],
    queryFn: () => runDataScan(false),
  });

  const classes = classesQuery.data?.data ?? [];
  const countQueries = useQueries({
    queries: classes.map((dataClass) => ({
      queryKey: ["dashboard-data-quality", "count", dataClass.class_code],
      queryFn: () => getDataAdminClassCount(dataClass.class_code),
      staleTime: 60_000,
    })),
  });

  const countByClass = useMemo(
    () =>
      classes.reduce<Record<string, number | null>>((acc, item, index) => {
        acc[item.class_code] = countQueries[index]?.data?.count ?? null;
        return acc;
      }, {}),
    [classes, countQueries],
  );

  const qualitySummary = useMemo(() => {
    const totalClasses = classes.length;
    const emptyClasses = classes.filter((item) => (countByClass[item.class_code] ?? 0) === 0).length;
    const pendingClasses = classes.filter((item) => item.db_execution_pending).length;
    const ingestableClasses = classes.filter((item) => item.ingestable).length;
    return {
      totalClasses,
      emptyClasses,
      pendingClasses,
      ingestableClasses,
    };
  }, [classes, countByClass]);

  const hasFatalError = classesQuery.isError || rulesQuery.isError || scanQuery.isError;
  const isLoading =
    classesQuery.isLoading ||
    rulesQuery.isLoading ||
    scanQuery.isLoading ||
    (classes.length > 0 && countQueries.some((query) => query.isLoading));

  const apiSources = [
    "GET /api/v1/data-admin/classes",
    "GET /api/v1/data-admin/classes/{class}/count",
    "GET /api/v1/data-admin/validation-rules",
    "GET /api/v1/admin/data-availability",
  ];

  const dataAvailability = scanQuery.data?.summary;
  const runtimeWarnings = [
    {
      title: "Paramètres non mappés",
      detail:
        "Non exposés par un compteur dédié dans l'API runtime actuelle. Le suivi détaillé reste à faire via l'espace expert et les arbitrages métier.",
      icon: LinkIcon,
    },
    {
      title: "Valeurs nulles et extrêmes",
      detail:
        "Les endpoints de synthèse exposent la couverture et les volumes, pas encore un comptage consolidé des nulls et extrêmes pour la lecture DG.",
      icon: FileWarning,
    },
    {
      title: "Entités ambiguës",
      detail:
        "Les ambigüités géo/métier restent gouvernées côté QA et documentation. Le frontend DG doit les montrer comme vigilance, sans surpromettre un chiffre consolidé.",
      icon: ShieldAlert,
    },
  ];

  return (
    <main className="min-h-screen bg-[#EEF5FF] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-5">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status="OPERATIONNEL" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Données / QA
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Qualité et gouvernance des données</h1>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Synthèse DG / métier des classes de données, de la couverture disponible et des contrôles runtime déjà exposés
                par le module officiel <code>data-admin</code>.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">Source API</div>
              <div className="mt-2 space-y-1">
                {apiSources.map((source) => (
                  <div key={source} className="font-mono text-xs">
                    {source}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {hasFatalError ? (
          <section className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-4 w-4" />
              L'API Données / QA est indisponible ou protégée par le rôle courant.
            </div>
            <div className="mt-2">
              Vérifier le token, les permissions <code>data_admin.audit.read</code> et l'endpoint <code>/api/v1/data-admin/*</code>.
            </div>
          </section>
        ) : (
          <section className="flex items-center gap-2 text-sm text-emerald-800">
            <CheckCircle2 className="h-4 w-4" />
            Connexion lecture seule au module officiel de gouvernance des données.
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard title="Classes suivies" value={formatNumber(qualitySummary.totalClasses)} subtitle="Registre data-admin" icon={Database} />
          <MetricCard title="Classes vides" value={formatNumber(qualitySummary.emptyClasses)} subtitle="Données non injectées ou non exposées" icon={FileWarning} />
          <MetricCard title="Classes en attente" value={formatNumber(qualitySummary.pendingClasses)} subtitle="Execution DB ou stabilisation à compléter" icon={ShieldAlert} />
          <MetricCard title="Classes ingestables" value={formatNumber(qualitySummary.ingestableClasses)} subtitle="Pilotables par le module 114" icon={CheckCircle2} />
          <MetricCard title="Règles dynamiques" value={formatNumber(rulesQuery.data?.count)} subtitle="Contrôles runtime actifs" icon={LinkIcon} />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_420px]">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Lecture DG / métier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                  Chargement des indicateurs Données / QA...
                </div>
              ) : classes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                  Aucune classe n'est remontée par <code>/api/v1/data-admin/classes</code>.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <SummaryRow
                    title="Données non injectées"
                    value={formatNumber(qualitySummary.emptyClasses)}
                    description="Classes officielles connues sans volume runtime exposé."
                  />
                  <SummaryRow
                    title="Couverture variables"
                    value={formatNumber(dataAvailability?.total_variables)}
                    description="Variables visibles dans le scan de disponibilité."
                  />
                  <SummaryRow
                    title="Stations avec données"
                    value={formatNumber(dataAvailability?.stations_with_data)}
                    description="Stations couvertes par les données exposées."
                  />
                  <SummaryRow
                    title="Enregistrements observés"
                    value={formatNumber(dataAvailability?.total_records)}
                    description="Volume global du scan de disponibilité."
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Accès expert</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <div>
                Le niveau DG masque volontairement les détails trop techniques. Les investigations expertes restent disponibles
                dans l'espace officiel de gouvernance.
              </div>
              <Link
                to="/admin/data-governance/audit"
                className="inline-flex rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-900 hover:bg-slate-50"
              >
                Ouvrir l'espace expert data-admin
              </Link>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {runtimeWarnings.map((warning) => {
            const Icon = warning.icon;
            return (
              <Card key={warning.title} className="border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-amber-50 p-2 text-amber-700">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-950">{warning.title}</div>
                      <div className="mt-1 text-sm leading-6 text-slate-600">{warning.detail}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof Database;
}) {
  return (
    <Card className="border-slate-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</div>
            <div className="mt-2 text-2xl font-semibold text-slate-950">{value}</div>
            <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
          </div>
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryRow({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-950">{value}</div>
      <div className="mt-1 text-sm text-slate-600">{description}</div>
    </div>
  );
}
