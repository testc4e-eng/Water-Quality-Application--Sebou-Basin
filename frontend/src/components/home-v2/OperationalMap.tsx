import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Layers3, MapPinned } from "lucide-react";
import { NavLink } from "react-router-dom";

import { getEntities, type MapBusinessFeatureCollection, type MapEntitiesFilters } from "@/api/mapBusiness";
import { getQualityStations, type QualityStation } from "@/api/qualityRegulatory";
import type { DashboardHomeAlert, DashboardHomeMap, DashboardHomeRecommendedAction } from "@/api/dashboardHome";
import { BusinessMap } from "@/components/DashboardMetier/BusinessMap";
import { AlertsPanel } from "@/components/home-v2/AlertsPanel";
import { LayerSummary } from "@/components/home-v2/LayerSummary";
import { RecommendedActionsPanel } from "@/components/home-v2/RecommendedActionsPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OperationalMapProps {
  mapConfig: DashboardHomeMap;
  alerts: DashboardHomeAlert[];
  actions: DashboardHomeRecommendedAction[];
}

const HOME_SENTINEL_QUALITY_COUNT = 6;

function parseEntitiesFilters(featuresEndpoint: string | undefined): MapEntitiesFilters | null {
  const resolveDashboardLayerFallback = (layerName: string): MapEntitiesFilters | null => {
    switch (layerName) {
      case "barrages":
        return { support: "barrages", limit: 200 };
      case "hydro":
        return { group_code: "stations", support_code: "hydro", limit: 200 };
      case "pluvio":
        return { group_code: "stations", support_code: "pluvio", limit: 200 };
      case "quality_daily":
        // The quality layer is already loaded via /quality/unified/stations.
        // The legacy /map/entities?support=stations_qualite endpoint currently returns 500 in local demo runtime.
        return null;
      default:
        return null;
    }
  };

  if (!featuresEndpoint || !featuresEndpoint.includes("/map/entities")) {
    if (featuresEndpoint?.includes("/dashboard/map")) {
      const searchIndex = featuresEndpoint.indexOf("?");
      const search = searchIndex >= 0 ? featuresEndpoint.slice(searchIndex + 1) : "";
      const params = new URLSearchParams(search);
      const layerName = params.get("layers");
      return layerName ? resolveDashboardLayerFallback(layerName) : null;
    }
    return null;
  }

  const searchIndex = featuresEndpoint.indexOf("?");
  const search = searchIndex >= 0 ? featuresEndpoint.slice(searchIndex + 1) : "";
  const params = new URLSearchParams(search);

  return {
    group_code: params.get("group_code") ?? undefined,
    support_code: params.get("support_code") ?? undefined,
    parameter_code: params.get("parameter_code") ?? undefined,
    commune: params.get("commune") ?? undefined,
    bbox: params.get("bbox") ?? undefined,
    limit: params.get("limit") ? Number(params.get("limit")) : undefined,
  };
}

export function OperationalMap({ mapConfig, alerts, actions }: OperationalMapProps) {
  const qualityStationsQuery = useQuery({
    queryKey: ["home-operational-map", "quality-stations"],
    queryFn: ({ signal }) => getQualityStations({}, signal),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const sentinelStations = useMemo(() => {
    const stations = Array.isArray(qualityStationsQuery.data) ? [...qualityStationsQuery.data] : [];
    return stations
      .filter((station) => station.dt_max)
      .sort((left, right) => {
        const dateCompare = String(right.dt_max ?? "").localeCompare(String(left.dt_max ?? ""));
        if (dateCompare !== 0) return dateCompare;
        const measuresCompare = (right.n_mesures ?? 0) - (left.n_mesures ?? 0);
        if (measuresCompare !== 0) return measuresCompare;
        return left.station_name.localeCompare(right.station_name, "fr");
      })
      .slice(0, HOME_SENTINEL_QUALITY_COUNT);
  }, [qualityStationsQuery.data]);

  const sentinelStationIds = useMemo(
    () => new Set(sentinelStations.map((station) => String(station.station_id))),
    [sentinelStations],
  );

  const sentinelStationsById = useMemo(
    () =>
      sentinelStations.reduce<Record<string, QualityStation>>((accumulator, station) => {
        accumulator[String(station.station_id)] = station;
        return accumulator;
      }, {}),
    [sentinelStations],
  );

  const layerRequests = useMemo(
    () =>
      mapConfig.default_layers
        .map((layerKey) => {
          const layer = mapConfig.layers[layerKey];
          const filters = parseEntitiesFilters(layer?.features_endpoint);
          return layer && filters ? { layerKey, layer, filters } : null;
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [mapConfig],
  );

  const layerQueries = useQueries({
    queries: layerRequests.map(({ layerKey, filters }) => ({
      queryKey: ["home-operational-map", layerKey, filters],
      queryFn: () => getEntities(filters),
      staleTime: 60_000,
    })),
  });

  const combinedMapData = useMemo<MapBusinessFeatureCollection | undefined>(() => {
    const featureById = new Map<string, MapBusinessFeatureCollection["features"][number]>();

    layerQueries.forEach((query, queryIndex) => {
      const data = query.data;
      if (!data) return;

      const layerKey = layerRequests[queryIndex]?.layerKey;
      const scopedFeatures =
        layerKey === "quality_daily" && sentinelStationIds.size > 0
          ? data.features.filter((feature) => sentinelStationIds.has(String(feature.properties?.entity_id ?? feature.id)))
          : data.features;

      scopedFeatures.forEach((feature, index) => {
        const entityId =
          String(feature.properties?.entity_id ?? feature.id ?? `${feature.geometry?.type ?? "feature"}-${index}`);
        const sentinelStation = layerKey === "quality_daily" ? sentinelStationsById[entityId] : undefined;
        const enrichedFeature =
          sentinelStation && feature.properties
            ? {
                ...feature,
                properties: {
                  ...feature.properties,
                  label: sentinelStation.station_name,
                  station_id: sentinelStation.station_id,
                  station_name: sentinelStation.station_name,
                  latest_quality_date: sentinelStation.dt_max,
                  quality_measure_count: sentinelStation.n_mesures,
                },
              }
            : feature;
        if (!featureById.has(entityId)) {
          featureById.set(entityId, enrichedFeature);
        }
      });
    });

    if (featureById.size === 0) {
      return undefined;
    }

    return {
      type: "FeatureCollection",
      features: Array.from(featureById.values()),
      metadata: {
        source: "home-default-layers",
        count: featureById.size,
      },
    };
  }, [layerQueries, layerRequests, sentinelStationIds, sentinelStationsById]);

  const mapLoading =
    qualityStationsQuery.isLoading ||
    qualityStationsQuery.isFetching ||
    layerQueries.some((query) => query.isLoading || query.isFetching);

  const layerErrors = useMemo(() => {
    const errors: Record<string, Error> = {};
    layerQueries.forEach((query, index) => {
      const layerKey = layerRequests[index]?.layerKey;
      if (layerKey && query.error) {
        errors[layerKey] = query.error as Error;
      }
    });
    return errors;
  }, [layerQueries, layerRequests]);

  const hasAnyLayerData = Boolean(combinedMapData && combinedMapData.features.length > 0);
  const allLayersErrored = layerQueries.length > 0 && layerQueries.every((query) => query.error);
  const criticalMapError =
    (qualityStationsQuery.error as Error | null | undefined) ??
    (allLayersErrored && !hasAnyLayerData ? (layerQueries.find((query) => query.error)?.error as Error | null | undefined) : undefined);

  return (
    <Card className="overflow-hidden rounded-[24px] border-slate-200 bg-white shadow-[0_20px_54px_rgba(15,23,42,0.08)] lg:h-full">
      <CardHeader className="border-b border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] py-2.5">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-950">
              <MapPinned className="h-4.5 w-4.5 text-blue-700" />
              Carte métier - Vue bassin
            </CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" className="bg-slate-950 text-white hover:bg-slate-800">
              <NavLink to="/dashboard-carto-metier">Ouvrir la carte métier complète</NavLink>
            </Button>
            <Button asChild size="sm" variant="outline">
              <NavLink to="/dashboard-pollution">Ouvrir Pollution</NavLink>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-3 lg:flex lg:min-h-[460px] lg:flex-col">
        <LayerSummary mapConfig={mapConfig} layerErrors={layerErrors} />

        <div className="grid gap-2 xl:grid-cols-[minmax(0,2.3fr)_minmax(260px,0.8fr)] 2xl:grid-cols-[minmax(0,2.8fr)_minmax(260px,0.72fr)] lg:flex-1">
          <div className="relative min-h-[360px] xl:min-h-[430px] lg:min-h-[430px]">
            <BusinessMap
              data={combinedMapData}
              loading={mapLoading}
              error={criticalMapError ?? null}
              mode="home"
              popupVariant="compact"
              overlayTitle="CARTE MÉTIER - VUE BASSIN"
              emptyMessage="La carte Home V2 réutilise le moteur métier existant. Le rendu multicouche opérationnel complet reste consolidé dans /dashboard-carto-metier."
            />

            <div className="pointer-events-none absolute right-4 top-4">
              <div className="rounded-2xl border border-white/70 bg-white/90 px-2.5 py-2 shadow-lg backdrop-blur">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <Layers3 className="h-3.5 w-3.5 text-blue-700" />
                  Couches métier
                </div>
                <div className="mt-0.5 text-sm font-semibold text-slate-950">{mapConfig.default_layers.length}</div>
                <div className="text-[10px] text-slate-600">actives</div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4">
              <Button asChild size="sm" className="bg-[#0B2D66] text-white shadow-lg hover:bg-[#0A2450]">
                <NavLink to="/dashboard-carto-metier">Voir la carte complète</NavLink>
              </Button>
            </div>
          </div>

          <div className="grid gap-2 xl:max-h-[430px] xl:grid-rows-[minmax(0,1fr)_minmax(0,1fr)] xl:overflow-hidden">
            <AlertsPanel alerts={alerts} compact maxVisible={3} />
            <RecommendedActionsPanel actions={actions} compact maxVisible={3} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
