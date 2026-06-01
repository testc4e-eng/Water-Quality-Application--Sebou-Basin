import psycopg2

conn = psycopg2.connect(
    host='127.0.0.1', port=5432, dbname='abh_sad',
    user='postgres', password='c4e@test@2025'
)
cur = conn.cursor()

print("=== Audit Sens Écoulement (Z_Max vs Z_Min) ===")
cur.execute("""
    SELECT 
        COUNT(*) FILTER (WHERE "Z_Max" >= "Z_Min") as normal,
        COUNT(*) FILTER (WHERE "Z_Max" < "Z_Min") as reversed,
        COUNT(*) as total
    FROM geo.reseau_hydrographique
""")
r = cur.fetchone()
print(f"  Z_Max >= Z_Min: {r[0]} ({r[0]/r[2]*100:.1f}%)")
print(f"  Z_Max < Z_Min: {r[1]} ({r[1]/r[2]*100:.1f}%)")

print("\n=== Échantillon inversés (si existent) ===")
if r[1] > 0:
    cur.execute("""
        SELECT id, "Z_Min", "Z_Max" 
        FROM geo.reseau_hydrographique 
        WHERE "Z_Max" < "Z_Min" 
        LIMIT 5
    """)
    for r in cur.fetchall():
        print(f"  ID={r[0]}, Z_Min={r[1]}, Z_Max={r[2]}")
else:
    print("  Tous les segments ont Z_Max >= Z_Min.")

conn.close()
