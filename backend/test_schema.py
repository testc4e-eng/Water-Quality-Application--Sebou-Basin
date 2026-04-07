from app.db.session import SessionLocal
from sqlalchemy import text
db = SessionLocal()

print("== api.v_bassin_geojson ==")
res = db.execute(text("SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_schema='api' AND table_name='v_bassin_geojson'")).fetchall()
print([tuple(r) for r in res])

print("== api.v_sous_bassin_geojson ==")
res = db.execute(text("SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_schema='api' AND table_name='v_sous_bassin_geojson'")).fetchall()
print([tuple(r) for r in res])

print("== public.reseau_hydro_abhs ==")
res = db.execute(text("SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_schema='public' AND table_name='reseau_hydro_abhs'")).fetchall()
print([tuple(r) for r in res])

print("== public.reseau_hydro ==")
res = db.execute(text("SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_schema='public' AND table_name='reseau_hydro'")).fetchall()
print([tuple(r) for r in res])
