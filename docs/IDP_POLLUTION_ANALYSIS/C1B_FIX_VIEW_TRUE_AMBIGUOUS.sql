-- C1-B FIX - correction de la vue QA des cas encore ambigus
-- Ne pas executer sans revue DEV.
-- Objectif : exclure des cas ouverts les objets deja couverts par une decision
-- cartographique validee pour le meme run / review_id / source_layer / source_id.

CREATE SCHEMA IF NOT EXISTS qa;

CREATE OR REPLACE VIEW qa.v_true_ambiguous_cases AS
WITH validated_cartographic_decisions AS (
    SELECT
        d.run_id,
        d.review_id,
        d.source_layer,
        d.source_id,
        d.decision_code,
        d.status
    FROM qa.spatial_identity_decisions_cartographic d
    WHERE d.status IN ('VALIDATED_METIER', 'VALIDATED_DG')
),
pending_conflicts AS (
    SELECT
        c.run_id,
        c.conflict_id AS qa_id,
        'CONFLICT'::text AS qa_type,
        concat(c.source_schema, '.', c.source_table) AS source_layer,
        c.source_pk AS source_object_id,
        NULL::text AS source_object_name,
        c.candidate_master_site_id AS master_site_id,
        c.conflict_type,
        c.match_score,
        c.distance_m,
        c.reason,
        c.arbitration_status AS review_status,
        c.comments,
        c.source_geom AS geom
    FROM qa.spatial_identity_conflicts c
    WHERE c.arbitration_status = 'PENDING'
      AND (
          c.conflict_type IN ('TO_VALIDATE', 'GEOMETRY_CONFLICT', 'POSSIBLE_MATCH_LOW')
          OR c.distance_m > 2
          OR c.candidate_master_site_id IS NULL
      )
      AND NOT EXISTS (
          SELECT 1
          FROM validated_cartographic_decisions d
          WHERE d.run_id = c.run_id
            AND d.review_id = c.conflict_id
            AND d.source_layer = concat(c.source_schema, '.', c.source_table)
            AND d.source_id = c.source_pk
      )
),
pending_orphans AS (
    SELECT
        o.run_id,
        o.orphan_id AS qa_id,
        'ORPHAN'::text AS qa_type,
        concat(o.source_schema, '.', o.source_table) AS source_layer,
        o.source_pk AS source_object_id,
        o.source_label AS source_object_name,
        NULL::uuid AS master_site_id,
        o.orphan_reason AS conflict_type,
        NULL::numeric AS match_score,
        NULL::numeric AS distance_m,
        o.orphan_reason AS reason,
        o.review_status,
        o.comments,
        o.source_geom AS geom
    FROM qa.spatial_identity_orphans o
    WHERE o.review_status = 'PENDING'
      AND NOT EXISTS (
          SELECT 1
          FROM validated_cartographic_decisions d
          WHERE d.run_id = o.run_id
            AND d.review_id = o.orphan_id
            AND d.source_layer = concat(o.source_schema, '.', o.source_table)
            AND d.source_id = o.source_pk
      )
)
SELECT * FROM pending_conflicts
UNION ALL
SELECT * FROM pending_orphans;

COMMENT ON VIEW qa.v_true_ambiguous_cases IS
'C1-B FIX: n expose plus les conflits/orphelins du scope cartographique deja couverts par une decision validee.';
