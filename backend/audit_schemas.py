"""
Script d'audit : tables/vues dans les schémas hors 'api' 
et croisement avec les vues exposées dans api.*
"""
import psycopg2, json

conn = psycopg2.connect(
    host="127.0.0.1", port=5432, dbname="abh_sad",
    user="postgres", password="c4e@test@2025"
)
cur = conn.cursor()

# 1. Lister tous les schémas présents
cur.execute("""
SELECT DISTINCT table_schema
FROM information_schema.tables
WHERE table_schema NOT IN ('pg_catalog','information_schema','topology')
ORDER BY 1
""")
schemas = [r[0] for r in cur.fetchall()]
print("=== SCHÉMAS PRÉSENTS ===")
print(", ".join(schemas))
print()

# 2. Lister toutes les vues dans le schéma 'api'
cur.execute("""
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'api'
ORDER BY table_name
""")
api_views = {r[0] for r in cur.fetchall()}
print(f"=== VUES api.* ({len(api_views)}) ===")
for v in sorted(api_views):
    print(f"  api.{v}")
print()

# 3. Pour chaque schéma hors api/public, lister tables+vues avec nb lignes et commentaires
NON_API_SCHEMAS = [s for s in schemas if s not in ('api',)]

print("=== TABLES/VUES HORS SCHÉMA api ===\n")

results = {}  # schema -> [tables]

for schema in NON_API_SCHEMAS:
    cur.execute("""
        SELECT
            t.table_name,
            t.table_type,
            obj_description(c.oid) AS comment,
            (SELECT reltuples::bigint FROM pg_class c2
             JOIN pg_namespace n2 ON n2.oid = c2.relnamespace
             WHERE c2.relname = t.table_name AND n2.nspname = t.table_schema
             LIMIT 1) AS row_est
        FROM information_schema.tables t
        JOIN pg_class c ON c.relname = t.table_name
        JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = t.table_schema
        WHERE t.table_schema = %s
        ORDER BY t.table_name
    """, (schema,))
    rows = cur.fetchall()
    if not rows:
        continue

    results[schema] = []
    print(f"--- Schéma: {schema} ({len(rows)} objets) ---")
    for name, ttype, comment, row_est in rows:
        # Vérifier si une vue api existe avec un nom similaire
        matched_api = [v for v in api_views if name in v or v.replace('v_','') in name]
        has_api = "[API OK]" if matched_api else "[NO API]"
        flag = f"  -> Vues API candidates: {matched_api}" if matched_api else ""
        ttype_short = "TABLE" if "TABLE" in ttype else "VIEW"
        row_str = f"{int(row_est):,}" if row_est else "?"
        print(f"  [{ttype_short}] {schema}.{name:50s} ~{row_str:>8} lignes  {has_api}{flag}")
        if comment:
            print(f"           Note: {comment}")
        results[schema].append({
            "name": name, "type": ttype_short,
            "rows": int(row_est) if row_est else 0,
            "comment": comment,
            "has_api_view": bool(matched_api),
            "matched_api_views": matched_api
        })
    print()

# 4. Tables dans public qui ne sont PAS couvertes par une vue api
print("=== TABLES public.* SANS VUE api COUVRANT EXACTEMENT ===\n")
cur.execute("""
    SELECT
        t.table_name,
        t.table_type,
        obj_description(c.oid) AS comment,
        (SELECT reltuples::bigint FROM pg_class c2
         JOIN pg_namespace n2 ON n2.oid = c2.relnamespace
         WHERE c2.relname = t.table_name AND n2.nspname = 'public'
         LIMIT 1) AS row_est
    FROM information_schema.tables t
    JOIN pg_class c ON c.relname = t.table_name
    JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = 'public'
    WHERE t.table_schema = 'public'
    ORDER BY t.table_name
""")
public_tables = cur.fetchall()

# Noms des tables sources utilisées dans le code backend (layers.py, etc.)
COVERED_BY_CODE = {
    'mesures_debit_jr', 'mesures_temperatures_jr', 'mesures_qualite_rivieres',
    'mesures_qualite_barrages', 'stations_abhs', 'barrages_abhs',
    'bassin_sebou', 'sous_bassin_sebou', 'reseau_hydro_abhs',
    'adm_regions_abhs', 'adm_provinces_abhs', 'adm_cercles_abhs',
    'adm_communes_abhs', 'adm_villes_abhs', 'adm_douars_abhs',
    'spatial_ref_sys'
}

for name, ttype, comment, row_est in public_tables:
    ttype_short = "TABLE" if "TABLE" in ttype else "VIEW"
    row_str = f"{int(row_est):,}" if row_est else "?"
    matched_api = [v for v in api_views if name.replace('_abhs','') in v or name in v]
    has_api = "[API OK]" if matched_api else ("[IN CODE]" if name in COVERED_BY_CODE else "[NOT EXPOSED]")
    print(f"  [{ttype_short}] public.{name:50s} ~{row_str:>8} lignes  {has_api}")
    if comment:
        print(f"           Note: {comment}")

conn.close()
print("\nAudit OK.")
