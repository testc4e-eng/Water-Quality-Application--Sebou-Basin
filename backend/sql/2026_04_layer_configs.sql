CREATE SCHEMA IF NOT EXISTS sad;

CREATE TABLE IF NOT EXISTS sad.layer_configs (
    id SERIAL PRIMARY KEY,
    layer_name VARCHAR(100) UNIQUE NOT NULL,
    geometry_type VARCHAR(20) NOT NULL,
    style_config JSONB NOT NULL,
    popup_config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_geom_type CHECK (geometry_type IN ('point', 'line', 'polygon'))
);

CREATE INDEX IF NOT EXISTS idx_layer_configs_active
    ON sad.layer_configs(layer_name)
    WHERE is_active = true;

CREATE OR REPLACE FUNCTION sad.touch_layer_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_touch_layer_configs_updated_at ON sad.layer_configs;
CREATE TRIGGER trg_touch_layer_configs_updated_at
    BEFORE UPDATE ON sad.layer_configs
    FOR EACH ROW
    EXECUTE FUNCTION sad.touch_layer_configs_updated_at();
