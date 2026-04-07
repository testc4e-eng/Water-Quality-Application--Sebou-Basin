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

print('=== Tables in geo schema ===')
for t in tables_to_check:
    res = db.execute(text(f"SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema='geo' AND table_name='{t}'")).fetchall()
    if res:
        print(f"FOUND: geo.{t}")
    else:
        print(f"MISSING: geo.{t}")

print('\n=== Existing API views for these ===')
res = db.execute(text("SELECT table_name FROM information_schema.views WHERE table_schema='api'")).fetchall()
for r in res:
    print(f"api.{r[0]}")
