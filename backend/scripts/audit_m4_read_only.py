"""
Audit M4 Strict READ-ONLY : staging débit source
Objectifs : Existence, Qualité, Structure, et Comparaison métier.
"""
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")
import psycopg2
from psycopg2.extras import RealDictCursor

conn = psycopg2.connect(host="127.0.0.1", port=5432, dbname="abh_sad",
    user="postgres", password="c4e@test@2025", cursor_factory=RealDictCursor)
conn.autocommit = True
cur = conn.cursor()

def pt(label, sql, params=None):
    print(f"\n=== {label} ===")
    cur.execute(sql, params)
    if not cur.description: print("(no result)"); return
    cols = [d.name for d in cur.description]
    rows = list(cur.fetchall())
    if not rows: print("(vide)"); return
    ws = [max(len(str(c)), max(len(str(r[c])) for r in rows)) for c in cols]
    sep = "+-" + "-+-".join("-"*w for w in ws) + "-+"
    print(sep)
    print("| " + " | ".join(str(c).ljust(w) for c,w in zip(cols,ws)) + " |")
    print(sep)
    for r in rows:
        print("| " + " | ".join(str(r[c]).ljust(w) for c,w in zip(cols,ws)) + " |")
    print(sep)
    print(f"  ({len(rows)} lignes)")
    return rows

# 1. Existence - Trouver les tables candidates
print("\n=== RECHERCHE TABLES CANDIDATES DANS STAGING ===")
cur.execute("""
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'staging' 
      AND (table_name ILIKE '%debit%' OR table_name ILIKE '%source%')
    ORDER BY table_name
""")
tables = [r["table_name"] for r in cur.fetchall()]
print(f"Tables trouvées : {tables}")

# Si la table mesures_debit_sources existe, on poursuit l'audit
target_table = "mesures_debit_sources" if "mesures_debit_sources" in tables else None

if not target_table:
    # Look for exact name if slightly different
    for t in tables:
        if "debit" in t and "source" in t:
            target_table = t
            break

if not target_table:
    print(f"\n[FATAL] Impossible de trouver la table débit source parmi : {tables}")
    sys.exit(0)

print(f"\n=== ANALYSE DE LA TABLE : staging.{target_table} ===")

# 3. Structure de la table
pt("STRUCTURE: Colonnes disponibles",
   f"""
   SELECT column_name, data_type, is_nullable
   FROM information_schema.columns
   WHERE table_schema='staging' AND table_name='{target_table}'
   ORDER BY ordinal_position
   """)

# Determiner quelles colonnes utiliser
cur.execute(f"SELECT column_name FROM information_schema.columns WHERE table_schema='staging' AND table_name='{target_table}'")
cols_raw = [r["column_name"].lower() for r in cur.fetchall()]

val_col = None
for c in ["val_debit", "debit", "valeur", "debit_m3s", "val_debit_source"]:
    if c in cols_raw:
        val_col = c
        break

date_col = None
for c in ["date_mesure", "date", "temps", "datetime", "date_jr", "moment"]:
    if c in cols_raw:
        date_col = c
        break

station_col = None
for c in ["ire_station", "station", "code_station", "code", "ire_source"]:
    if c in cols_raw:
        station_col = c
        break

print(f"Colonnes identifiées -> Station : {station_col}, Date : {date_col}, Valeur : {val_col}")

# Echantillon
pt(f"ECHANTILLON (10 lignes limitées)", f"SELECT * FROM staging.{target_table} LIMIT 10")


if val_col and date_col and station_col:
    # 2. Qualité de la donnée
    pt("QUALITE : Existence et volume de NULL",
       f"""
       SELECT 
           COUNT(*) AS total_lignes,
           COUNT(*) FILTER (WHERE {val_col} IS NULL) AS valeurs_nulles,
           ROUND(100.0 * COUNT(*) FILTER (WHERE {val_col} IS NULL) / NULLIF(COUNT(*), 0), 2) AS pourcent_null,
           COUNT(DISTINCT {station_col}) AS nb_stations_distinctes,
           COUNT(*) FILTER (WHERE {val_col} <= 0) AS potentiels_aberrants_negatifs
       FROM staging.{target_table}
       """)

    # Qualité temporelle
    pt("QUALITE : Cohérence des dates",
       f"""
       SELECT 
           MIN({date_col}) AS date_la_plus_ancienne,
           MAX({date_col}) AS date_la_plus_recente,
           COUNT(*) FILTER (WHERE {date_col} IS NULL) AS dates_nulles,
           COUNT(*) FILTER (WHERE {date_col} > CURRENT_DATE) AS dates_futures_aberrantes
       FROM staging.{target_table}
       """)

    # Doublons absolus et métier
    pt("QUALITE : Doublons métier (même station, même date)",
       f"""
       WITH cte AS (
           SELECT {station_col}, {date_col}, COUNT(*) as freq
           FROM staging.{target_table}
           GROUP BY {station_col}, {date_col}
           HAVING COUNT(*) > 1
       )
       SELECT COUNT(*) AS nb_conflits_doublons_total
       FROM cte
       """)
       
    # 4. Comparaison
    pt("COMPARAISON 1 : Stations de la source existant dans infra",
       f"""
       SELECT 
           COUNT(DISTINCT s.{station_col}) AS stations_dans_source,
           COUNT(DISTINCT sm.code_station) AS stations_mappees_dans_infra,
           COUNT(DISTINCT s.{station_col}) FILTER (WHERE sm.code_station IS NULL) AS stations_orphelines_inconnues
       FROM staging.{target_table} s
       LEFT JOIN infra.stations_mesure sm ON s.{station_col} = sm.code_station
       """)
       
    pt("COMPARAISON 2 : Volumes face à l'existant (hydro.mesure_debit)",
       f"""
       SELECT
           (SELECT COUNT(*) FROM staging.{target_table} WHERE {val_col} IS NOT NULL) AS volume_utile_source_staging,
           (SELECT COUNT(*) FROM hydro.mesure_debit) AS volume_existant_hydro_brut,
           (SELECT COUNT(*) 
            FROM staging.{target_table} s
            JOIN infra.stations_mesure sm ON s.{station_col} = sm.code_station
            WHERE EXISTS (
               SELECT 1 FROM hydro.mesure_debit hd
               WHERE hd.station_id = sm.id 
                 AND hd.temps::date = s.{date_col}::date
            )
            AND s.{val_col} IS NOT NULL
           ) AS overlap_deja_intergre_meme_date_station
       """)

    # Synthèse de comparaison des données agrégées hydro par rapport aux dates staging
    pt("COMPARAISON 3 : Ecart mensuel par rapport à api.v_hydro_debit_mensuel (Aperçu de la couverte)",
       f"""
       WITH source_months AS (
           SELECT 
               DATE_TRUNC('month', {date_col}::date) AS mois_source,
               COUNT(*) AS nb_relevant
           FROM staging.{target_table} s
           JOIN infra.stations_mesure sm ON sm.code_station = s.{station_col}
           WHERE {val_col} IS NOT NULL
           GROUP BY DATE_TRUNC('month', {date_col}::date)
       ),
       api_months AS (
           SELECT 
               TO_DATE(annee::text || '-' || mois::text || '-01', 'YYYY-MM-DD') AS mois_api,
               SUM(nb_mesures_valides) AS nb_mesures
           FROM api.v_hydro_debit_mensuel
           GROUP BY annee, mois
       )
       SELECT 
           s.mois_source, 
           s.nb_relevant AS mesures_staging,
           a.nb_mesures AS mesures_deja_en_api
       FROM source_months s
       LEFT JOIN api_months a ON s.mois_source = a.mois_api
       ORDER BY s.nb_relevant DESC
       LIMIT 10
       """)

cur.close()
conn.close()
