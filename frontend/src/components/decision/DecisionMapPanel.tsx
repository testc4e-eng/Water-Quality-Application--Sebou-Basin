import type { QualiteExposureRecord } from "@/types/qualite";

function colorForSupport(supportType: string | null): string {
  switch (supportType) {
    case "RIVIERE":
      return "bg-sky-500";
    case "NAPPE":
      return "bg-indigo-500";
    case "BARRAGE":
      return "bg-cyan-700";
    case "SEBOU":
      return "bg-teal-700";
    default:
      return "bg-slate-500";
  }
}

function markerPosition(index: number) {
  const positions = [
    { left: "18%", top: "22%" },
    { left: "34%", top: "34%" },
    { left: "58%", top: "28%" },
    { left: "73%", top: "47%" },
    { left: "48%", top: "56%" },
    { left: "25%", top: "68%" },
    { left: "63%", top: "74%" },
    { left: "82%", top: "25%" },
  ];

  return positions[index % positions.length];
}

export default function DecisionMapPanel({
  rows,
  loading,
  submitted,
}: {
  rows: QualiteExposureRecord[];
  loading: boolean;
  submitted: boolean;
}) {
  const previewRows = rows.slice(0, 8);

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Carte synthétique</div>
        <div className="mt-1 text-sm text-slate-600">
          Vue cartographique test pour valider la hiérarchie métier, le support spatial et la fraîcheur.
        </div>
      </div>

      <div className="relative h-[380px] overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_28%),linear-gradient(180deg,#eff6ff_0%,#dbeafe_35%,#f8fafc_100%)]">
        <div className="absolute inset-y-10 left-[12%] w-[76%] rounded-[44%_56%_43%_57%/49%_38%_62%_51%] border-2 border-sky-700/15 bg-emerald-200/30" />
        <div className="absolute left-[10%] top-[18%] h-[2px] w-[75%] rotate-[18deg] rounded-full bg-sky-700/40" />
        <div className="absolute left-[26%] top-[43%] h-[2px] w-[42%] -rotate-[22deg] rounded-full bg-sky-600/35" />
        <div className="absolute left-[46%] top-[57%] h-[2px] w-[26%] rotate-[28deg] rounded-full bg-sky-500/30" />

        {!submitted && (
          <div className="absolute inset-x-6 bottom-6 rounded-[22px] border border-white/70 bg-white/90 p-4 shadow-lg backdrop-blur">
            <div className="text-sm font-medium text-slate-900">Carte de base chargée</div>
            <div className="mt-1 text-sm text-slate-600">
              Aucun appel API au chargement initial. Sélectionnez une vision, un paramètre ou une campagne puis cliquez
              sur Afficher.
            </div>
          </div>
        )}

        {submitted && !loading && previewRows.map((row, index) => {
          const position = markerPosition(index);
          return (
            <div
              key={`${row.source_row_id ?? index}-${row.code_parametre}`}
              className="absolute"
              style={{ left: position.left, top: position.top }}
            >
              <div className={`h-4 w-4 rounded-full border-2 border-white shadow-lg ${colorForSupport(row.support_type)}`} />
              <div className="mt-1 max-w-28 rounded-lg bg-white/90 px-2 py-1 text-[11px] text-slate-700 shadow">
                <div className="font-medium text-slate-900">{row.support_nom ?? row.support_type ?? "Support"}</div>
                <div>{row.code_parametre}</div>
              </div>
            </div>
          );
        })}

        {submitted && loading && (
          <div className="absolute inset-x-6 bottom-6 rounded-[22px] border border-white/70 bg-white/90 p-4 text-sm text-slate-700 shadow-lg">
            Chargement de la couche thématique demandée...
          </div>
        )}
      </div>
    </section>
  );
}
