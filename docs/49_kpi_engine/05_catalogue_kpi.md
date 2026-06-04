# Catalogue KPI

## Règle globale

Tous les KPI Sprint 1.5 sont des KPI décisionnels métier. Ils ne doivent pas être présentés comme des mesures scientifiques complètes lorsqu'ils reposent sur des signaux topologiques ou des proxys.

## `IQGB`

- Nom : Indice Qualité Global Bassin
- Rôle : vue globale DG de l'état qualité du bassin
- Sources :
  - `qualite.mesure_qualite_riviere`
  - `api.v_station_dimension`
  - moteur réglementaire qualité
- Limites :
  - agrégat décisionnel, pas indice réglementaire national officiel

## `IFD`

- Nom : Indice Fraîcheur Données
- Rôle : mesure de disponibilité utile des dernières mesures
- Source : dates des dernières mesures station
- Limite : dépend fortement de l'obsolescence du référentiel réellement chargé

## `ICD`

- Nom : Indice Confiance Données
- Rôle : confiance globale dans l'exploitabilité des données
- Sources :
  - classifiabilité des paramètres
  - présence d'information exploitable
- Limite : ne remplace pas un audit QA complet

## `ICH`

- Nom : Indice Confiance Hydraulique
- Rôle : signal DG sur la robustesse du socle hydrographique
- Source :
  - réseau validé
  - topologie validée
  - connectivité validée
- Règle : lecture seule, aucun recalcul hydrologique

## `IPP`

- Nom : Indice Pression Pollution
- Rôle : prioriser les pollutions actives
- Sources :
  - `api.v_pollution_sites`
  - `api.v_pollution_latest_results`
  - propagation MVP existante
- Formule métier MVP :
  - intensité / sévérité
  - confiance de snap
  - distance aval
  - actifs sensibles atteignables
- Limite :
  - topologique
  - non scientifique

## `ISR`

- Nom : Indice Sous-Bassin à Risque
- Rôle : identifier les sous-bassins prioritaires
- Sources :
  - statuts station
  - fraîcheur données
  - synthèse qualité
- Limite :
  - dépend de la couverture station disponible

## KPI dérivés stations

- `conforme`
- `surveillance`
- `critique`
- `inconnu`

## KPI dérivés sous-bassins

- `risk_score`
- `critical_count`
- `surveillance_count`
- `freshness_score`

## KPI dérivés pollution

- `active_sites`
- `top_sites`
- `reachable_stations`
- `reachable_barrages`
- `distance_to_garde_km`
