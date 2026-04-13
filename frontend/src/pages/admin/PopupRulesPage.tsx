import { useEffect, useMemo, useState } from "react";
import { api } from "@/api/client";
import { Link } from "react-router-dom";

type PopupRuleRow = {
  layer_key: string;
  title: string | null;
  name_fields: string[] | null;
  type_fields: string[] | null;
  class_fields: string[] | null;
  code_fields: string[] | null;
  point_style?: Record<string, any> | null;
  line_style?: Record<string, any> | null;
  polygon_style?: Record<string, any> | null;
  point_popup_fields?: string[] | null;
  line_popup_fields?: string[] | null;
  polygon_popup_fields?: string[] | null;
  actif: boolean;
};

type LayerGeometryType = "point" | "line" | "polygon" | "unknown";

const POINT_LAYER_KEYS = new Set<string>([
  "barrages_abhs",
  "stations_abhs",
  "points_eau",
  "sources",
  "decharges_abhs",
  "huileries_abhs",
  "mines_abhs",
  "rejets_industriels_abhs",
  "rejets_domestiques_abhs",
  "step_abhs",
  "step_industrielles",
  "stm",
  "fosses_septiques_abhs",
  "adm_villes_abhs",
  "adm_douars_abhs",
]);

const LINE_LAYER_KEYS = new Set<string>([
  "reseau_hydro_abhs",
]);

const POLYGON_LAYER_KEYS = new Set<string>([
  "bassin_sebou",
  "sous_bassin_sebou",
  "sous_bassins_swat",
  "nappes",
  "adm_regions_abhs",
  "adm_provinces_abhs",
  "adm_cercles_abhs",
  "adm_communes_abhs",
]);

function getLayerGeometryType(layerKey?: string | null): LayerGeometryType {
  if (!layerKey) return "unknown";
  if (POINT_LAYER_KEYS.has(layerKey)) return "point";
  if (LINE_LAYER_KEYS.has(layerKey)) return "line";
  if (POLYGON_LAYER_KEYS.has(layerKey)) return "polygon";
  return "unknown";
}

function toCsvList(v?: string[] | null): string {
  return (v || []).join(", ");
}

function fromCsvList(v: string): string[] {
  return v
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function PopupRulesPage() {
  const [rows, setRows] = useState<PopupRuleRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<PopupRuleRow | null>(null);
  const [saving, setSaving] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [formNameFields, setFormNameFields] = useState("");
  const [formTypeFields, setFormTypeFields] = useState("");
  const [formClassFields, setFormClassFields] = useState("");
  const [formCodeFields, setFormCodeFields] = useState("");

  const [formPointColor, setFormPointColor] = useState("#0ea5e9");
  const [formPointSize, setFormPointSize] = useState("5");
  const [formPointPopupFields, setFormPointPopupFields] = useState("");

  const [formLineColor, setFormLineColor] = useState("#2563eb");
  const [formLineWidth, setFormLineWidth] = useState("1.4");
  const [formLineStyle, setFormLineStyle] = useState<"simple" | "dashed" | "gradient">("simple");
  const [formLineGradientTo, setFormLineGradientTo] = useState("#0ea5e9");
  const [formLinePopupFields, setFormLinePopupFields] = useState("");

  const [formPolygonColor, setFormPolygonColor] = useState("#1d4ed8");
  const [formPolygonGradientTo, setFormPolygonGradientTo] = useState("#bfdbfe");
  const [formPolygonOpacity, setFormPolygonOpacity] = useState("0.28");
  const [formPolygonContourMode, setFormPolygonContourMode] = useState<"simple" | "gradue">("simple");
  const [formPolygonContourColor, setFormPolygonContourColor] = useState("#1e293b");
  const [formPolygonPopupFields, setFormPolygonPopupFields] = useState("");

  const [formActif, setFormActif] = useState(true);

  const loadRows = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<{ rows: PopupRuleRow[] }>("/observatory/popup-rules/list");
      setRows(res.data?.rows || []);
    } catch (e: any) {
      setError(e?.message || "Erreur chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRows();
  }, []);

  useEffect(() => {
    if (!selected) {
      setFormTitle("");
      setFormNameFields("");
      setFormTypeFields("");
      setFormClassFields("");
      setFormCodeFields("");
      setFormPointColor("#0ea5e9");
      setFormPointSize("5");
      setFormPointPopupFields("");
      setFormLineColor("#2563eb");
      setFormLineWidth("1.4");
      setFormLineStyle("simple");
      setFormLineGradientTo("#0ea5e9");
      setFormLinePopupFields("");
      setFormPolygonColor("#1d4ed8");
      setFormPolygonGradientTo("#bfdbfe");
      setFormPolygonOpacity("0.28");
      setFormPolygonContourMode("simple");
      setFormPolygonContourColor("#1e293b");
      setFormPolygonPopupFields("");
      setFormActif(true);
      return;
    }

    setFormTitle(selected.title || "");
    setFormNameFields(toCsvList(selected.name_fields));
    setFormTypeFields(toCsvList(selected.type_fields));
    setFormClassFields(toCsvList(selected.class_fields));
    setFormCodeFields(toCsvList(selected.code_fields));

    const pointStyle = selected.point_style || {};
    const lineStyle = selected.line_style || {};
    const polygonStyle = selected.polygon_style || {};

    setFormPointColor(String(pointStyle.color || "#0ea5e9"));
    setFormPointSize(String(pointStyle.size ?? 5));
    setFormPointPopupFields(toCsvList(selected.point_popup_fields));

    setFormLineColor(String(lineStyle.color || "#2563eb"));
    setFormLineWidth(String(lineStyle.width ?? 1.4));
    setFormLineStyle((lineStyle.style || "simple") as "simple" | "dashed" | "gradient");
    setFormLineGradientTo(String(lineStyle.gradient_to || "#0ea5e9"));
    setFormLinePopupFields(toCsvList(selected.line_popup_fields));

    setFormPolygonColor(String(polygonStyle.color || "#1d4ed8"));
    setFormPolygonGradientTo(String(polygonStyle.gradient_to || "#bfdbfe"));
    setFormPolygonOpacity(String(polygonStyle.opacity ?? 0.28));
    setFormPolygonContourMode((polygonStyle.contour_mode || "simple") as "simple" | "gradue");
    setFormPolygonContourColor(String(polygonStyle.contour_color || "#1e293b"));
    setFormPolygonPopupFields(toCsvList(selected.polygon_popup_fields));

    setFormActif(!!selected.actif);
  }, [selected]);

  const hasSelection = useMemo(() => !!selected?.layer_key, [selected]);
  const selectedGeometryType = useMemo(
    () => getLayerGeometryType(selected?.layer_key),
    [selected?.layer_key]
  );

  const saveRule = async () => {
    if (!selected?.layer_key) return;
    setSaving(true);
    try {
      await api.post("/observatory/popup-rules/upsert", {
        layer_key: selected.layer_key,
        title: formTitle || null,
        name_fields: fromCsvList(formNameFields),
        type_fields: fromCsvList(formTypeFields),
        class_fields: fromCsvList(formClassFields),
        code_fields: fromCsvList(formCodeFields),
        point_style: {
          color: formPointColor,
          size: Number(formPointSize) || 5,
        },
        line_style: {
          color: formLineColor,
          width: Number(formLineWidth) || 1.4,
          style: formLineStyle,
          gradient_to: formLineGradientTo,
        },
        polygon_style: {
          color: formPolygonColor,
          gradient_to: formPolygonGradientTo,
          opacity: Number(formPolygonOpacity) || 0.28,
          contour_mode: formPolygonContourMode,
          contour_color: formPolygonContourColor,
        },
        point_popup_fields: fromCsvList(formPointPopupFields),
        line_popup_fields: fromCsvList(formLinePopupFields),
        polygon_popup_fields: fromCsvList(formPolygonPopupFields),
        actif: formActif,
      });
      await api.post("/observatory/cache/clear");
      await loadRows();
    } finally {
      setSaving(false);
    }
  };

  const deleteRule = async () => {
    if (!selected?.layer_key) return;
    if (!confirm(`Supprimer la regle ${selected.layer_key} ?`)) return;
    setSaving(true);
    try {
      await api.delete(`/observatory/popup-rules/${encodeURIComponent(selected.layer_key)}`);
      await api.post("/observatory/cache/clear");
      setSelected(null);
      await loadRows();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Administration - Gestion des couches</h1>
        <p className="text-sm text-slate-500">
          Configure les regles popup existantes et la symbologie des couches (point, ligne, polygone).
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            to="/dashboard-cartographique"
            className="inline-flex items-center rounded border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-100"
          >
            Ouvrir Dashboard Cartographique (test popup)
          </Link>
          <button
            type="button"
            className="inline-flex items-center rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            onClick={() => void api.post("/observatory/cache/clear")}
          >
            Clear cache observatory
          </button>
        </div>
      </div>

      {error && <div className="rounded border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[420px_1fr]">
        <div className="rounded border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">Couches ({rows.length})</div>
          <div className="max-h-[560px] overflow-auto">
            {loading ? (
              <div className="px-3 py-3 text-sm text-slate-500">Chargement...</div>
            ) : (
              rows.map((r) => (
                <button
                  key={r.layer_key}
                  type="button"
                  onClick={() => setSelected(r)}
                  className={`flex w-full items-center justify-between border-b border-slate-100 px-3 py-2 text-left text-sm hover:bg-slate-50 ${selected?.layer_key === r.layer_key ? "bg-blue-50" : ""}`}
                >
                  <span className="font-medium text-slate-800">{r.layer_key}</span>
                  <span className={`rounded px-1.5 py-0.5 text-xs ${r.actif ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {r.actif ? "actif" : "off"}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="rounded border border-slate-200 bg-white p-4">
          {!hasSelection ? (
            <div className="text-sm text-slate-500">Selectionne une couche a droite pour editer la regle.</div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm font-semibold text-slate-800">layer_key: {selected?.layer_key}</div>
              <label className="block text-sm">
                <span className="mb-1 block text-slate-600">Titre</span>
                <input className="w-full rounded border border-slate-300 px-2 py-1.5" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-slate-600">name_fields (csv)</span>
                <input className="w-full rounded border border-slate-300 px-2 py-1.5" value={formNameFields} onChange={(e) => setFormNameFields(e.target.value)} />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-slate-600">type_fields (csv)</span>
                <input className="w-full rounded border border-slate-300 px-2 py-1.5" value={formTypeFields} onChange={(e) => setFormTypeFields(e.target.value)} />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-slate-600">class_fields (csv)</span>
                <input className="w-full rounded border border-slate-300 px-2 py-1.5" value={formClassFields} onChange={(e) => setFormClassFields(e.target.value)} />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-slate-600">code_fields (csv)</span>
                <input className="w-full rounded border border-slate-300 px-2 py-1.5" value={formCodeFields} onChange={(e) => setFormCodeFields(e.target.value)} />
              </label>

              {(selectedGeometryType === "point" || selectedGeometryType === "unknown") && (
                <div className="mt-2 rounded border border-slate-200 p-3">
                  <div className="mb-2 text-sm font-semibold text-slate-800">Symbologie points</div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <label className="block text-sm">
                      <span className="mb-1 block text-slate-600">Couleur</span>
                      <input type="color" className="h-9 w-full rounded border border-slate-300" value={formPointColor} onChange={(e) => setFormPointColor(e.target.value)} />
                    </label>
                    <label className="block text-sm">
                      <span className="mb-1 block text-slate-600">Taille</span>
                      <input type="number" min={1} max={30} step="0.5" className="w-full rounded border border-slate-300 px-2 py-1.5" value={formPointSize} onChange={(e) => setFormPointSize(e.target.value)} />
                    </label>
                  </div>
                  <label className="mt-2 block text-sm">
                    <span className="mb-1 block text-slate-600">Infos popup point (csv)</span>
                    <input className="w-full rounded border border-slate-300 px-2 py-1.5" value={formPointPopupFields} onChange={(e) => setFormPointPopupFields(e.target.value)} />
                  </label>
                </div>
              )}

              {(selectedGeometryType === "line" || selectedGeometryType === "unknown") && (
                <div className="mt-2 rounded border border-slate-200 p-3">
                  <div className="mb-2 text-sm font-semibold text-slate-800">Symbologie lignes</div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <label className="block text-sm">
                      <span className="mb-1 block text-slate-600">Couleur</span>
                      <input type="color" className="h-9 w-full rounded border border-slate-300" value={formLineColor} onChange={(e) => setFormLineColor(e.target.value)} />
                    </label>
                    <label className="block text-sm">
                      <span className="mb-1 block text-slate-600">Taille de ligne</span>
                      <input type="number" min={0.5} max={20} step="0.2" className="w-full rounded border border-slate-300 px-2 py-1.5" value={formLineWidth} onChange={(e) => setFormLineWidth(e.target.value)} />
                    </label>
                    <label className="block text-sm">
                      <span className="mb-1 block text-slate-600">Style ligne</span>
                      <select className="w-full rounded border border-slate-300 px-2 py-1.5" value={formLineStyle} onChange={(e) => setFormLineStyle(e.target.value as "simple" | "dashed" | "gradient")}>
                        <option value="simple">Simple</option>
                        <option value="dashed">Trait</option>
                        <option value="gradient">Degrade</option>
                      </select>
                    </label>
                    <label className="block text-sm">
                      <span className="mb-1 block text-slate-600">Couleur degrade vers</span>
                      <input type="color" className="h-9 w-full rounded border border-slate-300" value={formLineGradientTo} onChange={(e) => setFormLineGradientTo(e.target.value)} />
                    </label>
                  </div>
                  <label className="mt-2 block text-sm">
                    <span className="mb-1 block text-slate-600">Infos popup ligne (csv)</span>
                    <input className="w-full rounded border border-slate-300 px-2 py-1.5" value={formLinePopupFields} onChange={(e) => setFormLinePopupFields(e.target.value)} />
                  </label>
                </div>
              )}

              {(selectedGeometryType === "polygon" || selectedGeometryType === "unknown") && (
                <div className="mt-2 rounded border border-slate-200 p-3">
                  <div className="mb-2 text-sm font-semibold text-slate-800">Symbologie polygones</div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <label className="block text-sm">
                      <span className="mb-1 block text-slate-600">Couleur</span>
                      <input type="color" className="h-9 w-full rounded border border-slate-300" value={formPolygonColor} onChange={(e) => setFormPolygonColor(e.target.value)} />
                    </label>
                    <label className="block text-sm">
                      <span className="mb-1 block text-slate-600">Degrade vers</span>
                      <input type="color" className="h-9 w-full rounded border border-slate-300" value={formPolygonGradientTo} onChange={(e) => setFormPolygonGradientTo(e.target.value)} />
                    </label>
                    <label className="block text-sm">
                      <span className="mb-1 block text-slate-600">Opacite</span>
                      <input type="number" min={0} max={1} step="0.05" className="w-full rounded border border-slate-300 px-2 py-1.5" value={formPolygonOpacity} onChange={(e) => setFormPolygonOpacity(e.target.value)} />
                    </label>
                    <label className="block text-sm">
                      <span className="mb-1 block text-slate-600">Contour</span>
                      <select className="w-full rounded border border-slate-300 px-2 py-1.5" value={formPolygonContourMode} onChange={(e) => setFormPolygonContourMode(e.target.value as "simple" | "gradue")}>
                        <option value="simple">Simple</option>
                        <option value="gradue">Gradue</option>
                      </select>
                    </label>
                    <label className="block text-sm">
                      <span className="mb-1 block text-slate-600">Couleur contour</span>
                      <input type="color" className="h-9 w-full rounded border border-slate-300" value={formPolygonContourColor} onChange={(e) => setFormPolygonContourColor(e.target.value)} />
                    </label>
                  </div>
                  <label className="mt-2 block text-sm">
                    <span className="mb-1 block text-slate-600">Infos popup polygone (csv)</span>
                    <input className="w-full rounded border border-slate-300 px-2 py-1.5" value={formPolygonPopupFields} onChange={(e) => setFormPolygonPopupFields(e.target.value)} />
                  </label>
                </div>
              )}

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={formActif} onChange={(e) => setFormActif(e.target.checked)} />
                Regle active
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void saveRule()}
                  className="rounded border border-blue-300 bg-blue-50 px-3 py-1.5 text-sm text-blue-700 disabled:opacity-60"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void deleteRule()}
                  className="rounded border border-rose-300 bg-rose-50 px-3 py-1.5 text-sm text-rose-700 disabled:opacity-60"
                >
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
