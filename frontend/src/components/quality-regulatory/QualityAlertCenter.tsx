import { useDecisionAlerts } from "@/hooks/useDecisionIntelligence";

export function QualityAlertCenter() {
  const alertsQuery = useDecisionAlerts({ type: "QUALITY", limit: 5 });
  const alerts = alertsQuery.data ?? [];

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {alerts.length > 0 ? (
        alerts.map((alert) => (
          <div key={`${alert.code}-${alert.title}`} className="rounded-md border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{alert.severity}</div>
            <div className="mt-3 text-base font-semibold text-slate-950">{alert.title}</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{alert.description}</p>
          </div>
        ))
      ) : (
        <div className="rounded-md border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500 xl:col-span-5">
          Aucune alerte qualité active exposée par l'Alert Engine.
        </div>
      )}
    </section>
  );
}
