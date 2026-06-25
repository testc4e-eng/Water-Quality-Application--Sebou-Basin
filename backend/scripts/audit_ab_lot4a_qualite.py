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

    conf_tables = [
        ("mesures_qualite_rivieres", "val_qual_riv", "qualite.mesure_qualite_riviere"),
        ("mesures_qualite_nappes", "val_qual_nap", "qualite.mesure_qualite_nappe"),
        ("mesures_qualite_barrages", "val_qual_barr", "qualite.mesure_qualite_barrage"),
        ("mesures_suivi_qualite_sebou_jr_6stations", "val_qual_sebou_jr", "qualite.mesure_qualite_sebou"),
        ("mesures_suivi_qualite_brg_garde_hebdo", "val_qual_brg_garde_hebdo", "qualite.suivi_qualite_barrage_garde_hebdo")
    ]
    
    output_lines = []
    anomalies = []
    
    all_params = set()
    total_metrics = 0
    total_orphans = 0
    total_nulls = 0
    total_negatives = 0

    for src_t, val_col, tgt_t in conf_tables:
        # VOLUMETRIE
        cur_src.execute(f"SELECT COUNT(*) as c, MIN(date_prelevement) as d_min, MAX(date_prelevement) as d_max, COUNT(*) FILTER(WHERE {val_col} IS NULL) as n_null, COUNT(*) FILTER(WHERE {val_col}<0) as n_neg FROM public.{src_t}")
        r_src = cur_src.fetchone()
        
        cur_tgt.execute(f"SELECT COUNT(*) as c, MIN(temps) as d_min, MAX(temps) as d_max FROM {tgt_t}")
        r_tgt = cur_tgt.fetchone()
        
        # ORPHELINS STATIONS
        cur_src.execute(f"SELECT COUNT(*) as orphans FROM public.{src_t} d LEFT JOIN public.infra_stations_abhs s ON d.ire_station = s.ire_station WHERE s.ire_station IS NULL")
        orph = cur_src.fetchone()['orphans']
        
        # PARAMETRES DISTINCTS
        cur_src.execute(f"SELECT DISTINCT parametre_qualite FROM public.{src_t}")
        params = [p['parametre_qualite'] for p in cur_src.fetchall()]
        for p in params:
            if p: all_params.add(p)
            
        c = r_src['c']
        n = r_src['n_null']
        neg = r_src['n_neg']
        
        total_metrics += c
        total_orphans += orph
        total_nulls += n
        total_negatives += neg

        output_lines.append(f"### Mouvement : `{src_t}` ➔ `{tgt_t}`\n")
        output_lines.append(f"- **Volume Sandbox** : {c} lignes. Plage d'analyse : {r_src['d_min']} au {r_src['d_max']}\n")
        output_lines.append(f"- **Volume Prod existant** : {r_tgt['c']} lignes.\n")
        output_lines.append(f"- **Orphelins Station** : {orph}\n")
        output_lines.append(f"- **Vides (NULLs)** : {n}\n")
        output_lines.append(f"- **Valeurs Négatives** : {neg}\n\n")

    # Generate Markdown
    md_file = "c:/dev/WQDSS/repo_git/docs/12_lot4a_qualite_audit_ab.md"
    with open(md_file, "w", encoding="utf-8") as f:
        f.write("# LOT 4A : Audit du Cœur Métier Qualititatif\n\n")
        f.write("Ce lot concerne le pilotage du bloc 4 (Ingénierie de la Qualité des Eaux), visant à intégrer l'ensemble des réseaux de mesures physiques, chimiques et biologiques (rivières, nappes, barrages).\n\n")
        
        f.write("## 1. Topologie Structurelle\n\n")
        for line in output_lines:
            f.write(line)
            
        f.write("## 2. Radiologie Globale (Paramètres et Unités)\n")
        f.write(f"Total des métriques qualitatives : **{total_metrics}** relevés\n")
        f.write(f"- Nombre unique de codes `parametre_qualite` distincts croisés: **{len(all_params)}**\n")
        f.write("### Liste exhaustive des paramètres textuels découverts (Sandbox):\n")
        f.write(f"```text\n{', '.join(sorted(str(p) for p in all_params))}\n```\n")
        f.write("\n> ⚠️ *Dans l'architecture de données de ce bloc, aucun champ Unité `unite` n'a été repéré nativement dans les tables brutes, signifiant que le sémantisme de l'unité est induit et rattaché au Référentiel Paramètres et non pas à la ligne.* \n\n")
        
        f.write("## 3. Détection des Anomalies (Bloquantes ou Soumises à Décision)\n")
        if total_orphans > 0:
            f.write(f"- 🔴 **[ORPHELINS STATIONS]** : L'audit repère {total_orphans} relèves dont le code station est indéfini dans le réseau spatial géographique. Un triage et abandon (`WOULD_CONFLICT`) sera impératif.\n")
        if total_nulls > 0:
            f.write(f"- 🔴 **[ANOMALIE VALEUR NULL]** : {total_nulls} lignes remontent sans ancrage quantitatif (champ val_qual_... est NULL). Ces lignes morts (`ANO-LOT4-001`) doivent-elles être ignorées à l'Ingestion ? (Oui recommandé)\n")
        if total_negatives > 0:
            f.write(f"- 🔴 **[VALEURS NEGATIVES]** : {total_negatives} paramètres (qui doivent exiger C > 0 mg/L) sont négatifs. Ceci indique une corruption ou des codes de censure (ex: -99) du laboratoire ! (`ANO-LOT4-002`)\n")
        f.write("- 🔴 **[ORPHELINS PARAMETRES]** : Le schéma paramètre de la Prod devant lier `parametre_qualite` (varchar) et un `parametre_ref_id` absolu, une concordance stricte du dictionnaire NASA/SandBox vs WQDSS devra être menée. Les fautes de frappe de laboratoire lèveront des rejets.\n\n")
        
        f.write("## 4. Recommandations de Découpage de Convergence (Sous-Lots)\n")
        f.write("Au vu des paramètres et de l'hétérogénéité des mesures de laboratoire, la masse d'import Lot 4 devrait être phasées comme suit :\n")
        f.write("- **LOT 4A-1** : Consolidation du Dictionnaire Paramètres `qualite.parametre` (Unification sémantique DBO5, O2, NH4, Traces métaliques etc).\n")
        f.write("- **LOT 4A-2** : Eaux Superficielles et Profondes (Rivières + Nappes).\n")
        f.write("- **LOT 4A-3** : Lentiques et Barrages (Y compris Suivis Hebdo de crise).\n")
        f.write("- **LOT 4A-4** : Faisceau IDP et Marche Cadre Qualité (Sources ponctuelles tierces ou polluantes).\n")

    print(f"Rapport d'audit métier rédigé sous {md_file}.")
    print(f"Bilan -> Tot={total_metrics}; Orphans_Sta={total_orphans}; Nulls={total_nulls}; Negs={total_negatives}; DistinctParams={len(all_params)}")

if __name__ == "__main__":
    main()
