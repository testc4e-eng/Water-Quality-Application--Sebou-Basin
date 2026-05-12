-- VALIDATION REQUISE - NON EXECUTE
-- Projet SAD Sebou / WQDSS
-- Objectif : cloturer MO_METAL en preservant strictement la casse metier.
--
-- Decision C4E :
--   MO = Matieres organiques
--   Mo = Molybdene
--
-- Regles critiques :
--   - ne jamais mapper MO_METAL vers MO ;
--   - creer/synchroniser la cible distincte Mo ;
--   - ne pas toucher NUMEROTATION ;
--   - ne pas utiliser ctid ;
--   - conserver ROLLBACK actif par defaut.

BEGIN;

-- 1. Backup logique referentiels concernes
CREATE TABLE IF NOT EXISTS audit.bkp_ref_param_mo_case_resolution_20260508 AS
SELECT
  'canonique' AS source_ref,
  parametre_ref_id::text AS id,
  code_parametre AS code,
  nom_parametre AS libelle,
  unite_reference AS unite,
  aliases::text AS aliases_snapshot,
  now() AS backup_at
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre IN ('MO', 'Mo')
UNION ALL
SELECT
  'legacy_fk' AS source_ref,
  id::text AS id,
  code_canonique AS code,
  libelle,
  unite,
  NULL::text AS aliases_snapshot,
  now() AS backup_at
FROM metadata.referentiel_parametre
WHERE code_canonique IN ('MO', 'Mo');

-- 2. Backup logique des 11 lignes candidates
CREATE TABLE IF NOT EXISTS audit.bkp_qualite_mo_metal_to_mo_case_20260508 AS
SELECT q.*, now() AS backup_at
FROM qualite.suivi_qualite_barrage_garde_hebdo q
JOIN staging.raw_suivi_qualite_brg_garde_hebdo r ON r.id = q.source_row_id
WHERE q.parametre_ref_id IS NULL
  AND upper(trim(q.parametre_qualite)) = 'MO_METAL'
  AND r.parametre_qualite LIKE 'Molybd%';

-- 3. Creation cible canonique Mo si absente, sans modifier MO
WITH target AS (
  SELECT gen_random_uuid() AS id
  WHERE NOT EXISTS (
    SELECT 1
    FROM metadata.referentiel_parametre_canonique
    WHERE code_parametre = 'Mo'
  )
)
INSERT INTO metadata.referentiel_parametre_canonique (
  parametre_ref_id,
  code_parametre,
  nom_parametre,
  type_metier,
  aliases,
  domaine,
  sous_domaine,
  famille,
  unite_reference,
  type_geo_supporte,
  table_cible,
  source_origine,
  type_source,
  categorie_dashboard,
  scenario_compatible,
  description_metier,
  statut
)
SELECT
  id,
  'Mo',
  'Molybdene',
  'qualite_eau',
  '["Molybdene(mg/l)", "Molybdene(mg/L)", "MO_METAL"]'::jsonb,
  'qualite',
  'physicochimie',
  'metaux_traces',
  'mg/L',
  'station|barrage|nappe|segment',
  NULL,
  'dictionnaire_C4E',
  'REFERENTIEL_C4E',
  'qualite',
  true,
  'Molybdene, element chimique / metal trace. Ne pas confondre avec MO = Matieres organiques.',
  'ACTIF'
FROM target;

-- 4. Synchronisation FK legacy metadata.referentiel_parametre pour Mo si absente
INSERT INTO metadata.referentiel_parametre (
  id,
  domaine,
  code_canonique,
  libelle,
  unite,
  description,
  actif,
  created_at,
  updated_at
)
SELECT
  c.parametre_ref_id,
  'qualite',
  'Mo',
  'Molybdene',
  'mg/L',
  'Molybdene, element chimique / metal trace. Ne pas confondre avec MO = Matieres organiques.',
  true,
  now(),
  now()
FROM metadata.referentiel_parametre_canonique c
WHERE c.code_parametre = 'Mo'
  AND NOT EXISTS (
    SELECT 1
    FROM metadata.referentiel_parametre r
    WHERE r.code_canonique = 'Mo'
  );

-- 5. Assertions avant UPDATE
DO $$
DECLARE
  v_can_count integer;
  v_fk_count integer;
  v_candidates integer;
BEGIN
  SELECT count(*) INTO v_can_count
  FROM metadata.referentiel_parametre_canonique
  WHERE code_parametre = 'Mo'
    AND statut = 'ACTIF';

  SELECT count(*) INTO v_fk_count
  FROM metadata.referentiel_parametre
  WHERE code_canonique = 'Mo'
    AND actif IS TRUE;

  SELECT count(*) INTO v_candidates
  FROM qualite.suivi_qualite_barrage_garde_hebdo q
  JOIN staging.raw_suivi_qualite_brg_garde_hebdo r ON r.id = q.source_row_id
  WHERE q.parametre_ref_id IS NULL
    AND upper(trim(q.parametre_qualite)) = 'MO_METAL'
    AND r.parametre_qualite LIKE 'Molybd%';

  IF v_can_count <> 1 THEN
    RAISE EXCEPTION 'Cible canonique Mo invalide: %', v_can_count;
  END IF;
  IF v_fk_count <> 1 THEN
    RAISE EXCEPTION 'Cible FK Mo invalide: %', v_fk_count;
  END IF;
  IF v_candidates <> 11 THEN
    RAISE EXCEPTION 'Volume candidat MO_METAL invalide: %', v_candidates;
  END IF;
END $$;

-- 6. Mapping strict MO_METAL -> Mo, jamais vers MO
UPDATE qualite.suivi_qualite_barrage_garde_hebdo q
SET parametre_ref_id = rp.id,
    qa_flag_param_missing = false,
    qa_checked_at = now()
FROM metadata.referentiel_parametre rp,
     staging.raw_suivi_qualite_brg_garde_hebdo r
WHERE rp.code_canonique = 'Mo'
  AND r.id = q.source_row_id
  AND q.parametre_ref_id IS NULL
  AND upper(trim(q.parametre_qualite)) = 'MO_METAL'
  AND r.parametre_qualite LIKE 'Molybd%';

-- 7. Validations post-update avant COMMIT
SELECT 'mo_metal_restant' AS controle, count(*) AS valeur
FROM qualite.suivi_qualite_barrage_garde_hebdo
WHERE parametre_ref_id IS NULL
  AND upper(trim(parametre_qualite)) = 'MO_METAL'
UNION ALL
SELECT 'numerotation_restant' AS controle, count(*) AS valeur
FROM qualite.mesure_qualite_nappe
WHERE parametre_ref_id IS NULL
  AND upper(trim(parametre_qualite)) = 'NUMEROTATION'
UNION ALL
SELECT 'fk_orphelines_qualite' AS controle, count(*) AS valeur
FROM (
  SELECT parametre_ref_id FROM qualite.mesure_qualite_riviere WHERE parametre_ref_id IS NOT NULL
  UNION ALL
  SELECT parametre_ref_id FROM qualite.mesure_qualite_nappe WHERE parametre_ref_id IS NOT NULL
  UNION ALL
  SELECT parametre_ref_id FROM qualite.mesure_qualite_sebou WHERE parametre_ref_id IS NOT NULL
  UNION ALL
  SELECT parametre_ref_id FROM qualite.suivi_qualite_barrage_garde_hebdo WHERE parametre_ref_id IS NOT NULL
) q
LEFT JOIN metadata.referentiel_parametre rp ON rp.id = q.parametre_ref_id
WHERE rp.id IS NULL
UNION ALL
SELECT 'mo_metal_mappe_vers_MO_interdit' AS controle, count(*) AS valeur
FROM qualite.suivi_qualite_barrage_garde_hebdo q
JOIN metadata.referentiel_parametre rp ON rp.id = q.parametre_ref_id
WHERE q.parametre_qualite = 'MO_METAL'
  AND rp.code_canonique = 'MO'
UNION ALL
SELECT 'mo_metal_mappe_vers_Mo' AS controle, count(*) AS valeur
FROM qualite.suivi_qualite_barrage_garde_hebdo q
JOIN metadata.referentiel_parametre rp ON rp.id = q.parametre_ref_id
WHERE q.parametre_qualite = 'MO_METAL'
  AND rp.code_canonique = 'Mo';

ROLLBACK;
-- COMMIT;
