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

def diff_float(f1, f2, tol=0.0001):
    """Compares two float-like variables (or None). Returns False if effectively identical."""
    if f1 is None and f2 is None: return False
    if f1 is None or f2 is None: return True
    try:
        return abs(float(f1) - float(f2)) > tol
    except (ValueError, TypeError):
        return True

def main():
    db_pass = os.environ.get("WQDSS_DB_PASSWORD")
    if not db_pass:
        print("FATAL: Mettez WQDSS_DB_PASSWORD dans l'environnement d'exécution de l'automate.")
        sys.exit(1)

    print("Connexion READ-ONLY amorçée (Bilan Météorologique)...")
    conn_src = psycopg2.connect(host="127.0.0.1", dbname="abh_sebou_070426", user="postgres", password=db_pass, cursor_factory=RealDictCursor)
    conn_tgt = psycopg2.connect(host="127.0.0.1", dbname="abh_sad", user="postgres", password=db_pass, cursor_factory=RealDictCursor)
    conn_src.set_session(readonly=True, autocommit=True)
    conn_tgt.set_session(readonly=True, autocommit=True)

    cur_src = conn_src.cursor()
    cur_tgt = conn_tgt.cursor()

    cur_tgt.execute("SELECT id, code_station FROM infra.stations_mesure WHERE code_station IS NOT NULL")
    station_lookup = {}
    for r in cur_tgt.fetchall():
        station_lookup[str(r['code_station']).strip().upper()] = r['id']

    # --- FLUX A: PRÉCIPITATION TRAITÉES ---
    print("1/3 Chargement du dataset Pluies Traitées...")
    cur_tgt.execute("SELECT station_id, temps, val_observees, val_power_nasa, val_remplies FROM meteo.mesure_precipitation")
    tgt_pluie = {}
    for r in cur_tgt.fetchall():
        dt_s = format_date(r['temps'])
        tgt_pluie[(r['station_id'], dt_s)] = {
            'val_o': r['val_observees'],
            'val_p': r['val_power_nasa'],
            'val_r': r['val_remplies']
        }

    i_p, u_p, s_p, c_p, empty_p = 0, 0, 0, 0, 0
    cur_src.execute("SELECT ire_station, date_jr, val_observees, val_power_nasa, val_remplies FROM public.mesures_precipitations_jr_traitees")
    for rs in cur_src.fetchall():
        # Check rule ANO-LOT3B-001 null filter
        if rs['val_observees'] is None and rs['val_power_nasa'] is None and rs['val_remplies'] is None:
            empty_p += 1
            continue

        sid = station_lookup.get(str(rs['ire_station']).strip().upper())
        if not sid:
            c_p += 1
            continue
        
        dt_s = format_date(rs['date_jr'])
        tgt = tgt_pluie.get((sid, dt_s))
        
        if tgt is None:
            i_p += 1
        else:
            diff_o = diff_float(tgt['val_o'], rs['val_observees'])
            diff_p = diff_float(tgt['val_p'], rs['val_power_nasa'])
            diff_r = diff_float(tgt['val_r'], rs['val_remplies'])
            
            if diff_o or diff_p or diff_r:
                u_p += 1
            else:
                s_p += 1

    del tgt_pluie

    # --- FLUX B: PRÉCIPITATION MAX ---
    print("2/3 Chargement du dataset Pluies Max Annuelles...")
    cur_tgt.execute("SELECT station_id, annee, p_max, p_annuelle FROM meteo.mesure_precipitation_annuelle_max")
    tgt_max = {}
    for r in cur_tgt.fetchall():
        tgt_max[(r['station_id'], r['annee'])] = {
            'p_max': r['p_max'],
            'p_ann': r['p_annuelle']
        }

    i_m, u_m, s_m, c_m, empty_m = 0, 0, 0, 0, 0
    cur_src.execute("SELECT ire_station, annee, p_max, p_annuelle FROM public.mesures_precipitations_jr_max")
    for rs in cur_src.fetchall():
        if rs['p_max'] is None and rs['p_annuelle'] is None:
            empty_m += 1
            continue
            
        sid = station_lookup.get(str(rs['ire_station']).strip().upper())
        if not sid:
            c_m += 1
            continue
        
        annee = rs['annee']
        tgt = tgt_max.get((sid, annee))
        
        if tgt is None:
            i_m += 1
        else:
            if diff_float(tgt['p_max'], rs['p_max']) or diff_float(tgt['p_ann'], rs['p_annuelle']):
                u_m += 1
            else:
                s_m += 1

    del tgt_max

    # --- FLUX C: EVAPORATION ---
    print("3/3 Chargement du dataset Evaporation...")
    cur_tgt.execute("SELECT station_id, temps, valeur FROM meteo.mesure_evaporation")
    tgt_eva = {}
    for r in cur_tgt.fetchall():
        tgt_eva[(r['station_id'], format_date(r['temps']))] = r['valeur']

    i_e, u_e, s_e, c_e, empty_e = 0, 0, 0, 0, 0
    cur_src.execute("SELECT ire_station, date_mesure, val_evaporation FROM public.mesures_evaporation_jr")
    for rs in cur_src.fetchall():
        if rs['val_evaporation'] is None:
            empty_e += 1
            continue
            
        sid = station_lookup.get(str(rs['ire_station']).strip().upper())
        if not sid:
            c_e += 1
            continue
            
        dt_s = format_date(rs['date_mesure'])
        key = (sid, dt_s)
        
        if key not in tgt_eva:
            i_e += 1
        else:
            tgt_val = tgt_eva[key]
            if diff_float(tgt_val, rs['val_evaporation']):
                u_e += 1
            else:
                s_e += 1

    del tgt_eva

    # OUTPUT REPORT
    md_file = "c:/dev/WQDSS/repo_git/docs/14_lot3b_meteo_dry_run_resultats.md"
    with open(md_file, "w", encoding="utf-8") as f:
        f.write("# LOT 3B : Bilan du Dry-Run - Métrologie Climatique\n\n")
        f.write("> ⚠️ *Simulation Read-Only RAM, appliquant le filtrage stricte des valeurs 100% vides.* \n\n")
        f.write("## 1. Flux A : Pluviométrie Complétée (Obs / Nasa)\n")
        f.write(f"- 🟦 `WOULD_INSERT` : {i_p} chroniques vierges manquantes.\n")
        f.write(f"- 🟨 `WOULD_UPDATE` : {u_p} discordances de source/NASA repérées.\n")
        f.write(f"- 🟩 `WOULD_SKIP`   : {s_p} jours identiques.\n")
        f.write(f"- 🟥 `WOULD_CONFLICT` : {c_p} orphelins (station mapping failli).\n")
        f.write(f"- ⚠️ `IGNORÉS (VIDES)` : {empty_p} jours rejetés (aucun signal).\n\n")
        
        f.write("## 2. Flux B : Crues Anuelles (Maximales)\n")
        f.write(f"- 🟦 `WOULD_INSERT` : {i_m} points.\n")
        f.write(f"- 🟨 `WOULD_UPDATE` : {u_m} points.\n")
        f.write(f"- 🟩 `WOULD_SKIP`   : {s_m} points.\n")
        f.write(f"- 🟥 `WOULD_CONFLICT` : {c_m} points.\n")
        f.write(f"- ⚠️ `IGNORÉS (VIDES)` : {empty_m} années rejetées (aucun signal).\n\n")

        f.write("## 3. Flux C : Évaporation Physiques\n")
        f.write(f"- 🟦 `WOULD_INSERT` : {i_e} points.\n")
        f.write(f"- 🟨 `WOULD_UPDATE` : {u_e} points.\n")
        f.write(f"- 🟩 `WOULD_SKIP`   : {s_e} points.\n")
        f.write(f"- 🟥 `WOULD_CONFLICT` : {c_e} points.\n")
        f.write(f"- ⚠️ `IGNORÉS (VIDES)` : {empty_e} jours rejetés (aucun signal).\n\n")

        total_actions = i_p + u_p + i_m + u_m + i_e + u_e
        total_empty = empty_p + empty_m + empty_e
        if total_actions == 0:
            f.write(f"\n🚥 **DIAGNOSTIC : SYNCHRONE**. Les bases sont chimériquement égales sur ce périmètre météo (Abstraction faite de {total_empty} rejets orphelins filtrés).")
        else:
            f.write(f"\n🚥 **DIAGNOSTIC : MUTATION CLIMATIQUE REQUISE**. Un différentiel lourd requiert une exécution I/O (Total : {total_actions} lignes inégales).")

    print(f"\nDry Run Simulé terminé. Le Diagnostic de collision est sur : {md_file}")

if __name__ == "__main__":
    main()
