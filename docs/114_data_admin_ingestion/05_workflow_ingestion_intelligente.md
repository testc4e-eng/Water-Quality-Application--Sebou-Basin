# Workflow ingestion intelligente

## Règle centrale

Aucune donnée ne doit entrer directement dans `hydro`, `meteo`, `qualite`, `geo` ou `infra`.

## Pipeline cible

```text
UPLOAD
-> STRUCTURAL_VALIDATION
-> BUSINESS_VALIDATION
-> SPATIAL_VALIDATION
-> TEMPORAL_VALIDATION
-> DUPLICATE_CHECK
-> STAGING_LOAD
-> REVIEW
-> PROMOTION
-> AUDIT
```

## Réutilisation de l’existant

Le socle existant `/api/v1/ingestion/*` couvre déjà :

- upload ;
- validation structurelle ;
- mapping ;
- détection de doublons ;
- dry-run ;
- audit.

Le module 114 doit généraliser ce socle à toutes les classes métier.
