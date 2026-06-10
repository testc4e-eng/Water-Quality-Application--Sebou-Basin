import * as Tooltip from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";
import type { ReactNode } from "react";

interface KpiTooltipProps {
  title: string;
  definition: string;
  calculation: string;
  interpretation?: string;
  source?: string;
  thresholds?: string;
  children?: ReactNode;
}

export function KpiTooltip({ title, definition, calculation, interpretation, source, thresholds, children }: KpiTooltipProps) {
  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children ?? (
            <button
              type="button"
              className="inline-flex h-4 w-4 items-center justify-center rounded-full text-slate-400 transition-colors hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              aria-label={`Informations sur ${title}`}
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          )}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            align="center"
            sideOffset={8}
            className="z-[120] max-w-[340px] rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-[0_18px_48px_rgba(15,23,42,0.18)]"
          >
            <div className="text-sm font-semibold text-slate-950">{title}</div>
            <div className="mt-1 text-[11px] leading-5 text-slate-600">
              <span className="font-semibold text-slate-800">Définition :</span> {definition}
            </div>
            <div className="mt-1.5 text-[11px] leading-5 text-slate-600">
              <span className="font-semibold text-slate-800">Calcul :</span> {calculation}
            </div>
            {source ? (
              <div className="mt-1.5 text-[11px] leading-5 text-slate-600">
                <span className="font-semibold text-slate-800">Source :</span> {source}
              </div>
            ) : null}
            {interpretation ? (
              <div className="mt-1.5 text-[11px] leading-5 text-slate-600">
                <span className="font-semibold text-slate-800">Interprétation :</span> {interpretation}
              </div>
            ) : null}
            {thresholds ? (
              <div className="mt-1.5 text-[11px] leading-5 text-slate-600">
                <span className="font-semibold text-slate-800">Seuils :</span> {thresholds}
              </div>
            ) : null}
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
