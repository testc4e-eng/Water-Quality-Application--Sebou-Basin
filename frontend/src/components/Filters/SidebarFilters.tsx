import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Droplets,
  Factory,
  Layers,
  Map as MapIcon,
  MapPin,
  Radar,
  Search,
  Grid,
  Square,
  SlidersHorizontal,
} from "lucide-react";
import { DEFAULT_TOGGLES, DEFAULT_FILL_MODES, GEO_LAYERS, type GeoLayerType } from "@/layers/config";
import { api } from "@/api/client";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
export type LayersState = {
  toggles: Record<string, boolean>;
  fill_modes: Record<string, "solid" | "outline">;
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

interface NamedItem {
  id: string | number;
  name?: string | null;
  label?: string | null;
}

type ListItem = { id: string; label: string };

/* ─────────────────────────────────────────────
   LAYER GROUPS CONFIG
   (ordre = ordre d'affichage dans le menu)
───────────────────────────────────────────── */
type LayerDef = {
  key: string;
  label: string;
  /** Clé de la liste de filtrage (optionnel) */
  listKey?: "stations_list" | "barrages_list" | "sous_bassins_list";
};

type GroupDef = {
  id: string;
  title: string;
  iconColor: string;
  Icon: React.FC<{ className?: string }>;
  layers: LayerDef[];
};

const LAYER_GROUPS: GroupDef[] = [
  {
    id: "geo",
    title: "Géographie du bassin",
    iconColor: "bg-teal-400",
    Icon: MapIcon,
    layers: [
      { key: "bassin_sebou", label: "Bassin versant du Sebou" },
      { key: "sous_bassin_sebou", label: "Sous-bassins ABH" },
      { key: "sous_bassins_swat", label: "Sous-bassins métier (SWAT)" },
      { key: "reseau_hydro_abhs", label: "Réseau hydrographique" },
      { key: "nappes", label: "Nappes souterraines" },
      { key: "sources", label: "Sources d'eau" },
    ],
  },
  {
    id: "stations",
    title: "Stations de mesure",
    iconColor: "bg-cyan-400",
    Icon: MapPin,
    layers: [
      { key: "stations_abhs", label: "Stations hydrologiques / qualité" },
      { key: "points_eau", label: "Points d'eau souterraine" },
    ],
  },
  {
    id: "infra",
    title: "Infrastructure",
    iconColor: "bg-emerald-400",
    Icon: Droplets,
    layers: [
      { key: "barrages_abhs", label: "Barrages" },
      { key: "step_abhs", label: "STEP" },
      { key: "step_industrielles", label: "STEP industrielles" },
      { key: "stm", label: "Stations de traitement (STM)" },
      { key: "fosses_septiques_abhs", label: "Fosses septiques" },
      { key: "decharges_abhs", label: "Décharges" },
      { key: "huileries_abhs", label: "Huileries" },
      { key: "mines_abhs", label: "Mines" },
      { key: "rejets_industriels_abhs", label: "Rejets industriels" },
      { key: "rejets_domestiques_abhs", label: "Rejets domestiques" },
    ],
  },
  {
    id: "admin",
    title: "Découpages administratifs",
    iconColor: "bg-amber-400",
    Icon: Layers,
    layers: [
      { key: "adm_regions_abhs", label: "Régions" },
      { key: "adm_provinces_abhs", label: "Provinces / Préfectures" },
      { key: "adm_cercles_abhs", label: "Cercles" },
      { key: "adm_communes_abhs", label: "Communes" },
      { key: "adm_villes_abhs", label: "Villes" },
      { key: "adm_douars_abhs", label: "Douars" },
    ],
  },
  {
    id: "pollution",
    title: "Sources de pollution",
    iconColor: "bg-rose-400",
    Icon: Factory,
    layers: [
      { key: "step_industrielles", label: "STEP industrielles" },
      { key: "stm", label: "STM (Stations de traitement)" },
      { key: "points_eau", label: "Points d'eau (usages)" },
    ],
  },
];

const GEO_LAYER_BY_KEY = new Map(GEO_LAYERS.map((layer) => [layer.key, layer]));
const GEOMETRY_LABELS: Record<GeoLayerType, string> = {
  point: "Point",
  line: "Ligne",
  polygon: "Polygone",
};

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */
function CollapsibleBlock({
  title,
  count,
  iconColor,
  icon: Icon,
  open,
  onToggle,
  children,
}: {
  title: string;
  count?: number;
  iconColor: string;
  icon: React.FC<{ className?: string }>;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-emerald-100/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-2.5 py-2 text-left transition hover:bg-white/[0.08]"
      >
        <div className="flex items-center gap-2">
          <span className={`flex h-4.5 w-4.5 items-center justify-center rounded-full ${iconColor.replace("bg-", "bg-").replace("400", "400/20")}`}>
            <Icon className={`h-2.5 w-2.5 ${iconColor.replace("bg-", "text-")}`} />
          </span>
          <span className="text-[13px] font-semibold tracking-[0.01em] text-white">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {typeof count === "number" && count > 0 && (
            <span className="rounded-full border border-emerald-100/10 bg-slate-950/25 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-300">
              {count} ✓
            </span>
          )}
          {open ? (
            <ChevronDown className="h-3 w-3 text-slate-300" />
          ) : (
            <ChevronRight className="h-3 w-3 text-slate-300" />
          )}
        </div>
      </button>
      {open && <div className="border-t border-emerald-100/10 bg-slate-950/15 px-2 py-1.5">{children}</div>}
    </div>
  );
}

function LayerCheckbox({
  checked,
  label,
  fillMode,
  onChange,
  onZoom,
  onToggleFillMode,
  onToggleFilter,
  hasFilter,
  geometryType,
}: {
  checked: boolean;
  label: string;
  fillMode?: "solid" | "outline";
  onChange: (checked: boolean) => void;
  onZoom?: () => void;
  onToggleFillMode?: () => void;
  onToggleFilter?: () => void;
  hasFilter?: boolean;
  geometryType?: GeoLayerType;
}) {
  return (
    <div className="group flex items-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-[11px] text-slate-100 transition hover:border-emerald-200/10 hover:bg-emerald-300/[0.08]">
      <label className="flex flex-1 cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-3 w-3 rounded border-white/20 bg-transparent accent-emerald-400 focus:ring-emerald-400/40"
        />
        <span className="font-medium text-slate-100/95">{label}</span>
      </label>
      {geometryType && (
        <span className="hidden rounded-full border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-slate-300 sm:inline-flex">
          {GEOMETRY_LABELS[geometryType]}
        </span>
      )}
      
      {onToggleFillMode && (
        <button
          type="button"
          onClick={onToggleFillMode}
          title={fillMode === "solid" ? "Passer en mode contou" : "Passer en mode plein"}
          className={`hidden rounded-md border px-1 py-0.5 transition group-hover:flex ${
            fillMode === "outline"
              ? "border-amber-400/50 bg-amber-400/20 text-amber-200"
              : "border-slate-500/20 bg-slate-500/10 text-slate-400 hover:border-amber-400/30 hover:bg-amber-400/10 hover:text-amber-200"
          }`}
        >
          {fillMode === "outline" ? <Grid className="h-2.5 w-2.5" /> : <Square className="h-2.5 w-2.5" />}
        </button>
      )}

      {onZoom && (
        <button
          type="button"
          onClick={onZoom}
          title="Centrer sur cette couche"
          className="ml-auto hidden rounded-md border border-amber-200/20 bg-amber-300/10 px-1 py-0.5 text-[8px] text-amber-200 transition group-hover:flex hover:border-amber-200/35 hover:bg-amber-300/18"
        >
          ⌖ zoom
        </button>
      )}
      {hasFilter && onToggleFilter && (
        <button
          type="button"
          onClick={onToggleFilter}
          title="Filtrer les entités de cette couche"
          className="ml-1 hidden rounded-md border border-cyan-200/20 bg-cyan-300/10 px-1 py-0.5 text-[8px] text-cyan-200 transition group-hover:flex hover:border-cyan-200/35 hover:bg-cyan-300/18"
        >
          <SlidersHorizontal className="h-2.5 w-2.5" />
        </button>
      )}
    </div>
  );
}

function SearchableChecklist({
  items,
  value,
  onChange,
  placeholder,
  height = 180,
  onQueryChange,
  loading = false,
  onLoadMore,
  hasMore = false,
}: {
  items: ListItem[];
  value: Record<string, boolean>;
  onChange: (next: Record<string, boolean>) => void;
  placeholder: string;
  height?: number;
  onQueryChange?: (q: string) => void;
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!onQueryChange) return;
    const t = window.setTimeout(() => onQueryChange(query), 250);
    return () => window.clearTimeout(t);
  }, [query, onQueryChange]);

  const filtered = useMemo(() => {
    if (onQueryChange) return items;
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query, onQueryChange]);

  const selectedCount = Object.values(value).filter(Boolean).length;

  const toggleOne = (id: string, checked: boolean) => {
    const next = { ...value };
    if (checked) next[id] = true;
    else delete next[id];
    onChange(next);
  };

  return (
    <div className="space-y-2 pt-1">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-emerald-100/10 bg-slate-950/55 py-2 pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-slate-400 focus:border-amber-300/50 focus:bg-slate-950/75"
        />
      </div>
      <div className="text-[10px] font-medium text-slate-400">
        {selectedCount} sélectionné(s) • {filtered.length} résultat(s)
      </div>
      <div
        className="space-y-0.5 overflow-auto rounded-xl border border-emerald-100/10 bg-slate-950/40 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
        style={{ maxHeight: height }}
      >
        {filtered.map((item) => (
          <label
            key={item.id}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-transparent px-2 py-1.5 text-xs text-slate-100 transition hover:border-emerald-100/10 hover:bg-emerald-300/[0.08]"
          >
            <input
              type="checkbox"
              checked={!!value[item.id]}
              onChange={(e) => toggleOne(item.id, e.target.checked)}
              className="h-3.5 w-3.5 rounded border-white/20 bg-transparent accent-emerald-400"
            />
            <span className="truncate">{item.label}</span>
          </label>
        ))}
        {!filtered.length && <div className="px-2 py-3 text-xs text-slate-400">Aucun résultat</div>}
        {loading && <div className="px-2 py-2 text-[11px] text-slate-400">Chargement...</div>}
        {!loading && hasMore && onLoadMore && (
          <button
            type="button"
            className="mx-1 my-1 w-[calc(100%-8px)] rounded border border-emerald-100/20 bg-emerald-400/10 px-2 py-1 text-[11px] text-emerald-100"
            onClick={onLoadMore}
          >
            Charger plus
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function SidebarFilters({
  layers,
  setLayers,
  onSelectFilter,
  onZoomLayer,
}: SidebarFiltersProps) {
  const [localLayers, setLocalLayers] = useState<LayersState>({
    toggles: { ...(layers.toggles || DEFAULT_TOGGLES) },
    fill_modes: { ...(layers.fill_modes || DEFAULT_FILL_MODES) },
    barrages_list: layers.barrages_list || {},
    sous_bassins_list: layers.sous_bassins_list || {},
    stations_list: layers.stations_list || {},
    zones_admin_list: layers.zones_admin_list || {},
  });

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [listStations, setListStations] = useState<ListItem[]>([]);
  const [listBarrages, setListBarrages] = useState<ListItem[]>([]);
  const [showStationsList, setShowStationsList] = useState(false);
  const [openLayerFilters, setOpenLayerFilters] = useState<Record<string, boolean>>({});
  const [layerItems, setLayerItems] = useState<Record<string, ListItem[]>>({});
  const [layerSelections, setLayerSelections] = useState<Record<string, Record<string, boolean>>>({});
  const layerItemsCacheRef = useRef<Record<string, ListItem[]>>({});
  const [layerQueryByKey, setLayerQueryByKey] = useState<Record<string, string>>({});
  const [layerOffsetByKey, setLayerOffsetByKey] = useState<Record<string, number>>({});
  const [layerHasMoreByKey, setLayerHasMoreByKey] = useState<Record<string, boolean>>({});
  const [layerLoadingByKey, setLayerLoadingByKey] = useState<Record<string, boolean>>({});

  /* Sync avec le parent */
  useEffect(() => {
    setLocalLayers({
      toggles: { ...(layers.toggles || DEFAULT_TOGGLES) },
      fill_modes: { ...(layers.fill_modes || DEFAULT_FILL_MODES) },
      barrages_list: layers.barrages_list || {},
      sous_bassins_list: layers.sous_bassins_list || {},
      stations_list: layers.stations_list || {},
      zones_admin_list: layers.zones_admin_list || {},
    });
  }, [layers]);

  /* Charger la liste de barrages (petite) au montage; stations chargées à la demande */
  useEffect(() => {
    let alive = true;

    async function fetchLists() {
      try {
        const r = await api.get<NamedItem[]>("/names/barrages_abhs?limit=500");
        if (alive) {
          setListBarrages(
            (r.data ?? []).map((x) => ({
              id: String(x.id),
              label: (x.name ?? x.label ?? "").trim() || `Barrage ${x.id}`,
            }))
          );
        }
      } catch {
        /* silently ignore — non critique */
      }
    }

    fetchLists();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!showStationsList || listStations.length > 0) return;
    let alive = true;
    api
      .get<NamedItem[]>("/layers/stations_abhs/names?limit=2000")
      .then((r) => {
        if (!alive) return;
        setListStations(
          (r.data ?? []).map((x) => ({
            id: String(x.id),
            label: (x.label ?? x.name ?? "").trim() || `Station ${x.id}`,
          }))
        );
      })
      .catch(() => {
        if (alive) console.warn("Impossible de charger la liste des stations.");
      });
    return () => {
      alive = false;
    };
  }, [showStationsList, listStations.length]);

  /* Helpers */
  const setAndSyncLayers = (updater: (prev: LayersState) => LayersState) => {
    setLocalLayers((prev) => {
      const next = updater(prev);
      setLayers(next);
      return next;
    });
  };

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLayerKey = (key: string, checked: boolean) => {
    setAndSyncLayers((prev) => ({
      ...prev,
      toggles: { ...prev.toggles, [key]: checked },
    }));
    if (checked && onZoomLayer) onZoomLayer(key);
  };

  const fetchLayerNamesPage = async (layerKey: string, q = "", offset = 0, append = false) => {
    setLayerLoadingByKey((prev) => ({ ...prev, [layerKey]: true }));
    try {
      const res = await api.get<ListItem[]>(`/layers/${layerKey}/names?limit=300&offset=${offset}&q=${encodeURIComponent(q)}`);
      const items = (res.data ?? []).map((x) => ({ id: String(x.id), label: x.label || String(x.id) }));
      setLayerItems((prev) => ({
        ...prev,
        [layerKey]: append ? [...(prev[layerKey] || []), ...items] : items,
      }));
      setLayerOffsetByKey((prev) => ({ ...prev, [layerKey]: offset }));
      setLayerHasMoreByKey((prev) => ({ ...prev, [layerKey]: items.length >= 300 }));
      if (!q && offset === 0) layerItemsCacheRef.current[layerKey] = items;
    } catch {
      if (!append) setLayerItems((prev) => ({ ...prev, [layerKey]: [] }));
      setLayerHasMoreByKey((prev) => ({ ...prev, [layerKey]: false }));
    } finally {
      setLayerLoadingByKey((prev) => ({ ...prev, [layerKey]: false }));
    }
  };

  const toggleLayerFilter = async (layerKey: string) => {
    setOpenLayerFilters((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
    if (layerItemsCacheRef.current[layerKey]) {
      setLayerItems((prev) => ({ ...prev, [layerKey]: layerItemsCacheRef.current[layerKey] }));
      setLayerHasMoreByKey((prev) => ({ ...prev, [layerKey]: true }));
      setLayerOffsetByKey((prev) => ({ ...prev, [layerKey]: 0 }));
      return;
    }
    if (layerItems[layerKey]) return;
    await fetchLayerNamesPage(layerKey, "", 0, false);
  };

  const totalVisible = Object.values(localLayers.toggles).filter(Boolean).length;

  /* Dédupliquer les couches entre groupes pour l'affichage du compteur global */
  const groupCount = (group: GroupDef) =>
    group.layers.filter((l) => localLayers.toggles[l.key]).length;

  return (
    <aside className="overflow-hidden rounded-[20px] border border-emerald-100/15 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.18),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.14),transparent_28%),linear-gradient(180deg,#083344_0%,#115e59_42%,#1f2937_100%)] shadow-[0_28px_90px_-34px_rgba(8,15,30,0.96)] backdrop-blur-xl">
      <div className="max-h-[calc(100vh-140px)] space-y-1.5 overflow-y-auto p-2">
        <div className="mb-2 rounded-2xl border border-emerald-100/10 bg-slate-950/25 px-3 py-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-100/70">
                Couches métier
              </div>
              <div className="mt-0.5 text-xs text-emerald-50/90">
                Observation, infrastructures et pressions
              </div>
            </div>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-400/15 px-2 py-1 text-[10px] font-bold text-emerald-100">
              {totalVisible} active{totalVisible > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* ──────────── GROUPES COUCHES ──────────── */}
        {LAYER_GROUPS.map((group) => (
          <CollapsibleBlock
            key={group.id}
            title={group.title}
            count={groupCount(group)}
            iconColor={group.iconColor}
            icon={group.Icon}
            open={!!openSections[group.id]}
            onToggle={() => toggleSection(group.id)}
          >
            <div className="space-y-0">
              {group.layers.map((layerDef) => (
                <div key={layerDef.key}>
                  <LayerCheckbox
                    checked={!!localLayers.toggles[layerDef.key]}
                    label={layerDef.label}
                    fillMode={layerDef.key in DEFAULT_FILL_MODES ? localLayers.fill_modes[layerDef.key] || DEFAULT_FILL_MODES[layerDef.key] : undefined}
                    onChange={(checked) => toggleLayerKey(layerDef.key, checked)}
                    onToggleFillMode={
                      layerDef.key in DEFAULT_FILL_MODES
                        ? () =>
                            setAndSyncLayers((prev) => ({
                              ...prev,
                              fill_modes: {
                                ...prev.fill_modes,
                                [layerDef.key]:
                                  prev.fill_modes[layerDef.key] === "solid" ? "outline" : "solid",
                              },
                            }))
                        : undefined
                    }
                    onZoom={() => onZoomLayer?.(layerDef.key)}
                    hasFilter
                    geometryType={GEO_LAYER_BY_KEY.get(layerDef.key)?.type}
                    onToggleFilter={() => {
                      void toggleLayerFilter(layerDef.key);
                    }}
                  />
                  {openLayerFilters[layerDef.key] && (
                    <div className="ml-2 mr-1 mb-1 rounded-md border border-emerald-100/10 bg-slate-950/40 p-1.5">
                      <SearchableChecklist
                        items={layerItems[layerDef.key] ?? []}
                        value={layerSelections[layerDef.key] ?? {}}
                        loading={!!layerLoadingByKey[layerDef.key]}
                        hasMore={!!layerHasMoreByKey[layerDef.key]}
                        onQueryChange={(q) => {
                          setLayerQueryByKey((prev) => ({ ...prev, [layerDef.key]: q }));
                          void fetchLayerNamesPage(layerDef.key, q, 0, false);
                        }}
                        onLoadMore={() => {
                          const nextOffset = (layerOffsetByKey[layerDef.key] || 0) + 300;
                          const q = layerQueryByKey[layerDef.key] || "";
                          void fetchLayerNamesPage(layerDef.key, q, nextOffset, true);
                        }}
                        onChange={(next) => {
                          setLayerSelections((prev) => ({ ...prev, [layerDef.key]: next }));
                          setAndSyncLayers((prev) => ({
                            ...prev,
                            toggles: { ...prev.toggles, [layerDef.key]: true },
                          }));
                          const ids = Object.keys(next).filter((id) => next[id]);
                          if (ids.length && onSelectFilter) onSelectFilter(layerDef.key, ids);
                        }}
                        placeholder={`Filtrer ${layerDef.label.toLowerCase()}...`}
                        height={120}
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* Sous-liste filtrable pour les stations */}
              {group.id === "stations" && listStations.length > 0 && (
                <div className="mt-1 border-t border-emerald-100/10 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowStationsList((v) => !v)}
                    className="flex w-full items-center justify-between rounded-md border border-amber-200/20 bg-amber-300/10 px-2 py-1 text-[10px] font-medium text-amber-100 transition hover:border-amber-200/35 hover:bg-amber-300/15"
                  >
                    <span>Filtrer par station</span>
                    <span className="flex items-center gap-1.5">
                      <span className="rounded-full bg-white/10 px-1 py-0.5 text-[8px] text-slate-300">
                        {Object.values(localLayers.stations_list).filter(Boolean).length} séléctionné(s)
                      </span>
                      {showStationsList ? <ChevronDown className="h-2.5 w-2.5" /> : <ChevronRight className="h-2.5 w-2.5" />}
                    </span>
                  </button>
                  {showStationsList && (
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
                  )}
                </div>
              )}
            </div>
          </CollapsibleBlock>
        ))}

        {/* ──────────── ÉTAT GLOBAL ──────────── */}
        <div className="rounded-lg border border-emerald-100/10 bg-[linear-gradient(180deg,rgba(251,191,36,0.12),rgba(8,15,30,0.72))] px-2.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10">
              <Radar className="h-3 w-3 text-emerald-300" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-white">État des couches</div>
              <div className="text-[10px] font-medium text-slate-400">
                {totalVisible} couche{totalVisible !== 1 ? "s" : ""} visible{totalVisible !== 1 ? "s" : ""}
              </div>
            </div>
            {totalVisible > 0 && (
              <button
                type="button"
                onClick={() => {
                  setAndSyncLayers((prev) => ({
                    ...prev,
                    toggles: Object.fromEntries(
                      Object.keys(prev.toggles).map((k) => [k, false])
                    ) as Record<string, boolean>,
                  }));
                }}
                className="ml-auto rounded-md border border-rose-300/20 bg-rose-400/10 px-1.5 py-0.5 text-[8px] font-semibold text-rose-200 transition hover:border-rose-300/35 hover:bg-rose-400/15"
              >
                Tout masquer
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
