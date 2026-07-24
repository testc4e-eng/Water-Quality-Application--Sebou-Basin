# Note de cadrage — Déploiement et reprise développeuse

## 1. Position actuelle du projet

Le projet n'est plus dans une logique de création de nouveaux modules.

Lecture officielle :

```text
PHASE_ACTUELLE = STABILISATION_PREPROD + ASSAINISSEMENT_DONNEES_METIER
PRIORITE_1 = RUNTIME + SEPARATION_QUALITE_POLLUTION + SEPARATION_TIME_SERIES_POINT_MEASURE
PREPROD_READY = NON
DEMO_DG_READY = NON
VALIDATION_METIER_READY = NON
```

Le périmètre de travail pendant la passation est donc :

1. stabiliser Carte Métier ;
2. stabiliser Dashboard Qualité ;
3. optimiser `dashboard/home` ;
4. vérifier `QUALITE_ABH != POLLUTION_IDP` ;
5. vérifier `TIME_SERIES != POINT_MEASURE`.

## 2. Branche et état Git

Branche de travail :

```text
BRANCHE = Dev_refonte
REMOTE = origin/Dev_refonte
```

État important :

- la documentation critique de passation a déjà été poussée ;
- un commit local de continuité code existe :

```text
2221edf — feat: secure business map analytical workspace continuity code
```

- ce commit n'est pas poussé automatiquement dans ce passage ;
- un patch de ce commit est fourni :

```text
09_patch_commit_local_2221edf.patch
```

## 3. Ordre de reprise recommandé

### Étape 1 — Lire et situer le projet

Lire dans cet ordre :

1. `04_synthese_passation_conge_chef_projet_20260623.md`
2. `02_etat_global_projet_20260622.md`
3. `03_rapport_passation_conge_chef_projet_20260623.md`
4. `05_validation_post_reorganisation.md`
5. `06_audit_code_continuite_git.md`
6. `08_commit_code_continuite_resume.md`

### Étape 2 — Vérifier l’environnement

Contrôler :

- clone correct du dépôt ;
- branche `Dev_refonte` ;
- accès Docker local ;
- accès base PostgreSQL/PostGIS ;
- présence des secrets hors Git.

### Étape 3 — Démarrer la stack

Mode recommandé sur cette machine : Docker local.

Commande :

```bash
docker compose up -d sad-backend sad-frontend
```

Si la base Docker est nécessaire :

```bash
docker compose --profile docker-db up -d sad-db
```

Ports à retenir :

- backend Docker : `8010 -> 8000`
- frontend Docker : `5174 -> 5173`

URLs utiles :

- backend : `http://localhost:8010`
- API v1 : `http://localhost:8010/api/v1`
- frontend : `http://localhost:5174`
- Swagger : `http://localhost:8010/docs`

### Étape 4 — Vérifier le runtime avant tout travail

Tester au minimum :

```text
GET /api/v1/dashboard/home
GET /api/v1/quality/regulatory-status
GET /api/v1/quality/unified/stations
GET /api/v1/business-map/availability
GET /api/v1/business-map/features?limit=5
POST /api/v1/business-map/analysis/series/batch
```

### Étape 5 — Vérifier le frontend

Exécuter :

```bash
cd frontend
npm run build
```

Puis ouvrir :

- Dashboard DG
- Dashboard Qualité
- Carte Métier

## 4. Si le code de continuité doit être récupéré

Deux cas :

### Cas A — travail dans le même clone local

Le commit local `2221edf` est déjà présent. Vérifier simplement :

```bash
git log --oneline -n 5
```

### Cas B — travail depuis un autre clone ou une autre machine

Le commit n'est pas garanti sur le remote.

Dans ce cas :

1. récupérer le fichier :

```text
09_patch_commit_local_2221edf.patch
```

2. l’appliquer dans le clone cible :

```bash
git apply 09_patch_commit_local_2221edf.patch
```

3. vérifier ensuite :

```bash
npm run build
python -m py_compile ...
```

## 5. Ce qu’il ne faut pas toucher

Ne pas lancer :

- Sprint 3 ;
- SWAT/WASP officiel ;
- IA ;
- reporting autonome ;
- migration destructive ;
- fusion physique des tables qualité ;
- remise en avant de `pollution-idp-dev` ;
- remise en avant de `/admin/ingestion` comme cible officielle.

Ne pas modifier sans validation :

- `backend/.env`
- tables sources métier
- référentiel réglementaire officiel
- règles métier pollution présentées comme scientifiques

## 6. Secrets et éléments hors Git

À transmettre séparément, hors de ce dossier :

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`
- `CLIMATE_DB_PASS`
- `SECRET_KEY`
- comptes de test
- accès Docker / PostgreSQL / VPN si nécessaire

Backups à ne pas mettre dans Git :

- `backups/abh_sad_backup.sql`
- autres dumps / archives lourdes

## 7. Travail réellement prioritaire

### P1

1. Carte Métier : lever l’erreur catalogue si elle persiste
2. Dashboard Qualité : lever le `Network Error` si elle persiste
3. Home DG : réduire la latence de `GET /dashboard/home`

### P1 métier

4. vérifier que `QUALITE_ABH` reste bien séparé de `POLLUTION_IDP`
5. vérifier que `TIME_SERIES` reste bien séparé de `POINT_MEASURE`
6. vérifier que le workspace n’ouvre jamais un graphique vide pour une donnée ponctuelle

### P2

7. préparer les validations D1 / D2 / D3, sans les forcer si le runtime n’est pas stabilisé

## 8. Points de repère techniques

Le commit de continuité ciblé contient le socle suivant :

- routeurs backend `business_map` et `analysis`
- services backend `business_map_service` et `analysis_service`
- modèles backend Pydantic associés
- clients frontend `businessMapV1` et `analysis`
- hooks React Query associés
- `workspaceStore`
- page `DashboardCartoMetier`
- composants `DashboardMetier/V1`
- composants `analysis-workspace`

Le point non inclus volontairement dans ce passage est :

- `backend/app/api/api_v1.py`

Motif :

- le diff actuel mélange le câblage `business_map` / `analysis` avec `pollution_campagnes`

## 9. Critère de bonne reprise

La reprise est bien cadrée si la développeuse peut répondre clairement à ces questions :

1. Quelle branche utiliser ?
2. Quel port backend / frontend utiliser ?
3. Quels endpoints vérifier avant de travailler ?
4. Quel est le vrai périmètre P1 ?
5. Quels modules ne doivent pas être relancés ?
6. Où se trouve le patch du code local non poussé ?

## 10. Statut de transmission

```text
DOSSIER_PASSATION = PRET
SECRETS_DANS_DOSSIER = NON
BACKUPS_DANS_DOSSIER = NON
PATCH_CODE_LOCAL = FOURNI
```
