# Backend Overview

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Périmètre | backend FastAPI, routeurs actifs, dépendances DB et zones à risque |
| Source de vérité | Oui |
| Documents liés | [../../00_SOURCE_OF_TRUTH_MASTER.md](../../00_SOURCE_OF_TRUTH_MASTER.md), [api_contracts](./api_contracts.md), [../../03_ai_knowledge_base/api_for_agents.md](../../03_ai_knowledge_base/api_for_agents.md) |
| Dernière mise à jour | 2026-04-17 |

## 1. Contexte réel

Le backend WQDSS est une application FastAPI montée depuis `backend/app/main.py` et consolidée par `backend/app/api/api_v1.py`.

La vérité déployée doit être lue à partir :

- du code réellement monté dans `api_v1.py` ;
- des dépendances SQL réellement disponibles dans `abh_sad` ;
- du document [00_SOURCE_OF_TRUTH_MASTER](../../00_SOURCE_OF_TRUTH_MASTER.md).

Le document [api_contracts](./api_contracts.md) reste utile comme cible fonctionnelle et backlog contractuel, mais il ne décrit pas intégralement l’API réellement déployée au 2026-04-17.

## 2. Groupes de routes réellement montés

Sous le préfixe global `/api/v1`, `backend/app/api/api_v1.py` monte actuellement les groupes suivants :

| Groupe | Préfixe effectif | Rôle principal | État |
|---|---|---|---|
| Auth | `/api/v1/auth` | authentification, inscription, gestion du mot de passe | Actif |
| Stations | `/api/v1/stations` | référentiel stations et accès station-centric | Actif mais dépendances legacy |
| GeoJSON | `/api/v1/geojson` | exposition géospatiale générique | Actif |
| Measurements | `/api/v1/measurements` | séries de mesures orientées station | Actif mais dépendances legacy |
| Alerts | `/api/v1/alerts` | alertes et synthèses orientées monitoring | Actif |
| Meta | `/api/v1/meta` | métadonnées API et catalogues utilitaires | Actif |
| Raw | `/api/v1/raw` | exploration brute / administration de données | Actif |
| Entities | `/api/v1/entities` | entités métier exposées par type | Actif mais dépendances legacy |
| Layers | `/api/v1/layers` | couches cartographiques et couches configurables | Actif |
| Names | `/api/v1/names` | listes de noms / aides de filtrage | Actif |
| Users | `/api/v1/users` | gestion utilisateurs | Actif |
| Security | `/api/v1/security` | journaux d’activité et sécurité | Actif |
| Admin data scan | `/api/v1/admin/data-availability` | scan de disponibilité des données | Actif |
| Admin password reset | `/api/v1/admin/password-reset-requests` | workflow de réinitialisation | Actif |
| Admin users | `/api/v1/admin/users` | opérations admin ciblées sur les comptes | Actif |
| Climate | `/api/v1/climate` | indicateurs climat / météo | Actif |
| Hydro | `/api/v1/hydro` | hydrologie et barrages | Actif |
| Quality | `/api/v1/quality` | qualité des eaux | Actif mais dépendances legacy |
| Observatory | `/api/v1/observatory` | observatoire métier, KPI, timeseries, hiérarchies | Actif |
| Analytics | `/api/v1/analytics` | agrégats analytiques transverses | Actif |
| SWAT | `/api/v1/swat` | scénarios et sorties SWAT | Actif |
| SWAT analysis | `/api/v1/api/v1/swat/analysis` | comparaison et analyse de scénarios SWAT | Actif mais préfixe incohérent |
| Ingestion | `/api/v1/ingestion` | ingestion de scénarios, QA et suivi | Actif |
| Layer configs | `/api/v1/layers/configs` | configuration des popups et couches | Actif |

## 3. Réalité DB consommée

Les schémas réellement présents dans `abh_sad` et consommés par le backend sont principalement :

- `infra`
- `hydro`
- `meteo`
- `qualite`
- `geo`
- `metadata`
- `security`
- `api`
- `analytics`
- `swat_sebou`
- `swat_output`
- `wasp_sebou`
- `wasp_output`

Le backend ne doit pas être documenté comme s’il s’appuyait prioritairement sur `public.stations_abhs`, `public.barrages_abhs` ou `public.mesures_*` : ces objets ne constituent pas la réalité de production vérifiée dans `abh_sad`.

## 4. Zones stables

Les groupes suivants sont cohérents avec l’état observé du code et de la base, et peuvent être considérés comme relativement stables au plan documentaire :

- `auth`
- `users`
- `security`
- `raw`
- `admin/*`
- `layers`
- `layers/configs`
- `observatory`
- `analytics`
- `climate`
- `hydro`
- `ingestion`
- `swat`

## 5. Zones à risque ou en dette

### 5.1 Références `public.*` non alignées avec `abh_sad`

Des modules encore actifs continuent de référencer des objets absents de la base vérifiée :

- `backend/app/routers/quality.py`
- `backend/app/routers/entities.py`
- `backend/app/api/v1/stations.py`
- `backend/app/api/v1/measurements.py`

Ces modules s’appuient encore sur des références de type :

- `public.mesures_debit_jr`
- `public.mesures_temperatures_jr`
- `public.mesures_qualite_rivieres`
- `api.v_station_dimension` via configuration

Conséquence : la présence de routeurs montés ne garantit pas la validité opérationnelle de tous les endpoints si les objets SQL attendus sont absents.

### 5.2 Routeur SWAT analysis

Le fichier `backend/app/api/v1/swat_analysis.py` déclare un préfixe local `/api/v1/swat/analysis` puis est remonté sous `/api/v1` dans `main.py`.

Le chemin effectif devient donc vraisemblablement :

- `/api/v1/api/v1/swat/analysis/*`

Ce comportement est incohérent avec l’usage frontend courant, qui vise `/swat/analysis/*` via le client API.

### 5.3 Contrats documentaires non déployés

Plusieurs endpoints documentés dans `api_contracts.md` ne correspondent pas à des routeurs réellement observés ou à des objets SQL réellement présents dans `abh_sad`.

Ils doivent être lus comme cible documentaire, pas comme photographie du backend déployé.

## 6. Lancement local

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

L’usage documentaire normalisé dans le projet est le port `8000` pour le backend local (aligné avec `BACKEND_PORT=8000` dans `.env` et Docker Compose).

## 7. Règle documentaire

Pour toute évolution backend :

1. vérifier le routeur réellement monté dans `api_v1.py` ;
2. vérifier les objets SQL réellement disponibles dans `abh_sad` ;
3. mettre à jour ce document et [api_for_agents](../../03_ai_knowledge_base/api_for_agents.md) ;
4. mettre à jour [api_contracts](./api_contracts.md) uniquement si la cible fonctionnelle change ou si le déployé rejoint enfin la spécification.
