# Architecture ingestion

## Couches

```text
Fichiers client / modeles
        |
        v
ingestion.upload_batch
        |
        v
staging normalise par domaine
        |
        v
QA + mapping parametre + mapping GEO + scenario
        |
        v
tables metier cible / output modele
        |
        v
audit + publication API/dashboard
```

## Principes

- ingestion idempotente par `batch_id`
- aucune ecriture cible sans controles QA
- hash source et hash metier obligatoires
- rollback par batch
- audit complet des exclusions
- mapping parametre et GEO explicite
- scenarios modeles versionnes

## Domaines

| Domaine | Cible |
|---|---|
| qualite client | `qualite.*` |
| IDP / pollution | `qualite.source_pollution_*` |
| hydro / meteo | `hydro.*`, `meteo.*` |
| SWAT | futur `swat_output.*` versionne |
| WASP | futur `wasp_output.*` versionne |

