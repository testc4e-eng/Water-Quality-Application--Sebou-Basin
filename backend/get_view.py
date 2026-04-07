from app.db.session import SessionLocal
from sqlalchemy import text
db = SessionLocal()

print("--- Definition of api.v_sous_bassin_geojson ---")
res = db.execute(text("SELECT view_definition FROM information_schema.views WHERE table_schema='api' AND table_name='v_sous_bassin_geojson'")).fetchone()
if res: print(res[0])
