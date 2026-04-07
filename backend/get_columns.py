from app.db.session import SessionLocal
from sqlalchemy import text
db = SessionLocal()

print("--- Columns of geo.sous_bassin_swat_bas_sebou ---")
res = db.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='geo' AND table_name='sous_bassin_swat_bas_sebou'")).fetchall()
print(res)

print("--- Columns of geo.nappe ---")
res = db.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='geo' AND table_name='nappe'")).fetchall()
print(res)

print("--- Columns of geo.source ---")
res = db.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='geo' AND table_name='source'")).fetchall()
print(res)
