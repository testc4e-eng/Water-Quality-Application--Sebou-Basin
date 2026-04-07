from app.db.session import SessionLocal
from sqlalchemy import text
db = SessionLocal()
res = db.execute(text("SELECT table_name, table_type FROM information_schema.tables WHERE table_schema='api'")).fetchall()
for r in res:
    print(f"{r[1]}: {r[0]}")
