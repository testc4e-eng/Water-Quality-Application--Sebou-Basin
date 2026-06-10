CREATE SCHEMA IF NOT EXISTS data_admin;

CREATE TABLE IF NOT EXISTS data_admin.data_class_registry (
    class_code text PRIMARY KEY,
    class_label text NOT NULL,
    domain text NOT NULL,
    target_schema text NOT NULL,
    target_table text NOT NULL,
    exposure_view_schema text NULL,
    exposure_view_name text NULL,
    staging_schema text NULL,
    staging_table text NULL,
    geometry_required boolean NOT NULL DEFAULT false,
    temporal_required boolean NOT NULL DEFAULT false,
    validation_level text NOT NULL DEFAULT 'STANDARD',
    editable boolean NOT NULL DEFAULT false,
    ingestable boolean NOT NULL DEFAULT false,
    realtime_capable boolean NOT NULL DEFAULT false,
    owner_role text NOT NULL DEFAULT 'DATA_MANAGER',
    status text NOT NULL DEFAULT 'ACTIVE',
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT chk_data_class_registry_domain
        CHECK (domain IN ('GEO', 'INFRA', 'HYDRO', 'METEO', 'QUALITE', 'POLLUTION', 'REFERENTIEL', 'MODELES')),
    CONSTRAINT chk_data_class_registry_validation_level
        CHECK (validation_level IN ('LIGHT', 'STANDARD', 'STRICT')),
    CONSTRAINT chk_data_class_registry_status
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'DRAFT'))
);

CREATE TABLE IF NOT EXISTS data_admin.field_registry (
    field_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    class_code text NOT NULL REFERENCES data_admin.data_class_registry(class_code),
    field_name text NOT NULL,
    field_label text NOT NULL,
    data_type text NOT NULL,
    required boolean NOT NULL DEFAULT false,
    editable boolean NOT NULL DEFAULT false,
    ingestable boolean NOT NULL DEFAULT false,
    validation_rule text NULL,
    reference_source text NULL,
    display_order integer NOT NULL DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    UNIQUE(class_code, field_name)
);

CREATE INDEX IF NOT EXISTS idx_data_class_registry_domain_status
    ON data_admin.data_class_registry (domain, status);

CREATE INDEX IF NOT EXISTS idx_data_class_registry_target
    ON data_admin.data_class_registry (target_schema, target_table);

CREATE INDEX IF NOT EXISTS idx_field_registry_class_display
    ON data_admin.field_registry (class_code, display_order);
