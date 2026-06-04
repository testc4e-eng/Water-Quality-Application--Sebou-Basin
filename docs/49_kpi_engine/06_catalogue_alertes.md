# Catalogue alertes

## `ALERT_QUALITY`

Objectif :

- détecter les stations nécessitant une action qualité

Exemples :

- station critique
- dégradation récente
- tendance défavorable

## `ALERT_POLLUTION`

Objectif :

- mettre en avant les pollutions actives à risque métier

Exemples :

- site avec `IPP` élevé
- propagation aval avec actifs sensibles atteignables
- confiance de snap faible mais site prioritaire

## `ALERT_DATA`

Objectif :

- signaler les zones où la décision est fragilisée par la donnée

Exemples :

- station inactive
- données obsolètes
- fraîcheur trop faible

## `ALERT_HYDRO`

Objectif :

- rappeler un contexte hydrologique utile sans rouvrir la validation hydraulique

Règle :

- lecture seule uniquement

## Attributs exposés

- `type`
- `severity`
- `title`
- `description`
- `recommendation`

## Règle UX DG

- phrase courte
- niveau de gravité explicite
- recommandation immédiatement actionnable
