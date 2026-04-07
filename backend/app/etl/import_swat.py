# backend/app/etl/import_swat.py
import pandas as pd
from sqlalchemy import text
from app.db.session import engine, SessionLocal

# ---------- helpers ----------
def _ensure_scenario(name: str) -> int:
    with SessionLocal() as db:
        row = db.execute(text("""
            INSERT INTO swat_sebou.swat_scenarios (name)
            VALUES (:name)
            ON CONFLICT DO NOTHING
            RETURNING id
        """), {"name": name}).first()
        if row:
            db.commit()
            return row[0]
        # déjà existant -> récupérer l’id
        row = db.execute(text("SELECT id FROM swat_sebou.swat_scenarios WHERE name=:name"), {"name": name}).first()
        return row[0]

# ---------- output.sub ----------
def import_output_sub(path: str, scenario_name: str, timestep: str = "daily"):
    scen_id = _ensure_scenario(scenario_name)
    # adapter skiprows selon ton fichier; beaucoup d'export SWAT ont ~9-12 lignes d'en-tête
    df = pd.read_fwf(path, skiprows=9, names=[
        "sub", "gis", "mon", "area", "precip", "snomelt", "pet",
        "et", "sw", "perc", "surq", "gw_q", "wyld",
        "syld", "orgn", "orgp", "nsurq", "solp", "sedp"
    ])

    # Interprétation de "mon" selon timestep (daily/mois/année)
    # Ici on suppose "daily" -> 'mon' est une date julienne; sinon adapter (à affiner selon ton export réel)
    # Pour démarrer simplement: on suppose que ton fichier contient déjà une colonne 'date' ou on
    # utilise une date fictive; le mieux est d'importer aussi un calendrier depuis le run SWAT.
    # Exemple minimal: on ignore 'mon' et on crée un index croissant (à adapter !)
    df["date"] = pd.date_range("2000-01-01", periods=len(df), freq="D")  # TODO: adapter

    rows = df[[
        "sub", "date", "precip", "surq", "gw_q", "wyld", "sedp", "orgn", "solp"
    ]].copy()
    rows["scenario_id"] = scen_id

    with engine.begin() as conn:
        conn.execute(text("""
            INSERT INTO swat_sebou.swat_subbasin_results
            (scenario_id, subbasin, date, precip, surq, gw_q, wyld, sedp, orgn, solp)
            VALUES (:scenario_id, :sub, :date, :precip, :surq, :gw_q, :wyld, :sedp, :orgn, :solp)
        """), rows.to_dict(orient="records"))

# ---------- output.rch ----------
def import_output_rch(path: str, scenario_name: str):
    scen_id = _ensure_scenario(scenario_name)
    df = pd.read_fwf(path, skiprows=9, names=[
        "rch", "gis", "mon", "area", "flow_in", "flow_out", "evap", "tloss",
        "sed_in", "sed_out", "sedconc", "orgn_in", "orgn_out", "orgp_in", "orgp_out",
        "no3_in", "no3_out", "nh4_in", "nh4_out", "no2_in", "no2_out", "minp_in", "minp_out",
        "chla_in", "chla_out", "cbod_in", "cbod_out", "diox_in", "diox_out"
    ])
    df["date"] = pd.date_range("2000-01-01", periods=len(df), freq="D")  # TODO: adapter

    rows = df[[
        "rch", "date", "flow_in", "flow_out", "sed_in", "sed_out", "no3_out", "orgp_out", "chla_out"
    ]].copy()
    rows.rename(columns={"rch": "reach"}, inplace=True)
    rows["scenario_id"] = scen_id

    with engine.begin() as conn:
        conn.execute(text("""
            INSERT INTO swat_sebou.swat_reach_results
            (scenario_id, reach, date, flow_in, flow_out, sed_in, sed_out, no3_out, orgp_out, chla_out)
            VALUES (:scenario_id, :reach, :date, :flow_in, :flow_out, :sed_in, :sed_out, :no3_out, :orgp_out, :chla_out)
        """), rows.to_dict(orient="records"))

if __name__ == "__main__":
    # Exemple d’usage (mets tes vrais chemins + nom de scénario)
    # import_output_sub("C:/SWAT/MonProjet/output.sub", "Baseline_2010")
    # import_output_rch("C:/SWAT/MonProjet/output.rch", "Baseline_2010")
    pass
