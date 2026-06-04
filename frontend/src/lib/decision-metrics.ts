import { parseLatestResults, type PollutionSiteProperties } from "@/api/pollutionIdp";
import type { QualityStation, RegulatoryStatusResponse } from "@/api/qualityRegulatory";
import type { PropagationToBarragesResponse, PropagationToGardeResponse, PropagationToStationsResponse } from "@/api/propagation";

export type MetricTrend = "up" | "down" | "stable";

export interface DecisionMetric {
  key: string;
  label: string;
  value: string;
  note: string;
  status: "ready" | "provisional" | "dependency";
  trend?: MetricTrend;
}

export function parseIsoDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function daysBetween(from?: string | null, to = new Date()) {
  const date = parseIsoDate(from);
  if (!date) return null;
  return Math.max(0, Math.floor((to.getTime() - date.getTime()) / 86_400_000));
}

export function freshnessScore(days: number | null) {
  if (days === null) return null;
  if (days <= 7) return 95;
  if (days <= 30) return 75;
  if (days <= 90) return 55;
  if (days <= 180) return 35;
  return 15;
}

export function confidenceFromRegulatoryStatus(status?: RegulatoryStatusResponse | null) {
  const total = status?.summary.parameters ?? 0;
  const classifiable = status?.summary.parameters_classifiable ?? 0;
  if (!total) return null;
  return Math.round((classifiable / total) * 100);
}

export function hydraulicConfidenceScore() {
  return 80;
}

export function pollutionSeverity(properties: PollutionSiteProperties) {
  const latestResults = parseLatestResults(properties.latest_results);
  const highestSeverity = latestResults.reduce((max, item) => Math.max(max, Number(item.severity_order ?? 0)), 0);
  if (highestSeverity > 0) return highestSeverity;
  if (properties.validation_status === "TO_VALIDATE") return 2;
  if (properties.validation_status === "VALIDATED") return 1;
  return 0;
}

export function pollutionRiskIndex(input: {
  pollutionSeverity: number;
  snapConfidence?: string | null;
  distanceToGardeKm?: number | null;
  reachableStations?: number;
  reachableBarrages?: number;
}) {
  const severityScore = Math.min(40, input.pollutionSeverity * 10);
  const snapScore =
    input.snapConfidence === "HIGH" ? 25 : input.snapConfidence === "MEDIUM" ? 16 : input.snapConfidence === "LOW" ? 8 : 10;
  const distanceScore =
    input.distanceToGardeKm == null ? 10 : input.distanceToGardeKm <= 25 ? 20 : input.distanceToGardeKm <= 100 ? 14 : 8;
  const assetScore = Math.min(15, (input.reachableStations ?? 0) + (input.reachableBarrages ?? 0) * 2);
  return Math.max(0, Math.min(100, severityScore + snapScore + distanceScore + assetScore));
}

export function computeAccueilMetrics(input: {
  stations: QualityStation[];
  regulatoryStatus?: RegulatoryStatusResponse | null;
  pollutionSitesCount: number;
}) {
  const latestStationDate = [...input.stations]
    .map((station) => station.dt_max)
    .filter(Boolean)
    .sort()
    .reverse()[0];
  const freshnessDays = daysBetween(latestStationDate);
  const ifd = freshnessScore(freshnessDays);
  const icd = confidenceFromRegulatoryStatus(input.regulatoryStatus);
  const ich = hydraulicConfidenceScore();

  const metrics: DecisionMetric[] = [
    {
      key: "IQGB",
      label: "IQGB",
      value: "N/D",
      note: "Agrégat bassin à industrialiser côté backend.",
      status: "dependency",
    },
    {
      key: "IFD",
      label: "IFD",
      value: ifd == null ? "N/D" : `${ifd}/100`,
      note: freshnessDays == null ? "Date utile indisponible." : `Calcul provisoire basé sur la dernière mesure connue (${freshnessDays} j).`,
      status: ifd == null ? "dependency" : "provisional",
      trend: freshnessDays != null && freshnessDays <= 30 ? "up" : "down",
    },
    {
      key: "ICD",
      label: "ICD",
      value: icd == null ? "N/D" : `${icd}/100`,
      note: "Proxy basé sur la part de paramètres classifiables exposés.",
      status: icd == null ? "dependency" : "provisional",
      trend: icd != null && icd >= 70 ? "up" : "stable",
    },
    {
      key: "ICH",
      label: "ICH",
      value: `${ich}/100`,
      note: "Proxy DG : réseau validé, propagation MVP topologique non scientifique.",
      status: "provisional",
      trend: "up",
    },
    {
      key: "IPP",
      label: "IPP",
      value: input.pollutionSitesCount ? "MVP" : "N/D",
      note: "Nécessite agrégation croisée pollution + propagation pour score consolidé.",
      status: input.pollutionSitesCount ? "provisional" : "dependency",
    },
    {
      key: "ISR",
      label: "ISR",
      value: "N/D",
      note: "Agrégation par sous-bassin à brancher via backend métier.",
      status: "dependency",
    },
  ];

  return { metrics, latestStationDate, freshnessDays };
}

export function buildImmediateRecommendations(input: {
  staleStations: number;
  criticalPollutionSites: number;
  metrics: DecisionMetric[];
}) {
  const recommendations = [];
  if (input.criticalPollutionSites > 0) {
    recommendations.push({
      action: "Activer une revue pollution prioritaire",
      why: `${input.criticalPollutionSites} sites présentent une pression ou une sévérité élevée.`,
      priority: "Haute",
    });
  }
  if (input.staleStations > 0) {
    recommendations.push({
      action: "Relancer la collecte sur les stations les plus anciennes",
      why: `${input.staleStations} stations n'ont pas de donnée récente exploitable.`,
      priority: "Haute",
    });
  }
  if (input.metrics.some((metric) => metric.status === "dependency")) {
    recommendations.push({
      action: "Industrialiser les KPI DG manquants",
      why: "IQGB et ISR nécessitent des agrégats backend pour fiabiliser le pilotage bassin.",
      priority: "Moyenne",
    });
  }
  if (recommendations.length === 0) {
    recommendations.push({
      action: "Maintenir la surveillance courante",
      why: "Aucune rupture forte détectée sur les indicateurs Sprint 1.",
      priority: "Normale",
    });
  }
  return recommendations.slice(0, 5);
}

export function stationDecisionScore(station: QualityStation) {
  const staleDays = daysBetween(station.dt_max) ?? 365;
  const freshnessPenalty = staleDays > 180 ? 45 : staleDays > 90 ? 32 : staleDays > 30 ? 18 : 5;
  const measureBonus = Math.min(25, Math.round(station.n_mesures / 5));
  return Math.max(0, Math.min(100, 100 - freshnessPenalty + measureBonus));
}

export function stationDecisionLevel(score: number) {
  if (score >= 80) return "Surveillance";
  if (score >= 55) return "Attention";
  return "Critique";
}

export function formatTransferLabel(hours?: number | null, fallback?: string | null) {
  if (fallback) return fallback;
  if (hours == null) return "N/D";
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `+${wholeHours}h${String(minutes).padStart(2, "0")}m`;
}

export function buildPollutionSummary(input: {
  site: PollutionSiteProperties;
  garde?: PropagationToGardeResponse | null;
  stations?: PropagationToStationsResponse | null;
  barrages?: PropagationToBarragesResponse | null;
}) {
  const risk = pollutionRiskIndex({
    pollutionSeverity: pollutionSeverity(input.site),
    snapConfidence: input.garde?.snap.snap_confidence,
    distanceToGardeKm: input.garde?.propagation.distance_to_garde_km,
    reachableStations: input.stations?.targets.length ?? 0,
    reachableBarrages: input.barrages?.targets.length ?? 0,
  });
  return risk;
}
