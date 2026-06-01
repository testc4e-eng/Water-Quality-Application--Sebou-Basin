import {
  campaignDefinitions,
  type DecisionCampaignDefinition,
} from "@/config/decisionDashboardCatalog";

interface CampaignSelectorProps {
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
}

function CampaignCard({
  campaign,
  active,
  onClick,
}: {
  campaign: DecisionCampaignDefinition;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[20px] border p-3 text-left transition ${
        active ? "border-sky-500 bg-sky-50" : "border-slate-200 bg-slate-50 hover:bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-slate-900">{campaign.label}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            campaign.status === "active"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-200 text-slate-600"
          }`}
        >
          {campaign.status === "active" ? "actif" : "à venir"}
        </span>
      </div>
      <div className="mt-2 text-sm text-slate-600">{campaign.description}</div>
      <div className="mt-2 text-xs uppercase tracking-wide text-slate-500">
        Affichage recommandé : {campaign.recommendedDisplay}
      </div>
    </button>
  );
}

export default function CampaignSelector({ value, onChange, visible }: CampaignSelectorProps) {
  if (!visible) return null;

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Campagnes</div>
        <p className="mt-1 text-sm text-slate-600">
          Les campagnes restent séparées de la vue décisionnelle. Les flux non branchés sont signalés sans appel API.
        </p>
      </div>
      <div className="grid gap-2">
        {campaignDefinitions.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            active={value === campaign.id}
            onClick={() => onChange(campaign.id)}
          />
        ))}
      </div>
    </section>
  );
}
