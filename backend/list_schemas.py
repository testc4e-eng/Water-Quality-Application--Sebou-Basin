from app.db.session import SessionLocal
from sqlalchemy import text
db = SessionLocal()
res = db.execute(text("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema IN ('geo', 'infra', 'admin')")).fetchall()
for r in res:
    print(f"{r[0]}.{r[1]}")
