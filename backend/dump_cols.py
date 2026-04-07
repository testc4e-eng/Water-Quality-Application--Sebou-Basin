from app.db.session import SessionLocal
from sqlalchemy import text
db = SessionLocal()

with open("cols.txt", "w") as f:
    f.write("--- swat ---\n")
    f.write(str([r[0] for r in db.execute(text("SELECT column_name FROM information_schema.columns WHERE table_schema='geo' AND table_name='sous_bassin_swat_bas_sebou'")).fetchall()]) + "\n")

    f.write("--- nappe ---\n")
    f.write(str([r[0] for r in db.execute(text("SELECT column_name FROM information_schema.columns WHERE table_schema='geo' AND table_name='nappe'")).fetchall()]) + "\n")

    f.write("--- source ---\n")
    f.write(str([r[0] for r in db.execute(text("SELECT column_name FROM information_schema.columns WHERE table_schema='geo' AND table_name='source'")).fetchall()]) + "\n")
