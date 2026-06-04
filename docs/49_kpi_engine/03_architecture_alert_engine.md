# Architecture Alert Engine

## Objectif

Transformer les signaux métier et data en alertes lisibles par la DG et les métiers, sans exposer la complexité technique sous-jacente.

## Composants

- `backend/app/services/alerts/engine.py`
- `GET /api/v1/alerts`

## Types d'alertes

### `QUALITY`

- dépassement ou criticité sur station
- dégradation récente

### `POLLUTION`

- site pollution prioritaire
- propagation topologique à risque

### `DATA`

- station inactive
- données obsolètes
- fraîcheur insuffisante

### `HYDRO`

- lecture interprétative uniquement
- aucun recalcul hydraulique

## Contrat de réponse

```json
[
  {
    "type": "QUALITY",
    "severity": "HIGH",
    "title": "Station critique",
    "description": "Dernière mesure classée critique.",
    "recommendation": "Contrôle terrain recommandé"
  }
]
```

## Filtres exposés

- `type`
- `limit`
- `entity_name`
- `site_id`

## Architecture logique

```text
KpiEngine + propagation MVP + contexte qualité
                |
                v
AlertEngine
  - quality alerts
  - pollution alerts
  - data alerts
  - hydro read-only alerts
                |
                v
/api/v1/alerts
                |
                v
Accueil SAD / Carte Métier / Qualité
```

## Règles de conception

- priorité à la lisibilité métier
- message court, actionnable, non technique
- pas d'exposition de QA, IDs ou batchs dans les écrans DG

## Limites

- l'alerte reste un signal métier d'aide à la décision
- elle ne vaut pas validation scientifique ni arbitrage réglementaire final
