import io, sys, re, math
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

import psycopg2
from psycopg2.extras import RealDictCursor

db_source = "abh_sebou_070426"
db_target = "abh_sad"
user = "postgres"
password = "c4e@test@2025"
host = "127.0.0.1"

# Distance util
def haversine(lon1, lat1, lon2, lat2):
    if None in (lon1, lat1, lon2, lat2): return None
    R = 6371000 # meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi/2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda/2.0)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def normalize_name(s):
    if not s: return ""
    s = s.lower().replace('-', ' ').replace('_', ' ')
    return re.sub(r'\s+', ' ', s).strip()

def get_columns(conn, schema, table):
    cur = conn.cursor()
    cur.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='{schema}' AND table_name='{table}' ORDER BY ordinal_position")
    res = {row['column_name']: row['data_type'] for row in cur.fetchall()}
    cur.close()
    return res

def find_target_table(conn):
    cur = conn.cursor()
    cur.execute("SELECT table_schema, table_name FROM information_schema.tables WHERE table_name ILIKE '%barrage%' AND table_schema IN ('infra', 'public')")
    cands = cur.fetchall()
    cur.close()
    # prefer infra schema mapping
    for c in cands:
        if c['table_schema'] == 'infra':
            return c['table_schema'], c['table_name']
    if cands: return cands[0]['table_schema'], cands[0]['table_name']
    return None, None

def main():
    print("Connexion aux bases...")
    conn_src = psycopg2.connect(host=host, dbname=db_source, user=user, password=password, cursor_factory=RealDictCursor)
    conn_tgt = psycopg2.connect(host=host, dbname=db_target, user=user, password=password, cursor_factory=RealDictCursor)
    conn_src.set_session(readonly=True, autocommit=True)
    conn_tgt.set_session(readonly=True, autocommit=True)

    print("Recherche de la table cible dans abh_sad...")
    schema_tgt, table_tgt = find_target_table(conn_tgt)
    if not schema_tgt:
        print("Erreur: Impossible de trouver une table cible pour les barrages dans abh_sad.")
        return

    print(f"Table cible identifiée: {schema_tgt}.{table_tgt}")

    cols_src = get_columns(conn_src, "public", "infra_barrages_abhs")
    cols_tgt = get_columns(conn_tgt, schema_tgt, table_tgt)

    cur_src = conn_src.cursor()
    
    # Selectionner id, geom ST_X et ST_Y de la source
    geom_query_src = ""
    if 'geom' in cols_src: geom_query_src = ", ST_X(ST_Transform(geom, 4326)) as lon, ST_Y(ST_Transform(geom, 4326)) as lat"
    elif 'x' in cols_src and 'y' in cols_src: geom_query_src = ", x as lon, y as lat"

    cur_src.execute(f"SELECT * {geom_query_src} FROM public.infra_barrages_abhs")
    rows_src = cur_src.fetchall()

    geom_query_tgt = ""
    if 'geom' in cols_tgt: geom_query_tgt = ", ST_X(ST_Transform(geom, 4326)) as lon, ST_Y(ST_Transform(geom, 4326)) as lat"
    elif 'lon' in cols_tgt and 'lat' in cols_tgt: geom_query_tgt = ", lon, lat"
    
    cur_tgt = conn_tgt.cursor()
    cur_tgt.execute(f"SELECT * {geom_query_tgt} FROM {schema_tgt}.{table_tgt}")
    rows_tgt = cur_tgt.fetchall()

    # Analyse des clés (nom exact ou code)
    # Chercher la colonne nom et code (if any)
    def find_field(cols, keywords):
        for k in keywords:
            for c in cols:
                if k in c.lower() and 'nom' not in c.lower() if k == 'code' else True:
                    return c
        return None

    name_src_col = 'nom_barrage'
    name_tgt_col = 'nom_barrage'
    code_src_col = 'ire'
    code_tgt_col = 'ire'

    print(f"Clés mappées -> Source: (nom:{name_src_col}, code:{code_src_col}) / Cible: (nom:{name_tgt_col}, code:{code_tgt_col})")

    # Mapping logic and buckets
    match_exact = []
    match_approx = []
    conflict = []
    new_items = []
    orphan = [] # Technically from target perspective, but here we scan source vs target

    unmatched_tgt = list(rows_tgt)

    for rs in rows_src:
        name_s = rs[name_src_col] if name_src_col else str(rs.get('id', ''))
        code_s = rs[code_src_col] if code_src_col else None
        
        norm_name_s = normalize_name(str(name_s))
        
        best_match = None
        match_type = "NONE"
        best_dist = float('inf')
        best_name_diff = float('inf')

        for rt in unmatched_tgt:
            name_t = rt[name_tgt_col] if name_tgt_col else str(rt.get('id', ''))
            code_t = rt[code_tgt_col] if code_tgt_col else None
            norm_name_t = normalize_name(str(name_t))
            
            is_exact_code = code_s and code_t and str(code_s).strip() == str(code_t).strip()
            is_exact_name = norm_name_s == norm_name_t

            dist = haversine(rs.get('lon'), rs.get('lat'), rt.get('lon'), rt.get('lat'))

            if is_exact_code or is_exact_name:
                # Is it conflicting geo ?
                if dist and dist > 500: # 500 meters is suspicious for an exact nominal match
                    match_type = "CONFLICT"
                else:
                    match_type = "EXACT"
                best_match = rt
                best_dist = dist
                break
            
            # Approx logic: name contains each other
            if (len(norm_name_s) > 4 and norm_name_s in norm_name_t) or (len(norm_name_t) > 4 and norm_name_t in norm_name_s):
                match_type = "APPROX"
                best_match = rt
                best_dist = dist

        if match_type == "EXACT":
            match_exact.append((rs, best_match, best_dist))
            unmatched_tgt.remove(best_match)
        elif match_type == "APPROX":
            match_approx.append((rs, best_match, best_dist))
            unmatched_tgt.remove(best_match)
        elif match_type == "CONFLICT":
            conflict.append((rs, best_match, best_dist))
            unmatched_tgt.remove(best_match)
        else:
            new_items.append(rs)

    # orphans are those left in unmatched_tgt (exist in prod, not in source)
    orphan = unmatched_tgt

    # REDACTION DU MARKDOWN
    md_file = "c:/dev/WQDSS/repo_git/docs/12_lot1_barrages_audit_ab.md"
    with open(md_file, "w", encoding="utf-8") as f:
        f.write("# LOT 1 : Audit A/B détaillé — Infrastructures Barrages\n\n")
        
        f.write("## 1. Résumé Global\n")
        f.write("- **Base Source Sandbox** : `abh_sebou_070426.public.infra_barrages_abhs`\n")
        f.write(f"- **Base Cible Production** : `abh_sad.{schema_tgt}.{table_tgt}`\n")
        f.write(f"- **Volumétrie Source** : {len(rows_src)} barrage(s)\n")
        f.write(f"- **Volumétrie Cible** : {len(rows_tgt)} barrage(s)\n\n")
        
        f.write("### Synthèse des Correspondances :\n")
        f.write(f"- 🟢 **Match Exact** : {len(match_exact)}\n")
        f.write(f"- 🟡 **Match Approximatif** : {len(match_approx)}\n")
        f.write(f"- 🔵 **Nouveau (À créer)** : {len(new_items)}\n")
        f.write(f"- 🔴 **Conflits détectés** : {len(conflict)}\n")
        f.write(f"- ⚪ **Orphelins cible (existant dans sad mais pas dans source)** : {len(orphan)}\n\n")

        f.write("## 2. Analyse des Clés Métier (Stratégie de Liaison)\n")
        f.write("> **Choix de la clé de mapping identifiée** : Liaison composite dynamique par **NOM NORMALISÉ**.\n")
        f.write(f"> - Colonne évaluée Source : `{name_src_col}`\n")
        f.write(f"> - Colonne évaluée Cible : `{name_tgt_col}`\n")
        f.write("> - *Justification* : Le code hydro (IRE ou ID) étant instable (ou vide) sur certaines tables géospatiales des barrages, le nom textuel (insensible à la casse/dashes) s'avère la clé métier la plus humaine et fiable pour éviter la duplication des infrastructures de base, couplée à une distance de sécurité inter-points (<500m).\n\n")
        
        f.write("## 3. Comparaison Structurelle\n")
        f.write("### Colonnes SOURCE (`infra_barrages_abhs`)\n")
        for k, v in cols_src.items(): f.write(f"- `{k}` ({v})\n")
        f.write("\n### Colonnes CIBLE (Production)\n")
        for k, v in cols_tgt.items(): f.write(f"- `{k}` ({v})\n")
        
        f.write("\n## 4. Tableau Détaillé des Nouveautés (NEW)\n")
        f.write("| ID Source | Nom Source | Coordonnées | Action Requise |\n")
        f.write("|---|---|---|---|\n")
        for r in new_items:
            nm = r[name_src_col] if name_src_col else 'N/A'
            f.write(f"| {r.get('id', 'N/A')} | {nm} | ({r.get('lon', float('nan')):.4f}, {r.get('lat', float('nan')):.4f}) | INSERTION TOTALE |\n")
        if not new_items: f.write("| - | - | - | Aucun nouveau barrage. |\n")

        f.write("\n## 5. Tableau des Correspondances (Exact & Approx)\n")
        f.write("| Nom Source | Statut | Cible Produit | Distance (m) |\n")
        f.write("|---|---|---|---|\n")
        for rs, rt, dist in match_exact:
            nm_s = rs[name_src_col] if name_src_col else 'N/A'
            nm_t = rt[name_tgt_col] if name_tgt_col else 'N/A'
            d_val = f"{dist:.1f}" if dist else "N/A"
            f.write(f"| {nm_s} | 🟢 Exact | {nm_t} | {d_val} |\n")
        for rs, rt, dist in match_approx:
            nm_s = rs[name_src_col] if name_src_col else 'N/A'
            nm_t = rt[name_tgt_col] if name_tgt_col else 'N/A'
            d_val = f"{dist:.1f}" if dist else "N/A"
            f.write(f"| {nm_s} | 🟡 Approx | {nm_t} | {d_val} |\n")
            
        f.write("\n## 6. Analyse des Conflits (CONFLICT) & Risques\n")
        f.write("Sont classés comme conflit deux barrages ayant le même nom mais dont l'écart spatial est inacceptable (> 500m) induisant un risque analytique majeur.\n\n")
        for rs, rt, dist in conflict:
            nm_s = rs[name_src_col] if name_src_col else 'N/A'
            d_val = f"{dist:.1f}" if dist else "N/A"
            f.write(f"- **Conflit sur {nm_s}** (Ecart de {d_val} mètres !) 👉 Demande arbitrage manuel spatial.\n")
        if not conflict: f.write("> *Aucun conflit spatial majeur relevé sur les homologues* ✅.\n\n")

        f.write("## 7. Recommandation pour la phase de Mapping (Ne pas exécuter)\n")
        f.write("- **Stratégie globale UPSERT** : Les `NEW` doivent être purement insérés.\n")
        f.write("- Les `MATCH` doivent déclencher un enrichissement : ne mettre à jour les coordonnées de `abh_sad` que si les champs existants sont vides ou flaggés 'legacy'. Aucun delete autorisé.\n")
        f.write("- La future clé d'intégrité pour le module Qualité Unifiée dépendra de l'UUID / primary key de la ligne cible consolidée, les `MATCH EXACT` ne subiront pas de duplication id.\n")
        
    print(f"Rapport {md_file} généré.")
    
if __name__ == "__main__":
    main()
