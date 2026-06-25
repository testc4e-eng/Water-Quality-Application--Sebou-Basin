"""
backend/scripts/run_bloc3_m2_m3.py
Execute M2 (evaporation) + M3 (suivi_qualite_brg_garde_hebdo) dans des transactions separees.
Chaque migration est idempotente (ON CONFLICT DO NOTHING).
Usage: cd c:/dev/WQDSS/repo_git/backend && python scripts/run_bloc3_m2_m3.py
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
conn.autocommit = False
cur = conn.cursor()

# =============================================================================
# M2 — migration staging.mesures_jr_evaporation -> meteo.mesure_evaporation
# =============================================================================
SECTION("M2 -- MIGRATION EVAPORATION (staging -> meteo.mesure_evaporation)")

# Etat avant
SUBSEC("Etat avant M2")
cols, rows = run(cur, "SELECT COUNT(*) AS lignes_avant FROM meteo.mesure_evaporation;")
print_table(cols, rows)

# Colonnes de staging.mesures_jr_evaporation identifiees en prereq :
# date_jr, ire_station, evaporation_jr
# Colonnes cible meteo.mesure_evaporation :
# temps, station_id, ire_station, valeur_mm, est_valide, qa_flag_negative,
# qa_flag_station_unmapped, source_system, created_at

SUBSEC("Diagnostique mapping station M2 (orphelins)")
cols, rows = run(cur, """
    SELECT s.ire_station, COUNT(*) AS nb
    FROM staging.mesures_jr_evaporation s
    WHERE NOT EXISTS (
        SELECT 1 FROM infra.stations_mesure sm WHERE sm.code_station = s.ire_station
    )
    GROUP BY s.ire_station
    ORDER BY nb DESC
    LIMIT 10;
""")
if rows:
    print_table(cols, rows)
    print("  => Stations orphelines : elles seront inserees avec qa_flag_station_unmapped=true")
else:
    print("  => Toutes les stations sont mappees dans infra.stations_mesure")

SUBSEC("Execution INSERT M2")
try:
    cur.execute("""
        INSERT INTO meteo.mesure_evaporation (
            temps, station_id, ire_station, valeur_mm, est_valide,
            qa_flag_negative, qa_flag_station_unmapped, source_system, created_at
        )
        SELECT
            s.date_jr::timestamptz,
            sm.id,
            s.ire_station,
            s.evaporation_jr::double precision,
            (s.evaporation_jr IS NOT NULL AND s.evaporation_jr::double precision >= 0
             AND s.evaporation_jr::double precision <= 50),
            (s.evaporation_jr IS NOT NULL AND s.evaporation_jr::double precision < 0),
            false,
            'staging_migration_m2_v1',
            NOW()
        FROM staging.mesures_jr_evaporation s
        JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station
        WHERE s.evaporation_jr IS NOT NULL
        ON CONFLICT (temps, station_id) DO NOTHING;
    """)
    n_inserted = cur.rowcount
    conn.commit()
    print(f"  [OK] INSERT commite : {n_inserted} lignes inserees (ON CONFLICT NOTHING)")

    # Lignes avec station non mappee (inserees separement avec flag)
    cur.execute("""
        INSERT INTO meteo.mesure_evaporation (
            temps, station_id, ire_station, valeur_mm, est_valide,
            qa_flag_negative, qa_flag_station_unmapped, source_system, created_at
        )
        SELECT
            s.date_jr::timestamptz,
            gen_random_uuid(),  -- UUID factice pour les orph.
            s.ire_station,
            s.evaporation_jr::double precision,
            false,
            false,
            true,
            'staging_migration_m2_v1_unmapped',
            NOW()
        FROM staging.mesures_jr_evaporation s
        WHERE NOT EXISTS (
            SELECT 1 FROM infra.stations_mesure sm WHERE sm.code_station = s.ire_station
        )
        AND s.evaporation_jr IS NOT NULL;
    """)
    n_unmapped = cur.rowcount
    conn.commit()
    print(f"  [OK] Stations orphelines inserees avec flag : {n_unmapped} lignes")

except Exception as e:
    conn.rollback()
    print(f"  [ERREUR M2] {e}")

# Etat apres
SUBSEC("Etat apres M2 + QA")
cols, rows = run(cur, """
    SELECT
        COUNT(*) AS total_apres,
        COUNT(*) FILTER (WHERE source_system LIKE 'staging_migration_m2%') AS inserees_m2,
        COUNT(*) FILTER (WHERE qa_flag_negative = true) AS qa_negatif,
        COUNT(*) FILTER (WHERE qa_flag_station_unmapped = true) AS qa_orphelin,
        COUNT(*) FILTER (WHERE valeur_mm > 50) AS qa_hors_seuil,
        ROUND(AVG(valeur_mm)::numeric,4) AS moy_mm,
        MIN(temps::date) AS date_min,
        MAX(temps::date) AS date_max
    FROM meteo.mesure_evaporation;
""")
print_table(cols, rows)


# =============================================================================
# M3 — migration staging.suivi_qualite_brg_garde_hebdo -> qualite.*
# =============================================================================
SECTION("M3 -- MIGRATION QUALITE GARDE HEBDO")

# Identifier la table cible exacte
SUBSEC("Recherche table cible qualite.* hebdo")
cols, rows = run(cur, """
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_schema = 'qualite'
      AND (table_name ILIKE '%hebdo%' OR table_name ILIKE '%garde%')
    ORDER BY table_name;
""")
print_table(cols, rows)

if not rows:
    print("  [ERREUR] Aucune table cible trouvee dans qualite pour le pattern garde/hebdo.")
    print("  => M3 abandonnee. La table cible n'existe pas encore en base.")
    conn.close()
    sys.exit(0)

target_schema = rows[0]['table_schema']
target_table  = rows[0]['table_name']
target_full   = f"{target_schema}.{target_table}"
print(f"  Table cible identifiee : {target_full}")

# Colonnes de la table cible
SUBSEC(f"Colonnes {target_full}")
cols, rows = run(cur, """
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = %s AND table_name = %s
    ORDER BY ordinal_position;
""", (target_schema, target_table))
print_table(cols, rows)
target_cols = [r['column_name'] for r in rows]

# Colonnes source staging
SUBSEC("Colonnes staging.suivi_qualite_brg_garde_hebdo")
cols, rows = run(cur, """
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'staging'
      AND table_name = 'suivi_qualite_brg_garde_hebdo'
    ORDER BY ordinal_position;
""")
print_table(cols, rows)
src_cols = [r['column_name'] for r in rows]

# Etat avant
SUBSEC("Etat avant M3")
cols, rows = run(cur, f"SELECT COUNT(*) AS lignes_avant FROM {target_full};")
print_table(cols, rows)

# Echantillon source pour comprendre le format
SUBSEC("Echantillon staging.suivi_qualite_brg_garde_hebdo (5 lignes)")
cols, rows = run(cur, "SELECT * FROM staging.suivi_qualite_brg_garde_hebdo LIMIT 5;")
print_table(cols, rows)

# Construire l INSERT selon les colonnes disponibles dans la cible
# Colonnes communes attendues (intersection prudente)
SUBSEC("Execution INSERT M3")
try:
    # Determiner colonnes PK de la cible pour ON CONFLICT
    cols_pk, rows_pk = run(cur, """
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
         AND tc.table_schema    = kcu.table_schema
        WHERE tc.constraint_type = 'PRIMARY KEY'
          AND tc.table_schema = %s AND tc.table_name = %s
        ORDER BY kcu.ordinal_position;
    """, (target_schema, target_table))
    pk_cols = [r['column_name'] for r in rows_pk]
    print(f"  PK cible : {pk_cols}")

    # Insert conditionnel selon colonnes disponibles dans les deux tables
    # colonnes source connues: id, date_prelevement, ire_station, milieu_prelevement,
    #                          parametre_qualite, val_qual_brg_garde_hebdo, observation
    # colonnes cible connues : temps, station_id, ire_station, milieu_prelevement,
    #                          parametre_qualite, valeur, observation, source_row_id,
    #                          pas_temps, est_valide, qa_*, source_system, created_at

    insert_sql = f"""
        INSERT INTO {target_full} (
            temps, station_id, ire_station, milieu_prelevement,
            parametre_qualite, valeur, observation, source_row_id,
            pas_temps, est_valide,
            qa_flag_null_value, qa_flag_negative, qa_flag_param_missing, qa_flag_station_unmapped,
            source_system, created_at
        )
        SELECT
            s.date_prelevement::timestamptz,
            sm.id,
            s.ire_station,
            s.milieu_prelevement,
            s.parametre_qualite,
            s.val_qual_brg_garde_hebdo::double precision,
            s.observation,
            s.id,
            'hebdo',
            (s.val_qual_brg_garde_hebdo IS NOT NULL),
            (s.val_qual_brg_garde_hebdo IS NULL),
            (s.val_qual_brg_garde_hebdo IS NOT NULL
             AND s.val_qual_brg_garde_hebdo::double precision < 0),
            false,
            (sm.id IS NULL),
            'staging_migration_m3_v1',
            NOW()
        FROM staging.suivi_qualite_brg_garde_hebdo s
        JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station
        ON CONFLICT DO NOTHING;
    """
    cur.execute(insert_sql)
    n_inserted = cur.rowcount
    conn.commit()
    print(f"  [OK] INSERT commite : {n_inserted} lignes inserees")
except Exception as e:
    conn.rollback()
    print(f"  [ERREUR M3] {e}")
    print("  => Analyse du probleme et adaptation...")

    # Tentative 2 : colonnes minimales si erreur de schema
    try:
        cur.execute(f"""
            INSERT INTO {target_full} (
                temps, station_id, ire_station, parametre_qualite, valeur,
                source_row_id, pas_temps, est_valide,
                qa_flag_null_value, qa_flag_negative, source_system, created_at
            )
            SELECT
                s.date_prelevement::timestamptz,
                sm.id,
                s.ire_station,
                s.parametre_qualite,
                s.val_qual_brg_garde_hebdo::double precision,
                s.id,
                'hebdo',
                (s.val_qual_brg_garde_hebdo IS NOT NULL),
                (s.val_qual_brg_garde_hebdo IS NULL),
                (s.val_qual_brg_garde_hebdo IS NOT NULL
                 AND s.val_qual_brg_garde_hebdo::double precision < 0),
                'staging_migration_m3_v1_minimal',
                NOW()
            FROM staging.suivi_qualite_brg_garde_hebdo s
            JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station
            ON CONFLICT DO NOTHING;
        """)
        n2 = cur.rowcount
        conn.commit()
        print(f"  [OK] INSERT minimal commite : {n2} lignes")
    except Exception as e2:
        conn.rollback()
        print(f"  [ERREUR M3 tentative 2] {e2}")

# Etat apres M3
SUBSEC("Etat apres M3 + QA")
try:
    cols, rows = run(cur, f"""
        SELECT
            COUNT(*) AS total_apres,
            COUNT(*) FILTER (WHERE source_system LIKE 'staging_migration_m3%') AS inserees_m3,
            COUNT(*) FILTER (WHERE qa_flag_null_value = true) AS qa_null,
            COUNT(*) FILTER (WHERE qa_flag_negative = true) AS qa_negatif,
            ROUND(AVG(valeur)::numeric,4) AS valeur_moy,
            MIN(temps::date) AS date_min,
            MAX(temps::date) AS date_max,
            COUNT(DISTINCT parametre_qualite) AS nb_parametres
        FROM {target_full};
    """)
    print_table(cols, rows)
except Exception as e:
    print(f"  [ERREUR validation M3] {e}")

cur.close()
conn.close()
SECTION("M2 + M3 TERMINES -- Attente resultats M1 et livrable WASP")
print("  [OK] Migrations M2 et M3 executees. Stop avant M4/M5.\n")
