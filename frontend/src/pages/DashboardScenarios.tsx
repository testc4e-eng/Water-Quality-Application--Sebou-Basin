import { FlaskConical } from "lucide-react";

export default function DashboardScenarios() {
  return (
    <div className="min-h-[calc(100vh-140px)] bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef6ff_45%,#ecfdf5_100%)] px-5 py-6 lg:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-188px)] max-w-5xl items-center justify-center">
        <section className="w-full overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-[0_30px_90px_-36px_rgba(15,23,42,0.35)] backdrop-blur-xl">
          <div className="bg-[linear-gradient(135deg,#0f766e_0%,#0f172a_52%,#1d4ed8_100%)] px-8 py-10 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/15 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                <FlaskConical className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/70">
                  Dashboard Scenarios
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Module en attente</h1>
              </div>
            </div>
          </div>

          <div className="px-8 py-14 text-center">
            <div className="mx-auto max-w-2xl space-y-4">
              <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
                Cette partie est en developpement
              </div>
              <p className="text-base leading-7 text-slate-600">
                Le dashboard des scenarios sera bientot disponible avec les donnees et les analyses associees.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
