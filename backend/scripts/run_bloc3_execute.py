"""
backend/scripts/run_bloc3_execute.py
Execute M2 (verification idempotente) + M3 (migration garde hebdo) + M1 (audit recap).
Usage: python scripts/run_bloc3_execute.py
"""
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")
import psycopg2
from psycopg2.extras import RealDictCursor

CONN = dict(host="127.0.0.1", port=5432, dbname="abh_sad",
            user="postgres", password="c4e@test@2025", cursor_factory=RealDictCursor)

def SEP(t): print(f"\n{'='*70}\n{t}\n{'='*70}")
def SUB(t):  print(f"\n-- {t}")

def pt(cur, max_rows=None):
    if not cur.description: print("  (no result set)"); return
    cols = [d.name for d in cur.description]
    rows = list(cur.fetchall())
    if max_rows: rows = rows[:max_rows]
    if not rows: print("  (0 lignes)"); return
    ws = [max(len(str(c)), max((len(str(r[c])) for r in rows), default=0)) for c in cols]
    sep = "+-" + "-+-".join("-"*w for w in ws) + "-+"
    print(sep)
    print("| " + " | ".join(str(c).ljust(w) for c,w in zip(cols,ws)) + " |")
    print(sep)
    for r in rows:
        print("| " + " | ".join(str(r[c]).ljust(w) for c,w in zip(cols,ws)) + " |")
    print(sep)
    print(f"  ({len(rows)} lignes)")

conn = psycopg2.connect(**CONN)
conn.autocommit = False
cur = conn.cursor()


# =============================================================================
# M2 — VERIFICATION IDEMPOTENCE (deja migre avant cette session)
# Source  : staging.mesures_evaporation_jr  (48 900 lignes)
#   cols  : id, date_mesure (date), ire_station (text), val_evaporation (float), geom
# Cible   : meteo.mesure_evaporation        (48 900 lignes — deja peuple)
#   PK    : (temps, station_id)
# Resultat attendu : 0 manquantes → aucune action
# =============================================================================
SEP("M2 — EVAPORATION : verification idempotence")

SUB("Volumes source vs cible")
cur.execute("""
    SELECT
        (SELECT COUNT(*) FROM staging.mesures_evaporation_jr)          AS staging_total,
        (SELECT COUNT(*) FROM staging.mesures_evaporation_jr
         WHERE val_evaporation IS NOT NULL)                             AS staging_non_null,
        (SELECT COUNT(*) FROM meteo.mesure_evaporation)                AS cible_total,
        (SELECT COUNT(*) FROM meteo.mesure_evaporation
         WHERE valeur IS NOT NULL)                                      AS cible_non_null
""")
pt(cur)

cur.execute("""
    SELECT COUNT(*) AS manquantes_migrables
    FROM staging.mesures_evaporation_jr s
    JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station
    WHERE NOT EXISTS (
        SELECT 1 FROM meteo.mesure_evaporation me
        WHERE me.station_id = sm.id
          AND me.temps = s.date_mesure::timestamptz
    )
    AND s.val_evaporation IS NOT NULL
""")
n_missing = cur.fetchone()["manquantes_migrables"]
print(f"\n  Lignes manquantes migrables : {n_missing}")

if n_missing == 0:
    print("  [OK] M2 deja complete — 0 action.")
    conn.commit()
else:
    print(f"  [INFO] {n_missing} manquantes — complement en cours...")
    try:
        cur.execute("""
            INSERT INTO meteo.mesure_evaporation
                (temps, station_id, valeur, pas_temps, est_valide,
                 qa_flag_negative, qa_flag_outlier, qa_flag_method_missing,
                 qa_flag_null_value, source_system, created_at)
            SELECT
                s.date_mesure::timestamptz,
                sm.id,
                s.val_evaporation,
                'journalier',
                (s.val_evaporation >= 0 AND s.val_evaporation <= 50),
                (s.val_evaporation < 0),
                false, false, false,
                'staging_migration_m2_complement',
                NOW()
            FROM staging.mesures_evaporation_jr s
            JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station
            WHERE NOT EXISTS (
                SELECT 1 FROM meteo.mesure_evaporation me
                WHERE me.station_id = sm.id
                  AND me.temps = s.date_mesure::timestamptz
            )
            AND s.val_evaporation IS NOT NULL
            ON CONFLICT (temps, station_id) DO NOTHING
        """)
        n_ins = cur.rowcount
        conn.commit()
        print(f"  [OK] {n_ins} lignes inserees.")
    except Exception as e:
        conn.rollback()
        print(f"  [ERREUR M2] {e}")

SUB("Etat final meteo.mesure_evaporation")
cur.execute("""
    SELECT
        COUNT(*)                                         AS total,
        COUNT(*) FILTER (WHERE valeur IS NULL)           AS null_valeur,
        COUNT(*) FILTER (WHERE qa_flag_negative = true)  AS negatifs,
        COUNT(*) FILTER (WHERE valeur > 50)              AS hors_seuil,
        ROUND(AVG(valeur)::numeric, 3)                   AS moy_mm,
        MIN(temps::date)                                 AS date_min,
        MAX(temps::date)                                 AS date_max,
        COUNT(DISTINCT station_id)                       AS nb_stations
    FROM meteo.mesure_evaporation
""")
pt(cur)


# =============================================================================
# M3 — MIGRATION suivi_qualite_brg_garde_hebdo -> qualite.mesure_qualite_barrage
#
# Source : staging.suivi_qualite_brg_garde_hebdo
#   cols : id (int), date_prelevement (date), ire_station (text),
#          milieu_prelevement (text), parametre_qualite (text),
#          val_qual_brg_garde_hebdo (float), observation (text)
#   NOTE : ire_station est NULL dans l'echantillon (donnees barrage sans code station)
#
# Cible  : qualite.mesure_qualite_barrage  (table identifiee comme equivalente)
#   Mapping : date_prelevement -> temps, val_qual_brg_garde_hebdo -> valeur,
#             parametre_qualite -> parametre_qualite
#
# Strategie :
#   1. JOIN sur infra.stations_mesure (stations mappees)
#   2. Orphelins (ire_station NULL ou non mappee) : inserer avec flag qa
#   3. Idempotent : WHERE NOT EXISTS (temps::date, station_id, parametre_qualite)
# =============================================================================
SEP("M3 — QUALITE GARDE HEBDO : migration")

SUB("Volume source + stats")
cur.execute("""
    SELECT
        COUNT(*)                                  AS total,
        COUNT(DISTINCT ire_station)               AS nb_stations_src,
        COUNT(*) FILTER (WHERE ire_station IS NULL) AS ire_station_null,
        COUNT(DISTINCT parametre_qualite)         AS nb_parametres,
        MIN(date_prelevement)                     AS date_min,
        MAX(date_prelevement)                     AS date_max
    FROM staging.suivi_qualite_brg_garde_hebdo
""")
pt(cur)

SUB("Parametres distincts")
cur.execute("""
    SELECT parametre_qualite AS parametre, COUNT(*) AS n
    FROM staging.suivi_qualite_brg_garde_hebdo
    GROUP BY parametre_qualite
    ORDER BY n DESC
""")
pt(cur)

SUB("Mapping stations source M3 (LEFT JOIN)")
cur.execute("""
    SELECT
        COUNT(*) FILTER (WHERE sm.id IS NOT NULL)  AS stations_mappees,
        COUNT(*) FILTER (WHERE sm.id IS NULL)       AS stations_non_mappees
    FROM staging.suivi_qualite_brg_garde_hebdo s
    LEFT JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station
""")
pt(cur)

# Etat avant M3
SUB("Etat avant M3 — qualite.mesure_qualite_barrage")
cur.execute("""
    SELECT
        COUNT(*)                           AS total_avant,
        COUNT(DISTINCT parametre_qualite)  AS nb_params,
        COUNT(DISTINCT station_id)         AS nb_stations,
        MIN(temps::date)                   AS date_min,
        MAX(temps::date)                   AS date_max
    FROM qualite.mesure_qualite_barrage
""")
pt(cur)

# Verifier les colonnes exactes de la cible
cur.execute("""
    SELECT column_name FROM information_schema.columns
    WHERE table_schema='qualite' AND table_name='mesure_qualite_barrage'
    ORDER BY ordinal_position
""")
cible_cols = [r["column_name"] for r in cur.fetchall()]
print(f"\n  Colonnes cible : {cible_cols}")
has_ire_station = "ire_station" in cible_cols
has_milieu      = "milieu_prelevement" in cible_cols
has_observation = "observation" in cible_cols
print(f"  ire_station: {has_ire_station} | milieu_prelevement: {has_milieu} | observation: {has_observation}")

# INSERT M3 — construction dynamique selon colonnes disponibles
SUB("Execution INSERT M3 -> qualite.mesure_qualite_barrage")

col_list  = ["temps", "station_id", "parametre_qualite", "valeur",
             "pas_temps", "est_valide", "qa_flag_null_value", "qa_flag_negative",
             "source_system", "created_at"]
val_list  = ["s.date_prelevement::timestamptz", "sm.id", "s.parametre_qualite",
             "s.val_qual_brg_garde_hebdo", "'hebdomadaire'",
             "(s.val_qual_brg_garde_hebdo IS NOT NULL)",
             "(s.val_qual_brg_garde_hebdo IS NULL)",
             "(s.val_qual_brg_garde_hebdo IS NOT NULL AND s.val_qual_brg_garde_hebdo < 0)",
             "'staging_migration_m3_garde_hebdo_v1'", "NOW()"]

if has_ire_station:
    col_list.insert(2, "ire_station")
    val_list.insert(2, "s.ire_station")
if has_milieu:
    col_list.append("milieu_prelevement")
    val_list.append("s.milieu_prelevement")
if has_observation:
    col_list.append("observation")
    val_list.append("s.observation")

insert_sql = f"""
    INSERT INTO qualite.mesure_qualite_barrage
        ({', '.join(col_list)})
    SELECT
        {', '.join(val_list)}
    FROM staging.suivi_qualite_brg_garde_hebdo s
    LEFT JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station
    WHERE NOT EXISTS (
        SELECT 1 FROM qualite.mesure_qualite_barrage q
        WHERE q.temps::date = s.date_prelevement
          AND q.parametre_qualite = s.parametre_qualite
          AND (
              (sm.id IS NOT NULL AND q.station_id = sm.id)
              OR (sm.id IS NULL AND q.station_id IS NULL)
          )
    )
    ON CONFLICT DO NOTHING
"""
print(f"\n  INSERT colonnes : {col_list}")

try:
    cur.execute(insert_sql)
    n_ins = cur.rowcount
    conn.commit()
    print(f"  [OK] M3 : {n_ins} lignes inserees dans qualite.mesure_qualite_barrage")
except Exception as e:
    conn.rollback()
    print(f"  [ERREUR M3] {type(e).__name__}: {e}")
    print("  => Verifier le schema de la table cible qualite.mesure_qualite_barrage")

SUB("Etat apres M3 — qualite.mesure_qualite_barrage")
cur.execute("""
    SELECT
        COUNT(*) AS total_apres,
        COUNT(*) FILTER (WHERE source_system LIKE 'staging_migration_m3%') AS inserees_m3,
        COUNT(*) FILTER (WHERE qa_flag_null_value = true)  AS qa_null,
        COUNT(*) FILTER (WHERE qa_flag_negative = true)    AS qa_negatif,
        COUNT(DISTINCT parametre_qualite)                  AS nb_params,
        COUNT(DISTINCT station_id)                         AS nb_stations,
        MIN(temps::date)                                   AS date_min,
        MAX(temps::date)                                   AS date_max
    FROM qualite.mesure_qualite_barrage
""")
pt(cur)


# =============================================================================
# M1 — AUDIT PRECIPITATIONS (resultat — pas de migration)
# staging.mesures_precip : 669 880 lignes
# meteo.mesure_precipitation : 546 007 lignes
# Ecart mappable : 123 873 lignes | Stations orphelines : 0
# =============================================================================
SEP("M1 — AUDIT ECART PRECIPITATION (recap — aucune migration)")

SUB("Synthese volumes")
cur.execute("""
    SELECT
        (SELECT COUNT(*) FROM staging.mesures_precip)                  AS staging_total,
        (SELECT COUNT(*) FROM meteo.mesure_precipitation)              AS cible_total,
        669880 - 546007                                                AS ecart_brut,
        (SELECT COUNT(*)
         FROM staging.mesures_precip s
         JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station
         WHERE NOT EXISTS (
             SELECT 1 FROM meteo.mesure_precipitation mp
             WHERE mp.station_id = sm.id
               AND mp.temps = s.date_jr::timestamptz
         ))                                                            AS lignes_manquantes_exactes,
        (SELECT COUNT(*)
         FROM staging.mesures_precip s
         WHERE NOT EXISTS (
             SELECT 1 FROM infra.stations_mesure sm
             WHERE sm.code_station = s.ire_station
         ))                                                            AS stations_orphelines
""")
pt(cur)

SUB("Top 20 stations avec le plus de donnees manquantes")
cur.execute("""
    SELECT
        s.ire_station,
        COUNT(*)         AS nb_manquantes,
        MIN(s.date_jr)   AS date_min,
        MAX(s.date_jr)   AS date_max
    FROM staging.mesures_precip s
    JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station
    WHERE NOT EXISTS (
        SELECT 1 FROM meteo.mesure_precipitation mp
        WHERE mp.station_id = sm.id
          AND mp.temps = s.date_jr::timestamptz
    )
    GROUP BY s.ire_station
    ORDER BY nb_manquantes DESC
    LIMIT 20
""")
pt(cur)

SUB("Plage temporelle des donnees manquantes")
cur.execute("""
    SELECT
        MIN(s.date_jr)  AS manquants_date_min,
        MAX(s.date_jr)  AS manquants_date_max,
        (SELECT MIN(temps::date) FROM meteo.mesure_precipitation) AS cible_date_min,
        (SELECT MAX(temps::date) FROM meteo.mesure_precipitation) AS cible_date_max
    FROM staging.mesures_precip s
    JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station
    WHERE NOT EXISTS (
        SELECT 1 FROM meteo.mesure_precipitation mp
        WHERE mp.station_id = sm.id
          AND mp.temps = s.date_jr::timestamptz
    )
""")
pt(cur)

SUB("Qualite des donnees staging manquantes (valeur nulle/negatif/extreme)")
cur.execute("""
    SELECT
        COUNT(*)                                          AS total_manquantes,
        COUNT(*) FILTER (WHERE s.val_precip_jr IS NULL)  AS val_null,
        COUNT(*) FILTER (WHERE s.val_precip_jr < 0)      AS val_negatif,
        COUNT(*) FILTER (WHERE s.val_precip_jr > 300)    AS val_extreme_gt300,
        ROUND(AVG(s.val_precip_jr)::numeric, 3)          AS moy_mm,
        MAX(s.val_precip_jr)                             AS max_mm
    FROM staging.mesures_precip s
    JOIN infra.stations_mesure sm ON sm.code_station = s.ire_station
    WHERE NOT EXISTS (
        SELECT 1 FROM meteo.mesure_precipitation mp
        WHERE mp.station_id = sm.id
          AND mp.temps = s.date_jr::timestamptz
    )
""")
pt(cur)

cur.close()
conn.close()

SEP("BLOC 3 M2+M3+M1 TERMINE — STOP avant M5/M4b")
print("""
  M2 : meteo.mesure_evaporation — deja complete, 0 action
  M3 : qualite.mesure_qualite_barrage — migration garde_hebdo executee ci-dessus
  M1 : audit precipitation — synthese retournee, aucune migration lancee
  => Ne pas lancer M5 sans validation explicite des resultats M1.
  => Ne pas lancer M4b sans confirmation apres votre validation M4.
""")
