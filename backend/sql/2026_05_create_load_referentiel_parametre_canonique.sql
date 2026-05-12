\set ON_ERROR_STOP on

-- =============================================================================
-- 2026-05-07
-- Creation + chargement de metadata.referentiel_parametre_canonique
-- Portee:
--   - backup prealable des referentiels metadata existants
--   - creation idempotente de la table canonique
--   - chargement / upsert sans toucher aux tables metier migrees
--   - audit explicite dans audit.ingestion_audit_logs
-- =============================================================================

\echo '=== Phase validee: creation + chargement metadata.referentiel_parametre_canonique ==='

SET client_min_messages TO NOTICE;

CREATE TEMP TABLE referentiel_canonique_exec_ctx (
    executed_at timestamptz NOT NULL,
    source_backup_table text NOT NULL,
    target_backup_table text NULL
);

DO $$
DECLARE
    v_suffix text := to_char(clock_timestamp(), 'YYYYMMDD_HH24MISS_US');
    v_source_backup text := format('bkp_metadata_referentiel_parametre_%s', v_suffix);
    v_target_backup text := NULL;
BEGIN
    EXECUTE format(
        'CREATE TABLE audit.%I AS TABLE metadata.referentiel_parametre',
        v_source_backup
    );

    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'metadata'
          AND table_name = 'referentiel_parametre_canonique'
    ) THEN
        v_target_backup := format('bkp_metadata_referentiel_parametre_canonique_%s', v_suffix);
        EXECUTE format(
            'CREATE TABLE audit.%I AS TABLE metadata.referentiel_parametre_canonique',
            v_target_backup
        );
    END IF;

    INSERT INTO pg_temp.referentiel_canonique_exec_ctx (executed_at, source_backup_table, target_backup_table)
    VALUES (clock_timestamp(), v_source_backup, v_target_backup);

    INSERT INTO audit.ingestion_audit_logs (
        action,
        utilisateur,
        horodatage,
        resultat_statut,
        resultat_nb_lignes,
        message_lisible,
        metadata
    )
    VALUES (
        'REF_PARAM_CANONIQUE_LOAD',
        current_user,
        clock_timestamp(),
        'STARTED',
        (SELECT COUNT(*)::int FROM metadata.referentiel_parametre),
        'Backup prealable du referentiel parametre avant creation/chargement du referentiel canonique.',
        jsonb_build_object(
            'scope', 'metadata only',
            'touches_tables_metier_migrees', false,
            'source_backup_table', format('audit.%s', v_source_backup),
            'target_backup_table', CASE
                WHEN v_target_backup IS NULL THEN NULL
                ELSE format('audit.%s', v_target_backup)
            END,
            'validated_barrage_rules', jsonb_build_object(
                'DEBIT', 'm3/s',
                'LACHER', 'Mm3/j',
                'APPORT', 'Mm3/j',
                'TRANSFERT', 'Mm3/j',
                'VOLUME', 'Mm3',
                'NIVEAU_EAU', 'm'
            )
        )
    );

    RAISE NOTICE 'Backup source cree: audit.%', v_source_backup;
    IF v_target_backup IS NOT NULL THEN
        RAISE NOTICE 'Backup cible cree: audit.%', v_target_backup;
    END IF;
END
$$;

BEGIN;

CREATE TABLE IF NOT EXISTS metadata.referentiel_parametre_canonique (
    parametre_ref_id uuid PRIMARY KEY,
    code_parametre text NOT NULL UNIQUE,
    nom_parametre text NOT NULL,
    type_metier text NOT NULL,
    aliases jsonb NOT NULL DEFAULT '[]'::jsonb,
    domaine text NOT NULL,
    sous_domaine text NULL,
    famille text NULL,
    unite_reference text NULL,
    type_geo_supporte text NOT NULL,
    table_cible text NULL,
    source_origine text NOT NULL,
    type_source text NOT NULL,
    categorie_dashboard text NULL,
    seuil_min numeric NULL,
    seuil_max numeric NULL,
    norme text NULL,
    scenario_compatible boolean NOT NULL DEFAULT true,
    description_metier text NULL,
    statut text NOT NULL DEFAULT 'ACTIF',
    date_creation timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT chk_ref_param_canonique_aliases_array
        CHECK (jsonb_typeof(aliases) = 'array')
);

CREATE INDEX IF NOT EXISTS idx_ref_param_canonique_domaine
    ON metadata.referentiel_parametre_canonique (domaine, sous_domaine);

CREATE INDEX IF NOT EXISTS idx_ref_param_canonique_geo
    ON metadata.referentiel_parametre_canonique (type_geo_supporte);

CREATE INDEX IF NOT EXISTS idx_ref_param_canonique_type_metier
    ON metadata.referentiel_parametre_canonique (type_metier);

COMMENT ON TABLE metadata.referentiel_parametre_canonique IS
'Referentiel metier unique et definitif de tous les parametres exposes par SAD Sebou.';

WITH passthrough AS (
    SELECT
        rp.id AS parametre_ref_id,
        rp.code_canonique AS code_parametre,
        COALESCE(rp.libelle, rp.code_canonique) AS nom_parametre,
        CASE
            WHEN rp.domaine = 'hydro' AND rp.unite = 'm3/s' THEN 'debit'
            WHEN rp.domaine = 'hydro' AND rp.unite = 'm' THEN 'niveau'
            WHEN rp.domaine = 'qualite' THEN 'qualite_eau'
            WHEN rp.domaine = 'meteo' THEN 'climat'
            ELSE 'a_completer'
        END AS type_metier,
        '[]'::jsonb AS aliases,
        rp.domaine,
        NULL::text AS sous_domaine,
        NULL::text AS famille,
        rp.unite AS unite_reference,
        CASE
            WHEN rp.domaine = 'hydro' THEN 'station|barrage|source|segment|subbasin'
            WHEN rp.domaine = 'meteo' THEN 'station'
            WHEN rp.domaine = 'qualite' THEN 'station|barrage|nappe|segment'
            ELSE 'station|barrage|nappe|segment|subbasin|source'
        END AS type_geo_supporte,
        NULL::text AS table_cible,
        'metadata.referentiel_parametre'::text AS source_origine,
        'REFERENTIEL_EXISTANT'::text AS type_source,
        CASE
            WHEN rp.domaine = 'hydro' THEN 'hydrologie'
            WHEN rp.domaine = 'meteo' THEN 'climat'
            WHEN rp.domaine = 'qualite' THEN 'qualite'
            ELSE 'a_completer'
        END AS categorie_dashboard,
        NULL::numeric AS seuil_min,
        NULL::numeric AS seuil_max,
        NULL::text AS norme,
        true AS scenario_compatible,
        rp.description AS description_metier,
        CASE
            WHEN COALESCE(rp.actif, true) THEN 'ACTIF'
            ELSE 'INACTIF'
        END AS statut,
        COALESCE(rp.created_at, now()) AS date_creation
    FROM metadata.referentiel_parametre rp
    WHERE rp.code_canonique NOT IN ('DEBIT', 'LACHER', 'VOLUME_BARRAGE', 'VOLUME', 'APPORT', 'APPORTS_HM3', 'TRANSFERT')
),
debit_canonique AS (
    SELECT
        COALESCE(
            (
                SELECT rp.id
                FROM metadata.referentiel_parametre rp
                WHERE rp.code_canonique = 'DEBIT'
                ORDER BY CASE WHEN rp.domaine = 'hydro' THEN 0 ELSE 1 END, rp.created_at NULLS LAST, rp.id
                LIMIT 1
            ),
            (
                (
                    substr(md5('DEBIT'), 1, 8) || '-' ||
                    substr(md5('DEBIT'), 9, 4) || '-' ||
                    substr(md5('DEBIT'), 13, 4) || '-' ||
                    substr(md5('DEBIT'), 17, 4) || '-' ||
                    substr(md5('DEBIT'), 21, 12)
                )::uuid
            )
        ) AS parametre_ref_id,
        'DEBIT'::text AS code_parametre,
        'Debit'::text AS nom_parametre,
        'debit'::text AS type_metier,
        jsonb_build_array('debit', 'FLOW') AS aliases,
        'hydro'::text AS domaine,
        'hydrologie'::text AS sous_domaine,
        'flux'::text AS famille,
        'm3/s'::text AS unite_reference,
        'station|source|segment|subbasin'::text AS type_geo_supporte,
        'hydro.mesure_debit'::text AS table_cible,
        'metadata.referentiel_parametre'::text AS source_origine,
        'FUSION_EXISTANT'::text AS type_source,
        'hydrologie'::text AS categorie_dashboard,
        NULL::numeric AS seuil_min,
        NULL::numeric AS seuil_max,
        NULL::text AS norme,
        true AS scenario_compatible,
        'Debit instantane de reference. La collision legacy qualite doit rester ignoree en exposition finale.'::text AS description_metier,
        'ACTIF'::text AS statut,
        COALESCE(
            (
                SELECT MIN(rp.created_at)
                FROM metadata.referentiel_parametre rp
                WHERE rp.code_canonique = 'DEBIT'
            ),
            now()
        ) AS date_creation
),
volume_canonique AS (
    SELECT
        COALESCE(
            (
                SELECT rp.id
                FROM metadata.referentiel_parametre rp
                WHERE rp.code_canonique IN ('VOLUME', 'VOLUME_BARRAGE')
                ORDER BY CASE WHEN rp.code_canonique = 'VOLUME' THEN 0 ELSE 1 END, rp.created_at NULLS LAST, rp.id
                LIMIT 1
            ),
            (
                (
                    substr(md5('VOLUME'), 1, 8) || '-' ||
                    substr(md5('VOLUME'), 9, 4) || '-' ||
                    substr(md5('VOLUME'), 13, 4) || '-' ||
                    substr(md5('VOLUME'), 17, 4) || '-' ||
                    substr(md5('VOLUME'), 21, 12)
                )::uuid
            )
        ) AS parametre_ref_id,
        'VOLUME'::text AS code_parametre,
        'Volume barrage'::text AS nom_parametre,
        'volume_stockage'::text AS type_metier,
        jsonb_build_array('VOLUME_BARRAGE', 'volume_mm3') AS aliases,
        'hydro'::text AS domaine,
        'hydrologie barrage'::text AS sous_domaine,
        'stock'::text AS famille,
        'Mm3'::text AS unite_reference,
        'barrage'::text AS type_geo_supporte,
        'hydro.mesure_barrage_param'::text AS table_cible,
        'metadata.referentiel_parametre + staging.raw_mesures_niv_eau_barrages'::text AS source_origine,
        'ALIAS_MERGED'::text AS type_source,
        'hydrologie'::text AS categorie_dashboard,
        NULL::numeric AS seuil_min,
        NULL::numeric AS seuil_max,
        NULL::text AS norme,
        true AS scenario_compatible,
        'Volume de stockage barrage.'::text AS description_metier,
        'ACTIF'::text AS statut,
        COALESCE(
            (
                SELECT MIN(rp.created_at)
                FROM metadata.referentiel_parametre rp
                WHERE rp.code_canonique IN ('VOLUME', 'VOLUME_BARRAGE')
            ),
            now()
        ) AS date_creation
),
lacher_canonique AS (
    SELECT
        COALESCE(
            (
                SELECT rp.id
                FROM metadata.referentiel_parametre rp
                WHERE rp.code_canonique = 'LACHER'
                ORDER BY rp.created_at NULLS LAST, rp.id
                LIMIT 1
            ),
            (
                (
                    substr(md5('LACHER'), 1, 8) || '-' ||
                    substr(md5('LACHER'), 9, 4) || '-' ||
                    substr(md5('LACHER'), 13, 4) || '-' ||
                    substr(md5('LACHER'), 17, 4) || '-' ||
                    substr(md5('LACHER'), 21, 12)
                )::uuid
            )
        ) AS parametre_ref_id,
        'LACHER'::text AS code_parametre,
        'Lacher barrage'::text AS nom_parametre,
        'volume_journalier'::text AS type_metier,
        jsonb_build_array('RESTITUTION', 'restitutions_mm3', 'lacher_barrage') AS aliases,
        'hydro'::text AS domaine,
        'hydrologie barrage'::text AS sous_domaine,
        'flux'::text AS famille,
        'Mm3/j'::text AS unite_reference,
        'barrage'::text AS type_geo_supporte,
        'hydro.mesure_barrage_param'::text AS table_cible,
        'metadata.referentiel_parametre + staging.raw_mesures_niv_eau_barrages'::text AS source_origine,
        'RECLASSEMENT_METIER'::text AS type_source,
        'hydrologie'::text AS categorie_dashboard,
        NULL::numeric AS seuil_min,
        NULL::numeric AS seuil_max,
        NULL::text AS norme,
        true AS scenario_compatible,
        'Volume journalier lache. RESTITUTION est un alias source; aucune conversion implicite vers un debit n''est autorisee.'::text AS description_metier,
        'ACTIF'::text AS statut,
        COALESCE(
            (
                SELECT MIN(rp.created_at)
                FROM metadata.referentiel_parametre rp
                WHERE rp.code_canonique = 'LACHER'
            ),
            now()
        ) AS date_creation
),
apport_canonique AS (
    SELECT
        (
            substr(md5('APPORT'), 1, 8) || '-' ||
            substr(md5('APPORT'), 9, 4) || '-' ||
            substr(md5('APPORT'), 13, 4) || '-' ||
            substr(md5('APPORT'), 17, 4) || '-' ||
            substr(md5('APPORT'), 21, 12)
        )::uuid AS parametre_ref_id,
        'APPORT'::text AS code_parametre,
        'Apport barrage'::text AS nom_parametre,
        'volume_journalier'::text AS type_metier,
        jsonb_build_array('APPORTS_HM3', 'apports_hm3', 'apports_mm3', 'apports_hm', 'Hm3', 'HM3', 'hm3') AS aliases,
        'hydro'::text AS domaine,
        'hydrologie barrage'::text AS sous_domaine,
        'flux'::text AS famille,
        'Mm3/j'::text AS unite_reference,
        'barrage'::text AS type_geo_supporte,
        'hydro.mesure_barrage_param'::text AS table_cible,
        'staging.raw_mesures_niv_eau_barrages'::text AS source_origine,
        'NOUVEAU_CANONIQUE'::text AS type_source,
        'hydrologie'::text AS categorie_dashboard,
        NULL::numeric AS seuil_min,
        NULL::numeric AS seuil_max,
        NULL::text AS norme,
        true AS scenario_compatible,
        'Apport journalier entrant barrage. Toute variante HM3/Hm3/hm3 et APPORTS_HM3 est harmonisee vers APPORT en Mm3/j.'::text AS description_metier,
        'ACTIF'::text AS statut,
        now() AS date_creation
),
transfert_canonique AS (
    SELECT
        (
            substr(md5('TRANSFERT'), 1, 8) || '-' ||
            substr(md5('TRANSFERT'), 9, 4) || '-' ||
            substr(md5('TRANSFERT'), 13, 4) || '-' ||
            substr(md5('TRANSFERT'), 17, 4) || '-' ||
            substr(md5('TRANSFERT'), 21, 12)
        )::uuid AS parametre_ref_id,
        'TRANSFERT'::text AS code_parametre,
        'Transfert barrage'::text AS nom_parametre,
        'volume_journalier'::text AS type_metier,
        jsonb_build_array('transfert_mm3', 'Hm3', 'HM3', 'hm3') AS aliases,
        'hydro'::text AS domaine,
        'hydrologie barrage'::text AS sous_domaine,
        'flux'::text AS famille,
        'Mm3/j'::text AS unite_reference,
        'barrage'::text AS type_geo_supporte,
        'hydro.mesure_barrage_param'::text AS table_cible,
        'staging.raw_mesures_niv_eau_barrages'::text AS source_origine,
        'NOUVEAU_CANONIQUE'::text AS type_source,
        'hydrologie'::text AS categorie_dashboard,
        NULL::numeric AS seuil_min,
        NULL::numeric AS seuil_max,
        NULL::text AS norme,
        true AS scenario_compatible,
        'Transfert barrage journalier. Toute variante HM3/Hm3/hm3 est harmonisee vers Mm3, puis exposee en Mm3/j.'::text AS description_metier,
        'ACTIF'::text AS statut,
        now() AS date_creation
),
final_rows AS (
    SELECT * FROM passthrough
    UNION ALL
    SELECT * FROM debit_canonique
    UNION ALL
    SELECT * FROM volume_canonique
    UNION ALL
    SELECT * FROM lacher_canonique
    UNION ALL
    SELECT * FROM apport_canonique
    UNION ALL
    SELECT * FROM transfert_canonique
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
    seuil_min,
    seuil_max,
    norme,
    scenario_compatible,
    description_metier,
    statut,
    date_creation
)
SELECT
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
    seuil_min,
    seuil_max,
    norme,
    scenario_compatible,
    description_metier,
    statut,
    date_creation
FROM final_rows
ON CONFLICT (code_parametre) DO UPDATE SET
    nom_parametre = EXCLUDED.nom_parametre,
    type_metier = EXCLUDED.type_metier,
    aliases = EXCLUDED.aliases,
    domaine = EXCLUDED.domaine,
    sous_domaine = EXCLUDED.sous_domaine,
    famille = EXCLUDED.famille,
    unite_reference = EXCLUDED.unite_reference,
    type_geo_supporte = EXCLUDED.type_geo_supporte,
    table_cible = EXCLUDED.table_cible,
    source_origine = EXCLUDED.source_origine,
    type_source = EXCLUDED.type_source,
    categorie_dashboard = EXCLUDED.categorie_dashboard,
    seuil_min = EXCLUDED.seuil_min,
    seuil_max = EXCLUDED.seuil_max,
    norme = EXCLUDED.norme,
    scenario_compatible = EXCLUDED.scenario_compatible,
    description_metier = EXCLUDED.description_metier,
    statut = EXCLUDED.statut,
    date_creation = LEAST(metadata.referentiel_parametre_canonique.date_creation, EXCLUDED.date_creation);

COMMIT;

DO $$
DECLARE
    v_total int;
    v_barrage int;
BEGIN
    SELECT COUNT(*)::int
    INTO v_total
    FROM metadata.referentiel_parametre_canonique;

    SELECT COUNT(*)::int
    INTO v_barrage
    FROM metadata.referentiel_parametre_canonique
    WHERE code_parametre IN ('DEBIT', 'LACHER', 'APPORT', 'TRANSFERT', 'VOLUME', 'NIVEAU_EAU');

    INSERT INTO audit.ingestion_audit_logs (
        action,
        utilisateur,
        horodatage,
        resultat_statut,
        resultat_nb_lignes,
        message_lisible,
        metadata
    )
    SELECT
        'REF_PARAM_CANONIQUE_LOAD',
        current_user,
        clock_timestamp(),
        'SUCCESS',
        v_total,
        'Referentiel parametre canonique cree/alimente avec succes, sans ecriture sur les tables metier migrees.',
        jsonb_build_object(
            'scope', 'metadata only',
            'touches_tables_metier_migrees', false,
            'source_backup_table', format('audit.%s', ctx.source_backup_table),
            'target_backup_table', CASE
                WHEN ctx.target_backup_table IS NULL THEN NULL
                ELSE format('audit.%s', ctx.target_backup_table)
            END,
            'canonical_total_rows', v_total,
            'canonical_barrage_rows', v_barrage,
            'hm3_to_mm3_row_conversions_executed', 0,
            'units_harmonized', jsonb_build_object(
                'LACHER', 'Mm3/j',
                'APPORT', 'Mm3/j',
                'TRANSFERT', 'Mm3/j',
                'VOLUME', 'Mm3',
                'NIVEAU_EAU', 'm',
                'DEBIT', 'm3/s'
            )
        )
    FROM pg_temp.referentiel_canonique_exec_ctx ctx;
END
$$;

\echo '=== Verification post-charge ==='

SELECT
    COUNT(*) AS total_rows,
    COUNT(*) FILTER (WHERE domaine = 'hydro') AS hydro_rows,
    COUNT(*) FILTER (WHERE code_parametre IN ('DEBIT', 'LACHER', 'APPORT', 'TRANSFERT', 'VOLUME', 'NIVEAU_EAU')) AS barrage_reference_rows
FROM metadata.referentiel_parametre_canonique;

SELECT
    code_parametre,
    type_metier,
    unite_reference,
    type_geo_supporte,
    statut
FROM metadata.referentiel_parametre_canonique
WHERE code_parametre IN ('DEBIT', 'LACHER', 'APPORT', 'TRANSFERT', 'VOLUME', 'NIVEAU_EAU')
ORDER BY code_parametre;

SELECT
    code_parametre,
    COUNT(*) AS n
FROM metadata.referentiel_parametre_canonique
GROUP BY code_parametre
HAVING COUNT(*) > 1
ORDER BY code_parametre;
