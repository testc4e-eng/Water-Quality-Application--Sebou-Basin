# Plan de Migration - Base de Données SAD ABHS

Ce document décrit la stratégie recommandée pour migrer les "anciens" historiques de données hydrologiques, géospatiales et descriptives du schéma `public` vers la nouvelle structure découpée en 10 schémas.

## 1. Principes Fondamentaux de Migration
- **Maintien de l'intégrité** : Aucun orphelin autorisé, chaque dépendance clé étrangère (FK) doit être satisfaite.
- **Correspondance (Mapping)** : Chaque ancienne table sera associée à sa/ses nouvelles tables cibles de façon documentée.
- **Conversion Géospatiale** : Transformation systématique des coordonnées historiques (textuelles, Lambert, etc.) en géométries PostGIS propres certifiées (`SRID: 4326` WGS84).

## 2. Processus de Migration en 4 Étapes

### Étape 1 : Audit et Nettoyage des Données Sources (Existant)
1. **Identification structurelle** : Analyser les 43 tables de production pour lister les cardinalités atypiques et valeurs isolées.
2. **Nettoyage préventif** : Supprimer les doublons techniques, et remplir/gérer les valeurs `NULL` illégitimes.
3. **Check spatial** : Vérifier que tous les objets spatiaux de la table `spatial_ref_sys` ont une emprise valide sur la région du Sebou.

### Étape 2 : Chargement des Référentiels (Schémas `admin`, `geo`, `infra`)
L'ordre d'importation est crucial afin de respecter les contraintes de clés étrangères.
1. `admin.region`, `admin.province`, `admin.commune`.
2. `admin.organisme`, `admin.catalogue_parametre`.
3. `geo.bassin_versant` -> `geo.sous_bassin` -> `geo.cours_eau`.
4. `infra.station_mesure`, `infra.barrage` etc.

*Exemple de script SQL de migration pour injecter les stations (de `public._abhs_stations` vers `infra.station_mesure`) :*

```sql
INSERT INTO infra.station_mesure (id, code_station, nom, type_station, geom)
SELECT 
    uuid_generate_v4(), -- Nouvelle génération d'identifiant décentralisé (UUID)
    code_existant, 
    nom_station, 
    'Hydrologique', 
    ST_Transform(ST_SetSRID(ST_MakePoint(x_lambert, y_lambert), 26191), 4326) -- Transcodage Lambert Maroc -> WGS84
FROM public._abhs_stations;
```

### Étape 3 : Migration des Séries Temporelles (Schémas `hydro`, `meteo`, `qualite`)
Le volume de données est ici massif (millions de lignes d'historique).
1. Générer une **table de correspondance temporaire** (`mapping_stations`) entre les anciens ID entiers (`id_station`) et les nouveaux `UUID`.
2. Insérer les données historiques par lots successifs (batch insert, ex: mois par mois) pour éviter de saturer le journal de transactions (WAL) de PostgreSQL.

```sql
INSERT INTO hydro.mesure_debit (temps, station_id, valeur, est_valide)
SELECT 
    old.date_mesure, 
    map.nouvel_id_uuid, 
    old.valeur_debit,
    true -- Donnée historique assumée validée
FROM public._abhs_mesures_hydro old
JOIN mapping_stations map ON old.id_station = map.ancien_id;
```

### Étape 4 : Tests de Validation (Recette technique)
1. **Validation quantitative** : Comparer le nombre total de lignes entre l'ancien schéma et les nouveaux schémas (Le `COUNT(*)` doit correspondre).
2. **Validation qualitative** : Exécuter des requêtes métiers structurantes (ex: Moyenne de débit de la station ST_MDEZ_01 sur 2023) à la fois sur l'ancien et le nouveau système. Les résultats doivent être strictement homologues.
