import { useMemo, useState, type ChangeEvent } from "react";
import { AxiosError } from "axios";

import type {
  ApiErrorResponse,
  GeoJsonPoint,
  PollutionDeclarationCreateRequest,
  PollutionDeclarationEvaluateRequest,
  PollutionDeclarationEvaluationResponse,
  PollutionDeclarationResponse,
  RecommendationResult,
} from "@/api/pollutionDeclarations";
import DeclarationMapPanel from "@/components/Pollution/DeclarationMapPanel";
import { usePollutionDeclarations } from "@/hooks/usePollutionDeclarations";
import PageHeader from "@/components/Layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormState = {
  longitude: string;
  latitude: string;
  Crejet_mg_L: string;
  QRejet_m3_s: string;
  QSebou_m3_s: string;
  QInnaouen_m3_s: string;
  QOuergha_m3_s: string;
  commentaire: string;
};

const INITIAL_FORM: FormState = {
  longitude: "-5.5600",
  latitude: "34.4200",
  Crejet_mg_L: "1.2",
  QRejet_m3_s: "0.5",
  QSebou_m3_s: "15",
  QInnaouen_m3_s: "6",
  QOuergha_m3_s: "9",
  commentaire: "",
};

const DAR_EL_ARSSA_PRESET: FormState = {
  longitude: "-4.908418523493339",
  latitude: "34.16528818110318",
  Crejet_mg_L: "1.2",
  QRejet_m3_s: "0.5",
  QSebou_m3_s: "15",
  QInnaouen_m3_s: "6",
  QOuergha_m3_s: "9",
  commentaire: "Point source matrice NH4 - avant station Dar El Arsa",
};

function toNumber(value: string) {
  return Number(value.trim());
}

function formatBoolean(value: boolean | null | undefined) {
  if (value === undefined || value === null) return "-";
  return value ? "Oui" : "Non";
}

function formatPoint(point?: GeoJsonPoint | null) {
  if (!point?.coordinates?.length) return "-";
  const [lng, lat] = point.coordinates;
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

function extractApiError(error: unknown) {
  const fallback = "Erreur inattendue lors de l'appel API.";
  if (!(error instanceof AxiosError)) {
    return fallback;
  }
  const payload = error.response?.data as ApiErrorResponse | undefined;
  if (payload?.message) {
    const base = payload.code ? `${payload.code} - ${payload.message}` : payload.message;
    return payload.user_action ? `${base} ${payload.user_action}` : base;
  }
  return error.message || fallback;
}

function getCurrentDeclaration(
  declaration: PollutionDeclarationResponse | undefined,
  created: PollutionDeclarationResponse | undefined
) {
  return declaration ?? created ?? null;
}

function getCurrentEvaluation(evaluation: PollutionDeclarationEvaluationResponse | undefined) {
  return evaluation ?? null;
}

function RecommendationCard({ recommendation }: { recommendation: RecommendationResult }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="font-semibold text-slate-900">{recommendation.title}</div>
      <div className="mt-1 text-sm text-slate-600">{recommendation.description}</div>
      <div className="mt-2 text-xs text-slate-500">
        Axe: {recommendation.axis} · Priorite: {recommendation.priority} · Confiance: {recommendation.confidence}
      </div>
      {recommendation.proposed_values && (
        <div className="mt-2 text-xs text-slate-600">
          Valeurs proposees: {JSON.stringify(recommendation.proposed_values)}
        </div>
      )}
      {recommendation.delta_values && (
        <div className="mt-1 text-xs text-slate-600">Delta: {JSON.stringify(recommendation.delta_values)}</div>
      )}
      <div className="mt-2 text-xs text-slate-500">{recommendation.justification}</div>
    </div>
  );
}

export default function DashboardDeclarationPollution() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [currentDeclarationId, setCurrentDeclarationId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const { declarationQuery, reportQuery, createMutation, submitMutation, evaluateMutation } =
    usePollutionDeclarations(currentDeclarationId);

  const currentDeclaration = getCurrentDeclaration(declarationQuery.data, createMutation.data);
  const currentEvaluation = getCurrentEvaluation(evaluateMutation.data);
  const topology = currentEvaluation?.topology_result;
  const matrix = currentEvaluation?.matrix_result;
  const reasoning = currentEvaluation?.decision_reasoning;
  const reportAvailable = Boolean(currentEvaluation?.report_available ?? currentDeclaration?.report_available);

  const canSubmit = Boolean(currentDeclarationId) && currentDeclaration?.status === "BROUILLON";
  const canEvaluate = Boolean(currentDeclarationId) && currentDeclaration?.status === "PRET_A_ANALYSER";

  const handleChange =
    (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const createPayload = useMemo<PollutionDeclarationCreateRequest>(() => {
    return {
      date_declaration: new Date().toISOString(),
      point_declaration: {
        type: "Point",
        coordinates: [toNumber(form.longitude), toNumber(form.latitude)],
      },
      polluant: "NH4",
      Crejet_mg_L: toNumber(form.Crejet_mg_L),
      QRejet_m3_s: toNumber(form.QRejet_m3_s),
      QSebou_m3_s: toNumber(form.QSebou_m3_s),
      QInnaouen_m3_s: toNumber(form.QInnaouen_m3_s),
      QOuergha_m3_s: toNumber(form.QOuergha_m3_s),
      commentaire: form.commentaire || null,
    };
  }, [form]);

  const handleCreate = async () => {
    setApiError(null);
    try {
      const response = await createMutation.mutateAsync(createPayload);
      setCurrentDeclarationId(response.declaration_id);
    } catch (error) {
      setApiError(extractApiError(error));
    }
  };

  const handleSubmit = async () => {
    if (!currentDeclarationId) return;
    setApiError(null);
    try {
      await submitMutation.mutateAsync({
        declarationId: currentDeclarationId,
        payload: { reason: "Soumission depuis le shell frontend MVP" },
      });
    } catch (error) {
      setApiError(extractApiError(error));
    }
  };

  const handleEvaluate = async () => {
    if (!currentDeclarationId) return;
    setApiError(null);
    const payload: PollutionDeclarationEvaluateRequest = { use_saved_values: true };
    try {
      await evaluateMutation.mutateAsync({ declarationId: currentDeclarationId, payload });
    } catch (error) {
      setApiError(extractApiError(error));
    }
  };

  const handleLoadReport = async () => {
    if (!currentDeclarationId) return;
    setApiError(null);
    try {
      await reportQuery.refetch();
    } catch (error) {
      setApiError(extractApiError(error));
    }
  };

  const handleLoadDarElArssaPreset = () => {
    setForm(DAR_EL_ARSSA_PRESET);
    setApiError(null);
  };

  const isBusy =
    createMutation.isPending || submitMutation.isPending || evaluateMutation.isPending || reportQuery.isFetching;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <PageHeader
        title="Declaration Pollution MVP"
        subtitle="Shell frontend minimal branche sur create, submit, evaluate et report. Le backend reste source de verite du workflow et des calculs."
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Declaration</CardTitle>
            <CardDescription>
              Saisie minimale du point et des variables hydrologiques. Aucun calcul metier n'est fait localement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Les valeurs par defaut servent au shell MVP. Le moteur topologique reel peut refuser le point si le snap ou le parcours aval ne sont pas valides.
            </div>

            <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
              Le preset demo charge un point proxy aligne sur un parcours topologique reel. Il sert au diagnostic MVP mais ne masque pas les erreurs de topologie ou d'orchestration du backend.
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input id="longitude" value={form.longitude} onChange={handleChange("longitude")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input id="latitude" value={form.latitude} onChange={handleChange("latitude")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crejet">Crejet_mg_L</Label>
                <Input id="crejet" value={form.Crejet_mg_L} onChange={handleChange("Crejet_mg_L")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qrejet">QRejet_m3_s</Label>
                <Input id="qrejet" value={form.QRejet_m3_s} onChange={handleChange("QRejet_m3_s")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qsebou">QSebou_m3_s</Label>
                <Input id="qsebou" value={form.QSebou_m3_s} onChange={handleChange("QSebou_m3_s")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qinnaouen">QInnaouen_m3_s</Label>
                <Input id="qinnaouen" value={form.QInnaouen_m3_s} onChange={handleChange("QInnaouen_m3_s")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qouergha">QOuergha_m3_s</Label>
                <Input id="qouergha" value={form.QOuergha_m3_s} onChange={handleChange("QOuergha_m3_s")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commentaire">Commentaire</Label>
              <Textarea
                id="commentaire"
                rows={3}
                value={form.commentaire}
                onChange={handleChange("commentaire")}
                placeholder="Commentaire operationnel optionnel"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleLoadDarElArssaPreset} disabled={isBusy}>
                Charger le point source matrice NH4
              </Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending || Boolean(currentDeclarationId)}>
                {createMutation.isPending ? "Creation..." : "Creer"}
              </Button>
              <Button variant="outline" onClick={handleSubmit} disabled={!canSubmit || submitMutation.isPending}>
                {submitMutation.isPending ? "Soumission..." : "Soumettre"}
              </Button>
              <Button variant="secondary" onClick={handleEvaluate} disabled={!canEvaluate || evaluateMutation.isPending}>
                {evaluateMutation.isPending ? "Evaluation..." : "Evaluer"}
              </Button>
              <Button variant="ghost" onClick={handleLoadReport} disabled={!reportAvailable || reportQuery.isFetching}>
                {reportQuery.isFetching ? "Chargement report..." : "Charger report"}
              </Button>
            </div>

            {apiError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {apiError}
              </div>
            )}

            {isBusy && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                Requete en cours...
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Carte declaration pollution</CardTitle>
            <CardDescription>
              Visualisation minimale du parcours topologique retourne par l'API declaration, sans appel direct au moteur propagation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeclarationMapPanel
              declaration={currentDeclaration}
              topologyResult={topology}
              matrixResult={matrix}
              warnings={currentEvaluation?.warnings ?? []}
              isLoading={evaluateMutation.isPending}
              error={apiError}
            />
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Etat declaration</CardTitle>
              <CardDescription>Sortie workflow utile au shell MVP.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><span className="font-semibold">Declaration ID:</span> {currentDeclaration?.declaration_id ?? "-"}</div>
              <div><span className="font-semibold">Reference:</span> {currentDeclaration?.reference ?? "-"}</div>
              <div><span className="font-semibold">Statut:</span> {currentDeclaration?.status ?? "-"}</div>
              <div><span className="font-semibold">Polluant:</span> {currentDeclaration?.polluant ?? "-"}</div>
              <div><span className="font-semibold">Point declare:</span> {formatPoint(currentDeclaration?.point_declaration)}</div>
              <div><span className="font-semibold">Snapshot ID:</span> {currentEvaluation?.snapshot_id ?? currentDeclaration?.current_snapshot_id ?? "-"}</div>
              <div><span className="font-semibold">Report available:</span> {String(reportAvailable)}</div>
              <div><span className="font-semibold">Transitions:</span> {currentDeclaration?.transitions?.length ?? 0}</div>
              {declarationQuery.isFetching && <div className="text-slate-500">Actualisation de la declaration...</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mini resume carte</CardTitle>
              <CardDescription>Fallback textuel du rendu cartographique declaration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><span className="font-semibold">Point declare:</span> {formatPoint(currentDeclaration?.point_declaration)}</div>
              <div><span className="font-semibold">Point snappe:</span> {formatPoint(topology?.snapped_point)}</div>
              <div><span className="font-semibold">Parcours GeoJSON:</span> {topology?.parcours_geojson?.features?.length ?? 0} feature(s)</div>
              <div><span className="font-semibold">Stations detectees:</span> {topology?.stations_detectees?.length ?? 0}</div>
              <div><span className="font-semibold">Affluents detectes:</span> {topology?.affluents_detectes?.join(", ") ?? "-"}</div>
              <div><span className="font-semibold">Confiance topologique:</span> {topology?.confidence_level ?? "-"}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Topology result</CardTitle>
              <CardDescription>Restitution legere du parcours aval sans calcul local.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><span className="font-semibold">Point snappe:</span> {formatPoint(topology?.snapped_point)}</div>
              <div><span className="font-semibold">Distance de snap:</span> {topology?.snap_distance_m ?? "-"} m</div>
              <div><span className="font-semibold">Longueur parcours:</span> {topology?.longueur_km ?? "-"} km</div>
              <div><span className="font-semibold">Amont Barrage de Garde atteint:</span> {formatBoolean(topology?.barrage_garde_atteint)}</div>
              <div><span className="font-semibold">Sidi Allal Tazi detectee:</span> {formatBoolean(topology?.sidi_allal_tazi_detectee)}</div>
              <div><span className="font-semibold">Exutoire atteint:</span> {formatBoolean(topology?.exutoire_atteint)}</div>
              <div>
                <span className="font-semibold">Warnings topologiques:</span>
                {topology?.warnings?.length ? (
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-700">
                    {topology.warnings.map((warning, index) => (
                      <li key={`${index}-${warning}`}>{warning}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-1 text-slate-500">Aucun warning topologique.</div>
                )}
              </div>
              <div>
                <span className="font-semibold">Stations detectees:</span>
                {topology?.stations_detectees?.length ? (
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-700">
                    {topology.stations_detectees.map((station, index) => (
                      <li key={`${index}-${String(station.station_id ?? station.station_name ?? index)}`}>
                        {String(station.station_name ?? station.station_id ?? "Station")}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-1 text-slate-500">Aucune station retournee.</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resultat evaluation</CardTitle>
              <CardDescription>Concentrations, risque et limites scientifiques.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><span className="font-semibold">C_SidiAllalTazi_mg_L:</span> {matrix?.C_SidiAllalTazi_mg_L ?? "-"}</div>
              <div><span className="font-semibold">C_BgGarde_mg_L:</span> {matrix?.C_BgGarde_mg_L ?? "-"}</div>
              <div><span className="font-semibold">Statut global:</span> {matrix?.statut_global ?? "-"}</div>
              <div><span className="font-semibold">Risque:</span> {currentEvaluation?.risk_result.risk_level ?? "-"}</div>
              <div><span className="font-semibold">Confiance matrice:</span> {matrix?.confidence_level ?? "-"}</div>
              <div><span className="font-semibold">Methode:</span> {matrix?.method_used ?? "-"}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recommandations</CardTitle>
              <CardDescription>Retour structure du moteur de recommandation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentEvaluation?.recommendations?.length ? (
                currentEvaluation.recommendations.map((recommendation) => (
                  <RecommendationCard key={recommendation.recommendation_id} recommendation={recommendation} />
                ))
              ) : (
                <div className="text-sm text-slate-500">Aucune recommandation disponible pour l'instant.</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Decision reasoning et report</CardTitle>
              <CardDescription>Explication decisionnelle conforme au backend et restitution du report.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 font-semibold text-slate-900">Resume</div>
                <div className="text-sm text-slate-700">{reasoning?.summary ?? "Aucune explication disponible."}</div>
              </div>

              <div>
                <div className="mb-2 font-semibold text-slate-900">Raisons detaillees</div>
                {reasoning?.reasons?.length ? (
                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {reasoning.reasons.map((item, index) => (
                      <li key={`${index}-${item}`}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-slate-500">Aucune raison detaillee.</div>
                )}
              </div>

              <div className="text-sm text-slate-700">
                <span className="font-semibold">Validation humaine requise:</span>{" "}
                {formatBoolean(reasoning?.human_validation_required)}
              </div>

              <div>
                <div className="mb-2 font-semibold text-slate-900">Warnings API</div>
                <pre className="overflow-x-auto rounded bg-slate-950 p-3 text-xs text-slate-100">
{JSON.stringify(currentEvaluation?.warnings ?? [], null, 2)}
                </pre>
              </div>

              <div>
                <div className="mb-2 font-semibold text-slate-900">Report payload</div>
                <pre className="overflow-x-auto rounded bg-slate-950 p-3 text-xs text-slate-100">
{JSON.stringify(reportQuery.data?.report_payload ?? null, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
