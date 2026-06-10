# PREPROD_READINESS_REPORT

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | audit de qualification preproduction |
| Snapshot | 2026-06-04 |
| Source primaire | code + BD read-only |

## Verdict

```text
PREPROD_READINESS_REPORT = PREPROD_READY_CONDITIONNEL
```

Le projet peut viser un etat `PREPROD_READY` sans attendre des resultats SWAT/WASP valides, sous reserve de fermer les ecarts runtime restants ci-dessous.

## Etat par domaine

| Domaine | Etat reel | Preuves principales | Statut |
|---|---|---|---|
| Backend API coeur | FastAPI monte sous `/api/v1` via `backend/app/main.py` et `backend/app/api/api_v1.py` | routeur principal unique, modules pollution/map/propagation/kpi/dashboard montes | `READY_CONDITIONNEL` |
| PostgreSQL exposition | vues `api.*` et MVs `analytics.*` actives | `api.v_station_dimension`, `api.v_pollution_sites`, `api.v_pollution_latest_results`, `api.v_barrage_dimension` | `READY_CONDITIONNEL` |
| IDP / pollution | runtime P0 stable, sans dependance QA brute | `backend/app/api/v1/pollution.py`, `backend/app/services/propagation/propagation_pollution_service.py` | `READY_DEV` |
| Cartographie metier | couches modernes resolues via `api.*`, `geo.*`, `infra.*`, `admin.*` | `backend/app/routers/layers.py`, `backend/app/services/map_business_service.py` | `READY_CONDITIONNEL` |
| KPI / home dashboard | exploitation des vues canoniques et classification reglementaire | `backend/app/services/kpi/engine.py`, `backend/app/services/dashboard/home_service.py` | `READY_CONDITIONNEL` |
| Reglementaire C3 | moteur charge et consomme au runtime | `metadata.qualite_*`, `backend/app/routers/quality.py`, `backend/app/services/regulatory_quality.py` | `GO_PREPROD_CONDITIONNEL` |
| Frontend | routes metier et reglementaires branchees | `frontend/src/App.tsx`, `frontend/src/api/qualityRegulatory.ts` | `READY_CONDITIONNEL` |
| SWAT | sandbox/legacy, non bloquant techniquement | `backend/app/api/v1/swat.py`, `backend/app/api/v1/swat_analysis.py` | `EXTERNAL_BUSINESS_DEPENDENCY` |
| WASP | sandbox/legacy, non bloquant techniquement | `backend/app/api/v1/swat.py` lit `wasp_sebou.*` | `EXTERNAL_BUSINESS_DEPENDENCY` |

## Preuves BD critiques

```sql
SELECT count(*) FROM metadata.qualite_parametre_reglementaire;
SELECT count(*) FROM metadata.qualite_mapping_canonique_reglementaire;
SELECT count(*) FILTER (WHERE actif IS TRUE) FROM metadata.qualite_mapping_canonique_reglementaire;
SELECT count(*) FROM metadata.qualite_seuil_reglementaire;
SELECT count(*) FILTER (WHERE actif IS TRUE) FROM metadata.qualite_seuil_reglementaire;
SELECT count(*) FILTER (WHERE classifiable IS TRUE AND actif IS TRUE) FROM metadata.qualite_parametre_reglementaire;
SELECT count(*) FILTER (WHERE classifiable IS FALSE AND actif IS TRUE) FROM metadata.qualite_parametre_reglementaire;
```

Resultats verifies :

- parametres reglementaires : `41`
- mappings reglementaires : `41`
- mappings actifs : `36`
- seuils : `205`
- seuils actifs : `177`
- parametres classifiables actifs : `36`
- parametres non classifiables actifs : `5`

## Preuves code critiques

### Backend

- `backend/app/api/v1/pollution.py`
  - consomme `api.v_pollution_sites` et `api.v_pollution_latest_results`
  - enrichit les resultats avec le moteur reglementaire
- `backend/app/services/propagation/propagation_pollution_service.py`
  - consomme `api.v_pollution_sites`, `api.v_station_dimension`, `api.v_barrage_dimension`
  - aucun couplage SWAT/WASP requis pour le runtime P0
- `backend/app/routers/quality.py`
  - expose `/quality/regulatory-status`, `/thresholds`, `/classify`, `/global-index`, `/stations`, `/parameters`, `/timeseries`
- `backend/app/services/regulatory_quality.py`
  - charge `metadata.qualite_parametre_reglementaire`, `metadata.qualite_mapping_canonique_reglementaire`, `metadata.qualite_seuil_reglementaire`

### Frontend

- `frontend/src/App.tsx`
  - route active `/dashboard-qualite-reglementaire`
- `frontend/src/api/qualityRegulatory.ts`
  - consomme `/quality/regulatory-status`, `/quality/thresholds`, `/quality/stations`, `/quality/parameters`, `/quality/timeseries`, `/quality/classify`

## Ecarts restants avant `PREPROD_READY`

| Ecart | Preuve | Impact | Priorite |
|---|---|---|---|
| C3 encore conditionnel | 1 type d'eau reellement operationnel ; 36 mappings actifs sur 41 | moteur reglementaire exploitable mais encore borne | `P0` |
| SWAT analysis optionnel | `SAD_ENABLE_SWAT_ANALYSIS` desactive par defaut dans `backend/app/api/api_v1.py` | non bloquant preprod coeur, mais contrat a expliciter | `P1` |
| Ingestion API optionnelle | `SAD_ENABLE_INGESTION_API` desactive par defaut | non bloquant preprod coeur, mais hors chemin critique court | `P1` |

Note P0-1 :

- la dette runtime `public.*` n'est plus ouverte en `P0` apres quarantaine des routeurs legacy non montes ;
- le statut `PREPROD_READY_CONDITIONNEL` est conserve a ce stade a cause du caractere encore conditionnel de `C3`.

Note P0-2 :

- la source de verite frontend pour l'URL backend est maintenant `frontend/src/config/api.ts` ;
- la variable d'environnement cible est `VITE_API_BASE_URL` ;
- le fallback runtime unique est `http://127.0.0.1:8000/api/v1` ;
- `frontend/src/api/client.ts` et `frontend/src/lib/api.ts` sont aligns sur cette configuration centrale.

## Chemin critique projete

```text
1. Purge finale des dependances public.* legacy
2. Stabilisation environnement front/back PREPROD
3. Consolidation C3 reglementaire
4. Qualification PREPROD globale
5. Reception ulterieure des resultats SWAT/WASP valides via contrat d'integration
```

## Decision

SWAT et WASP ne doivent plus etre traites comme des blocages techniques internes du chemin critique.

Leur statut reel devient :

```text
DEPENDANCE_METIER_EXTERNE
```

Le noyau plateforme peut avancer vers `PREPROD_READY` sans attendre leurs outputs valides, a condition de traiter les ecarts `P0` listés ci-dessus.
