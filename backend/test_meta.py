from app.db.session import SessionLocal
from sqlalchemy import text
db = SessionLocal()

print('=== Columns for api.v_bassin_geojson ===')
for r in db.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='api' AND table_name='v_bassin_geojson'")):
    print(r)

print('\n=== Columns for api.v_sous_bassin_geojson ===')
for r in db.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='api' AND table_name='v_sous_bassin_geojson'")):
    print(r)

print('\n=== Searching reseau tables ===')
for r in db.execute(text("SELECT table_schema, table_name FROM information_schema.tables WHERE table_name ILIKE '%reseau%'")):
    print(r)

print('\n=== geometry_columns view ===')
for r in db.execute(text("SELECT f_table_schema, f_table_name, f_geometry_column FROM geometry_columns WHERE f_table_name ILIKE '%bassin%'")):
    print(r)
