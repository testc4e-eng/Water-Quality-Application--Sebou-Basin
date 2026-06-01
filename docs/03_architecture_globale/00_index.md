# Architecture globale SAD/WQDSS

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | index stratégique |
| Périmètre | orientation vers les documents d'architecture actifs |
| Source de vérité | Non, index |
| Dernière mise à jour | 2026-05-22 |

## Documents à consulter

| Besoin | Document |
|---|---|
| Architecture réelle consolidée | `docs/00_SOURCE_OF_TRUTH_MASTER.md` |
| Architecture agents | `docs/03_ai_knowledge_base/architecture_for_agents.md` |
| Architecture système détaillée | `docs/01_project_reference/architecture/system_architecture.md` |
| Architecture base de données | `docs/01_project_reference/architecture/database_architecture.md` |
| API réelle et cible | `docs/03_ai_knowledge_base/api_for_agents.md`, `docs/01_project_reference/backend/backend_overview.md` |

## Position actuelle

L'architecture opérationnelle reste une architecture web trois couches :

```text
React / MapLibre / dashboards
  -> FastAPI /api/v1
  -> PostgreSQL + PostGIS + TimescaleDB
```

Les chantiers `Model Build`, `Feature Store`, `Graph AI` et `SWAT/WASP` sont préparés mais ne remplacent pas encore l'architecture opérationnelle.

