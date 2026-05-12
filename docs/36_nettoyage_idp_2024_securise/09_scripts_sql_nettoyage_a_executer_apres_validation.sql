-- ÉTAPE 1 : vérifier les lignes candidates
SELECT COUNT(*)
FROM public.mesures_idp_2024_qualite_marche_cadre
WHERE val_qual IS NULL
   OR trim(coalesce(val_qual, '')) = '';

-- ÉTAPE 2 : déplacer vers quarantaine
INSERT INTO quarantine.idp_2024_invalid_values (source_table, invalid_type, reason, payload)
SELECT
  'public.mesures_idp_2024_qualite_marche_cadre',
  'VALUE_NULL',
  'val_qual vide',
  to_jsonb(t)
FROM public.mesures_idp_2024_qualite_marche_cadre t
WHERE val_qual IS NULL
   OR trim(coalesce(val_qual, '')) = '';

-- ÉTAPE 3 : supprimer après validation
DELETE FROM public.mesures_idp_2024_qualite_marche_cadre
WHERE val_qual IS NULL
   OR trim(coalesce(val_qual, '')) = '';

-- ÉTAPE 1 : vérifier les recouvrements qualité globale / marché cadre
WITH a AS (
  SELECT ctid, pts_prelevement, date_jr_prelevement, parametre_qualite, val_qual
  FROM public.mesures_idp_2024_qualite_globale
),
b AS (
  SELECT pts_prelevement, date_jr_prelevement, parametre_qualite, val_qual
  FROM public.mesures_idp_2024_qualite_marche_cadre
)
SELECT COUNT(*)
FROM a
JOIN b USING (pts_prelevement, date_jr_prelevement, parametre_qualite, val_qual);

-- ÉTAPE 2 : déplacer vers quarantaine
INSERT INTO quarantine.idp_2024_duplicates (source_table, duplicate_type, reason, payload)
SELECT
  'public.mesures_idp_2024_qualite_globale',
  'GLOBAL_MARCHE_OVERLAP',
  'recouvrement avec marche cadre',
  to_jsonb(t)
FROM public.mesures_idp_2024_qualite_globale t
WHERE EXISTS (
  SELECT 1
  FROM public.mesures_idp_2024_qualite_marche_cadre m
  WHERE m.pts_prelevement = t.pts_prelevement
    AND m.date_jr_prelevement = t.date_jr_prelevement
    AND m.parametre_qualite = t.parametre_qualite
    AND m.val_qual = t.val_qual
);

-- ÉTAPE 3 : supprimer après validation
DELETE FROM public.mesures_idp_2024_qualite_globale t
WHERE EXISTS (
  SELECT 1
  FROM public.mesures_idp_2024_qualite_marche_cadre m
  WHERE m.pts_prelevement = t.pts_prelevement
    AND m.date_jr_prelevement = t.date_jr_prelevement
    AND m.parametre_qualite = t.parametre_qualite
    AND m.val_qual = t.val_qual
);

-- ÉTAPE 1 : vérifier les recouvrements source pollution globale / marché cadre
WITH a AS (
  SELECT pts_prelevement, date_jr_prelevement, commune, coalesce(nature, '[null]') as nature
  FROM public.mesures_idp_2024_src_pollution_globale
),
b AS (
  SELECT pts_prelevement, date_jr_prelevement, commune, coalesce(nature, '[null]') as nature
  FROM public.mesures_idp_2024_src_pollution_marche_cadre
)
SELECT COUNT(*)
FROM a
JOIN b USING (pts_prelevement, date_jr_prelevement, commune, nature);

-- ÉTAPE 2 : déplacer vers quarantaine
INSERT INTO quarantine.idp_2024_duplicates (source_table, duplicate_type, reason, payload)
SELECT
  'public.mesures_idp_2024_src_pollution_globale',
  'GLOBAL_MARCHE_OVERLAP',
  'recouvrement avec marche cadre',
  to_jsonb(t)
FROM public.mesures_idp_2024_src_pollution_globale t
WHERE EXISTS (
  SELECT 1
  FROM public.mesures_idp_2024_src_pollution_marche_cadre m
  WHERE m.pts_prelevement = t.pts_prelevement
    AND m.date_jr_prelevement = t.date_jr_prelevement
    AND m.commune = t.commune
    AND coalesce(m.nature, '[null]') = coalesce(t.nature, '[null]')
);

-- ÉTAPE 3 : supprimer après validation
DELETE FROM public.mesures_idp_2024_src_pollution_globale t
WHERE EXISTS (
  SELECT 1
  FROM public.mesures_idp_2024_src_pollution_marche_cadre m
  WHERE m.pts_prelevement = t.pts_prelevement
    AND m.date_jr_prelevement = t.date_jr_prelevement
    AND m.commune = t.commune
    AND coalesce(m.nature, '[null]') = coalesce(t.nature, '[null]')
);

-- IMPORTANT
-- Aucun DELETE ne doit être exécuté avant :
-- 1. backup complet
-- 2. quarantaine
-- 3. validation explicite métier et projet
-- 4. contrôle des volumes attendus
