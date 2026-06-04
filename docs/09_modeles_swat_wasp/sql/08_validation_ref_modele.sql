-- Validation read-only du referentiel de modelisation SWAT/WASP.
-- Ce script ne modifie rien et doit retourner des compteurs stables.

WITH checks AS (
    SELECT 'Modeles'::text AS controle, 6::bigint AS attendu, COUNT(*)::bigint AS resultat
    FROM metadata.ref_modele

    UNION ALL

    SELECT 'Parametres SWAT', 5::bigint, COUNT(*)::bigint
    FROM metadata.ref_parametre_modele rpm
    JOIN metadata.ref_modele rm ON rm.model_id = rpm.model_id
    WHERE rm.model_code = 'SWAT_PLUS'

    UNION ALL

    SELECT 'Parametres WASP', 12::bigint, COUNT(*)::bigint
    FROM metadata.ref_parametre_modele rpm
    JOIN metadata.ref_modele rm ON rm.model_id = rpm.model_id
    WHERE rm.model_code = 'WASP'

    UNION ALL

    SELECT 'Mappings prepares', 7::bigint, COUNT(*)::bigint
    FROM metadata.ref_parametre_modele_mapping

    UNION ALL

    SELECT 'Mappings actifs', 0::bigint, COUNT(*)::bigint
    FROM metadata.ref_parametre_modele_mapping
    WHERE active

    UNION ALL

    SELECT 'Regression referentiel canonique', 0::bigint, COUNT(*)::bigint
    FROM metadata.mapping_parametre_source
    WHERE source_schema IN ('swat_output', 'wasp_output', 'swat_sebou', 'wasp_sebou')

    UNION ALL

    SELECT 'Regression reglementaire', 0::bigint, COUNT(*)::bigint
    FROM metadata.ref_parametre_modele_mapping rpmm
    JOIN metadata.referentiel_parametre_canonique rpc
        ON rpc.parametre_ref_id = rpmm.parametre_canonique_id
    JOIN metadata.qualite_parametre_reglementaire qpr
        ON qpr.code_canonique_cible = rpc.code_parametre
    WHERE rpmm.active

    UNION ALL

    SELECT 'Impact API metier', 0::bigint, COUNT(*)::bigint
    FROM pg_depend d
    JOIN pg_rewrite r
        ON r.oid = d.objid
    JOIN pg_class dependent_obj
        ON dependent_obj.oid = r.ev_class
    JOIN pg_namespace dependent_ns
        ON dependent_ns.oid = dependent_obj.relnamespace
    JOIN pg_class referenced_obj
        ON referenced_obj.oid = d.refobjid
    JOIN pg_namespace referenced_ns
        ON referenced_ns.oid = referenced_obj.relnamespace
    WHERE referenced_ns.nspname = 'metadata'
      AND referenced_obj.relname IN ('ref_modele', 'ref_parametre_modele', 'ref_parametre_modele_mapping')
      AND dependent_ns.nspname = 'api'
      AND dependent_obj.relkind IN ('v', 'm')

    UNION ALL

    SELECT 'Impact dashboard metier', 0::bigint, COUNT(*)::bigint
    FROM pg_depend d
    JOIN pg_rewrite r
        ON r.oid = d.objid
    JOIN pg_class dependent_obj
        ON dependent_obj.oid = r.ev_class
    JOIN pg_namespace dependent_ns
        ON dependent_ns.oid = dependent_obj.relnamespace
    JOIN pg_class referenced_obj
        ON referenced_obj.oid = d.refobjid
    JOIN pg_namespace referenced_ns
        ON referenced_ns.oid = referenced_obj.relnamespace
    WHERE referenced_ns.nspname = 'metadata'
      AND referenced_obj.relname IN ('ref_modele', 'ref_parametre_modele', 'ref_parametre_modele_mapping')
      AND dependent_ns.nspname = 'analytics'
      AND dependent_obj.relkind IN ('v', 'm')
)
SELECT
    controle,
    attendu,
    resultat,
    CASE
        WHEN resultat = attendu THEN 'OK'
        ELSE 'KO'
    END AS statut
FROM checks
ORDER BY controle;

-- Controle d'architecture: aucun mapping scientifique ne doit etre actif.
SELECT
    rm.model_code,
    rpm.code_modele,
    rpc.code_parametre AS code_canonique,
    rpmm.relation_type,
    rpmm.validation_status,
    rpmm.active
FROM metadata.ref_parametre_modele_mapping rpmm
JOIN metadata.ref_parametre_modele rpm
    ON rpm.param_model_id = rpmm.param_model_id
JOIN metadata.ref_modele rm
    ON rm.model_id = rpm.model_id
JOIN metadata.referentiel_parametre_canonique rpc
    ON rpc.parametre_ref_id = rpmm.parametre_canonique_id
ORDER BY rm.model_code, rpm.code_modele;
