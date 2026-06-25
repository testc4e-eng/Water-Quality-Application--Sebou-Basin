ALTER TABLE IF EXISTS data_admin.field_registry
    ADD COLUMN IF NOT EXISTS example_value text,
    ADD COLUMN IF NOT EXISTS unit_expected text,
    ADD COLUMN IF NOT EXISTS allowed_values_source text,
    ADD COLUMN IF NOT EXISTS description text;
