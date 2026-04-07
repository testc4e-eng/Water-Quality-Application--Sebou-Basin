from app.db.session import SessionLocal
from sqlalchemy import text
db = SessionLocal()

print("--- swat ---")
print([r[0] for r in db.execute(text("SELECT column_name FROM information_schema.columns WHERE table_schema='geo' AND table_name='sous_bassin_swat_bas_sebou'")).fetchall()])

print("--- nappe ---")
print([r[0] for r in db.execute(text("SELECT column_name FROM information_schema.columns WHERE table_schema='geo' AND table_name='nappe'")).fetchall()])

print("--- source ---")
print([r[0] for r in db.execute(text("SELECT column_name FROM information_schema.columns WHERE table_schema='geo' AND table_name='source'")).fetchall()])
