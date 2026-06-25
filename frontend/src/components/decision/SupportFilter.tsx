import {
  supportOptions,
  type DecisionDisplayMode,
  type DecisionFamilyDefinition,
} from "@/config/decisionDashboardCatalog";

interface SupportFilterProps {
  familyOptions: DecisionFamilyDefinition[];
  selectedFamilyId: string;
  selectedParameterCode: string;
  selectedSupportType: string;
  selectedDisplayMode: DecisionDisplayMode;
  dateStart: string;
  dateEnd: string;
  limit: number;
  onFamilyChange: (value: string) => void;
  onParameterChange: (value: string) => void;
  onSupportChange: (value: string) => void;
  onDisplayModeChange: (value: DecisionDisplayMode) => void;
  onDateStartChange: (value: string) => void;
  onDateEndChange: (value: string) => void;
  onLimitChange: (value: number) => void;
  disabled?: boolean;
}

export default function SupportFilter({
  familyOptions,
  selectedFamilyId,
  selectedParameterCode,
  selectedSupportType,
  selectedDisplayMode,
  dateStart,
  dateEnd,
  limit,
  onFamilyChange,
  onParameterChange,
  onSupportChange,
  onDisplayModeChange,
  onDateStartChange,
  onDateEndChange,
  onLimitChange,
  disabled = false,
}: SupportFilterProps) {
  const selectedFamily = familyOptions.find((item) => item.id === selectedFamilyId) ?? null;

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Filtres métier</div>
        <p className="mt-1 text-sm text-slate-600">
          Chargement sur action utilisateur uniquement, limite par défaut 100, géométrie seulement en mode carte.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm text-slate-700">
          <span>Famille</span>
          <select
            value={selectedFamilyId}
            onChange={(event) => onFamilyChange(event.target.value)}
            disabled={disabled}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none"
          >
            <option value="">Choisir une famille</option>
            {familyOptions.map((family) => (
              <option key={family.id} value={family.id}>
                {family.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          <span>Paramètre</span>
          <select
            value={selectedParameterCode}
            onChange={(event) => onParameterChange(event.target.value)}
            disabled={disabled || !selectedFamily}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none"
          >
            <option value="">Choisir un paramètre</option>
            {(selectedFamily?.parameters ?? []).map((parameter) => (
              <option key={parameter.code} value={parameter.code}>
                {parameter.code} - {parameter.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          <span>Support spatial</span>
          <select
            value={selectedSupportType}
            onChange={(event) => onSupportChange(event.target.value)}
            disabled={disabled}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none"
          >
            {supportOptions.map((support) => (
              <option key={support.value || "all"} value={support.value}>
                {support.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          <span>Limite</span>
          <select
            value={String(limit)}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            disabled={disabled}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none"
          >
            <option value="100">100 lignes</option>
            <option value="250">250 lignes</option>
            <option value="500">500 lignes</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          <span>Date début</span>
          <input
            type="date"
            value={dateStart}
            onChange={(event) => onDateStartChange(event.target.value)}
            disabled={disabled}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none"
          />
        </label>

        <label className="grid gap-1 text-sm text-slate-700">
          <span>Date fin</span>
          <input
            type="date"
            value={dateEnd}
            onChange={(event) => onDateEndChange(event.target.value)}
            disabled={disabled}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none"
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(["map", "table", "chart"] as DecisionDisplayMode[]).map((mode) => {
          const active = mode === selectedDisplayMode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => onDisplayModeChange(mode)}
              disabled={disabled}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              {mode === "map" ? "Carte" : mode === "table" ? "Tableau" : "Graphique"}
            </button>
          );
        })}
      </div>
    </section>
  );
}
