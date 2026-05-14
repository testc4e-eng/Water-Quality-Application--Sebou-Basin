/* frontend/src/components/Climate/UnifiedFilters.tsx */
import { useEffect, useRef, useState } from "react";
import {
  getHierarchySubmenus,
  getHierarchyParameters,
  getParameterEntities,
  type HierSubmenu,
  type HierParameter,
} from "@/api/observatory";
import {
  getClimatMeteoOptions,
  getClimatMeteoDateRange,
  getClimatMeteoScenarios,
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
    aggregation?: string;
    dateStart?: string;
    dateEnd?: string;
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
  const [selectedAggregation, setSelectedAggregation] = useState<string | undefined>(undefined);
  const [dateStart, setDateStart] = useState<string | undefined>(undefined);
  const [dateEnd, setDateEnd] = useState<string | undefined>(undefined);
  const [dateError, setDateError] = useState<string | undefined>(undefined);
  const lastEmittedSignatureRef = useRef<string>("");

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
          const nextScenarios =
            data.scenarios && data.scenarios.length > 0
              ? data.scenarios
              : [{ code: "actuel", label: "Actuel" }];
          const subRows = (data.submenus || []).map((s) => ({
            sous_menu: s.label,
            n_items: (s.variables || []).length,
            code: s.code,
            variable_enabled: !!s.variable_enabled,
            variables: s.variables || [],
          }));

          setScenarios(nextScenarios);
          setSubmenus(subRows);
          setSelectedScenario(undefined);
          setSelectedSubmenu(undefined);
          setSelectedParamCode(undefined);
          setSelectedEntityId(undefined);
          setSelectedAggregation(undefined);
          setDateStart(undefined);
          setDateEnd(undefined);
        })
        .catch(err => {
          console.error("Failed to fetch analytics options", err);
          setScenarios([{ code: "actuel", label: "Actuel" }]);
          setSubmenus([]);
          setSelectedScenario(undefined);
          setSelectedSubmenu(undefined);
          setSelectedParamCode(undefined);
          setSelectedEntityId(undefined);
          setSelectedAggregation(undefined);
          setDateStart(undefined);
          setDateEnd(undefined);
        });
    } else {
      getHierarchySubmenus(theme).then((rows) => {
        setSubmenus((rows || []).map(r => ({ ...r, code: undefined })));
      });
      setSelectedSubmenu(undefined);
      setSelectedParamCode(undefined);
      setSelectedEntityId(undefined);
      setSelectedScenario(undefined);
      setSelectedAggregation(undefined);
      setDateStart(undefined);
      setDateEnd(undefined);
    }
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
      const nextParams = vars.map((v) => ({
          param_code: v.code,
          param_label: v.label,
          unite: v.unit ?? null,
          entity_type: isHydro ? "hydro_entity" : isPollution ? "pollution_entity" : "station",
          source_schema: v.source_schema || "analytics",
          source_table: v.source_table || (isHydro
            ? "mv_dashboard_hydrologie_menu"
            : isPollution
            ? "mv_dashboard_pollution_menu"
            : "mv_dashboard_climat_meteo_menu"),
          source_column: "value_num",
          is_modeled: false,
        }));

      setParameters(nextParams);
      if (sub?.variable_enabled && nextParams.length > 0) {
        setSelectedParamCode(nextParams[0].param_code);
      } else {
        setSelectedParamCode(undefined);
      }
      setSelectedScenario(undefined);
      setSelectedAggregation(undefined);
      setDateStart(undefined);
      setDateEnd(undefined);
      setDateError(undefined);
      setSelectedEntityId(undefined);
    } else {
      getHierarchyParameters(theme, selectedSubmenu).then((rows) => {
        setParameters(rows || []);
      });
      setSelectedParamCode(undefined);
      setSelectedEntityId(undefined);
    }
  }, [theme, selectedSubmenu, isHydro, isPollution, useAnalyticsMenu, submenus]);

  useEffect(() => {
    if (!isClimate || !selectedSubmenu) {
      return;
    }

    const sub = submenus.find((s) => s.sous_menu === selectedSubmenu);
    const needsVariable = !!sub?.variable_enabled;
    if (needsVariable && !selectedParamCode) {
      setScenarios([]);
      setSelectedScenario(undefined);
      return;
    }

    const subCode = getSelectedSubmenuCode();
    if (!subCode) {
      setScenarios([]);
      setSelectedScenario(undefined);
      return;
    }

    getClimatMeteoScenarios({
      submenu: subCode,
      variable: selectedParamCode,
    })
      .then((rows) => {
        const next = Array.isArray(rows) ? rows : [];
        setScenarios(next);
        setSelectedScenario((prev) => (prev && next.some((s) => s.code === prev) ? prev : undefined));
      })
      .catch((err) => {
        console.error("Failed to fetch climate scenarios", err);
        setScenarios([]);
        setSelectedScenario(undefined);
      });
  }, [isClimate, selectedSubmenu, selectedParamCode, submenus]);

  useEffect(() => {
    if (!isClimate) return;
    if (!selectedSubmenu || !selectedScenario || !selectedAggregation) {
      setDateError(undefined);
      return;
    }
    const subCode = getSelectedSubmenuCode();
    if (!subCode) return;
    getClimatMeteoDateRange({
      submenu: subCode,
      scenario: selectedScenario,
      aggregation: selectedAggregation,
      variable: selectedParamCode,
    })
      .then((resp) => {
        setDateStart(resp?.minDate || undefined);
        setDateEnd(resp?.maxDate || undefined);
        setDateError(undefined);
        setSelectedEntityId(undefined);
      })
      .catch((err) => {
        console.error("Failed to fetch climate date-range", err);
        setDateStart(undefined);
        setDateEnd(undefined);
        setDateError(undefined);
        setSelectedEntityId(undefined);
      });
  }, [isClimate, selectedSubmenu, selectedScenario, selectedAggregation, selectedParamCode, submenus]);

  useEffect(() => {
    if (dateStart && dateEnd && dateStart > dateEnd) {
      setDateError("Date debut doit etre <= Date fin.");
      return;
    }
    setDateError(undefined);
  }, [dateStart, dateEnd]);

  // 3. Charge les entités au changement de paramètre
  useEffect(() => {
    if (!theme || !selectedSubmenu) {
      setEntities([]);
      setSelectedEntityId(undefined);
      return;
    }

    const applyEntities = (next: Array<{ id: string; name: string; code?: string }>) => {
      setEntities(next);
      setSelectedEntityId((prev) =>
        prev && next.some((e) => String(e.id) === String(prev)) ? prev : undefined
      );
    };

    if (useAnalyticsMenu) {
      const subCode = getSelectedSubmenuCode();
      if (!subCode) return;
      if (!selectedScenario) {
        applyEntities([]);
        return;
      }
      if (isClimate && (!dateStart || !dateEnd || dateStart > dateEnd)) {
        applyEntities([]);
        return;
      }
      if (isClimate) {
        getClimatMeteoSites({
          submenu: subCode,
          variable: selectedParamCode,
          scenario: selectedScenario,
          date_start: dateStart,
          date_end: dateEnd,
        }).then((rows) => {
          applyEntities((rows || []).map(r => ({ id: r.site_id, name: r.site_name, code: r.site_code })));
        }).catch(() => {
          applyEntities([]);
        });
      } else {
        const loader = isHydro ? getHydrologieSites : getPollutionSites;
        loader({
          submenu: subCode,
          variable: selectedParamCode,
          scenario: selectedScenario,
        }).then((rows) => {
          applyEntities((rows || []).map(r => ({ id: r.site_id, name: r.site_name, code: r.site_code })));
        }).catch(() => {
          applyEntities([]);
        });
      }
    } else if (selectedParamCode) {
      getParameterEntities({
        theme,
        sous_menu: selectedSubmenu,
        param_code: selectedParamCode,
      }).then((data: any) => {
        const ids = Array.isArray(data?.entity_ids) ? data.entity_ids : [];
        applyEntities(ids.map((id: string) => ({ id, name: id })));
      });
    } else {
      applyEntities([]);
    }
  }, [theme, selectedSubmenu, selectedParamCode, isClimate, isHydro, isPollution, useAnalyticsMenu, selectedScenario, dateStart, dateEnd]);

  // 4. Notifier le parent
  useEffect(() => {
    const param = (parameters || []).find((p) => p.param_code === selectedParamCode);
    // On repasse le CODE du sous-menu au parent SI on est en mode climat, 
    // car c'est ce que UnifiedSimpleDashboard utilise pour sa requête series.
    const subCode = getSelectedSubmenuCode();
    const selectedSub = submenus.find((s) => s.sous_menu === selectedSubmenu);
    const selectedEntity = (entities || []).find((e) => String(e.id) === String(selectedEntityId));

    const payload = {
      scenario: useAnalyticsMenu ? selectedScenario : undefined,
      submenu: useAnalyticsMenu ? subCode : selectedSubmenu,
      submenuLabel: selectedSubmenu,
      variableEnabled: useAnalyticsMenu ? !!selectedSub?.variable_enabled : true,
      parameter: param,
      stationId: selectedEntityId,
      entityObj: selectedEntity,
      aggregation: selectedAggregation,
      dateStart,
      dateEnd,
    };

    // Prevent render loops in parents that pass inline onChange callbacks.
    const signature = JSON.stringify({
      scenario: payload.scenario ?? null,
      submenu: payload.submenu ?? null,
      submenuLabel: payload.submenuLabel ?? null,
      variableEnabled: payload.variableEnabled ?? null,
      parameterCode: payload.parameter?.param_code ?? null,
      stationId: payload.stationId ?? null,
      entityId: payload.entityObj?.id ?? null,
      aggregation: payload.aggregation ?? null,
      dateStart: payload.dateStart ?? null,
      dateEnd: payload.dateEnd ?? null,
    });

    if (signature !== lastEmittedSignatureRef.current) {
      lastEmittedSignatureRef.current = signature;
      onChange(payload);
    }
  }, [selectedSubmenu, selectedParamCode, selectedEntityId, parameters, entities, onChange, useAnalyticsMenu, selectedScenario, submenus, selectedAggregation, dateStart, dateEnd]);

  return (
    <div className={compact ? "space-y-2 text-xs font-sans" : "space-y-4 font-sans"}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');`}
      </style>

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

      {useAnalyticsMenu && (
        <div className="space-y-1">
          <label htmlFor="scenario-select" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 pl-1">
            Scenario
          </label>
          <Select
            id="scenario-select"
            value={selectedScenario}
            onChange={(v: string | undefined) => {
              setSelectedScenario(v);
              setSelectedAggregation(undefined);
              setDateStart(undefined);
              setDateEnd(undefined);
              setDateError(undefined);
              setSelectedEntityId(undefined);
            }}
            compact={compact}
            disabled={!selectedSubmenu || (scenarios || []).length === 0}
            placeholder="Choisir..."
          >
            {(scenarios || []).map((s) => (
              <option key={s.code} value={s.code}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>
      )}

      {isClimate && (
      <div className="space-y-1">
        <label htmlFor="aggregation-select" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 pl-1">
          Aggregation
        </label>
        <Select
          id="aggregation-select"
          value={selectedAggregation}
          onChange={(v: string | undefined) => {
            setSelectedAggregation(v);
            setDateStart(undefined);
            setDateEnd(undefined);
            setDateError(undefined);
            setSelectedEntityId(undefined);
          }}
          disabled={!selectedScenario}
          placeholder="Choisir..."
          compact={compact}
        >
          <option value="raw">Donnees brutes</option>
          <option value="day">Journaliere</option>
          <option value="month">Mensuelle</option>
          <option value="year">Annuelle</option>
        </Select>
      </div>
      )}

      {isClimate && (
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">
            Date debut
          </label>
          <input
            type="date"
            value={dateStart || ""}
            onChange={(e) => setDateStart(e.target.value || undefined)}
            disabled={!selectedAggregation}
            className={`w-full rounded-xl border-2 border-gray-100 bg-white outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 disabled:bg-gray-50 disabled:text-gray-400 ${compact ? "px-2 py-2 text-xs" : "px-3 py-2 text-sm"}`}
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">
            Date fin
          </label>
          <input
            type="date"
            value={dateEnd || ""}
            onChange={(e) => setDateEnd(e.target.value || undefined)}
            disabled={!selectedAggregation}
            className={`w-full rounded-xl border-2 border-gray-100 bg-white outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 disabled:bg-gray-50 disabled:text-gray-400 ${compact ? "px-2 py-2 text-xs" : "px-3 py-2 text-sm"}`}
          />
        </div>
      </div>
      )}
      {!!dateError && isClimate && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
          {dateError}
        </div>
      )}

      {/* STATION / ENTITE */}
      <div className="space-y-1">
        <label htmlFor="site-select" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 pl-1">
          Site
        </label>
        <Select
          id="site-select"
          value={selectedEntityId}
          onChange={setSelectedEntityId}
          disabled={useAnalyticsMenu ? (isClimate ? (!dateStart || !dateEnd || !!dateError) : !selectedScenario) : !selectedSubmenu}
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

      {(selectedSubmenu || selectedParamCode || selectedEntityId || selectedScenario || selectedAggregation || dateStart || dateEnd) && (
        <button
          onClick={() => {
            setSelectedSubmenu(undefined);
            setSelectedParamCode(undefined);
            setSelectedEntityId(undefined);
            setSelectedScenario(undefined);
            setSelectedAggregation(undefined);
            setDateStart(undefined);
            setDateEnd(undefined);
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
