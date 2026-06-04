import { CalendarDays, Droplets, Gauge, ShieldCheck, Waves, type LucideIcon } from "lucide-react";

import type { DashboardHomeHero, DashboardHomeHeroCard } from "@/api/dashboardHome";
import { DataFreshnessBadge } from "@/components/home-v2/DataFreshnessBadge";
import { Card, CardContent } from "@/components/ui/card";

interface HeroSectionProps {
  hero: DashboardHomeHero;
}

const STATUS_CLASS: Record<string, string> = {
  OK: "text-emerald-700 bg-emerald-50 border-emerald-200",
  SURVEILLANCE: "text-amber-700 bg-amber-50 border-amber-200",
  CRITIQUE: "text-rose-700 bg-rose-50 border-rose-200",
  UNKNOWN: "text-slate-700 bg-slate-100 border-slate-200",
};

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

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 xl:grid-cols-[minmax(300px,0.95fr)_minmax(0,2fr)]">
        <div className="space-y-3 rounded-[24px] bg-[linear-gradient(135deg,#071E41_0%,#0B4FD8_90%)] p-5 text-white shadow-[0_24px_60px_rgba(7,30,65,0.22)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80">
            <Waves className="h-3.5 w-3.5" />
            {hero.summary_label}
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white xl:text-[2rem]">{hero.title}</h2>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-100">{hero.subtitle}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90">
            <CalendarDays className="h-4 w-4" />
            {formatOperationalDate(hero.operational_date)}
          </div>
          <p className="line-clamp-2 text-sm leading-6 text-slate-200">
            Surveillance hydrologique, qualité des eaux et aide à la décision en temps quasi réel.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {hero.cards.map((card) => {
            const Icon = ICONS[card.icon] ?? ShieldCheck;
            return (
              <Card key={card.id} className={`overflow-hidden rounded-[24px] border-slate-200 bg-gradient-to-br ${cardGradient(card)} shadow-sm`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0B4FD8] text-white shadow-md">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_CLASS[card.status] ?? STATUS_CLASS.UNKNOWN}`}>
                      {card.status}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-medium text-slate-600">{card.label}</div>
                    <div className="mt-2 flex items-end gap-2">
                      <div className="text-3xl font-semibold tracking-tight text-slate-950 xl:text-[2rem]">{card.value}</div>
                      <div className="pb-1 text-sm font-medium text-slate-500">{card.unit}</div>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{card.description}</p>
                  </div>
                  <div className="mt-3">
                    <DataFreshnessBadge freshness={card.freshness} compact />
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
