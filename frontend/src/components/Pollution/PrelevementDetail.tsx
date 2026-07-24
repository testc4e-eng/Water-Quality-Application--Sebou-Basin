import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePrelevementMesures } from "@/hooks/usePollutionCampagnes";
import PrelevementEntityLink from "./PrelevementEntityLink";

interface PrelevementDetailProps {
  prelevementId: string | null;
  onClose: () => void;
}

export default function PrelevementDetail({ prelevementId, onClose }: PrelevementDetailProps) {
  const mesuresQuery = usePrelevementMesures(prelevementId);

  if (!prelevementId) return null;

  const prelevement = mesuresQuery.data?.prelevement;
  const mesures = mesuresQuery.data?.mesures ?? [];

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-full max-w-lg transform bg-white shadow-xl transition-transform duration-200 ease-in-out ${
        prelevementId ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {prelevement?.point_prelevement || "Fiche prélèvement"}
            </h2>
            {prelevement && (
              <p className="text-xs text-slate-500">
                {prelevement.campagne_id} — {new Date(prelevement.date_prelevement).toLocaleDateString("fr-MA")}
                {prelevement.commune && ` — ${prelevement.commune}`}
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fermer">
            <X className="h-5 w-5 text-slate-400" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {mesuresQuery.isLoading ? (
            <p className="text-sm text-slate-400">Chargement des mesures...</p>
          ) : mesuresQuery.isError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              Impossible de charger la fiche du prélèvement.
              <br />
              Vérifiez que le backend est accessible.
            </div>
          ) : !prelevement ? (
            <p className="text-sm text-slate-400">Aucune donnée disponible.</p>
          ) : (
            <>
              {prelevement && (
                <div className="mb-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium">Nature :</span> {prelevement.nature || "—"}
                    </div>
                    <div>
                      <span className="font-medium">Débit :</span> {prelevement.debit_raw || "—"}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Observation :</span> {prelevement.observation || "—"}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Coords :</span>{" "}
                      {prelevement.longitude?.toFixed(4)}, {prelevement.latitude?.toFixed(4)}
                    </div>
                  </div>
                </div>
              )}

              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                Mesures ({mesures.length})
              </h3>
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-slate-500">Paramètre</th>
                      <th className="px-3 py-2 text-right font-medium text-slate-500">Valeur</th>
                      <th className="px-3 py-2 text-left font-medium text-slate-500">Unité</th>
                      <th className="px-3 py-2 text-left font-medium text-slate-500">LQ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mesures.map((m) => (
                      <tr
                        key={m.parametre}
                        className={
                          m.alert_level === "CRITICAL"
                            ? "bg-red-50"
                            : m.alert_level === "WARNING"
                            ? "bg-amber-50"
                            : ""
                        }
                      >
                        <td className="px-3 py-2 text-slate-700">
                          <span className={m.is_prioritaire ? "font-semibold" : "font-medium"}>
                            {m.parametre}
                          </span>
                          {m.is_prioritaire && (
                            <Badge variant="secondary" className="ml-1.5 text-[9px]">
                              Prioritaire
                            </Badge>
                          )}
                          {m.alert_level && (
                            <Badge
                              variant={m.alert_level === "CRITICAL" ? "destructive" : "default"}
                              className="ml-1.5 text-[9px]"
                            >
                              {m.alert_level}
                            </Badge>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {m.valeur_raw?.startsWith("<") ? (
                            <span className="italic text-slate-400">{m.valeur_raw}</span>
                          ) : m.valeur != null ? (
                            m.valeur.toFixed(m.valeur < 0.01 ? 5 : 3)
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-3 py-2 text-slate-500">{m.unite || "—"}</td>
                        <td className="px-3 py-2 text-slate-500">
                          {m.lq != null ? `< ${m.lq}` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <h3 className="mb-2 text-sm font-semibold text-slate-900">Entités liées</h3>
                <PrelevementEntityLink prelevementId={prelevementId} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
