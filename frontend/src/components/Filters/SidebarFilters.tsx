import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Radar, Search } from "lucide-react";
import { DEFAULT_TOGGLES } from "@/layers/config";
import { api } from "@/api/client";

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

interface StationItem {
  id: string | number;
  name?: string | null;
}

type SectionKey =
  | "stations"
  | "stationsList"
  | "infra";

type ListItem = {
  id: string;
  label: string;
};

function groupLabel(key: string): string {
  const labels: Record<string, string> = {
    stms: "Stations de mesure",
    steps: "Stations d'epuration (STEP)",
    steps_industrielles: "STEP industrielles",
    decharges: "Decharges",
    decharges_abandonnees: "Decharges abandonnees",
    rejets_brutes: "Rejets brutes",
    rejet_abattoir: "Rejets abattoirs",
    huileries: "Huileries",
    mines: "Mines",
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
    stations: false,
    stationsList: false,
    infra: false,
  });

  const [listStations, setListStations] = useState<ListItem[]>([]);

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
          const stFallback = await api.get<StationItem[]>("/stations?limit=2000");
          if (!alive) return;
          setListStations(
            (stFallback.data ?? []).map((x) => ({
              id: String(x.id),
              label: (x.name ?? "").trim() || `Station ${x.id}`,
            }))
          );
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

  const stationToggleKeys = ["stms"];
  const infraToggleKeys = [
    "steps",
    "steps_industrielles",
    "decharges",
    "decharges_abandonnees",
    "rejets_brutes",
    "rejet_abattoir",
    "huileries",
    "mines",
  ];

  const selectedStations = Object.values(localLayers.stations_list).filter(Boolean).length;

  return (
    <aside className="overflow-hidden rounded-[30px] border border-emerald-100/15 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.18),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.14),transparent_28%),linear-gradient(180deg,#083344_0%,#115e59_42%,#1f2937_100%)] shadow-[0_28px_90px_-34px_rgba(8,15,30,0.96)] backdrop-blur-xl">
      <div className="max-h-[calc(100vh-140px)] space-y-4 overflow-y-auto p-4">
        <CollapsibleBlock
          title="Stations"
          count={stationToggleKeys.filter((key) => localLayers.toggles[key]).length}
          iconColor="bg-cyan-400"
          open={openSections.stations}
          onToggle={() => toggleSection("stations")}
        >
          <LayerRowWithList
            checked={!!localLayers.toggles.stms}
            label={groupLabel("stms")}
            listOpen={openSections.stationsList}
            listCount={selectedStations}
            onCheckedChange={(checked) => {
              toggleLayerKey("stms", checked);
              if (checked) onZoomLayer?.("stms");
            }}
            onToggleList={() => toggleSection("stationsList")}
          >
            <SearchableChecklist
              items={listStations}
              value={localLayers.stations_list}
              onChange={(next) => {
                setAndSyncLayers((prev) => ({
                  ...prev,
                  stations_list: next,
                  toggles: { ...prev.toggles, stms: true },
                }));
                const ids = Object.keys(next).filter((id) => next[id]);
                if (ids.length && onSelectFilter) onSelectFilter("station", ids);
              }}
              placeholder="Rechercher une station..."
            />
          </LayerRowWithList>
        </CollapsibleBlock>

        <CollapsibleBlock
          title="Infrastructure"
          count={infraToggleKeys.filter((key) => localLayers.toggles[key]).length}
          iconColor="bg-emerald-400"
          open={openSections.infra}
          onToggle={() => toggleSection("infra")}
        >
          <div className="space-y-1">
            {infraToggleKeys.map((key) => (
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
