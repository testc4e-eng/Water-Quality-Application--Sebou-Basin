export const KPI_DEFINITIONS = {
  iqgb: {
    label: "IQGB",
    title: "Indice Qualité Global Bassin",
    definition: "Score synthétique qui résume l’état global de la qualité des eaux du bassin.",
    calculation: "Calculé à partir des statuts qualité des stations, des paramètres critiques et de la fraîcheur des données.",
    interpretation: "Plus le score est élevé, plus la situation globale est favorable.",
    source: "/api/v1/kpi/overview",
    thresholds: "Excellent ≥ 80 · Surveillance 50–79 · Critique < 50",
  },
  ifd: {
    label: "IFD",
    title: "Indice Fraîcheur Données",
    definition: "Mesure le niveau d’actualité des données utilisées par le SAD.",
    calculation: "Basé sur l’âge des dernières mesures disponibles par famille de données.",
    interpretation: "Un score faible signifie que les données sont anciennes et doivent être actualisées.",
    source: "/api/v1/kpi/overview + fraîcheur des familles opérationnelles",
    thresholds: "Excellent ≥ 80 · Bon 60–79 · Moyen 40–59 · Faible 20–39 · Critique < 20",
  },
  icd: {
    label: "ICD",
    title: "Indice Confiance Données",
    definition: "Évalue la fiabilité globale des données exploitées par la plateforme.",
    calculation: "Basé sur la complétude, la cohérence et les contrôles qualité disponibles.",
    interpretation: "Un score élevé indique que les résultats sont plus fiables pour l’aide à la décision.",
    source: "/api/v1/kpi/overview + contrôles qualité backend",
    thresholds: "Excellent ≥ 80 · Bon 60–79 · Moyen 40–59 · Faible 20–39 · Critique < 20",
  },
  ich: {
    label: "ICH",
    title: "Indice Confiance Hydraulique",
    definition: "Mesure la confiance accordée au réseau hydrographique utilisé pour les analyses spatiales et de propagation.",
    calculation: "Basé sur le réseau validé, la topologie corrigée et les arbitrages hydrauliques clôturés.",
    interpretation: "Un score élevé indique que le réseau est fiable pour les analyses topologiques.",
    source: "/api/v1/kpi/overview + réseau hydro validé",
    thresholds: "Excellent ≥ 85 · Bon 70–84 · Moyen 50–69 · Faible < 50",
  },
  ipp: {
    label: "IPP",
    title: "Indice Pression Pollution",
    definition: "Mesure la pression potentielle exercée par les sources de pollution connues.",
    calculation: "Basé sur les pollutions déclarées, la proximité au réseau, la propagation topologique et les actifs potentiellement atteignables.",
    interpretation: "Un score élevé indique une pression pollution plus importante. Ce score reste topologique et non scientifique hydraulique.",
    source: "/api/v1/kpi/overview + moteur propagation MVP",
    thresholds: "Faible < 30 · Moyen 30–59 · Élevé ≥ 60",
  },
  isr: {
    label: "ISR",
    title: "Indice Sous-Bassin à Risque",
    definition: "Priorise les sous-bassins selon leur niveau de risque opérationnel.",
    calculation: "Basé sur la qualité, la pollution, la fraîcheur des données et les alertes actives.",
    interpretation: "Un score élevé indique un sous-bassin à surveiller ou prioriser.",
    source: "/api/v1/kpi/overview + synthèse sous-bassins",
    thresholds: "Faible < 30 · Moyen 30–59 · Élevé ≥ 60",
  },
} as const;

export const OPERATIONAL_INDICATOR_DEFINITIONS = {
  barrages_suivis: {
    title: "Barrages suivis",
    definition: "Nombre d’ouvrages hydrauliques visibles dans le suivi opérationnel.",
    calculation: "Compté à partir du référentiel barrage et des dernières données disponibles.",
  },
  donnees_pluie_disponibles: {
    title: "Données pluie disponibles",
    definition: "Stations ou points disposant de mesures de précipitation exploitables.",
    calculation: "Libellé prudent tant que la typologie pluviométrique métier n’est pas consolidée.",
  },
  stations_hydro_actives: {
    title: "Stations hydro actives",
    definition: "Stations hydrologiques présentant des données récentes utiles.",
    calculation: "Basé sur les dernières mesures de débit disponibles.",
  },
  stations_sentinelles_qualite: {
    title: "Stations sentinelles qualité",
    definition: "Réseau restreint de stations avec mesures qualité journalières.",
    calculation: "Basé sur les 6 stations qualité quotidiennes actuellement disponibles.",
  },
} as const;

export type KpiDefinitionKey = keyof typeof KPI_DEFINITIONS;
export type OperationalIndicatorKey = keyof typeof OPERATIONAL_INDICATOR_DEFINITIONS;
