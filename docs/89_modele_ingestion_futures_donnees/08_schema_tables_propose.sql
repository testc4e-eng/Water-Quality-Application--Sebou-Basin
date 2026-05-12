-- Schema propose uniquement. Ne pas executer sans validation.

CREATE SCHEMA IF NOT EXISTS ingestion;

CREATE TABLE ingestion.ingestion_batch (
    batch_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    domaine text NOT NULL,
    source_type text NOT NULL,
    source_file_name text NOT NULL,
    source_file_hash text NOT NULL,
    target_schema text,
    target_table text,
    scenario_code text,
    status text NOT NULL DEFAULT 'CREATED',
    rows_read integer DEFAULT 0,
    rows_ready integer DEFAULT 0,
    rows_excluded integer DEFAULT 0,
    rows_loaded integer DEFAULT 0,
    metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_by text DEFAULT current_user,
    created_at timestamptz NOT NULL DEFAULT now(),
    started_at timestamptz,
    finished_at timestamptz
);

CREATE TABLE ingestion.ingestion_line_audit (
    audit_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id uuid NOT NULL REFERENCES ingestion.ingestion_batch(batch_id),
    source_row_id text,
    source_row_hash text NOT NULL,
    target_business_key_hash text,
    status text NOT NULL,
    anomaly_code text,
    anomaly_message text,
    source_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    target_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ingestion.ingestion_mapping_decision (
    decision_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id uuid REFERENCES ingestion.ingestion_batch(batch_id),
    mapping_type text NOT NULL,
    source_value text NOT NULL,
    target_value text,
    decision_status text NOT NULL,
    decision_reason text,
    decided_by text DEFAULT current_user,
    decided_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ingestion_line_audit_batch
    ON ingestion.ingestion_line_audit(batch_id);

CREATE INDEX idx_ingestion_line_audit_source_hash
    ON ingestion.ingestion_line_audit(source_row_hash);

CREATE INDEX idx_ingestion_line_audit_business_hash
    ON ingestion.ingestion_line_audit(target_business_key_hash);

