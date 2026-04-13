# Data & Database Documentation

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | index |
| Périmètre | documentation active de la base de données et des flux de données |
| Source de vérité | Oui |
| Documents liés | [DATABASE_SCHEMA](./DATABASE_SCHEMA.md), [database_architecture](../architecture/database_architecture.md) |
| Dernière mise à jour | 2026-04-10 |

## Documents maîtres actifs

- [DATABASE_SCHEMA](./DATABASE_SCHEMA.md) : référentiel maître de la structure réelle de la base, objets, colonnes, relations, index et usages.
- [DATA_MODELS](./DATA_MODELS.md) : modèle logique des entités métier et relations structurantes.
- [DATA_FLOW](./DATA_FLOW.md) : flux de données depuis l’ingestion jusqu’à la restitution.
- [DATA_QUALITY](./DATA_QUALITY.md) : règles de validation, QA, traçabilité et gouvernance de qualité.
- [API_DATA_MAPPING](./API_DATA_MAPPING.md) : mapping backend/API ↔ vues SQL ↔ tables métier ↔ écrans.

## Références complémentaires actives

- [data_sources_reference](./data_sources_reference.md) : inventaire des sources et familles de données.
- [data_migration_history_summary](./data_migration_history_summary.md) : historique synthétique des migrations et reprises de données.
- [sql_introspection_and_metadata](./sql_introspection_and_metadata.md) : playbook d’introspection et d’actualisation documentaire.
- [generated/db_introspection_snapshot_2026-04-10.json](./generated/db_introspection_snapshot_2026-04-10.json) : snapshot JSON issu d’une introspection SQL réelle.

## Règle de lecture

- Utiliser `DATABASE_SCHEMA.md` comme source de vérité détaillée.
- Utiliser `database_architecture.md` pour la vue d’ensemble architecturale.
- Utiliser `DATABASE_SCHEMA_SUMMARY.md` dans `03_ai_knowledge_base/` pour un accès rapide côté agents.
- Traiter `docs/99_legacy_archive/*` comme historique uniquement.
