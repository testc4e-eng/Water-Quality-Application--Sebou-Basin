/* frontend/src/components/Climate/UnifiedFilters.tsx */
import { useEffect, useState } from "react";
import {
  getHierarchySubmenus,
  getHierarchyParameters,
  getParameterEntities,
  type HierSubmenu,
  type HierParameter,
} from "@/api/observatory";
import {
  getClimatMeteoOptions,
  getClimatMeteoSites,
  getHydrologieOptions,
  getHydrologieSites,
  getPollutionOptions,
  getPollutionSites,
  type AnalyticsOption,
} from "@/api/analytics";

type Props = {
  theme: string;
  compact?: boolean;
  onChange: (params: {
    scenario?: string;
    stationId?: string;
    parameter?: HierParameter;
    submenu?: string;
    submenuLabel?: string;
    variableEnabled?: boolean;
    entityObj?: {
      id: string;
      name: string;
      code?: string;
    };
  }) => void;
};

// Add code support to the type for climate themes
export type ExtendedHierSubmenu = HierSubmenu & {
  code?: string;
  variable_enabled?: boolean;
  variables?: Array<{ code: string; label: string; unit?: string | null }>;
};

function isClimateTheme(theme: string): boolean {
  const normalized = (theme || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  return normalized === "climat_meteo" || normalized.includes("climat") || normalized.includes("meteo");
}

function isHydroTheme(theme: string): boolean {
  const normalized = (theme || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  return normalized === "hydrologie" || normalized.includes("hydrolog");
}

function isPollutionTheme(theme: string): boolean {
  const normalized = (theme || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  return normalized === "pollution" || normalized.includes("pollut");
}

export default function UnifiedFilters({ theme, onChange, compact }: Props) {
  const [submenus, setSubmenus] = useState<ExtendedHierSubmenu[]>([]);
  const [parameters, setParameters] = useState<HierParameter[]>([]);
  const [entities, setEntities] = useState<any[]>([]);
  const [scenarios, setScenarios] = useState<AnalyticsOption[]>([
    { code: "actuel", label: "Actuel" },
  ]);

  // Internal state: we store labels for submenus for continuity with observatory,
  // but we recover the code for climate calls.
  const [selectedScenario, setSelectedScenario] = useState<string>("actuel");
  const [selectedSubmenu, setSelectedSubmenu] = useState<string | undefined>(undefined);
  const [selectedParamCode, setSelectedParamCode] = useState<string | undefined>(undefined);
  const [selectedEntityId, setSelectedEntityId] = useState<string | undefined>(undefined);

  const isClimate = isClimateTheme(theme);
  const isHydro = isHydroTheme(theme);
  const isPollution = isPollutionTheme(theme);
  const useAnalyticsMenu = isClimate || isHydro || isPollution;

  // 1. Charge les sous-menus au changement de thème
  useEffect(() => {
    if (!theme) return;

    if (useAnalyticsMenu) {
      const loader = isClimate
        ? getClimatMeteoOptions
        : isHydro
        ? getHydrologieOptions
        : getPollutionOptions;
      loader()
        .then((data) => {
          const subRows = (data.submenus || []).map((s) => ({
            sous_menu: s.label,
            n_items: (s.variables || []).length,
            code: s.code,
            variable_enabled: !!s.variable_enabled,
            variables: s.variables || [],
          }));
          setScenarios((data.scenarios && data.scenarios.length > 0) ? data.scenarios : [{ code: "actuel", label: "Actuel" }]);
          setSubmenus(subRows);
        })
        .catch(err => {
          console.error("Failed to fetch analytics options", err);
          setScenarios([{ code: "actuel", label: "Actuel" }]);
          setSubmenus([]);
        });
    } else {
      getHierarchySubmenus(theme).then((rows) => {
        setSubmenus((rows || []).map(r => ({ ...r, code: undefined })));
      });
    }
    
    setSelectedSubmenu(undefined);
    setSelectedParamCode(undefined);
    setSelectedEntityId(undefined);
    setSelectedScenario("actuel");
  }, [theme, isClimate, isHydro, isPollution, useAnalyticsMenu]);

  // Helper function to get the code of a selected submenu
  const getSelectedSubmenuCode = () => {
    if (!useAnalyticsMenu) return selectedSubmenu;
    const sub = submenus.find(s => s.sous_menu === selectedSubmenu);
    return sub?.code || selectedSubmenu;
  };

  // 2. Charge les paramètres au changement de sous-menu
  useEffect(() => {
    if (!theme || !selectedSubmenu) {
      setParameters([]);
      return;
    }

    if (useAnalyticsMenu) {
      const sub = submenus.find((s) => s.sous_menu === selectedSubmenu);
      const vars = sub?.variables || [];
      setParameters(
        vars.map((v) => ({
          param_code: v.code,
          param_label: v.label,
          unite: v.unit ?? null,
          entity_type: isHydro ? "hydro_entity" : isPollution ? "pollution_entity" : "station",
          source_schema: "analytics",
          source_table: isHydro
            ? "mv_dashboard_hydrologie_menu"
            : isPollution
            ? "mv_dashboard_pollution_menu"
            : "mv_dashboard_climat_meteo_menu",
          source_column: "value_num",
          is_modeled: false,
        }))
      );
    } else {
      getHierarchyParameters(theme, selectedSubmenu).then((rows) => {
        setParameters(rows || []);
      });
    }
    
    setSelectedParamCode(undefined);
    setSelectedEntityId(undefined);
  }, [theme, selectedSubmenu, isHydro, isPollution, useAnalyticsMenu, submenus]);

  // 3. Charge les entités au changement de paramètre
  useEffect(() => {
    if (!theme || !selectedSubmenu) {
      setEntities([]);
      return;
    }

    if (useAnalyticsMenu) {
      const subCode = getSelectedSubmenuCode();
      if (!subCode) return;
      const siteLoader = isClimate
        ? getClimatMeteoSites
        : isHydro
        ? getHydrologieSites
        : getPollutionSites;
      siteLoader({
        submenu: subCode,
        variable: selectedParamCode,
        scenario: selectedScenario,
      }).then((rows) => {
        setEntities((rows || []).map(r => ({ id: r.site_id, name: r.site_name, code: r.site_code })));
      }).catch(() => {
        setEntities([]);
      });
    } else if (selectedParamCode) {
      getParameterEntities({
        theme,
        sous_menu: selectedSubmenu,
        param_code: selectedParamCode,
      }).then((data: any) => {
        const ids = Array.isArray(data?.entity_ids) ? data.entity_ids : [];
        setEntities(ids.map((id: string) => ({ id, name: id })));
      });
    }
    
    setSelectedEntityId(undefined);
  }, [theme, selectedSubmenu, selectedParamCode, isClimate, isHydro, isPollution, useAnalyticsMenu, selectedScenario]);

  // 4. Notifier le parent
  useEffect(() => {
    const param = (parameters || []).find((p) => p.param_code === selectedParamCode);
    // On repasse le CODE du sous-menu au parent SI on est en mode climat, 
    // car c'est ce que UnifiedSimpleDashboard utilise pour sa requête series.
    const subCode = getSelectedSubmenuCode();
    const selectedSub = submenus.find((s) => s.sous_menu === selectedSubmenu);
    const selectedEntity = (entities || []).find((e) => String(e.id) === String(selectedEntityId));
    
    onChange({
      scenario: useAnalyticsMenu ? selectedScenario : undefined,
      submenu: useAnalyticsMenu ? subCode : selectedSubmenu,
      submenuLabel: selectedSubmenu,
      variableEnabled: useAnalyticsMenu ? !!selectedSub?.variable_enabled : true,
      parameter: param,
      stationId: selectedEntityId,
      entityObj: selectedEntity,
    });
  }, [selectedSubmenu, selectedParamCode, selectedEntityId, parameters, entities, onChange, useAnalyticsMenu, selectedScenario, submenus]);

  return (
    <div className={compact ? "space-y-2 text-xs font-sans" : "space-y-4 font-sans"}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');`}
      </style>

      {useAnalyticsMenu && (
        <div className="space-y-1">
          <label htmlFor="scenario-select" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 pl-1">
            Scenario
          </label>
          <Select
            id="scenario-select"
            value={selectedScenario}
            onChange={setSelectedScenario}
            compact={compact}
            disabled={(scenarios || []).length <= 1}
          >
            {(scenarios || []).map((s) => (
              <option key={s.code} value={s.code}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>
      )}
      
      {/* SOUS-MENU */}
      <div className="space-y-1">
        <label htmlFor="submenu-select" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 pl-1">
          Sous-Menu
        </label>
        <Select
          id="submenu-select"
          value={selectedSubmenu}
          onChange={setSelectedSubmenu}
          placeholder="Choisir..."
          compact={compact}
        >
          {(submenus || []).map((s) => (
            <option key={s.sous_menu} value={s.sous_menu}>
              {s.sous_menu}
            </option>
          ))}
        </Select>
      </div>

      {/* PARAMETRE */}
      <div className="space-y-1">
        <label htmlFor="variable-select" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 pl-1">
          Variable
        </label>
        <Select
          id="variable-select"
          value={selectedParamCode}
          onChange={setSelectedParamCode}
          disabled={!selectedSubmenu || (parameters || []).length === 0}
          placeholder="Choisir..."
          compact={compact}
        >
          {(parameters || []).map((p) => (
            <option key={p.param_code} value={p.param_code}>
              {p.param_label}
            </option>
          ))}
        </Select>
      </div>

      {/* STATION / ENTITE */}
      <div className="space-y-1">
        <label htmlFor="site-select" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 pl-1">
          Site
        </label>
        <Select
          id="site-select"
          value={selectedEntityId}
          onChange={setSelectedEntityId}
          disabled={!selectedSubmenu}
          placeholder="Choisir..."
          compact={compact}
        >
          {(entities || []).map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} {e.code && e.code !== e.name ? `(${e.code})` : ""}
            </option>
          ))}
        </Select>
      </div>

      {!compact && (
        <div className="pt-3 px-1">
           <p className="text-[10px] text-gray-400 leading-relaxed italic border-l-2 border-gray-100 pl-2">
             La liste des stations est filtrée dynamiquement.
           </p>
        </div>
      )}

      {(selectedSubmenu || selectedParamCode || selectedEntityId) && (
        <button
          onClick={() => {
            setSelectedSubmenu(undefined);
            setSelectedParamCode(undefined);
            setSelectedEntityId(undefined);
          }}
          className={`w-full mt-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl font-semibold border border-gray-100 transition-all flex items-center justify-center gap-2 ${compact ? 'py-1.5 text-[10px]' : 'py-2.5 text-sm'}`}
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}

function Select({ id, value, onChange, children, disabled, placeholder, compact }: any) {
  return (
    <div className="relative group">
      <select
        id={id}
        className={`w-full border-2 border-gray-100 rounded-xl bg-white group-hover:border-blue-100 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 transition-all outline-none appearance-none disabled:bg-gray-50 disabled:text-gray-400 ${compact ? 'px-2 py-2 text-xs' : 'px-4 py-3 text-sm'}`}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        disabled={disabled}
      >
        <option value="" disabled hidden>
          {placeholder || "Selectionner..."}
        </option>
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24 shadow-sm">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
