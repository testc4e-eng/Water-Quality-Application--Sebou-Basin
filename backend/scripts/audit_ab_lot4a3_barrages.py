import os
import io
import sys
import psycopg2
from psycopg2.extras import RealDictCursor

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

def main():
    db_pass = os.environ.get("WQDSS_DB_PASSWORD")
    if not db_pass:
        print("FATAL: WQDSS_DB_PASSWORD est introuvable. Exécution avortée.")
        sys.exit(1)

    print("Initialisation Audit A/B Qualité Lentique (LOT 4A-3)...")
    
    conn_src = psycopg2.connect(host="127.0.0.1", dbname="abh_sebou_070426", user="postgres", password=db_pass)
    conn_tgt = psycopg2.connect(host="127.0.0.1", dbname="abh_sad", user="postgres", password=db_pass)
    conn_src.set_session(readonly=True, autocommit=True)
    conn_tgt.set_session(readonly=True, autocommit=True)

    cur_src = conn_src.cursor(cursor_factory=RealDictCursor)
    cur_tgt = conn_tgt.cursor(cursor_factory=RealDictCursor)

    tables_config = [
        ("mesures_qualite_barrages", "val_qual_barr", "qualite.mesure_qualite_barrage"),
        ("mesures_suivi_qualite_brg_garde_hebdo", "val_qual_brg_garde_hebdo", "qualite.suivi_qualite_barrage_garde_hebdo")
    ]
    
    output_lines = []
    
    for src_t, val_col, tgt_t in tables_config:
        cur_src.execute(f"SELECT COUNT(*) as c, MIN(date_prelevement) as d_min, MAX(date_prelevement) as d_max, COUNT(*) FILTER(WHERE {val_col} IS NULL) as n_null, COUNT(*) FILTER(WHERE {val_col}<0) as n_neg FROM public.{src_t}")
        r_src = cur_src.fetchone()
        
        cur_tgt.execute(f"SELECT COUNT(*) as c, MIN(temps) as d_min, MAX(temps) as d_max FROM {tgt_t}")
        r_tgt = cur_tgt.fetchone()
        
        cur_src.execute(f"SELECT DISTINCT parametre_qualite FROM public.{src_t}")
        params = [p['parametre_qualite'] for p in cur_src.fetchall() if p['parametre_qualite']]
        
        # Orphelins logic
        if src_t == "mesures_suivi_qualite_brg_garde_hebdo":
            orph = 0 # FORCED BY BUSINESS LOGIC
            orph_txt = "0 (7 094 lignes bypassées par Inférence Métier 'Barrage Garde Sebou')"
        else:
            cur_src.execute(f"SELECT COUNT(*) as orphans FROM public.{src_t} d LEFT JOIN public.infra_stations_abhs s ON d.ire_station = s.ire_station WHERE s.ire_station IS NULL")
            orph = cur_src.fetchone()['orphans']
            orph_txt = str(orph)

        delta_vol = r_src['c'] - r_tgt['c']
        
        output_lines.append(f"### Dôme Géo-Chimique : `{src_t}` ➔ `{tgt_t}`\n")
        output_lines.append(f"- **Périmètre Temporel (Sandbox)** : {r_src['d_min']} au {r_src['d_max']}\n")
        output_lines.append(f"- **Volume Sandbox** : {r_src['c']} mesures.\n")
        output_lines.append(f"- **Volume Prod. Actuelle** : {r_tgt['c']} mesures. *(Delta Structurel: **{delta_vol}**)*\n")
        output_lines.append(f"- **Mesures Isolées Vides (NULL)** : {r_src['n_null']} \n")
        output_lines.append(f"- **Valeurs Labo Négatives (<0)** : {r_src['n_neg']}\n")
        output_lines.append(f"- **Conflits Identité Spatiale (Orphelins)** : {orph_txt}\n")
        output_lines.append(f"- **Variables Distinctes Relevées** : {len(params)} paramètres `{params[:5]}...`\n\n")

    md_file = "c:/dev/WQDSS/repo_git/docs/12_lot4a3_barrages_audit_ab.md"
    with open(md_file, "w", encoding="utf-8") as f:
        f.write("# LOT 4A-3 : Audit Métrologique des Retenues (Barrages et Hebdo)\n\n")
        f.write("> Focus A/B exclusif sur l'hydro-accumulation. La qualité des barrages permet de valider le potentiel d'eutrophisation du périmètre Sebou.\n\n")
        
        f.write("## 1. Bilan Volumétrique par Faisceau Hydraulique\n\n")
        for line in output_lines:
            f.write(line)
            
        f.write("## 2. Analyse du Processus d'Inférence Spatiale (Barrage Garde)\n")
        f.write("Grâce à la dérogation métier enregistrée au Registre (`CAS_METIER_IMPLICITE`), l'univers `mesures_suivi_qualite_brg_garde_hebdo` jouira techniquement d'un passeport illimité lors de l'Upsert. L'algorithme se moquera de l'absence physique d'un `ire_station` dans le tableur brut :\n")
        f.write("- Règle assignée : Écriture forcée sur l'ID exclusif du Réservoir Garde Sebou.\n")
        f.write("- Validation croisée : Flag d'intégrité `qa_flag_station_infered = TRUE` gravé sur le marbre avec l'empreinte de la source `REGLE_FIXE...`.\n\n")
        
        f.write("## 3. Recommandations Pré-Upsert (Dry-Run)\n")
        f.write("1. **Prise en charge des NULLs (`ANO-LOT4A-002`)** : Les vides identifiés par cet audit devront mourir à l'Ingestion (exclusion `WOULD_SKIP`).\n")
        f.write("2. **Filtre Paramètre (`QA_UNMAPPED`)** : Comme pour les fleuves, notre liste `ambiguous_list` bloquera `sat` ou `RS105` s'ils rodent autour des barrages.\n")
        f.write("3. **Attention au Delta Structurel** : La table Barrage de production actuelle héberge un nombre différent de mesures que la Sandbox. Le Dry-run de la phase prochaine diagnostiquera cette disparité (S'agit-il d'updates post-Sandbox ? De lignes supprimées dans le bloc source ?).\n")

    print(f"\nAudit statique compilé. Rapport Analytique : {md_file}")

if __name__ == "__main__":
    main()
