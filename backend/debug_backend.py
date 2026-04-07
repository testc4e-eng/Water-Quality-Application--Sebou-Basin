from sqlalchemy import text
from app.db.session import SessionLocal

db = SessionLocal()

print("--- Testing Raw Tables ---")
try:
    sql = text("""
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema', 'topology')
        ORDER BY table_schema, table_name;
    """)
    rows = db.execute(sql).fetchall()
    print(f"Found {len(rows)} tables.")
    for r in rows[:5]:
        print(f"  {r.table_schema}.{r.table_name}")
except Exception as e:
    print(f"Error listing tables: {e}")

print("\n--- Testing Data Scan Queries ---")
try:
    from app.services.admin_data_scan_service import _table_exists, _build_legacy_station_union
    
    print(f"infra.stations exists? {_table_exists(db, 'infra', 'stations')}")
    print(f"staging.mesures_debit_jr exists? {_table_exists(db, 'staging', 'mesures_debit_jr')}")
    
    union_sql = _build_legacy_station_union(db, 'ire_station')
    print(f"Union SQL length: {len(union_sql)}")
    
    if union_sql:
        count_sql = f"SELECT COUNT(*) FROM ({union_sql}) AS u"
        count = db.execute(text(count_sql)).scalar()
        print(f"Total records in union: {count}")
        
        distinct_stations = db.execute(text(f"SELECT COUNT(DISTINCT station_id) FROM ({union_sql}) AS u")).scalar()
        print(f"Distinct stations in union: {distinct_stations}")
except Exception as e:
    print(f"Error in scan debug: {e}")

db.close()
