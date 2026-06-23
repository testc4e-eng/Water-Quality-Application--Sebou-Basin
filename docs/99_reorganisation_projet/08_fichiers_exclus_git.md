# Fichiers exclus du commit Git de continuité

## Règle

Le commit de continuité avant délégation doit rester minimal, technique et sécurisé.

Sont exclus :

- fichiers lourds ;
- archives ;
- dumps ;
- secrets ;
- fichiers hors périmètre Carte Métier / Workspace / Batch ;
- brouillons ou documentation non nécessaires au commit de continuité code.

## Exclusions explicites

### Backups et dumps

- `backups/`
- `backups/abh_sad_backup.sql`
- `*.sql` lourds de backup
- `*.dump`
- `*.backup`

### Archives et binaires lourds

- `*.rar`
- `*.zip`
- `*.7z`
- `docs/01_project_reference/data.rar`

### Secrets et configuration sensible

- `backend/.env`
- tout nouveau `.env`
- tout fichier contenant secrets réels, tokens ou mots de passe

### Artefacts techniques

- `node_modules/`
- `dist/`
- `__pycache__/`
- `.venv/`
- logs sensibles

### Hors périmètre continuité ciblée

- `backend/app/api/v1/pollution_campagnes.py`
- `backend/app/models/pollution_campagnes_models.py`
- `backend/app/services/pollution_campagnes_service.py`
- `backend/app/models/propagation_models.py`
- `backend/app/services/propagation/propagation_recommendations.py`
- `frontend/src/api/pollutionCampagnes.ts`
- `frontend/src/pages/DashboardPollution*.tsx`
- `frontend/src/components/Pollution/`
- `frontend/src/hooks/usePollutionCampagnes.ts`
- `frontend/src/hooks/useCorrelation.ts`

### Fichiers ambigus

- `backend/app/api/api_v1.py`
  - raison : mélange du câblage business-map/analysis avec le périmètre `pollution_campagnes`
  - décision : exclu du commit minimal de continuité

## Contrôle effectué

Avant staging :

- vérification `git status --short`
- vérification `git diff --stat`
- recherche de secrets dans les candidats retenus
- contrôle du build frontend
- contrôle `py_compile` backend

## Décision

```text
FICHIERS_LOURDS_EXCLUS = OUI
SECRETS_EXCLUS = OUI
FICHIERS_AMBIGUS_EXCLUS = OUI
```
