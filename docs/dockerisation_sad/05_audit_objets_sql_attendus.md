# Audit des objets SQL attendus par le backend

## Contexte

- Audit read-only realise sur le code backend FastAPI.
- Documentation de reference consultee avant analyse :
  - `docs/README.md`
  - `docs/01_project_reference/*`
  - `docs/03_ai_knowledge_base/DATABASE_SCHEMA_SUMMARY.md`
  - `docs/03_ai_knowledge_base/api_for_agents.md`
  - `docs/03_ai_knowledge_base/architecture_for_agents.md`
- Ecart majeur constate :
  - la documentation maitre decrit une base `abh_sad` riche, avec schemas `api`, `infra`, `hydro`, `qualite`, `metadata`, `analytics`, `geo`, `wasp_output`, `swat_output`
  - la base Docker actuelle est une base PostGIS vide sans ces schemas applicatifs

## Synthese

Les erreurs 500 restantes ne viennent plus du runtime Python ou Docker. Elles viennent principalement de trois familles d'objets SQL absents dans la base Docker :

1. Vues API metier attendues dans `api.*`
2. Tables metier attendues dans `infra.*`, `hydro.*`, `meteo.*`, `qualite.*`
3. Vues de catalogue et dashboards attendues dans `metadata.*` et `analytics.*`

Le backend melange aussi deux generations de contrats :

- contrats cibles aligns avec la documentation :
  - `api.v_station_dimension`
  - `api.v_barrage_dimension`
  - `api.v_pollution_sites`
  - `api.v_hierarchie_metier_listing`
  - `analytics.mv_dashboard_*`
- contrats legacy ou dettes techniques encore exposes :
  - `infra.barrages`
  - `qualite.mesure_qualite_riviere`
  - certaines recherches fallback sur `public.*`

## Objets SQL references par famille de routes

### Schemas references

- `api`
- `analytics`
- `geo`
- `hydro`
- `infra`
- `metadata`
- `meteo`
- `public`
- `qualite`
- `swat_output`
- `wasp_output`

### Objets `api.*` references

- `api.v_barrage_dimension`
- `api.v_bassin_geojson`
- `api.v_hierarchie_metier_listing`
- `api.v_hydro_barrage_param_journalier`
- `api.v_hydro_debit_mensuel`
- `api.v_infra_fosses_septiques_geojson`
- `api.v_inventaire_pollution_decharges_sauvages`
- `api.v_inventaire_pollution_huileries_detail`
- `api.v_inventaire_pollution_mines_decharges_detail`
- `api.v_inventaire_pollution_rejets_domestiques_detail`
- `api.v_inventaire_pollution_steps_industrielles_detail`
- `api.v_meteo_evaporation_journalier_qa`
- `api.v_meteo_precipitation_journalier_qa`
- `api.v_meteo_temperature_journalier`
- `api.v_points_eau`
- `api.v_pollution_latest_results`
- `api.v_pollution_sites`
- `api.v_profils_stations`
- `api.v_sous_bassin_geojson`
- `api.v_station_dimension`
- `api.v_step_industrielles`
- `api.v_stm`

### Objets `metadata.*` references

- `metadata.mv_obs_parametre_compat`
  - remarque : le code observe surtout `metadata.mv_obs_parametre_entite_compat`; la documentation doit rester precise sur ce nom
- `metadata.mv_obs_parametre_entite_compat`
- `metadata.mv_obs_parametre_coverage`
- `metadata.mv_obs_referentiel_parametre`
- `metadata.obs_parametre_entite_compat`
- `metadata.obs_parametre_coverage`
- `metadata.obs_referentiel_parametre`
- `metadata.popup_rules_config`
- `metadata.mapping_parametre_source`
- `metadata.referentiel_parametre`
- `metadata.qualite_source_reglementaire`
- `metadata.qualite_type_eau`
- `metadata.qualite_classe_reglementaire`
- `metadata.qualite_parametre_reglementaire`
- `metadata.qualite_mapping_canonique_reglementaire`
- `metadata.qualite_seuil_reglementaire`
- `metadata.qualite_regle_classification`
- `metadata.mv_refresh_status`

### Objets `analytics.*` references

- `analytics.mv_dashboard_climat_meteo_menu`
- `analytics.mv_dashboard_hydrologie_menu`
- `analytics.mv_dashboard_pollution_menu`

### Objets metier tables references

- `infra.barrages`
- `infra.stations_mesure`
- `infra.step_industrielle`
- `infra.rejet_industriel`
- `infra.rejet_domestique`
- `hydro.mesure_barrage_param`
- `hydro.mesure_debit`
- `hydro.mesure_debit_mensuel`
- `hydro.mesure_debit_source`
- `meteo.mesure_evaporation`
- `meteo.mesure_precipitation`
- `meteo.mesure_temperature`
- `qualite.mesure_qualite_barrage`
- `qualite.mesure_qualite_nappe`
- `qualite.mesure_qualite_riviere`
- `qualite.mesure_qualite_sebou`
- `wasp_output.mesure_qualite_segment_ts`
- `swat_output.mesure_qualite_subbasin_ts`

## Routes API et objets attendus

Le tableau ci-dessous se concentre sur les routes effectivement montrees dans `openapi.json`, les routes testees, et les routes ayant un impact direct sur la dockerisation simple. Les routes purement statiques ou d'authentification ne sont pas detaillees ici.

| Route API | Fichier backend | Objet SQL attendu | Type objet | Statut dans Docker | Impact |
|---|---|---|---|---|---|
| `GET /api/v1/stations` | `backend/app/routers/entities.py` | `api.v_station_dimension` | vue | absent | route simple stations degradee ou vide selon le routeur resolu |
| `GET /api/v1/barrages` | `backend/app/routers/entities.py` | `infra.barrages` | table | absent | 500 confirme |
| `GET /api/v1/geojson/{layer_key}` | `backend/app/api/v1/geojson.py` | `api.v_bassin_geojson`, `api.v_sous_bassin_geojson`, `api.v_station_dimension`, `api.v_barrage_dimension`, `api.v_points_eau`, fallback `geo.*` | vues/tables | absents | 404 ou 500 selon la couche |
| `GET /api/v1/routing/downstream-to-garde` | `backend/app/services/hydrology/routing_service.py` | `api.v_barrage_dimension`, `api.v_station_dimension` et runtime topo `geo_work.*` via config | vues/tables | absents en base Docker simple | risque d'erreur ou mode degrade hors endpoints QA |
| `GET /api/v1/routing/topology-qa` | `backend/app/api/v1/routing.py` | runtime topologique interne | n/a | OK observe | route OK sans donnees metier completes |
| `GET /api/v1/map/catalog` | `backend/app/api/v1/map.py` | aucun | n/a | n/a | OK observe |
| `GET /api/v1/map/entities` | `backend/app/services/map_business_service.py` | `api.v_pollution_sites`, `api.v_barrage_dimension`, `api.v_station_dimension`, `api.v_points_eau`, `api.v_step_industrielles`, `api.v_stm` | vues | absentes | risque 500 ou resultats vides selon filtre |
| `GET /api/v1/map/latest-values` | `backend/app/services/map_business_service.py` | `api.v_pollution_latest_results` + vues de support | vues | absentes | route partielle ou 500 selon support |
| `GET /api/v1/pollution/sites.geojson` | `backend/app/api/v1/pollution.py` | `api.v_pollution_sites`, `api.v_pollution_latest_results` | vues | absentes | 500 confirme |
| `GET /api/v1/pollution/latest-results` | `backend/app/api/v1/pollution.py` | `api.v_pollution_latest_results` | vue | absente | 500 probable |
| `GET /api/v1/quality/stations` | `backend/app/routers/quality.py` | `qualite.mesure_qualite_riviere`, `api.v_station_dimension` | table + vue | absentes | 500 confirme |
| `GET /api/v1/quality/parameters` | `backend/app/routers/quality.py` | `qualite.mesure_qualite_riviere` | table | absente | 500 probable |
| `GET /api/v1/quality/timeseries` | `backend/app/routers/quality.py` | `qualite.mesure_qualite_riviere` | table | absente | 500 probable |
| `GET /api/v1/quality/latest` | `backend/app/routers/quality.py` | `qualite.mesure_qualite_riviere`, `api.v_station_dimension` | table + vue | absentes | 500 probable |
| `GET /api/v1/quality/inventory/rows` | `backend/app/routers/quality.py` | `api.v_points_eau`, `api.v_step_industrielles`, `api.v_stm` | vues | absentes | 500 probable |
| `GET /api/v1/quality/thresholds` | `backend/app/routers/quality.py` | `metadata.qualite_*_reglementaire` | tables | absentes | route impossible sans referentiel |
| `POST /api/v1/quality/classify` | `backend/app/routers/quality.py` | `metadata.qualite_*_reglementaire` | tables | absentes | classification impossible |
| `GET /api/v1/qualite/metaux` | `backend/app/repositories/api_views_repository.py` | `api.v_qualite_metaux` | vue | absente | 500 probable |
| `GET /api/v1/qualite/chimie-minerale` | `backend/app/repositories/api_views_repository.py` | `api.v_qualite_chimie_minerale` | vue | absente | 500 probable |
| `GET /api/v1/qualite/physicochimie` | `backend/app/repositories/api_views_repository.py` | `api.v_qualite_physicochimie` | vue | absente | 500 probable |
| `GET /api/v1/qualite/pollution-organique` | `backend/app/repositories/api_views_repository.py` | `api.v_qualite_pollution_organique` | vue | absente | 500 probable |
| `GET /api/v1/observatory/catalog/themes` | `backend/app/routers/observatory.py` | `metadata.mv_obs_referentiel_parametre` ou `metadata.obs_referentiel_parametre` | vue/matview | absents | 500 probable |
| `GET /api/v1/observatory/catalog/parameters` | `backend/app/routers/observatory.py` | `metadata.mv_obs_referentiel_parametre` ou `metadata.obs_referentiel_parametre` | vue/matview | absents | 500 probable |
| `GET /api/v1/observatory/catalog/entities` | `backend/app/routers/observatory.py` | `metadata.mv_obs_parametre_entite_compat`, `metadata.mv_obs_parametre_coverage` ou fallback `metadata.obs_*` | vues/matviews | absents | 500 probable |
| `GET /api/v1/observatory/hierarchy/themes` | `backend/app/routers/observatory.py` | `api.mv_hierarchie_metier_listing` ou `api.v_hierarchie_metier_listing` | vue/matview | absent | 500 confirme |
| `GET /api/v1/observatory/hierarchy/submenus` | `backend/app/routers/observatory.py` | `api.mv_hierarchie_metier_listing` ou `api.v_hierarchie_metier_listing` | vue/matview | absent | 500 probable |
| `GET /api/v1/observatory/hierarchy/parameters` | `backend/app/routers/observatory.py` | `api.mv_hierarchie_metier_listing` ou `api.v_hierarchie_metier_listing` | vue/matview | absent | 500 probable |
| `GET /api/v1/observatory/parameter/latest` | `backend/app/routers/observatory.py` | `api.v_hierarchie_metier_listing` + tables source `hydro/meteo/qualite/wasp_output/swat_output` | vue + tables | absentes | 500 ou vide selon parametre |
| `GET /api/v1/observatory/parameter/entities` | `backend/app/routers/observatory.py` | `api.v_hierarchie_metier_listing`, `api.v_station_dimension`, `api.v_barrage_dimension`, tables source | vues + tables | absentes | 500 probable |
| `GET /api/v1/observatory/barrage/stations` | `backend/app/routers/observatory.py` | `api.v_barrage_dimension` | vue | absente | 500 probable |
| `GET /api/v1/observatory/barrage/timeseries` | `backend/app/routers/observatory.py` | `api.v_hydro_barrage_param_journalier` | vue | absente | 500 probable |
| `GET /api/v1/observatory/temperature/stations` | `backend/app/routers/observatory.py` | `api.v_meteo_temperature_journalier`, `api.v_station_dimension` | vues | absentes | 500 probable |
| `GET /api/v1/analytics/climat-meteo/options` | `backend/app/routers/analytics.py` | `analytics.mv_dashboard_climat_meteo_menu` | vue/matview | absente | 500 probable |
| `GET /api/v1/analytics/hydrologie/options` | `backend/app/routers/analytics.py` | `analytics.mv_dashboard_hydrologie_menu` | vue/matview | absente | 500 probable |
| `GET /api/v1/analytics/hydrologie/sites` | `backend/app/routers/analytics.py` | `analytics.mv_dashboard_hydrologie_menu` | vue/matview | absente | 500 confirme |
| `GET /api/v1/analytics/hydrologie/series` | `backend/app/routers/analytics.py` | `analytics.mv_dashboard_hydrologie_menu` | vue/matview | absente | 500 ou 422 selon parametres |
| `GET /api/v1/analytics/pollution/options` | `backend/app/routers/analytics.py` | `analytics.mv_dashboard_pollution_menu` | vue/matview | absente | 500 probable |

## Causes racines confirmees

### Erreurs observees en logs Docker

- `relation "api.v_pollution_sites" does not exist`
- `relation "api.v_hierarchie_metier_listing" does not exist`
- `relation "qualite.mesure_qualite_riviere" does not exist`
- `relation "analytics.mv_dashboard_hydrologie_menu" does not exist`
- `relation "infra.barrages" does not exist`

### Module Python responsable des 500 restants

Le runtime FastAPI est sain. Les 500 restants sont causes par les modules backend suivants qui executent du SQL sur des objets absents :

- `backend/app/api/v1/pollution.py`
- `backend/app/routers/observatory.py`
- `backend/app/routers/quality.py`
- `backend/app/routers/analytics.py`
- `backend/app/routers/entities.py`

## Conclusion

La base Docker actuelle n'est pas une copie fonctionnelle minimale de `abh_sad`. C'est une base PostGIS vide. Pour stabiliser la plateforme Docker sans toucher la base officielle, il faut introduire une initialisation non destructive par niveaux :

- Niveau A : schemas + vues vides compatibles contrat API
- Niveau B : quelques tables et donnees fictives minimales pour les endpoints de demonstration
- Niveau C : import controle valide explicitement
