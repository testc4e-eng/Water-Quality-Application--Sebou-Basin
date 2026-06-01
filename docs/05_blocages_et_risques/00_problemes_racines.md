# Problèmes racines SAD/WQDSS

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | document maître |
| Source de vérité | Oui, pour la lecture des blocages racines |
| Snapshot | audit documentaire + BD du 2026-05-22 |

## Catégories

| Catégorie | Signification |
|---|---|
| `ANOMALIE` | problème confirmé |
| `AMBIGUITE` | arbitrage requis |
| `DONNEE_ABSENTE` | source non fournie ou vide |
| `FUTURE_DONNEE` | dépend pipeline futur |
| `EXPERIMENTAL` | DEV/sandbox non officiel |
| `STABILISE` | utilisable officiellement dans le périmètre |

## Bloc 1 - Divergence documentation / BD réelle

| Élément | Valeur |
|---|---|
| Catégorie | `ANOMALIE` |
| Niveau | Critique |
| Fait | 579 objets référencés absents des schémas inspectés, en grande partie historiques/propositionnels |
| Impact | agents IA, API, scripts, faux contrats |
| Décision | qualifier chaque référence comme active, legacy, proposée ou supprimée |

## Bloc 2 - Références legacy `public.*`

| Élément | Valeur |
|---|---|
| Catégorie | `ANOMALIE` |
| Niveau | Critique |
| Impact | routeurs legacy, docs historiques, confusion production |
| Décision | ne plus traiter `public.*` comme production sauf preuve DB actuelle |

## Bloc 3 - Paramètres et référentiels non totalement figés

| Élément | Valeur |
|---|---|
| Catégorie | `AMBIGUITE` |
| Niveau | Critique |
| Impact | qualité, API, dashboards, ingestion, réglementation |
| Décision | finaliser dictionnaire paramètres/alias/unités, préserver `MO` vs `Mo` |

## Bloc 4 - Pollution IDP préproduction bloquée

| Élément | Valeur |
|---|---|
| Catégorie | `AMBIGUITE` |
| Niveau | Critique |
| Impact | dashboard pollution, API map, qualité IDP |
| Faits | `geo.ref_site_pollution` = 1951, `qualite.resultat_mesure` = 1409 |
| Décision | arbitrer doublons, orphelins, conflits multi-sources et liens source -> site |

## Bloc 5 - Données absentes ou incomplètes

| Élément | Valeur |
|---|---|
| Catégorie | `DONNEE_ABSENTE` |
| Niveau | Majeur |
| Exemple | `meteo.mesure_temperature` = 0 |
| Décision | afficher comme non fourni, pas comme zéro métier |

## Bloc 6 - Pipelines DEV vs production

| Élément | Valeur |
|---|---|
| Catégorie | `EXPERIMENTAL` |
| Niveau | Majeur |
| Impact | SQL proposés, dry-runs, ingestion, IDP, topologie |
| Décision | marquer chaque pipeline `PROPOSE`, `EXECUTE_DEV`, `HOLD`, `PROD` |

## Bloc 7 - SWAT/WASP non officiels

| Élément | Valeur |
|---|---|
| Catégorie | `EXPERIMENTAL` |
| Niveau | Critique |
| Impact | scénarios, prédiction, décisionnel |
| Décision | garder sandbox jusqu'à validation Reda/Anas |

