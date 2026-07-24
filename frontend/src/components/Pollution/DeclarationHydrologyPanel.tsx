import { Droplets, RadioTower, ShieldQuestion } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { PollutionDeclarationDraft } from "./declarationDraft.types";
import type { DeclarationDraftErrors } from "./declarationDraft.validation";

interface DeclarationHydrologyPanelProps {
  draft: PollutionDeclarationDraft;
  errors: DeclarationDraftErrors;
  onChange: (draft: PollutionDeclarationDraft) => void;
}

const HYDROLOGY_FIELDS = [
  {
    key: "qsebouM3s",
    label: "Sebou",
    inputLabel: "Debit du Sebou",
    placeholder: "15",
    errorId: "declaration-qsebou-error",
  },
  {
    key: "qinnaouenM3s",
    label: "Innaouen",
    inputLabel: "Debit de l'Innaouen",
    placeholder: "6",
    errorId: "declaration-qinnaouen-error",
  },
  {
    key: "qouerghaM3s",
    label: "Ouergha",
    inputLabel: "Debit de l'Ouergha",
    placeholder: "9",
    errorId: "declaration-qouergha-error",
  },
] as const;

type HydrologyField = (typeof HYDROLOGY_FIELDS)[number]["key"];

function updateHydrologyValue(
  draft: PollutionDeclarationDraft,
  onChange: (draft: PollutionDeclarationDraft) => void,
  field: HydrologyField,
  value: string
) {
  onChange({ ...draft, [field]: value });
}

export default function DeclarationHydrologyPanel({
  draft,
  errors,
  onChange,
}: DeclarationHydrologyPanelProps) {
  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
          <Droplets className="h-4 w-4 text-blue-700" />
          Conditions hydrologiques
        </div>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Les debits du scenario sont saisis manuellement dans le MVP.
        </p>
      </div>

      <div className="grid gap-3">
        {HYDROLOGY_FIELDS.map((field) => (
          <div key={field.key} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="font-semibold text-slate-950">{field.label}</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-slate-300 text-slate-700">
                  Source : Manuelle
                </Badge>
                <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800">
                  A confirmer
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`declaration-${field.key}`}>{field.inputLabel}</Label>
              <div className="flex overflow-hidden rounded-md border border-slate-300 bg-white">
                <Input
                  id={`declaration-${field.key}`}
                  inputMode="decimal"
                  value={draft[field.key]}
                  onChange={(event) => updateHydrologyValue(draft, onChange, field.key, event.target.value)}
                  aria-invalid={Boolean(errors[field.key])}
                  aria-describedby={errors[field.key] ? field.errorId : undefined}
                  className="border-0 focus-visible:ring-0"
                  placeholder={field.placeholder}
                />
                <span className="flex items-center border-l border-slate-200 px-3 text-xs font-medium text-slate-500">
                  m3/s
                </span>
              </div>
              {errors[field.key] && (
                <p id={field.errorId} className="text-xs text-red-700">
                  {errors[field.key]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm leading-6 text-blue-950">
        Dans le MVP, les debits sont saisis manuellement. Lorsque les donnees Sentinelle seront
        disponibles, une mesure de plus de 12 heures devra etre confirmee ou remplacee.
      </div>

      <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        <div className="flex items-center gap-2 font-medium text-slate-900">
          <RadioTower className="h-4 w-4 text-slate-500" />
          Source des debits
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-slate-900 text-white hover:bg-slate-900">Manuel</Badge>
          <Badge variant="outline" className="border-slate-300 text-slate-400">
            Sentinelle - prochainement
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldQuestion className="h-3.5 w-3.5" />
          Aucune connexion temps reel n'est activee dans ce sous-lot.
        </div>
      </div>
    </div>
  );
}
