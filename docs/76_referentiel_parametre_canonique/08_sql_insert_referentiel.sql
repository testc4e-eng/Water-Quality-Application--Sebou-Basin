-- Phase 2 - Chargement propose du referentiel canonique
-- Hypotheses :
--   1. metadata.referentiel_parametre_canonique existe
--   2. le chargement ne doit pas dupliquer DEBIT / LACHER / VOLUME
--   3. APPORTS_HM3, TRANSFERT et LACHER doivent sortir en Mm3/j

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
    WHERE rp.code_canonique NOT IN ('DEBIT', 'LACHER', 'VOLUME_BARRAGE', 'VOLUME', 'APPORTS_HM3', 'TRANSFERT')
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
        COALESCE((SELECT MIN(rp.created_at) FROM metadata.referentiel_parametre rp WHERE rp.code_canonique = 'DEBIT'), now()) AS date_creation
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
        COALESCE((SELECT MIN(rp.created_at) FROM metadata.referentiel_parametre rp WHERE rp.code_canonique IN ('VOLUME', 'VOLUME_BARRAGE')), now()) AS date_creation
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
        COALESCE((SELECT MIN(rp.created_at) FROM metadata.referentiel_parametre rp WHERE rp.code_canonique = 'LACHER'), now()) AS date_creation
),
apports_hm3_canonique AS (
    SELECT
        (
            substr(md5('APPORTS_HM3'), 1, 8) || '-' ||
            substr(md5('APPORTS_HM3'), 9, 4) || '-' ||
            substr(md5('APPORTS_HM3'), 13, 4) || '-' ||
            substr(md5('APPORTS_HM3'), 17, 4) || '-' ||
            substr(md5('APPORTS_HM3'), 21, 12)
        )::uuid AS parametre_ref_id,
        'APPORTS_HM3'::text AS code_parametre,
        'Apports barrage'::text AS nom_parametre,
        'volume_journalier'::text AS type_metier,
        jsonb_build_array('apports_mm3', 'apports_hm', 'Hm3', 'HM3', 'hm3') AS aliases,
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
        'Apports barrage journaliers. Toute variante HM3/Hm3/hm3 est harmonisee vers Mm3, puis exposee en Mm3/j.'::text AS description_metier,
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
    SELECT * FROM apports_hm3_canonique
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
