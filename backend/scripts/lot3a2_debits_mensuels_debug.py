import os
import psycopg2
from psycopg2.extras import RealDictCursor
import datetime
import io
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

def format_date(d):
    if isinstance(d, datetime.date) or isinstance(d, datetime.datetime):
        return d.strftime('%Y-%m-%d')
    return str(d).split(' ')[0]

def main():
    db_pass = os.environ.get("WQDSS_DB_PASSWORD")
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

    cur_tgt.execute("SELECT station_id, bucket_month, valeur_moy_m3s FROM hydro.mesure_debit_mensuel")
    target_m_dict = {}
    
    # Store just the first 5 target sets for visual debug formatting
    tgt_sample = []
    
    for idx, r in enumerate(cur_tgt.fetchall()):
        dt_str = format_date(r['bucket_month'])
        sid = r['station_id']
        target_m_dict[(sid, dt_str)] = float(r['valeur_moy_m3s']) if r['valeur_moy_m3s'] is not None else None
        if idx < 5: tgt_sample.append((sid, dt_str, target_m_dict[(sid, dt_str)]))

    cur_src.execute("SELECT ire_station, mois, annee, debit_m FROM public.mesures_debit_m WHERE debit_m IS NOT NULL AND mois IS NOT NULL AND annee IS NOT NULL LIMIT 100")
    
    report_lines = []
    conflict_count = 0
    
    for idx, rs in enumerate(cur_src.fetchall()):
        code_s = str(rs['ire_station']).strip().upper()
        sid = station_lookup.get(code_s)
        
        cause = ""
        dt_s = ""
        
        if not sid:
            cause = "STATION MATCH FAILED: ire_station unknown in infra.stations_mesure"
        else:
            try:
                # Issue is often padding or str cast or None
                dt_s = f"{int(rs['annee'])}-{int(rs['mois']):02d}-01"
                
                tgt_val = target_m_dict.get((sid, dt_s), "NOT_FOUND")
                if tgt_val == "NOT_FOUND":
                    cause = "DATE/ID NOT IN TARGET OR MISMATCH"
                else:
                    if tgt_val is not None and abs(tgt_val - float(rs['debit_m'])) < 0.0001:
                        cause = "[NO CONFLICT: MATCH OK]"
                    else:
                        cause = "VALUE MISMATCH"
                        
            except Exception as e:
                cause = f"DATE FORMAT ERROR: {str(e)}"
        
        if "[NO" not in cause and conflict_count < 25:
            # Add to markdown lines
            report_lines.append(f"| `{code_s}` | `{sid}` | `{rs['annee']}/{rs['mois']}` | `{dt_s}` | `{rs['debit_m']}` | `{cause}` |")
            conflict_count += 1
            
    md_file = "c:/dev/WQDSS/repo_git/docs/12_lot3a2_mensuels_debug.md"
    with open(md_file, "w", encoding="utf-8") as f:
        f.write("# LOT 3A-2 : Rapport de Débogage sur Flux Mensuels\n\n")
        f.write("Ce sous-lot explique pourquoi la totalité métrique mensuelle (19k lignes) s'est effondrée en refus (WOULD_CONFLICT).\n\n")
        f.write("## 1. Topologie de l'Objectif de Matching\n")
        f.write("- **Structure Target** : La table d'agrégation `hydro.mesure_debit_mensuel` requiert `(station_id, bucket_month)` pour lier la valeur moyenne.\n")
        f.write("- **La table Sandbox** `mesures_debit_m` fournit `(ire_station, mois, annee, debit_m)`.\n")
        if tgt_sample:
            f.write("\n###  Aperçu de ce que le dictionnaire cible attendait (Format Python) :\n")
            for t in tgt_sample: f.write(f"- Clé : `({t[0]}, '{t[1]}')` -> Valeur : `{t[2]}`\n")
        
        f.write("\n## 2. Tableau Diagnostique d'Échantillons de Conflit\n")
        f.write("| Code Source (`ire_station`) | ID Cible Obtenu | Dt Brute (`annee`/`mois`) | Clé Formattée tentée | Debit Source | Raison de l'Échec |\n")
        f.write("|---|---|---|---|---|---|\n")
        for line in report_lines:
            f.write(line + "\n")
            
        f.write("\n## 3. Analyse de la Vraie Cause\n")
        f.write("- Si l'ID cible est None : Mismatch critique entre le tableau stations_mesure de production et l'ire_station des débits mensuels. *Bizarre : l'hydrologie infra_journalière passait ce check !!*\n")
        f.write("- Si Format est DATE/ID NOT IN TARGET : La date est formattée différement dans la BDD (ex: la BDD est au 15 du mois `YYYY-MM-15` ou la Prod contient-elle moins de lignes que prévu ou aucune ?) \n")

    print(f"Debug run terminé. MD inscrit dans {md_file}")

if __name__ == "__main__":
    main()
