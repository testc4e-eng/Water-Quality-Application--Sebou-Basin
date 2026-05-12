import os
import io
import sys
import psycopg2
from psycopg2.extras import RealDictCursor

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

def main():
    db_pass = os.environ.get("WQDSS_DB_PASSWORD", "c4e@test@2025")
    conn_src = psycopg2.connect(host="127.0.0.1", dbname="abh_sebou_070426", user="postgres", password=db_pass)
    conn_tgt = psycopg2.connect(host="127.0.0.1", dbname="abh_sad", user="postgres", password=db_pass)
    
    cur_src = conn_src.cursor(cursor_factory=RealDictCursor)
    cur_tgt = conn_tgt.cursor(cursor_factory=RealDictCursor)

    anomalies = []

    # 1. PRECIPITATIONS (TRAITEES)
    cur_src.execute("SELECT COUNT(*) as c, MIN(date_jr) as d_min, MAX(date_jr) as d_max, COUNT(*) FILTER(WHERE val_observees IS NULL AND val_power_nasa IS NULL AND val_remplies IS NULL) as n_nulls, COUNT(*) FILTER(WHERE val_observees < 0 OR val_power_nasa < 0 OR val_remplies < 0) as n_neg FROM public.mesures_precipitations_jr_traitees")
    r_src_precip = cur_src.fetchone()
    
    cur_src.execute("SELECT COUNT(DISTINCT d.ire_station) as orphans FROM public.mesures_precipitations_jr_traitees d LEFT JOIN public.infra_stations_abhs s ON d.ire_station = s.ire_station WHERE s.ire_station IS NULL")
    orph_precip = cur_src.fetchone()['orphans']

    cur_tgt.execute("SELECT COUNT(*) as c, MIN(temps) as d_min, MAX(temps) as d_max FROM meteo.mesure_precipitation")
    r_tgt_precip = cur_tgt.fetchone()

    # 2. PRECIPITATION ANNUELLE MAX
    cur_src.execute("SELECT COUNT(*) as c, MIN(annee) as d_min, MAX(annee) as d_max, COUNT(*) FILTER(WHERE p_max IS NULL) as n_nulls, COUNT(*) FILTER(WHERE p_max < 0) as n_neg FROM public.mesures_precipitations_jr_max")
    r_src_max = cur_src.fetchone()

    cur_tgt.execute("SELECT COUNT(*) as c, MIN(annee) as d_min, MAX(annee) as d_max FROM meteo.mesure_precipitation_annuelle_max")
    r_tgt_max = cur_tgt.fetchone()

    # 3. EVAPORATION
    cur_src.execute("SELECT COUNT(*) as c, MIN(date_mesure) as d_min, MAX(date_mesure) as d_max, COUNT(*) FILTER(WHERE val_evaporation IS NULL) as n_nulls, COUNT(*) FILTER(WHERE val_evaporation < 0) as n_neg FROM public.mesures_evaporation_jr")
    r_src_evap = cur_src.fetchone()
    
    cur_src.execute("SELECT COUNT(DISTINCT d.ire_station) as orphans FROM public.mesures_evaporation_jr d LEFT JOIN public.infra_stations_abhs s ON d.ire_station = s.ire_station WHERE s.ire_station IS NULL")
    orph_evap = cur_src.fetchone()['orphans']

    cur_tgt.execute("SELECT COUNT(*) as c, MIN(temps) as d_min, MAX(temps) as d_max FROM meteo.mesure_evaporation")
    r_tgt_evap = cur_tgt.fetchone()

    orphans_total = orph_precip + orph_evap
    neg_total = r_src_precip['n_neg'] + r_src_evap['n_neg'] + r_src_max['n_neg']
    nulls_total = r_src_precip['n_nulls'] + r_src_evap['n_nulls']
    
    if orphans_total > 0:
        anomalies.append(f"Stations Météo Orphelines : {orphans_total} codes IRE inconnus des tables référentielles d'infrastructures.")
    if neg_total > 0:
        anomalies.append(f"Valeurs Négatives Incohérentes : {r_src_precip['n_neg']} lignes précip (Pluie < 0 mm), {r_src_evap['n_neg']} lignes évapo (Evapo < 0 mm/j).")
    if nulls_total > 0:
        anomalies.append(f"Mesures Critiques NULL/Vides : {r_src_precip['n_nulls']} lignes précip (aucune métrique Nasa, observée ou remplie), {r_src_evap['n_nulls']} evapos NULL.")

    # GENERATE MARKDOWN
    md_file = "c:/dev/WQDSS/repo_git/docs/12_lot3b_meteo_audit_ab.md"
    with open(md_file, "w", encoding="utf-8") as f:
        f.write("# LOT 3B : Audit A/B détaillé — Climatologie (Pluie / Évaporation)\n\n")
        f.write("Ce lot concerne les séries météorologiques (précipitations spatialisées avec complétion NASA) et évaporations mesurées en stations.\n\n")
        
        f.write("## 1. Topologie des Tables et Correspondance\n")
        f.write("- **Précipitations (Séries complétées)** :\n")
        f.write("  `public.mesures_precipitations_jr_traitees` ➔ `meteo.mesure_precipitation`\n")
        f.write("- **Évapotranspiration / Évaporation** :\n")
        f.write("  `public.mesures_evaporation_jr` ➔ `meteo.mesure_evaporation`\n")
        f.write("- **Intensités Pluviométriques Maximales** :\n")
        f.write("  `public.mesures_precipitations_jr_max` ➔ `meteo.mesure_precipitation_annuelle_max`\n\n")

        f.write("## 2. Volumétrie par Faisceau Data\n")
        
        f.write("### A. Pluviométrie (Travaillée NASA & Obs)\n")
        f.write(f"- Volume Sandbox (`_traitees`) : **{r_src_precip['c']}** lignes.\n")
        f.write(f"- Plage : {r_src_precip['d_min']} au {r_src_precip['d_max']}\n")
        f.write(f"- Volume Target Prod (`meteo.mesure_precipitation`) : **{r_tgt_precip['c']}** lignes.\n\n")

        f.write("### B. Précipitations Maximales (Risque Crues)\n")
        f.write(f"- Volume Sandbox : **{r_src_max['c']}** lignes.\n")
        f.write(f"- Plage annuelle : {r_src_max['d_min']} à {r_src_max['d_max']}\n")
        f.write(f"- Volume Target Prod : **{r_tgt_max['c']}** lignes.\n\n")

        f.write("### C. Évaporation\n")
        f.write(f"- Volume Sandbox : **{r_src_evap['c']}** lignes.\n")
        f.write(f"- Plage : {r_src_evap['d_min']} au {r_src_evap['d_max']}\n")
        f.write(f"- Volume Target Prod (`meteo.mesure_evaporation`) : **{r_tgt_evap['c']}** lignes.\n\n")

        f.write("## 3. Analyse Ciblée (Qualité & Infrastructures)\n")
        f.write("**Dépendance Station (Clé `ire_station`)**\n")
        f.write("Comme pour l'hydrologie, les données pointent vers la table des stations par un formalisme `ire_station` -> `station_id` Cible. On note dans cet audit la détection de `" + str(orphans_total) +" orphelins`.\n\n")
        
        f.write("### Relevé des Anomalies (Brutes)\n")
        if not anomalies:
            f.write("> ✅ Statistiquement, le corpus météorologique ne présente aucune aberration fondamentale bloquant la migration.\n")
        else:
            for ano in anomalies:
                f.write(f"- 🔴 {ano}\n")
                
        f.write("\n## 4. Recommandation pour le Mappage Météo\n")
        f.write("1. **Clé de déduplication** : Exclusivement `[station_id, temps]`.\n")
        f.write("2. **Valeurs Nulles et Négatives** : Toute ligne dont la totalité des signaux météorologiques (Obs, Nasa, Null_filled) est vide s'exclura d'elle-même (`WOULD_SKIP`). Les précipitations négatives (si matériel mal taré) feront l'objet de `qa_flag_negative=TRUE` si retenues par les décisions métier de l'ABH.\n")
        f.write("3. **Table Légacy Ignorée** : La table brute `mesures_precipitations_jr` a été volontairement éludée, la prod ayant consolidé son MCD autour de la version _traitees_ (impliquant l'enrichissement par API). Le mapping visera la plus structurée.\n")

    print(f"Rapport de métrologie météo généré ({md_file}).")
    print(f"ANOMALIES_METEO_ORPH: {orphans_total}")
    print(f"ANOMALIES_METEO_NULLS: {nulls_total}")
    print(f"ANOMALIES_METEO_NEGS: {neg_total}")

if __name__ == "__main__":
    main()
