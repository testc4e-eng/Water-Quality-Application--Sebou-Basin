CREATE TABLE IF NOT EXISTS data_admin.change_request (
    change_request_id uuid PRIMARY KEY,
    run_id uuid NOT NULL REFERENCES data_admin.ingestion_run(run_id),
    class_code text NOT NULL REFERENCES data_admin.data_class_registry(class_code),
    request_status text NOT NULL,
    promotion_mode text NOT NULL,
    requested_by text NOT NULL,
    requested_at timestamp without time zone NOT NULL DEFAULT now(),
    reviewed_by text NULL,
    reviewed_at timestamp without time zone NULL,
    approved_by text NULL,
    approved_at timestamp without time zone NULL,
    rejected_by text NULL,
    rejected_at timestamp without time zone NULL,
    applied_by text NULL,
    applied_at timestamp without time zone NULL,
    summary jsonb NOT NULL DEFAULT '{}'::jsonb,
    comments text NULL,
    CONSTRAINT change_request_status_check CHECK (
        request_status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'APPLIED', 'CANCELLED', 'FAILED')
    ),
    CONSTRAINT change_request_mode_check CHECK (
        promotion_mode IN ('INSERT_ONLY')
    ),
    CONSTRAINT change_request_run_unique UNIQUE (run_id)
);

CREATE INDEX IF NOT EXISTS idx_change_request_class_status
    ON data_admin.change_request(class_code, request_status);

CREATE INDEX IF NOT EXISTS idx_change_request_requested_at
    ON data_admin.change_request(requested_at DESC);

CREATE TABLE IF NOT EXISTS data_admin.change_request_item (
    item_id uuid PRIMARY KEY,
    change_request_id uuid NOT NULL REFERENCES data_admin.change_request(change_request_id) ON DELETE CASCADE,
    staging_row_id uuid NOT NULL REFERENCES data_admin.ingestion_staging_row(staging_row_id),
    item_status text NOT NULL,
    raw_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    normalized_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    validation_errors jsonb NOT NULL DEFAULT '[]'::jsonb,
    promotion_action text NOT NULL,
    target_schema text NOT NULL,
    target_table text NOT NULL,
    target_pk jsonb NULL,
    applied_at timestamp without time zone NULL,
    error_message text NULL,
    CONSTRAINT change_request_item_status_check CHECK (
        item_status IN ('READY', 'SKIPPED_INVALID', 'APPLIED', 'FAILED')
    ),
    CONSTRAINT change_request_item_action_check CHECK (
        promotion_action IN ('INSERT_ONLY')
    ),
    CONSTRAINT change_request_item_staging_unique UNIQUE (change_request_id, staging_row_id)
);

CREATE INDEX IF NOT EXISTS idx_change_request_item_status
    ON data_admin.change_request_item(change_request_id, item_status);

CREATE TABLE IF NOT EXISTS data_admin.promotion_audit_log (
    audit_id uuid PRIMARY KEY,
    change_request_id uuid NOT NULL REFERENCES data_admin.change_request(change_request_id) ON DELETE CASCADE,
    run_id uuid NOT NULL REFERENCES data_admin.ingestion_run(run_id),
    class_code text NOT NULL,
    action text NOT NULL,
    target_schema text NULL,
    target_table text NULL,
    target_pk jsonb NULL,
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    actor text NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_promotion_audit_log_change_request
    ON data_admin.promotion_audit_log(change_request_id, created_at DESC);
