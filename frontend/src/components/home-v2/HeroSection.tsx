import { CalendarDays, Droplets, Gauge, ShieldCheck, Waves, type LucideIcon } from "lucide-react";

import type { DashboardHomeHero, DashboardHomeHeroCard } from "@/api/dashboardHome";
import { DataFreshnessBadge } from "@/components/home-v2/DataFreshnessBadge";
import { KpiTooltip } from "@/components/home-v2/KpiTooltip";
import { Card, CardContent } from "@/components/ui/card";
import { OPERATIONAL_INDICATOR_DEFINITIONS, type OperationalIndicatorKey } from "@/lib/kpi-definitions";

interface HeroSectionProps {
  hero: DashboardHomeHero;
  variant?: "default" | "ultra-compact";
}

const ICONS: Record<string, LucideIcon> = {
  dam: Gauge,
  rain: Droplets,
  river: Waves,
  quality: ShieldCheck,
};

function cardGradient(card: DashboardHomeHeroCard) {
  if (card.color_hint === "blue") return "from-sky-50 via-white to-blue-50";
  if (card.color_hint === "green") return "from-emerald-50 via-white to-lime-50";
  if (card.color_hint === "orange") return "from-orange-50 via-white to-amber-50";
  return "from-slate-50 via-white to-slate-100";
}

function formatOperationalDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("fr-MA", { dateStyle: "long" }).format(date);
}

export function HeroSection({ hero, variant = "default" }: HeroSectionProps) {
  if (variant === "ultra-compact") {
    return <UltraCompactHero hero={hero} />;
  }
  return <UltraCompactHero hero={hero} />;
}

function UltraCompactHero({ hero }: HeroSectionProps) {
  return (
    <section className="rounded-[22px] border border-slate-200 bg-white p-2 shadow-sm">
      <div className="grid gap-2 xl:grid-cols-[minmax(150px,0.34fr)_minmax(0,1.66fr)]">
        <div className="rounded-[16px] bg-[linear-gradient(135deg,#071E41_0%,#0B4FD8_90%)] p-2 text-white shadow-[0_10px_20px_rgba(7,30,65,0.16)]">
          <div className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.12em] text-white/80">
            <Waves className="h-3 w-3" />
            Bassin
          </div>
          <h2 className="mt-1 text-[0.95rem] font-semibold tracking-tight text-white xl:text-[1rem]">{hero.title}</h2>
          <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] text-white/90">
            <CalendarDays className="h-3 w-3" />
            {formatOperationalDate(hero.operational_date)}
          </div>
        </div>

        <div className="grid gap-1.5 md:grid-cols-2 xl:grid-cols-4">
          {hero.cards.map((card) => {
            const Icon = ICONS[card.icon] ?? ShieldCheck;
            const info = OPERATIONAL_INDICATOR_DEFINITIONS[card.id as OperationalIndicatorKey];
            return (
              <Card key={card.id} className={`overflow-hidden rounded-[16px] border-slate-200 bg-gradient-to-br ${cardGradient(card)} shadow-sm`}>
                <CardContent className="flex h-full items-center gap-2 p-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-xl bg-[#0B4FD8] text-white shadow-md">
                      <Icon className="h-3 w-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <div className="truncate text-[10px] font-medium text-slate-600">{card.label}</div>
                      {info ? (
                        <KpiTooltip
                          title={info.title}
                          definition={info.definition}
                          calculation={info.calculation}
                        />
                      ) : null}
                    </div>
                    <div className="mt-0.5 flex items-end gap-1">
                      <div className="text-[1rem] font-semibold tracking-tight text-slate-950 xl:text-[1.1rem]">{card.value}</div>
                      <div className="pb-0.5 text-[9px] font-medium text-slate-500">{card.unit}</div>
                    </div>
                    <div className="mt-1">
                      <DataFreshnessBadge freshness={card.freshness} compact />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}
