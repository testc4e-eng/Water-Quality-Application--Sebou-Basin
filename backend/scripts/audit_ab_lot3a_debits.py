import os
import io
import sys
import psycopg2
from psycopg2.extras import RealDictCursor

# Ensure utf-8 encoding for outputs
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

def main():
    db_pass = os.environ.get("WQDSS_DB_PASSWORD", "c4e@test@2025")
    conn_src = psycopg2.connect(host="127.0.0.1", dbname="abh_sebou_070426", user="postgres", password=db_pass)
    conn_tgt = psycopg2.connect(host="127.0.0.1", dbname="abh_sad", user="postgres", password=db_pass)
    
    cur_src = conn_src.cursor(cursor_factory=RealDictCursor)
    cur_tgt = conn_tgt.cursor(cursor_factory=RealDictCursor)

    # 1. Audit Table Journalière
    # -----------------------------------
    cur_src.execute("SELECT COUNT(*) as c, MIN(date_jr) as d_min, MAX(date_jr) as d_max, COUNT(*) FILTER(WHERE debit_jr IS NULL) as n_nulls, COUNT(*) FILTER(WHERE debit_jr < 0) as n_neg FROM public.mesures_debit_jr")
    r_src_jr = cur_src.fetchone()
    
    # Orphelins journaliers (ire_station pas dans infra_stations_abhs)
    cur_src.execute("""
        SELECT COUNT(DISTINCT d.ire_station) as orphans 
        FROM public.mesures_debit_jr d 
        LEFT JOIN public.infra_stations_abhs s ON d.ire_station = s.ire_station 
        WHERE s.ire_station IS NULL
    """)
    orphans_jr = cur_src.fetchone()['orphans']

    # 2. Audit Table Mensuelle
    # -----------------------------------
    cur_src.execute("SELECT COUNT(*) as c, MIN(annee) as d_min, MAX(annee) as d_max, COUNT(*) FILTER(WHERE debit_m IS NULL) as n_nulls, COUNT(*) FILTER(WHERE debit_m < 0) as n_neg FROM public.mesures_debit_m")
    r_src_m = cur_src.fetchone()
    
    # Orphelins mensuels
    cur_src.execute("""
        SELECT COUNT(DISTINCT d.ire_station) as orphans 
        FROM public.mesures_debit_m d 
        LEFT JOIN public.infra_stations_abhs s ON d.ire_station = s.ire_station 
        WHERE s.ire_station IS NULL
    """)
    orphans_m = cur_src.fetchone()['orphans']

    # TARGET VOLUMES (abh_sad)
    cur_tgt.execute("SELECT COUNT(*) as c, MIN(temps) as d_min, MAX(temps) as d_max FROM hydro.mesure_debit")
    r_tgt_jr = cur_tgt.fetchone()
    
    cur_tgt.execute("SELECT COUNT(*) as c, MIN(bucket_month) as d_min, MAX(bucket_month) as d_max FROM hydro.mesure_debit_mensuel")
    r_tgt_m = cur_tgt.fetchone()

    # Markdown Generation
    md_file = "c:/dev/WQDSS/repo_git/docs/12_lot3a_debits_audit_ab.md"
    anomalies = []
    if orphans_jr > 0 or orphans_m > 0:
        anomalies.append(f"Stations Orphelines : {orphans_jr} (journalier), {orphans_m} (mensuel) codes IRE inconnus des tables référentielles.")
    if r_src_jr['n_nulls'] > 0 or r_src_m['n_nulls'] > 0:
        anomalies.append(f"Valeurs Débit NULL : {r_src_jr['n_nulls']} lignes (jr), {r_src_m['n_nulls']} lignes (mensuelles).")
    if r_src_jr['n_neg'] > 0 or r_src_m['n_neg'] > 0:
        anomalies.append(f"Valeurs Négatives Incohérentes : {r_src_jr['n_neg']} lignes (jr), {r_src_m['n_neg']} lignes (mensuelles).")

    with open(md_file, "w", encoding="utf-8") as f:
        f.write("# LOT 3A : Audit A/B détaillé — Chroniques de Débits (Hydro)\n\n")
        
        f.write("## 1. Résumé Global et Périmètre\n")
        f.write("Ce lot concerne uniquement les données quantitatives des cours d'eau en domaine superficiel hydrologique, segmentées en deux grains temporels.\n\n")
        f.write("### Tables Cibles et Sources visées\n")
        f.write("- **Sandbox (Source) -> Prod (Cible)**\n")
        f.write("  - `abh_sebou_070426.public.mesures_debit_jr` ➔ `abh_sad.hydro.mesure_debit` (Valeurs Infrajournalières ou Journalières)\n")
        f.write("  - `abh_sebou_070426.public.mesures_debit_m` ➔ `abh_sad.hydro.mesure_debit_mensuel` (Valeurs Mensuelles Agrégées)\n\n")
        
        f.write("## 2. Volumétrie et Profil Temporel\n")
        f.write("### A. Grain Journalier (`mesures_debit_jr`)\n")
        f.write(f"- **Volume Sandbox** : {r_src_jr['c']} lignes\n")
        f.write(f"- Plage Temporelle Source : Période s'étendant du {r_src_jr['d_min']} au {r_src_jr['d_max']}\n")
        f.write(f"- *Volume actuel en Cible (`hydro.mesure_debit`)* : {r_tgt_jr['c']} lignes (du {r_tgt_jr['d_min']} au {r_tgt_jr['d_max']})\n\n")
        
        f.write("### B. Grain Mensuel (`mesures_debit_m`)\n")
        f.write(f"- **Volume Sandbox** : {r_src_m['c']} lignes\n")
        f.write(f"- Plage Temporelle Source : Période s'étendant du {r_src_m['d_min']} au {r_src_m['d_max']}\n")
        f.write(f"- *Volume actuel en Cible (`hydro.mesure_debit_mensuel`)* : {r_tgt_m['c']} lignes (du {r_tgt_m['d_min']} au {r_tgt_m['d_max']})\n\n")

        f.write("## 3. Analyse des Failles Métier et Dépendance aux Stations\n")
        f.write("**La dépendance au Référentiel (Lot 2) est absolue :** Les tables brutes stockent la clé `ire_station` sous format String, tandis que la production exige la clé étrangère entière `station_id`.\n\n")
        
        f.write("### Relevé des Anomalies Sources (Brutes)\n")
        if not anomalies:
            f.write("> ✅ Statistiquement, le corpus temporel ne présente aucune ligne `NULL`, aucune station orpheline et aucune valeur négative sur les champs hydriques centraux.\n")
        else:
            for ano in anomalies:
                f.write(f"- 🔴 {ano}\n")

        f.write("\n## 4. Stratégie Proposée de Clef et Alignement (Avant Dry-Run)\n")
        f.write("1. **Clé Primaire Upsert** : La contrainte temporelle est forte. La combinaison **`(Mapping(ire_station -> station_id), date_mesure)`** constituera l'indice UNIQUE d'évitement des doublons.\n")
        f.write("2. **Gestion des Nulls Critiques** : Si un champ `valeur_m3s` est null, la source de l'événement sera rejetée (`WOULD_SKIP`) ou flaggée, la valeur chronologique vide n'ayant aucune valeur hydrologique opérationnelle sur le Sad.\n")
        f.write("3. **Mécanique Idempotente** : Les 521k lignes déjà en `abh_sad` (M2/M3 legacy) exigeront la prudence absolue de ne rajouter que le delta qualifié issu de `abh_sebou_070426`.\n")

    print(f"Rapport d'Audit {md_file} écrit avec succès.")

    # Write anomalies array format string to stdout to let AI parse it and update Registre
    print(f"__ANOMALIES_FOUND_ORPHAN__: {orphans_jr + orphans_m}")
    print(f"__ANOMALIES_FOUND_NULLS__: {r_src_jr['n_nulls'] + r_src_m['n_nulls']}")
    print(f"__ANOMALIES_FOUND_NEGS__: {r_src_jr['n_neg'] + r_src_m['n_neg']}")

if __name__ == "__main__":
    main()
