import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import {
  buildMapEntitiesEndpoint,
  describeMapApiError,
  type MapBusinessCatalog,
  type MapBusinessFeature,
  type MapEntitiesFilters,
} from "@/api/mapBusiness";
import { BusinessMap } from "@/components/DashboardMetier/BusinessMap";
import { BusinessSidebar } from "@/components/DashboardMetier/BusinessSidebar";
import { EntityDetailsPanel } from "@/components/DashboardMetier/EntityDetailsPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMapCatalog, useMapEntities } from "@/hooks/useMapBusiness";

function resolveDefaultSelection(catalog: MapBusinessCatalog): { group_code: string; support_code: string } | null {
  const preferredGroup = catalog.groups.find((group) => group.group_code === "stations");
  const preferredSupport = preferredGroup?.supports.find((support) => support.support_code === "barrage");
  if (preferredGroup && preferredSupport) {
    return { group_code: preferredGroup.group_code, support_code: preferredSupport.support_code };
  }

  for (const group of catalog.groups) {
    const support = group.supports.find((item) => item.data_status !== "NOT_YET_MAPPED");
    if (support) return { group_code: group.group_code, support_code: support.support_code };
  }

  return null;
}

export default function DashboardCartoMetier() {
  const [selectedGroupCode, setSelectedGroupCode] = useState<string>();
  const [selectedSupportCode, setSelectedSupportCode] = useState<string>();
  const [selectedParameterCode, setSelectedParameterCode] = useState("");
  const [limit, setLimit] = useState(1000);
  const [entitiesVisible, setEntitiesVisible] = useState(true);
  const [symbologyMode, setSymbologyMode] = useState<"classification" | "metadata">("classification");
  const [submittedFilters, setSubmittedFilters] = useState<MapEntitiesFilters | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<MapBusinessFeature | null>(null);

  const catalogQuery = useMapCatalog();
  const entitiesQuery = useMapEntities(submittedFilters, Boolean(submittedFilters));

  const selectedSupport = useMemo(() => {
    return catalogQuery.data?.groups
      .find((group) => group.group_code === selectedGroupCode)
      ?.supports.find((support) => support.support_code === selectedSupportCode);
  }, [catalogQuery.data, selectedGroupCode, selectedSupportCode]);

  useEffect(() => {
    if (!catalogQuery.data || selectedGroupCode || selectedSupportCode) return;
    const defaultSelection = resolveDefaultSelection(catalogQuery.data);
    if (!defaultSelection) return;

    setSelectedGroupCode(defaultSelection.group_code);
    setSelectedSupportCode(defaultSelection.support_code);
    setSelectedParameterCode("");
    setSubmittedFilters({
      group_code: defaultSelection.group_code,
      support_code: defaultSelection.support_code,
      limit,
    });
  }, [catalogQuery.data, limit, selectedGroupCode, selectedSupportCode]);

  const handleSelectGroup = (groupCode: string) => {
    setSelectedGroupCode(groupCode);
    const firstSupport = catalogQuery.data?.groups.find((group) => group.group_code === groupCode)?.supports[0];
    setSelectedSupportCode(firstSupport?.support_code);
    setSelectedParameterCode("");
    setSelectedFeature(null);
  };

  const handleSelectSupport = (groupCode: string, supportCode: string) => {
    setSelectedGroupCode(groupCode);
    setSelectedSupportCode(supportCode);
    setSelectedParameterCode("");
    setSelectedFeature(null);
  };

  const handleDisplay = () => {
    if (!selectedGroupCode || !selectedSupportCode) return;
    setSelectedFeature(null);
    setSubmittedFilters({
      group_code: selectedGroupCode,
      support_code: selectedSupportCode,
      parameter_code: selectedParameterCode || undefined,
      limit,
    });
  };

  const entityCount = entitiesQuery.data?.features.length ?? 0;
  const apiError = catalogQuery.error || entitiesQuery.error;
  const apiErrorDetails = apiError ? describeMapApiError(apiError) : null;
  const endpointCalled = submittedFilters ? buildMapEntitiesEndpoint(submittedFilters) : "/api/v1/map/catalog";

  return (
    <div className="flex h-[calc(100vh-72px)] min-h-[760px] bg-slate-100">
      <div className="w-[330px] shrink-0">
        <BusinessSidebar
          catalog={catalogQuery.data}
          catalogLoading={catalogQuery.isLoading}
          selectedGroupCode={selectedGroupCode}
          selectedSupportCode={selectedSupportCode}
          selectedParameterCode={selectedParameterCode}
          limit={limit}
          entitiesVisible={entitiesVisible}
          loadingEntities={entitiesQuery.isFetching}
          onSelectGroup={handleSelectGroup}
          onSelectSupport={handleSelectSupport}
          onParameterChange={setSelectedParameterCode}
          onLimitChange={(value) => setLimit(Math.min(Math.max(Number.isFinite(value) ? value : 1000, 1), 5000))}
          onEntitiesVisibleChange={setEntitiesVisible}
          onDisplay={handleDisplay}
        />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-950">Carte metier qualite / pollution</h2>
              <Badge variant="outline">P0</Badge>
              <Badge className="bg-amber-500 text-white hover:bg-amber-500">donnees en validation</Badge>
            </div>
            <div className="mt-1 text-sm text-slate-600">
              {selectedSupport
                ? `${selectedSupport.label} - ${selectedSupport.source_backend || "source non renseignee"}`
                : "Selectionner un support metier pour demarrer."}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-sky-500"
              value={symbologyMode}
              onChange={(event) => setSymbologyMode(event.target.value as "classification" | "metadata")}
            >
              <option value="classification">Symbologie reglementaire</option>
              <option value="metadata">Symbologie metadata</option>
            </select>
            <Button variant="outline" size="sm" onClick={() => entitiesQuery.refetch()} disabled={!submittedFilters || entitiesQuery.isFetching}>
              Rafraichir
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            <div className="text-xs uppercase text-slate-500">Entites affichees</div>
            <div className="mt-1 text-xl font-semibold text-slate-950">{entityCount.toLocaleString("fr-MA")}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            <div className="text-xs uppercase text-slate-500">Filtre parametre</div>
            <div className="mt-1 flex items-center gap-2 font-semibold text-slate-950">
              {selectedParameterCode || "Tous"}
              {selectedParameterCode && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            <div className="text-xs uppercase text-slate-500">Statut API</div>
            <div className="mt-1 flex items-center gap-2 font-semibold text-slate-950">
              {catalogQuery.isError || entitiesQuery.isError ? "Erreur" : "OK DEV"}
              {(catalogQuery.isError || entitiesQuery.isError) && <AlertTriangle className="h-4 w-4 text-red-600" />}
            </div>
          </div>
        </div>

        {apiErrorDetails && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <div className="font-semibold">Erreur API</div>
            <div className="mt-1 grid gap-1 text-xs">
              <div>
                <span className="font-medium">Endpoint : </span>
                <code>{endpointCalled}</code>
              </div>
              <div>
                <span className="font-medium">Parametres : </span>
                <code>{JSON.stringify(submittedFilters ?? { endpoint: "catalog" })}</code>
              </div>
              <div>
                <span className="font-medium">HTTP : </span>
                {apiErrorDetails.status ?? "n/a"}
              </div>
              <div>
                <span className="font-medium">Message : </span>
                {apiErrorDetails.message}
              </div>
            </div>
          </div>
        )}

        <div className="min-h-0 flex-1">
          <BusinessMap
            data={entitiesQuery.data}
            loading={entitiesQuery.isFetching}
            error={entitiesQuery.error as Error | null}
            entitiesVisible={entitiesVisible}
            symbologyMode={symbologyMode}
            onFeatureSelect={setSelectedFeature}
          />
        </div>
      </main>

      <div className="w-[360px] shrink-0">
        <EntityDetailsPanel feature={selectedFeature} />
      </div>
    </div>
  );
}
