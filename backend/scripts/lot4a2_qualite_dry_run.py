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

    print("Initialisation du Dry-Run Qualité Rivières/Nappes (LOT 4A-2)...")
    
    conn_src = psycopg2.connect(host="127.0.0.1", dbname="abh_sebou_070426", user="postgres", password=db_pass)
    conn_tgt = psycopg2.connect(host="127.0.0.1", dbname="abh_sad", user="postgres", password=db_pass)
    conn_src.set_session(readonly=True, autocommit=True)
    conn_tgt.set_session(readonly=True, autocommit=True)

    cur_src = conn_src.cursor(cursor_factory=RealDictCursor)
    cur_tgt = conn_tgt.cursor(cursor_factory=RealDictCursor)

    # Dictionary ambigus to QA Flag (As per client constraints)
    ambiguous_params = {'H_G', 'sat', 'PTD', 'PTP', 'RS105', 'RS185', 'F_M_mes', 'FM', 'Numerotation_GT', 'IP(mgO2/l)'}

    # Station Lookup mapping
    cur_tgt.execute("SELECT id, code_station FROM infra.stations_mesure WHERE code_station IS NOT NULL")
    station_lookup = {str(r['code_station']).strip().upper(): r['id'] for r in cur_tgt.fetchall()}

    tables_config = [
        ("mesures_qualite_rivieres", "val_qual_riv", "qualite.mesure_qualite_riviere"),
        ("mesures_qualite_nappes", "val_qual_nap", "qualite.mesure_qualite_nappe")
    ]

    total_results = {}

    for src_t, val_col, tgt_t in tables_config:
        print(f"\n--- DRy-Running {src_t} ---")
        
        # Load targets to simulate idempotency (station_id, temps, parametre_qualite_sandbox_raw)...
        # For simulation, we assume param_qual is matched as a string because we don't have mapping tables deployed yet.
        # This is a broad audit of Upsert capabilities.
        cur_tgt.execute(f"SELECT station_id, temps, parametre_qualite, valeur FROM {tgt_t}")
        tgt_data = {}
        for r in cur_tgt.fetchall():
            key = (r['station_id'], format_date(r['temps']), str(r['parametre_qualite']).strip().lower() if r['parametre_qualite'] else "")
            tgt_data[key] = r['valeur']

        i, u, s, c = 0, 0, 0, 0
        qa_neg, qa_unmapped, s_null = 0, 0, 0
        
        cur_src.execute(f"SELECT ire_station, date_prelevement, parametre_qualite, {val_col} as val FROM public.{src_t}")
        rows = cur_src.fetchall()
        for rs in rows:
            # RÈGLE 1 : Null
            if rs['val'] is None:
                s_null += 1
                s += 1
                continue
                
            # RÈGLE 2 : Orphelins géographiques
            sid = station_lookup.get(str(rs['ire_station']).strip().upper())
            if not sid:
                c += 1
                continue
                
            # RÈGLE 3 : Négatifs
            try:
                val_f = float(rs['val'])
                if val_f < 0:
                    qa_neg += 1
            except:
                pass

            # RÈGLE 4 : Ambiguïtés (Arbitrage métier en attente)
            param_raw = str(rs['parametre_qualite']).strip()
            if param_raw in ambiguous_params:
                qa_unmapped += 1

            # UPSERT Simulation
            key = (sid, format_date(rs['date_prelevement']), param_raw.lower() if param_raw else "")
            if key not in tgt_data:
                i += 1
            else:
                if diff_float(tgt_data[key], rs['val']):
                    u += 1
                else:
                    s += 1
                    
        total_results[src_t] = {
            "I": i, "U": u, "S": s, "C": c, 
            "QA_NULL": s_null, "QA_NEG": qa_neg, "QA_UNMAPPED": qa_unmapped
        }

    # MD Generation
    md_file = "c:/dev/WQDSS/repo_git/docs/14_lot4a2_qualite_dry_run_resultats.md"
    with open(md_file, "w", encoding="utf-8") as f:
        f.write("# LOT 4A-2 : Bilan Dry-Run (Rivières et Nappes)\n\n")
        f.write("> Simulation purement spatiale et unitaire. Le paramètre H_G reste bloqué et flagué tant que le métier n'a pas arbitré.\n\n")
        
        for t_name, metrics in total_results.items():
            f.write(f"## Flux : `{t_name}`\n")
            f.write(f"- 🟦 `WOULD_INSERT`  : {metrics['I']}\n")
            f.write(f"- 🟨 `WOULD_UPDATE`  : {metrics['U']}\n")
            f.write(f"- 🟩 `WOULD_SKIP`    : {metrics['QA_NULL']} (Rejet via Règle ANO-LOT4A-002: Concentation Vides) + {metrics['S'] - metrics['QA_NULL']} Synchrone existant\n")
            f.write(f"- 🟥 `WOULD_CONFLICT`: {metrics['C']} (Orphelins Station)\n")
            f.write(f"- 🚩 **QA FLAGS LEVÉS À LA VOLÉE** :\n")
            f.write(f"     - ⚠️ `qa_flag_negative` = {metrics['QA_NEG']}\n")
            f.write(f"     - ☢️ `qa_flag_param_unmapped` = {metrics['QA_UNMAPPED']} (Exclu de l'analytique WQDSS provisoirement)\n\n")

    print(f"\nSimulation terminée. Rapport analytique généré : {md_file}")

if __name__ == "__main__":
    main()
