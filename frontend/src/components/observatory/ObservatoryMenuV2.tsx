import { useState } from "react";

import ObservatoryDataPanel from "@/components/observatory/ObservatoryDataPanel";
import ObservatoryStatusBar from "@/components/observatory/ObservatoryStatusBar";
import { Button } from "@/components/ui/button";
import { observatoryCatalog, type ObservatoryDisplayMode } from "@/config/observatoryCatalog";
import { useObservatoryData, type ObservatoryDataSelection } from "@/hooks/useObservatoryData";

const today = new Date().toISOString().slice(0, 10);
const defaultDateStart = "2020-01-01";

export default function ObservatoryMenuV2() {
  const [selectedDomain, setSelectedDomain] = useState("qualite");
  const [selectedFamily, setSelectedFamily] = useState("");
  const [selectedParameter, setSelectedParameter] = useState("");
  const [dateStart, setDateStart] = useState(defaultDateStart);
  const [dateEnd, setDateEnd] = useState(today);
  const [supportType, setSupportType] = useState("");
  const [displayMode, setDisplayMode] = useState<ObservatoryDisplayMode>("table");
  const [limit, setLimit] = useState(100);
  const [submittedSelection, setSubmittedSelection] = useState<ObservatoryDataSelection>({});

  const domain = observatoryCatalog.find((item) => item.id === selectedDomain) ?? observatoryCatalog[0];
  const family = domain.families.find((item) => item.id === selectedFamily) ?? null;
  const query = useObservatoryData(submittedSelection);

  const parameterOptions = family?.parameters ?? [];
  const endpointLabel = family?.endpoint ?? "Module à venir";
  const canDisplay = Boolean(family?.status === "active" && selectedParameter);

  const submit = () => {
    if (!canDisplay) return;
    setSubmittedSelection({
      domainId: selectedDomain,
      familyId: selectedFamily,
      parameterCode: selectedParameter,
      dateStart,
      dateEnd,
      supportType: supportType || undefined,
      limit,
      includeGeom: displayMode === "map",
    });
  };

  const loadMore = () => {
    setLimit((current) => current + 100);
    setSubmittedSelection((current) => ({
      ...current,
      limit: (current.limit ?? limit) + 100,
    }));
  };

  return (
    <div className="w-full overflow-hidden rounded-[18px] border border-emerald-200/20 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.14),transparent_28%),linear-gradient(180deg,#0f172a_0%,#134e4a_100%)] text-emerald-50 shadow-[0_18px_55px_-22px_rgba(8,15,30,0.9)] backdrop-blur-xl">
      <div className="border-b border-emerald-100/10 px-3 py-2">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-100/90">
          Observatoire V2
        </div>
        <div className="mt-1 text-[11px] text-emerald-100/75">
          Catalogue local, chargement différé, valeurs seulement après Afficher.
        </div>
      </div>

      <div className="space-y-3 p-3">
        <section>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-100/90">
            1. Domaine métier
          </div>
          <div className="grid grid-cols-1 gap-1">
            {observatoryCatalog.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`rounded-lg border px-2 py-1.5 text-left text-[11px] transition ${
                  selectedDomain === item.id
                    ? "border-emerald-300/50 bg-emerald-300/15 text-white"
                    : "border-emerald-200/15 bg-slate-950/20 text-emerald-100/80 hover:bg-slate-900/45"
                }`}
                onClick={() => {
                  setSelectedDomain(item.id);
                  setSelectedFamily("");
                  setSelectedParameter("");
                  setSubmittedSelection({});
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-100/90">
            2. Sous-domaine
          </div>
          <div className="grid grid-cols-1 gap-1">
            {domain.families.map((item) => {
              const active = selectedFamily === item.id;
              const disabled = item.status !== "active";
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`rounded-lg border px-2 py-1.5 text-left text-[11px] transition ${
                    active
                      ? "border-sky-300/50 bg-sky-300/15 text-white"
                      : "border-emerald-200/15 bg-slate-950/20 text-emerald-100/80 hover:bg-slate-900/45"
                  } ${disabled ? "opacity-60" : ""}`}
                  onClick={() => {
                    setSelectedFamily(item.id);
                    setSelectedParameter(item.status === "active" ? item.defaultParameter ?? "" : "");
                    setSubmittedSelection({});
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{item.label}</span>
                    <span className="text-[10px] text-emerald-100/60">
                      {disabled ? "à venir" : "P0"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-100/90">
            3. Paramètre
          </div>
          {family?.status === "active" ? (
            <select
              value={selectedParameter}
              onChange={(event) => {
                setSelectedParameter(event.target.value);
                setSubmittedSelection({});
              }}
              className="w-full rounded-md border border-emerald-100/15 bg-slate-900/70 px-2 py-1.5 text-[11px] text-emerald-50 outline-none"
            >
              <option value="">Choisir un paramètre...</option>
              {parameterOptions.map((parameter) => (
                <option key={parameter.code} value={parameter.code}>
                  {parameter.code} - {parameter.label}
                </option>
              ))}
            </select>
          ) : (
            <div className="rounded-lg border border-emerald-200/15 bg-slate-950/25 p-2 text-[11px] text-emerald-100/75">
              Module à venir. Aucun appel API n'est déclenché.
            </div>
          )}
        </section>

        <section>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-100/90">
            4. Filtres valeurs
          </div>
          <div className="grid grid-cols-2 gap-1">
            <input
              type="date"
              value={dateStart}
              onChange={(event) => setDateStart(event.target.value)}
              className="rounded-md border border-emerald-100/15 bg-slate-900/70 px-2 py-1.5 text-[11px] text-emerald-50 outline-none"
            />
            <input
              type="date"
              value={dateEnd}
              onChange={(event) => setDateEnd(event.target.value)}
              className="rounded-md border border-emerald-100/15 bg-slate-900/70 px-2 py-1.5 text-[11px] text-emerald-50 outline-none"
            />
            <select
              value={supportType}
              onChange={(event) => setSupportType(event.target.value)}
              className="rounded-md border border-emerald-100/15 bg-slate-900/70 px-2 py-1.5 text-[11px] text-emerald-50 outline-none"
            >
              <option value="">Tous supports</option>
              <option value="RIVIERE">Rivière</option>
              <option value="NAPPE">Nappe</option>
              <option value="BARRAGE">Barrage</option>
              <option value="SEBOU">Sebou</option>
            </select>
            <select
              value={String(limit)}
              onChange={(event) => setLimit(Number(event.target.value))}
              className="rounded-md border border-emerald-100/15 bg-slate-900/70 px-2 py-1.5 text-[11px] text-emerald-50 outline-none"
            >
              <option value="50">50 lignes</option>
              <option value="100">100 lignes</option>
              <option value="250">250 lignes</option>
              <option value="500">500 lignes</option>
            </select>
          </div>
          <div className="mt-1 flex gap-1">
            {(["table", "chart", "map"] as ObservatoryDisplayMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                className={`rounded border px-1.5 py-0.5 text-[10px] ${
                  displayMode === mode
                    ? "border-amber-300/50 bg-amber-300/15 text-white"
                    : "border-emerald-200/15 bg-slate-950/20 text-emerald-100/75"
                }`}
                onClick={() => setDisplayMode(mode)}
              >
                {mode}
              </button>
            ))}
          </div>
        </section>

        <Button
          type="button"
          size="sm"
          className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400"
          disabled={!canDisplay}
          onClick={submit}
        >
          Afficher
        </Button>

        <ObservatoryStatusBar
          loading={query.isFetching}
          error={query.error}
          count={query.data?.count}
          source={query.data?.metadata?.source_view ?? family?.view ?? endpointLabel}
          familyLabel={family?.label}
          parameterCode={submittedSelection.parameterCode}
        />

        <ObservatoryDataPanel
          response={query.data}
          loading={query.isFetching}
          error={query.error}
          onLoadMore={loadMore}
        />
      </div>
    </div>
  );
}
