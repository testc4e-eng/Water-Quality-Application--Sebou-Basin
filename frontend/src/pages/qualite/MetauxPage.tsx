import { useState, type Dispatch, type SetStateAction } from "react";

import MetauxChart from "@/charts/MetauxChart";
import MetauxTable from "@/components/qualite/MetauxTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQualiteMetaux } from "@/hooks/useQualiteMetaux";
import type { QualiteFilters } from "@/types/qualite";

const ALL = "__all";
const DEFAULT_FILTERS: QualiteFilters = {
  limit: 100,
  offset: 0,
};

const METAL_CODES = [
  "Ag",
  "Al",
  "As",
  "Ba",
  "Be",
  "Cd",
  "Co",
  "Cr",
  "Cu",
  "Fe",
  "Hg",
  "Li",
  "Mn",
  "Mo",
  "Ni",
  "Pb",
  "Sb",
  "Se",
  "Sn",
  "Sr",
  "Tl",
  "V",
  "Zn",
];

function setFilterValue(
  setter: Dispatch<SetStateAction<QualiteFilters>>,
  key: keyof QualiteFilters,
  value: string | number | boolean | undefined
) {
  setter((current) => ({
    ...current,
    [key]: value === ALL || value === "" ? undefined : value,
    offset: 0,
  }));
}

function validationBadge(label: string, count: number | undefined, expectedZero = false) {
  const ok = expectedZero ? count === 0 : (count ?? 0) > 0;
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Badge variant={ok ? "default" : "destructive"}>{count ?? "..."}</Badge>
    </div>
  );
}

export default function MetauxPage() {
  const [filters, setFilters] = useState<QualiteFilters>(DEFAULT_FILTERS);
  const { data, error, isFetching, isLoading, refetch } = useQualiteMetaux(filters);
  const moQuery = useQualiteMetaux({ code_parametre: "MO", limit: 1, offset: 0 });
  const molybdeneQuery = useQualiteMetaux({ code_parametre: "Mo", limit: 1, offset: 0 });
  const moMetalQuery = useQualiteMetaux({ code_parametre: "MO_METAL", limit: 1, offset: 0 });

  const rows = data?.data ?? [];
  const limit = filters.limit ?? 100;
  const offset = filters.offset ?? 0;
  const count = data?.count ?? 0;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-teal-950 to-slate-800 p-6 text-white shadow-xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-teal-200">Pilote API spécialisée</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Métaux qualité eau
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              Ecran pilote consommant uniquement <code>/api/v1/qualite/metaux</code>.
              Les routes legacy, tables métier et données brutes ne sont pas utilisées.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Volume filtré</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{count.toLocaleString("fr-MA")}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Lignes affichées</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{rows.length.toLocaleString("fr-MA")}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vue source</CardTitle>
            </CardHeader>
            <CardContent className="text-sm font-semibold">
              {data?.metadata?.source_view ?? "api.v_qualite_metaux"}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Etat API</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={error ? "destructive" : "default"}>
                {error ? "ERREUR" : isFetching ? "REFRESH" : "OK"}
              </Badge>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            <Input
              aria-label="Date début"
              type="date"
              value={filters.date_start ?? ""}
              onChange={(event) => setFilterValue(setFilters, "date_start", event.target.value)}
            />
            <Input
              aria-label="Date fin"
              type="date"
              value={filters.date_end ?? ""}
              onChange={(event) => setFilterValue(setFilters, "date_end", event.target.value)}
            />
            <Select
              value={filters.support_type ?? ALL}
              onValueChange={(value) => setFilterValue(setFilters, "support_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Support" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tous supports</SelectItem>
                <SelectItem value="RIVIERE">Rivière</SelectItem>
                <SelectItem value="NAPPE">Nappe</SelectItem>
                <SelectItem value="BARRAGE">Barrage</SelectItem>
                <SelectItem value="SEBOU">Sebou</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.code_parametre ?? ALL}
              onValueChange={(value) => setFilterValue(setFilters, "code_parametre", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Paramètre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tous métaux</SelectItem>
                {METAL_CODES.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.qa_status ?? ALL}
              onValueChange={(value) => setFilterValue(setFilters, "qa_status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="QA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tous statuts QA</SelectItem>
                <SelectItem value="OK">OK</SelectItem>
                <SelectItem value="QA_WARNING">QA warning</SelectItem>
                <SelectItem value="QA_ACCEPTED_SOURCE_GAP">Source gap accepté</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={String(filters.limit ?? 100)}
              onValueChange={(value) => setFilterValue(setFilters, "limit", Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Limite" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50 lignes</SelectItem>
                <SelectItem value="100">100 lignes</SelectItem>
                <SelectItem value="250">250 lignes</SelectItem>
                <SelectItem value="500">500 lignes</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2 md:col-span-3 lg:col-span-6">
              <Button type="button" variant="outline" onClick={() => setFilters(DEFAULT_FILTERS)}>
                Réinitialiser
              </Button>
              <Button type="button" onClick={() => refetch()}>
                Rafraîchir
              </Button>
            </div>
          </CardContent>
        </Card>

        {error ? (
          <Card className="border-destructive">
            <CardContent className="py-6 text-sm text-destructive">
              Impossible de charger les métaux depuis l'API spécialisée. Vérifier que le backend est démarré.
            </CardContent>
          </Card>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardHeader>
              <CardTitle>Evolution temporelle</CardTitle>
            </CardHeader>
            <CardContent>
              <MetauxChart rows={rows} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contrôles métier P0</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {validationBadge("Mo visible dans métaux", molybdeneQuery.data?.count)}
              {validationBadge("MO absent des métaux", moQuery.data?.count, true)}
              {validationBadge("MO_METAL exclu", moMetalQuery.data?.count, true)}
            </CardContent>
          </Card>
        </section>

        <MetauxTable
          rows={rows}
          loading={isLoading}
          limit={limit}
          offset={offset}
          totalCount={count}
          hasMore={data?.metadata?.has_more}
          onPageChange={(nextOffset) => setFilters((current) => ({ ...current, offset: nextOffset }))}
        />
      </div>
    </main>
  );
}
