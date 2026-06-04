# Architecture KPI Engine

## Objectif

Centraliser les KPI décisionnels dans une couche backend réutilisable par :

- Accueil SAD
- Carte Métier
- Qualité des Eaux
- Pollution

## Composants créés

- `backend/app/services/kpi/engine.py`
- `backend/app/api/v1/kpi.py`

## Endpoints exposés

### `GET /api/v1/kpi/overview`

Retourne :

- `iqgb`
- `ifd`
- `icd`
- `ich`
- `ipp`
- `isr`

### `GET /api/v1/kpi/stations`

Retourne :

- comptage `conforme`
- comptage `surveillance`
- comptage `critique`
- comptage `inconnu`
- top stations

### `GET /api/v1/kpi/subbasins`

Retourne :

- liste ordonnée des sous-bassins à risque
- score de risque
- synthèse qualité / fraîcheur

### `GET /api/v1/kpi/pollution`

Retourne :

- `ipp`
- nombre de sites actifs
- top sites priorisés

## Sources exploitées

### Qualité

- `qualite.mesure_qualite_riviere`
- `api.v_station_dimension`
- moteur existant `regulatory_quality.py`

### Pollution

- `api.v_pollution_sites`
- `api.v_pollution_latest_results`
- endpoints propagation MVP existants

### Hydraulique

- résultats validés seulement
- aucun recalcul topologique ou hydraulique

## Règles de calcul

### `IQGB`

- agrégat bassin basé sur la répartition des stations par statut
- pénalise les stations critiques et la dégradation de fraîcheur

### `IFD`

- agrégat de fraîcheur basé sur les dates utiles de mesures station

### `ICD`

- agrégat de confiance basé sur la classifiabilité et la présence d'information exploitable

### `ICH`

- score lecture seule basé sur l'état validé du réseau
- ne recalcule pas l'hydraulique

### `IPP`

- score MVP topologique non scientifique
- combine :
  - sévérité pollution
  - confiance de snap
  - distance aval
  - actifs sensibles atteignables

### `ISR`

- score de risque par sous-bassin
- combine :
  - criticité qualité
  - surveillance
  - fraîcheur données

## Architecture logique

```text
DB métier + vues api
        |
        v
KpiEngine
  - quality aggregation
  - station classification
  - subbasin scoring
  - pollution pressure scoring
        |
        v
/api/v1/kpi/*
        |
        v
Accueil SAD / Carte Métier / Qualité / Pollution
```

## Choix techniques

- réutilisation du moteur réglementaire qualité existant
- consommation interne du service propagation déjà validé
- cache mémoire court pour éviter des recalculs coûteux à chaque hit
- aucune dépendance SWAT/WASP

## Limites

- `IPP` reste explicitement non scientifique
- les KPI sont industrialisés métier, pas encore historisés comme séries temporelles versionnées
- le périmètre température eau / air n'est pas utilisé ici pour éviter toute confusion de sens métier
