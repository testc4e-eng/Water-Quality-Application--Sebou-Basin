import os
import io
import sys
import psycopg2
from psycopg2.extras import RealDictCursor

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

def diff_float(f1, f2, tol=0.0001):
    if f1 is None and f2 is None: return False
    if f1 is None or f2 is None: return True
    try:
        return abs(float(f1) - float(f2)) > tol
    except (ValueError, TypeError):
        return True

def format_date(d):
    return str(d).split(' ')[0]

def main():
    db_pass = os.environ.get("WQDSS_DB_PASSWORD")
    if not db_pass:
        print("FATAL: WQDSS_DB_PASSWORD est introuvable. Exécution avortée.")
        sys.exit(1)

    print("Initialisation du Dry-Run Qualité Réservoirs (LOT 4A-3)...")
    
    conn_src = psycopg2.connect(host="127.0.0.1", dbname="abh_sebou_070426", user="postgres", password=db_pass)
    conn_tgt = psycopg2.connect(host="127.0.0.1", dbname="abh_sad", user="postgres", password=db_pass)
    conn_src.set_session(readonly=True, autocommit=True)
    conn_tgt.set_session(readonly=True, autocommit=True)

    cur_src = conn_src.cursor(cursor_factory=RealDictCursor)
    cur_tgt = conn_tgt.cursor(cursor_factory=RealDictCursor)

    # Dictionary ambigus to QA Flag (As per client constraints)
    ambiguous_params = {'H_G', 'sat', 'PTD', 'PTP', 'RS105', 'RS185', 'F_M_mes', 'FM', 'Numerotation_GT', 'IP(mgO2/l)'}

    # Standard Station Lookup mapping
    cur_tgt.execute("SELECT id, code_station FROM infra.stations_mesure WHERE code_station IS NOT NULL")
    station_lookup = {str(r['code_station']).strip().upper(): r['id'] for r in cur_tgt.fetchall()}

    # Imlicit Station Target (Barrage Garde Sebou)
    # We aim to get the true ID from the infrastructure, falling back on an artificial ID 9999 for simulation safety if string differs.
    cur_tgt.execute("SELECT id FROM infra.stations_mesure WHERE code_station ILIKE '%GARDE_SEBOU%' OR code_station ILIKE '%GARDE%' LIMIT 1")
    brg_res = cur_tgt.fetchone()
    GARDESEBOU_ID = brg_res['id'] if brg_res else 99999

    total_results = {}

    # FLUX 1 : BARRAGES
    print("\n--- DRy-Running mesures_qualite_barrages ---")
    cur_tgt.execute("SELECT station_id, temps, parametre_qualite, valeur FROM qualite.mesure_qualite_barrage")
    tgt_bar_data = {}
    for r in cur_tgt.fetchall():
        pn = str(r['parametre_qualite']).strip().lower().replace(" ", "").replace("-", "") if r['parametre_qualite'] else ""
        key = (r['station_id'], format_date(r['temps']), pn)
        tgt_bar_data[key] = r['valeur']

    i, u, s, c = 0, 0, 0, 0
    qa_neg, qa_unmapped, s_null, qa_infered = 0, 0, 0, 0
    
    cur_src.execute("SELECT ire_station, date_prelevement, parametre_qualite, val_qual_barr as val FROM public.mesures_qualite_barrages")
    for rs in cur_src.fetchall():
        if rs['val'] is None:
            s_null += 1
            s += 1
            continue
            
        sid = station_lookup.get(str(rs['ire_station']).strip().upper())
        if not sid:
            c += 1
            if c <= 20:
                print(f"[CONFLICT] Station non trouvée: {rs['ire_station']}")
            continue
            
        try:
            val_f = float(rs['val'])
            if val_f < 0:
                qa_neg += 1
        except:
            pass

        param_raw = str(rs['parametre_qualite']).strip()
        param_norm = param_raw.lower().replace(" ", "").replace("-", "")
        if param_raw in ambiguous_params:
            qa_unmapped += 1

        key = (sid, format_date(rs['date_prelevement']), param_norm if param_raw else "")
        if key not in tgt_bar_data:
            i += 1
        else:
            if diff_float(tgt_bar_data[key], rs['val']):
                u += 1
            else:
                s += 1
                
    total_results["mesures_qualite_barrages"] = {
        "I": i, "U": u, "S": s, "C": c, 
        "QA_NULL": s_null, "QA_NEG": qa_neg, "QA_UNMAPPED": qa_unmapped, "QA_INFERED": 0
    }

    # FLUX 2 : BRG GARDE HEBDO (Implicit Rule Active)
    print("\n--- DRy-Running mesures_suivi_qualite_brg_garde_hebdo ---")
    cur_tgt.execute("SELECT station_id, temps, parametre_qualite, valeur FROM qualite.suivi_qualite_barrage_garde_hebdo")
    tgt_hebdo_data = {}
    for r in cur_tgt.fetchall():
        pn = str(r['parametre_qualite']).strip().lower().replace(" ", "").replace("-", "") if r['parametre_qualite'] else ""
        key = (r['station_id'], format_date(r['temps']), pn)
        tgt_hebdo_data[key] = r['valeur']

    i_h, u_h, s_h, c_h = 0, 0, 0, 0
    qa_neg_h, qa_unmapped_h, s_null_h, qa_infered_h = 0, 0, 0, 0
    
    cur_src.execute("SELECT ire_station, date_prelevement, parametre_qualite, val_qual_brg_garde_hebdo as val FROM public.mesures_suivi_qualite_brg_garde_hebdo")
    for rs in cur_src.fetchall():
        if rs['val'] is None:
            s_null_h += 1
            s_h += 1
            continue
            
        # IMPLICITE STATION INJECTION (Bypassing ire_station check)
        sid = GARDESEBOU_ID
        qa_infered_h += 1
            
        try:
            val_f = float(rs['val'])
            if val_f < 0:
                qa_neg_h += 1
        except:
            pass

        param_raw = str(rs['parametre_qualite']).strip()
        param_norm = param_raw.lower().replace(" ", "").replace("-", "")
        if param_raw in ambiguous_params:
            qa_unmapped_h += 1

        key = (sid, format_date(rs['date_prelevement']), param_norm if param_raw else "")
        
        # Check Upsert using mapped identity
        if key not in tgt_hebdo_data:
            i_h += 1
        else:
            if diff_float(tgt_hebdo_data[key], rs['val']):
                u_h += 1
            else:
                s_h += 1
                
    total_results["mesures_suivi_qualite_brg_garde_hebdo"] = {
        "I": i_h, "U": u_h, "S": s_h, "C": c_h, 
        "QA_NULL": s_null_h, "QA_NEG": qa_neg_h, "QA_UNMAPPED": qa_unmapped_h, "QA_INFERED": qa_infered_h
    }

    # MD Generation
    md_file = "c:/dev/WQDSS/repo_git/docs/14_lot4a3_barrages_dry_run_resultats.md"
    with open(md_file, "w", encoding="utf-8") as f:
        f.write("# LOT 4A-3 : Bilan Dry-Run (Réseau Lentique et Garde)\n\n")
        
        for t_name, metrics in total_results.items():
            f.write(f"## Flux : `{t_name}`\n")
            f.write(f"- 🟦 `WOULD_INSERT`  : {metrics['I']}\n")
            f.write(f"- 🟨 `WOULD_UPDATE`  : {metrics['U']}\n")
            f.write(f"- 🟩 `WOULD_SKIP`    : {metrics['QA_NULL']} (Vides Ignorés) + {metrics['S'] - metrics['QA_NULL']} (Synchrones identifiés)\n")
            f.write(f"- 🟥 `WOULD_CONFLICT`: {metrics['C']} (Orphelins purs rejetés)\n")
            f.write(f"- 🚩 **QA IMPRIMTÉS** :\n")
            f.write(f"     - ⚠️ `qa_flag_negative` = {metrics['QA_NEG']}\n")
            f.write(f"     - ☢️ `qa_flag_param_unmapped` = {metrics['QA_UNMAPPED']}\n")
            if t_name == "mesures_suivi_qualite_brg_garde_hebdo":
                f.write(f"     - 🥇 `qa_flag_station_infered` = {metrics['QA_INFERED']} (Tous les enregistrements valables ont hérité de la géoloc de Garde Sebou M: {GARDESEBOU_ID})\n")
            f.write("\n")

    print(f"\nSimulation terminée. Rapport analytique prêt sous : {md_file}")

if __name__ == "__main__":
    main()
