# Architecture Recommendation Engine

## Objectif

Transformer KPI et alertes en actions recommandées directement utilisables dans :

- Accueil SAD
- Carte Métier
- Pollution

## Composants

- `backend/app/services/recommendations/engine.py`
- `GET /api/v1/recommendations`

## Logique

Le moteur ne crée pas un nouveau modèle prédictif. Il applique des règles métier explicites à partir de :

- KPI de synthèse
- alertes ouvertes
- criticité qualité
- pression pollution
- fraîcheur données

## Exemples de recommandations

### Qualité

- `Contrôle terrain recommandé`
- `Surveillance rapprochée recommandée`

### Pollution

- `Renforcer la surveillance aval`
- `Déclencher une revue pollution prioritaire`

### Données

- `Campagne de mesure recommandée`
- `Planifier une relance de collecte`

### Barrages / actifs sensibles

- `Vérification préventive recommandée`

## Filtres exposés

- `domain`
- `limit`
- `entity_name`
- `site_id`

## Architecture logique

```text
KpiEngine + AlertEngine
        |
        v
RecommendationEngine
        |
        v
/api/v1/recommendations
        |
        v
Accueil SAD / Carte Métier / Pollution
```

## Principes

- recommandations courtes
- niveau de priorité explicite
- justification explicite
- absence de promesse scientifique

## Limites

- moteur à règles explicites, pas moteur d'optimisation avancé
- dépendance à la qualité des signaux amont
