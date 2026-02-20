# backend/app/etl/import_swat_final.py
"""
Importation des résultats SWAT (output.sub & output.rch) vers PostgreSQL.
Compatible avec le schéma swat_sebou.
"""

import pandas as pd
from sqlalchemy import text
from app.db.session import engine, SessionLocal
from datetime import datetime


# ==========================================================
# 1. Création ou récupération du scénario
# ==========================================================
def ensure_scenario(scenario_name: str, timestep="daily") -> int:
    """Crée un scénario dans swat_sebou.swat_scenarios s’il n’existe pas."""
    with SessionLocal() as db:
        row = db.execute(text("""
            SELECT id FROM swat_sebou.swat_scenarios WHERE name = :name
        """), {"name": scenario_name}).first()
        if row:
            return row[0]

        # Sinon on le crée
        db.execute(text("""
            INSERT INTO swat_sebou.swat_scenarios (name, timestep, start_date, end_date)
            VALUES (:name, :timestep, CURRENT_DATE, CURRENT_DATE)
        """), {"name": scenario_name, "timestep": timestep})
        db.commit()

        # Récupération de l’ID
        row = db.execute(text("SELECT id FROM swat_sebou.swat_scenarios WHERE name = :name"),
                         {"name": scenario_name}).first()
        return row[0]


# ==========================================================
# 2. Importer output.sub
# ==========================================================
def import_output_sub(filepath: str, scenario_name: str):
    print(f"Lecture de {filepath} ...")
    scen_id = ensure_scenario(scenario_name, "daily")

    # 🔹 Sauter 10 lignes d’en-tête, la ligne 11 contient les noms de colonnes
    df = pd.read_fwf(
        filepath,
        skiprows=10,
        names=[
            "TAG", "SUB", "MON", "AREA", "PRECIP", "SNOMELT", "PET", "ET",
            "SW", "PERC", "SURQ", "GW_Q", "WYLD", "SYLD",
            "ORGN", "ORGP", "NSURQ", "SOLP", "SEDP"
        ],
        widths=[8, 8, 6] + [10] * 16,
        comment=" "
    )

    # 🔹 Garde uniquement les lignes où SUB est un nombre
    df = df[pd.to_numeric(df["SUB"], errors="coerce").notna()]
    df["SUB"] = df["SUB"].astype(int)

    # 🔹 Ajoute la date fictive et le scénario
    df["date"] = pd.date_range("2000-01-01", periods=len(df), freq="D")
    df["scenario_id"] = scen_id

    print(f"{len(df)} lignes valides lues pour output.sub")

    # 🔹 Insertion SQL dans la table cible
    with engine.begin() as conn:
        conn.execute(text("""
            INSERT INTO swat_sebou.swat_subbasin_results
            (scenario_id, subbasin, date, precip, surq, gw_q, wyld, sedp, orgn, solp)
            VALUES (:scenario_id, :SUB, :date, :PRECIP, :SURQ, :GW_Q, :WYLD, :SEDP, :ORGN, :SOLP)
        """), df.to_dict(orient="records"))

    print("✅ Données output.sub importées avec succès.")




# ==========================================================
# 3. Importer output.rch
# ==========================================================
def import_output_rch(filepath: str, scenario_name: str):
    print(f"Lecture de {filepath} ...")
    scen_id = ensure_scenario(scenario_name, "daily")

    # 🔹 Sauter 10 lignes d’en-tête (comme output.sub)
    # 🔹 Colonnes principales du fichier SWAT 2025 (simplifiées aux plus utiles)
    col_names = [
        "TAG", "RCH", "MON", "AREA", "FLOW_IN", "FLOW_OUT", "EVAP", "TLOSS",
        "SED_IN", "SED_OUT", "SEDCONC",
        "ORGN_IN", "ORGN_OUT", "ORGP_IN", "ORGP_OUT",
        "NO3_IN", "NO3_OUT", "NH4_IN", "NH4_OUT",
        "NO2_IN", "NO2_OUT", "MINP_IN", "MINP_OUT",
        "CHLA_IN", "CHLA_OUT", "CBOD_IN", "CBOD_OUT",
        "DISOX_IN", "DISOX_OUT", "TOT_N", "TOT_P", "NO3CONC", "WTMP"
    ]

    # 🔹 Lecture flexible : largeur approximative (6 premières + colonnes de 10)
    df = pd.read_fwf(
        filepath,
        skiprows=10,
        names=col_names,
        widths=[8, 8, 5, 10] + [10] * (len(col_names) - 4),
        comment=" "
    )

    # 🔹 Ne garder que les lignes où RCH est numérique
    df = df[pd.to_numeric(df["RCH"], errors="coerce").notna()]
    df["RCH"] = df["RCH"].astype(int)

    # 🔹 Ajouter une date fictive pour le moment
    df["date"] = pd.date_range("2000-01-01", periods=len(df), freq="D")
    df["scenario_id"] = scen_id

    print(f"{len(df)} lignes valides lues pour output.rch")

    # 🔹 Insertion SQL simplifiée (choix de quelques colonnes principales)
    with engine.begin() as conn:
        conn.execute(text("""
            INSERT INTO swat_sebou.swat_reach_results
            (scenario_id, reach, date, flow_in, flow_out, sed_in, sed_out, no3_out, orgp_out, chla_out)
            VALUES (:scenario_id, :RCH, :date, :FLOW_IN, :FLOW_OUT, :SED_IN, :SED_OUT, :NO3_OUT, :ORGP_OUT, :CHLA_OUT)
        """), df.to_dict(orient="records"))

    print("✅ Données output.rch importées avec succès.")



# ==========================================================
# 4. Vérification finale de l'importation
# ==========================================================
from sqlalchemy import text

def check_import_summary():
    print("\n🧮 Vérification du contenu importé dans la base...\n")
    with engine.connect() as conn:
        # Nombre de scénarios
        scen = conn.execute(text("SELECT COUNT(*) FROM swat_sebou.swat_scenarios")).scalar()
        print(f"🧩 Scénarios enregistrés : {scen}")

        # Nombre de sous-bassins importés
        sub_count = conn.execute(text("SELECT COUNT(DISTINCT subbasin) FROM swat_sebou.swat_subbasin_results")).scalar()
        sub_rows = conn.execute(text("SELECT COUNT(*) FROM swat_sebou.swat_subbasin_results")).scalar()
        print(f"📘 Sous-bassins : {sub_count} unités, {sub_rows} lignes au total")

        # Nombre de tronçons (reaches)
        reach_count = conn.execute(text("SELECT COUNT(DISTINCT reach) FROM swat_sebou.swat_reach_results")).scalar()
        reach_rows = conn.execute(text("SELECT COUNT(*) FROM swat_sebou.swat_reach_results")).scalar()
        print(f"🌊 Tronçons : {reach_count} unités, {reach_rows} lignes au total")

        # Vérification rapide des valeurs nulles (NO3 par ex.)
        null_no3 = conn.execute(text("SELECT COUNT(*) FROM swat_sebou.swat_reach_results WHERE no3_out IS NULL")).scalar()
        print(f"🔍 Lignes sans valeur de NO3 : {null_no3}")

        print("\n✅ Vérification terminée : les données SWAT sont bien présentes dans la base.\n")

# ==========================================================
# 4. Point d’entrée principal
# ==========================================================
if __name__ == "__main__":
    # 🟢 Mets ici ton dossier SWAT réel :
    BASE_PATH = r"C:\dev\sad_sebou0210\sad_sebou0210\TxtInOut"

    # Nom du scénario (personnalisable)
    scenario_name = "Baseline_2010"

    import_output_sub(f"{BASE_PATH}\\output.sub", scenario_name)
    import_output_rch(f"{BASE_PATH}\\output.rch", scenario_name)

    print("✅ Import SWAT terminé avec succès.")
