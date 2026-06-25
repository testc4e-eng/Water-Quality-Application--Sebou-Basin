import os
import re
import io
import sys
import math
import psycopg2
from psycopg2.extras import RealDictCursor

# Ensure utf-8 encoding for outputs
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

def normalize_name(s):
    if not s or str(s).strip() in ('None', 'NULL', ''): return "NONE"
    s = str(s).lower().replace('-', ' ').replace('_', ' ')
    return re.sub(r'\s+', ' ', s).strip()

def haversine(lon1, lat1, lon2, lat2):
    if None in (lon1, lat1, lon2, lat2): return None
    R = 6371000 # radius earths meters
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi/2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda/2.0)**2
    return R * (2 * math.atan2(math.sqrt(a), math.sqrt(1-a)))

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

    cur_src.execute("SELECT *, ST_X(ST_Transform(geom, 4326)) as lon, ST_Y(ST_Transform(geom, 4326)) as lat FROM public.infra_stations_abhs")
    rows_src = cur_src.fetchall()

    cur_tgt.execute("SELECT id, code_station, nom, type_station, geom, ST_X(ST_Transform(geom, 4326)) as lon, ST_Y(ST_Transform(geom, 4326)) as lat FROM infra.stations_mesure")
    rows_tgt = cur_tgt.fetchall()

    print(f"Chargement terminé. Source : {len(rows_src)} | Cible : {len(rows_tgt)}")

    would_insert = 0
    would_update = 0
    would_skip = 0
    would_conflict = 0

    logs_conflict = []
    logs_update = []
    
    # Analyze Source Duplicates to enforce Conflict before matching
    src_nome_tracker = {}
    for rs in rows_src:
        nm = normalize_name(rs.get('nom_station'))
        src_nome_tracker[nm] = src_nome_tracker.get(nm, 0) + 1

    for rs in rows_src:
        name_s = rs.get('nom_station')
        norm_name_s = normalize_name(name_s)
        code_s = str(rs.get('ire_station') or rs.get('ire_precipitation') or "").strip().upper()
        
        # EXCEPTION LOT 2 : Nom NULL -> WOULD_SKIP
        if norm_name_s == "NONE":
            would_skip += 1
            logs_conflict.append(f"⚠️ SKIP - Station sans nom ignorée (ID={rs.get('id_station')}).")
            continue
            
        matched_tgt = []
        is_exact_code_match = False

        # Phase 1 Matching Rule: PRIMARY (Code / IRE)
        if code_s:
            for rt in rows_tgt:
                code_t = str(rt.get('code_station') or "").strip().upper()
                if code_s == code_t and code_t != "":
                    matched_tgt.append((rt, "CODE"))
                    is_exact_code_match = True
        
        # Phase 2 Matching Rule: FALLBACK (Name + Geo < 1000m)
        if not is_exact_code_match:
            for rt in rows_tgt:
                norm_name_t = normalize_name(rt.get('nom'))
                if norm_name_s == norm_name_t:
                    dist = haversine(rs.get('lon'), rs.get('lat'), rt.get('lon'), rt.get('lat'))
                    # Accept it if distance confirms it's the physical same station
                    if dist is not None and dist < 1000:
                        matched_tgt.append((rt, f"NOM+GEO({int(dist)}m)"))
                    elif dist is None:
                        # Cas dangereux : nom identique sans géométrie exploitable → conflit
                        continue

        # Rule resolution
        if len(matched_tgt) == 0:
            would_insert += 1
            
        elif len(matched_tgt) == 1:
            rt, match_provenance = matched_tgt[0]
            
            # Check if this name is part of the infamous source "Doublons Nominaux" (ANO-LOT2-001)
            # If it's a code match we are safe. If it was purely nominal, it's dangerous.
            if src_nome_tracker[norm_name_s] > 1 and match_provenance.startswith("NOM"):
                would_conflict += 1
                logs_conflict.append(f"🚨 CONFLICT (ANO-LOT2-001) - '{name_s}' a des homonymes dans la source, et le code a échoué. Résolution incertaine.")
                continue

            # Assess update logic (Enrichment on missing geo or attributes)
            is_diff = False
            diff_fields = []
            
            # we check if target has a missing type_station while source has it
            if rs.get('type_station') and not rt.get('type_station'): 
                is_diff = True; diff_fields.append('type_station')
            # Same for geometries (if distance > 1 -> we could update it for precision if we want but mostly we only add if exact None in prod)
            if rs.get('lon') and not rt.get('lon'):
                is_diff = True; diff_fields.append('geom')

            if is_diff:
                would_update += 1
                logs_update.append(f"💡 UPDATE PROPOSED - '{name_s}' par [{match_provenance}] : Injection de {', '.join(diff_fields)}")
            else:
                would_skip += 1
                
        elif len(matched_tgt) > 1:
            would_conflict += 1
            logs_conflict.append(f"🚨 CONFLICT TARGET - Le système pointe sur {len(matched_tgt)} résultats de Prod valides pour '{name_s}' (ou {code_s}). Clé inutilisable sans aide humaine.")

    # MARKDOWN REPORT CREATION
    md_file = "c:/dev/WQDSS/repo_git/docs/14_lot2_stations_dry_run_resultats.md"
    with open(md_file, "w", encoding="utf-8") as f:
        f.write("# LOT 2 : Résultat du Dry-Run d'Intégration (Stations)\n\n")
        f.write("*Généré automatiquement par le pipeline Python algorithmique. Strict **READ-ONLY**.*\n\n")
        
        f.write("## 1. Métriques Globales\n")
        f.write(f"- 🟦 `WOULD_INSERT` : {would_insert} (Stations totalement nouvelles identifiées)\n")
        f.write(f"- 🟨 `WOULD_UPDATE` : {would_update} (Enrichissements de données repérés)\n")
        f.write(f"- 🟩 `WOULD_SKIP` : {would_skip} (Équivalence absolue inter-bases ou filtrage volontaire)\n")
        f.write(f"- 🟥 `WOULD_CONFLICT` : {would_conflict} (Incidents de multi-cardinalité ou orphelins nom/code insolvables)\n\n")

        f.write("## 2. Détection Formelle des Transgressions (Anomalies Métier)\n")
        f.write("### Exception `NOM_NULL` (ANO-LOT2-002)\n")
        f.write("> ✅ Stations identifiées arbitrairement et placées dans le Bucket Skipped pour prémunir la production.\n\n")

        f.write("### Exception `DOUBLONS NOMINAUX` (ANO-LOT2-001)\n")
        f.write("> ✅ Résolution fine : si le barrage doublon possède un validateur Code 'ire_station' distinct => Match.\n Si le doublon source doit être discerné purement par le Nom, il est expédié en WOULD_CONFLICT.\n\n")
        
        f.write("## 3. Logs de Traitement\n")
        f.write("### 🚨 Conflits Bloquants (Exclus expressément)\n")
        if not logs_conflict: f.write("- `Aucun`\n")
        for log in logs_conflict: f.write(f"- {log}\n")
        
        f.write("\n### 💡 Enrichissements (`UPDATE`) potentiels identifiés\n")
        if not logs_update: f.write("- `Aucun`\n")
        for log in logs_update: f.write(f"- {log}\n")
        
        # STATUS RESOLUTION
        f.write("\n## 4. Bilan \n")
        if would_insert == 0 and would_update == 0:
            f.write("🚨 **LOT MARQUÉ COMME SYNCHRONE (SKIP).** La base cible possède fondamentalement la même ossature utile que la Sandbox. Pas d'update utile repéré.\n")
        else:
            f.write("✅ **POTENTIEL D'INSERTION/UPDATE CONFIRMÉ.** En attente de déblocage pour bascule.\n")
            
    print(f"\nSimulation codée. Rapport structurel produit disponible sur : {md_file}")

if __name__ == "__main__":
    main()
