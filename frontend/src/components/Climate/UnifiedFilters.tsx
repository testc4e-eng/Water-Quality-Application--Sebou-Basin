import { useEffect, useState } from "react";
import {
  getHierarchySubmenus,
  getHierarchyParameters,
  getParameterEntities,
  type HierSubmenu,
  type HierParameter,
} from "@/api/observatory";

type Props = {
  theme: string;
  compact?: boolean;
  onChange: (params: {
    stationId?: string;
    parameter?: HierParameter;
    submenu?: string;
  }) => void;
};

export default function UnifiedFilters({ theme, onChange, compact }: Props) {
  const [submenus, setSubmenus] = useState<HierSubmenu[]>([]);
  const [parameters, setParameters] = useState<HierParameter[]>([]);
  const [entities, setEntities] = useState<any[]>([]);

  const [selectedSubmenu, setSelectedSubmenu] = useState<string | undefined>(undefined);
  const [selectedParamCode, setSelectedParamCode] = useState<string | undefined>(undefined);
  const [selectedEntityId, setSelectedEntityId] = useState<string | undefined>(undefined);

  // 1. Charge les sous-menus au changement de thème
  useEffect(() => {
    if (!theme) return;
    getHierarchySubmenus(theme).then((rows) => {
      setSubmenus(rows || []);
      setSelectedSubmenu(undefined);
      setSelectedParamCode(undefined);
      setSelectedEntityId(undefined);
    });
  }, [theme]);

  // 2. Charge les paramètres au changement de sous-menu
  useEffect(() => {
    if (!theme || !selectedSubmenu) {
      setParameters([]);
      return;
    }
    getHierarchyParameters(theme, selectedSubmenu).then((rows) => {
      setParameters(rows || []);
      setSelectedParamCode(undefined);
      setSelectedEntityId(undefined);
    });
  }, [theme, selectedSubmenu]);

  // 3. Charge les entités au changement de paramètre
  useEffect(() => {
    if (!theme || !selectedSubmenu || !selectedParamCode) {
      setEntities([]);
      return;
    }
    getParameterEntities({
      theme,
      sous_menu: selectedSubmenu,
      param_code: selectedParamCode,
    }).then((data: any) => {
      // API returns { "entity_ids": ["id1", "id2", ...] }
      const ids = Array.isArray(data?.entity_ids) ? data.entity_ids : [];
      setEntities(ids.map((id: string) => ({ id, name: id })));
      setSelectedEntityId(undefined);
    });
  }, [theme, selectedSubmenu, selectedParamCode]);

  // 4. Notifier le parent
  useEffect(() => {
    const param = parameters.find((p) => p.param_code === selectedParamCode);
    onChange({
      submenu: selectedSubmenu,
      parameter: param,
      stationId: selectedEntityId,
    });
  }, [selectedSubmenu, selectedParamCode, selectedEntityId, parameters, onChange]);

  return (
    <div className={compact ? "space-y-2 text-xs" : "space-y-4"}>
      {/* SOUS-MENU */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
          Sous-Menu
        </label>
        <Select
          value={selectedSubmenu}
          onChange={setSelectedSubmenu}
          placeholder="Choisir..."
          compact={compact}
        >
          {submenus.map((s) => (
            <option key={s.sous_menu} value={s.sous_menu}>
              {s.sous_menu}
            </option>
          ))}
        </Select>
      </div>

      {/* PARAMETRE */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
          Variable
        </label>
        <Select
          value={selectedParamCode}
          onChange={setSelectedParamCode}
          disabled={!selectedSubmenu}
          placeholder="Choisir..."
          compact={compact}
        >
          {parameters.map((p) => (
            <option key={p.param_code} value={p.param_code}>
              {p.param_label}
            </option>
          ))}
        </Select>
      </div>

      {/* STATION / ENTITE */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
          Site
        </label>
        <Select
          value={selectedEntityId}
          onChange={setSelectedEntityId}
          disabled={!selectedParamCode}
          placeholder="Choisir..."
          compact={compact}
        >
          {entities.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </Select>
      </div>

      {!compact && (
        <div className="pt-4 border-t border-gray-100">
           <p className="text-[10px] text-gray-400 leading-relaxed italic">
             La liste des stations s'adapte automatiquement selon la disponibilité des données.
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
          className={`w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${compact ? 'py-1.5 text-[10px]' : 'py-2.5 text-sm'}`}
        >
          Réinitialiser
        </button>
      )}
    </div>
  );
}

function Select({ value, onChange, children, disabled, placeholder, compact }: any) {
  return (
    <div className="relative">
      <select
        className={`w-full border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all outline-none appearance-none disabled:bg-gray-100 disabled:text-gray-500 ${compact ? 'px-2 py-1.5 text-xs' : 'px-3 py-2.5 text-sm'}`}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        disabled={disabled}
      >
        <option value="" disabled hidden>
          {placeholder || "Selectionner..."}
        </option>
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
