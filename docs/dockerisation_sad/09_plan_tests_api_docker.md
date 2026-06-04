# Plan de tests API Docker

## Objectif

Verifier rapidement qu'une initialisation Docker minimale supprime les erreurs 500 de contrat SQL les plus visibles.

## Script prepare

- `scripts/test_docker_api.ps1`

Ce script :

- teste les endpoints systeme
- teste les endpoints metier prioritaires en `GET`
- affiche les codes HTTP et une observation courte
- tente de lister les routes disponibles depuis `openapi.json`

## Endpoints cibles

### Systeme

- `/health`
- `/docs`
- `/openapi.json`

### Metier prioritaire

- `/api/v1/stations`
- `/api/v1/routing/topology-qa`
- `/api/v1/map/catalog`
- `/api/v1/barrages`
- `/api/v1/quality/stations`
- `/api/v1/pollution/sites.geojson`
- `/api/v1/observatory/hierarchy/themes`

## Execution PowerShell Windows

```powershell
cd C:\dev\WQDSS\repo_git
powershell -ExecutionPolicy Bypass -File .\scripts\test_docker_api.ps1
```

## Execution depuis WSL

```bash
cd /mnt/c/dev/WQDSS/repo_git
powershell.exe -ExecutionPolicy Bypass -File .\\scripts\\test_docker_api.ps1
```

## Interpretation attendue

### Avant initialisation Niveau A/B

- `/health`, `/docs`, `/openapi.json` : `200`
- `map/catalog`, `routing/topology-qa` : souvent `200`
- routes metier SQL : `500` ou `404`

### Apres Niveau A

- `pollution/sites.geojson` : `200` avec `FeatureCollection` vide attendue
- `observatory/hierarchy/themes` : `200` avec liste vide ou demo
- `analytics/*` non testes ici mais doivent cesser de crasher si les vues existent

### Apres Niveau B

- `barrages` : `200`
- `quality/stations` : `200`
- `stations` : `200`
- `pollution/sites.geojson` : `200` avec au moins un site demo

## Resultats a consigner

Le rapport a completer apres execution devrait suivre ce format :

| Endpoint | Resultat | Code HTTP | Observation |
|---|---|---|---|
| `/health` | OK | 200 | backend et ping DB OK |
| `/api/v1/barrages` | A verifier | ... | ... |

## Limite volontaire

Le plan ne teste pas :

- les routes destructives `POST/PUT/DELETE`
- l'import de dump
- les workflows metier complets

Le but est d'abord de valider la compatibilite Docker de base.
