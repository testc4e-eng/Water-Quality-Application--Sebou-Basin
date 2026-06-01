# Plan d'arbitrage métier - IDP pollution

## Objectif

Ce plan encadre la validation métier des doublons, correspondances et rapprochements inventaire ↔ mesures avant toute pré-migration PostGIS. Il ne déclenche aucun import, aucune fusion et aucune suppression.

## Décisions métier à valider

| Décision | Question | Impact |
|---|---|---|
| Périmètre `globale` / `marche_cadre` | Faut-il conserver deux campagnes distinctes ou produire une consolidation ? | Détermine `campagne_mesure`, dédoublonnage et vues analytiques |
| Clé site officielle | Quel identifiant fait foi : `id_pts`, `id_table`, coordonnées, nom + commune, autre ? | Conditionne `site_pollution.source_feature_id` et les contraintes uniques |
| Site vs mesure | Un point mesuré est-il toujours un site de pollution ? | Conditionne la nullabilité et le taux de rattachement de `qualite.point_mesure.site_id` |
| Typologie pollution | Quelles valeurs deviennent référentiel validé des types de sources ? | Alimente `metadata.ref_type_source_pollution` |
| Paramètres qualité | Quels champs/valeurs sont des paramètres analytiques à pivoter en format long ? | Alimente `metadata.ref_parametre_qualite` et `qualite.resultat_mesure` |
| Unités | Quelle unité canonique par paramètre ? | Évite des mesures non comparables |
| Coordonnées nulles | Les lignes sans coordonnées sont-elles conservées, géocodées, exclues ou mises en quarantaine ? | Conditionne `qa.qa_anomalie_pollution` et le statut `UNMATCHED` |

## Stratégie de validation des doublons exacts

Un doublon exact est une paire de lignes partageant les mêmes coordonnées X/Y dans le CRS `EPSG:26191`.

Règles proposées :

| Cas | Statut recommandé | Action |
|---|---|---|
| Même couche, même point, paramètres différents | `SAME_SITE_DIFFERENT_PARAMETER` | Conserver un point, charger plusieurs résultats qualité |
| Couche inventaire vs mesure, même point | `INVENTORY_TO_MEASURE_MATCH` | Rattacher `point_mesure.site_id` après validation |
| Deux couches inventaire, même point et même libellé | `DUPLICATE_EXACT_TO_MERGE_CANDIDATE` | Proposer consolidation, jamais automatique |
| Même point mais communes/types divergents | `TO_VALIDATE_CONFLICT` | Arbitrage métier obligatoire |
| Géométrie identique avec source différente | `SAME_SITE_DIFFERENT_SOURCE` | Conserver traçabilité multi-source |

## Stratégie de validation des doublons proches

Seuils produits : 5 m, 10 m, 25 m.

| Seuil | Usage recommandé | Niveau de confiance |
|---|---|---|
| `<= 5 m` | Fort candidat même site | Élevé si nom/commune cohérents |
| `<= 10 m` | Candidat prioritaire de rapprochement | Moyen à élevé |
| `<= 25 m` | Candidat SIG à contrôler | Moyen, arbitrage requis |

Règles proposées :

- Ne pas fusionner automatiquement un doublon proche.
- Exiger au moins un attribut métier cohérent : nom, commune, type, code ou campagne.
- Classer en conflit si la commune ou le type source diverge.
- Conserver la distance en mètres dans la table d'arbitrage.

## Stratégie de matching inventaire ↔ mesures

Niveaux de matching proposés :

| Niveau | Méthode | Score initial | Statut recommandé |
|---|---|---:|---|
| 1 | ID exact | 1.00 | `AUTO_CANDIDATE` |
| 2 | Coordonnées exactes | 0.98 | `AUTO_CANDIDATE` |
| 3 | Distance <= 10 m | 0.90 | `AUTO_CANDIDATE` si commune cohérente |
| 4 | Nom normalisé + commune | 0.82 | `TO_VALIDATE` |
| 5 | Distance <= 25 m | 0.72 | `TO_VALIDATE` |
| 6 | Arbitrage manuel | selon décision | `VALIDATED` ou `REJECTED` |

## Règles de décision

| Condition | Décision proposée |
|---|---|
| Score >= 0.95 et commune cohérente | `VALIDATE_MATCH` après revue rapide |
| Score 0.80-0.94 | `REVIEW_REQUIRED` |
| Distance <= 10 m mais noms divergents | `REVIEW_REQUIRED` |
| Commune divergente | `CONFLICT_TO_RESOLVE` |
| Géométrie nulle sur une ligne | `GEOMETRY_MISSING` |
| Plusieurs mesures pour un même site | `KEEP_MULTIPLE_MEASUREMENTS` |
| Même site, sources différentes | `KEEP_TRACEABILITY_MULTI_SOURCE` |

## Statuts proposés

| Statut | Signification |
|---|---|
| `PENDING_REVIEW` | Candidat généré, non arbitré |
| `VALIDATED_MATCH` | Correspondance validée |
| `REJECTED_MATCH` | Correspondance rejetée |
| `VALIDATED_DISTINCT` | Sites proches mais distincts |
| `MERGE_CANDIDATE` | Fusion métier possible, non appliquée |
| `KEEP_SEPARATE` | Conservation explicite de deux enregistrements |
| `CONFLICT_TO_RESOLVE` | Incohérence bloquante |
| `GEOMETRY_MISSING` | Coordonnée/géométrie absente |
| `OUT_OF_SCOPE` | Ligne hors périmètre de migration |

## Champs minimaux d'une table d'arbitrage

| Champ | Rôle |
|---|---|
| `arbitrage_id` | Identifiant de la décision |
| `anomaly_type` | Type de candidat : doublon exact, proche, matching |
| `source_layer_a`, `source_feature_id_a` | Première ligne source |
| `source_layer_b`, `source_feature_id_b` | Deuxième ligne source |
| `match_method` | Méthode ayant produit le candidat |
| `match_score` | Score proposé |
| `distance_m` | Distance en mètres si applicable |
| `site_name_a`, `site_name_b` | Libellés comparés |
| `commune_a`, `commune_b` | Communes comparées |
| `recommended_status` | Statut automatique recommandé |
| `business_decision` | Décision métier validée |
| `validated_site_id` | Identifiant site consolidé cible si validé |
| `validated_by`, `validated_at` | Traçabilité humaine |
| `comments` | Justification et contexte |

## Sorties attendues avant pré-migration

- `arbitrage_template.csv` complété par l'équipe métier/Data.
- Référentiel provisoire des types de sources.
- Liste des paramètres qualité à pivoter en format long.
- Décision formelle sur la relation `globale` / `marche_cadre`.
