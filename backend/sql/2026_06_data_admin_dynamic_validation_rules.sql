CREATE TABLE IF NOT EXISTS data_admin.validation_rule_registry (
    rule_id uuid PRIMARY KEY,
    class_code text NOT NULL REFERENCES data_admin.data_class_registry(class_code),
    field_name text NULL,
    rule_code text NOT NULL,
    rule_label text NOT NULL,
    severity text NOT NULL,
    rule_type text NOT NULL,
    reference_schema text NULL,
    reference_table text NULL,
    reference_column text NULL,
    sql_template text NULL,
    active boolean NOT NULL DEFAULT true,
    description text NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT validation_rule_registry_severity_check CHECK (
        severity IN ('INFO', 'WARNING', 'BLOCKING', 'CRITICAL')
    ),
    CONSTRAINT validation_rule_registry_type_check CHECK (
        rule_type IN (
            'EXISTS_IN_REFERENCE',
            'ALLOWED_VALUE_SQL',
            'DUPLICATE_CHECK',
            'RANGE_CHECK',
            'TEMPORAL_CHECK',
            'CUSTOM_SQL'
        )
    ),
    CONSTRAINT validation_rule_registry_unique_class_rule UNIQUE (class_code, rule_code)
);

CREATE INDEX IF NOT EXISTS idx_validation_rule_registry_class_code
    ON data_admin.validation_rule_registry(class_code);

CREATE INDEX IF NOT EXISTS idx_validation_rule_registry_active
    ON data_admin.validation_rule_registry(active);

ALTER TABLE data_admin.ingestion_validation_error
    ADD COLUMN IF NOT EXISTS error_scope text NOT NULL DEFAULT 'STRUCTURAL';
