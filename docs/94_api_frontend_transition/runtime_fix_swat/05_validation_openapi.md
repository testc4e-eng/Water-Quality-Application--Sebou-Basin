# Validation OpenAPI

## Résultat

| Contrôle | Statut |
|---|---|
| `/openapi.json` généré | `OK` |
| `/docs` accessible | `OK` |
| Routes P0 qualité visibles | `OK` |
| Routes SWAT analysis absentes si désactivées | `OK` |
| Routes ingestion absentes si désactivées | `OK` |
| Erreur FastAPI bloquante | `0` |

## Routes P0 visibles

- `/api/v1/qualite/metaux`
- `/api/v1/qualite/chimie-minerale`
- `/api/v1/qualite/physicochimie`
- `/api/v1/qualite/pollution-organique`

## Routes optionnelles

Par défaut :

- `/api/v1/swat/analysis/*` non exposé.
- `/api/v1/ingestion/*` non exposé.

Pour les réactiver, valider d'abord l'environnement scientifique puis définir :

```text
SAD_ENABLE_SWAT_ANALYSIS=true
SAD_ENABLE_INGESTION_API=true
```

## Warnings non bloquants

OpenAPI signale des `operationId` dupliqués pour certaines routes `swat`. Ce point ne bloque pas le runtime mais doit être nettoyé dans un backlog technique.
