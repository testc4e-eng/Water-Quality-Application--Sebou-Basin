from app.db.session import SessionLocal
from sqlalchemy import text

db = SessionLocal()

sql_swat = """
CREATE OR REPLACE VIEW api.v_sous_bassin_swat_geojson AS
SELECT id, bassin_nom AS name, subbasin AS subbasin_id, (st_asgeojson(st_transform(geom, 4326)))::json AS geometry FROM geo.sous_bassin_swat_bas_sebou
UNION ALL
SELECT id, bassin_nom AS name, subbasin AS subbasin_id, (st_asgeojson(st_transform(geom, 4326)))::json AS geometry FROM geo.sous_bassin_swat_bassin_cotier
UNION ALL
SELECT id, bassin_nom AS name, subbasin AS subbasin_id, (st_asgeojson(st_transform(geom, 4326)))::json AS geometry FROM geo.sous_bassin_swat_beht
UNION ALL
SELECT id, bassin_nom AS name, subbasin AS subbasin_id, (st_asgeojson(st_transform(geom, 4326)))::json AS geometry FROM geo.sous_bassin_swat_haut_sebou
UNION ALL
SELECT id, bassin_nom AS name, "Subbasin" AS subbasin_id, (st_asgeojson(st_transform(geom, 4326)))::json AS geometry FROM geo.sous_bassin_swat_leben_innaouen
UNION ALL
SELECT id, bassin_nom AS name, subbasin AS subbasin_id, (st_asgeojson(st_transform(geom, 4326)))::json AS geometry FROM geo.sous_bassin_swat_moyen_sebou
UNION ALL
SELECT id, bassin_nom AS name, subbasin AS subbasin_id, (st_asgeojson(st_transform(geom, 4326)))::json AS geometry FROM geo.sous_bassin_swat_ouergha;
"""

sql_nappe = """
CREATE OR REPLACE VIEW api.v_nappes_geojson AS
SELECT 
    id, 
    nom_nappe AS name, 
    code_nappe AS code, 
    (st_asgeojson(st_transform(geom, 4326)))::json AS geometry
FROM geo.nappe;
"""

sql_source = """
CREATE OR REPLACE VIEW api.v_sources_geojson AS
SELECT 
    id, 
    nom_source AS name, 
    code_nappe, 
    type_source, 
    (st_asgeojson(st_transform(geom, 4326)))::json AS geometry
FROM geo.source;
"""

try:
    db.execute(text(sql_swat))
    db.execute(text(sql_nappe))
    db.execute(text(sql_source))
    db.commit()
    print("Views created successfully!")
except Exception as e:
    print(f"Error creating views: {e}")
