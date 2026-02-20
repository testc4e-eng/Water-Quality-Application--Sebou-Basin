import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ScenarioSelector from "@/components/Filters/ScenarioSelector";
import MultiCheckList, { MultiCheckItem } from "./MultiCheckList";
import { Calendar, Layers, Filter, MapPin, Database, ChevronDown, ChevronUp } from "lucide-react";
import { DEFAULT_TOGGLES } from "@/layers/config";
import axios from "axios";
import type { AxiosResponse } from "axios";

/* =========================================================
   TYPES
========================================================= */
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
};

/* =========================================================
   API TYPES
========================================================= */
interface NameItem {
  id: string | number;
  label: string;
}

/* =========================================================
   COMPONENT
========================================================= */
export default function SidebarFilters({
  range,
  setRange,
  layers,
  setLayers,
  onApply,
  onSelectFilter,
}: SidebarFiltersProps) {
  const [localRange, setLocalRange] = useState(range);
  const [localLayers, setLocalLayers] = useState<LayersState>({
    toggles: layers.toggles || DEFAULT_TOGGLES,
    barrages_list: layers.barrages_list || {},
    sous_bassins_list: layers.sous_bassins_list || {},
    stations_list: layers.stations_list || {},
    zones_admin_list: layers.zones_admin_list || {},
  });
  const [isApplying, setIsApplying] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    periode: true,
    sousBassins: true,
    barrages: true,
    stations: true,
    zonesAdmin: true,
    autresCouches: true,
  });

  const [listBarrages, setListBarrages] = useState<MultiCheckItem[]>([]);
  const [listStations, setListStations] = useState<MultiCheckItem[]>([]);
  const [listSousBassins, setListSousBassins] = useState<MultiCheckItem[]>([]);
  const [listAdmin, setListAdmin] = useState<MultiCheckItem[]>([]);

  /* =========================================================
     CHARGEMENT DES LISTES DYNAMIQUES
  ========================================================= */
  useEffect(() => {
    let alive = true;

    async function fetchLists() {
      try {
        const [sb, br, st]: [
          AxiosResponse<NameItem[]>,
          AxiosResponse<NameItem[]>,
          AxiosResponse<NameItem[]>
        ] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/v1/names/sous-bassins"),
          axios.get("http://127.0.0.1:8000/api/v1/names/barrages"),
          axios.get("http://127.0.0.1:8000/api/v1/names/stations"),
        ]);

        if (!alive) return;

        setListSousBassins(
          (sb.data ?? []).map((x: NameItem) => ({
            id: String(x.id),
            label: x.label,
          }))
        );

        setListBarrages(
          (br.data ?? []).map((x: NameItem) => ({
            id: String(x.id),
            label: x.label,
          }))
        );

        setListStations(
          (st.data ?? []).map((x: NameItem) => ({
            id: String(x.id),
            label: x.label,
          }))
        );

        const [
          regions,
          provinces,
          cercles,
          communes,
          villes,
          douars,
        ]: [
          AxiosResponse<NameItem[]>,
          AxiosResponse<NameItem[]>,
          AxiosResponse<NameItem[]>,
          AxiosResponse<NameItem[]>,
          AxiosResponse<NameItem[]>,
          AxiosResponse<NameItem[]>
        ] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/v1/names/regions"),
          axios.get("http://127.0.0.1:8000/api/v1/names/provinces"),
          axios.get("http://127.0.0.1:8000/api/v1/names/cercles"),
          axios.get("http://127.0.0.1:8000/api/v1/names/communes"),
          axios.get("http://127.0.0.1:8000/api/v1/names/villes"),
          axios.get("http://127.0.0.1:8000/api/v1/names/douars"),
        ]);

        if (!alive) return;

        setListAdmin([
          { id: "region", label: `Régions (${regions.data.length})` },
          { id: "province", label: `Provinces (${provinces.data.length})` },
          { id: "cercle", label: `Cercles (${cercles.data.length})` },
          { id: "commune", label: `Communes (${communes.data.length})` },
          { id: "ville", label: `Villes (${villes.data.length})` },
          { id: "douar", label: `Douars (${douars.data.length})` },
        ]);
      } catch (err) {
        console.error("⚠️ Erreur chargement listes :", err);
      }
    }

    fetchLists();
    return () => {
      alive = false;
    };
  }, []);

  /* =========================================================
     ACTION : appliquer les filtres
  ========================================================= */
  const handleApply = async () => {
    setIsApplying(true);
    setRange(localRange);
    setLayers((prev) => ({ ...prev, ...localLayers }));
    await onApply();
    setIsApplying(false);
  };

  const toggleLayerKey = (key: string, checked: boolean) =>
    setLocalLayers((prev) => ({
      ...prev,
      toggles: { ...prev.toggles, [key]: checked },
    }));

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const safeRange = localRange ?? { from: "", to: "" };

  // Fonction pour compter les éléments sélectionnés
  const getSelectedCount = (obj: Record<string, boolean>) => {
    return Object.values(obj).filter(Boolean).length;
  };

  /* =========================================================
     RENDU VISUEL COMPLET AMÉLIORÉ
  ========================================================= */

  return (
    <aside className="bg-white rounded-2xl shadow-xl border border-gray-100 sticky top-24 overflow-hidden">
      {/* En-tête avec dégradé */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur p-2 rounded-lg">
              <Filter className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Filtres cartographiques</h2>
              <p className="text-xs text-blue-100">Affinez votre visualisation</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs">
            v2.0
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
        {/* ================== SECTION PÉRIODE ================== */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 overflow-hidden">
          <button
            onClick={() => toggleSection('periode')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="font-semibold text-gray-700">Période</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                {safeRange.from && safeRange.to ? 'Définie' : 'Non définie'}
              </span>
              {expandedSections.periode ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </button>

          {expandedSections.periode && (
            <div className="p-4 pt-0 space-y-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  Depuis
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={safeRange.from}
                    onChange={(e) =>
                      setLocalRange((r) => ({ ...r, from: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  Jusqu'à
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={safeRange.to}
                    onChange={(e) =>
                      setLocalRange((r) => ({ ...r, to: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================== FILTRES HYDROLOGIQUES ================== */}
        <div className="space-y-3">
          {/* SOUS-BASSINS */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleSection('sousBassins')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white shadow-md">
                  <Database className="h-4 w-4" />
                </div>
                <span className="font-semibold text-gray-700">Sous-bassins</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full">
                  {getSelectedCount(localLayers.sous_bassins_list)} sélectionné(s)
                </span>
                {expandedSections.sousBassins ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </button>

            {expandedSections.sousBassins && (
              <div className="p-4 pt-0">
                <MultiCheckList
                  title=""
                  items={listSousBassins}
                  value={localLayers.sous_bassins_list}
                  onChange={(next) => {
                    setLocalLayers((p) => ({ ...p, sous_bassins_list: next }));
                    const selectedIds = Object.keys(next).filter((id) => next[id]);
                    if (selectedIds.length > 0 && onSelectFilter) {
                      onSelectFilter("sous-bassin", selectedIds);
                      setLocalLayers((p) => ({
                        ...p,
                        toggles: { ...p.toggles, sous_bassin_sebou: true },
                      }));
                    }
                  }}
                  height={140}
                  searchPlaceholder="Rechercher un sous-bassin..."
                  className="border-0 bg-transparent"
                />
              </div>
            )}
          </div>

          {/* BARRAGES */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleSection('barrages')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
                  <Database className="h-4 w-4" />
                </div>
                <span className="font-semibold text-gray-700">Barrages</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  {getSelectedCount(localLayers.barrages_list)} sélectionné(s)
                </span>
                {expandedSections.barrages ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </button>

            {expandedSections.barrages && (
              <div className="p-4 pt-0">
                <MultiCheckList
                  title=""
                  items={listBarrages}
                  value={localLayers.barrages_list}
                  onChange={(next) => {
                    setLocalLayers((p) => ({ ...p, barrages_list: next }));
                    const selectedIds = Object.keys(next).filter((id) => next[id]);
                    if (selectedIds.length > 0 && onSelectFilter) {
                      onSelectFilter("barrage", selectedIds);
                      setLocalLayers((p) => ({
                        ...p,
                        toggles: { ...p.toggles, barrages_abhs: true },
                      }));
                    }
                  }}
                  height={160}
                  searchPlaceholder="Rechercher un barrage..."
                  className="border-0 bg-transparent"
                />
              </div>
            )}
          </div>

          {/* STATIONS */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleSection('stations')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="font-semibold text-gray-700">Stations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                  {getSelectedCount(localLayers.stations_list)} sélectionné(s)
                </span>
                {expandedSections.stations ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </button>

            {expandedSections.stations && (
              <div className="p-4 pt-0">
                <MultiCheckList
                  title=""
                  items={listStations}
                  value={localLayers.stations_list}
                  onChange={(next) => {
                    setLocalLayers((p) => ({ ...p, stations_list: next }));
                    const selectedIds = Object.keys(next).filter((id) => next[id]);
                    if (selectedIds.length > 0 && onSelectFilter) {
                      onSelectFilter("station", selectedIds);
                      setLocalLayers((p) => ({
                        ...p,
                        toggles: { ...p.toggles, stations_abhs: true },
                      }));
                    }
                  }}
                  height={160}
                  searchPlaceholder="Rechercher une station..."
                  className="border-0 bg-transparent"
                />
              </div>
            )}
          </div>

          {/* ZONES ADMINISTRATIVES */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleSection('zonesAdmin')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                  <Layers className="h-4 w-4" />
                </div>
                <span className="font-semibold text-gray-700">Zones administratives</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full">
                  {getSelectedCount(localLayers.zones_admin_list)} sélectionné(s)
                </span>
                {expandedSections.zonesAdmin ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </button>

            {expandedSections.zonesAdmin && (
              <div className="p-4 pt-0">
                <MultiCheckList
                  title=""
                  items={listAdmin}
                  value={localLayers.zones_admin_list}
                  onChange={(next) => {
                    setLocalLayers((p) => ({ ...p, zones_admin_list: next }));
                    const selectedIds = Object.keys(next).filter((id) => next[id]);
                    if (onSelectFilter && selectedIds.length > 0) {
                      selectedIds.forEach((id) => {
                        switch (id) {
                          case "region":
                            onSelectFilter("region", []);
                            setLocalLayers((p) => ({
                              ...p,
                              toggles: { ...p.toggles, adm_regions_abhs: true },
                            }));
                            break;
                          case "province":
                            onSelectFilter("province", []);
                            setLocalLayers((p) => ({
                              ...p,
                              toggles: { ...p.toggles, adm_provinces_abhs: true },
                            }));
                            break;
                          case "cercle":
                            onSelectFilter("cercle", []);
                            setLocalLayers((p) => ({
                              ...p,
                              toggles: { ...p.toggles, adm_cercles_abhs: true },
                            }));
                            break;
                          case "commune":
                            onSelectFilter("commune", []);
                            setLocalLayers((p) => ({
                              ...p,
                              toggles: { ...p.toggles, adm_communes_abhs: true },
                            }));
                            break;
                          case "ville":
                            onSelectFilter("ville", []);
                            setLocalLayers((p) => ({
                              ...p,
                              toggles: { ...p.toggles, adm_villes_abhs: true },
                            }));
                            break;
                          case "douar":
                            onSelectFilter("douar", []);
                            setLocalLayers((p) => ({
                              ...p,
                              toggles: { ...p.toggles, adm_douars_abhs: true },
                            }));
                            break;
                        }
                      });
                    }
                  }}
                  height={140}
                  searchPlaceholder="Rechercher une zone..."
                  className="border-0 bg-transparent"
                />
              </div>
            )}
          </div>
        </div>

        {/* ================== AUTRES COUCHES ================== */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 overflow-hidden">
          <button
            onClick={() => toggleSection('autresCouches')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white shadow-md">
                <Layers className="h-4 w-4" />
              </div>
              <span className="font-semibold text-gray-700">Autres couches</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {Object.values(localLayers.toggles).filter(Boolean).length} active(s)
              </span>
              {expandedSections.autresCouches ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </button>

          {expandedSections.autresCouches && (
            <div className="p-4 pt-0">
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(localLayers.toggles).map(([key, v]) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={!!v}
                      onChange={(e) => toggleLayerKey(key, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================== SCÉNARIO ================== */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-4">
          <ScenarioSelector />
        </div>

        {/* ================== BOUTON APPLIQUER ================== */}
        <Button
          onClick={handleApply}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          disabled={isApplying}
        >
          {isApplying ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Application...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Appliquer les filtres</span>
            </div>
          )}
        </Button>

        {/* Indicateur de filtres actifs */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          {getSelectedCount(localLayers.sous_bassins_list) +
            getSelectedCount(localLayers.barrages_list) +
            getSelectedCount(localLayers.stations_list) +
            getSelectedCount(localLayers.zones_admin_list) +
            Object.values(localLayers.toggles).filter(Boolean).length} filtres actifs
        </div>
      </div>
    </aside>
  );
}