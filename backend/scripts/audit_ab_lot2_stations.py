import io, sys, re, math
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

import psycopg2
from psycopg2.extras import RealDictCursor
import os

db_source = "abh_sebou_070426"
db_target = "abh_sad"

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
    if not s or str(s).strip() == 'None': return "NONE"
    s = str(s).lower().replace('-', ' ').replace('_', ' ')
    return re.sub(r'\s+', ' ', s).strip()

def main():
    pass_db = os.environ.get("WQDSS_DB_PASSWORD", "c4e@test@2025")
    conn_src = psycopg2.connect(host="127.0.0.1", dbname=db_source, user="postgres", password=pass_db, cursor_factory=RealDictCursor)
    conn_tgt = psycopg2.connect(host="127.0.0.1", dbname=db_target, user="postgres", password=pass_db, cursor_factory=RealDictCursor)
    conn_src.set_session(readonly=True, autocommit=True)
    conn_tgt.set_session(readonly=True, autocommit=True)

    cur_src = conn_src.cursor()
    # Source : infra_stations_abhs
    cur_src.execute("SELECT *, ST_X(ST_Transform(geom, 4326)) as lon, ST_Y(ST_Transform(geom, 4326)) as lat FROM public.infra_stations_abhs")
    rows_src = cur_src.fetchall()

    cur_tgt = conn_tgt.cursor()
    # Target : infra.stations_mesure
    cur_tgt.execute("SELECT *, ST_X(ST_Transform(geom, 4326)) as lon, ST_Y(ST_Transform(geom, 4326)) as lat FROM infra.stations_mesure")
    rows_tgt = cur_tgt.fetchall()

    match_exact = []
    match_approx = []
    new_items = []
    conflict = []
    orphan = []

    unmatched_tgt = list(rows_tgt)
    
    anomalies = []

    for rs in rows_src:
        name_s = rs.get('nom_station')
        code_s = rs.get('ire_station')
        if not code_s: code_s = rs.get('ire_precipitation')
        
        norm_name_s = normalize_name(name_s)
        
        if norm_name_s == "NONE":
            anomalies.append({ 'type': 'NOM_NULL', 'id': rs.get('id_station')})

        best_match = None
        match_type = "NONE"
        best_dist = float('inf')

        for rt in unmatched_tgt:
            name_t = rt.get('nom')
            code_t = rt.get('code_station')
            norm_name_t = normalize_name(name_t)
            
            is_exact_code = code_s and code_t and str(code_s).strip().upper() == str(code_t).strip().upper()
            is_exact_name = norm_name_s != "NONE" and norm_name_s == norm_name_t
            
            dist = haversine(rs.get('lon'), rs.get('lat'), rt.get('lon'), rt.get('lat'))

            if is_exact_code or is_exact_name:
                if dist and dist > 1000: # Plus d'1 km de difference avec meme code ou nom
                    match_type = "CONFLICT"
                else:
                    match_type = "EXACT"
                best_match = rt
                best_dist = dist
                break
            
            # Approx match
            if norm_name_s != "NONE" and ((len(norm_name_s)>4 and norm_name_s in norm_name_t) or (len(norm_name_t)>4 and norm_name_t in norm_name_s)):
                match_type = "APPROX"
                if dist is not None and dist < best_dist:
                    best_match = rt
                    best_dist = dist

        if match_type == "EXACT":
            match_exact.append((rs, best_match, best_dist))
            try: unmatched_tgt.remove(best_match)
            except: pass
        elif match_type == "APPROX":
            match_approx.append((rs, best_match, best_dist))
            try: unmatched_tgt.remove(best_match)
            except: pass
        elif match_type == "CONFLICT":
            conflict.append((rs, best_match, best_dist))
            anomalies.append({'type': 'CONFLIT_SPATIAL', 'id': rs.get('id_station'), 'name': name_s, 'dist': best_dist})
            try: unmatched_tgt.remove(best_match)
            except: pass
        else:
            new_items.append(rs)

    orphan = unmatched_tgt # exist in sad but not in sebou_070426
    
    # Check intra-source duplicates
    src_tracker = {}
    for r in rows_src:
        nm = normalize_name(r.get('nom_station'))
        src_tracker[nm] = src_tracker.get(nm, 0) + 1
    
    for nm, c in src_tracker.items():
        if c > 1 and nm != "NONE":
            anomalies.append({'type': 'DOUBLON_SOURCE_NOM', 'name': nm, 'count': c})
            
    # Markdown Report
    md_file = "c:/dev/WQDSS/repo_git/docs/12_lot2_stations_audit_ab.md"
    with open(md_file, "w", encoding="utf-8") as f:
        f.write("# LOT 2 : Audit A/B détaillé — Référentiel Stations\n\n")
        f.write("## 1. Résumé Global\n")
        f.write("- **Base Source Sandbox** : `abh_sebou_070426.public.infra_stations_abhs`\n")
        f.write("- **Base Cible Production** : `abh_sad.infra.stations_mesure`\n")
        f.write(f"- **Volumétrie Source** : {len(rows_src)} stations\n")
        f.write(f"- **Volumétrie Cible** : {len(rows_tgt)} stations\n\n")
        
        f.write("### Synthèse des Correspondances :\n")
        f.write(f"- 🟢 **Match Exact** : {len(match_exact)}\n")
        f.write(f"- 🟡 **Match Approximatif** : {len(match_approx)}\n")
        f.write(f"- 🔵 **Nouveau (À créer)** : {len(new_items)}\n")
        f.write(f"- 🔴 **Conflits spatiaux/nominaux** : {len(conflict)}\n")
        f.write(f"- ⚪ **Orphelins cible (existant dans prod mais pas dans source)** : {len(orphan)}\n\n")
        f.write(f"*(Total anomalies brutes techniques: {len(anomalies)})*\n\n")

        f.write("## 2. Analyse des Clés Métier (Stratégie de Liaison)\n")
        f.write("> **Choix de la clé de mapping identifiée** : La combinaison **NOM NORMALISÉ** + **CODE (ire_station)** s'impose comme clé heuristique, couplée obligatoirement à la **distance géographique** (`< 1000m`).\n")
        f.write("> - *Justification* : L'attribut 'code' n'est pas fiable seul (parfois nul ou sur `ire_precipitation`). Le nom lui-même peut avoir des doublons. Un matching solide validera Soit le Code Soit le Nom, TOUT en vérifiant la distance Haversine pour éviter les usurpations (classées dans Conflit).\n\n")
        
        f.write("## 3. Profil des Anomalies Détectées\n")
        f.write("Les anomalies précises ont été listées (voir Registre des Anomalies 15). Focus sur les grands types:\n")
        distrib = {}
        for a in anomalies: distrib[a['type']] = distrib.get(a['type'], 0) + 1
        for k, v in distrib.items(): f.write(f"- **{k}** : {v} occurrences\n")
        
        f.write("\n## 4. Comparaison Structurelle\n")
        f.write("### Colonnes SOURCE (`infra_stations_abhs`)\n")
        f.write("`id_station`, `code_commune`, `ire_station`, `nom_station`, `type_station`, `code_ressource`, `etat`, `organisme_resp`, `ire_precipitation`, `types_mesures`, `observation`, `coord_x`, `coord_y`, `altitude_z`, `geom`\n\n")
        f.write("### Colonnes CIBLE (`infra.stations_mesure`)\n")
        f.write("`id`, `code_station`, `nom`, `type_station`, `date_mise_service`, `altitude_m`, `organisme_gestionnaire_id`, `commune_id`, `geom`, `actif`\n\n")
        
    print(f"Rapport {md_file} écrit avec succès.")
    
if __name__ == "__main__":
    main()
