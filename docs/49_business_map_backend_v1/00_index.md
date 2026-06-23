# Architecture Backend: Dashboard Carte Métier Analytique V1

## 1. Objectif

Ce module implémente le backend V1 de la Carte Métier Analytique, conformément aux spécifications du Sprint 0.
L'API est strictement READ-ONLY, conçue pour les fortes volumétries, et cloisonnée (ne modifie pas les autres dashboards).

## 2. Endpoints

L'API est exposée sous le prefixe `/api/v1/business-map/` :

- `GET /availability` : Retourne la matrice des paramètres disponibles pour chaque support/domaine. Exploite la MV `api.mv_business_map_availability`.
- `GET /features` : Retourne les objets géographiques. Permet le filtrage BBOX obligatoire pour `SOURCE_POLLUTION`. Exploite la MV `api.mv_business_map_features_v1`.
- `GET /series` : Retourne les séries analytiques multi-supports. Implémenté via un registre de fournisseurs (`SeriesProviderRegistry`) évitant les chaînes `if/elif`. Gère l'agrégation `raw`, `daily`, `monthly`, `annual`.
- `GET /object/{support_type}/{object_id}` : Retourne le détail d'un objet et les derniers paramètres mesurés (via `api.mv_business_map_last_values`).
- `GET /layers` : Configuration des couches V1.

## 3. Vues Matérialisées

Créées via `database/migrations/2026_06_business_map_contracts_v0.sql` :
1. `api.mv_business_map_availability`
2. `api.mv_barrage_dimension_enriched`
3. `api.mv_business_map_features_v1`
4. `api.mv_business_map_last_values`

**Note sur le rafraîchissement** : Ces vues doivent être rafraîchies via `REFRESH MATERIALIZED VIEW CONCURRENTLY` orchestré par les batchs de nuit (Airflow/pg_cron). Aucune route API n'a été créée pour cela.

## 4. Sécurité

Actuellement, l'API V1 limite nativement les requêtes au périmètre de Sebou (`authorized_basin = 'Sebou'`). Ce filtre devra être remplacé par les données issues du token JWT dans la V2 (RBAC bassin).
