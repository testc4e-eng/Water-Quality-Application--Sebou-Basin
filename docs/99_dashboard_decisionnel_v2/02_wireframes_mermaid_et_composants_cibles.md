# Wireframes Mermaid et composants cibles

## Wireframe global

```mermaid
flowchart TD
    A["Header décisionnel"] --> B["Bandeau alertes / fraîcheur"]
    B --> C["Carte opérationnelle"]
    C --> D["KPIs critiques"]
    D --> E["Timeline / période"]
    E --> F["Tableau détaillé"]
    E --> G["Graphique tendance"]
```

## Wireframe analyste

```mermaid
flowchart LR
    A["Domaine"] --> B["Sous-domaine"]
    B --> C["Paramètre"]
    C --> D["Support"]
    D --> E["Période intelligente"]
    E --> F["Afficher"]
    F --> G["Carte"]
    F --> H["Tableau"]
    F --> I["Graphique"]
```

## Composants React cibles

| Composant | Rôle |
|---|---|
| `DecisionExecutiveBanner` | alertes et fraîcheur |
| `DecisionOperationalMap` | carte opérationnelle priorisant le récent |
| `DecisionTimeline` | navigation temporelle intelligente |
| `DecisionSmartPeriodSelector` | préréglages récent / historique / archive |
| `DecisionAnomalyPanel` | anomalies et points critiques |
| `DecisionSupportSwitcher` | bascule multi-support |
| `DecisionTrendPanel` | tendances |
| `DecisionComparisonTable` | détail filtré |

## Règles de densité

- cluster par défaut au-delà d'un seuil configurable ;
- heatmap uniquement pour couches à forte densité et non pour les points critiques individuels ;
- timeline découplée du chargement initial.
