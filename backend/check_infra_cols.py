from app.db.session import SessionLocal
from sqlalchemy import text
db = SessionLocal()

def check(name):
    print(f"--- {name} ---")
    try:
        cols = db.execute(text(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='api' AND table_name='{name}'")).fetchall()
        for c in cols:
            print(f"  {c[0]} ({c[1]})")
    except Exception as e:
        print(f"  Error: {e}")

check("v_inventaire_pollution_steps_detail")
check("v_inventaire_pollution_stms_detail")
check("v_barrage_dimension")
