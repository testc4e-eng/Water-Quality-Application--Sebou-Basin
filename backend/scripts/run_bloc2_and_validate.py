"""
backend/scripts/run_bloc2_and_validate.py
Execute bloc2_view_wasp_resultats_actifs.sql puis les requetes de validation.
Usage : cd c:/dev/WQDSS/repo_git/backend && python scripts/run_bloc2_and_validate.py
"""
import io
import os
import sys

# Force UTF-8 sur stdout/stderr (Windows PowerShell / cp1252)
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

import psycopg2
from psycopg2.extras import RealDictCursor

# ---------------------------------------------------------------------------
# Connexion
# ---------------------------------------------------------------------------
CONN_PARAMS = dict(
    host="127.0.0.1",
    port=5432,
    dbname="abh_sad",
    user="postgres",
    password="c4e@test@2025",
    connect_timeout=10,
)

SQL_FILE = os.path.join(
    os.path.dirname(__file__), "..", "sql", "bloc2_view_wasp_resultats_actifs.sql"
)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def SECTION(title):
    print(f"\n{'='*70}\n{title}\n{'='*70}")

def SUBSEC(title):
    dashes = "─" * max(0, 66 - len(title))
    print(f"\n── {title} {dashes}")

def run(cur, sql, params=None):
    cur.execute(sql, params)
    if cur.description:
        cols = [d.name for d in cur.description]
        rows = cur.fetchall()
        return cols, rows
    return [], []

def print_table(cols, rows, max_rows=None):
    if not cols:
        print("  (pas de resultat)")
        return
    display = list(rows[:max_rows]) if max_rows else list(rows)
    widths = [
        max(len(str(c)), max((len(str(r[c])) for r in display), default=0))
        for c in cols
    ]
    sep = "+-" + "-+-".join("-" * w for w in widths) + "-+"
    head = "| " + " | ".join(str(c).ljust(w) for c, w in zip(cols, widths)) + " |"
    print(sep)
    print(head)
    print(sep)
    for row in display:
        print("| " + " | ".join(str(row[c]).ljust(w) for c, w in zip(cols, widths)) + " |")
    print(sep)
    print(f"  ({len(display)} ligne(s) affichee(s))")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    # 1. Connexion
    SECTION("CONNEXION POSTGRESQL")
    try:
        conn = psycopg2.connect(**CONN_PARAMS, cursor_factory=RealDictCursor)
        conn.autocommit = False
        print(f"  [OK] Connecte a {CONN_PARAMS['dbname']}@{CONN_PARAMS['host']}:{CONN_PARAMS['port']}")
    except Exception as e:
        print(f"  [ERREUR CONNEXION] {e}")
        sys.exit(1)

    cur = conn.cursor()

    # 2. Execution du DDL
    SECTION("EXECUTION DU SCRIPT DDL -- bloc2_view_wasp_resultats_actifs.sql")
    try:
        with open(SQL_FILE, encoding="utf-8") as f:
            ddl_full = f.read()
        # Extraire uniquement la partie DDL (avant le bloc de validation)
        ddl_part = ddl_full.split("-- REQUETES DE VALIDATION POST-DEPLOIEMENT")[0]
        # Fallback si le separateur exact differe (accents)
        if ddl_part == ddl_full:
            ddl_part = ddl_full.split("-- REQU")[0].split("-- Veri")[0]
        cur.execute(ddl_part)
        conn.commit()
        print("  [OK] Script DDL execute avec succes -- 3 vues creees/remplacees.")
    except Exception as e:
        conn.rollback()
        print(f"  [ERREUR DDL] {e}")
        conn.close()
        sys.exit(1)

    # 3. Validation 1 : Comptages
    SECTION("VALIDATION 1 -- Comptages par vue")
    q_counts = """
        SELECT vue, lignes,
            CASE
                WHEN vue = 'api.v_wasp_resultats_actifs'
                     AND lignes > 885000  THEN '[OK] > 885000'
                WHEN vue = 'api.v_wasp_resultats_mensuel'
                     AND lignes BETWEEN 5000 AND 100000 THEN '[OK] plage attendue'
                WHEN vue = 'api.v_wasp_snapshot_spatial'
                     AND lignes > 0 THEN '[OK]'
                WHEN lignes = 0 THEN '[ERREUR] VUE VIDE'
                ELSE '[ATTENTION] Hors plage attendue'
            END AS statut
        FROM (
            SELECT 'api.v_wasp_resultats_actifs'  AS vue,
                   COUNT(*)                       AS lignes
            FROM   api.v_wasp_resultats_actifs
            UNION ALL
            SELECT 'api.v_wasp_resultats_mensuel', COUNT(*)
            FROM   api.v_wasp_resultats_mensuel
            UNION ALL
            SELECT 'api.v_wasp_snapshot_spatial',  COUNT(*)
            FROM   api.v_wasp_snapshot_spatial
        ) counts
        ORDER BY vue;
    """
    cols, rows = run(cur, q_counts)
    print_table(cols, rows)

    # 4. Validation 2 : Test variable DO
    SECTION("VALIDATION 2 -- Test variable DO (api.v_wasp_resultats_actifs)")
    q_do = """
        SELECT
            source_model,
            scenario_id,
            scenario_code,
            scenario_nom,
            variable_code,
            variable_unite,
            COUNT(*)                                        AS nb_lignes,
            MIN(date_simulation)                            AS date_min,
            MAX(date_simulation)                            AS date_max,
            (MAX(date_simulation) - MIN(date_simulation))   AS amplitude_jours,
            COUNT(DISTINCT segment_id)                      AS nb_segments,
            ROUND(AVG(valeur)::numeric, 4)                  AS valeur_moy,
            ROUND(MIN(valeur)::numeric, 4)                  AS valeur_min,
            ROUND(MAX(valeur)::numeric, 4)                  AS valeur_max,
            COUNT(*) FILTER (WHERE valeur IS NULL)          AS nb_null,
            COUNT(*) FILTER (WHERE valeur < 0)              AS nb_negatifs,
            COUNT(*) FILTER (WHERE valeur > 20)             AS nb_hors_seuil,
            CASE
                WHEN COUNT(*) FILTER (WHERE valeur IS NULL) > 0 THEN '[ERREUR] NULL presents'
                WHEN COUNT(*) FILTER (WHERE valeur < 0)    > 0 THEN '[ATTENTION] Valeurs negatives'
                WHEN COUNT(*) FILTER (WHERE valeur > 20)   > 0 THEN '[ATTENTION] Valeurs > 20 mg/L'
                WHEN MIN(date_simulation) = MAX(date_simulation) THEN '[ATTENTION] Serie ponctuelle'
                ELSE '[OK]'
            END AS statut_qa
        FROM api.v_wasp_resultats_actifs
        WHERE variable_code = 'DO'
        GROUP BY source_model, scenario_id, scenario_code, scenario_nom,
                 variable_code, variable_unite;
    """
    cols, rows = run(cur, q_do)
    if rows:
        print_table(cols, rows)
    else:
        print("  [ATTENTION] Aucune ligne pour variable_code = 'DO'.")
        print("  -> Codes variables disponibles :")
        cols2, rows2 = run(
            cur,
            "SELECT DISTINCT variable_code, variable_nom FROM api.v_wasp_resultats_actifs "
            "ORDER BY variable_code LIMIT 20;",
        )
        print_table(cols2, rows2)

    # 5. Validation 3 : Snapshot spatial DO
    SECTION("VALIDATION 3 -- Snapshot spatial variable DO (api.v_wasp_snapshot_spatial)")
    q_snap = """
        SELECT
            source_model,
            scenario_code,
            scenario_nom,
            modele_version,
            variable_code,
            variable_unite,
            COUNT(DISTINCT segment_id)                              AS nb_segments_couverts,
            MIN(derniere_date)                                      AS derniere_date_min,
            MAX(derniere_date)                                      AS derniere_date_max,
            COUNT(DISTINCT derniere_date)                           AS nb_dates_distinctes,
            ROUND(AVG(valeur_derniere)::numeric, 4)                 AS valeur_moy_snapshot,
            ROUND(MIN(valeur_derniere)::numeric, 4)                 AS valeur_min_snapshot,
            ROUND(MAX(valeur_derniere)::numeric, 4)                 AS valeur_max_snapshot,
            ROUND(AVG(nb_obs_segment_variable)::numeric, 0)         AS nb_obs_moyen_segment,
            COUNT(*) FILTER (WHERE valeur_derniere IS NULL)         AS nb_segments_null,
            CASE
                WHEN COUNT(*) FILTER (WHERE valeur_derniere IS NULL) > 0 THEN '[ERREUR] NULL presents'
                WHEN COUNT(DISTINCT segment_id) = 0 THEN '[ERREUR] Aucun segment'
                ELSE '[OK]'
            END AS statut_qa
        FROM api.v_wasp_snapshot_spatial
        WHERE variable_code = 'DO'
        GROUP BY source_model, scenario_code, scenario_nom, modele_version,
                 variable_code, variable_unite;
    """
    cols, rows = run(cur, q_snap)
    if rows:
        print_table(cols, rows)
    else:
        print("  [ATTENTION] Aucune ligne pour variable_code = 'DO' dans le snapshot.")
        print("  -> Variables disponibles :")
        cols2, rows2 = run(
            cur,
            "SELECT DISTINCT variable_code FROM api.v_wasp_snapshot_spatial "
            "ORDER BY variable_code LIMIT 20;",
        )
        print_table(cols2, rows2)

    # 6. Echantillons 5 lignes par vue
    SECTION("ECHANTILLONS -- 5 lignes par vue")

    SUBSEC("api.v_wasp_resultats_actifs")
    cols, rows = run(
        cur,
        """
        SELECT source_model, scenario_code, segment_id, date_simulation,
               variable_code, variable_unite, ROUND(valeur::numeric,4) AS valeur
        FROM api.v_wasp_resultats_actifs
        ORDER BY date_simulation, segment_id, variable_code
        LIMIT 5;
        """,
    )
    print_table(cols, rows)

    SUBSEC("api.v_wasp_resultats_mensuel")
    cols, rows = run(
        cur,
        """
        SELECT source_model, scenario_code, segment_id, bucket_month,
               variable_code, nb_jours_theoriques_mois,
               ROUND(valeur_moy::numeric,4)  AS valeur_moy,
               nb_obs
        FROM api.v_wasp_resultats_mensuel
        ORDER BY bucket_month, segment_id, variable_code
        LIMIT 5;
        """,
    )
    print_table(cols, rows)

    SUBSEC("api.v_wasp_snapshot_spatial")
    cols, rows = run(
        cur,
        """
        SELECT source_model, scenario_code, segment_id, derniere_date,
               variable_code, variable_unite,
               ROUND(valeur_derniere::numeric,4) AS valeur_derniere,
               nb_obs_segment_variable
        FROM api.v_wasp_snapshot_spatial
        ORDER BY segment_id, variable_code
        LIMIT 5;
        """,
    )
    print_table(cols, rows)

    # 7. Verification endpoints backend
    SECTION("VERIFICATION -- Sources des endpoints corriges (BLOC 1 + BLOC 2)")
    checks = [
        (
            "api.v_hydro_debit_mensuel (hydro router -- actif)",
            "SELECT COUNT(*) AS lignes FROM api.v_hydro_debit_mensuel;",
        ),
        (
            "infra.barrages avec geom (fix B1 -- route /geojson/barrages)",
            "SELECT COUNT(*) AS lignes FROM infra.barrages WHERE geom IS NOT NULL;",
        ),
        (
            "wasp_sebou.wasp_results (fix B2 -- routes /swat/subbasins)",
            "SELECT COUNT(*) AS lignes FROM wasp_sebou.wasp_results;",
        ),
        (
            "wasp_sebou.wasp_variables -- liste complete des codes",
            "SELECT code, name, unit FROM wasp_sebou.wasp_variables ORDER BY code;",
        ),
        (
            "hydro.mesure_debit (fix B3 -- /swat/analysis/compare cote observe)",
            "SELECT COUNT(*) AS lignes FROM hydro.mesure_debit;",
        ),
        (
            "swat_sebou.swat_reach_results (confirmer vide)",
            "SELECT COUNT(*) AS lignes FROM swat_sebou.swat_reach_results;",
        ),
        (
            "BLOC 2 -- api.v_wasp_resultats_actifs creee",
            "SELECT COUNT(*) AS lignes FROM api.v_wasp_resultats_actifs;",
        ),
        (
            "BLOC 2 -- api.v_wasp_resultats_mensuel creee",
            "SELECT COUNT(*) AS lignes FROM api.v_wasp_resultats_mensuel;",
        ),
        (
            "BLOC 2 -- api.v_wasp_snapshot_spatial creee",
            "SELECT COUNT(*) AS lignes FROM api.v_wasp_snapshot_spatial;",
        ),
    ]
    for label, sql in checks:
        SUBSEC(label)
        try:
            cols, rows = run(cur, sql)
            print_table(cols, rows, max_rows=15)
        except Exception as e:
            print(f"  [ERREUR] {e}")

    cur.close()
    conn.close()
    SECTION("TERMINE -- Attente validation BLOC 3")
    print("  [OK] Script complet. Aucune migration BLOC 3 lancee.\n")


if __name__ == "__main__":
    main()
