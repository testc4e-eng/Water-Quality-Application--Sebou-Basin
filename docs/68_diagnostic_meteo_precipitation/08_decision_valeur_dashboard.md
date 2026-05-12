# Décision métier — valeur dashboard precipitation

## Décision validée

Pour `meteo.mesure_precipitation`, la valeur métier principale est :

- `DASHBOARD_VALUE = val_remplies`

## Portée

Cette valeur doit être utilisée par défaut dans :

- dashboards
- cartes
- graphes temporels
- indicateurs analytiques
- exports métier

## Interprétation métier

`val_remplies` représente la valeur consolidée / complétée, issue de :

- `val_observees`
- `val_power_nasa`
- corrélation / calage avec les valeurs observées

## Valeurs conservées en archive technique

Les colonnes suivantes restent conservées mais ne sont pas prioritaires :

- `val_observees`
- `val_power_nasa`

Elles doivent être considérées comme :

- valeurs sources
- valeurs d'audit / traçabilité
- valeurs techniques archivées

## Règles d'affichage

- valeur affichée par défaut : `val_remplies`
- valeurs consultables en détail avancé / QA : `val_observees`, `val_power_nasa`
- flag à afficher si `val_observees` est `NULL` et `val_remplies` est calculée
- flag à afficher si l'écart entre `val_observees` et `val_power_nasa` est important

## Impact migration

- aucune migration supplémentaire requise pour `meteo.mesure_precipitation`
- la table reste considérée comme `METEO_PRECIPITATION_READY`
- `staging.raw_mesures_precipitations_jr` reste un backlog séparé, hors migration de cette table cible
