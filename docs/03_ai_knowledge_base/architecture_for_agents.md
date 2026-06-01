# Architecture - SAD Sebou 2026

## Vue d'ensemble

Architecture web en 3 couches au service d’un SAD orienté eau, SIG et restitution décisionnelle.

```text
Utilisateurs métier / administrateurs
            |
            v
Frontend React + dashboards + cartographie + administration
            |
            v
Backend FastAPI /api/v1
  - auth / security
  - analytics / observatory
  - layers / geojson / names
  - raw / admin / ingestion
  - swat / wasp / quality / hydro / climate
            |
            v
PostgreSQL + PostGIS + TimescaleDB
  - schémas métier
  - schémas metadata / security / audit
  - vues `api` et vues matérialisées `analytics`
```

## Composants confirmés
- `frontend/`: UI React, dashboards, login, data viewer, cartographie, administration
- `backend/app/main.py`: entrée FastAPI, CORS, health, montage `/api/v1`
- `backend/app/api/api_v1.py`: routeur principal riche
- `backend/app/routers/*` et `backend/app/api/v1/*`: routes métier et couches historiques
- `backend/sql/2026_04_mv_perf_pack.sql`: industrialisation SQL des MVs

## Lecture Mission IV
- Collecte et intégration: couverte par `raw`, `meta`, `admin/data-scan`, `ingestion`
- Intégration des modèles: couverte par les schémas `swat_*`, `wasp_*` et le module d’ingestion
- Analyse et visualisation: couverte par les dashboards React et les vues `api` / `analytics`
- Reporting: assuré par les exports UI et la restitution structurée
- Déploiement et exploitation: documentés et préparés dans le référentiel actif

## Points de vigilance
- préserver les contrats API déjà consommés par le frontend
- limiter les contournements SQL hors couche `api` quand une vue d’exposition existe
- encadrer strictement les opérations CRUD génériques du module `raw`
- utiliser `metadata.referentiel_parametre_canonique` comme dictionnaire cible unique des paramètres métier dès qu’il est disponible
- traiter `hydro.mesure_barrage_param` comme la couche cible de production pour les flux barrage journaliers (`LACHER`, `APPORT`, `TRANSFERT`) en `Mm3/j`
- exposer les donnees barrage via les vues `api.v_hydro_barrage_param_journalier`, `api.v_hydro_barrage_param_compat_wide` et la MV `analytics.mv_dashboard_hydrologie_menu`

## Couche d'exposition SQL specialisee

Mise a jour du 2026-05-13 :

- Les vues SQL specialisees du schema `api` constituent la couche d'exposition metier cible pour meteo, hydro, qualite, pollution et IDP.
- `metadata.referentiel_parametre_canonique.table_cible` pointe maintenant vers les vues specialisees pour 63 parametres actifs valides.
- Les vues globales doivent rester des agregateurs de restitution, pas des cibles primaires du referentiel.
- `FM` et `F_M_MES` restent hors restitution ; `MD` reste backlog client documentaire.
- API FastAPI et frontend ne sont pas encore adaptes a cette nouvelle couche : statut `HOLD`.
- Le futur module ingestion doit utiliser le referentiel canonique, les alias valides, les statuts QA/GEO et les vues specialisees comme contrat d'exposition.

Statuts architecture :

| Chantier | Statut |
|---|---|
| Vues SQL specialisees | `CREEES` |
| `table_cible` referentiel | `TABLE_CIBLE_REFERENTIEL_SPECIALISEES_APPLIQUEES` |
| API FastAPI | `P0_QUALITE_SPECIALISE_READY__AUTRES_DOMAINES_HOLD` |
| Frontend | `PILOTE_METAUX_IMPLEMENTE__AUTRES_ECRANS_HOLD` |
| Ingestion V1 | `GO_CONCEPTION` |

## Transition API specialisee P0

Mise a jour du 2026-05-13 :

- Un router FastAPI specialise P0 est ajoute sous `/api/v1/qualite`.
- Les routes legacy `/api/v1/quality/*` restent conservees.
- Les endpoints P0 lisent uniquement les vues whitelistees `api.v_qualite_metaux`, `api.v_qualite_chimie_minerale`, `api.v_qualite_physicochimie` et `api.v_qualite_pollution_organique`.
- Le repository `backend/app/repositories/api_views_repository.py` centralise les SELECT lecture seule sur vues `api.*`.
- Les schemas `backend/app/schemas/exposure.py` et `backend/app/schemas/filters.py` definissent le contrat de reponse et les filtres standards.
- Le frontend reste en `HOLD` tant que les endpoints ne sont pas valides dans l'application backend complete.

Statut : `BACKEND_P0_SPECIALIZED_APIS_READY`.

## Runtime optionnel SWAT / ingestion

Mise a jour du 2026-05-13 :

- `app.api.v1.swat_analysis` ne depend plus de `numpy` au chargement module.
- `SWAT analysis` est un router optionnel controle par `SAD_ENABLE_SWAT_ANALYSIS`.
- `Ingestion API` est un router optionnel controle par `SAD_ENABLE_INGESTION_API`, afin d'eviter l'import eager `pandas/numpy` tant que le chantier ingestion V1 est en attente.
- Le backend global doit rester disponible meme si le runtime scientifique local est instable.

Statut runtime : `BACKEND_RUNTIME_STABILIZED_OPTIONAL_SWAT`.

Implication architecture :

- Les modules scientifiques lourds ne doivent pas etre importes au demarrage global sauf activation explicite.
- Les routers de restitution critiques doivent rester independants de SWAT/WASP/ingestion.
- Le frontend pilote peut demarrer sur les endpoints P0 qualite.

## Frontend pilote Metaux

Mise a jour du 2026-05-13 :

- La route React `/qualite/metaux` est ajoutee en coexistence avec les dashboards legacy.
- La page `frontend/src/pages/qualite/MetauxPage.tsx` consomme uniquement `GET /api/v1/qualite/metaux`.
- Le client specialise est `frontend/src/api/qualite.ts`; le hook React Query est `frontend/src/hooks/useQualiteMetaux.ts`.
- Les composants P0 sont `frontend/src/components/qualite/MetauxTable.tsx` et `frontend/src/charts/MetauxChart.tsx`.
- Les controles metier front verifient `Mo`, `MO`, `FM`, `F_M_MES` et `MO_METAL` via l'endpoint specialise.
- Statut : `FRONTEND_PILOTE_METAUX_READY`; les autres ecrans qualite restent `HOLD/P1`.

## Pipeline DEV pollution IDP

Mise a jour du 2026-05-18 :

- Le premier pipeline DEV IDP pollution est executable : import SHP vers `staging`, consolidation vers `geo.ref_site_pollution`, format long vers `qualite.resultat_mesure`, exposition via vues `api.*`.
- Le router FastAPI `/api/v1/pollution` expose une couche GeoJSON MapLibre et les derniers resultats P0.
- Le test MapLibre autonome est documente dans `docs/IDP_POLLUTION_ANALYSIS/maplibre_pollution_first_layer.html`.
- La route React isolee `/pollution-idp-dev` integre la couche IDP pollution sans remplacer les dashboards existants.
- Les mappings P0 parametres/unites sont corriges en DEV ; les blocages restants sont spatiaux/metier.
- Statut : `GO_DEV_DEMO__PREPROD_BLOCKED_BY_SPATIAL_ARBITRAGE`.

## Identite spatiale maitre pollution/qualite

Mise a jour du 2026-05-19 :

- `geo.ref_site_pollution` est stabilise comme pivot spatial DEV, mais la PREPROD reste bloquee par arbitrage.
- Les tables `qa.spatial_identity_candidates`, `qa.spatial_identity_conflicts`, `qa.spatial_identity_decisions` et `qa.spatial_identity_orphans` structurent la gouvernance des fusions sans modifier les sources.
- Les vues `qa.v_spatial_review_*` fournissent les lots de revue metier.
- Le chargement QA est idempotent par `run_id` via `scripts/idp_pollution/load_spatial_identity_qa.py`.
- Les endpoints `/api/v1/pollution/*` restent inchanges pendant cette phase.
- La revue cartographique metier est preparee via les vues simplifiees `qa.v_carto_review_exact_0m`, `qa.v_carto_review_very_close_2m`, `qa.v_carto_review_same_site_different_object`, `qa.v_carto_review_orphans`, la table `qa.spatial_identity_decisions_cartographic` et le workspace QGIS `docs/IDP_POLLUTION_ANALYSIS/cartographic_review_workspace`.
- Les decisions cartographiques sont chargeables plus tard via `scripts/idp_pollution/load_cartographic_decisions.py`, sans fusion automatique. Le template par defaut est `cartographic_review_decision_template_light.csv`.

Statut : `GO_REVUE_METIER_DEV__NOGO_PREPROD_AVANT_DECISIONS_SPATIALES`.

## Auto-validation identite spatiale QA-first

Mise a jour du 2026-05-22 :

- Les buckets `EXACT_0M` et `VERY_CLOSE_2M` sont consolidables en mappings logiques source -> site maitre, sans fusion physique.
- `DIFFERENT_OBJECT` devient un lien `SAME_SITE_DIFFERENT_OBJECT` : meme site physique, objets metier distincts.
- Les cas humains restants sont reduits aux vrais ambigus et orphelins dans `docs/IDP_POLLUTION_ANALYSIS/true_ambiguous_cases_only.csv`.
- La table propositionnelle `geo.site_object_mapping` est definie dans `database/idp_pollution/25_create_site_object_mapping.sql`.
- Les vues propositionnelles `qa.v_auto_validated_exact_0m`, `qa.v_auto_validated_very_close_2m`, `qa.v_same_site_different_object`, `qa.v_true_ambiguous_cases`, `qa.v_site_objects_api_ready` et `qa.v_site_object_summary_api_ready` sont preparees dans `database/idp_pollution/26_create_final_spatial_identity_views.sql`.
- Les scripts `scripts/idp_pollution/auto_validate_exact_0m.py` et `scripts/idp_pollution/auto_validate_very_close_2m.py` restent dry-run par defaut et n'ecrivent en base qu'avec `--execute`.

Statut : `DRY_RUN_READY__NO_FUSION_DESTRUCTIVE`.

## Revue humaine finale identite spatiale

Mise a jour du 2026-05-22 :

- Le workspace final pour Imane est `docs/IDP_POLLUTION_ANALYSIS/final_human_review_workspace`.
- Il contient uniquement les cas residuels non auto-valides : `TRUE_AMBIGUOUS` et `ORPHAN_REVIEW`.
- Le template de retour est `final_review_decision_template.csv`; seules les colonnes `reviewer_decision` et `reviewer_comment` doivent etre modifiees.
- Le script `scripts/idp_pollution/load_cartographic_decisions.py` supporte `--final-template`, valide les colonnes/codes et reste dry-run par defaut.
- Aucun SHP, endpoint ou objet metier final n'est modifie par ce workspace.

Statut : `WORKSPACE_FINAL_READY_FOR_IMANE`.

## Dashboard cartographique metier P0

Mise a jour du 2026-05-20 :

- Un router backend lecture seule `backend/app/api/v1/map.py` est ajoute sous `/api/v1/map`.
- Le service `backend/app/services/map_business_service.py` centralise le contrat cartographique metier P0.
- Supports exposes : `idp_pollution`, `barrages`, `stations_qualite`, `step`, `rejets_industriels`, `rejets_domestiques`.
- Le moteur `regulatory_quality.py` est reutilise pour la classification, sans nouveau referentiel.
- Le frontend cible reste a implementer sur une route isolee `/dashboard-carto-metier`.
- Aucun dashboard existant n'est remplace.

Mise a jour catalogue metier :

- `/api/v1/map/catalog` expose maintenant les groupes metier `stations`, `inventaire_source_pollution`, `inventaire_mesures_pollution`.
- `/api/v1/map/entities` accepte `group_code` + `support_code`.
- Les anciens supports techniques restent en compatibilite avec `legacy_support=true`.

Frontend P0 :

- La route React isolee `/dashboard-carto-metier` est ajoutee sans remplacer `Dashboard2`, `Observatoire V2` ni `/pollution-idp-dev`.
- Le client `frontend/src/api/mapBusiness.ts` consomme uniquement `/api/v1/map/*`.
- Le hook `frontend/src/hooks/useMapBusiness.ts` applique React Query avec chargement differe des entites.
- Les composants `frontend/src/components/DashboardMetier/*` fournissent sidebar metier, carte MapLibre, popup, legende, panneau detail et selecteur parametre.
- La navigation principale affiche les groupes metier `stations`, `inventaire_source_pollution`, `inventaire_mesures_pollution`; les supports legacy restent cote backend seulement.

Statut : `FRONTEND_DASHBOARD_CARTO_METIER_P0_READY_DEV`.

## Observatoire menu V2

Mise a jour du 2026-05-13 :

- Un menu `Observatoire V2` est ajoute dans `Dashboard2` en coexistence avec le panneau legacy.
- Le catalogue metier est local : `frontend/src/config/observatoryCatalog.ts`.
- Le hook `frontend/src/hooks/useObservatoryData.ts` charge les valeurs uniquement apres selection explicite et clic `Afficher`.
- Les familles P0 actives sont `metaux`, `chimie-minerale`, `physicochimie`, `pollution-organique`.
- Les familles sans endpoint restent affichees comme `a venir` afin d'eviter les spinners infinis.
- Statut : `OBSERVATORY_MENU_V2_READY`.

## Dashboard decisionnel ABH test

Mise a jour du 2026-05-14 :

- Une route frontend de validation metier est ajoutee sur `/decision-dashboard-test`.
- La page `frontend/src/pages/DecisionDashboardTest.tsx` reste isolee de `Dashboard2` et ne remplace aucun ecran legacy.
- Le module `frontend/src/components/decision/*` applique la meme regle de chargement differe que l'observatoire V2 : aucun appel API initial, chargement seulement apres clic `Afficher`.
- Source API de la V1 test : endpoints specialises `/api/v1/qualite/*` uniquement.
- Les campagnes non branchees restent visibles avec etat `a venir`, sans appel reseau.
- Statut : `DASHBOARD_DECISIONNEL_TEST_READY`.

## Dashboard pollution — Stabilisation runtime hydrologique

Mise a jour du 2026-05-14 :

- Le moteur hydrologique pollution est stabilise comme moteur topologique visuel auditable.
- Le contrat runtime est centralise dans `backend/app/services/hydrology/runtime_config.py`.
- Table d'aretes officielle : `geo_work.reseau_hydro_edges_final`.
- Table de noeuds officielle : `geo_work.reseau_hydro_edges_final_vertices_pgr`.
- `graph_builder`, `routing_service` et `topology_qa` doivent utiliser ce contrat et ne plus melanger `raw`, `noded` ou `noded_preview` dans le runtime courant.
- Aucune inversion automatique d'aretes basee sur `Z_Max > Z_Min` n'est validee.
- Le frontend doit presenter le resultat comme `Routage topologique visuel`, avec `Direction hydraulique non validee` et `Fallback non oriente utilise` si applicable.

Statut : `RUNTIME_TOPOLOGY_STABILIZED__HYDRAULIC_DIRECTION_NOT_VALIDATED`.

## Réorganisation documentaire consolidée

Mise a jour du 2026-05-22 :

- La gouvernance documentaire active est structurée dans `docs/00_source_of_truth/` à `docs/12_historique_et_archives/`.
- Le rapport de réorganisation est `docs/90_reorganisation_documentaire_finale/`.
- `docs/12_historique_et_archives/root_legacy/` contient les anciens fichiers historiques racine déplacés.
- La source consolidée est `docs/00_source_of_truth/01_source_of_truth_consolidee.md`.
- Les dossiers historiques complets restent en place tant que leur déplacement n'est pas validé par lot.
- Toute architecture proposée doit indiquer son statut : `OFFICIEL_MVP`, `DEV_READY`, `SPECIFICATION_ONLY`, `SANDBOX_LEGACY`, `HOLD` ou `OBSOLETE`.

## Dashboard qualité réglementaire P0

- `frontend/src/pages/DashboardQualiteReglementaire.tsx` compose le dashboard officiel qualité P0.
- `frontend/src/api/qualityRegulatory.ts` centralise l’accès lecture seule à `/api/v1/quality/*`.
- `frontend/src/hooks/useQualityRegulatory.ts` limite le chargement des séries à la sélection station.
- `frontend/src/components/quality-regulatory/*` sépare header réglementaire, KPI, stations, historique, paramètres actifs et paramètres observationnels.
- `backend/app/routers/quality.py` garantit les statuts métier explicites et la transition tracée `water_type` vers `type_eau`.
