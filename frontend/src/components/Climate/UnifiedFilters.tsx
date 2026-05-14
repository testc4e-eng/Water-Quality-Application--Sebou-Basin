import { useEffect, useRef, useState } from "react";
import {
  getHierarchySubmenus,
  getHierarchyParameters,
  getParameterEntities,
  type HierSubmenu,
  type HierParameter,
} from "@/api/observatory";
import {
  getClimatMeteoDateRange,
  getClimatMeteoOptions,
  getClimatMeteoScenarios,
  getClimatMeteoSites,
  getHydrologieDateRange,
  getHydrologieOptions,
  getHydrologieParameters,
  getHydrologieScenarios,
  getHydrologieSubmenus,
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

export type ExtendedHierSubmenu = HierSubmenu & {
  code?: string;
  variable_enabled?: boolean;
  variables?: Array<{ code: string; label: string; unit?: string | null; source_schema?: string; source_table?: string }>;
};

function normalizeTheme(theme: string): string {
  return (theme || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function isClimateTheme(theme: string): boolean {
  const n = normalizeTheme(theme);
  return n === "climat_meteo" || n.includes("climat") || n.includes("meteo");
}

function isHydroTheme(theme: string): boolean {
  const n = normalizeTheme(theme);
  return n === "hydrologie" || n.includes("hydrolog");
}

function isPollutionTheme(theme: string): boolean {
  const n = normalizeTheme(theme);
  return n === "pollution" || n.includes("pollut");
}

export default function UnifiedFilters({ theme, onChange, compact }: Props) {
  const [submenus, setSubmenus] = useState<ExtendedHierSubmenu[]>([]);
  const [parameters, setParameters] = useState<HierParameter[]>([]);
  const [entities, setEntities] = useState<Array<{ id: string; name: string; code?: string }>>([]);
  const [scenarios, setScenarios] = useState<AnalyticsOption[]>([]);

  const [selectedSubmenu, setSelectedSubmenu] = useState<string | undefined>(undefined);
  const [selectedParamCode, setSelectedParamCode] = useState<string | undefined>(undefined);
  const [selectedScenario, setSelectedScenario] = useState<string | undefined>(undefined);
  const [selectedAggregation, setSelectedAggregation] = useState<string | undefined>(undefined);
  const [dateStart, setDateStart] = useState<string | undefined>(undefined);
  const [dateEnd, setDateEnd] = useState<string | undefined>(undefined);
  const [selectedEntityId, setSelectedEntityId] = useState<string | undefined>(undefined);
  const [dateError, setDateError] = useState<string | undefined>(undefined);

  const lastEmittedSignatureRef = useRef<string>("");

  const isClimate = isClimateTheme(theme);
  const isHydro = isHydroTheme(theme);
  const isPollution = isPollutionTheme(theme);
  const useAnalyticsMenu = isClimate || isHydro || isPollution;

  const getSelectedSubmenuCode = () => {
    if (!useAnalyticsMenu) return selectedSubmenu;
    const sub = submenus.find((s) => s.sous_menu === selectedSubmenu);
    return sub?.code || selectedSubmenu;
  };

  const resetLowerFromSubmenu = () => {
    setSelectedParamCode(undefined);
    setSelectedScenario(undefined);
    setSelectedAggregation(undefined);
    setDateStart(undefined);
    setDateEnd(undefined);
    setSelectedEntityId(undefined);
    setDateError(undefined);
    setEntities([]);
  };

  const resetLowerFromParameter = () => {
    setSelectedScenario(undefined);
    setSelectedAggregation(undefined);
    setDateStart(undefined);
    setDateEnd(undefined);
    setSelectedEntityId(undefined);
    setDateError(undefined);
    setEntities([]);
  };

  const resetLowerFromScenario = () => {
    setSelectedAggregation(undefined);
    setDateStart(undefined);
    setDateEnd(undefined);
    setSelectedEntityId(undefined);
    setDateError(undefined);
    setEntities([]);
  };

  const resetLowerFromAggregation = () => {
    setDateStart(undefined);
    setDateEnd(undefined);
    setSelectedEntityId(undefined);
    setDateError(undefined);
    setEntities([]);
  };

  useEffect(() => {
    if (!theme) return;

    if (useAnalyticsMenu) {
      if (isHydro) {
        getHydrologieSubmenus()
          .then((rows) => {
            const subRows = (rows || []).map((s) => ({
              sous_menu: s.label,
              n_items: 0,
              code: s.id,
              variable_enabled: true,
              variables: [],
            }));
            setSubmenus(subRows);
            setScenarios([]);
            setParameters([]);
            setEntities([]);
            setSelectedSubmenu(undefined);
            setSelectedParamCode(undefined);
            setSelectedScenario(undefined);
            setSelectedAggregation(undefined);
            setDateStart(undefined);
            setDateEnd(undefined);
            setSelectedEntityId(undefined);
            setDateError(undefined);
          })
          .catch(() => {
            setSubmenus([]);
            setScenarios([]);
            setParameters([]);
            setEntities([]);
          });
        return;
      }

      const loader = isClimate ? getClimatMeteoOptions : isHydro ? getHydrologieOptions : getPollutionOptions;
      loader()
        .then((data) => {
          const subRows = (data.submenus || []).map((s) => ({
            sous_menu: s.label,
            n_items: (s.variables || []).length,
            code: s.code,
            variable_enabled: !!s.variable_enabled,
            variables: s.variables || [],
          }));
          setSubmenus(subRows);
          setScenarios([]);
          setParameters([]);
          setEntities([]);
          setSelectedSubmenu(undefined);
          setSelectedParamCode(undefined);
          setSelectedScenario(undefined);
          setSelectedAggregation(undefined);
          setDateStart(undefined);
          setDateEnd(undefined);
          setSelectedEntityId(undefined);
          setDateError(undefined);
        })
        .catch(() => {
          setSubmenus([]);
          setScenarios([]);
          setParameters([]);
          setEntities([]);
        });
      return;
    }

    getHierarchySubmenus(theme).then((rows) => {
      setSubmenus((rows || []).map((r) => ({ ...r, code: undefined })));
      setParameters([]);
      setEntities([]);
      setSelectedSubmenu(undefined);
      setSelectedParamCode(undefined);
      setSelectedScenario(undefined);
      setSelectedAggregation(undefined);
      setDateStart(undefined);
      setDateEnd(undefined);
      setSelectedEntityId(undefined);
      setDateError(undefined);
    });
  }, [theme, isClimate, isHydro, isPollution, useAnalyticsMenu]);

  useEffect(() => {
    if (!selectedSubmenu) {
      setParameters([]);
      return;
    }

    if (!useAnalyticsMenu) {
      getHierarchyParameters(theme, selectedSubmenu).then((rows) => setParameters(rows || []));
      setSelectedParamCode(undefined);
      return;
    }

    if (isHydro) {
      const subCode = getSelectedSubmenuCode();
      if (!subCode) {
        setParameters([]);
        resetLowerFromSubmenu();
        return;
      }
      getHydrologieParameters({ submenu: subCode })
        .then((rows) => {
          const nextParams = (rows || []).map((v) => ({
            param_code: v.id,
            param_label: v.label,
            unite: v.unit ?? null,
            entity_type: "hydro_entity",
            source_schema: "analytics",
            source_table: "mv_dashboard_hydrologie_menu",
            source_column: "value_num",
            is_modeled: false,
          }));
          setParameters(nextParams);
          resetLowerFromSubmenu();
        })
        .catch(() => {
          setParameters([]);
          resetLowerFromSubmenu();
        });
      return;
    }

    const sub = submenus.find((s) => s.sous_menu === selectedSubmenu);
    const vars = sub?.variables || [];
    const nextParams = vars.map((v) => ({
      param_code: v.code,
      param_label: v.label,
      unite: v.unit ?? null,
      entity_type: isHydro ? "hydro_entity" : isPollution ? "pollution_entity" : "station",
      source_schema: v.source_schema || "analytics",
      source_table:
        v.source_table ||
        (isHydro ? "mv_dashboard_hydrologie_menu" : isPollution ? "mv_dashboard_pollution_menu" : "mv_dashboard_climat_meteo_menu"),
      source_column: "value_num",
      is_modeled: false,
    }));

    setParameters(nextParams);
    resetLowerFromSubmenu();

    if (isClimate && nextParams.length > 0) {
      setSelectedParamCode(nextParams[0].param_code);
    }
  }, [selectedSubmenu, useAnalyticsMenu, theme, submenus, isHydro, isPollution, isClimate]);

  useEffect(() => {
    if (!selectedSubmenu) {
      setScenarios([]);
      return;
    }

    const subCode = getSelectedSubmenuCode();
    if (!subCode) return;

    if (isClimate) {
      getClimatMeteoScenarios({ submenu: subCode, variable: selectedParamCode })
        .then((rows) => setScenarios(Array.isArray(rows) ? rows : []))
        .catch(() => setScenarios([]));
      return;
    }

    if (isHydro) {
      if (!selectedParamCode) {
        setScenarios([]);
        return;
      }
      getHydrologieScenarios({ submenu: subCode, parameter: selectedParamCode })
        .then((rows) => setScenarios(Array.isArray(rows) ? rows : []))
        .catch(() => setScenarios([]));
      return;
    }

    if (isPollution) {
      getPollutionOptions()
        .then((data) => {
          const next = data.scenarios && data.scenarios.length ? data.scenarios : [];
          setScenarios(next);
        })
        .catch(() => setScenarios([]));
      return;
    }
  }, [selectedSubmenu, selectedParamCode, isClimate, isHydro, isPollution]);

  useEffect(() => {
    if (dateStart && dateEnd && dateStart > dateEnd) {
      setDateError("Date debut doit etre <= Date fin.");
      return;
    }
    setDateError(undefined);
  }, [dateStart, dateEnd]);

  useEffect(() => {
    if (!selectedSubmenu || !selectedScenario || !selectedAggregation) return;

    const subCode = getSelectedSubmenuCode();
    if (!subCode) return;

    if (isClimate) {
      getClimatMeteoDateRange({
        submenu: subCode,
        scenario: selectedScenario,
        aggregation: selectedAggregation,
        variable: selectedParamCode,
      })
        .then((resp) => {
          setDateStart(resp?.minDate || undefined);
          setDateEnd(resp?.maxDate || undefined);
          setSelectedEntityId(undefined);
        })
        .catch(() => {
          setDateStart(undefined);
          setDateEnd(undefined);
          setSelectedEntityId(undefined);
        });
      return;
    }

    if (isHydro) {
      if (!selectedParamCode) return;
      getHydrologieDateRange({
        submenu: subCode,
        scenario: selectedScenario,
        parameter: selectedParamCode,
        aggregation: selectedAggregation,
      })
        .then((resp) => {
          setDateStart(resp?.minDate || undefined);
          setDateEnd(resp?.maxDate || undefined);
          setSelectedEntityId(undefined);
        })
        .catch(() => {
          setDateStart(undefined);
          setDateEnd(undefined);
          setSelectedEntityId(undefined);
        });
    }
  }, [selectedSubmenu, selectedScenario, selectedAggregation, selectedParamCode, isClimate, isHydro, submenus]);

  useEffect(() => {
    if (!selectedSubmenu) {
      setEntities([]);
      setSelectedEntityId(undefined);
      return;
    }

    const applyEntities = (next: Array<{ id: string; name: string; code?: string }>) => {
      setEntities(next);
      setSelectedEntityId((prev) => (prev && next.some((e) => String(e.id) === String(prev)) ? prev : undefined));
    };

    if (useAnalyticsMenu) {
      const subCode = getSelectedSubmenuCode();
      if (!subCode || !selectedScenario) {
        applyEntities([]);
        return;
      }

      if ((isClimate || isHydro) && (!selectedAggregation || !dateStart || !dateEnd || dateStart > dateEnd)) {
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
        })
          .then((rows) => applyEntities((rows || []).map((r) => ({ id: r.site_id, name: r.site_name, code: r.site_code }))))
          .catch(() => applyEntities([]));
        return;
      }

      if (isHydro) {
        if (!selectedParamCode) {
          applyEntities([]);
          return;
        }
        getHydrologieSites({
          submenu: subCode,
          parameter: selectedParamCode,
          scenario: selectedScenario,
          aggregation: selectedAggregation,
          date_start: dateStart,
          date_end: dateEnd,
        })
          .then((rows) => applyEntities((rows || []).map((r) => ({ id: r.site_id, name: r.site_name, code: r.site_code }))))
          .catch(() => applyEntities([]));
        return;
      }

      getPollutionSites({ submenu: subCode, variable: selectedParamCode, scenario: selectedScenario })
        .then((rows) => applyEntities((rows || []).map((r) => ({ id: r.site_id, name: r.site_name, code: r.site_code }))))
        .catch(() => applyEntities([]));
      return;
    }

    if (selectedParamCode) {
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
  }, [
    theme,
    selectedSubmenu,
    selectedParamCode,
    selectedScenario,
    selectedAggregation,
    dateStart,
    dateEnd,
    useAnalyticsMenu,
    isClimate,
    isHydro,
    submenus,
  ]);

  useEffect(() => {
    const param = (parameters || []).find((p) => p.param_code === selectedParamCode);
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

    const signature = JSON.stringify({
      scenario: payload.scenario ?? null,
      submenu: payload.submenu ?? null,
      submenuLabel: payload.submenuLabel ?? null,
      parameterCode: payload.parameter?.param_code ?? null,
      stationId: payload.stationId ?? null,
      aggregation: payload.aggregation ?? null,
      dateStart: payload.dateStart ?? null,
      dateEnd: payload.dateEnd ?? null,
    });

    if (signature !== lastEmittedSignatureRef.current) {
      lastEmittedSignatureRef.current = signature;
      onChange(payload);
    }
  }, [
    selectedSubmenu,
    selectedParamCode,
    selectedScenario,
    selectedAggregation,
    dateStart,
    dateEnd,
    selectedEntityId,
    parameters,
    entities,
    onChange,
    useAnalyticsMenu,
    submenus,
  ]);

  const showParameter = !isClimate;
  const showAggregationAndDates = isClimate || isHydro;

  return (
    <div className={compact ? "space-y-2 text-xs font-sans" : "space-y-4 font-sans"}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');`}</style>

      <div className="space-y-1">
        <label htmlFor="submenu-select" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 pl-1">
          Sous-Menu
        </label>
        <Select id="submenu-select" value={selectedSubmenu} onChange={(v: string | undefined) => { setSelectedSubmenu(v); resetLowerFromSubmenu(); }} placeholder="Choisir..." compact={compact}>
          {(submenus || []).map((s) => (
            <option key={s.sous_menu} value={s.sous_menu}>
              {s.sous_menu}
            </option>
          ))}
        </Select>
      </div>

      {showParameter && (
        <div className="space-y-1">
          <label htmlFor="parameter-select" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 pl-1">
            Parametre
          </label>
          <Select id="parameter-select" value={selectedParamCode} onChange={(v: string | undefined) => { setSelectedParamCode(v); resetLowerFromParameter(); }} disabled={!selectedSubmenu || (parameters || []).length === 0} placeholder="Choisir..." compact={compact}>
            {(parameters || []).map((p) => (
              <option key={p.param_code} value={p.param_code}>
                {p.param_label}
              </option>
            ))}
          </Select>
        </div>
      )}

      {useAnalyticsMenu && (
        <div className="space-y-1">
          <label htmlFor="scenario-select" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 pl-1">
            Scenario
          </label>
          <Select id="scenario-select" value={selectedScenario} onChange={(v: string | undefined) => { setSelectedScenario(v); resetLowerFromScenario(); }} compact={compact} disabled={!selectedSubmenu || (isHydro && !selectedParamCode) || (scenarios || []).length === 0} placeholder="Choisir...">
            {(scenarios || []).map((s) => (
              <option key={s.code} value={s.code}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>
      )}

      {showAggregationAndDates && (
        <>
          <div className="space-y-1">
            <label htmlFor="aggregation-select" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 pl-1">
              Aggregation
            </label>
            <Select id="aggregation-select" value={selectedAggregation} onChange={(v: string | undefined) => { setSelectedAggregation(v); resetLowerFromAggregation(); }} disabled={!selectedScenario} placeholder="Choisir..." compact={compact}>
              <option value="raw">Donnees brutes</option>
              <option value="daily">Journaliere</option>
              <option value="monthly">Mensuelle</option>
              <option value="yearly">Annuelle</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Date debut</label>
              <input
                type="date"
                value={dateStart || ""}
                onChange={(e) => setDateStart(e.target.value || undefined)}
                disabled={!selectedAggregation}
                className={`w-full rounded-xl border-2 border-gray-100 bg-white outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 disabled:bg-gray-50 disabled:text-gray-400 ${compact ? "px-2 py-2 text-xs" : "px-3 py-2 text-sm"}`}
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Date fin</label>
              <input
                type="date"
                value={dateEnd || ""}
                onChange={(e) => setDateEnd(e.target.value || undefined)}
                disabled={!selectedAggregation}
                className={`w-full rounded-xl border-2 border-gray-100 bg-white outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 disabled:bg-gray-50 disabled:text-gray-400 ${compact ? "px-2 py-2 text-xs" : "px-3 py-2 text-sm"}`}
              />
            </div>
          </div>
        </>
      )}

      {!!dateError && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">{dateError}</div>}

      <div className="space-y-1">
        <label htmlFor="site-select" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 pl-1">
          Site
        </label>
        <Select
          id="site-select"
          value={selectedEntityId}
          onChange={setSelectedEntityId}
          disabled={
            useAnalyticsMenu
              ? isHydro
                ? !selectedAggregation || !dateStart || !dateEnd || !!dateError
                : isClimate
                ? !selectedAggregation || !dateStart || !dateEnd || !!dateError
                : !selectedScenario
              : !selectedSubmenu
          }
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
          <p className="text-[10px] text-gray-400 leading-relaxed italic border-l-2 border-gray-100 pl-2">La liste des stations est filtree dynamiquement.</p>
        </div>
      )}

      {(selectedSubmenu || selectedParamCode || selectedScenario || selectedAggregation || dateStart || dateEnd || selectedEntityId) && (
        <button
          onClick={() => {
            setSelectedSubmenu(undefined);
            setSelectedParamCode(undefined);
            setSelectedScenario(undefined);
            setSelectedAggregation(undefined);
            setDateStart(undefined);
            setDateEnd(undefined);
            setSelectedEntityId(undefined);
            setDateError(undefined);
            setEntities([]);
          }}
          className={`w-full mt-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl font-semibold border border-gray-100 transition-all flex items-center justify-center gap-2 ${compact ? "py-1.5 text-[10px]" : "py-2.5 text-sm"}`}
        >
          Reinitialiser les filtres
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
        className={`w-full border-2 border-gray-100 rounded-xl bg-white group-hover:border-blue-100 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 transition-all outline-none appearance-none disabled:bg-gray-50 disabled:text-gray-400 ${compact ? "px-2 py-2 text-xs" : "px-4 py-3 text-sm"}`}
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
