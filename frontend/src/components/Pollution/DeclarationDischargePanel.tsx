import { Clock3, FlaskConical, LockKeyhole, MessageSquareText } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { PollutionDeclarationDraft } from "./declarationDraft.types";
import type { DeclarationDraftErrors } from "./declarationDraft.validation";

interface DeclarationDischargePanelProps {
  draft: PollutionDeclarationDraft;
  errors: DeclarationDraftErrors;
  onChange: (draft: PollutionDeclarationDraft) => void;
}

function updateDraft(
  draft: PollutionDeclarationDraft,
  onChange: (draft: PollutionDeclarationDraft) => void,
  patch: Partial<PollutionDeclarationDraft>
) {
  onChange({ ...draft, ...patch });
}

export default function DeclarationDischargePanel({
  draft,
  errors,
  onChange,
}: DeclarationDischargePanelProps) {
  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
          <FlaskConical className="h-4 w-4 text-blue-700" />
          Caracteriser le rejet
        </div>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Renseignez les donnees observees. Le frontend ne calcule aucune concentration.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="declaration-detected-at" className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-slate-500" />
          Date et heure de detection
        </Label>
        <Input
          id="declaration-detected-at"
          type="datetime-local"
          value={draft.detectedAt}
          onChange={(event) => updateDraft(draft, onChange, { detectedAt: event.target.value })}
          aria-invalid={Boolean(errors.detectedAt)}
          aria-describedby={errors.detectedAt ? "declaration-detected-at-error" : "declaration-detected-at-help"}
        />
        <p id="declaration-detected-at-help" className="text-xs text-slate-500">
          Cette heure sert de reference pour estimer l'arrivee aux stations de controle.
        </p>
        {errors.detectedAt && (
          <p id="declaration-detected-at-error" className="text-xs text-red-700">
            {errors.detectedAt}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="declaration-pollutant">Polluant</Label>
        <select
          id="declaration-pollutant"
          className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
          value={draft.pollutant}
          onChange={() => updateDraft(draft, onChange, { pollutant: "NH4" })}
          aria-describedby="declaration-pollutant-help"
        >
          <option value="NH4">NH4 - Ammonium</option>
        </select>
        <div id="declaration-pollutant-help" className="flex items-center gap-2 text-xs text-slate-500">
          <LockKeyhole className="h-3.5 w-3.5" />
          Seul NH4 est disponible dans cette version MVP. NO3, MES et DBO5 seront ajoutes plus tard.
        </div>
        {errors.pollutant && <p className="text-xs text-red-700">{errors.pollutant}</p>}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="declaration-crejet">Concentration du rejet</Label>
          <div className="flex overflow-hidden rounded-md border border-slate-300 bg-white">
            <Input
              id="declaration-crejet"
              inputMode="decimal"
              value={draft.crejetMgL}
              onChange={(event) => updateDraft(draft, onChange, { crejetMgL: event.target.value })}
              aria-invalid={Boolean(errors.crejetMgL)}
              aria-describedby={errors.crejetMgL ? "declaration-crejet-error" : undefined}
              className="border-0 focus-visible:ring-0"
              placeholder="100"
            />
            <span className="flex items-center border-l border-slate-200 px-3 text-xs font-medium text-slate-500">
              mg/L
            </span>
          </div>
          {errors.crejetMgL && (
            <p id="declaration-crejet-error" className="text-xs text-red-700">
              {errors.crejetMgL}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="declaration-qrejet">Debit du rejet</Label>
          <div className="flex overflow-hidden rounded-md border border-slate-300 bg-white">
            <Input
              id="declaration-qrejet"
              inputMode="decimal"
              value={draft.qrejetM3s}
              onChange={(event) => updateDraft(draft, onChange, { qrejetM3s: event.target.value })}
              aria-invalid={Boolean(errors.qrejetM3s)}
              aria-describedby={errors.qrejetM3s ? "declaration-qrejet-error" : undefined}
              className="border-0 focus-visible:ring-0"
              placeholder="0.055555556"
            />
            <span className="flex items-center border-l border-slate-200 px-3 text-xs font-medium text-slate-500">
              m3/s
            </span>
          </div>
          {errors.qrejetM3s && (
            <p id="declaration-qrejet-error" className="text-xs text-red-700">
              {errors.qrejetM3s}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="declaration-comment" className="flex items-center gap-2">
          <MessageSquareText className="h-4 w-4 text-slate-500" />
          Commentaire terrain
        </Label>
        <Textarea
          id="declaration-comment"
          value={draft.comment}
          onChange={(event) => updateDraft(draft, onChange, { comment: event.target.value })}
          placeholder="Circonstances de detection, observation terrain, source probable..."
          rows={3}
        />
      </div>
    </div>
  );
}
