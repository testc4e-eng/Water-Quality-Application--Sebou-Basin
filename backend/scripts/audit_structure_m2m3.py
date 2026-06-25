"""
Audit rapide des structures M2 + M3 avant migration.
"""
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")
import psycopg2
from psycopg2.extras import RealDictCursor

conn = psycopg2.connect(
    host="127.0.0.1", port=5432, dbname="abh_sad",
    user="postgres", password="c4e@test@2025",
    cursor_factory=RealDictCursor
)
conn.autocommit = True
cur = conn.cursor()

def pt(cols, rows, n=None):
    rows = list(rows[:n] if n else rows)
    if not rows and not cols:
        print("  (vide)")
        return
    ws = [max(len(str(c)), max((len(str(r[c])) for r in rows), default=0)) for c in cols]
    sep = "+-" + "-+-".join("-"*w for w in ws) + "-+"
    print(sep)
    print("| " + " | ".join(str(c).ljust(w) for c, w in zip(cols, ws)) + " |")
    print(sep)
    for r in rows:
        print("| " + " | ".join(str(r[c]).ljust(w) for c, w in zip(cols, ws)) + " |")
    print(sep)
    print(f"  ({len(rows)} lignes)")

def cols_of(schema, table):
    cur.execute("""
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = %s AND table_name = %s
        ORDER BY ordinal_position
    """, (schema, table))
    return [d.name for d in cur.description], cur.fetchall()

def count_of(fqn):
    cur.execute(f"SELECT COUNT(*) AS n FROM {fqn}")
    return cur.fetchone()["n"]

def sample(fqn, n=3):
    cur.execute(f"SELECT * FROM {fqn} LIMIT {n}")
    return [d.name for d in cur.description], cur.fetchall()


# ── ALL STAGING TABLES ──────────────────────────────────────────────────────
print("\n=== TOUTES TABLES STAGING ===")
cur.execute("""
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'staging'
    ORDER BY table_name
""")
pt([d.name for d in cur.description], cur.fetchall())

# ── M2 SOURCE : tables evaporation ──────────────────────────────────────────
print("\n=== M2 SOURCE — tables staging *evap* ===")
cur.execute("""
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'staging' AND table_name ILIKE '%evap%'
""")
evap = [r["table_name"] for r in cur.fetchall()]
if not evap:
    print("  AUCUNE TABLE EVAPORATION DANS STAGING")
for tbl in evap:
    print(f"\n  -- staging.{tbl} --")
    c, r = cols_of("staging", tbl)
    pt(c, r)
    print(f"  Lignes: {count_of('staging.'+tbl)}")
    c2, r2 = sample("staging."+tbl, 3)
    pt(c2, r2)

# ── M2 CIBLE ─────────────────────────────────────────────────────────────────
print("\n=== M2 CIBLE — tables meteo *evap* ===")
cur.execute("""
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'meteo' AND table_name ILIKE '%evap%'
""")
meteo_evap = [r["table_name"] for r in cur.fetchall()]
if not meteo_evap:
    print("  AUCUNE TABLE DANS METEO POUR EVAPORATION")
for tbl in meteo_evap:
    print(f"\n  -- meteo.{tbl} --")
    c, r = cols_of("meteo", tbl)
    pt(c, r)
    print(f"  Lignes: {count_of('meteo.'+tbl)}")

# CONTRAINTE UNIQUE sur la cible ?
print("\n  -- Contraintes meteo evap --")
cur.execute("""
    SELECT conname, contype, pg_get_constraintdef(oid) AS def
    FROM pg_constraint
    WHERE conrelid = (
        SELECT oid FROM pg_class
        WHERE relnamespace = (SELECT oid FROM pg_namespace WHERE nspname='meteo')
          AND relname ILIKE '%evap%'
    )
""")
if cur.description:
    pt([d.name for d in cur.description], cur.fetchall())

# ── M3 SOURCE ────────────────────────────────────────────────────────────────
print("\n=== M3 SOURCE — tables staging *hebdo* ou *garde* ===")
cur.execute("""
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'staging'
      AND (table_name ILIKE '%hebdo%' OR table_name ILIKE '%garde%')
""")
hebdo = [r["table_name"] for r in cur.fetchall()]
if not hebdo:
    print("  AUCUNE TABLE GARDE/HEBDO DANS STAGING")
for tbl in hebdo:
    print(f"\n  -- staging.{tbl} --")
    c, r = cols_of("staging", tbl)
    pt(c, r)
    print(f"  Lignes: {count_of('staging.'+tbl)}")
    c2, r2 = sample("staging."+tbl, 3)
    pt(c2, r2)

# ── M3 CIBLE ─────────────────────────────────────────────────────────────────
print("\n=== M3 CIBLE — tables qualite *hebdo* ou *garde* ===")
cur.execute("""
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'qualite'
      AND (table_name ILIKE '%hebdo%' OR table_name ILIKE '%garde%')
""")
qualite_hebdo = [r["table_name"] for r in cur.fetchall()]
if not qualite_hebdo:
    print("  AUCUNE TABLE DANS QUALITE POUR GARDE/HEBDO")
for tbl in qualite_hebdo:
    print(f"\n  -- qualite.{tbl} --")
    c, r = cols_of("qualite", tbl)
    pt(c, r)
    print(f"  Lignes: {count_of('qualite.'+tbl)}")
    # contraintes PK/UNIQUE
    cur.execute("""
        SELECT conname, contype, pg_get_constraintdef(oid) AS def
        FROM pg_constraint
        WHERE conrelid = (
            SELECT oid FROM pg_class
            WHERE relnamespace=(SELECT oid FROM pg_namespace WHERE nspname='qualite')
              AND relname=%s
        )
    """, (tbl,))
    c3, r3 = [d.name for d in cur.description], cur.fetchall()
    print(f"  Contraintes:")
    pt(c3, r3)

# ── M1 PRECISION : colonnes staging precip ──────────────────────────────────
print("\n=== M1 PRECISION — colonnes source precisees ===")
cur.execute("""
    SELECT table_name FROM information_schema.tables
    WHERE table_schema='staging' AND table_name ILIKE '%precip%'
""")
prec = [r["table_name"] for r in cur.fetchall()]
for tbl in prec:
    print(f"\n  -- staging.{tbl} --")
    c, r = cols_of("staging", tbl)
    pt(c, r)
    c2, r2 = sample("staging."+tbl, 2)
    pt(c2, r2)

cur.close()
conn.close()
print("\n=== FIN AUDIT STRUCTURE ===")
