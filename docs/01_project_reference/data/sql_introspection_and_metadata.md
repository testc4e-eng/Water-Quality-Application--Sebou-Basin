# SQL Introspection And Metadata

| Champ | Valeur |
|---|---|
| Statut | Actif |
| Type | reference |
| Périmètre | playbook d’introspection SQL et de rafraîchissement de la documentation BD |
| Source de vérité | Non |
| Documents liés | [DATABASE_SCHEMA](./DATABASE_SCHEMA.md), [generated/db_introspection_snapshot_2026-04-10.json](./generated/db_introspection_snapshot_2026-04-10.json) |
| Dernière mise à jour | 2026-04-10 |

## Usage

Ce document ne concurrence pas `DATABASE_SCHEMA.md`. Il sert de support opératoire pour :

- rejouer une introspection SQL ;
- mettre à jour le snapshot JSON ;
- vérifier les schémas, objets, colonnes, contraintes, index et dépendances ;
- contrôler les volumétrie repères avant rédaction d’un rapport.

## Requêtes de base à réexécuter

```sql
-- Schémas et comptages d’objets
SELECT n.nspname AS schema_name,
       COUNT(*) FILTER (WHERE c.relkind = 'r') AS table_count,
       COUNT(*) FILTER (WHERE c.relkind = 'v') AS view_count,
       COUNT(*) FILTER (WHERE c.relkind = 'm') AS materialized_view_count
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
  AND n.nspname NOT LIKE '_timescaledb%'
  AND c.relkind IN ('r', 'v', 'm')
GROUP BY n.nspname
ORDER BY n.nspname;
```

```sql
-- Colonnes et types
SELECT table_schema, table_name, ordinal_position, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
  AND table_schema NOT LIKE '_timescaledb%'
ORDER BY table_schema, table_name, ordinal_position;
```

```sql
-- PK / FK
SELECT n.nspname AS schema_name,
       c.relname AS object_name,
       con.conname AS constraint_name,
       con.contype,
       a.attname AS column_name,
       n2.nspname AS ref_schema,
       c2.relname AS ref_table,
       a2.attname AS ref_column
FROM pg_constraint con
JOIN pg_class c ON c.oid = con.conrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_class c2 ON c2.oid = con.confrelid
LEFT JOIN pg_namespace n2 ON n2.oid = c2.relnamespace
LEFT JOIN LATERAL unnest(con.conkey) WITH ORDINALITY AS ck(attnum, ord) ON TRUE
LEFT JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum = ck.attnum
LEFT JOIN LATERAL unnest(con.confkey) WITH ORDINALITY AS fk(attnum, ord) ON fk.ord = ck.ord
LEFT JOIN pg_attribute a2 ON a2.attrelid = c2.oid AND a2.attnum = fk.attnum
WHERE con.contype IN ('p', 'f')
  AND n.nspname NOT IN ('pg_catalog', 'information_schema')
  AND n.nspname NOT LIKE '_timescaledb%';
```

## Fichier d’évidence à maintenir

- `docs/01_project_reference/data/generated/db_introspection_snapshot_2026-04-10.json`
