import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Radar, Search } from "lucide-react";
import { DEFAULT_TOGGLES } from "@/layers/config";
import { api } from "@/api/client";
import type { AxiosResponse } from "axios";

export type LayersState = {
  toggles: Record<string, boolean>;
  barrages_list: Record<string, boolean>;
  sous_bassins_list: Record<string, boolean>;
  stations_list: Record<string, boolean>;
  zones_admin_list: Record<string, boolean>;
};

export type SidebarFiltersProps = {
  range: { from: string; to: string };
  setRange: React.Dispatch<React.SetStateAction<{ from: string; to: string }>>;
  layers: LayersState;
  setLayers: React.Dispatch<React.SetStateAction<LayersState>>;
  onApply: () => void;
  onSelectFilter?: (type: string, ids: string | string[]) => void;
  onZoomLayer?: (layerKey: string) => void;
};

interface NameItem {
  id: string | number;
  label: string;
}

interface StationItem {
  id: string | number;
  name?: string | null;
}

type SectionKey =
  | "hydro"
  | "administratif"
  | "infra"
  | "sousBassins"
  | "barrages"
  | "stations";

type ListItem = {
  id: string;
  label: string;
};

function groupLabel(key: string): string {
  const labels: Record<string, string> = {
    bassin_sebou: "Bassin versant",
    sous_bassin_sebou: "Sous-bassins",
    reseau_hydro_abhs: "Reseau hydrographique",
    barrages_abhs: "Barrages",
    stations_abhs: "Stations hydrologiques",
    points_eau: "Points d'eau",
    step_industrielles: "STEP industrielles",
    stm: "STM",
    adm_regions_abhs: "Regions",
    adm_provinces_abhs: "Provinces",
    adm_cercles_abhs: "Cercles",
    adm_communes_abhs: "Communes",
    adm_villes_abhs: "Villes",
    adm_douars_abhs: "Douars",
  };
  return labels[key] ?? key.replace(/_/g, " ");
}

function CollapsibleBlock({
  title,
  count,
  iconColor,
  open,
  onToggle,
  children,
}: {
  title: string;
  count?: number;
  iconColor: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-100/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-white/[0.08]"
      >
        <div className="flex items-center gap-3">
          <span className={`h-2.5 w-2.5 rounded-full shadow-[0_0_14px_currentColor] ${iconColor}`} />
          <span className="font-semibold tracking-[0.01em] text-white">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          {typeof count === "number" && (
            <span className="rounded-full border border-emerald-100/10 bg-slate-950/25 px-2.5 py-1 text-xs text-emerald-50">
              {count}
            </span>
          )}
          {open ? (
            <ChevronDown className="h-4 w-4 text-slate-300" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-300" />
          )}
        </div>
      </button>
      {open && <div className="border-t border-emerald-100/10 bg-slate-950/15 px-3 py-3">{children}</div>}
    </div>
  );
}

function LayerCheckbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm text-slate-100 transition hover:border-emerald-200/10 hover:bg-emerald-300/[0.08]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-white/20 bg-transparent text-secondary focus:ring-secondary"
      />
      <span className="font-medium text-slate-100/95">{label}</span>
    </label>
  );
}

function SearchableChecklist({
  items,
  value,
  onChange,
  placeholder,
  height = 180,
}: {
  items: ListItem[];
  value: Record<string, boolean>;
  onChange: (next: Record<string, boolean>) => void;
  placeholder: string;
  height?: number;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  const selectedCount = Object.values(value).filter(Boolean).length;

  const toggleOne = (id: string, checked: boolean) => {
    const next = { ...value };
    if (checked) next[id] = true;
    else delete next[id];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-emerald-100/10 bg-slate-950/55 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-amber-300/50 focus:bg-slate-950/75"
        />
      </div>

      <div className="text-xs font-medium text-slate-400">
        {selectedCount} selectionne(s) • {filtered.length} visible(s)
      </div>

      <div
        className="space-y-1 overflow-auto rounded-xl border border-emerald-100/10 bg-slate-950/40 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
        style={{ maxHeight: height }}
      >
        {filtered.map((item) => (
          <label
            key={item.id}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-2 py-2 text-sm text-slate-100 transition hover:border-emerald-100/10 hover:bg-emerald-300/[0.08]"
          >
            <input
              type="checkbox"
              checked={!!value[item.id]}
              onChange={(e) => toggleOne(item.id, e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-transparent text-secondary focus:ring-secondary"
            />
            <span className="truncate">{item.label}</span>
          </label>
        ))}
        {!filtered.length && <div className="px-2 py-3 text-sm text-slate-400">Aucun resultat</div>}
      </div>
    </div>
  );
}

function LayerRowWithList({
  checked,
  label,
  listOpen,
  listCount,
  onCheckedChange,
  onToggleList,
  children,
}: {
  checked: boolean;
  label: string;
  listOpen: boolean;
  listCount: number;
  onCheckedChange: (checked: boolean) => void;
  onToggleList: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-emerald-100/10 bg-[linear-gradient(180deg,rgba(20,35,62,0.55),rgba(12,25,47,0.35))]">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-sm text-slate-100">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-transparent text-secondary focus:ring-secondary"
          />
          <span className="truncate font-medium text-slate-100/95">{label}</span>
        </label>

        <button
          type="button"
          onClick={onToggleList}
          className="flex items-center gap-2 rounded-lg border border-amber-200/20 bg-amber-300/10 px-2.5 py-1.5 text-xs font-medium text-amber-50 transition hover:border-amber-200/35 hover:bg-amber-300/15"
        >
          <span>Liste</span>
          <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300">
            {listCount}
          </span>
          {listOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
      </div>

      {listOpen && <div className="border-t border-emerald-100/10 bg-slate-950/10 px-3 pb-3 pt-3">{children}</div>}
    </div>
  );
}

export default function SidebarFilters({
  layers,
  setLayers,
  onSelectFilter,
  onZoomLayer,
}: SidebarFiltersProps) {
  const [localLayers, setLocalLayers] = useState<LayersState>({
    toggles: { ...(layers.toggles || DEFAULT_TOGGLES) },
    barrages_list: layers.barrages_list || {},
    sous_bassins_list: layers.sous_bassins_list || {},
    stations_list: layers.stations_list || {},
    zones_admin_list: layers.zones_admin_list || {},
  });

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    hydro: false,
    administratif: false,
    infra: false,
    sousBassins: false,
    barrages: false,
    stations: false,
  });

  const [listBarrages, setListBarrages] = useState<ListItem[]>([]);
  const [listStations, setListStations] = useState<ListItem[]>([]);
  const [listSousBassins, setListSousBassins] = useState<ListItem[]>([]);

  useEffect(() => {
    setLocalLayers({
      toggles: { ...(layers.toggles || DEFAULT_TOGGLES) },
      barrages_list: layers.barrages_list || {},
      sous_bassins_list: layers.sous_bassins_list || {},
      stations_list: layers.stations_list || {},
      zones_admin_list: layers.zones_admin_list || {},
    });
  }, [layers]);

  useEffect(() => {
    let alive = true;

    async function fetchLists() {
      try {
        const [sb, br]: [AxiosResponse<NameItem[]>, AxiosResponse<NameItem[]>] = await Promise.all([
          api.get("/names/sous-bassins"),
          api.get("/names/barrages"),
        ]);

        if (!alive) return;

        setListSousBassins((sb.data ?? []).map((x) => ({ id: String(x.id), label: x.label })));
        setListBarrages((br.data ?? []).map((x) => ({ id: String(x.id), label: x.label })));

        try {
          const st = await api.get<StationItem[]>("/stations?with_data=true&limit=2000", {
            timeout: 20000,
          });
          if (!alive) return;
          setListStations(
            (st.data ?? []).map((x) => ({
              id: String(x.id),
              label: (x.name ?? "").trim() || `Station ${x.id}`,
            }))
          );
        } catch {
          const stFallback = await api.get<NameItem[]>("/names/stations");
          if (!alive) return;
          setListStations((stFallback.data ?? []).map((x) => ({ id: String(x.id), label: x.label })));
        }
      } catch (err) {
        console.error("Erreur chargement listes :", err);
      }
    }

    fetchLists();
    return () => {
      alive = false;
    };
  }, []);

  const setAndSyncLayers = (updater: (prev: LayersState) => LayersState) => {
    setLocalLayers((prev) => {
      const next = updater(prev);
      setLayers(next);
      return next;
    });
  };

  const toggleSection = (key: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleLayerKey = (key: string, checked: boolean) => {
    setAndSyncLayers((prev) => ({
      ...prev,
      toggles: { ...prev.toggles, [key]: checked },
    }));
  };

  const adminToggleKeys = [
    "adm_regions_abhs",
    "adm_provinces_abhs",
    "adm_cercles_abhs",
    "adm_communes_abhs",
    "adm_villes_abhs",
    "adm_douars_abhs",
  ];

  const hydroToggleKeys = ["bassin_sebou", "sous_bassin_sebou", "reseau_hydro_abhs"];
  const infraToggleKeys = ["barrages_abhs", "stations_abhs", "points_eau", "step_industrielles", "stm"];

  const selectedSousBassins = Object.values(localLayers.sous_bassins_list).filter(Boolean).length;
  const selectedBarrages = Object.values(localLayers.barrages_list).filter(Boolean).length;
  const selectedStations = Object.values(localLayers.stations_list).filter(Boolean).length;

  return (
    <aside className="overflow-hidden rounded-[30px] border border-emerald-100/15 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.18),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.14),transparent_28%),linear-gradient(180deg,#083344_0%,#115e59_42%,#1f2937_100%)] shadow-[0_28px_90px_-34px_rgba(8,15,30,0.96)] backdrop-blur-xl">
      <div className="max-h-[calc(100vh-140px)] space-y-4 overflow-y-auto p-4">
        <CollapsibleBlock
          title="Geo"
          count={hydroToggleKeys.filter((key) => localLayers.toggles[key]).length}
          iconColor="bg-cyan-400"
          open={openSections.hydro}
          onToggle={() => toggleSection("hydro")}
        >
          <div className="space-y-2">
            <LayerCheckbox
              checked={!!localLayers.toggles.bassin_sebou}
              label={groupLabel("bassin_sebou")}
              onChange={(checked) => {
                toggleLayerKey("bassin_sebou", checked);
                if (checked) onZoomLayer?.("bassin_sebou");
              }}
            />

            <LayerRowWithList
              checked={!!localLayers.toggles.sous_bassin_sebou}
              label={groupLabel("sous_bassin_sebou")}
              listOpen={openSections.sousBassins}
              listCount={selectedSousBassins}
              onCheckedChange={(checked) => {
                toggleLayerKey("sous_bassin_sebou", checked);
                if (checked) onZoomLayer?.("sous_bassin_sebou");
              }}
              onToggleList={() => toggleSection("sousBassins")}
            >
              <SearchableChecklist
                items={listSousBassins}
                value={localLayers.sous_bassins_list}
                onChange={(next) => {
                  setAndSyncLayers((prev) => ({
                    ...prev,
                    sous_bassins_list: next,
                    toggles: { ...prev.toggles, sous_bassin_sebou: true },
                  }));
                  const ids = Object.keys(next).filter((id) => next[id]);
                  if (ids.length && onSelectFilter) onSelectFilter("sous-bassin", ids);
                }}
                placeholder="Rechercher un sous-bassin..."
              />
            </LayerRowWithList>

            <LayerCheckbox
              checked={!!localLayers.toggles.reseau_hydro_abhs}
              label={groupLabel("reseau_hydro_abhs")}
              onChange={(checked) => {
                toggleLayerKey("reseau_hydro_abhs", checked);
                if (checked) onZoomLayer?.("reseau_hydro_abhs");
              }}
            />
          </div>
        </CollapsibleBlock>

        <CollapsibleBlock
          title="Infra"
          count={infraToggleKeys.filter((key) => localLayers.toggles[key]).length}
          iconColor="bg-emerald-400"
          open={openSections.infra}
          onToggle={() => toggleSection("infra")}
        >
          <div className="space-y-2">
            <LayerRowWithList
              checked={!!localLayers.toggles.barrages_abhs}
              label={groupLabel("barrages_abhs")}
              listOpen={openSections.barrages}
              listCount={selectedBarrages}
              onCheckedChange={(checked) => {
                toggleLayerKey("barrages_abhs", checked);
                if (checked) onZoomLayer?.("barrages_abhs");
              }}
              onToggleList={() => toggleSection("barrages")}
            >
              <SearchableChecklist
                items={listBarrages}
                value={localLayers.barrages_list}
                onChange={(next) => {
                  setAndSyncLayers((prev) => ({
                    ...prev,
                    barrages_list: next,
                    toggles: { ...prev.toggles, barrages_abhs: true },
                  }));
                  const ids = Object.keys(next).filter((id) => next[id]);
                  if (ids.length && onSelectFilter) onSelectFilter("barrage", ids);
                }}
                placeholder="Rechercher un barrage..."
              />
            </LayerRowWithList>

            <LayerRowWithList
              checked={!!localLayers.toggles.stations_abhs}
              label={groupLabel("stations_abhs")}
              listOpen={openSections.stations}
              listCount={selectedStations}
              onCheckedChange={(checked) => {
                toggleLayerKey("stations_abhs", checked);
                if (checked) onZoomLayer?.("stations_abhs");
              }}
              onToggleList={() => toggleSection("stations")}
            >
              <SearchableChecklist
                items={listStations}
                value={localLayers.stations_list}
                onChange={(next) => {
                  setAndSyncLayers((prev) => ({
                    ...prev,
                    stations_list: next,
                    toggles: { ...prev.toggles, stations_abhs: true },
                  }));
                  const ids = Object.keys(next).filter((id) => next[id]);
                  if (ids.length && onSelectFilter) onSelectFilter("station", ids);
                }}
                placeholder="Rechercher une station..."
              />
            </LayerRowWithList>

            <LayerCheckbox
              checked={!!localLayers.toggles.points_eau}
              label={groupLabel("points_eau")}
              onChange={(checked) => {
                toggleLayerKey("points_eau", checked);
                if (checked) onZoomLayer?.("points_eau");
              }}
            />

            <LayerCheckbox
              checked={!!localLayers.toggles.step_industrielles}
              label={groupLabel("step_industrielles")}
              onChange={(checked) => {
                toggleLayerKey("step_industrielles", checked);
                if (checked) onZoomLayer?.("step_industrielles");
              }}
            />

            <LayerCheckbox
              checked={!!localLayers.toggles.stm}
              label={groupLabel("stm")}
              onChange={(checked) => {
                toggleLayerKey("stm", checked);
                if (checked) onZoomLayer?.("stm");
              }}
            />
          </div>
        </CollapsibleBlock>

        <CollapsibleBlock
          title="Administratif"
          count={adminToggleKeys.filter((key) => localLayers.toggles[key]).length}
          iconColor="bg-amber-400"
          open={openSections.administratif}
          onToggle={() => toggleSection("administratif")}
        >
          <div className="space-y-1">
            {adminToggleKeys.map((key) => (
              <LayerCheckbox
                key={key}
                checked={!!localLayers.toggles[key]}
                label={groupLabel(key)}
                onChange={(checked) => {
                  toggleLayerKey(key, checked);
                  if (checked) onZoomLayer?.(key);
                }}
              />
            ))}
          </div>
        </CollapsibleBlock>

        <div className="rounded-2xl border border-emerald-100/10 bg-[linear-gradient(180deg,rgba(251,191,36,0.12),rgba(8,15,30,0.72))] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
              <Radar className="h-4 w-4 text-emerald-300" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Etat des couches</div>
              <div className="text-xs font-medium text-slate-400">
                {Object.values(localLayers.toggles).filter(Boolean).length} couches visibles
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
