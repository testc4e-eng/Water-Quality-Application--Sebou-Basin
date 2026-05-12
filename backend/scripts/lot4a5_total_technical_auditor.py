import os
import psycopg2
import re
from datetime import datetime

# Configuration des connexions (Lecture Seule)
DB_CONFIG_SANDBOX = {
    "dbname": "abh_sebou_070426", "user": "postgres", "password": os.environ.get("WQDSS_DB_PASSWORD"),
    "host": "localhost", "port": "5432"
}
DB_CONFIG_PROD = {
    "dbname": "abh_sad", "user": "postgres", "password": os.environ.get("WQDSS_DB_PASSWORD"),
    "host": "localhost", "port": "5432"
}

# Mapping mis à jour des domaines, tables et colonnes
AUDIT_PLAN = [
    ("infra_barrages_abhs", "nom_barrage", "INFRA_LABEL", "infra.barrages", ["nom_barrage"], "INFRA"),
    ("infra_stations_abhs", "nom_station", "INFRA_LABEL", "infra.stations_mesure", ["ire_station"], "INFRA"),
    ("mesures_debit_jr", "debit_jr", "VALUE_NUM", "N/A", ["date_jr", "ire_station"], "HYDRO"),
    ("mesures_debit_jr", "ire_station", "ORPHAN_STATION", "infra.stations_mesure", ["date_jr"], "HYDRO"),
    ("mesures_debit_m", "debit_m", "VALUE_NUM", "N/A", ["annee", "mois", "ire_station"], "HYDRO"),
    ("mesures_debit_m", "ire_station", "ORPHAN_STATION", "infra.stations_mesure", ["annee", "mois"], "HYDRO"),
    ("mesures_debit_m", "mois", "MONTH_FIELD", "N/A", ["annee", "ire_station"], "HYDRO"),
    ("mesures_precipitations_jr_traitees", "val_observees", "VALUE_NUM", "N/A", ["date_jr", "ire_station"], "METEO"),
    ("mesures_precipitations_jr_traitees", "ire_station", "ORPHAN_STATION", "infra.stations_mesure", ["date_jr"], "METEO"),
    ("mesures_evaporation_jr", "val_evaporation", "VALUE_NUM", "N/A", ["date_mesure", "ire_station"], "METEO"),
    ("mesures_evaporation_jr", "ire_station", "ORPHAN_STATION", "infra.stations_mesure", ["date_mesure"], "METEO"),
    ("mesures_qualite_rivieres", "val_qual_riv", "VALUE_NUM", "N/A", ["date_prelevement", "ire_station", "parametre_qualite"], "QUALITE"),
    ("mesures_qualite_rivieres", "parametre_qualite", "ALIAS_PARAM", "qualite.ref_parametre", ["date_prelevement", "ire_station"], "QUALITE"),
    ("mesures_qualite_rivieres", "ire_station", "ORPHAN_STATION", "infra.stations_mesure", ["date_prelevement", "parametre_qualite"], "QUALITE"),
    ("mesures_qualite_nappes", "val_qual_nap", "VALUE_NUM", "N/A", ["date_prelevement", "ire_station", "parametre_qualite"], "QUALITE"),
    ("mesures_qualite_nappes", "parametre_qualite", "ALIAS_PARAM", "qualite.ref_parametre", ["date_prelevement", "ire_station"], "QUALITE"),
    ("mesures_qualite_nappes", "ire_station", "ORPHAN_STATION", "infra.stations_mesure", ["date_prelevement", "parametre_qualite"], "QUALITE"),
    ("mesures_qualite_barrages", "val_qual_barr", "VALUE_NUM", "N/A", ["date_prelevement", "ire_station", "parametre_qualite"], "QUALITE"),
    ("mesures_qualite_barrages", "parametre_qualite", "ALIAS_PARAM", "qualite.ref_parametre", ["date_prelevement", "ire_station"], "QUALITE"),
    ("mesures_qualite_barrages", "ire_station", "ORPHAN_STATION", "infra.stations_mesure", ["date_prelevement", "parametre_qualite"], "QUALITE"),
    ("mesures_suivi_qualite_brg_garde_hebdo", "val_qual_brg_garde_hebdo", "VALUE_NUM", "N/A", ["date_prelevement", "ire_station", "parametre_qualite"], "QUALITE"),
    ("mesures_suivi_qualite_brg_garde_hebdo", "ire_station", "ORPHAN_STATION", "infra.stations_mesure", ["date_prelevement", "parametre_qualite"], "QUALITE"),
    ("mesures_idp_2024_qualite_globale", "val_qual", "VALUE_NUM", "N/A", ["date_jr_prelevement", "pts_prelevement", "parametre_qualite"], "IDP"),
    ("mesures_idp_2024_qualite_globale", "parametre_qualite", "ALIAS_PARAM", "qualite.ref_parametre", ["date_jr_prelevement", "pts_prelevement"], "IDP"),
    ("mesures_idp_2024_qualite_globale", "ire", "ORPHAN_REJET", "infra.rejet_*", ["pts_prelevement"], "IDP"),
]

def normalize_alias(alias):
    if alias is None: return None
    return str(alias).strip().lower().replace(" ", "").replace("-", "").replace("_", "")

def get_prod_reference_sets():
    refs = {"infra.stations_mesure": set(), "infra.barrages": set(), "infra.rejet_industriel": set(), "infra.rejet_domestique": set(), "infra.rejet_abattoir": set(), "qualite.ref_parametre_norm": set()}
    try:
        conn = psycopg2.connect(**DB_CONFIG_PROD)
        cur = conn.cursor()
        cur.execute("SELECT code_station FROM infra.stations_mesure"); refs["infra.stations_mesure"] = {str(r[0]).strip() for r in cur.fetchall() if r[0]}
        cur.execute("SELECT code_barrage FROM infra.barrages"); refs["infra.barrages"] = {str(r[0]).strip() for r in cur.fetchall() if r[0]}
        for t in ["industriel", "domestique", "abattoir"]:
            cur.execute(f"SELECT code_rejet FROM infra.rejet_{t}"); refs[f"infra.rejet_{t}"] = {str(r[0]).strip() for r in cur.fetchall() if r[0]}
        cur.execute("SELECT code_canonique FROM qualite.ref_parametre")
        for r in cur.fetchall():
            if r[0]: refs["qualite.ref_parametre_norm"].add(normalize_alias(r[0]))
        cur.close(); conn.close()
    except Exception as e: print(f"Error loading prod refs: {e}")
    return refs

def is_numeric(val):
    if val is None: return False
    try: float(str(val).replace(',', '.').replace(' ', '')); return True
    except: return False

def check_format_date(val):
    if val is None: return False
    return bool(re.match(r'^\d{4}-\d{2}-\d{2}', str(val)))

def run_audit():
    refs = get_prod_reference_sets()
    conn_sb = psycopg2.connect(**DB_CONFIG_SANDBOX)
    results = []
    print(f"[{datetime.now()}] Démarrage de l'audit technique final consolidé...")
    for table, col, role, target, context_cols, domain in AUDIT_PLAN:
        print(f"-> {table}.{col}")
        cur = conn_sb.cursor()
        try:
            cur.execute(f'SELECT COUNT(*) FROM public."{table}"')
            total_table_rows = cur.fetchone()[0]
            agg_context = ", ".join([f'MIN("{c}")' for c in context_cols])
            cur.execute(f'SELECT "{col}", COUNT(*), {agg_context} FROM public."{table}" GROUP BY "{col}"')
            rows = cur.fetchall()
            for row_data in rows:
                val = row_data[0]; count = row_data[1]
                ctx_parts = [f"{context_cols[i]}={str(row_data[i+2])}" for i in range(len(context_cols))]
                example_context = " | ".join(ctx_parts)
                perc = (count / total_table_rows) * 100 if total_table_rows > 0 else 0
                anomalies = []
                if val is None: anomalies.append("NULL_VALUE")
                else:
                    s_val = str(val).strip()
                    if s_val == "": anomalies.append("EMPTY_STRING")
                    if s_val.lower() in ['none', 'null', 'nan', 'n/a']: anomalies.append("TEXTUAL_NONE")
                    if role in ["ALIAS_PARAM", "INFRA_LABEL"] and any(u in s_val.lower() for u in ["(mg/l)", "µs", "mgo2", "°c", "%"]): anomalies.append("UNIT_IN_LABEL")
                    if role == "ALIAS_PARAM" and normalize_alias(val) not in refs["qualite.ref_parametre_norm"]: anomalies.append("ALIAS_UNMAPPED")
                    if role == "VALUE_NUM":
                        if not is_numeric(val): anomalies.append("NON_NUMERIC")
                        else:
                            try:
                                v = float(str(val).replace(',', '.').replace(' ', ''))
                                if v < 0: anomalies.append("NEGATIVE_VALUE")
                            except: anomalies.append("NON_NUMERIC")
                    if role == "DATE_ISO" and not check_format_date(val): anomalies.append("FORMAT_ERROR")
                    if role == "MONTH_FIELD" and not s_val.isdigit(): anomalies.append("FORMAT_ERROR")
                    if role == "ORPHAN_STATION":
                        if s_val not in refs["infra.stations_mesure"]:
                            if table == "mesures_suivi_qualite_brg_garde_hebdo": anomalies.append("SPECIAL_CASE_FIXED_MAPPING")
                            else: anomalies.append("ORPHAN_STATION_REFERENCE")
                    if role == "ORPHAN_REJET":
                        exists = any(s_val in refs[t] for t in ["infra.rejet_industriel", "infra.rejet_domestique", "infra.rejet_abattoir"])
                        if not exists: anomalies.append("ORPHAN_INFRA_REJET_REFERENCE")
                for ano in anomalies:
                    results.append({
                        "DOMAIN": domain, "TABLE_SOURCE": table, "COLUMN_SOURCE": col, "TYPE_ANOMALIE": ano,
                        "EXAMPLE_VALUE": str(val) if val is not None else "NULL", "EXAMPLE_CONTEXT": example_context,
                        "REFERENCE_TARGET": target if target else "N/A", "VOLUME_IMPACTED": int(count),
                        "PERCENT_OF_COLUMN": perc
                    })
        except Exception as e: print(f"Error in {table}.{col}: {e}"); conn_sb.rollback()
        cur.close()
    conn_sb.close()
    return results

def to_markdown_table(data, headers):
    if not data: return "No anomalies detected."
    lines = ["| " + " | ".join(headers) + " |", "| " + " | ".join(["---"] * len(headers)) + " |"]
    for row in data: lines.append("| " + " | ".join(str(row.get(h, "")).replace('|', '\\|') for h in headers) + " |")
    return "\n".join(lines)

def generate_report(results):
    summary_map = {}
    for res in results:
        key = (res["TABLE_SOURCE"], res["COLUMN_SOURCE"], res["TYPE_ANOMALIE"], res["REFERENCE_TARGET"], res["EXAMPLE_VALUE"])
        if key not in summary_map: summary_map[key] = res.copy()
        else: summary_map[key]["VOLUME_IMPACTED"] += res["VOLUME_IMPACTED"]; summary_map[key]["PERCENT_OF_COLUMN"] += res["PERCENT_OF_COLUMN"]
    summary = sorted(summary_map.values(), key=lambda x: x["VOLUME_IMPACTED"], reverse=True)
    domain_sum = {}; type_sum = {}; table_sum = {}
    for s in summary:
        domain_sum[s["DOMAIN"]] = domain_sum.get(s["DOMAIN"], 0) + s["VOLUME_IMPACTED"]
        type_sum[s["TYPE_ANOMALIE"]] = type_sum.get(s["TYPE_ANOMALIE"], 0) + s["VOLUME_IMPACTED"]
        table_sum[s["TABLE_SOURCE"]] = table_sum.get(s["TABLE_SOURCE"], 0) + s["VOLUME_IMPACTED"]
    with open("docs/25_annexes_blocages_et_incoherences.md", "w", encoding="utf-8") as f:
        f.write("# 📋 ANNEXE TECHNIQUE EXHAUSTIVE : INHÉRENCES ET BLOCAGES DATA\n\n> **Document N°25 - Version Finale Audit Technique**\n> Mise à jour : " + datetime.now().strftime('%Y-%m-%d %H:%M:%S') + "\n> Mode : READ-ONLY / NORMALISATION ET CONTEXTE ACTIVÉS\n\n")
        f.write("## 🏛️ SYNTHÈSES DE L'AUDIT\n\n### A. Synthèse par Domaine\n" + to_markdown_table([{"DOMAIN": k, "TOTAL_ANOMALIES": v} for k, v in domain_sum.items()], ["DOMAIN", "TOTAL_ANOMALIES"]) + "\n\n")
        f.write("### B. Synthèse par Type d'Anomalie\n" + to_markdown_table([{"TYPE_ANOMALIE": k, "TOTAL_VOLUME": v} for k, v in sorted(type_sum.items(), key=lambda x: x[1], reverse=True)], ["TYPE_ANOMALIE", "TOTAL_VOLUME"]) + "\n\n")
        f.write("### C. Synthèse par Table\n" + to_markdown_table([{"TABLE_SOURCE": k, "TOTAL_VOLUME": v} for k, v in sorted(table_sum.items(), key=lambda x: x[1], reverse=True)], ["TABLE_SOURCE", "TOTAL_VOLUME"]) + "\n\n")
        f.write("## 🚨 TOP 20 DES ANOMALIES CRITIQUES\n" + to_markdown_table([s for s in summary if s["TYPE_ANOMALIE"] in ["ORPHAN_STATION_REFERENCE", "ORPHAN_INFRA_REJET_REFERENCE", "NEGATIVE_VALUE", "FORMAT_ERROR", "NON_NUMERIC", "ALIAS_UNMAPPED", "SPECIAL_CASE_FIXED_MAPPING"]][:20], ["TABLE_SOURCE", "COLUMN_SOURCE", "TYPE_ANOMALIE", "VOLUME_IMPACTED", "EXAMPLE_VALUE", "EXAMPLE_CONTEXT"]) + "\n\n")
        f.write("## 📄 LISTE EXHAUSTIVE DES ANOMALIES TECHNIQUES (BRUTE)\n" + to_markdown_table(summary, ["DOMAIN", "TABLE_SOURCE", "COLUMN_SOURCE", "TYPE_ANOMALIE", "VOLUME_IMPACTED", "PERCENT_OF_COLUMN", "EXAMPLE_VALUE", "EXAMPLE_CONTEXT"]))

if __name__ == "__main__":
    res = run_audit()
    generate_report(res)
    with open("docs/25_limites_audit_techniques.md", "w", encoding="utf-8") as f:
        f.write("# ⚠️ LIMITES TECHNIQUES DE L'AUDIT (DOC 25)\n\n## 1. Pivot IDP\n- Pivot `ire` massivement vide.\n## 2. Normalisation\n- Minimale, ne résout pas les synonymes complexes.\n## 3. Exemple de Contexte\n- Utilise le `MIN()` des colonnes de contexte.\n")
    print("Audit terminé.")
