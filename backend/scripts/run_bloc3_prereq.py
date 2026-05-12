"""
backend/scripts/run_bloc3_prereq.py
Lit les structures des tables source/cible pour M2, M3, M1
et construit les scripts de migration exacts.
Usage: cd c:/dev/WQDSS/repo_git/backend && python scripts/run_bloc3_prereq.py
"""
import io, sys, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

import psycopg2
from psycopg2.extras import RealDictCursor

CONN_PARAMS = dict(
    host="127.0.0.1", port=5432, dbname="abh_sad",
    user="postgres", password="c4e@test@2025", connect_timeout=10,
)

def SECTION(t): print(f"\n{'='*70}\n{t}\n{'='*70}")
def SUBSEC(t):  print(f"\n-- {t}")

def run(cur, sql, params=None):
    cur.execute(sql, params)
    if cur.description:
        cols = [d.name for d in cur.description]
        return cols, cur.fetchall()
    return [], []

def print_table(cols, rows, max_rows=None):
    if not cols:
        print("  (aucun resultat)")
        return
    rows = list(rows[:max_rows] if max_rows else rows)
    widths = [max(len(str(c)), max((len(str(r[c])) for r in rows), default=0)) for c in cols]
    sep  = "+-" + "-+-".join("-"*w for w in widths) + "-+"
    head = "| " + " | ".join(str(c).ljust(w) for c,w in zip(cols,widths)) + " |"
    print(sep); print(head); print(sep)
    for row in rows:
        print("| " + " | ".join(str(row[c]).ljust(w) for c,w in zip(cols,widths)) + " |")
    print(sep)
    print(f"  ({len(rows)} ligne(s))")

conn = psycopg2.connect(**CONN_PARAMS, cursor_factory=RealDictCursor)
conn.autocommit = True
cur = conn.cursor()

# ─────────────────────────────────────────────────────────────────────────────
# 1. Lister les tables staging disponibles
# ─────────────────────────────────────────────────────────────────────────────
SECTION("1. TABLES DU SCHEMA STAGING")
cols, rows = run(cur, """
    SELECT table_name,
           pg_size_pretty(pg_total_relation_size(quote_ident(table_schema)||'.'||quote_ident(table_name))) AS taille
    FROM information_schema.tables
    WHERE table_schema = 'staging'
    ORDER BY table_name;
""")
print_table(cols, rows)

# ─────────────────────────────────────────────────────────────────────────────
# 2. Colonnes des tables M2 source et cible
# ─────────────────────────────────────────────────────────────────────────────
SECTION("2. COLONNES M2 -- Source : staging.* evaporation")
# Chercher tables contenant "evap"
cols, rows = run(cur, """
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE (table_name ILIKE '%evap%' OR table_name ILIKE '%evapo%')
    ORDER BY table_schema, table_name;
""")
print_table(cols, rows)

SUBSEC("Colonnes tables staging evaporation trouvees")
for r in rows:
    sch, tbl = r['table_schema'], r['table_name']
    print(f"\n  >> {sch}.{tbl}")
    c2, r2 = run(cur, f"""
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = %s AND table_name = %s
        ORDER BY ordinal_position;
    """, (sch, tbl))
    print_table(c2, r2)
    c3, r3 = run(cur, f"SELECT COUNT(*) AS lignes FROM {sch}.{tbl};")
    print_table(c3, r3)

SUBSEC("Colonnes cible : meteo.mesure_evaporation (si existe)")
cols, rows = run(cur, """
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_schema = 'meteo' AND table_name ILIKE '%evap%';
""")
print_table(cols, rows)
for r in rows:
    sch, tbl = r['table_schema'], r['table_name']
    print(f"\n  >> {sch}.{tbl}")
    c2, r2 = run(cur, """
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = %s AND table_name = %s
        ORDER BY ordinal_position;
    """, (sch, tbl))
    print_table(c2, r2)
    c3, r3 = run(cur, f"SELECT COUNT(*) AS lignes FROM {sch}.{tbl};")
    print_table(c3, r3)

# ─────────────────────────────────────────────────────────────────────────────
# 3. Colonnes tables M3 source et cible
# ─────────────────────────────────────────────────────────────────────────────
SECTION("3. COLONNES M3 -- Source/Cible qualite garde hebdo")
cols, rows = run(cur, """
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE (table_name ILIKE '%hebdo%' OR table_name ILIKE '%garde%')
    ORDER BY table_schema, table_name;
""")
print_table(cols, rows)
for r in rows:
    sch, tbl = r['table_schema'], r['table_name']
    print(f"\n  >> {sch}.{tbl}")
    c2, r2 = run(cur, """
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = %s AND table_name = %s
        ORDER BY ordinal_position;
    """, (sch, tbl))
    print_table(c2, r2)
    c3, r3 = run(cur, f"SELECT COUNT(*) AS lignes FROM {sch}.{tbl};")
    print_table(c3, r3)

# ─────────────────────────────────────────────────────────────────────────────
# 4. Audit M1 : ecart precipitation
# ─────────────────────────────────────────────────────────────────────────────
SECTION("4. AUDIT M1 -- Ecart precipitation staging vs meteo")

# Volume total des deux tables
SUBSEC("Volumes")
cols, rows = run(cur, """
    SELECT 'staging precip' AS source, COUNT(*) AS lignes
    FROM staging.mesures_precip
    UNION ALL
    SELECT 'meteo.mesure_precipitation', COUNT(*)
    FROM meteo.mesure_precipitation;
""")
print_table(cols, rows)

# Colonnes source precip
SUBSEC("Colonnes staging.mesures_precip")
cols, rows = run(cur, """
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'staging' AND table_name = 'mesures_precip'
    ORDER BY ordinal_position;
""")
print_table(cols, rows)

# Colonnes cible meteo
SUBSEC("Colonnes meteo.mesure_precipitation")
cols, rows = run(cur, """
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'meteo' AND table_name = 'mesure_precipitation'
    ORDER BY ordinal_position;
""")
print_table(cols, rows)

# Analyse de l'ecart : stations orphelines
SUBSEC("Stations staging non mappees dans infra.stations_mesure")
cols, rows = run(cur, """
    SELECT s.ire_station,
           COUNT(*) AS nb_lignes_staging,
           MIN(s.date_jr) AS date_min,
           MAX(s.date_jr) AS date_max
    FROM staging.mesures_precip s
    WHERE NOT EXISTS (
        SELECT 1 FROM infra.stations_mesure sm
        WHERE sm.code_station = s.ire_station
    )
    GROUP BY s.ire_station
    ORDER BY nb_lignes_staging DESC
    LIMIT 20;
""")
print_table(cols, rows)
if not rows:
    print("  => Toutes les stations staging sont mappees dans infra.stations_mesure")

# Lignes staging absentes de la cible (cle: temps + station_id)
SUBSEC("Lignes staging manquantes dans meteo.mesure_precipitation (par station)")
cols, rows = run(cur, """
    SELECT s.ire_station,
           count(*) AS nb_manquantes,
           min(s.date_jr) AS date_min,
           max(s.date_jr) AS date_max
    FROM staging.mesures_precip s
    JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station
    WHERE NOT EXISTS (
        SELECT 1 FROM meteo.mesure_precipitation mp
        WHERE mp.station_id = sm.id
          AND mp.temps = s.date_jr::timestamptz
    )
    GROUP BY s.ire_station
    ORDER BY nb_manquantes DESC
    LIMIT 20;
""")
print_table(cols, rows)

# Synthese ecart
SUBSEC("Synthese ecart precipitation")
cols, rows = run(cur, """
    SELECT
        (SELECT COUNT(*) FROM staging.mesures_precip) AS staging_total,
        (SELECT COUNT(*) FROM meteo.mesure_precipitation) AS cible_total,
        (SELECT COUNT(*) FROM staging.mesures_precip s
         JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station
         WHERE NOT EXISTS (
             SELECT 1 FROM meteo.mesure_precipitation mp
             WHERE mp.station_id = sm.id AND mp.temps = s.date_jr::timestamptz
         )) AS lignes_manquantes_mappables,
        (SELECT COUNT(*) FROM staging.mesures_precip s
         WHERE NOT EXISTS (
             SELECT 1 FROM infra.stations_mesure sm WHERE sm.code_station = s.ire_station
         )) AS lignes_station_orpheline;
""")
print_table(cols, rows)

# ─────────────────────────────────────────────────────────────────────────────
# 5. Audit M4 : existence tables debit source
# ─────────────────────────────────────────────────────────────────────────────
SECTION("5. AUDIT M4 -- Tables staging debit source")
cols, rows = run(cur, """
    SELECT table_schema, table_name,
           pg_size_pretty(pg_total_relation_size(quote_ident(table_schema)||'.'||quote_ident(table_name))) AS taille
    FROM information_schema.tables
    WHERE table_schema = 'staging'
      AND (table_name ILIKE '%source%' OR table_name ILIKE '%debit%')
    ORDER BY table_name;
""")
print_table(cols, rows)
for r in rows:
    sch, tbl = r['table_schema'], r['table_name']
    c3, r3 = run(cur, f"SELECT COUNT(*) AS lignes FROM {sch}.{tbl};")
    print(f"  {sch}.{tbl}: ", end="")
    print_table(c3, r3)

# ─────────────────────────────────────────────────────────────────────────────
# 6. Referentiel WASP complet
# ─────────────────────────────────────────────────────────────────────────────
SECTION("6. REFERENTIEL WASP -- wasp_sebou.wasp_variables (complet)")
cols, rows = run(cur, """
    SELECT id, code, name, unit,
           (SELECT COUNT(*) FROM wasp_sebou.wasp_results r
            WHERE r.variable_id = v.id) AS nb_obs,
           (SELECT ROUND(AVG(r.value)::numeric,4) FROM wasp_sebou.wasp_results r
            WHERE r.variable_id = v.id) AS valeur_moy,
           (SELECT ROUND(MIN(r.value)::numeric,4) FROM wasp_sebou.wasp_results r
            WHERE r.variable_id = v.id) AS valeur_min,
           (SELECT ROUND(MAX(r.value)::numeric,4) FROM wasp_sebou.wasp_results r
            WHERE r.variable_id = v.id) AS valeur_max
    FROM wasp_sebou.wasp_variables v
    ORDER BY code;
""")
print_table(cols, rows)

# mapping_parametre_source disponible ?
SUBSEC("mapping_parametre_source (10 premiers)")
cols, rows = run(cur, """
    SELECT * FROM metadata.mapping_parametre_source LIMIT 10;
""")
print_table(cols, rows)

cur.close()
conn.close()
SECTION("PREREQ TERMINE")
print("  Resultats collectes. Ecriture des scripts de migration en cours...\n")
