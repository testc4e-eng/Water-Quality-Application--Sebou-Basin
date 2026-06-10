# Modifications Techniques (Phase 4)

## Côté Backend

### 1. `backend/app/services/map_business_service.py`
- Modification de la structure de configuration `MapSupportConfig` pour la clé `stations_qualite`.
- Substitution de la source brute `infra.stations_mesure` par la vue analytique métier `api.v_station_dimension`.
- Redéfinition de l'`id_column` à `station_id::text` et `name_column` à `station_nom`.
- Ajout du paramètre `extra_columns` pour récupérer les champs obligatoires du popup : `"code_station", "type_station", "bassin_nom", "sous_bassin_nom", "commune_fr", "province_fr"`.
- Ces champs sont nativement redistribués par la fonction `_enrich_entity_properties` dans l'API map en direction du composant frontend `BusinessPopup`.

### 2. `backend/app/services/dashboard/runtime_service.py` & `home_service.py`
- Implémentation du service `runtime_service.py` permettant de calculer de façon robuste les agrégats de la Home page (indicateurs, KPI, stations avec séries temporelles) à partir des tables sources (`qualite.mesure_qualite_sebou`, `hydro.mesure_debit`, `meteo.mesure_precipitation`).
- Finalisation de `list_quality_stations_with_timeseries()` exposé via `/api/v1/quality/stations-with-timeseries`.

## Côté Frontend

### 1. `frontend/src/api/dashboardRuntime.ts`
- Création du nouveau contrat API pour piloter les requêtes vers les endpoints temps réel du backend (`/dashboard/trends`, `/quality/stations-with-timeseries`).

### 2. `frontend/src/pages/DashboardHomeV2.tsx`
- Refonte de la structure du `DashboardHomeV2` pour s'interconnecter avec le `payload` fourni par l'API (via `useDashboardHome`).
- Les cards de "Résumé" ont été retravaillées (utilisation de `HomeSummaryCard` et `HomeSignalCard`) pour refléter les informations extraites de la vraie base de données (conformité, indice de pression, fraîcheur QA) plutôt que des textes statiques ou codés en dur.
- Le bandeau de "Confiance des données" appelle désormais un composant `GaugeRing` enrichi avec un tooltip `KpiTooltip` pointant sur les définitions métier officielles (IFD, ICD, ICH).

## Pipeline & Déploiement
- Correction des problèmes d'accès identifiés en environnement Dockerisé (`pg_hba.conf`) confirmant que le backend est bien en mesure de requêter la base `abh_sad` (utilisateur `postgres`, port standard).
- Commit global actant l'unification des modifications Frontend + Backend non versionnées : `feat(Phase 4): Integration of real data into map business and dashboards`.
