# MVP et périmètre SAD/WQDSS

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | document maître |
| Source de vérité | Oui, pour le périmètre MVP |
| Snapshot | 2026-05-22 |

## MVP actuel réel

Le MVP actuel est une plateforme SAD DEV/P0 avec :

- base `abh_sad` consolidée sur hydro, météo, qualité, pollution, référentiels, sécurité et analytics ;
- FastAPI `/api/v1` avec modules stables, modules P0 et modules optionnels ;
- dashboards historiques conservés ;
- routes P0 isolées pour qualité, pollution IDP DEV et cartographie métier ;
- gouvernance documentaire stratégique active ;
- pipelines IDP, qualité réglementaire, topologie pollution et ingestion en niveaux DEV/spécification.

## Officiellement supporté dans le MVP

| Domaine | Périmètre supporté | Limite |
|---|---|---|
| Données hydro | débits, barrages, paramètres barrage | QA résiduelle à signaler |
| Données météo | précipitation, évaporation | température absente |
| Données qualité | familles P0 et vues spécialisées | paramètres restants à arbitrer |
| Stations/barrages | référentiels infra et cartographie | barrages observés : 33 |
| Administration | auth, users, logs, reset, data scan | DEV/stable |
| Cartographie métier | `/dashboard-carto-metier`, `/api/v1/map/*` | P0 partiel |
| Documentation gouvernance | documents maîtres + rapport 90 | à maintenir systématiquement |

## Expérimental

| Domaine | Statut | Condition de sortie |
|---|---|---|
| Pollution IDP | `GO_DEV__NOGO_PREPROD` | arbitrage spatial et métier |
| Référentiel réglementaire | `DEV_PARTIAL` | version active et seuils validés |
| Ingestion V1 | `SPECIFICATION_OPTIONNELLE` | industrialisation QA/rollback |
| Feature Store | `SPECIFICATION_ONLY` | DDL et gouvernance validés |
| Model Build | `SPECIFICATION_ONLY` | validation scientifique |
| Routage pollution | `VISUEL_TOPOLOGIQUE` | validation hydraulique |

## Prévu plus tard

- endpoints complets `/api/v1/map/sites/*` ;
- séries temporelles cartographiques généralisées ;
- ingestion industrialisée avec rollback et lineage ;
- Feature Store officiel ;
- Model Build officiel ;
- Graph AI / ML après validation topologique et scientifique.

## Hors périmètre

- fusion destructive automatique IDP ;
- usage décisionnel des outputs SWAT/WASP legacy ;
- Deep Learning ou Graph AI officiel ;
- reporting officiel sur données expérimentales ;
- utilisation de tables `public.*` legacy comme contrat production.

## Dépendances métier

| Sujet | Dépendance |
|---|---|
| paramètres ambigus | dictionnaire officiel |
| IDP spatial | arbitrage sites, doublons, orphelins |
| qualité réglementaire | version active et seuils |
| certification dashboard | décision DG/ABH |

## Dépendances SWAT/WASP

| Modèle | Dépendance |
|---|---|
| SWAT | validation Reda : unités, calibration, scénarios, mappings |
| WASP | validation Anas : segments, scénarios, unités, outputs |

