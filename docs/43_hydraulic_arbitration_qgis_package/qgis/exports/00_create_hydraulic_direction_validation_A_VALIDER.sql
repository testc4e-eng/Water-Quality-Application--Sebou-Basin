-- PROPOSITION UNIQUEMENT - A_VALIDER AVANT EXECUTION DEV
-- Ne modifie pas le réseau source. Ne corrige aucune direction.

CREATE SCHEMA IF NOT EXISTS qa;

CREATE TABLE IF NOT EXISTS qa.hydraulic_direction_validation (
    validation_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    edge_id bigint NOT NULL,
    geom geometry(LineString, 26191),
    source_node bigint,
    target_node bigint,
    length_m double precision,
    z_start double precision,
    z_end double precision,
    dz double precision,
    slope double precision,
    direction_runtime text,
    direction_mnt text,
    direction_status text NOT NULL CHECK (direction_status IN (
        'FLOW_CONFIRMED', 'FLOW_REVERSED_SUSPECTED', 'FLAT_SEGMENT',
        'LOW_SLOPE_UNCERTAIN', 'MNT_NO_DATA', 'OUTSIDE_MNT', 'NEED_MANUAL_REVIEW'
    )),
    confidence text,
    qa_comment text,
    mnt_source text,
    review_status text NOT NULL DEFAULT 'TO_REVIEW' CHECK (review_status IN (
        'TO_REVIEW', 'VALIDATED_AS_IS', 'NEEDS_REVERSAL', 'UNCERTAIN',
        'IGNORE_MNT_ARTIFACT', 'NEED_FIELD_VALIDATION'
    )),
    reviewer text,
    review_decision text,
    review_comment text,
    created_at timestamptz NOT NULL DEFAULT now(),
    reviewed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_hydraulic_direction_validation_edge
ON qa.hydraulic_direction_validation(edge_id);

CREATE INDEX IF NOT EXISTS idx_hydraulic_direction_validation_status
ON qa.hydraulic_direction_validation(direction_status, review_status);

CREATE INDEX IF NOT EXISTS idx_hydraulic_direction_validation_geom
ON qa.hydraulic_direction_validation USING gist(geom);
