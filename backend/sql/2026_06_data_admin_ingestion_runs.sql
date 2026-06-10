CREATE TABLE IF NOT EXISTS data_admin.ingestion_run (
    run_id uuid PRIMARY KEY,
    class_code text NOT NULL REFERENCES data_admin.data_class_registry(class_code),
    run_status text NOT NULL,
    file_name text NOT NULL,
    file_format text NOT NULL,
    row_count integer NOT NULL DEFAULT 0,
    valid_row_count integer NOT NULL DEFAULT 0,
    error_row_count integer NOT NULL DEFAULT 0,
    warning_count integer NOT NULL DEFAULT 0,
    created_by text NOT NULL DEFAULT 'data_admin_ui',
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    validated_at timestamp without time zone NULL,
    staged_at timestamp without time zone NULL,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    CONSTRAINT ingestion_run_status_check CHECK (
        run_status IN (
            'UPLOADED',
            'STRUCTURE_VALIDATED',
            'VALIDATION_FAILED',
            'VALIDATED_WITH_WARNINGS',
            'STAGED',
            'REJECTED',
            'CANCELLED'
        )
    )
);

CREATE INDEX IF NOT EXISTS idx_data_admin_ingestion_run_class_code
    ON data_admin.ingestion_run(class_code);

CREATE INDEX IF NOT EXISTS idx_data_admin_ingestion_run_created_at
    ON data_admin.ingestion_run(created_at DESC);

CREATE TABLE IF NOT EXISTS data_admin.ingestion_file (
    file_id uuid PRIMARY KEY,
    run_id uuid NOT NULL REFERENCES data_admin.ingestion_run(run_id) ON DELETE CASCADE,
    file_name text NOT NULL,
    file_format text NOT NULL,
    mime_type text NOT NULL,
    file_size_bytes bigint NOT NULL,
    sha256 text NOT NULL,
    stored_path text NULL,
    raw_preview jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamp without time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_data_admin_ingestion_file_run_id
    ON data_admin.ingestion_file(run_id);

CREATE TABLE IF NOT EXISTS data_admin.ingestion_validation_error (
    error_id uuid PRIMARY KEY,
    run_id uuid NOT NULL REFERENCES data_admin.ingestion_run(run_id) ON DELETE CASCADE,
    row_number integer NULL,
    field_name text NULL,
    error_scope text NOT NULL DEFAULT 'STRUCTURAL',
    severity text NOT NULL,
    error_code text NOT NULL,
    error_message text NOT NULL,
    raw_value text NULL,
    expected_rule text NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT ingestion_validation_error_severity_check CHECK (
        severity IN ('INFO', 'WARNING', 'BLOCKING', 'CRITICAL')
    )
);

CREATE INDEX IF NOT EXISTS idx_data_admin_ingestion_validation_error_run_id
    ON data_admin.ingestion_validation_error(run_id);

CREATE TABLE IF NOT EXISTS data_admin.ingestion_staging_row (
    staging_row_id uuid PRIMARY KEY,
    run_id uuid NOT NULL REFERENCES data_admin.ingestion_run(run_id) ON DELETE CASCADE,
    class_code text NOT NULL REFERENCES data_admin.data_class_registry(class_code),
    row_number integer NOT NULL,
    row_status text NOT NULL,
    raw_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    normalized_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    validation_errors jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT ingestion_staging_row_status_check CHECK (
        row_status IN ('VALID', 'WARNING', 'INVALID')
    )
);

CREATE INDEX IF NOT EXISTS idx_data_admin_ingestion_staging_row_run_id
    ON data_admin.ingestion_staging_row(run_id);

CREATE INDEX IF NOT EXISTS idx_data_admin_ingestion_staging_row_class_code
    ON data_admin.ingestion_staging_row(class_code);
