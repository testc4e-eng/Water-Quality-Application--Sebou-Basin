"""
M3 injection finale : suivi_qualite_brg_garde_hebdo -> qualite.mesure_qualite_barrage
- station_id = 5533ab49-e2ed-4580-862d-32146588bbf5 (brg garde du sebou, code 3546/8)
- PK          : (temps, station_id, parametre_qualite, source_row_id)
- qa_flag_station_unmapped = true pour traçabilite (ire_station NULL dans source)
"""
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")
import psycopg2
from psycopg2.extras import RealDictCursor

conn = psycopg2.connect(host="127.0.0.1", port=5432, dbname="abh_sad",
    user="postgres", password="c4e@test@2025", cursor_factory=RealDictCursor)
conn.autocommit = False
cur = conn.cursor()

GARDE_STATION_ID = "5533ab49-e2ed-4580-862d-32146588bbf5"

def pr(label, sql, params=None):
    print(f"\n=== {label} ===")
    cur.execute(sql, params)
    if not cur.description: print("(no result)"); return
    cols = [d.name for d in cur.description]
    rows = list(cur.fetchall())
    if not rows: print("(vide)"); return
    ws = [max(len(str(c)), max(len(str(r[c])) for r in rows)) for c in cols]
    print("+-" + "-+-".join("-"*w for w in ws) + "-+")
    print("| " + " | ".join(str(c).ljust(w) for c,w in zip(cols,ws)) + " |")
    print("+-" + "-+-".join("-"*w for w in ws) + "-+")
    for r in rows:
        print("| " + " | ".join(str(r[c]).ljust(w) for c,w in zip(cols,ws)) + " |")
    print("+-" + "-+-".join("-"*w for w in ws) + "-+")
    print(f"  ({len(rows)} lignes)")

print(f"\n  Station cible retenue : brg garde du sebou | UUID={GARDE_STATION_ID}")

# Etat avant
pr("ETAT AVANT M3",
   "SELECT COUNT(*) AS total_avant, "
   "COUNT(*) FILTER (WHERE source_system LIKE 'staging_migration_m3%') AS inserees_m3 "
   "FROM qualite.mesure_qualite_barrage")

# Lignes a inserer (non dupliquees via PK)
cur.execute("""
    SELECT COUNT(*) AS a_inserer
    FROM staging.suivi_qualite_brg_garde_hebdo s
    WHERE NOT EXISTS (
        SELECT 1 FROM qualite.mesure_qualite_barrage q
        WHERE q.station_id = %s
          AND q.temps::date = s.date_prelevement
          AND q.parametre_qualite = s.parametre_qualite
          AND q.source_row_id = s.id
    )
""", (GARDE_STATION_ID,))
r = cur.fetchone()
print(f"\n  Lignes staging non encore dans cible : {r['a_inserer']}")

# INSERT M3
print("\n  => Execution INSERT M3...")
try:
    cur.execute("""
        INSERT INTO qualite.mesure_qualite_barrage (
            temps,
            station_id,
            ire_station,
            parametre_qualite,
            milieu_prelevement,
            valeur,
            source_row_id,
            pas_temps,
            est_valide,
            qa_flag_null_value,
            qa_flag_negative,
            qa_flag_station_unmapped,
            source_system,
            created_at
        )
        SELECT
            s.date_prelevement::timestamptz,
            %s,
            'GARDE_SEBOU_INFERRED_3546_8',
            s.parametre_qualite,
            s.milieu_prelevement,
            s.val_qual_brg_garde_hebdo,
            s.id,
            'hebdomadaire',
            (s.val_qual_brg_garde_hebdo IS NOT NULL),
            (s.val_qual_brg_garde_hebdo IS NULL),
            (s.val_qual_brg_garde_hebdo IS NOT NULL AND s.val_qual_brg_garde_hebdo < 0),
            true,
            'staging_migration_m3_garde_hebdo_v1',
            NOW()
        FROM staging.suivi_qualite_brg_garde_hebdo s
        WHERE NOT EXISTS (
            SELECT 1 FROM qualite.mesure_qualite_barrage q
            WHERE q.station_id = %s
              AND q.temps::date = s.date_prelevement
              AND q.parametre_qualite = s.parametre_qualite
              AND q.source_row_id = s.id
        )
        ON CONFLICT (temps, station_id, parametre_qualite, source_row_id) DO NOTHING
    """, (GARDE_STATION_ID, GARDE_STATION_ID))
    n_ins = cur.rowcount
    conn.commit()
    print(f"  [OK] M3 : {n_ins} lignes inserees")
except Exception as e:
    conn.rollback()
    print(f"  [ERREUR M3] {type(e).__name__}: {e}")

# Etat final M3
pr("ETAT FINAL qualite.mesure_qualite_barrage apres M3",
   """SELECT
       COUNT(*) AS total_apres,
       COUNT(*) FILTER (WHERE source_system LIKE 'staging_migration_m3%') AS inserees_m3,
       COUNT(*) FILTER (WHERE qa_flag_station_unmapped = true) AS flag_station_inferred,
       COUNT(*) FILTER (WHERE qa_flag_null_value = true)       AS qa_null,
       COUNT(*) FILTER (WHERE qa_flag_negative = true)         AS qa_negatif,
       COUNT(DISTINCT parametre_qualite)                       AS nb_params_total,
       COUNT(DISTINCT station_id)                              AS nb_stations,
       MIN(temps::date)                                        AS date_min,
       MAX(temps::date)                                        AS date_max
   FROM qualite.mesure_qualite_barrage""")

# Verifier les parametres migres specifiquement
pr("PARAMETRES migres par M3 (top 10)",
   """SELECT parametre_qualite AS parametre, COUNT(*) AS n
   FROM qualite.mesure_qualite_barrage
   WHERE source_system = 'staging_migration_m3_garde_hebdo_v1'
   GROUP BY parametre_qualite ORDER BY n DESC LIMIT 10""")

cur.close()
conn.close()
print("\n=== M3 INJECTION TERMINEE ===")
