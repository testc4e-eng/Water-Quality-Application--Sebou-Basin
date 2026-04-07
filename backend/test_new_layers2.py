from app.db.session import SessionLocal
from sqlalchemy import text
db = SessionLocal()

tables_to_check = [
    'nappe', 'source', 'sous_bassin_abh',
    'sous_bassin_swat_bas_sebou', 'sous_bassin_swat_bassin_cotier',
    'sous_bassin_swat_beht', 'sous_bassin_swat_haut_sebou',
    'sous_bassin_swat_leben_innaouen', 'sous_bassin_swat_moyen_sebou',
    'sous_bassin_swat_ouergha'
]

print("".join(["-"]*30))
for t in tables_to_check:
    res = db.execute(text(f"SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema='geo' AND table_name='{t}'")).fetchall()
    print(f"{t}: {'YES' if res else 'NO'}")
print("".join(["-"]*30))
