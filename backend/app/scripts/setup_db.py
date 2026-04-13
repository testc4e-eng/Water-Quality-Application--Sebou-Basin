import os
import sys
from dotenv import load_dotenv

# Path configuration
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
load_dotenv()

from sqlalchemy import text
from app.db.climate_database import ClimateSessionLocal, engine_climate
from app.db.base import Base

# Import all models to ensure they are registered with Base.metadata
from app.models.swat import SwatModel, SwatScenario, SwatSubbasinResult, SwatReachResult
from app.models.wasp import WaspScenario, WaspVariable, WaspResult


def setup_database():
    print("Initializing SAD Water Quality schemas and tables...")

    db = ClimateSessionLocal()
    try:
        # 1. Create schemas
        db.execute(text("CREATE SCHEMA IF NOT EXISTS swat_sebou;"))
        db.execute(text("CREATE SCHEMA IF NOT EXISTS wasp_sebou;"))
        db.execute(text("CREATE SCHEMA IF NOT EXISTS metadata;"))
        db.commit()
        print("Schemas swat_sebou, wasp_sebou, metadata ready.")

        # 2. Create tables using SQLAlchemy Metadata
        # Note: We use engine_climate specifically for the climate-related schemas
        Base.metadata.create_all(bind=engine_climate)
        print("Models registered and tables created.")

        # 3. Popup rules configuration table (for dynamic popup display rules + symbology)
        db.execute(
            text(
                """
                CREATE TABLE IF NOT EXISTS metadata.popup_rules_config (
                    layer_key text PRIMARY KEY,
                    title text,
                    name_fields text[] NOT NULL DEFAULT '{}',
                    type_fields text[] NOT NULL DEFAULT '{}',
                    class_fields text[] NOT NULL DEFAULT '{}',
                    code_fields text[] NOT NULL DEFAULT '{}',
                    point_style jsonb NOT NULL DEFAULT '{}'::jsonb,
                    line_style jsonb NOT NULL DEFAULT '{}'::jsonb,
                    polygon_style jsonb NOT NULL DEFAULT '{}'::jsonb,
                    point_popup_fields text[] NOT NULL DEFAULT '{}',
                    line_popup_fields text[] NOT NULL DEFAULT '{}',
                    polygon_popup_fields text[] NOT NULL DEFAULT '{}',
                    actif boolean NOT NULL DEFAULT true,
                    created_at timestamptz NOT NULL DEFAULT now(),
                    updated_at timestamptz NOT NULL DEFAULT now()
                );
                """
            )
        )
        db.execute(
            text(
                """
                INSERT INTO metadata.popup_rules_config
                    (layer_key, title, name_fields, type_fields, class_fields, code_fields,
                     point_style, line_style, polygon_style,
                     point_popup_fields, line_popup_fields, polygon_popup_fields,
                     actif)
                VALUES
                    ('stations_abhs', 'Station', ARRAY['station_nom','nom_station','name','label'], ARRAY['type_station','station_type','categorie'], ARRAY[]::text[], ARRAY['code_station','legacy_code_station','station_id','legacy_station_id','id'], '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[], true),
                    ('barrages_abhs', 'Barrage', ARRAY['nom_barrage','name','label'], ARRAY['type_barrage','categorie'], ARRAY['statut'], ARRAY['ire','barrage_id','id'], '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[], true),
                    ('sources', 'Source d''eau', ARRAY['nom_source','name','label'], ARRAY['type_source','source_type','categorie'], ARRAY[]::text[], ARRAY['code_source','code','source_id','id'], '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[], true),
                    ('points_eau', 'Point d''eau', ARRAY['nom_pt_eau','name','label'], ARRAY['type_point_eau','type_source','categorie'], ARRAY[]::text[], ARRAY['code_pt_eau','point_eau_id','id'], '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[], true),
                    ('sous_bassins_swat', 'Sous-bassin SWAT', ARRAY['name','label','subbasin_nom'], ARRAY[]::text[], ARRAY['scenario','bassin_nom'], ARRAY['subbasin_uid','subbasin_id','id'], '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[], true),
                    ('reseau_hydro_abhs', 'Segment hydrographique', ARRAY['nom_oued','nom','name','label'], ARRAY['type','categorie','class_hydro'], ARRAY[]::text[], ARRAY['reseau_id','segment_local_id','id_oued','id'], '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[], true),
                    ('adm_regions_abhs', 'Region', ARRAY['region_fr','name','label'], ARRAY[]::text[], ARRAY[]::text[], ARRAY['code_region','id'], '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[], true),
                    ('adm_provinces_abhs', 'Province / Prefecture', ARRAY['province_fr','name','label'], ARRAY[]::text[], ARRAY[]::text[], ARRAY['code_province','id'], '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[], true),
                    ('adm_communes_abhs', 'Commune', ARRAY['commune_fr','name','label'], ARRAY[]::text[], ARRAY[]::text[], ARRAY['code_commune','id'], '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[], true),
                    ('adm_villes_abhs', 'Ville', ARRAY['ville_fr','commune_fr','name','label'], ARRAY[]::text[], ARRAY[]::text[], ARRAY['code_ville','code_commune','id'], '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[], true),
                    ('adm_douars_abhs', 'Douar', ARRAY['douar_fr','name','label'], ARRAY[]::text[], ARRAY[]::text[], ARRAY['code_douar','id'], '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[], true)
                ON CONFLICT (layer_key) DO UPDATE SET
                    title = EXCLUDED.title,
                    name_fields = EXCLUDED.name_fields,
                    type_fields = EXCLUDED.type_fields,
                    class_fields = EXCLUDED.class_fields,
                    code_fields = EXCLUDED.code_fields,
                    point_style = EXCLUDED.point_style,
                    line_style = EXCLUDED.line_style,
                    polygon_style = EXCLUDED.polygon_style,
                    point_popup_fields = EXCLUDED.point_popup_fields,
                    line_popup_fields = EXCLUDED.line_popup_fields,
                    polygon_popup_fields = EXCLUDED.polygon_popup_fields,
                    actif = EXCLUDED.actif,
                    updated_at = now();
                """
            )
        )
        db.commit()
        print("metadata.popup_rules_config created/seeded.")

    except Exception as e:
        print(f"Error during database setup: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    setup_database()
