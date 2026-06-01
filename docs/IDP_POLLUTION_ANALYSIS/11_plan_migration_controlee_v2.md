# Plan de migration contrôlée V2 - IDP pollution

## Positionnement

Ce plan prépare la pré-migration. Il ne doit pas être exécuté avant validation métier, validation DBA et feu vert projet.

## 1. Import brut vers `staging`

- Importer chaque SHP dans une table `staging.raw_*`.
- Utiliser `ogr2ogr` ou un pipeline Python/GDAL reproductible.
- Ne pas renommer les champs originaux dans les tables brutes.
- Ne pas filtrer, dédupliquer ou transformer les valeurs au moment de l'import.

Tables brutes :

- `staging.raw_idp_src_pollution_globale`
- `staging.raw_idp_src_pollution_marche_cadre`
- `staging.raw_idp_mesures_qualite_marche_cadre_2024`
- `staging.raw_idp_mesures_qualite_globale_2024`

## 2. Métadonnées d'import

Ajouter aux tables brutes :

| Champ | Rôle |
|---|---|
| `source_layer` | Nom de la couche SHP |
| `source_file` | Chemin ou nom du fichier source |
| `source_feature_id` | Identifiant technique stable issu de la ligne source |
| `import_batch_id` | UUID du lot d'import |
| `imported_at` | Horodatage d'import |
| `source_hash` | Hash des composants sources si disponible |
| `geom_original` | Géométrie telle qu'importée en `EPSG:26191` |
| `geom_4326` | Géométrie transformée pour API/web |

## 3. Normalisation dans tables de travail

Créer des tables ou vues de travail non exposées :

- normalisation douce des libellés ;
- extraction des coordonnées ;
- standardisation dates/heures ;
- mapping provisoire communes ;
- préparation des paramètres qualité ;
- flags QA initiaux.

Le brut reste inchangé.

## 4. Référentiels `metadata`

Créer ou alimenter après arbitrage :

- `metadata.ref_type_source_pollution`
- `metadata.ref_categorie_pollution`
- `metadata.ref_parametre_qualite`
- `metadata.ref_unite`

Règle : aucune valeur ambiguë ne devient référentiel actif sans décision.

## 5. Pivot format large → format long

Les champs analytiques détectés dans les couches mesures doivent être transformés en lignes :

| Source large | Cible long format |
|---|---|
| une ligne point + paramètre/valeur | `qualite.resultat_mesure` |
| code/libellé paramètre | `parameter_id` |
| valeur brute | `raw_value` |
| valeur numérique si convertible | `value_numeric` |
| valeur texte sinon | `value_text` |
| unité validée | `unit_id` |

La conversion doit produire des flags :

- `PARAM_UNMAPPED`
- `UNIT_UNMAPPED`
- `VALUE_NON_NUMERIC`
- `DATE_INVALID`
- `GEOMETRY_MISSING`

## 6. Matching inventaire / mesures

Ordre de traitement :

1. ID exact.
2. Coordonnées exactes.
3. Distance <= 10 m.
4. Nom normalisé + commune.
5. Distance <= 25 m.
6. Arbitrage manuel.

Le résultat alimente une table d'arbitrage, jamais directement les tables métier.

## 7. Arbitrage

La table d'arbitrage décide :

- correspondance validée ou rejetée ;
- conservation séparée ;
- site consolidé cible ;
- statut de conflit ;
- commentaire métier.

Toute ligne sans décision reste `PENDING_REVIEW` ou `CONFLICT_TO_RESOLVE`.

## 8. Chargement métier

Après validation :

- charger `pollution.site_pollution` depuis les sites consolidés ;
- charger `pollution.site_pollution_source` pour conserver toutes les sources ;
- charger `qualite.campagne_mesure` ;
- charger `qualite.point_mesure`, avec `site_id` nullable si non rattaché ;
- charger `qualite.resultat_mesure` en format long ;
- charger `qa.qa_anomalie_pollution` pour les anomalies non résolues.

## 9. Vues `api`

Créer des vues contrôlées :

- points IDP consolidés ;
- points non résolus ;
- résultats qualité IDP ;
- anomalies et doublons candidats ;
- exposition GeoJSON légère.

Règle : FastAPI consomme `api.*`, pas `staging.*`.

## 10. Vues `analytics`

Préparer des agrégations :

- nombre de sites par commune/type/statut ;
- mesures par campagne/paramètre/statut QA ;
- anomalies par catégorie ;
- couverture matching inventaire ↔ mesures.

## 11. Rollback

Avant exécution réelle :

- créer un `import_batch_id` unique ;
- journaliser toutes les insertions ;
- éviter les `UPDATE` destructifs ;
- prévoir suppression contrôlée par `import_batch_id` uniquement sur tables chargées par le batch ;
- ne jamais supprimer `staging.raw_*` sans archive.

## 12. Contrôles QA

Contrôles obligatoires :

- nombre de lignes source vs staging ;
- nombre de géométries nulles ;
- SRID des géométries ;
- nombre de paramètres non mappés ;
- valeurs non numériques ;
- mesures sans point ;
- points sans site ;
- doublons exacts et proches restants ;
- cohérence `source_layer/source_feature_id`.

## Go / No-Go

Passage en migration réelle seulement si :

- CRS validé `EPSG:26191` ;
- arbitrage initial validé ;
- référentiels minimaux disponibles ;
- stratégie `globale` / `marche_cadre` tranchée ;
- scripts SQL revus par DBA ;
- plan de rollback validé.
