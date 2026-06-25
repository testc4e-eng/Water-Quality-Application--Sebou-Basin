import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, BadgeAlert, Factory, FlaskConical, Route, ShieldAlert, Waves } from "lucide-react";

import type { PollutionSiteProperties } from "@/api/pollutionIdp";
import PollutionIdpMap from "@/components/Pollution/PollutionIdpMap";
import PageHeader from "@/components/Layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDecisionRecommendations } from "@/hooks/useDecisionIntelligence";
import { usePollutionIdp, usePollutionLatestResults } from "@/hooks/usePollutionIdp";
import {
  usePropagationToBarrages,
  usePropagationToExutoires,
  usePropagationToGarde,
  usePropagationToStations,
  useSnapDiagnostic,
} from "@/hooks/usePropagation";
import { buildPollutionSummary, pollutionSeverity } from "@/lib/decision-metrics";

export default function DashboardPollution() {
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [symbologyMode, setSymbologyMode] = useState<"validation_status" | "regulatory_status">("regulatory_status");

  const pollutionQuery = usePollutionIdp({ limit: 500 });
  const latestResultsQuery = usePollutionLatestResults({ limit: 250 });
  const pollutionFeatures = pollutionQuery.data?.features ?? [];
  const selectedFeature = pollutionFeatures.find((feature) => feature.properties.site_id === selectedSiteId);
  const selectedSite = selectedFeature?.properties;

  const propagationParams = selectedSite ? { site_id: selectedSite.site_id, vitesse_reference_kmh: 10, limit: 10 } : null;

  const snapQuery = useSnapDiagnostic(propagationParams, Boolean(propagationParams));
  const gardeQuery = usePropagationToGarde(propagationParams, Boolean(propagationParams));
  const stationsQuery = usePropagationToStations(
    propagationParams ? { ...propagationParams, only_reachable: true, limit: 8 } : null,
    Boolean(propagationParams)
  );
  const barragesQuery = usePropagationToBarrages(
    propagationParams ? { ...propagationParams, only_reachable: true, limit: 8 } : null,
    Boolean(propagationParams)
  );
  const exutoiresQuery = usePropagationToExutoires(
    propagationParams ? { ...propagationParams, only_reachable: true, limit: 8 } : null,
    Boolean(propagationParams)
  );

  const sortedSites = useMemo(
    () =>
      [...pollutionFeatures]
        .map((feature) => feature.properties)
        .sort((a, b) => pollutionSeverity(b) - pollutionSeverity(a)),
    [pollutionFeatures]
  );

  const ipp = selectedSite
    ? buildPollutionSummary({
        site: selectedSite,
        garde: gardeQuery.data,
        stations: stationsQuery.data,
        barrages: barragesQuery.data,
      })
    : null;

  const recommendationsQuery = useDecisionRecommendations({
    domain: "pollution",
    site_id: selectedSiteId || undefined,
    limit: 5,
  });
  const recommendations = recommendationsQuery.data?.map((item) => item.action) ?? [];
  const latestResults = latestResultsQuery.data?.data ?? [];
  const sourceTypeSummary = useMemo(() => {
    const counter = new Map<string, number>();
    for (const feature of pollutionFeatures) {
      const label = feature.properties.source_type_label || feature.properties.source_type_code || "Non renseigné";
      counter.set(label, (counter.get(label) ?? 0) + 1);
    }
    return Array.from(counter.entries()).sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [pollutionFeatures]);

  const impactedAssets = [
    ...(stationsQuery.data?.targets ?? []).map((target) => ({
      key: `station-${target.station_id}`,
      label: target.station_name,
      type: "Station",
      distance: target.distance_to_source_km,
      confidence: target.target_snap_confidence,
    })),
    ...(barragesQuery.data?.targets ?? []).map((target) => ({
      key: `barrage-${target.barrage_id}`,
      label: target.barrage_name,
      type: "Barrage",
      distance: target.distance_to_source_km,
      confidence: target.target_snap_confidence,
    })),
    ...(exutoiresQuery.data?.targets ?? []).map((target) => ({
      key: `exutoire-${target.node_id}`,
      label: `Exutoire ${target.node_id}`,
      type: "Exutoire",
      distance: target.distance_to_source_km,
      confidence: "N/A",
    })),
  ]
    .filter((item) => item.distance != null)
    .sort((a, b) => Number(a.distance) - Number(b.distance))
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-[#EEF5FF]">
      <PageHeader
        title="Pollution"
        subtitle="Pilotage décisionnel des pollutions déclarées, de la propagation topologique MVP et des recommandations d'action."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSymbologyMode((value) => (value === "regulatory_status" ? "validation_status" : "regulatory_status"))}>
              Changer la symbologie
            </Button>
          </div>
        }
      />

      <div className="mx-auto flex max-w-[1600px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status="DEV" />
            <Badge variant="outline" className="border-amber-300 text-amber-900">TOPOLOGIQUE</Badge>
            <Badge variant="outline" className="border-amber-300 text-amber-900">NON HYDRAULIQUE SCIENTIFIQUE</Badge>
          </div>
          <div className="mt-3 font-semibold">Propagation topologique</div>
          <div className="mt-1">Aide à la décision préliminaire.</div>
          <div className="mt-1">Validation hydraulique avancée future.</div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Sites recensés</div>
              <div className="mt-2 text-2xl font-semibold text-slate-950">{pollutionFeatures.length}</div>
              <div className="mt-1 text-sm text-slate-600">Sources issues de `/api/v1/pollution/sites.geojson`.</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Résultats récents</div>
              <div className="mt-2 text-2xl font-semibold text-slate-950">{latestResultsQuery.data?.count ?? 0}</div>
              <div className="mt-1 text-sm text-slate-600">Dernières analyses issues de `/api/v1/pollution/latest-results`.</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Types de rejets</div>
              <div className="mt-2 text-2xl font-semibold text-slate-950">{sourceTypeSummary.length}</div>
              <div className="mt-1 text-sm text-slate-600">Synthèse des typologies visibles sur la carte.</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Source API</div>
              <div className="mt-2 font-mono text-xs text-slate-700">/api/v1/pollution/* + /api/v1/propagation/*</div>
              <div className="mt-1 text-sm text-slate-600">Recommandations assistées via `/api/v1/recommendations`.</div>
            </CardContent>
          </Card>
        </section>

        {pollutionQuery.isError || latestResultsQuery.isError ? (
          <section className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            L'API pollution n'a pas pu être chargée. Vérifier les endpoints <code>/api/v1/pollution/*</code>.
          </section>
        ) : null}

        {!pollutionQuery.isLoading && pollutionFeatures.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
            Aucun site pollution n'a été remonté. L'écran reste stable mais la restitution est vide.
          </section>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_420px]">
          <div className="space-y-5">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Pollutions déclarées</CardTitle>
              </CardHeader>
              <CardContent>
                <PollutionIdpMap
                  data={pollutionQuery.data}
                  loading={pollutionQuery.isLoading}
                  error={pollutionQuery.error as Error | null}
                  symbologyMode={symbologyMode}
                  selectedSiteId={selectedSiteId || null}
                  onSiteSelect={(properties) => setSelectedSiteId(properties.site_id)}
                />
              </CardContent>
            </Card>

            <Tabs defaultValue="declared" className="space-y-4">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="declared">Pollutions déclarées</TabsTrigger>
                <TabsTrigger value="propagation">Propagation</TabsTrigger>
                <TabsTrigger value="impacts">Impacts potentiels</TabsTrigger>
                <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
              </TabsList>

              <TabsContent value="declared" className="space-y-4">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle>Incidents actifs et pression pollution</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 md:grid-cols-2">
                    {sortedSites.slice(0, 6).map((site) => (
                      <div key={site.site_id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-slate-950">{site.site_name || site.site_code || "Site pollution"}</div>
                            <p className="mt-1 text-sm text-slate-600">
                              {site.commune || "Commune non renseignée"} · {site.source_type_label || site.source_type_code || "Typologie non renseignée"}
                            </p>
                          </div>
                          <Badge className="bg-slate-900 text-white hover:bg-slate-900">Risque {pollutionSeverity(site)}</Badge>
                        </div>
                        <div className="mt-3">
                          <Button variant="outline" size="sm" onClick={() => setSelectedSiteId(site.site_id)}>
                            Analyser ce site
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle>Typologies de rejets visibles</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 md:grid-cols-2">
                    {sourceTypeSummary.length > 0 ? (
                      sourceTypeSummary.map(([label, count]) => (
                        <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="font-semibold text-slate-950">{label}</div>
                          <div className="mt-1 text-sm text-slate-600">{count} site(s) recensé(s)</div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                        Aucune typologie de rejet disponible.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="propagation" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <Card className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Snap source</div>
                      <div className="mt-3 text-2xl font-semibold text-slate-950">{snapQuery.data?.snap.snap_confidence || "N/D"}</div>
                      <p className="mt-2 text-sm text-slate-600">
                        Distance au réseau : {snapQuery.data?.snap.distance_to_network_m?.toFixed(1) ?? "N/D"} m
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Distance vers garde</div>
                      <div className="mt-3 text-2xl font-semibold text-slate-950">
                        {gardeQuery.data?.propagation.distance_to_garde_km?.toFixed(1) ?? "N/D"} km
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{gardeQuery.data?.propagation.transfer_time_label || "Temps indicatif non disponible"}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Stations impactées</div>
                      <div className="mt-3 text-2xl font-semibold text-slate-950">{stationsQuery.data?.targets.length ?? 0}</div>
                      <p className="mt-2 text-sm text-slate-600">Atteignables selon la topologie MVP.</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">IPP</div>
                      <div className="mt-3 text-2xl font-semibold text-slate-950">{ipp == null ? "N/D" : `${ipp}/100`}</div>
                      <p className="mt-2 text-sm text-slate-600">Indice Pression Pollution MVP non scientifique.</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                  <Card className="border-slate-200 xl:col-span-1">
                    <CardHeader>
                      <CardTitle>Stations impactées</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {(stationsQuery.data?.targets ?? []).slice(0, 6).map((target) => (
                        <div key={target.station_id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <div className="font-semibold text-slate-950">{target.station_name}</div>
                          <div className="mt-1 text-sm text-slate-600">
                            {target.distance_to_source_km?.toFixed(1) ?? "N/D"} km · snap {target.target_snap_confidence}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 xl:col-span-1">
                    <CardHeader>
                      <CardTitle>Barrages impactés</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {(barragesQuery.data?.targets ?? []).slice(0, 6).map((target) => (
                        <div key={target.barrage_id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <div className="font-semibold text-slate-950">{target.barrage_name}</div>
                          <div className="mt-1 text-sm text-slate-600">
                            {target.distance_to_source_km?.toFixed(1) ?? "N/D"} km · snap {target.target_snap_confidence}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 xl:col-span-1">
                    <CardHeader>
                      <CardTitle>Exutoires impactés</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {(exutoiresQuery.data?.targets ?? []).slice(0, 6).map((target) => (
                        <div key={target.node_id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <div className="font-semibold text-slate-950">Exutoire {target.node_id}</div>
                          <div className="mt-1 text-sm text-slate-600">
                            composante {target.component_id} · {target.distance_to_source_km?.toFixed(1) ?? "N/D"} km
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="impacts" className="space-y-4">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle>Impacts potentiels</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {impactedAssets.length > 0 ? (
                      impactedAssets.map((asset) => (
                        <div key={asset.key} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div>
                            <div className="font-semibold text-slate-950">{asset.label}</div>
                            <div className="mt-1 text-sm text-slate-600">
                              {asset.type} · {asset.distance?.toFixed(1)} km · confiance {asset.confidence}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-400" />
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                        Sélectionnez un site pour afficher les impacts potentiels.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle>Actions immédiates et investigations recommandées</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recommendations.length > 0 ? (
                      recommendations.map((recommendation) => (
                        <div key={recommendation} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                          {recommendation}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                        Sélectionnez un site déclaré pour générer les recommandations Sprint 1.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <aside className="space-y-5">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Sélection du site source</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <select
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
                  value={selectedSiteId}
                  onChange={(event) => setSelectedSiteId(event.target.value)}
                >
                  <option value="">Sélectionner un site déclaré</option>
                  {sortedSites.slice(0, 100).map((site) => (
                    <option key={site.site_id} value={site.site_id}>
                      {site.site_name || site.site_code || site.site_id}
                    </option>
                  ))}
                </select>
                {selectedSite ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="font-semibold text-slate-950">{selectedSite.site_name || selectedSite.site_code || "Site sélectionné"}</div>
                    <div className="mt-1 text-sm text-slate-600">{selectedSite.commune || "Commune non renseignée"}</div>
                    <div className="mt-3 grid gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Factory className="h-4 w-4 text-slate-500" />
                        {selectedSite.source_type_label || selectedSite.source_type_code || "Typologie non renseignée"}
                      </div>
                      <div className="flex items-center gap-2">
                        <FlaskConical className="h-4 w-4 text-slate-500" />
                        Sévérité MVP : {pollutionSeverity(selectedSite)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                    Choisissez un site pour lancer l'analyse de propagation.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Rappels métier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
                <div className="flex items-start gap-2">
                  <Route className="mt-1 h-4 w-4 text-blue-700" />
                  <span>Le backend propagation MVP V1 existant est consommé tel quel, sans réimplémentation.</span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldAlert className="mt-1 h-4 w-4 text-amber-600" />
                  <span>Les temps affichés restent indicatifs et non scientifiques.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Waves className="mt-1 h-4 w-4 text-blue-700" />
                  <span>La cible garde métier reste distincte des barrages géographiques.</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-1 h-4 w-4 text-red-600" />
                  <span>Un snap faible impose une vérification experte avant toute décision terrain.</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700">
                  Sources API : <br />
                  GET /api/v1/pollution/sites.geojson<br />
                  GET /api/v1/pollution/latest-results<br />
                  GET /api/v1/propagation/source-to-garde<br />
                  GET /api/v1/propagation/source-to-stations<br />
                  GET /api/v1/propagation/source-to-barrages<br />
                  GET /api/v1/recommendations
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
