import os
import io
import sys
import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

def format_date(d):
    if isinstance(d, datetime.date) or isinstance(d, datetime.datetime):
        return d.strftime('%Y-%m-%d')
    return str(d).split(' ')[0]

MOIS_MAP = {
    'janvier': 1, 'février': 2, 'fevrier': 2, 'mars': 3, 'avril': 4,
    'mai': 5, 'juin': 6, 'juillet': 7, 'août': 8, 'aout': 8,
    'septembre': 9, 'octobre': 10, 'novembre': 11, 'décembre': 12, 'decembre': 12
}

def parse_month(m_val):
    if isinstance(m_val, int): 
        return m_val
    s = str(m_val).strip().lower()
    if s.isdigit(): 
        return int(s)
    return MOIS_MAP.get(s, None)

def main():
    db_pass = os.environ.get("WQDSS_DB_PASSWORD")
    if not db_pass:
        print("FATAL: Mettez WQDSS_DB_PASSWORD dans l'environnement.")
        sys.exit(1)

    print("Connexion READ-ONLY amorçée pour Debug Fix Mensuel...")
    conn_src = psycopg2.connect(host="127.0.0.1", dbname="abh_sebou_070426", user="postgres", password=db_pass, cursor_factory=RealDictCursor)
    conn_tgt = psycopg2.connect(host="127.0.0.1", dbname="abh_sad", user="postgres", password=db_pass, cursor_factory=RealDictCursor)
    conn_src.set_session(readonly=True, autocommit=True)
    conn_tgt.set_session(readonly=True, autocommit=True)

    cur_src = conn_src.cursor()
    cur_tgt = conn_tgt.cursor()

    cur_tgt.execute("SELECT id, code_station FROM infra.stations_mesure WHERE code_station IS NOT NULL")
    station_lookup = {}
    for r in cur_tgt.fetchall():
        code = str(r['code_station']).strip().upper()
        station_lookup[code] = r['id']

    print("Chargement flux Mensuel Prod en dictionnaire RAM...")
    cur_tgt.execute("SELECT station_id, bucket_month, valeur_moy_m3s FROM hydro.mesure_debit_mensuel")
    target_m_dict = {}
    for r in cur_tgt.fetchall():
        dt_str = format_date(r['bucket_month'])
        target_m_dict[(r['station_id'], dt_str)] = float(r['valeur_moy_m3s']) if r['valeur_moy_m3s'] is not None else None

    w_ins_m, w_upd_m, w_skip_m, w_conf_m, w_neg_qa_m = 0, 0, 0, 0, 0
    cur_src.execute("SELECT ire_station, mois, annee, debit_m FROM public.mesures_debit_m WHERE debit_m IS NOT NULL AND mois IS NOT NULL AND annee IS NOT NULL")
    
    for rs in cur_src.fetchall():
        code_s = str(rs['ire_station']).strip().upper()
        sid = station_lookup.get(code_s)
        if not sid:
            w_conf_m += 1
            print(f"Station inconnu {code_s}")
            continue
            
        m_int = parse_month(rs['mois'])
        if not m_int:
            w_conf_m += 1
            print(f"Mois invalide {rs['mois']}")
            continue
            
        try:
            dt_s = f"{int(rs['annee'])}-{m_int:02d}-01"
        except (ValueError, TypeError):
            w_conf_m += 1
            continue

        val_s = float(rs['debit_m'])
        is_neg = val_s < 0
        if is_neg: w_neg_qa_m += 1

        tgt_val = target_m_dict.get((sid, dt_s), "NOT_FOUND")
        if tgt_val == "NOT_FOUND":
            w_ins_m += 1
        else:
            if tgt_val is not None and abs(tgt_val - val_s) < 0.0001:
                w_skip_m += 1
            else:
                w_upd_m += 1

    print("\n--- RESULTAT FINAL FIX MENSUEL ---")
    print(f"WOULD_INSERT : {w_ins_m}")
    print(f"WOULD_UPDATE : {w_upd_m}")
    print(f"WOULD_SKIP   : {w_skip_m}")
    print(f"WOULD_CONFLICT: {w_conf_m}")
    print(f"LIGNES QA (<0) : {w_neg_qa_m}")

    md_file = "c:/dev/WQDSS/repo_git/docs/14_lot3a2_debits_mensuels_dry_run_fix_resultats.md"
    with open(md_file, "w", encoding="utf-8") as f:
        f.write("# LOT 3A-2 : Résultat du Dry-Run Fix Mensuel\n\n")
        f.write(f"- 🟦 `WOULD_INSERT` : {w_ins_m}\n")
        f.write(f"- 🟨 `WOULD_UPDATE` : {w_upd_m}\n")
        f.write(f"- 🟩 `WOULD_SKIP` : {w_skip_m}\n")
        f.write(f"- 🟥 `WOULD_CONFLICT` : {w_conf_m}\n")
        f.write(f"- ⚠️  `LIGNES QA (<0)` : {w_neg_qa_m}\n\n")
        
        if w_ins_m == 0 and w_upd_m == 0:
            f.write("🚥 **DIAGNOSTIC : SYNCHRONE.** Pipeline équilibré.")
        else:
            f.write("🚥 **DIAGNOSTIC : MUTATION REQUISE.** Consolidation analytique requise.")

if __name__ == "__main__":
    main()

