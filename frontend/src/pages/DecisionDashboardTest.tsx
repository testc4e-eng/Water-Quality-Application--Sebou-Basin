import { useEffect, useMemo, useState } from "react";

import CampaignSelector from "@/components/decision/CampaignSelector";
import DecisionDataPanel from "@/components/decision/DecisionDataPanel";
import DecisionKpiPanel from "@/components/decision/DecisionKpiPanel";
import DecisionLegend from "@/components/decision/DecisionLegend";
import DecisionMapPanel from "@/components/decision/DecisionMapPanel";
import DecisionModeSelector from "@/components/decision/DecisionModeSelector";
import FreshnessFilter from "@/components/decision/FreshnessFilter";
import SupportFilter from "@/components/decision/SupportFilter";
import { Button } from "@/components/ui/button";
import {
  campaignDefinitions,
  decisionFamilies,
  findCampaignDefinition,
  findDecisionFamily,
  getPeriodForFreshness,
  type DecisionDisplayMode,
  type DecisionFreshnessClassId,
  type DecisionViewId,
} from "@/config/decisionDashboardCatalog";
import { useObservatoryData, type ObservatoryDataSelection } from "@/hooks/useObservatoryData";

function buildComingSoonMessage(viewId: DecisionViewId | null, campaignId: string): string | null {
  if (viewId !== "campaigns") return null;
  const campaign = findCampaignDefinition(campaignId);
  if (!campaign || campaign.status === "active") return null;
  return `${campaign.label} : données ${campaign.recommendedDisplay.toLowerCase()} à venir. Le tableau de démonstration conserve un état explicite sans lancer d'appel API.`;
}

export default function DecisionDashboardTest() {
  const [selectedView, setSelectedView] = useState<DecisionViewId | null>(null);
  const [freshness, setFreshness] = useState<DecisionFreshnessClassId>("recent");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState("");
  const [selectedParameterCode, setSelectedParameterCode] = useState("");
  const [selectedSupportType, setSelectedSupportType] = useState("");
  const [displayMode, setDisplayMode] = useState<DecisionDisplayMode>("map");
  const [limit, setLimit] = useState(100);
  const [dateStart, setDateStart] = useState(getPeriodForFreshness("recent").dateStart ?? "");
  const [dateEnd, setDateEnd] = useState(getPeriodForFreshness("recent").dateEnd ?? "");
  const [submittedSelection, setSubmittedSelection] = useState<ObservatoryDataSelection>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [comingSoonMessage, setComingSoonMessage] = useState<string | null>(null);

  useEffect(() => {
    const period = getPeriodForFreshness(freshness);
    setDateStart(period.dateStart ?? "");
    setDateEnd(period.dateEnd ?? "");
  }, [freshness]);

  const familyOptions = useMemo(() => {
    if (selectedView === "campaigns") {
      const activeCampaign = campaignDefinitions.find((item) => item.id === selectedCampaign);
      const allowedIds = new Set(activeCampaign?.availableFamilies ?? []);
      return decisionFamilies.filter((family) => allowedIds.has(family.id));
    }

    return decisionFamilies;
  }, [selectedCampaign, selectedView]);

  const activeFamily = findDecisionFamily(selectedFamilyId);
  const campaign = findCampaignDefinition(selectedCampaign);
  const query = useObservatoryData(submittedSelection);

  const activeRules = useMemo(() => {
    if (selectedView === "decision") {
      return ["Données récentes prioritaires", "Carte synthétique par défaut", "Analyse détaillée sur action"];
    }
    if (selectedView === "analysis") {
      return ["Période personnalisable", "Support spatial explicite", "Modes carte / tableau / graphique"];
    }
    if (selectedView === "campaigns") {
      return ["Campagnes séparées de la vue décisionnelle", "Historique et sources consultables", "Modules non prêts signalés"];
    }
    return [];
  }, [selectedView]);

  const handleViewChange = (view: DecisionViewId) => {
    setSelectedView(view);
    setHasSubmitted(false);
    setSubmittedSelection({});
    setComingSoonMessage(null);
    setSelectedSupportType("");
    setDisplayMode(view === "analysis" ? "table" : "map");

    if (view === "campaigns") {
      setSelectedCampaign("qualite-historique");
      setSelectedFamilyId("metaux");
      setSelectedParameterCode("Mo");
      setFreshness("historical");
    } else if (view === "decision") {
      setSelectedCampaign("");
      setSelectedFamilyId("metaux");
      setSelectedParameterCode("Mo");
      setFreshness("recent");
    } else {
      setSelectedCampaign("");
      setSelectedFamilyId("metaux");
      setSelectedParameterCode("Mo");
      setFreshness("midterm");
    }
  };

  const handleFamilyChange = (value: string) => {
    setSelectedFamilyId(value);
    const family = findDecisionFamily(value);
    setSelectedParameterCode(family?.defaultParameter ?? "");
    setHasSubmitted(false);
    setSubmittedSelection({});
    setComingSoonMessage(null);
  };

  const handleSubmit = () => {
    setHasSubmitted(true);

    const soon = buildComingSoonMessage(selectedView, selectedCampaign);
    if (soon) {
      setComingSoonMessage(soon);
      setSubmittedSelection({});
      return;
    }

    if (!selectedView || !activeFamily || !selectedParameterCode) {
      setComingSoonMessage("Sélection incomplète. Choisissez une vision, une famille et un paramètre.");
      setSubmittedSelection({});
      return;
    }

    setComingSoonMessage(null);
    setSubmittedSelection({
      domainId: "qualite",
      familyId: activeFamily.id,
      parameterCode: selectedParameterCode,
      dateStart,
      dateEnd,
      supportType: selectedSupportType || undefined,
      limit,
      includeGeom: displayMode === "map",
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fef3c7,transparent_24%),radial-gradient(circle_at_top_right,#dbeafe,transparent_22%),linear-gradient(180deg,#fffdf8_0%,#f8fafc_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-[30px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            SAD Sebou / WQDSS
          </div>
          <h1 className="mt-2 font-serif text-4xl text-slate-950">Dashboard décisionnel ABH - test métier</h1>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
            Prototype de validation métier pour la logique cartographique, la hiérarchie des données, la gestion des
            périodes, la séparation récent / historique / campagnes et les règles de performance sans impact sur le
            dashboard legacy.
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-6">
            <DecisionModeSelector value={selectedView} onChange={handleViewChange} />
            <FreshnessFilter value={freshness} onChange={setFreshness} />
            <CampaignSelector
              value={selectedCampaign}
              onChange={(value) => {
                setSelectedCampaign(value);
                setHasSubmitted(false);
                setSubmittedSelection({});
                setComingSoonMessage(null);
              }}
              visible={selectedView === "campaigns"}
            />
            <SupportFilter
              familyOptions={familyOptions}
              selectedFamilyId={selectedFamilyId}
              selectedParameterCode={selectedParameterCode}
              selectedSupportType={selectedSupportType}
              selectedDisplayMode={displayMode}
              dateStart={dateStart}
              dateEnd={dateEnd}
              limit={limit}
              onFamilyChange={handleFamilyChange}
              onParameterChange={(value) => {
                setSelectedParameterCode(value);
                setHasSubmitted(false);
                setSubmittedSelection({});
              }}
              onSupportChange={(value) => {
                setSelectedSupportType(value);
                setHasSubmitted(false);
                setSubmittedSelection({});
              }}
              onDisplayModeChange={(value) => {
                setDisplayMode(value);
                setHasSubmitted(false);
                setSubmittedSelection({});
              }}
              onDateStartChange={(value) => {
                setDateStart(value);
                setHasSubmitted(false);
                setSubmittedSelection({});
              }}
              onDateEndChange={(value) => {
                setDateEnd(value);
                setHasSubmitted(false);
                setSubmittedSelection({});
              }}
              onLimitChange={(value) => {
                setLimit(value);
                setHasSubmitted(false);
                setSubmittedSelection({});
              }}
              disabled={!selectedView}
            />
            <Button
              type="button"
              className="w-full rounded-2xl bg-slate-950 py-6 text-base text-white hover:bg-slate-800"
              onClick={handleSubmit}
              disabled={!selectedView}
            >
              Afficher
            </Button>
          </div>

          <div className="space-y-6">
            <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  {selectedView ? selectedView : "vision non choisie"}
                </span>
                {activeFamily && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    {activeFamily.label}
                  </span>
                )}
                {campaign && selectedView === "campaigns" && (
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
                    {campaign.label}
                  </span>
                )}
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {activeRules.map((rule) => (
                  <div key={rule} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                    {rule}
                  </div>
                ))}
              </div>
            </section>

            <DecisionMapPanel rows={query.data?.data ?? []} loading={query.isFetching} submitted={hasSubmitted} />
            <DecisionLegend />
            <DecisionKpiPanel
              response={query.data}
              title={selectedView ? `Synthèse ${selectedView}` : "Synthèse en attente"}
            />
            <DecisionDataPanel
              response={query.data}
              loading={query.isFetching}
              error={query.error}
              displayMode={displayMode}
              submitted={hasSubmitted}
              comingSoonMessage={comingSoonMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
