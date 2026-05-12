# Analyse des valeurs et des types

## Modèle cible

La table `meteo.mesure_precipitation` stocke simultanément :

- `val_observees`
- `val_power_nasa`
- `val_remplies`

## Décision métier intégrée

La valeur métier principale pour l'usage applicatif est :

- `DASHBOARD_VALUE = val_remplies`

Cette règle s'applique par défaut à :

- dashboards
- cartes
- graphes temporels
- indicateurs analytiques
- exports métier

## Source traitée

Répartition dans `raw_mesures_precipitations_jr_traitees` :

- total : `546 007`
- avec `val_observees` : `500 305`
- avec `val_power_nasa` : `546 007`
- avec `val_remplies` : `546 007`
- `obs_only` : `0`
- `observee_plus_filled` : `500 305`
- complétés sans observation directe : `45 702`

## Source brute

`raw_mesures_precipitations_jr` ne porte qu’une valeur :

- `precipitation_jr`

Cette valeur correspond à `val_observees` sur les clés communes avec la source traitée.

## Lecture

Le modèle cible est un modèle de **série enrichie** :

- observée
- modèle NASA / POWER
- remplie

## Priorité d'usage des valeurs

### Valeur par défaut

- `val_remplies` = valeur consolidée / complétée métier
- elle peut résulter de `val_observees`, de `val_power_nasa` et d'une logique de corrélation / calage

### Valeurs conservées mais non prioritaires

- `val_observees`
- `val_power_nasa`

Ces deux valeurs doivent être traitées comme :

- valeurs sources
- valeurs d'audit / traçabilité
- valeurs techniques archivées
- visibles uniquement dans les écrans de détail avancé ou QA

## Règles d'affichage proposées

- valeur affichée par défaut : `val_remplies`
- valeurs consultables en détail : `val_observees`, `val_power_nasa`
- ajouter un flag quand `val_observees` est `NULL` et que `val_remplies` est calculée
- ajouter un flag quand l'écart entre `val_observees` et `val_power_nasa` dépasse un seuil QA à fixer métier / data

La source brute n’a pas la même granularité sémantique. Elle ne doit donc pas être injectée dans cette table sans règle métier spécifique.
