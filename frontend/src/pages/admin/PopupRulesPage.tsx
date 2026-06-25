import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

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

  const [selectedLayerName, setSelectedLayerName] = useState<string | null>(null);

  const [layerName, setLayerName] = useState("");
  const [geometryType, setGeometryType] = useState<GeometryType>("point");
  const [styleConfig, setStyleConfig] = useState<StyleConfig>(DEFAULT_STYLE.point);
  const [popupFields, setPopupFields] = useState<PopupField[]>(makeDefaultPopupFields());

  const selected = useMemo(
    () => rows.find((row) => row.layer_name === selectedLayerName) || null,
    [rows, selectedLayerName]
  );

  const resetForm = (geom: GeometryType = "point") => {
    setLayerName("");
    setGeometryType(geom);
    setStyleConfig(JSON.parse(JSON.stringify(DEFAULT_STYLE[geom])));
    setPopupFields(makeDefaultPopupFields());
    setSelectedLayerName(null);
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
    setGeometryType(selected.geometry_type);
    setStyleConfig(selected.style_config);
    setPopupFields(selected.popup_config?.fields || []);
  }, [selected]);

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
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Erreur suppression");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Administration - Gestion des couches</h1>
        <p className="text-sm text-slate-500">Symbologie simple + configuration des popups par couche (MVP).</p>
        <div className="mt-3 flex gap-2">
          <Link
            to="/dashboard-cartographique"
            className="inline-flex items-center rounded border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-100"
          >
            Ouvrir Dashboard Cartographique
          </Link>
          <button
            type="button"
            onClick={() => resetForm()}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Nouvelle config
          </button>
        </div>
      </div>

      {error && <div className="rounded border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_1fr]">
        <div className="rounded border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">Couches ({rows.length})</div>
          <div className="max-h-[620px] overflow-auto">
            {loading ? (
              <div className="px-3 py-3 text-sm text-slate-500">Chargement...</div>
            ) : rows.length === 0 ? (
              <div className="px-3 py-3 text-sm text-slate-500">Aucune configuration.</div>
            ) : (
              rows.map((row) => (
                <button
                  key={row.layer_name}
                  type="button"
                  onClick={() => setSelectedLayerName(row.layer_name)}
                  className={`flex w-full items-center justify-between border-b border-slate-100 px-3 py-2 text-left text-sm hover:bg-slate-50 ${selectedLayerName === row.layer_name ? "bg-blue-50" : ""}`}
                >
                  <span className="font-medium text-slate-800">{row.layer_name}</span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{row.geometry_type}</span>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4 rounded border border-slate-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-slate-600">Nom couche</span>
              <input
                className="w-full rounded border border-slate-300 px-2 py-1.5"
                value={layerName}
                disabled={!!selected}
                onChange={(e) => setLayerName(e.target.value)}
                placeholder="ex: stations_pluvio"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-slate-600">Type géométrie</span>
              <select
                className="w-full rounded border border-slate-300 px-2 py-1.5"
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
            <div className="rounded border border-slate-200 p-3">
              <div className="mb-2 text-sm font-semibold text-slate-800">Symbologie point</div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-600">Couleur</span>
                  <input type="color" value={styleConfig.point.color} onChange={(e) => setStyleConfig({ ...styleConfig, point: { ...styleConfig.point!, color: e.target.value } })} />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-600">Rayon</span>
                  <input type="number" min={1} max={50} className="w-full rounded border border-slate-300 px-2 py-1.5" value={styleConfig.point.radius} onChange={(e) => setStyleConfig({ ...styleConfig, point: { ...styleConfig.point!, radius: Number(e.target.value) } })} />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-600">Opacité</span>
                  <input type="number" min={0} max={1} step={0.05} className="w-full rounded border border-slate-300 px-2 py-1.5" value={styleConfig.point.opacity} onChange={(e) => setStyleConfig({ ...styleConfig, point: { ...styleConfig.point!, opacity: Number(e.target.value) } })} />
                </label>
              </div>
            </div>
          )}

          {geometryType === "line" && styleConfig.line && (
            <div className="rounded border border-slate-200 p-3">
              <div className="mb-2 text-sm font-semibold text-slate-800">Symbologie ligne</div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-600">Couleur</span>
                  <input type="color" value={styleConfig.line.color} onChange={(e) => setStyleConfig({ ...styleConfig, line: { ...styleConfig.line!, color: e.target.value } })} />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-600">Largeur</span>
                  <input type="number" min={1} max={20} className="w-full rounded border border-slate-300 px-2 py-1.5" value={styleConfig.line.width} onChange={(e) => setStyleConfig({ ...styleConfig, line: { ...styleConfig.line!, width: Number(e.target.value) } })} />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-600">Opacité</span>
                  <input type="number" min={0} max={1} step={0.05} className="w-full rounded border border-slate-300 px-2 py-1.5" value={styleConfig.line.opacity} onChange={(e) => setStyleConfig({ ...styleConfig, line: { ...styleConfig.line!, opacity: Number(e.target.value) } })} />
                </label>
              </div>
            </div>
          )}

          {geometryType === "polygon" && styleConfig.polygon && (
            <div className="rounded border border-slate-200 p-3">
              <div className="mb-2 text-sm font-semibold text-slate-800">Symbologie polygone</div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-600">Couleur remplissage</span>
                  <input type="color" value={styleConfig.polygon.fillColor} onChange={(e) => setStyleConfig({ ...styleConfig, polygon: { ...styleConfig.polygon!, fillColor: e.target.value } })} />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-600">Opacité remplissage</span>
                  <input type="number" min={0} max={1} step={0.05} className="w-full rounded border border-slate-300 px-2 py-1.5" value={styleConfig.polygon.fillOpacity} onChange={(e) => setStyleConfig({ ...styleConfig, polygon: { ...styleConfig.polygon!, fillOpacity: Number(e.target.value) } })} />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-600">Couleur contour</span>
                  <input type="color" value={styleConfig.polygon.strokeColor} onChange={(e) => setStyleConfig({ ...styleConfig, polygon: { ...styleConfig.polygon!, strokeColor: e.target.value } })} />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-600">Épaisseur contour</span>
                  <input type="number" min={0} max={10} className="w-full rounded border border-slate-300 px-2 py-1.5" value={styleConfig.polygon.strokeWidth} onChange={(e) => setStyleConfig({ ...styleConfig, polygon: { ...styleConfig.polygon!, strokeWidth: Number(e.target.value) } })} />
                </label>
              </div>
            </div>
          )}

          <div className="rounded border border-slate-200 p-3">
            <div className="mb-2 text-sm font-semibold text-slate-800">Champs popup</div>
            <div className="space-y-2">
              {popupFields.map((field, index) => (
                <div key={`${index}-${field.name}`} className="grid grid-cols-1 gap-2 rounded border border-slate-200 p-2 md:grid-cols-[1.2fr_1.2fr_80px_120px_100px_60px]">
                  <input
                    className="rounded border border-slate-300 px-2 py-1.5 text-sm"
                    placeholder="name"
                    value={field.name}
                    onChange={(e) => updatePopupField(index, { name: e.target.value })}
                  />
                  <input
                    className="rounded border border-slate-300 px-2 py-1.5 text-sm"
                    placeholder="alias"
                    value={field.alias}
                    onChange={(e) => updatePopupField(index, { alias: e.target.value })}
                  />
                  <input
                    type="number"
                    min={1}
                    className="rounded border border-slate-300 px-2 py-1.5 text-sm"
                    value={field.order}
                    onChange={(e) => updatePopupField(index, { order: Number(e.target.value) })}
                  />
                  <select
                    className="rounded border border-slate-300 px-2 py-1.5 text-sm"
                    value={field.format || ""}
                    onChange={(e) => updatePopupField(index, { format: (e.target.value || null) as PopupField["format"] })}
                  >
                    <option value="">Texte</option>
                    <option value="number">Nombre</option>
                    <option value="date">Date</option>
                  </select>
                  <label className="flex items-center gap-2 text-xs text-slate-600">
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
                    className="rounded border border-rose-300 bg-rose-50 px-2 py-1 text-xs text-rose-700"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addPopupField}
                className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700"
              >
                Ajouter champ
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => void saveConfig()}
              className="rounded border border-blue-300 bg-blue-50 px-3 py-1.5 text-sm text-blue-700 disabled:opacity-60"
            >
              {selected ? "Mettre à jour" : "Créer"}
            </button>

            {selected && (
              <button
                type="button"
                disabled={saving}
                onClick={() => void deleteConfig()}
                className="rounded border border-rose-300 bg-rose-50 px-3 py-1.5 text-sm text-rose-700 disabled:opacity-60"
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
