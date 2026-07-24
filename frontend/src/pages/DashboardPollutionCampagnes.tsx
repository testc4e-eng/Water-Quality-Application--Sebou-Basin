import { useMemo, useState } from "react";
import { AlertTriangle, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import PageHeader from "@/components/Layout/PageHeader";
import CampagneSidebar, { type CampagneFilters } from "@/components/Pollution/CampagneSidebar";
import CampagnePrelevementMap from "@/components/Pollution/CampagnePrelevementMap";
import CampagneList from "@/components/Pollution/CampagneList";
import PollutionAlertPanel from "@/components/Pollution/PollutionAlertPanel";
import PrelevementDetail from "@/components/Pollution/PrelevementDetail";
import { usePollutionAlerts, usePrelevements } from "@/hooks/usePollutionCampagnes";

export default function DashboardPollutionCampagnes() {
  const [filters, setFilters] = useState<CampagneFilters>({
    campagne: "",
    date_from: "",
    date_to: "",
    site: "",
    parametre: "",
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const prelevementsQuery = usePrelevements(filters);
  const alertsQuery = usePollutionAlerts({
    campagne: filters.campagne || undefined,
    parametre: filters.parametre || undefined,
  });

  const prelevements = prelevementsQuery.data ?? [];
  const alerts = alertsQuery.data ?? [];

  const activeFiltersCount = useMemo(
    () => Object.values(filters).filter((v) => v !== "").length,
    [filters]
  );

  const exportCSV = () => {
    const rows = prelevements.map((p) => ({
      id: p.id_prelevement,
      date: p.date_prelevement,
      point: p.point_prelevement,
      campagne: p.campagne_id,
      longitude: p.longitude,
      latitude: p.latitude,
      mesures: p.nb_mesures,
      alertes: p.nb_alertes,
    }));
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]).join(";") + "\n";
    const csv = headers + rows.map((r) => Object.values(r).join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campagnes_pollution_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-[calc(100vh-52px)] min-h-0 flex-col overflow-hidden bg-slate-50">
      <PageHeader
        title="Pollution — Campagnes"
        subtitle="Visualisation des 141 prélèvements de campagne et alertes sur métaux lourds (seuils provisoires)."
        action={
          <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
        <div className="mx-auto flex max-w-[1600px] items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-700" />
          <span className="font-medium">Données provisoires</span>
          <span className="text-amber-700/80">
            — Seuils métaux lourds (Cd, Pb, Hg, Cr) à valider par le service qualité ABH Sebou. Valeurs &lt; LQ
            affichées telles quelles.
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <CampagneSidebar filters={filters} onChange={setFilters} />

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="relative min-h-0 flex-1 p-3">
              <CampagnePrelevementMap
                prelevements={prelevements}
                selectedId={selectedId}
                onSelect={setSelectedId}
                loading={prelevementsQuery.isLoading}
              />
            </div>

            <aside className="flex min-h-0 w-[360px] flex-col border-l border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">Prélèvements</h2>
                  {activeFiltersCount > 0 && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                      {activeFiltersCount} filtre{activeFiltersCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  {prelevementsQuery.isLoading
                    ? "Chargement..."
                    : `${prelevements.length} résultat${prelevements.length > 1 ? "s" : ""}`}
                </p>
              </div>

              <div className="border-b border-slate-200 p-3">
                <PollutionAlertPanel
                  alerts={alerts}
                  loading={alertsQuery.isLoading}
                  onSelect={setSelectedId}
                />
              </div>

              <div className="flex-1 overflow-y-auto">
                <CampagneList
                  prelevements={prelevements}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  loading={prelevementsQuery.isLoading}
                />
              </div>
            </aside>
          </div>
        </div>
      </div>

      {selectedId && <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setSelectedId(null)} />}
      <PrelevementDetail prelevementId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
