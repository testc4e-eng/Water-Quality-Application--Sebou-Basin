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
    db_pass = os.environ.get("WQDSS_DB_PASSWORD", "c4e@test@2025")
    conn_src = psycopg2.connect(host="127.0.0.1", dbname="abh_sebou_070426", user="postgres", password=db_pass)
    conn_tgt = psycopg2.connect(host="127.0.0.1", dbname="abh_sad", user="postgres", password=db_pass)
    
    conn_src.set_session(readonly=True, autocommit=True)
    conn_tgt.set_session(readonly=True, autocommit=True)

    cur_tgt = conn_tgt.cursor(cursor_factory=RealDictCursor)
    cur_src = conn_src.cursor(cursor_factory=RealDictCursor)

    cur_tgt.execute("SELECT id, code_station FROM infra.stations_mesure WHERE code_station IS NOT NULL")
    station_lookup = {str(r['code_station']).strip().upper(): r['id'] for r in cur_tgt.fetchall()}

    tables_config = [
        ("mesures_qualite_rivieres", "val_qual_riv", "qualite.mesure_qualite_riviere"),
        ("mesures_qualite_nappes", "val_qual_nap", "qualite.mesure_qualite_nappe")
    ]

    total_updates = []

    for src_t, val_col, tgt_t in tables_config:
        cur_tgt.execute(f"SELECT station_id, temps, parametre_qualite, valeur FROM {tgt_t}")
        tgt_data = {}
        for r in cur_tgt.fetchall():
            key = (r['station_id'], format_date(r['temps']), str(r['parametre_qualite']).strip().lower() if r['parametre_qualite'] else "")
            tgt_data[key] = r['valeur']

        cur_src.execute(f"SELECT ire_station, date_prelevement, parametre_qualite, {val_col} as val FROM public.{src_t}")
        for rs in cur_src.fetchall():
            if rs['val'] is None: continue
            sid = station_lookup.get(str(rs['ire_station']).strip().upper())
            if not sid: continue
            
            param_raw = str(rs['parametre_qualite']).strip()
            key = (sid, format_date(rs['date_prelevement']), param_raw.lower() if param_raw else "")
            
            if key in tgt_data:
                tv = tgt_data[key]
                sv = rs['val']
                if diff_float(tv, sv):
                    try:
                        delta = float(sv) - float(tv)
                    except:
                        delta = "N/A"
                    total_updates.append((src_t, sid, format_date(rs['date_prelevement']), param_raw, sv, tv, delta))

    md_file = "c:/dev/WQDSS/repo_git/docs/14_lot4a2_updates_detail.md"
    with open(md_file, "w", encoding="utf-8") as f:
        f.write("# LOT 4A-2 : Détail des Mutations (WOULD_UPDATE)\n\n")
        f.write("Liste brute des 27 occurrences mathématiques où une donnée du Sandbox diffère subtilement de la donnée existante en Prod.\n\n")
        f.write("| Table | Station_ID (Prod) | Date | Paramètre | Valeur Source | Valeur Prod | Delta (Source - Prod) |\n")
        f.write("|---|---|---|---|---|---|---|\n")
        for u in total_updates:
            f.write(f"| `{u[0]}` | {u[1]} | {u[2]} | `{u[3]}` | {u[4]} | {u[5]} | **{u[6]}** |\n")

if __name__ == "__main__":
    main()
