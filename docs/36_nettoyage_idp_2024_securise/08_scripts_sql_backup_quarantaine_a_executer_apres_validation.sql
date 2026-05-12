-- À EXÉCUTER UNIQUEMENT APRÈS VALIDATION EXPLICITE

CREATE SCHEMA IF NOT EXISTS audit_migration;
CREATE SCHEMA IF NOT EXISTS quarantine;

-- À EXÉCUTER UNIQUEMENT APRÈS VALIDATION EXPLICITE
-- Backup complet des 4 tables IDP 2024
CREATE TABLE audit_migration.backup_mesures_idp_2024_qualite_globale_20260424 AS
SELECT *
FROM public.mesures_idp_2024_qualite_globale;

CREATE TABLE audit_migration.backup_mesures_idp_2024_qualite_marche_cadre_20260424 AS
SELECT *
FROM public.mesures_idp_2024_qualite_marche_cadre;

CREATE TABLE audit_migration.backup_mesures_idp_2024_src_pollution_globale_20260424 AS
SELECT *
FROM public.mesures_idp_2024_src_pollution_globale;

CREATE TABLE audit_migration.backup_mesures_idp_2024_src_pollution_marche_cadre_20260424 AS
SELECT *
FROM public.mesures_idp_2024_src_pollution_marche_cadre;

-- À EXÉCUTER UNIQUEMENT APRÈS VALIDATION EXPLICITE
-- Tables de quarantaine
CREATE TABLE IF NOT EXISTS quarantine.idp_2024_conflicts (
  source_table text,
  conflict_type text,
  reason text,
  payload jsonb,
  quarantined_at timestamp default now()
);

CREATE TABLE IF NOT EXISTS quarantine.idp_2024_param_unmapped (
  source_table text,
  reason text,
  payload jsonb,
  quarantined_at timestamp default now()
);

CREATE TABLE IF NOT EXISTS quarantine.idp_2024_source_unmapped (
  source_table text,
  reason text,
  payload jsonb,
  quarantined_at timestamp default now()
);

CREATE TABLE IF NOT EXISTS quarantine.idp_2024_duplicates (
  source_table text,
  duplicate_type text,
  reason text,
  payload jsonb,
  quarantined_at timestamp default now()
);

CREATE TABLE IF NOT EXISTS quarantine.idp_2024_invalid_values (
  source_table text,
  invalid_type text,
  reason text,
  payload jsonb,
  quarantined_at timestamp default now()
);

-- À EXÉCUTER UNIQUEMENT APRÈS VALIDATION EXPLICITE
-- Quarantaine des recouvrements qualité globale / marché cadre
INSERT INTO quarantine.idp_2024_conflicts (source_table, conflict_type, reason, payload)
SELECT
  'public.mesures_idp_2024_qualite_globale_vs_marche_cadre',
  'GLOBAL_MARCHE_OVERLAP',
  'Meme point + date + parametre + valeur dans globale et marche cadre',
  to_jsonb(x)
FROM (
  WITH a AS (
    SELECT *
    FROM public.mesures_idp_2024_qualite_globale
  ),
  b AS (
    SELECT *
    FROM public.mesures_idp_2024_qualite_marche_cadre
  )
  SELECT a.pts_prelevement, a.date_jr_prelevement, a.parametre_qualite, a.val_qual
  FROM a
  JOIN b
    ON a.pts_prelevement = b.pts_prelevement
   AND a.date_jr_prelevement = b.date_jr_prelevement
   AND a.parametre_qualite = b.parametre_qualite
   AND a.val_qual = b.val_qual
) x;

-- À EXÉCUTER UNIQUEMENT APRÈS VALIDATION EXPLICITE
-- Quarantaine des recouvrements source pollution globale / marché cadre
INSERT INTO quarantine.idp_2024_conflicts (source_table, conflict_type, reason, payload)
SELECT
  'public.mesures_idp_2024_src_pollution_globale_vs_marche_cadre',
  'GLOBAL_MARCHE_OVERLAP',
  'Meme point + date + commune + nature dans globale et marche cadre',
  to_jsonb(x)
FROM (
  WITH a AS (
    SELECT pts_prelevement, date_jr_prelevement, commune, coalesce(nature, '[null]') as nature
    FROM public.mesures_idp_2024_src_pollution_globale
  ),
  b AS (
    SELECT pts_prelevement, date_jr_prelevement, commune, coalesce(nature, '[null]') as nature
    FROM public.mesures_idp_2024_src_pollution_marche_cadre
  )
  SELECT *
  FROM a
  JOIN b USING (pts_prelevement, date_jr_prelevement, commune, nature)
) x;

-- À EXÉCUTER UNIQUEMENT APRÈS VALIDATION EXPLICITE
-- Quarantaine des valeurs qualité vides
INSERT INTO quarantine.idp_2024_invalid_values (source_table, invalid_type, reason, payload)
SELECT
  'public.mesures_idp_2024_qualite_marche_cadre',
  'VALUE_NULL',
  'val_qual vide',
  to_jsonb(t)
FROM public.mesures_idp_2024_qualite_marche_cadre t
WHERE val_qual IS NULL
   OR trim(coalesce(val_qual, '')) = '';

-- À EXÉCUTER UNIQUEMENT APRÈS VALIDATION EXPLICITE
-- Quarantaine des valeurs non numériques
INSERT INTO quarantine.idp_2024_invalid_values (source_table, invalid_type, reason, payload)
SELECT
  'public.mesures_idp_2024_qualite_globale',
  'VALUE_NON_NUMERIC',
  'val_qual non directement convertible',
  to_jsonb(t)
FROM public.mesures_idp_2024_qualite_globale t
WHERE val_qual !~ '^\s*-?\d+(?:[\.,]\d+)?\s*$'
  AND trim(coalesce(val_qual, '')) <> '';

INSERT INTO quarantine.idp_2024_invalid_values (source_table, invalid_type, reason, payload)
SELECT
  'public.mesures_idp_2024_qualite_marche_cadre',
  'VALUE_NON_NUMERIC',
  'val_qual non directement convertible',
  to_jsonb(t)
FROM public.mesures_idp_2024_qualite_marche_cadre t
WHERE val_qual !~ '^\s*-?\d+(?:[\.,]\d+)?\s*$'
  AND trim(coalesce(val_qual, '')) <> '';
