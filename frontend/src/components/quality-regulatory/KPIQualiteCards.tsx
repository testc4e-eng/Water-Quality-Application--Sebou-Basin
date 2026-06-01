import { Activity, AlertTriangle, Database, FlaskConical, RadioTower, RefreshCw } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface KPIQualiteCardsProps {
  stationsCount: number;
  measuresCount: number;
  classifiableCount: number;
  nonClassifiableCount: number;
  lastUpdate?: string;
}

export function KPIQualiteCards(props: KPIQualiteCardsProps) {
  const cards = [
    { label: "Stations surveillées", value: props.stationsCount, icon: RadioTower, note: "Rivières exposées par l'API qualité" },
    { label: "Mesures qualité", value: props.measuresCount, icon: Database, note: "Volume disponible filtré QA" },
    { label: "Paramètres classifiables", value: props.classifiableCount, icon: FlaskConical, note: "Utilisés pour la qualité globale" },
    { label: "Non classifiables", value: props.nonClassifiableCount, icon: Activity, note: "Visibles, jamais scorés" },
    { label: "Alertes", value: "N/D", icon: AlertTriangle, note: "Agrégat métier à brancher en P1" },
    { label: "Dernière mesure", value: props.lastUpdate ?? "N/D", icon: RefreshCw, note: "Date maximale exposée" },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      {cards.map(({ label, value, icon: Icon, note }) => (
        <Card key={label} className="rounded-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-slate-500">{label}</p>
              <Icon className="h-4 w-4 text-blue-700" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-950">{typeof value === "number" ? value.toLocaleString("fr-MA") : value}</p>
            <p className="mt-2 text-xs leading-4 text-slate-500">{note}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
