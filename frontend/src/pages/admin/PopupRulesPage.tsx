import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { DEFAULT_TOGGLES } from "@/layers/config";
import { api } from "@/api/client";

import { layerConfigApi } from "@/services/layerConfigApi";
import { validateLayerConfigDraft } from "@/lib/layerConfigValidation";
import type {
  GeometryType,
  LayerConfig,
  LayerConfigCreate,
  LayerConfigUpdate,
  PopupField,
  StyleConfig,
} from "@/types/layerConfig";

const DEFAULT_STYLE: Record<GeometryType, StyleConfig> = {
  point: {
    type: "simple",
    point: {
      color: "#3498db",
      radius: 6,
      opacity: 0.85,
      strokeColor: "#ffffff",
      strokeWidth: 1,
    },
  },
  line: {
    type: "simple",
    line: {
      color: "#2980b9",
      width: 2,
      opacity: 0.9,
    },
  },
  polygon: {
    type: "simple",
    polygon: {
      fillColor: "#3498db",
      fillOpacity: 0.4,
      strokeColor: "#2c3e50",
      strokeWidth: 1,
    },
  },
};

const DEFAULT_BBOX = "-8.881832,32.306976,-2.218168,36.149176";

function makeDefaultPopupFields(): PopupField[] {
  return [
    { name: "name", alias: "Nom", order: 1, visible: true, format: null },
    { name: "value", alias: "Valeur", order: 2, visible: true, format: "number", formatOptions: { decimals: 2 } },
  ];
}

export default function PopupRulesPage() {
  const [rows, setRows] = useState<LayerConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [isNewConfigMode, setIsNewConfigMode] = useState(false);
  const [layerTypeByKey, setLayerTypeByKey] = useState<Record<string, GeometryType>>({});
  const [layerFieldsByKey, setLayerFieldsByKey] = useState<Record<string, PopupField[]>>({});
  const lastAutoLayerRef = useRef<string | null>(null);

  const [selectedLayerName, setSelectedLayerName] = useState<string | null>(null);

  const [layerName, setLayerName] = useState("");
  const [geometryType, setGeometryType] = useState<GeometryType>("point");
  const [styleConfig, setStyleConfig] = useState<StyleConfig>(DEFAULT_STYLE.point);
  const [popupFields, setPopupFields] = useState<PopupField[]>(makeDefaultPopupFields());

  const selected = useMemo(
    () => rows.find((row) => row.layer_name === selectedLayerName) || null,
    [rows, selectedLayerName]
  );

  const availableLayerKeys = useMemo(() => {
    return Object.keys(DEFAULT_TOGGLES || {}).sort((a, b) => a.localeCompare(b));
  }, []);

  const rowsByName = useMemo(() => {
    return new Map(rows.map((row) => [row.layer_name, row]));
  }, [rows]);

  const layerChoices = useMemo(() => {
    const fromDb = rows.map((row) => row.layer_name);
    const uniq = Array.from(new Set([...availableLayerKeys, ...fromDb])).filter(Boolean);
    return uniq.sort((a, b) => a.localeCompare(b));
  }, [rows, availableLayerKeys]);

  const resetForm = (geom: GeometryType = "point") => {
    setLayerName("");
    setGeometryType(geom);
    setStyleConfig(JSON.parse(JSON.stringify(DEFAULT_STYLE[geom])));
    setPopupFields(makeDefaultPopupFields());
    setSelectedLayerName(null);
  };

  const inferGeometryType = (geomType?: string | null): GeometryType => {
    if (!geomType) return "point";
    const raw = geomType.toLowerCase();
    if (raw.includes("line")) return "line";
    if (raw.includes("polygon")) return "polygon";
    return "point";
  };

  const buildPopupFieldsFromProps = (props: Record<string, unknown>): PopupField[] => {
    const keys = Object.keys(props || {});
    if (!keys.length) return makeDefaultPopupFields();
    return keys.map((key, index) => ({
      name: key,
      alias: key.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()),
      order: index + 1,
      visible: true,
      format: null,
    }));
  };

  const loadLayerMeta = async (layerKey: string) => {
    if (!layerKey) return;
    if (layerTypeByKey[layerKey] && layerFieldsByKey[layerKey]) return;
    try {
      const res = await api.get(`/layers/${encodeURIComponent(layerKey)}`, {
        params: { max_features: 1, bbox: DEFAULT_BBOX },
      });
      const feature = res.data?.features?.[0];
      const geomType = inferGeometryType(feature?.geometry?.type || null);
      const props = (feature?.properties || {}) as Record<string, unknown>;
      setLayerTypeByKey((prev) => ({ ...prev, [layerKey]: geomType }));
      setLayerFieldsByKey((prev) => ({ ...prev, [layerKey]: buildPopupFieldsFromProps(props) }));
    } catch {
      // ignore fetch errors; fall back to defaults
    }
  };

  const notifyConfigsUpdated = () => {
    const stamp = String(Date.now());
    try {
      localStorage.setItem("layer_configs_updated_at", stamp);
    } catch {
      // ignore storage errors
    }
    window.dispatchEvent(new CustomEvent("layer-configs-updated", { detail: { stamp } }));
  };

  const loadRows = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await layerConfigApi.list(false);
      setRows(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Erreur chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRows();
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLayerName(selected.layer_name);
    const inferred = layerTypeByKey[selected.layer_name];
    const effectiveGeom = inferred || selected.geometry_type;
    setGeometryType(effectiveGeom);
    if (selected.geometry_type === effectiveGeom) {
      setStyleConfig(selected.style_config);
      setPopupFields(selected.popup_config?.fields || []);
    } else {
      setStyleConfig(JSON.parse(JSON.stringify(DEFAULT_STYLE[effectiveGeom])));
      setPopupFields(layerFieldsByKey[selected.layer_name] || makeDefaultPopupFields());
    }
    setIsNewConfigMode(false);
  }, [selected, layerFieldsByKey, layerTypeByKey]);

  useEffect(() => {
    if (!selectedLayerName || selected) return;
    void loadLayerMeta(selectedLayerName);
  }, [selectedLayerName, selected]);

  useEffect(() => {
    if (!selectedLayerName || selected) return;
    const cachedFields = layerFieldsByKey[selectedLayerName];
    const cachedType = layerTypeByKey[selectedLayerName];
    if (lastAutoLayerRef.current !== selectedLayerName) {
      if (cachedType) {
        setGeometryType(cachedType);
        setStyleConfig(JSON.parse(JSON.stringify(DEFAULT_STYLE[cachedType])));
      }
      if (cachedFields && cachedFields.length) {
        setPopupFields(cachedFields);
      }
      lastAutoLayerRef.current = selectedLayerName;
    }
  }, [layerFieldsByKey, layerTypeByKey, selectedLayerName, selected]);

  useEffect(() => {
    const configuredTypes: Record<string, GeometryType> = {};
    rows.forEach((row) => {
      configuredTypes[row.layer_name] = row.geometry_type;
    });
    if (Object.keys(configuredTypes).length) {
      setLayerTypeByKey((prev) => ({ ...configuredTypes, ...prev }));
    }
  }, [rows]);


  const updatePopupField = (index: number, updates: Partial<PopupField>) => {
    setPopupFields((prev) => prev.map((field, i) => (i === index ? { ...field, ...updates } : field)));
  };

  const addPopupField = () => {
    setPopupFields((prev) => [
      ...prev,
      {
        name: "",
        alias: "",
        order: prev.length + 1,
        visible: true,
        format: null,
      },
    ]);
  };

  const removePopupField = (index: number) => {
    setPopupFields((prev) => prev.filter((_, i) => i !== index));
  };

  const saveConfig = async () => {
    setSaving(true);
    setError(null);

    try {
      if (!layerName.trim()) {
        throw new Error("Le nom de couche est requis");
      }

      const payloadBase = {
        geometry_type: geometryType,
        style_config: styleConfig,
        popup_config: {
          fields: popupFields,
        },
      };

      const validationErrors = validateLayerConfigDraft({
        geometry_type: geometryType,
        style_config: styleConfig,
        popup_fields: popupFields,
      });
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(" | "));
      }

      if (selected) {
        const payload: LayerConfigUpdate = payloadBase;
        await layerConfigApi.update(selected.layer_name, payload);
      } else {
        const payload: LayerConfigCreate = {
          layer_name: layerName.trim(),
          ...payloadBase,
        };
        await layerConfigApi.create(payload);
      }

      await loadRows();
      setSelectedLayerName(layerName.trim());
      setRefreshNonce((value) => value + 1);
      setIsNewConfigMode(false);
      notifyConfigsUpdated();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Erreur enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const deleteConfig = async () => {
    if (!selected) return;
    if (!window.confirm(`Supprimer la config de ${selected.layer_name} ?`)) return;

    setSaving(true);
    setError(null);
    try {
      await layerConfigApi.remove(selected.layer_name);
      await loadRows();
      resetForm();
      setRefreshNonce((value) => value + 1);
      setIsNewConfigMode(false);
      notifyConfigsUpdated();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Erreur suppression");
    } finally {
      setSaving(false);
    }
  };

  const deleteRow = async (row: LayerConfig) => {
    if (!window.confirm(`Supprimer la config de ${row.layer_name} ?`)) return;
    setSaving(true);
    setError(null);
    try {
      await layerConfigApi.remove(row.layer_name);
      await loadRows();
      if (selectedLayerName === row.layer_name) {
        resetForm();
      }
      setRefreshNonce((value) => value + 1);
      setIsNewConfigMode(false);
      notifyConfigsUpdated();
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Erreur suppression");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 bg-[#f8f9fa] p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Administration - Gestion d'affichage</h1>
        <p className="mt-1 text-sm text-slate-500">
          Configurez l’affichage cartographique et les popups associés par couche.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to={`/dashboard-cartographique?refresh=${refreshNonce}`}
            className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
          >
            Ouvrir Dashboard Cartographique
          </Link>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsNewConfigMode(true);
            }}
            className="rounded-xl bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1b3354]"
          >
            Nouvelle config
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="rounded-t-2xl border-b border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-700">
            Couches ({availableLayerKeys.length})
          </div>
          <div className="max-h-[620px] overflow-auto px-1 py-1">
            {loading ? (
              <div className="px-3 py-6 text-sm text-slate-500">Chargement...</div>
            ) : availableLayerKeys.length === 0 ? (
              <div className="flex min-h-[140px] items-center justify-center px-3 py-6 text-sm text-slate-400">
                Aucune couche disponible.
              </div>
            ) : (
              availableLayerKeys.map((layerKey) => {
                const row = rowsByName.get(layerKey);
                const type = row?.geometry_type || layerTypeByKey[layerKey];
                return (
                <div
                  key={layerKey}
                  className={`flex items-center justify-between rounded-xl border border-transparent px-3 py-2 text-sm transition hover:border-slate-200 hover:bg-slate-50 ${
                    selectedLayerName === layerKey ? "border-blue-100 bg-blue-50" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLayerName(layerKey);
                      setLayerName(layerKey);
                      setIsNewConfigMode(false);
                      const inferred = layerTypeByKey[layerKey];
                      const defaultGeom = inferred || type || "point";
                      setGeometryType(defaultGeom);
                      if (row && row.geometry_type === defaultGeom) {
                        setStyleConfig(row.style_config);
                        setPopupFields(row.popup_config?.fields || []);
                      } else {
                        setStyleConfig(JSON.parse(JSON.stringify(DEFAULT_STYLE[defaultGeom])));
                        const defaultFields = layerFieldsByKey[layerKey];
                        setPopupFields(defaultFields && defaultFields.length ? defaultFields : makeDefaultPopupFields());
                      }
                      void loadLayerMeta(layerKey);
                    }}
                    className="flex flex-1 items-center justify-between text-left"
                  >
                    <span className="font-medium text-slate-800">{layerKey}</span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {type || "—"}
                    </span>
                  </button>
                  {row && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        void deleteRow(row);
                      }}
                      className="ml-2 rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-700 transition hover:bg-rose-100"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Nom couche</span>
              {isNewConfigMode && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {layerChoices.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        setLayerName(name);
                        const inferred = layerTypeByKey[name];
                        if (inferred) {
                          setGeometryType(inferred);
                          setStyleConfig(JSON.parse(JSON.stringify(DEFAULT_STYLE[inferred])));
                        }
                        const defaults = layerFieldsByKey[name];
                        if (defaults && defaults.length) {
                          setPopupFields(defaults);
                        }
                        void loadLayerMeta(name);
                      }}
                      className={[
                        "rounded-full border px-3 py-1 text-xs font-semibold transition",
                        layerName === name
                          ? "border-blue-700 bg-blue-700 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      {name.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              )}
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={layerName}
                disabled={!!selectedLayerName && !isNewConfigMode}
                onChange={(e) => setLayerName(e.target.value)}
                placeholder="ex: stations_pluvio"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Type géométrie</span>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={geometryType}
                onChange={(e) => {
                  const next = e.target.value as GeometryType;
                  setGeometryType(next);
                  setStyleConfig(DEFAULT_STYLE[next]);
                }}
              >
                <option value="point">Point</option>
                <option value="line">Ligne</option>
                <option value="polygon">Polygone</option>
              </select>
            </label>
          </div>

          {geometryType === "point" && styleConfig.point && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="mb-3 text-sm font-semibold text-slate-800">Symbologie point</div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Couleur</span>
                  <input type="color" value={styleConfig.point.color} onChange={(e) => setStyleConfig({ ...styleConfig, point: { ...styleConfig.point!, color: e.target.value } })} />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Rayon</span>
                  <input type="number" min={1} max={50} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" value={styleConfig.point.radius} onChange={(e) => setStyleConfig({ ...styleConfig, point: { ...styleConfig.point!, radius: Number(e.target.value) } })} />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Opacité</span>
                  <input type="number" min={0} max={1} step={0.05} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" value={styleConfig.point.opacity} onChange={(e) => setStyleConfig({ ...styleConfig, point: { ...styleConfig.point!, opacity: Number(e.target.value) } })} />
                </label>
              </div>
            </div>
          )}

          {geometryType === "line" && styleConfig.line && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="mb-3 text-sm font-semibold text-slate-800">Symbologie ligne</div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Couleur</span>
                  <input type="color" value={styleConfig.line.color} onChange={(e) => setStyleConfig({ ...styleConfig, line: { ...styleConfig.line!, color: e.target.value } })} />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Largeur</span>
                  <input type="number" min={1} max={20} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" value={styleConfig.line.width} onChange={(e) => setStyleConfig({ ...styleConfig, line: { ...styleConfig.line!, width: Number(e.target.value) } })} />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Opacité</span>
                  <input type="number" min={0} max={1} step={0.05} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" value={styleConfig.line.opacity} onChange={(e) => setStyleConfig({ ...styleConfig, line: { ...styleConfig.line!, opacity: Number(e.target.value) } })} />
                </label>
              </div>
            </div>
          )}

          {geometryType === "polygon" && styleConfig.polygon && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="mb-3 text-sm font-semibold text-slate-800">Symbologie polygone</div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Couleur remplissage</span>
                  <input type="color" value={styleConfig.polygon.fillColor} onChange={(e) => setStyleConfig({ ...styleConfig, polygon: { ...styleConfig.polygon!, fillColor: e.target.value } })} />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Opacité remplissage</span>
                  <input type="number" min={0} max={1} step={0.05} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" value={styleConfig.polygon.fillOpacity} onChange={(e) => setStyleConfig({ ...styleConfig, polygon: { ...styleConfig.polygon!, fillOpacity: Number(e.target.value) } })} />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Couleur contour</span>
                  <input type="color" value={styleConfig.polygon.strokeColor} onChange={(e) => setStyleConfig({ ...styleConfig, polygon: { ...styleConfig.polygon!, strokeColor: e.target.value } })} />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Épaisseur contour</span>
                  <input type="number" min={0} max={10} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" value={styleConfig.polygon.strokeWidth} onChange={(e) => setStyleConfig({ ...styleConfig, polygon: { ...styleConfig.polygon!, strokeWidth: Number(e.target.value) } })} />
                </label>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="mb-3 text-sm font-semibold text-slate-800">Champs popup</div>
            <div className="space-y-2">
              {popupFields.map((field, index) => (
                <div key={`${index}-${field.name}`} className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 bg-white p-3 md:grid-cols-[1.2fr_1.2fr_80px_120px_100px_60px]">
                  <input
                    className="rounded-lg border border-slate-300 px-2.5 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="name"
                    value={field.name}
                    onChange={(e) => updatePopupField(index, { name: e.target.value })}
                  />
                  <input
                    className="rounded-lg border border-slate-300 px-2.5 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="alias"
                    value={field.alias}
                    onChange={(e) => updatePopupField(index, { alias: e.target.value })}
                  />
                  <input
                    type="number"
                    min={1}
                    className="rounded-lg border border-slate-300 px-2.5 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    value={field.order}
                    onChange={(e) => updatePopupField(index, { order: Number(e.target.value) })}
                  />
                  <select
                    className="rounded-lg border border-slate-300 px-2.5 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    value={field.format || ""}
                    onChange={(e) => updatePopupField(index, { format: (e.target.value || null) as PopupField["format"] })}
                  >
                    <option value="">Texte</option>
                    <option value="number">Nombre</option>
                    <option value="date">Date</option>
                  </select>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <input
                      type="checkbox"
                      checked={field.visible}
                      onChange={(e) => updatePopupField(index, { visible: e.target.checked })}
                    />
                    Visible
                  </label>
                  <button
                    type="button"
                    onClick={() => removePopupField(index)}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addPopupField}
                className="w-fit rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
              >
                + Ajouter champ
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => void saveConfig()}
              className="flex-1 rounded-xl bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1b3354] disabled:opacity-60"
            >
              {selectedLayerName ? "Enregistrer" : "Créer"}
            </button>

            {selected && (
              <button
                type="button"
                disabled={saving}
                onClick={() => void deleteConfig()}
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
              >
                Supprimer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
