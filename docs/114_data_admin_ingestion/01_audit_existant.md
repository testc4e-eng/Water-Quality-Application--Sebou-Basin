# Audit existant

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | audit read-only |
| Source de vérité | Oui pour l'inventaire de départ |
| Dernière mise à jour | 2026-06-05 |

## Méthode

Audit réalisé prioritairement sur :

- code backend réellement monté ;
- pages/frontend réellement routées ;
- services de scan et d'ingestion existants ;
- schémas et objets mentionnés dans le code ;
- documents maîtres seulement comme source secondaire.

## Limite constatée

L'accès PostgreSQL depuis cette session locale Windows a échoué :

- `sad_user@localhost`: échec d'authentification ;
- `postgres@host.docker.internal`: rejet `pg_hba.conf`.

Conséquence :

- l'audit 114 repose d'abord sur le code et les contrats runtime ;
- les cardinalités BD déjà consolidées dans les documents maîtres sont réutilisées comme contexte secondaire ;
- toute future phase DDL devra être précédée d'un audit BD relancé depuis un environnement autorisé.

## Backend réellement réutilisable

### Routeur principal

- `backend/app/main.py`
- `backend/app/api/api_v1.py`

Constats :

- runtime officiel monté sous `/api/v1` ;
- `ingestion` reste optionnel via `SAD_ENABLE_INGESTION_API` ;
- `raw`, `admin`, `layers`, `security`, `dashboard`, `quality`, `pollution`, `map`, `kpi`, `propagation` sont déjà intégrés dans le routeur principal.

### Module d'audit de disponibilité

- route backend : `/api/v1/admin/data-availability`
- routeur : `backend/app/routers/admin_data_scan.py`
- service : `backend/app/services/admin_data_scan_service.py`

Réutilisable :

- scan multi-domaines lecture seule ;
- agrégation stations / bassins / variables ;
- lecture depuis `api.v_station_dimension`, `staging`, `qualite`, `geo`.

Limites :

- service encore nommé `legacy_data_scan` ;
- logique codée en dur sur quelques tables et non pilotée par registre ;
- descriptions frontend encore partiellement obsolètes sur `public.*`.

### Module d'ingestion existant

- routeur : `backend/app/routers/ingestion.py`
- services :
  - `backend/app/services/ingestion_structural_validation.py`
  - `backend/app/services/ingestion_mapping_service.py`
  - `backend/app/services/ingestion_dedup_service.py`
  - `backend/app/services/ingestion_simulation_service.py`
  - `backend/app/services/ingestion_audit_service.py`
  - `backend/app/services/qa_validation_service.py`

Réutilisable :

- upload multi-fichiers ;
- validation structurelle ;
- rapport de mapping ;
- détection de doublons ;
- simulation dry-run ;
- journalisation dans `audit.ingestion_audit_logs` ;
- export QA critique.

Limites :

- périmètre centré SWAT/WASP ;
- logique de domaine métier non généralisée par classe de données ;
- pas de registre de classes ;
- pas de `change_request` ;
- pas de promotion contrôlée générique ;
- pas de workflow d'approbation multi-rôles.

### Module CRUD générique

- routeur : `backend/app/api/v1/raw.py`
- route frontend : `/data`

Réutilisable :

- découverte de tables ;
- lecture paginée ;
- lecture de colonnes ;
- CRUD générique.

Limites critiques :

- écrit directement sur les tables ciblées ;
- non piloté par workflow ;
- trop générique pour être exposé au métier comme interface de gouvernance ;
- doit rester outil expert/admin, pas canal officiel d'édition métier.

## Frontend réellement réutilisable

### Routes admin existantes

- `/admin/data-scan`
- `/admin/gestion-users`
- `/admin/password-resets`
- `/admin/ingestion`
- `/admin/popup-rules`
- `/data`

### Pages et services utiles

| Élément | Rôle actuel | Réutilisation 114 |
|---|---|---|
| `frontend/src/pages/admin/DataScanPage.tsx` | audit de disponibilité | base MVP audit lecture seule |
| `frontend/src/components/admin/data-scan/*` | restitution tableaux/cartes simples | composants d'inventaire réutilisables |
| `frontend/src/pages/admin/IngestionPage.tsx` | ingestion SWAT/WASP | base UX upload/validation/report |
| `frontend/src/services/ingestionService.ts` | appels `/ingestion/*` | référence pour nouveaux clients data-admin |
| `frontend/src/pages/DataViewer.tsx` | data viewer expert | outil secondaire, pas front principal 114 |

## Incohérences / dettes identifiées

| Zone | Constat | Impact |
|---|---|---|
| `DataScanDashboard.tsx` | mentionne encore `public.bassin_sebou` et `public.barrages_abhs` dans les libellés | dette documentaire/UI |
| `raw.py` | expose du CRUD direct | incompatible avec workflow métier cible |
| `ingestion.py` | focalisé modèles SWAT/WASP | trop étroit pour ingestion multi-domaines SAD |
| `admin_data_scan_service.py` | registre de tables codé en dur | faible extensibilité |
| frontend admin | pas d'espace unifié `data-governance` | navigation fragmentée |

## Composants BD/logiques déjà présents à exploiter

- schéma `staging` comme zone tampon ;
- schéma `audit` pour les logs d'ingestion ;
- schéma `metadata` pour référentiels, paramètres, vues d'exposition et popup rules ;
- schéma `security` pour rôles, permissions, logs d'activité ;
- schéma `qa` pour anomalies et gouvernance qualité/spatiale ;
- schéma `api` pour exposition lecture seule vers le frontend.

## Conclusion d'audit

Le projet possède déjà :

- un socle d'audit lecture seule ;
- un socle d'ingestion de fichiers ;
- un socle de traçabilité ;
- un socle de rôles/sécurité ;
- un socle de staging.

Il manque encore :

- un registre central des classes métier ;
- un contrat d'édition contrôlée ;
- une abstraction commune des validations ;
- une UX unifiée `audit -> template -> upload -> validation -> review -> promotion` ;
- une séparation stricte entre outil expert générique et gouvernance métier officielle.
