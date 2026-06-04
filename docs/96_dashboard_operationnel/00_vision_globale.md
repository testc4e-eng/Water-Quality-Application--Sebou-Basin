# Dashboard opérationnel SAD Sebou — Vision globale

## Contexte

Le SAD ne doit plus être pensé comme :

- un navigateur de couches ;
- un catalogue de référentiels ;
- un agrégateur de campagnes historiques ;
- une simple vitrine de dashboards techniques.

Le SAD doit devenir un **centre de supervision opérationnelle du bassin du Sebou**.

## Principe directeur

L'écran d'accueil doit être structuré autour des données qui vivent réellement au quotidien.

## Noyau opérationnel observé en base

### Disponible aujourd'hui

#### Barrages

Sources réelles observées :

- `hydro.mesure_barrage_param`
- `api.v_hydro_barrage_param_journalier`
- `api.v_barrage_dimension`

Constat :

- historique jusqu'au `2025-09-01`
- `10` barrages avec `apport`
- `10` barrages avec `niveau_barrage`
- `9` barrages avec `lacher_barrage`
- `1` barrage avec `transfert`

#### Stations hydrologiques

Sources réelles observées :

- `hydro.mesure_debit`
- `api.v_hydro_debit_journalier_qa`
- `api.v_station_dimension`

Constat :

- historique jusqu'au `2025-08-31`
- `38` stations avec historique débit
- seulement `7` stations présentes sur le dernier jour observé dans la vue QA

#### Stations pluviométriques

Sources réelles observées :

- `meteo.mesure_precipitation`
- `api.v_meteo_precipitation_journalier_qa`
- `api.v_station_dimension`

Constat :

- historique jusqu'au `2024-08-31`
- `47` stations avec historique précipitation
- incohérence de typologie dans la vue QA :
  - `40` stations typées `hydrologique`
  - `5` stations typées `pluviometrique`
  - `2` stations typées `barrage`

Conséquence :

- le dashboard peut afficher la pluie opérationnelle ;
- mais la **typologie station pluie** doit être consolidée avant d'en faire un indicateur métier strict.

#### Qualité journalière

Sources réelles observées :

- `qualite.mesure_qualite_sebou`
- `api.v_qualite_terrain`

Constat :

- `6` stations avec historique quotidien
- fraîcheur observée jusqu'au `2026-01-06`
- c'est la meilleure base réelle pour un bloc qualité opérationnelle du home

### Non central pour l'accueil

- `qualite.mesure_qualite_riviere` pour les analyses réglementaires globales
- campagnes ponctuelles
- inventaires pollution
- référentiels
- séries legacy SWAT/WASP
- analyses d'étude

Ces données restent utiles, mais dans :

- `Qualité des Eaux`
- `Pollution`
- `Analyses`
- `Expert`

## Conclusion

La bonne approche n'est pas de refaire un design autour des KPI techniques actuels.

La bonne approche est de définir un **modèle opérationnel de supervision** fondé sur quatre familles :

1. barrages ;
2. hydro ;
3. pluvio ;
4. qualité journalière.

Le dashboard d'accueil cible doit donc :

- mettre la carte métier au centre ;
- afficher un état quotidien synthétique ;
- exposer les alertes opérationnelles immédiatement ;
- réserver l'historique, les référentiels et les couches spécialisées aux modules secondaires.
