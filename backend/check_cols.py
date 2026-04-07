import psycopg2, json

conn = psycopg2.connect(
    host="127.0.0.1", port=5432, dbname="abh_sad",
    user="postgres", password="c4e@test@2025"
)
cur = conn.cursor()

tables = [
    "qualite.mesure_qualite_riviere",
    "qualite.mesure_qualite_sebou",
    "staging.mesures_debit_jr",
    "staging.mesures_precipitations_jr_traitees",
    "infra.stations"
]

for t in tables:
    schema, name = t.split('.')
    print(f"=== {t} ===")
    cur.execute("""
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = %s AND table_name = %s
        ORDER BY ordinal_position
    """, (schema, name))
    rows = cur.fetchall()
    if not rows:
        print("  !!! RELATION NOT FOUND !!!")
    for r in rows:
        print(f"  {r[0]:20s} | {r[1]:20s} | {r[2]}")
    print()

conn.close()
