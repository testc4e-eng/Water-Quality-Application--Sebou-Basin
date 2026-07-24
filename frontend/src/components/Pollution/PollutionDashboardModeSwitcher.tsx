import { Binoculars, FilePlus2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export type PollutionDashboardMode = "normal" | "declaration";

interface PollutionDashboardModeSwitcherProps {
  value: PollutionDashboardMode;
  onChange: (mode: PollutionDashboardMode) => void;
  disabled?: boolean;
}

const MODES: Array<{
  value: PollutionDashboardMode;
  label: string;
  description: string;
  icon: typeof Binoculars;
}> = [
  {
    value: "normal",
    label: "Surveillance",
    description: "Vue d'ensemble du bassin",
    icon: Binoculars,
  },
  {
    value: "declaration",
    label: "Déclaration d'incident",
    description: "Assistant de déclaration",
    icon: FilePlus2,
  },
];

export default function PollutionDashboardModeSwitcher({
  value,
  onChange,
  disabled = false,
}: PollutionDashboardModeSwitcherProps) {
  return (
    <div
      className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-sm"
      role="radiogroup"
      aria-label="Choisir la vue du cockpit pollution"
    >
      {MODES.map((mode) => {
        const Icon = mode.icon;
        const isActive = value === mode.value;

        return (
          <Button
            key={mode.value}
            type="button"
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            disabled={disabled}
            role="radio"
            aria-checked={isActive}
            aria-label={`${mode.label} - ${mode.description}`}
            className={[
              "h-9 gap-2 rounded-lg px-3 text-xs font-semibold transition-colors",
              isActive
                ? "bg-slate-950 text-white shadow-sm hover:bg-slate-900"
                : "text-slate-700 hover:bg-white hover:text-slate-950",
            ].join(" ")}
            onClick={() => onChange(mode.value)}
          >
            <Icon className="h-4 w-4" />
            <span>{mode.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
