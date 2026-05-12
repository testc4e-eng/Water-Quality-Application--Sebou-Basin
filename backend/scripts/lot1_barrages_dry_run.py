import os
import re
import io
import sys
import psycopg2
from psycopg2.extras import RealDictCursor
from decimal import Decimal

# Ensure utf-8 encoding for outputs
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

def normalize_name(s):
    if not s or str(s).strip() == 'None': return "NONE"
    s = str(s).lower().replace('-', ' ').replace('_', ' ')
    return re.sub(r'\s+', ' ', s).strip()

def main():
    # SECURITY RULE : No bare credentials
    db_pass = os.environ.get("WQDSS_DB_PASSWORD")
    if not db_pass:
        print("FATAL: Exportez d'abord le mot de passe dans l'environnement WQDSS_DB_PASSWORD. (Ex: set WQDSS_DB_PASSWORD=...)")
        sys.exit(1)

    print("Connexion READ-ONLY amorçée...")
    conn_src = psycopg2.connect(host="127.0.0.1", dbname="abh_sebou_070426", user="postgres", password=db_pass, cursor_factory=RealDictCursor)
    conn_tgt = psycopg2.connect(host="127.0.0.1", dbname="abh_sad", user="postgres", password=db_pass, cursor_factory=RealDictCursor)
    conn_src.set_session(readonly=True, autocommit=True)
    conn_tgt.set_session(readonly=True, autocommit=True)

    cur_src = conn_src.cursor()
    cur_tgt = conn_tgt.cursor()

    cur_src.execute("SELECT * FROM public.infra_barrages_abhs")
    rows_src = cur_src.fetchall()

    cur_tgt.execute("SELECT * FROM infra.barrages")
    rows_tgt = cur_tgt.fetchall()

    print(f"Chargement terminé. Source : {len(rows_src)} | Cible : {len(rows_tgt)}")

    # Index tgt by normalized name to check duplicates
    tgt_registry = {}
    for rt in rows_tgt:
        nt = normalize_name(rt.get('nom_barrage'))
        if nt not in tgt_registry: tgt_registry[nt] = []
        tgt_registry[nt].append(rt)

    # Simulation results
    would_insert = 0
    would_update = 0
    would_skip = 0
    would_conflict = 0

    logs_conflict = []
    logs_update = []
    
    # Process Source Rows
    src_tracker = {}
    for rs in rows_src:
        name_s = rs.get('nom_barrage')
        norm_name = normalize_name(name_s)
        
        # Track duplicate names in source itself to raise internal conflict
        src_tracker[norm_name] = src_tracker.get(norm_name, 0) + 1
        
        # EXCEPTION 1: None or anonymous dam
        if norm_name == "NONE":
            would_skip += 1
            logs_conflict.append(f"⚠️ SKIP - Barrage sans nom (Null/None) détecté (id={rs.get('id')}).")
            continue

        # EXCEPTION 2: The 'bouhouda' conflict rule (or any nominal duplicate in target)
        if norm_name in tgt_registry and len(tgt_registry[norm_name]) > 1:
            would_conflict += 1
            logs_conflict.append(f"🚨 CONFLICT TARGET (MULTIPLE) - '{norm_name}' est doublonné dans Prod (Cible).")
            continue
            
        if src_tracker[norm_name] > 1:
            would_conflict += 1
            logs_conflict.append(f"🚨 CONFLICT SOURCE (MULTIPLE) - '{norm_name}' est doublonné dans la Source Sandbox.")
            continue

        tgt_match_list = tgt_registry.get(norm_name)
        
        if not tgt_match_list:
            would_insert += 1
        else:
            rt = tgt_match_list[0]
            # Verify if identical to propose SKIP or UPDATE
            is_diff = False
            diff_fields = []
            
            for field in rs.keys():
                if field in ('id',): continue # ID sequence doesn't matter for integrity check
                val_s = rs[field]
                val_t = rt[field]
                
                # Handling geometry diffs explicitly (WKB formats can differ so we could skip it for simple diff)
                if field == 'geom' and str(val_s) != str(val_t):
                    is_diff = True
                    diff_fields.append("geom")
                elif type(val_s) == Decimal and type(val_t) == float:
                    if float(val_s) != val_t: is_diff = True; diff_fields.append(field)
                elif val_s != val_t:
                    is_diff = True
                    diff_fields.append(field)

            if is_diff:
                would_update += 1
                logs_update.append(f"💡 UPDATE PROPOSED - '{name_s}' differs on: {', '.join(diff_fields)}")
            else:
                would_skip += 1

    # MARKDOWN REPORT CREATION
    md_file = "c:/dev/WQDSS/repo_git/docs/14_lot1_barrages_dry_run_resultats.md"
    with open(md_file, "w", encoding="utf-8") as f:
        f.write("# LOT 1 : Résultat du Dry-Run d'Intégration (Barrages)\n\n")
        f.write("*Généré automatiquement par le script.* L'opération a été menée en strict **READ-ONLY**.\n\n")
        
        f.write("## 1. Métriques de Simulation\n")
        f.write(f"- 🟦 `WOULD_INSERT` : {would_insert}\n")
        f.write(f"- 🟨 `WOULD_UPDATE` : {would_update} (Données nouvelles ou correctrices)\n")
        f.write(f"- 🟩 `WOULD_SKIP` : {would_skip} (Cibles parfaitement synchrones ou nulles volontaires)\n")
        f.write(f"- 🟥 `WOULD_CONFLICT` : {would_conflict} (Nécessite résolution métier)\n\n")

        f.write("## 2. Détection Formelle des Exceptions Commandées\n")
        f.write("### Exception `None`\n")
        if any("NONE" in c.upper() or "SANS NOM" in c.upper() for c in logs_conflict):
            f.write("> ✅ La règle métier a intercepté le record 'None'. Il a été placé dans `WOULD_SKIP`.\n\n")
        else:
            f.write("> ℹ️ Aucun barrage n'ayant été identifié sans nom lors de ce run.\n\n")

        f.write("### Exception `Bouhouda` (Doublons nominaux)\n")
        if any("BOUHOUDA" in c.upper() for c in logs_conflict):
            f.write("> ✅ La règle métier a intercepté l'étranglement multi-cardinal sur le barrage de Bouhouda. Il a été rejeté de l'upsert.\n\n")
        else:
            f.write("> ℹ️ Aucun barrage en multi-cardinalité détecté sur ce run.\n\n")
        
        f.write("## 3. Détails des Logs de Transgression\n")
        f.write("### Conflits Irrésolus (Exclus du script d'écriture) :\n")
        if not logs_conflict: f.write("- `Aucun`\n")
        for log in logs_conflict: f.write(f"- {log}\n")
        
        f.write("\n### Enrichissements (`UPDATE`) potentiels détéctés :\n")
        if not logs_update: f.write("- `Aucun`\n")
        for log in logs_update: f.write(f"- {log}\n")
        
        # STATUS RESOLUTION
        f.write("\n## 4. Recommandation Automatisée du Cycle\n")
        if would_insert == 0 and would_update == 0:
            f.write("🚨 **DÉCISION ALGORITHMIQUE : LE LOT EST DÉJÀ SYNCHRONE.**\n")
            f.write("Par le rapport d'A/B précédent stipulant une symétrie presque parfaite, et une simulation confirmant `o` opération bénéfique (excepté des rejets qualitatifs), l'incorporation informatique pour ce Lot 1 doit s'achever ici. Il est inutile de générer un script d'exécutable `Lot 1` avec transaction active : la table de production `infra.barrages` est déjà en pleine possession de l'actif sain de la sandbox.\n")
        else:
            f.write("✅ **DÉCISION ALGORITHMIQUE : DES ACTIONS SONT REQUIISES.**\n Le dry-run a mis en exergue des modifications viables. En attente de validation pour bascule d'environnement.\n")
            
    print(f"\nSimulation achevée. Rapport rendu disponible sur : {md_file}")

if __name__ == "__main__":
    main()
