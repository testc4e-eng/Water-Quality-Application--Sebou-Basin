# Database For Agents

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | summary |
| Périmètre | orientation rapide des agents sur la base de données |
| Source de vérité | Non |
| Documents liés | [DATABASE_SCHEMA_SUMMARY](./DATABASE_SCHEMA_SUMMARY.md), [DATABASE_SCHEMA](../01_project_reference/data/DATABASE_SCHEMA.md) |
| Dernière mise à jour | 2026-04-10 |

## Point d’entrée recommandé

- Lire d’abord [DATABASE_SCHEMA_SUMMARY](./DATABASE_SCHEMA_SUMMARY.md).
- Descendre ensuite vers [DATABASE_SCHEMA](../01_project_reference/data/DATABASE_SCHEMA.md) pour le détail complet.
- Utiliser [API_DATA_MAPPING](../01_project_reference/data/API_DATA_MAPPING.md) pour relier écrans, routes et objets SQL.
- Utiliser [DATA_MODELS](../01_project_reference/data/DATA_MODELS.md) pour raisonner en entités métier.

## Raccourci opérationnel

- Cartographie : `api.viz_carto_layers`, `api.mv_*_geojson`, `metadata.popup_rules_config`.
- Dashboards : `analytics.mv_dashboard_*`, `api.viz_*_timeseries`.
- Scénarios : `swat_sebou.*`, `wasp_sebou.*`, `qa.variable_thresholds`, `audit.ingestion_audit_logs`.
- Sécurité : `security.users`, `roles`, `permissions`, `activity_logs`, `auth_logs`.
