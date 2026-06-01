import { Database, MapPinned, Play } from "lucide-react";

import type { MapBusinessCatalog, MapBusinessGroup, MapBusinessSupport } from "@/api/mapBusiness";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { LayerTogglePanel } from "./LayerTogglePanel";
import { ParameterSelector } from "./ParameterSelector";

interface BusinessSidebarProps {
  catalog?: MapBusinessCatalog;
  catalogLoading?: boolean;
  selectedGroupCode?: string;
  selectedSupportCode?: string;
  selectedParameterCode?: string;
  limit: number;
  entitiesVisible: boolean;
  loadingEntities?: boolean;
  onSelectGroup: (groupCode: string) => void;
  onSelectSupport: (groupCode: string, supportCode: string) => void;
  onParameterChange: (parameterCode: string) => void;
  onLimitChange: (limit: number) => void;
  onEntitiesVisibleChange: (visible: boolean) => void;
  onDisplay: () => void;
}

function findSelectedSupport(
  catalog: MapBusinessCatalog | undefined,
  groupCode: string | undefined,
  supportCode: string | undefined
): MapBusinessSupport | null {
  if (!catalog || !groupCode || !supportCode) return null;
  return catalog.groups
    .find((group) => group.group_code === groupCode)
    ?.supports.find((support) => support.support_code === supportCode) ?? null;
}

function groupIcon(group: MapBusinessGroup) {
  return group.group_code === "stations" ? <MapPinned className="h-4 w-4" /> : <Database className="h-4 w-4" />;
}

export function BusinessSidebar({
  catalog,
  catalogLoading,
  selectedGroupCode,
  selectedSupportCode,
  selectedParameterCode = "",
  limit,
  entitiesVisible,
  loadingEntities,
  onSelectGroup,
  onSelectSupport,
  onParameterChange,
  onLimitChange,
  onEntitiesVisibleChange,
  onDisplay,
}: BusinessSidebarProps) {
  const selectedSupport = findSelectedSupport(catalog, selectedGroupCode, selectedSupportCode);
  const canDisplay = Boolean(selectedGroupCode && selectedSupportCode && selectedSupport?.data_status !== "NOT_YET_MAPPED");

  return (
    <aside className="flex h-full min-h-0 w-full flex-col gap-4 overflow-auto border-r border-slate-200 bg-white p-4">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-base font-semibold text-slate-950">Dashboard carto metier</h1>
          <Badge className="bg-sky-700 text-white hover:bg-sky-700">DEV</Badge>
        </div>
        <p className="mt-1 text-xs leading-5 text-slate-600">Support metier, parametre, carte et classification.</p>
      </div>

      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Supports</div>
        {catalogLoading && <div className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">Chargement catalogue...</div>}
        {!catalogLoading && catalog && catalog.groups.length === 0 && (
          <div className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">Aucun groupe metier expose par le catalogue.</div>
        )}
        {catalog?.groups.map((group) => (
          <div key={group.group_code} className="rounded-lg border border-slate-200">
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-2 rounded-t-lg px-3 py-2 text-left text-sm font-semibold",
                selectedGroupCode === group.group_code ? "bg-sky-50 text-sky-900" : "bg-slate-50 text-slate-800"
              )}
              onClick={() => onSelectGroup(group.group_code)}
            >
              {groupIcon(group)}
              {group.group_label}
            </button>
            <div className="space-y-1 p-2">
              {group.supports.map((support) => {
                const active = selectedGroupCode === group.group_code && selectedSupportCode === support.support_code;
                return (
                  <button
                    key={`${group.group_code}.${support.support_code}`}
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm",
                      active ? "bg-sky-600 text-white" : "text-slate-700 hover:bg-slate-100"
                    )}
                    onClick={() => onSelectSupport(group.group_code, support.support_code)}
                  >
                    <span className="truncate">{support.label}</span>
                    {support.data_status === "NOT_YET_MAPPED" && (
                      <span className={cn("text-[10px]", active ? "text-sky-100" : "text-slate-500")}>non mappe</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="text-sm font-semibold text-slate-900">Filtres P0</div>
        <ParameterSelector support={selectedSupport} value={selectedParameterCode} onChange={onParameterChange} />
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium text-slate-700">Limite</span>
          <Input
            type="number"
            min={1}
            max={5000}
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
          />
        </label>
        <Button className="w-full gap-2" onClick={onDisplay} disabled={!canDisplay || loadingEntities}>
          <Play className="h-4 w-4" />
          {loadingEntities ? "Chargement..." : "Afficher"}
        </Button>
        {selectedSupport?.description && <p className="text-xs leading-5 text-slate-600">{selectedSupport.description}</p>}
      </div>

      <LayerTogglePanel entitiesVisible={entitiesVisible} onEntitiesVisibleChange={onEntitiesVisibleChange} />
    </aside>
  );
}
