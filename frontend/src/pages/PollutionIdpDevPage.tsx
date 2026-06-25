import { useMemo, useState } from "react";

import {
  P0_POLLUTION_PARAMETERS,
  type PollutionIdpFilters,
  type PollutionP0Parameter,
  type PollutionSymbologyMode,
} from "@/api/pollutionIdp";
import PollutionIdpMap from "@/components/pollution/PollutionIdpMap";
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
import { usePollutionIdp } from "@/hooks/usePollutionIdp";

const ALL = "__all";

const DEFAULT_FILTERS: PollutionIdpFilters = {
  limit: 5000,
};

function setOptional(value: string) {
  return value === ALL || value.trim() === "" ? undefined : value;
}

export default function PollutionIdpDevPage() {
  const [filters, setFilters] = useState<PollutionIdpFilters>(DEFAULT_FILTERS);
  const [symbologyMode, setSymbologyMode] = useState<PollutionSymbologyMode>("validation_status");
  const query = usePollutionIdp(filters);
  const features = query.data?.features ?? [];

  const sourceTypes = useMemo(() => {
    const values = new Set<string>();
    features.forEach((feature) => {
      const value = feature.properties.source_type_code || feature.properties.source_type_label;
      if (value) values.add(value);
    });
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [features]);

  const communes = useMemo(() => {
    const values = new Set<string>();
    features.forEach((feature) => {
      if (feature.properties.commune) values.add(feature.properties.commune);
    });
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [features]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
        <section className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 lg:flex-row lg:items-end">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">DEV uniquement</Badge>
              <Badge variant="outline">Donnees en cours de validation</Badge>
              <Badge variant="outline">Non pre-production</Badge>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Pollution IDP - couche MapLibre DEV</h1>
            <p className="mt-1 text-sm text-slate-600">
              Couche isolee consommant <code>/api/v1/pollution/sites.geojson</code>. Les dashboards existants ne sont pas remplaces.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={query.error ? "destructive" : "default"}>
              {query.error ? "ERREUR API" : query.isFetching ? "REFRESH" : "API OK"}
            </Badge>
            <Button type="button" variant="outline" onClick={() => query.refetch()}>
              Rafraichir
            </Button>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sites affiches</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{features.length.toLocaleString("fr-MA")}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Parametre</CardTitle>
            </CardHeader>
            <CardContent className="text-lg font-semibold">{filters.parameter_code ?? "Tous"}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Communes chargees</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{communes.length.toLocaleString("fr-MA")}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Limite</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{filters.limit?.toLocaleString("fr-MA")}</CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Filtres DEV</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-6">
            <Select
              value={filters.parameter_code ?? ALL}
              onValueChange={(value) =>
                setFilters((current) => ({
                  ...current,
                  parameter_code: setOptional(value) as PollutionP0Parameter | undefined,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Parametre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tous parametres</SelectItem>
                {P0_POLLUTION_PARAMETERS.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.source_type_code ?? ALL}
              onValueChange={(value) =>
                setFilters((current) => ({
                  ...current,
                  source_type_code: setOptional(value),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Typologie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Toutes typologies</SelectItem>
                {sourceTypes.slice(0, 150).map((sourceType) => (
                  <SelectItem key={sourceType} value={sourceType}>
                    {sourceType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.commune ?? ALL}
              onValueChange={(value) =>
                setFilters((current) => ({
                  ...current,
                  commune: setOptional(value),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Commune" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Toutes communes</SelectItem>
                {communes.slice(0, 200).map((commune) => (
                  <SelectItem key={commune} value={commune}>
                    {commune}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              aria-label="Limite"
              type="number"
              min={100}
              max={10000}
              step={100}
              value={filters.limit ?? 5000}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  limit: Math.min(Math.max(Number(event.target.value) || 5000, 1), 10000),
                }))
              }
            />

            <Select
              value={symbologyMode}
              onValueChange={(value) => setSymbologyMode(value as PollutionSymbologyMode)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Symbologie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="validation_status">Statut validation</SelectItem>
                <SelectItem value="regulatory_status">Statut reglementaire</SelectItem>
              </SelectContent>
            </Select>

            <Button type="button" variant="outline" onClick={() => setFilters(DEFAULT_FILTERS)}>
              Reinitialiser
            </Button>
          </CardContent>
        </Card>

        <PollutionIdpMap
          data={query.data}
          loading={query.isLoading}
          error={query.error as Error | null}
          symbologyMode={symbologyMode}
        />
      </div>
    </main>
  );
}
