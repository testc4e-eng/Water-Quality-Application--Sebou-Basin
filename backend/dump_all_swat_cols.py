from app.db.session import SessionLocal
from sqlalchemy import text

db = SessionLocal()

tables = [
    'sous_bassin_swat_bas_sebou', 'sous_bassin_swat_bassin_cotier',
    'sous_bassin_swat_beht', 'sous_bassin_swat_haut_sebou',
    'sous_bassin_swat_leben_innaouen', 'sous_bassin_swat_moyen_sebou',
    'sous_bassin_swat_ouergha'
]

with open("swat_cols.txt", "w") as f:
    for t in tables:
        cols = [r[0] for r in db.execute(text(f"SELECT column_name FROM information_schema.columns WHERE table_schema='geo' AND table_name='{t}'")).fetchall()]
        f.write(f"{t}: {cols}\n\n")
