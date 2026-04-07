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
  actif: boolean;
};

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
      setFormActif(true);
      return;
    }
    setFormTitle(selected.title || "");
    setFormNameFields(toCsvList(selected.name_fields));
    setFormTypeFields(toCsvList(selected.type_fields));
    setFormClassFields(toCsvList(selected.class_fields));
    setFormCodeFields(toCsvList(selected.code_fields));
    setFormActif(!!selected.actif);
  }, [selected]);

  const hasSelection = useMemo(() => !!selected?.layer_key, [selected]);

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
    if (!confirm(`Supprimer la règle ${selected.layer_key} ?`)) return;
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
        <h1 className="text-2xl font-semibold text-slate-900">Administration - Règles Popups</h1>
        <p className="text-sm text-slate-500">
          Configure l’affichage lisible des popups cartographiques (nom, type, classe, code).
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

      {error && (
        <div className="rounded border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[420px_1fr]">
        <div className="rounded border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
            Couches ({rows.length})
          </div>
          <div className="max-h-[560px] overflow-auto">
            {loading ? (
              <div className="px-3 py-3 text-sm text-slate-500">Chargement...</div>
            ) : (
              rows.map((r) => (
                <button
                  key={r.layer_key}
                  type="button"
                  onClick={() => setSelected(r)}
                  className={`flex w-full items-center justify-between border-b border-slate-100 px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                    selected?.layer_key === r.layer_key ? "bg-blue-50" : ""
                  }`}
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
            <div className="text-sm text-slate-500">Sélectionne une couche à droite pour éditer la règle.</div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm font-semibold text-slate-800">layer_key: {selected?.layer_key}</div>
              <label className="block text-sm">
                <span className="mb-1 block text-slate-600">Titre</span>
                <input
                  className="w-full rounded border border-slate-300 px-2 py-1.5"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
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
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={formActif} onChange={(e) => setFormActif(e.target.checked)} />
                Règle active
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
